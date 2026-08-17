-- Fix deleting listings that have incomplete checkout orders
-- Run in Supabase SQL Editor → New query → Run

-- Sellers can clear unfinished/cancelled orders on their own items
drop policy if exists "Sellers can delete incomplete orders on their products" on public.orders;

create policy "Sellers can delete incomplete orders on their products"
  on public.orders
  for delete
  using (
    auth.uid() = seller_id
    and status in ('pending_payment', 'cancelled')
  );

-- Make sure sellers can delete their products
drop policy if exists "Users can delete their own products" on public.products;

create policy "Users can delete their own products"
  on public.products
  for delete
  using (auth.uid() = seller_id);

grant delete on table public.orders to authenticated;
grant delete on table public.products to authenticated;
