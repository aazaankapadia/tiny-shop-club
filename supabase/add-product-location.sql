-- Add meetup / pickup location to products
-- Run this in Supabase → SQL Editor → New query → Run

alter table public.products
  add column if not exists location text not null default '';
