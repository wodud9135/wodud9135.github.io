-- 교회 홈페이지 비주얼 편집기: Supabase SQL Editor에서 전체 실행
-- 이 스크립트는 '메인 페이지 디자인 편집' 데이터만 저장합니다.
-- GitHub Pages/Jekyll 기존 공지·주보·설교 게시판은 그대로 유지됩니다.
-- 실제 관리자 등록은 아래 STEP 2를 사용하세요.

create table if not exists public.church_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.church_drafts (
  page_key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now(),
  constraint church_drafts_page_key_check check (page_key = 'home')
);
create table if not exists public.church_published (
  page_key text primary key,
  content jsonb not null,
  published_at timestamptz not null default now(),
  constraint church_published_page_key_check check (page_key = 'home')
);

alter table public.church_admins enable row level security;
alter table public.church_drafts enable row level security;
alter table public.church_published enable row level security;

-- 반복 실행해도 정책이 충돌하지 않도록 기존 정책 정리
 drop policy if exists "church admins view self" on public.church_admins;
 drop policy if exists "church drafts admin all" on public.church_drafts;
 drop policy if exists "church published public read" on public.church_published;
 drop policy if exists "church published admin write" on public.church_published;
 drop policy if exists "church published admin update" on public.church_published;
 drop policy if exists "church published admin delete" on public.church_published;

create policy "church admins view self" on public.church_admins
  for select to authenticated using (user_id = (select auth.uid()));

create policy "church drafts admin all" on public.church_drafts
  for all to authenticated
  using (exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())))
  with check (exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())));

create policy "church published public read" on public.church_published
  for select to anon, authenticated using (true);
create policy "church published admin write" on public.church_published
  for insert to authenticated
  with check (exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())));
create policy "church published admin update" on public.church_published
  for update to authenticated
  using (exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())))
  with check (exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())));
create policy "church published admin delete" on public.church_published
  for delete to authenticated
  using (exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())));

-- 데이터 접근 권한: 공개 페이지는 읽기만 허용; 수정은 RLS에서 허가한 관리자만
revoke all on public.church_admins from anon;
revoke all on public.church_drafts from anon;
revoke all on public.church_published from anon;
grant select on public.church_admins to authenticated;
grant select, insert, update, delete on public.church_drafts to authenticated;
grant select, insert, update, delete on public.church_published to authenticated;
grant select on public.church_published to anon;

-- 교회 사진 저장소: 게시한 사진은 공개, 업로드·삭제는 관리자만
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('church-media','church-media',true,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update
set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

 drop policy if exists "church media public read" on storage.objects;
 drop policy if exists "church media admin insert" on storage.objects;
 drop policy if exists "church media admin update" on storage.objects;
 drop policy if exists "church media admin delete" on storage.objects;

create policy "church media public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id='church-media');
create policy "church media admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id='church-media' and exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())));
create policy "church media admin update" on storage.objects
  for update to authenticated
  using (bucket_id='church-media' and exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())))
  with check (bucket_id='church-media' and exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())));
create policy "church media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id='church-media' and exists(select 1 from public.church_admins a where a.user_id=(select auth.uid())));

-- STEP 2: Supabase Authentication > Users > Add user에서 관리자 이메일/비밀번호 생성
--         이메일을 확인한 뒤 다음 문장을 별도로 실행 (이메일 직접 입력)
-- insert into public.church_admins(user_id)
-- select id from auth.users where lower(email)=lower('YOUR-ADMIN-EMAIL@example.com')
-- on conflict (user_id) do nothing;
-- 인증을 완료한 관리자에게만 사이트 편집 및 게시 권한이 주어집니다.
