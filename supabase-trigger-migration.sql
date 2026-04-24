-- =============================================================================
-- Migration: Auto-create profile on auth.users insert
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This script is idempotent — safe to run multiple times.
-- =============================================================================

-- Step 1: Drop existing trigger and function if they exist (clean re-install)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Step 2: Create (or re-create) the function with SECURITY DEFINER so it can
--         write to public.profiles even with RLS enabled.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url, balance)
  values (
    new.id,
    -- Use provided username metadata, or fall back to the email prefix
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    0.00   -- initialize balance to zero
  )
  -- If a profile row already exists for this user, do nothing (idempotent)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Step 3: Attach the trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Step 4: Back-fill profiles for any existing auth users that don't yet have one.
--         This handles users who signed up before the trigger was in place.
insert into public.profiles (id, username, avatar_url, balance)
select
  au.id,
  coalesce(au.raw_user_meta_data->>'username', split_part(au.email, '@', 1)),
  au.raw_user_meta_data->>'avatar_url',
  0.00
from auth.users au
where not exists (
  select 1 from public.profiles p where p.id = au.id
);

-- =============================================================================
-- Done. Every new sign-up will now automatically get a row in public.profiles
-- with id = auth.users.id and balance = 0.
-- =============================================================================
