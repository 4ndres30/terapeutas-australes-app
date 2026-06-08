create table if not exists public.revision_elementos (
  id_revision_elemento uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  revision_id uuid not null references public.revisiones(id_revision)
    on update cascade
    on delete cascade,

  elemento_caso_id uuid not null references public.elementos_caso(id_elemento_caso)
    on update cascade
    on delete restrict,

  orden_revision integer,

  prioridad_revision text not null default 'Media' check (
    prioridad_revision in (
      'Baja',
      'Media',
      'Alta',
      'Urgente'
    )
  ),

  estado_revision_elemento text not null default 'Pendiente' check (
    estado_revision_elemento in (
      'Pendiente',
      'En revisión',
      'Revisado',
      'Revisado parcialmente',
      'No revisado',
      'Requiere seguimiento',
      'No aplica'
    )
  ),

  requiere_seguimiento boolean not null default false,
  motivo_pendiente text,
  resumen_elemento text,
  proxima_accion_elemento text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint revision_elementos_orden_valido
    check (orden_revision is null or orden_revision > 0),

  constraint revision_elementos_elemento_unico_por_revision
    unique (revision_id, elemento_caso_id)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_revision_elementos_updated_at on public.revision_elementos;

create trigger set_revision_elementos_updated_at
before update on public.revision_elementos
for each row
execute function public.set_updated_at();

create or replace function public.validar_revision_elemento_relaciones()
returns trigger as $$
declare
  paciente_de_revision uuid;
  caso_de_revision uuid;
  paciente_de_elemento uuid;
  caso_de_elemento uuid;
begin
  select paciente_id, caso_id
  into paciente_de_revision, caso_de_revision
  from public.revisiones
  where id_revision = new.revision_id;

  if paciente_de_revision is null then
    raise exception 'La revisión indicada no existe: %', new.revision_id;
  end if;

  if new.paciente_id <> paciente_de_revision then
    raise exception 'El paciente del elemento de revisión (%) no coincide con el paciente de la revisión (%)',
      new.paciente_id,
      paciente_de_revision;
  end if;

  if new.caso_id <> caso_de_revision then
    raise exception 'El caso del elemento de revisión (%) no coincide con el caso de la revisión (%)',
      new.caso_id,
      caso_de_revision;
  end if;

  select paciente_id, caso_id
  into paciente_de_elemento, caso_de_elemento
  from public.elementos_caso
  where id_elemento_caso = new.elemento_caso_id;

  if paciente_de_elemento is null then
    raise exception 'El elemento del caso indicado no existe: %', new.elemento_caso_id;
  end if;

  if new.paciente_id <> paciente_de_elemento then
    raise exception 'El paciente del elemento de revisión (%) no coincide con el paciente del elemento del caso (%)',
      new.paciente_id,
      paciente_de_elemento;
  end if;

  if new.caso_id <> caso_de_elemento then
    raise exception 'El caso del elemento de revisión (%) no coincide con el caso del elemento (%)',
      new.caso_id,
      caso_de_elemento;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_revision_elementos_relaciones on public.revision_elementos;

create trigger validar_revision_elementos_relaciones
before insert or update of paciente_id, caso_id, revision_id, elemento_caso_id on public.revision_elementos
for each row
execute function public.validar_revision_elemento_relaciones();

create index if not exists idx_revision_elementos_paciente_id
on public.revision_elementos(paciente_id);

create index if not exists idx_revision_elementos_caso_id
on public.revision_elementos(caso_id);

create index if not exists idx_revision_elementos_revision_id
on public.revision_elementos(revision_id);

create index if not exists idx_revision_elementos_elemento_caso_id
on public.revision_elementos(elemento_caso_id);

create index if not exists idx_revision_elementos_estado
on public.revision_elementos(estado_revision_elemento);

create index if not exists idx_revision_elementos_prioridad
on public.revision_elementos(prioridad_revision);

create index if not exists idx_revision_elementos_revision_orden
on public.revision_elementos(revision_id, orden_revision);
