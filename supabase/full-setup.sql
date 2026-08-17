-- Little Store Club: one-time setup for profiles, orders, permissions
-- Paste into Supabase SQL Editor as a NEW query, then Run

-- 1) Make sure products has location
alter table public.products
  add column if not exists location text not null default '';

-- 2) Profiles (saved buyer delivery address)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  delivery_address text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can read their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3) Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  buyer_id uuid not null references auth.users (id) on delete cascade,
  seller_id uuid not null references auth.users (id) on delete cascade,
  delivery_address text not null,
  status text not null default 'pending_payment',
  stripe_session_id text,
  created_at timestamptz not null default now()
);

alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending_payment', 'paid', 'delivered', 'cancelled'));

alter table public.orders
  add column if not exists stripe_session_id text;

create index if not exists orders_buyer_id_idx on public.orders (buyer_id);
create index if not exists orders_seller_id_idx on public.orders (seller_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

drop policy if exists "Buyers can read their own orders" on public.orders;
drop policy if exists "Sellers can read orders for their products" on public.orders;
drop policy if exists "Buyers can create their own orders" on public.orders;

create policy "Buyers can read their own orders"
  on public.orders for select using (auth.uid() = buyer_id);

create policy "Sellers can read orders for their products"
  on public.orders for select using (auth.uid() = seller_id);

create policy "Buyers can create their own orders"
  on public.orders for insert with check (auth.uid() = buyer_id);

-- 4) Product policies + grants
drop policy if exists "Anyone can read products" on public.products;
drop policy if exists "Users can create their own products" on public.products;
drop policy if exists "Users can update their own products" on public.products;
drop policy if exists "Users can delete their own products" on public.products;

create policy "Anyone can read products"
  on public.products for select using (true);

create policy "Users can create their own products"
  on public.products for insert with check (auth.uid() = seller_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

create policy "Users can delete their own products"
  on public.products for delete using (auth.uid() = seller_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.products to anon, authenticated;
grant select, insert, update, delete on table public.profiles to anon, authenticated;
grant select, insert, update, delete on table public.orders to anon, authenticated;
