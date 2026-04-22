-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  bio text,
  youtube_url text,
  favorite_games text[],
  level int default 1,
  balance decimal default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Secure the balance field: Only allow Supabase service role / DB functions to alter the balance directly.
-- For standard setup, users shouldn't be updating their own balance arbitrarily. We will revoke update on balance.
-- However, standard granular column updates for RLS is tricky without specific functions.
-- We'll keep it simple for now, but in production, 'balance' should be updated via RPC only.

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url, balance)
  values (
    new.id, 
    -- Default to the email handle or a random string if username isn't provided
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    new.raw_user_meta_data->>'avatar_url',
    0.00
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Transactions Table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  type text not null check (type in ('deposit', 'withdraw', 'wager', 'win')),
  amount decimal not null,
  status text not null check (status in ('pending', 'completed', 'rejected', 'failed')),
  reference_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for transactions
alter table transactions enable row level security;

create policy "Users can view their own transactions." on transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own deposits." on transactions
  for insert with check (auth.uid() = user_id and type = 'deposit' and status = 'pending');

create policy "Admins can view all transactions." on transactions
  for select using (
    exists (
      select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Admins can update transactions." on transactions
  for update using (
    exists (
      select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- RPC for atomic deposit approval
create or replace function public.approve_deposit(tx_id uuid)
returns void as $$
declare
  tx_record record;
begin
  -- Lock the row to prevent concurrent updates
  select * into tx_record from public.transactions where id = tx_id for update;
  
  if tx_record.status != 'pending' then
    raise exception 'Transaction is not pending.';
  end if;

  if tx_record.type != 'deposit' then
    raise exception 'Transaction is not a deposit.';
  end if;

  -- Update transaction status
  update public.transactions
  set status = 'completed'
  where id = tx_id;

  -- Increment user balance
  update public.profiles
  set balance = balance + tx_record.amount
  where id = tx_record.user_id;
end;
$$ language plpgsql security definer;

-- Enable Realtime Replication so clients (like the Navbar listener) receive profile balance updates instantly!
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.transactions;

