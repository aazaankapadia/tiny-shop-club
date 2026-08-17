-- Let buyers update their own orders (cancel / mark delivered)
-- Run in Supabase SQL Editor → New query → Run

drop policy if exists "Buyers can mark their pending orders paid" on public.orders;
drop policy if exists "Buyers can update their orders" on public.orders;

create policy "Buyers can update their orders"
  on public.orders
  for update
  using (auth.uid() = buyer_id)
  with check (auth.uid() = buyer_id);
