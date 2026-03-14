create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sort_order integer not null default 999,
  name text not null,
  location text not null,
  type text not null,
  status text not null,
  summary text not null,
  details text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.projects
add column if not exists sort_order integer not null default 999;

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null check (kind in ('image', 'video')),
  sort_order integer not null default 999,
  storage_path text not null,
  public_url text not null,
  created_at timestamptz not null default now()
);

alter table public.project_media
add column if not exists sort_order integer not null default 999;

create index if not exists projects_created_at_idx on public.projects(created_at desc);
create index if not exists project_media_project_id_idx on public.project_media(project_id);

alter table public.projects enable row level security;
alter table public.project_media enable row level security;

create policy "Public can read projects"
on public.projects
for select
to anon, authenticated
using (true);

create policy "Authenticated can manage projects"
on public.projects
for all
to authenticated
using (true)
with check (true);

create policy "Public can read project media"
on public.project_media
for select
to anon, authenticated
using (true);

create policy "Authenticated can manage project media"
on public.project_media
for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-videos', 'project-videos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Public can read project images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'project-images');

create policy "Authenticated can manage project images"
on storage.objects
for all
to authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

create policy "Public can read project videos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'project-videos');

create policy "Authenticated can manage project videos"
on storage.objects
for all
to authenticated
using (bucket_id = 'project-videos')
with check (bucket_id = 'project-videos');

create policy "Public can read site media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-media');

create policy "Authenticated can manage site media"
on storage.objects
for all
to authenticated
using (bucket_id = 'site-media')
with check (bucket_id = 'site-media');
