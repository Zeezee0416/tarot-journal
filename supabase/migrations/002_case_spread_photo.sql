-- Add spread photo path to cases
alter table cases add column if not exists spread_photo_url text default '';

-- Private bucket for user case spread photos
insert into storage.buckets (id, name, public)
values ('case-photos', 'case-photos', false)
on conflict (id) do nothing;

-- RLS: users can only access files in their own folder ({user_id}/...)
drop policy if exists "case_photos_insert" on storage.objects;
create policy "case_photos_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'case-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "case_photos_select" on storage.objects;
create policy "case_photos_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'case-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "case_photos_update" on storage.objects;
create policy "case_photos_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'case-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "case_photos_delete" on storage.objects;
create policy "case_photos_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'case-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
