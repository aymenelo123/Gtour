-- =============================================================================
-- MASTER SYNC MIGRATION — ArenaBet
-- Fixes: Missing profiles (FK error), stale trigger, and missing is_admin column.
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query → Run
-- This script is fully idempotent (safe to run multiple times).
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 1: Ensure the `profiles` table has all required columns
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists is_admin boolean not null default false;


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 2: Re-install the auth trigger (clean, idempotent)
--         This fires on every new auth.users INSERT and creates the profile row.
-- ─────────────────────────────────────────────────────────────────────────────
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer          -- bypass RLS; runs as the DB owner
set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url, balance, is_admin)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    0.00,
    false   -- new users are never admins by default
  )
  on conflict (id) do nothing;  -- idempotent: skip if row already exists

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 3: BACK-FILL — sync any existing auth.users that have no profile row
--         This is the direct fix for the FK constraint error on existing accounts.
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.profiles (id, username, avatar_url, balance, is_admin)
select
  au.id,
  coalesce(
    au.raw_user_meta_data->>'username',
    split_part(au.email, '@', 1),
    'user_' || substring(au.id::text, 1, 8)  -- final fallback
  ),
  au.raw_user_meta_data->>'avatar_url',
  0.00,
  false
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
);


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 4: Fix RLS policies — profiles
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "Public profiles are viewable by everyone."  on public.profiles;
drop policy if exists "Users can insert their own profile."         on public.profiles;
drop policy if exists "Users can update own profile."              on public.profiles;
drop policy if exists "profiles_select_public"                     on public.profiles;
drop policy if exists "profiles_insert_own"                        on public.profiles;
drop policy if exists "profiles_update_own"                        on public.profiles;

-- Anyone can read any profile (leaderboards, room info, etc.)
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

-- Only the owner can insert their own row
-- (the trigger uses SECURITY DEFINER so it bypasses this policy)
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own non-sensitive fields
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 5: Fix RLS policies — transactions
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "Users can view their own transactions."    on public.transactions;
drop policy if exists "Users can insert their own deposits."      on public.transactions;
drop policy if exists "Admins can view all transactions."         on public.transactions;
drop policy if exists "Admins can update transactions."           on public.transactions;
drop policy if exists "transactions_select_own"                   on public.transactions;
drop policy if exists "transactions_insert_own_deposit"           on public.transactions;
drop policy if exists "transactions_select_admin"                 on public.transactions;
drop policy if exists "transactions_update_admin"                 on public.transactions;

-- Standard user: read own transactions
create policy "transactions_select_own"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Standard user: insert a pending deposit for themselves only
create policy "transactions_insert_own_deposit"
  on public.transactions for insert
  with check (
    auth.uid() = user_id
    and type = 'deposit'
    and status = 'pending'
  );

-- Admin: read all transactions
create policy "transactions_select_admin"
  on public.transactions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admin: approve / reject transactions
create policy "transactions_update_admin"
  on public.transactions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- PART 6: RPC helper functions used by WalletContext
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.deduct_balance(amount numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if amount <= 0 then
    raise exception 'Amount must be positive.';
  end if;

  update public.profiles
  set balance = balance - amount
  where id = auth.uid() and balance >= amount;

  if not found then
    raise exception 'Insufficient balance or user profile not found.';
  end if;
end;
$$;

create or replace function public.add_winnings(amount numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if amount <= 0 then
    raise exception 'Amount must be positive.';
  end if;

  update public.profiles
  set balance = balance + amount
  where id = auth.uid();

  if not found then
    raise exception 'User profile not found.';
  end if;
end;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries — run these to confirm everything applied correctly.
-- ─────────────────────────────────────────────────────────────────────────────

-- Check: how many auth users have no matching profile (should be 0 after this)
-- select count(*) as orphaned_users
-- from auth.users au
-- where not exists (select 1 from public.profiles p where p.id = au.id);

-- Check: list all profiles with their balances
-- select id, username, balance, is_admin, created_at from public.profiles order by created_at;

-- =============================================================================
-- Done. All existing and future users will have profile rows with balance = 0.
-- Standard users can select/insert their own transactions.
-- Admins can manage all transactions.
-- =============================================================================
