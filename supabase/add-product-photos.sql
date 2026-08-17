-- Product photos: column + public storage bucket
-- Run in Supabase SQL Editor → New query → Run

alter table public.products
  add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-photos',
  'product-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view product photos" on storage.objects;
create policy "Anyone can view product photos"
  on storage.objects
  for select
  using (bucket_id = 'product-photos');

drop policy if exists "Sellers can upload product photos" on storage.objects;
create policy "Sellers can upload product photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'product-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "Sellers can update their product photos" on storage.objects;
create policy "Sellers can update their product photos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'product-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists "Sellers can delete their product photos" on storage.objects;
create policy "Sellers can delete their product photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'product-photos'
    and split_part(name, '/', 1) = auth.uid()::text
  );
