-- Remove unfinished checkout attempts
-- Run in Supabase SQL Editor → New query → Run

delete from public.orders
where status = 'pending_payment';
