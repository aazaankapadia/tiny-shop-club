-- Allow buyers to mark their own incomplete orders as paid
-- (only used after our server verifies Stripe payment)
-- Run in Supabase SQL Editor

drop policy if exists "Buyers can mark their pending orders paid" on public.orders;

create policy "Buyers can mark their pending orders paid"
  on public.orders
  for update
  using (auth.uid() = buyer_id and status = 'pending_payment')
  with check (auth.uid() = buyer_id and status in ('pending_payment', 'paid'));
