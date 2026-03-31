-- Ejecutar en Supabase SQL Editor
-- Este script actualiza la tabla 'partidos' para soportar las nuevas funciones premium.

-- 1. Si la tabla no existe, crearla desde cero:
create table if not exists partidos (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  equipo_local text not null,
  equipo_visitante text not null,
  gol_local int default 0,
  gol_visitante int default 0,
  estado text default 'PROXIMO' check (estado in ('PROXIMO','EN-VIVO','FINALIZADO')),
  hora_utc timestamptz,
  canales text[] default '{}', -- Cambiado a Array para soportar múltiples tags
  link_video text,
  link1 text,
  link2 text,
  link3 text,
  img_video text,
  img_og text,
  escudo_local text,
  escudo_visitante text,
  fixture_id int,
  orden int default 0,
  es_destacado boolean default false, -- Nuevo: Para marcar partidos top
  metadata jsonb default '{}', -- Nuevo: Para datos extra (TheSportsDB IDs, etc)
  categoria text default null,
  creado_en timestamptz default now()
);

-- 2. Índices para optimización
create index if not exists idx_partidos_estado on partidos(estado);
create index if not exists idx_partidos_orden on partidos(orden asc);
create index if not exists idx_partidos_destacado on partidos(es_destacado) where es_destacado = true;
create index if not exists idx_partidos_categoria on partidos(categoria);
create index if not exists idx_partidos_creado on partidos(creado_en desc);

-- 3. Seguridad RLS
alter table partidos enable row level security;

-- Política para lectura pública (Visitantes)
create policy "Lectura pública" 
on partidos for select 
using (true);

-- Política para administración total (Panel Admin mediante Service Role)
create policy "Admin full access" 
on partidos 
to service_role
using (true)
with check (true);
