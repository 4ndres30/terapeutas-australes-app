create table if not exists public.revision_aspectos (
  id_revision_aspecto uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  revision_id uuid not null references public.revisiones(id_revision)
    on update cascade
    on delete cascade,

  revision_elemento_id uuid not null references public.revision_elementos(id_revision_elemento)
    on update cascade
    on delete cascade,

  elemento_caso_id uuid not null references public.elementos_caso(id_elemento_caso)
    on update cascade
    on delete restrict,

  orden_aspecto integer,

  area_revision text not null check (
    area_revision in (
      'Persona/Involucrado',
      'Hogar/Espacio',
      'Negocio/Lugar',
      'Objeto',
      'Vínculo',
      'Linaje',
      'Cuerpo físico',
      'Cuerpo energético',
      'Cuerpo emocional',
      'Cuerpo mental',
      'Cuerpo espiritual',
      'Campo energético',
      'Entidad/Presencia',
      'Trabajo/Bloqueo',
      'Protección',
      'Abundancia',
      'Otro'
    )
  ),

  aspecto_revisado text not null,

  metodo_revision text not null default 'Radiestesia' check (
    metodo_revision in (
      'Radiestesia',
      'Canalización',
      'Radiestesia y canalización',
      'Tarot',
      'Observación interna',
      'Mixta',
      'Otro'
    )
  ),

  tipo_medicion text not null check (
    tipo_medicion in (
      'Porcentaje',
      'Sí/No',
      'Clasificación',
      'Texto/Canalización',
      'Mixto',
      'No aplica'
    )
  ),

  metrica_revision text check (
    metrica_revision is null or metrica_revision in (
      'Estabilidad',
      'Bloqueo',
      'Presencia',
      'Abundancia',
      'Protección',
      'Intensidad',
      'Estado general',
      'Otro'
    )
  ),

  valor_porcentaje integer,
  presencia_detectada boolean,
  tipo_detectado text,

  estado_revision_aspecto text not null default 'Pendiente' check (
    estado_revision_aspecto in (
      'Pendiente',
      'En revisión',
      'Revisado',
      'Revisado parcialmente',
      'No revisado',
      'No aplica',
      'Requiere seguimiento'
    )
  ),

  resultado_aspecto text,
  requiere_seguimiento boolean not null default false,
  pendiente_revision boolean not null default false,
  motivo_pendiente text,
  informacion_canalizada text,
  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint revision_aspectos_orden_valido
    check (orden_aspecto is null or orden_aspecto > 0),

  constraint revision_aspectos_porcentaje_valido
    check (valor_porcentaje is null or valor_porcentaje between 0 and 100)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_revision_aspectos_updated_at on public.revision_aspectos;

create trigger set_revision_aspectos_updated_at
before update on public.revision_aspectos
for each row
execute function public.set_updated_at();

create or replace function public.validar_revision_aspecto_relaciones()
returns trigger as $$
declare
  paciente_de_revision_elemento uuid;
  caso_de_revision_elemento uuid;
  revision_de_revision_elemento uuid;
  elemento_de_revision_elemento uuid;
begin
  select paciente_id, caso_id, revision_id, elemento_caso_id
  into paciente_de_revision_elemento, caso_de_revision_elemento, revision_de_revision_elemento, elemento_de_revision_elemento
  from public.revision_elementos
  where id_revision_elemento = new.revision_elemento_id;

  if paciente_de_revision_elemento is null then
    raise exception 'El elemento de revisión indicado no existe: %', new.revision_elemento_id;
  end if;

  if new.paciente_id <> paciente_de_revision_elemento then
    raise exception 'El paciente del aspecto (%) no coincide con el paciente del elemento de revisión (%)',
      new.paciente_id,
      paciente_de_revision_elemento;
  end if;

  if new.caso_id <> caso_de_revision_elemento then
    raise exception 'El caso del aspecto (%) no coincide con el caso del elemento de revisión (%)',
      new.caso_id,
      caso_de_revision_elemento;
  end if;

  if new.revision_id <> revision_de_revision_elemento then
    raise exception 'La revisión del aspecto (%) no coincide con la revisión del elemento (%)',
      new.revision_id,
      revision_de_revision_elemento;
  end if;

  if new.elemento_caso_id <> elemento_de_revision_elemento then
    raise exception 'El elemento del aspecto (%) no coincide con el elemento de revisión (%)',
      new.elemento_caso_id,
      elemento_de_revision_elemento;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_revision_aspectos_relaciones on public.revision_aspectos;

create trigger validar_revision_aspectos_relaciones
before insert or update of paciente_id, caso_id, revision_id, revision_elemento_id, elemento_caso_id on public.revision_aspectos
for each row
execute function public.validar_revision_aspecto_relaciones();

create index if not exists idx_revision_aspectos_paciente_id
on public.revision_aspectos(paciente_id);

create index if not exists idx_revision_aspectos_caso_id
on public.revision_aspectos(caso_id);

create index if not exists idx_revision_aspectos_revision_id
on public.revision_aspectos(revision_id);

create index if not exists idx_revision_aspectos_revision_elemento_id
on public.revision_aspectos(revision_elemento_id);

create index if not exists idx_revision_aspectos_elemento_caso_id
on public.revision_aspectos(elemento_caso_id);

create index if not exists idx_revision_aspectos_area_revision
on public.revision_aspectos(area_revision);

create index if not exists idx_revision_aspectos_estado
on public.revision_aspectos(estado_revision_aspecto);

create index if not exists idx_revision_aspectos_revision_elemento_orden
on public.revision_aspectos(revision_elemento_id, orden_aspecto);
