-- Buyer delivery addresses + simple orders (door delivery)
-- Run in Supabase → SQL Editor → New query → Run

-- Saved delivery address per user (asked once, reused on later buys)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  delivery_address text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Orders: buyer buys an item, we deliver to their door
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references auth.users (id) on delete cascade,
  delivery_address text not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'delivered', 'cancelled')),
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create index if not exists orders_buyer_id_idx on public.orders (buyer_id);
create index if not exists orders_seller_id_idx on public.orders (seller_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Buyers see their own orders
create policy "Buyers can read their own orders"
  on public.orders
  for select
  using (auth.uid() = buyer_id);

-- Sellers see orders for their items
create policy "Sellers can read orders for their products"
  on public.orders
  for select
  using (auth.uid() = seller_id);

-- Logged-in buyers can place orders for themselves
create policy "Buyers can create their own orders"
  on public.orders
  for insert
  with check (auth.uid() = buyer_id);
