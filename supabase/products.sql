-- Phase 2: products table for Little Store Club
-- Run this in Supabase → SQL Editor → New query → Run

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  location text not null default '',
  price_cents integer not null check (price_cents >= 0),
  created_at timestamptz not null default now()
);

create index if not exists products_created_at_idx
  on public.products (created_at desc);

create index if not exists products_seller_id_idx
  on public.products (seller_id);

alter table public.products enable row level security;

-- Anyone can browse products
create policy "Anyone can read products"
  on public.products
  for select
  using (true);

-- Logged-in users can list items as themselves
create policy "Users can create their own products"
  on public.products
  for insert
  with check (auth.uid() = seller_id);

-- Sellers can edit their own items
create policy "Users can update their own products"
  on public.products
  for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

-- Sellers can remove their own items
create policy "Users can delete their own products"
  on public.products
  for delete
  using (auth.uid() = seller_id);
