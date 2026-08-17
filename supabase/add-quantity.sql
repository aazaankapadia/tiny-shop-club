-- Add stock quantity + safe stock reduction
-- Run in Supabase SQL Editor → New query → Run

alter table public.products
  add column if not exists quantity integer not null default 1;

alter table public.products
  drop constraint if exists products_quantity_check;

alter table public.products
  add constraint products_quantity_check check (quantity >= 0);

alter table public.orders
  add column if not exists quantity integer not null default 1;

alter table public.orders
  drop constraint if exists orders_quantity_check;

alter table public.orders
  add constraint orders_quantity_check check (quantity > 0);

-- Buyers can reduce stock after paying (secure function)
create or replace function public.reduce_product_stock(
  p_product_id uuid,
  p_qty integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  if p_qty is null or p_qty <= 0 then
    return null;
  end if;

  update public.products
  set quantity = greatest(0, quantity - p_qty)
  where id = p_product_id
  returning quantity into remaining;

  if remaining = 0 then
    begin
      delete from public.products
      where id = p_product_id
        and quantity = 0;
    exception
      when foreign_key_violation then
        -- Paid orders still reference this product, so keep it at 0 (hidden from shop)
        null;
    end;
  end if;

  return coalesce(remaining, 0);
end;
$$;

grant execute on function public.reduce_product_stock(uuid, integer) to authenticated;
