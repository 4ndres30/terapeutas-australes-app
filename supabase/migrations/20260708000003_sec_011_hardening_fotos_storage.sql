-- Migration: SEC-011 - Hardening técnico de fotos y Storage
-- Autor: Control de desarrollo
-- Fecha: 2026-07-08

-- 1. Revocar todos los privilegios heredados a public y anon en fotos_elementos_caso
revoke all privileges on table public.fotos_elementos_caso from public;
revoke all privileges on table public.fotos_elementos_caso from anon;

-- Nota: Los privilegios select, insert, update específicos para "authenticated"
-- se mantienen controlados a través de las RLS correspondientes.

-- 2. Asegurar que futuras tablas creadas por defecto no hereden privilegios amplios
alter default privileges in schema public revoke all on tables from public, anon;
alter default privileges in schema public revoke all on functions from public, anon;
alter default privileges in schema public revoke all on sequences from public, anon;

-- 3. Crear vista de diagnóstico para objetos huérfanos en Storage (físicos sin fila de metadato)
create or replace view public.vista_objetos_storage_huerfanos as
select
  o.id as object_id,
  o.name as storage_path,
  o.bucket_id,
  o.created_at as storage_created_at
from storage.objects o
left join public.fotos_elementos_caso f on f.storage_path = o.name
where o.bucket_id = 'elementos-caso'
  and f.id_foto_elemento_caso is null;

comment on view public.vista_objetos_storage_huerfanos is
  'Identifica archivos subidos en storage.objects para el bucket elementos-caso que no cuentan con su fila de metadatos en fotos_elementos_caso.';

-- 4. Crear vista de diagnóstico para metadatos huérfanos (filas sin archivo físico real)
create or replace view public.vista_fotos_metadatos_sin_objeto as
select
  f.id_foto_elemento_caso,
  f.paciente_id,
  f.caso_id,
  f.elemento_caso_id,
  f.storage_path,
  f.created_at as metadata_created_at
from public.fotos_elementos_caso f
left join storage.objects o on o.name = f.storage_path and o.bucket_id = 'elementos-caso'
where o.id is null;

comment on view public.vista_fotos_metadatos_sin_objeto is
  'Identifica filas en fotos_elementos_caso cuya referencia de storage_path no apunta a ningún objeto físico en el bucket elementos-caso.';

-- 5. Activar security_invoker en las vistas para heredar RLS subyacente
alter view public.vista_objetos_storage_huerfanos set (security_invoker = true);
alter view public.vista_fotos_metadatos_sin_objeto set (security_invoker = true);

-- 6. Configurar permisos explícitos en las vistas de diagnóstico (permitido para terapeutas y admin, denegado para anon y finanzas)
revoke all privileges on table public.vista_objetos_storage_huerfanos from public, anon, authenticated;
revoke all privileges on table public.vista_fotos_metadatos_sin_objeto from public, anon, authenticated;

grant select on table public.vista_objetos_storage_huerfanos to authenticated;
grant select on table public.vista_fotos_metadatos_sin_objeto to authenticated;
