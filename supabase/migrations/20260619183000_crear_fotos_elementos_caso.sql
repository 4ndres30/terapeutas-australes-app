insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'elementos-caso',
  'elementos-caso',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on column public.elementos_caso.foto_url is
  'Deprecada para uso operativo principal. Las fotos de elementos del caso se gestionan mediante storage privado y public.fotos_elementos_caso.';

create table if not exists public.fotos_elementos_caso (
  id_foto_elemento_caso uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  elemento_caso_id uuid not null references public.elementos_caso(id_elemento_caso)
    on update cascade
    on delete cascade,

  bucket_id text not null default 'elementos-caso',
  storage_path text not null,
  nombre_archivo text not null,
  mime_type text not null,
  tamano_bytes bigint,
  descripcion text,
  tipo_foto text not null default 'Referencia',
  es_principal boolean not null default false,
  estado_foto text not null default 'Activa',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fotos_elementos_caso_bucket_valido
    check (bucket_id = 'elementos-caso'),

  constraint fotos_elementos_caso_storage_path_requerido
    check (storage_path <> ''),

  constraint fotos_elementos_caso_nombre_archivo_requerido
    check (nombre_archivo <> ''),

  constraint fotos_elementos_caso_mime_type_valido
    check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),

  constraint fotos_elementos_caso_tamano_valido
    check (tamano_bytes is null or tamano_bytes > 0),

  constraint fotos_elementos_caso_tipo_valido
    check (tipo_foto in ('Principal', 'Referencia', 'Evidencia', 'Antes', 'Después', 'Seguimiento', 'Otro')),

  constraint fotos_elementos_caso_estado_valido
    check (estado_foto in ('Activa', 'Archivada', 'Descartada')),

  constraint fotos_elementos_caso_storage_path_unico
    unique (storage_path)
);

drop trigger if exists set_fotos_elementos_caso_updated_at on public.fotos_elementos_caso;

create trigger set_fotos_elementos_caso_updated_at
before update on public.fotos_elementos_caso
for each row
execute function public.set_updated_at();

create or replace function public.validar_foto_elemento_caso()
returns trigger as $$
declare
  paciente_del_caso uuid;
  paciente_del_elemento uuid;
  caso_del_elemento uuid;
begin
  select paciente_id
  into paciente_del_caso
  from public.casos
  where id_caso = new.caso_id;

  if paciente_del_caso is null then
    raise exception 'El caso indicado no existe: %', new.caso_id;
  end if;

  if new.paciente_id <> paciente_del_caso then
    raise exception 'El paciente de la foto (%) no coincide con el paciente del caso (%)',
      new.paciente_id,
      paciente_del_caso;
  end if;

  select paciente_id, caso_id
  into paciente_del_elemento, caso_del_elemento
  from public.elementos_caso
  where id_elemento_caso = new.elemento_caso_id;

  if paciente_del_elemento is null then
    raise exception 'El elemento del caso indicado no existe: %', new.elemento_caso_id;
  end if;

  if new.paciente_id <> paciente_del_elemento or new.caso_id <> caso_del_elemento then
    raise exception 'El elemento del caso no pertenece al mismo paciente y caso de la foto';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_fotos_elementos_caso_relaciones on public.fotos_elementos_caso;

create trigger validar_fotos_elementos_caso_relaciones
before insert or update of paciente_id, caso_id, elemento_caso_id on public.fotos_elementos_caso
for each row
execute function public.validar_foto_elemento_caso();

create index if not exists idx_fotos_elementos_caso_paciente_id
on public.fotos_elementos_caso(paciente_id);

create index if not exists idx_fotos_elementos_caso_caso_id
on public.fotos_elementos_caso(caso_id);

create index if not exists idx_fotos_elementos_caso_elemento_caso_id
on public.fotos_elementos_caso(elemento_caso_id);

create index if not exists idx_fotos_elementos_caso_estado
on public.fotos_elementos_caso(estado_foto);

create index if not exists idx_fotos_elementos_caso_principal
on public.fotos_elementos_caso(es_principal);

create index if not exists idx_fotos_elementos_caso_elemento_created_at
on public.fotos_elementos_caso(caso_id, elemento_caso_id, created_at);

alter table public.fotos_elementos_caso enable row level security;

grant select, insert, update on table public.fotos_elementos_caso to authenticated;

drop policy if exists fotos_elementos_caso_select_clinica on public.fotos_elementos_caso;
drop policy if exists fotos_elementos_caso_insert_clinica on public.fotos_elementos_caso;
drop policy if exists fotos_elementos_caso_update_clinica on public.fotos_elementos_caso;

create policy fotos_elementos_caso_select_clinica
on public.fotos_elementos_caso
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy fotos_elementos_caso_insert_clinica
on public.fotos_elementos_caso
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy fotos_elementos_caso_update_clinica
on public.fotos_elementos_caso
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists storage_elementos_caso_select_clinica on storage.objects;
drop policy if exists storage_elementos_caso_insert_clinica on storage.objects;
drop policy if exists storage_elementos_caso_update_clinica on storage.objects;

create policy storage_elementos_caso_select_clinica
on storage.objects
for select
to authenticated
using (
  bucket_id = 'elementos-caso'
  and public.es_terapeuta_o_admin()
);

create policy storage_elementos_caso_insert_clinica
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'elementos-caso'
  and public.es_terapeuta_o_admin()
);

create policy storage_elementos_caso_update_clinica
on storage.objects
for update
to authenticated
using (
  bucket_id = 'elementos-caso'
  and public.es_terapeuta_o_admin()
)
with check (
  bucket_id = 'elementos-caso'
  and public.es_terapeuta_o_admin()
);
