-- Hizmetlere çoklu görsel desteği ve "Öncesi/Sonrası" bölümünü admin'e
-- bağlamak için şema değişiklikleri. Bu dosyayı Supabase Dashboard ->
-- SQL Editor'de çalıştırın.

-- Hizmetler: tekil "image" yerine sıralı bir galeri dizisi.
alter table services add column if not exists images text[] not null default '{}';

-- Mevcut tekil görseli yeni diziye taşı (idempotent: images zaten doluysa dokunmaz).
update services
set images = array[image]
where image <> '' and images = '{}';

-- Ana sayfadaki "Öncesi / Sonrası" bölümü artık admin panelinden yönetiliyor.
create table if not exists before_after_items (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  before_image text not null default '',
  after_image text not null default '',
  position integer not null default 0
);

alter table before_after_items enable row level security;
