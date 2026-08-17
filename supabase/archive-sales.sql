-- Let sellers archive (and unarchive) their own sales on the dashboard
-- Run in Supabase SQL Editor → New query → Run

alter table public.orders
  add column if not exists archived_at timestamptz;

create index if not exists orders_seller_archived_at_idx
  on public.orders (seller_id, archived_at);

drop policy if exists "Sellers can archive their sales" on public.orders;

create policy "Sellers can archive their sales"
  on public.orders
  for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

grant update on table public.orders to authenticated;
