-- Update orders for Stripe test payments
-- Run in Supabase → SQL Editor → New query → Run

alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in ('pending_payment', 'paid', 'delivered', 'cancelled'));

alter table public.orders
  add column if not exists stripe_session_id text;

create unique index if not exists orders_stripe_session_id_idx
  on public.orders (stripe_session_id)
  where stripe_session_id is not null;
