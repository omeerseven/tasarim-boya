-- Tasarım Boya: dosya tabanlı veriyi (data/*.json) Supabase'e taşımak için
-- ilk şema. Bu dosyayı Supabase Dashboard -> SQL Editor'de çalıştırın.

create extension if not exists pgcrypto;

-- =========================================================
-- Tekil (singleton) ayar tabloları — her biri her zaman tam 1 satır içerir
-- =========================================================

create table if not exists branding (
  id smallint primary key default 1 check (id = 1),
  logo_url text not null default '/tasarim-boya-mark.png',
  updated_at timestamptz not null default now()
);

create table if not exists contact_info (
  id smallint primary key default 1 check (id = 1),
  phone_display text not null default '',
  phone_href text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  address text not null default '',
  working_hours text not null default '',
  map_embed_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists hero (
  id smallint primary key default 1 check (id = 1),
  badge text not null default '',
  title text not null default '',
  description text not null default '',
  cta_primary_label text not null default '',
  cta_primary_href text not null default '',
  cta_secondary_label text not null default '',
  cta_secondary_href text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists about (
  id smallint primary key default 1 check (id = 1),
  hero_title text not null default '',
  hero_description text not null default '',
  hero_image text not null default '',
  story_title text not null default '',
  story_paragraphs text[] not null default '{}',
  story_image text not null default '',
  vision text not null default '',
  mission text not null default '',
  updated_at timestamptz not null default now()
);

-- Admin girişi: tek satır, sabit varsayılan şifre mantığı uygulama
-- kodunda kalır (src/lib/admin-auth.ts) — bu tablo sadece gerçek
-- hesap kurulduğunda (veya değiştirildiğinde) dolar.
create table if not exists admin_auth (
  id smallint primary key default 1 check (id = 1),
  password_hash text not null,
  password_salt text not null,
  security_question text not null default '',
  answer_hash text not null default '',
  answer_salt text not null default '',
  session_secret text not null,
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Sıralı liste tabloları — "position" orijinal JSON dizisindeki sırayı korur
-- =========================================================

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  alt text not null default '',
  position integer not null default 0
);

create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  position integer not null default 0
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  position integer not null default 0
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  long_description text[] not null default '{}',
  features text[] not null default '{}',
  image text not null default '',
  position integer not null default 0
);

create table if not exists about_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  position integer not null default 0
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  image text not null default '',
  position integer not null default 0
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text[] not null default '{}',
  category text not null default '',
  post_date text not null default '',
  read_time text not null default '',
  image text not null default '',
  author text not null default '',
  position integer not null default 0
);

create table if not exists nav_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  position integer not null default 0
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  name text not null default '',
  uploaded_at timestamptz not null default now()
);

-- =========================================================
-- Teklif / iletişim formu kayıtları
-- =========================================================

create table if not exists leads (
  id text primary key,
  type text not null check (type in ('quote', 'contact')),
  name text not null,
  phone text not null default '',
  email text not null default '',
  service text,
  message text not null default '',
  status text not null default 'yeni' check (status in ('yeni', 'iletisime-gecildi', 'tamamlandi')),
  created_at timestamptz not null default now()
);

-- =========================================================
-- Row Level Security: her tabloda RLS açık, hiç policy yok.
-- Uygulama bu tablolara SADECE sunucu tarafında service_role key ile
-- erişiyor (service_role RLS'i tamamen bypass eder); anon/public
-- erişim bu şekilde tamamen kapalı kalıyor.
-- =========================================================

alter table branding enable row level security;
alter table contact_info enable row level security;
alter table hero enable row level security;
alter table about enable row level security;
alter table admin_auth enable row level security;
alter table hero_slides enable row level security;
alter table stats enable row level security;
alter table faqs enable row level security;
alter table services enable row level security;
alter table about_values enable row level security;
alter table team_members enable row level security;
alter table blog_posts enable row level security;
alter table nav_links enable row level security;
alter table media enable row level security;
alter table leads enable row level security;

-- Singleton satırları önceden oluştur, uygulama hep UPDATE ... WHERE id = 1
-- yapabilsin ("satır yok" durumunu ayrıca ele almaya gerek kalmasın.
insert into branding (id) values (1) on conflict (id) do nothing;
insert into contact_info (id) values (1) on conflict (id) do nothing;
insert into hero (id) values (1) on conflict (id) do nothing;
insert into about (id) values (1) on conflict (id) do nothing;
