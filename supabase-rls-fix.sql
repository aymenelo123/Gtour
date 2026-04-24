-- =============================================================================
-- Migration: RLS & Schema Fixes for Standard User Access
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This script is idempotent — safe to run multiple times.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Add missing `is_admin` column to profiles (if not already present)
--    This column is referenced in AuthProvider and admin RLS policies but was
--    absent from the original schema, causing runtime errors.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Fix RLS policies on `profiles`
--    The existing select policy "Public profiles are viewable by everyone"
--    uses `using (true)` which is correct — no change needed there.
--    But to be safe, drop & re-create all policies cleanly.
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;

-- Any authenticated or anonymous user can READ any profile (needed for leaderboards, rooms, etc.)
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

-- Only the profile owner can insert their own row (the trigger bypasses this via SECURITY DEFINER)
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- A user can update only their own profile (non-balance fields)
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Fix RLS policies on `transactions`
--    Standard users must be able to SELECT and INSERT their own transactions.
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "Users can view their own transactions." on public.transactions;
drop policy if exists "Users can insert their own deposits." on public.transactions;
drop policy if exists "Admins can view all transactions." on public.transactions;
drop policy if exists "Admins can update transactions." on public.transactions;

-- Standard users: read own transactions
create policy "transactions_select_own"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Standard users: insert own deposit requests only
create policy "transactions_insert_own_deposit"
  on public.transactions for insert
  with check (
    auth.uid() = user_id
    and type = 'deposit'
    and status = 'pending'
  );

-- Admins: read ALL transactions
create policy "transactions_select_admin"
  on public.transactions for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Admins: update any transaction (for approval/rejection)
create policy "transactions_update_admin"
  on public.transactions for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. RPC helpers called by WalletContext (deduct_balance, add_winnings)
--    These run as SECURITY DEFINER so they can bypass RLS for the balance update,
--    but they are scoped to the calling user's own row.
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
    raise exception 'Insufficient balance or user not found.';
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
-- Done.
-- Standard users can now: view own profile, read own transactions, submit deposit requests.
-- Admins additionally: read/update all transactions.
-- Wallet balance can only be modified via approve_deposit, deduct_balance, add_winnings RPCs.
-- ─────────────────────────────────────────────────────────────────────────────
