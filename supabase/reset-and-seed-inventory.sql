-- Reset marketplace data and seed household test inventory.
-- Run in Supabase → SQL Editor → New query → Run
-- Keeps auth users and saved delivery profiles.

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.products to anon, authenticated, service_role;
grant select, insert, update, delete on table public.orders to anon, authenticated, service_role;
grant select, insert, update, delete on table public.profiles to anon, authenticated, service_role;

truncate table public.orders restart identity;
delete from public.products;

insert into public.products (
  seller_id,
  title,
  description,
  location,
  price_cents,
  quantity
)
select
  coalesce(
    (select id from auth.users where email = 'aazaankapadia@gmail.com' limit 1),
    (select id from auth.users order by created_at asc limit 1)
  ),
  seed.title,
  seed.description,
  'Tiny Shop Club pantry',
  seed.price_cents,
  seed.quantity
from (
  values
    (
      'Scotch-Brite Sponges (6-pack)',
      'Scotch-Brite sponges, sold as a 6-pack.',
      499,
      6
    ),
    (
      'Softsoap Hand Soap',
      'Softsoap pump bottle for the sink.',
      299,
      6
    ),
    (
      'Dawn Dish Soap (5.8 oz)',
      'Small Dawn bottle, 5.8 oz — easy to carry.',
      199,
      6
    ),
    (
      'Ziploc Sandwich Bags',
      'Ziploc sandwich bags.',
      349,
      6
    ),
    (
      'Small Trash Bags',
      'Small trash bags for bathroom or bedroom bins.',
      399,
      6
    )
) as seed(title, description, price_cents, quantity);
