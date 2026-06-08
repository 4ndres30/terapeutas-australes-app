create table if not exists public.revision_hallazgos (
  id_revision_hallazgo uuid primary key default gen_random_uuid(),

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

  revision_aspecto_id uuid not null references public.revision_aspectos(id_revision_aspecto)
    on update cascade
    on delete cascade,

  elemento_caso_id uuid not null references public.elementos_caso(id_elemento_caso)
    on update cascade
    on delete restrict,

  categoria_hallazgo text not null check (
    categoria_hallazgo in (
      'Cuerpo inestable',
      'Bloqueo',
      'Trabajo energético',
      'Magia negra',
      'Entidad/Presencia',
      'Abundancia afectada',
      'Protección debilitada',
      'Vínculo afectado',
      'Linaje afectado',
      'Hogar/Espacio afectado',
      'Información canalizada',
      'Otro'
    )
  ),

  tipo_hallazgo text,
  subtipo_hallazgo text,
  descripcion_hallazgo text not null,

  intensidad_hallazgo_porcentaje integer,
  nivel_bloqueo_porcentaje integer,

  origen_sugerido text,

  fuente_deteccion text not null default 'Radiestesia' check (
    fuente_deteccion in (
      'Radiestesia',
      'Canalización',
      'Radiestesia y canalización',
      'Testimonio',
      'Observación interna',
      'Otro'
    )
  ),

  nivel_confirmacion text not null default 'Detectado' check (
    nivel_confirmacion in (
      'Detectado',
      'Por confirmar',
      'Confirmado',
      'Descartado',
      'Referencial'
    )
  ),

  requiere_seguimiento boolean not null default false,

  prioridad_hallazgo text check (
    prioridad_hallazgo is null or prioridad_hallazgo in (
      'Baja',
      'Media',
      'Alta',
      'Urgente'
    )
  ),

  estado_hallazgo text not null default 'Activo' check (
    estado_hallazgo in (
      'Activo',
      'En observación',
      'Pendiente de trabajo',
      'Cerrado',
      'Descartado'
    )
  ),

  informacion_canalizada text,
  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint revision_hallazgos_intensidad_valida
    check (intensidad_hallazgo_porcentaje is null or intensidad_hallazgo_porcentaje between 0 and 100),

  constraint revision_hallazgos_bloqueo_valido
    check (nivel_bloqueo_porcentaje is null or nivel_bloqueo_porcentaje between 0 and 100)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_revision_hallazgos_updated_at on public.revision_hallazgos;

create trigger set_revision_hallazgos_updated_at
before update on public.revision_hallazgos
for each row
execute function public.set_updated_at();

create or replace function public.validar_revision_hallazgo_relaciones()
returns trigger as $$
declare
  paciente_de_aspecto uuid;
  caso_de_aspecto uuid;
  revision_de_aspecto uuid;
  revision_elemento_de_aspecto uuid;
  elemento_de_aspecto uuid;
begin
  select paciente_id, caso_id, revision_id, revision_elemento_id, elemento_caso_id
  into paciente_de_aspecto, caso_de_aspecto, revision_de_aspecto, revision_elemento_de_aspecto, elemento_de_aspecto
  from public.revision_aspectos
  where id_revision_aspecto = new.revision_aspecto_id;

  if paciente_de_aspecto is null then
    raise exception 'El aspecto de revisión indicado no existe: %', new.revision_aspecto_id;
  end if;

  if new.paciente_id <> paciente_de_aspecto then
    raise exception 'El paciente del hallazgo (%) no coincide con el paciente del aspecto (%)',
      new.paciente_id,
      paciente_de_aspecto;
  end if;

  if new.caso_id <> caso_de_aspecto then
    raise exception 'El caso del hallazgo (%) no coincide con el caso del aspecto (%)',
      new.caso_id,
      caso_de_aspecto;
  end if;

  if new.revision_id <> revision_de_aspecto then
    raise exception 'La revisión del hallazgo (%) no coincide con la revisión del aspecto (%)',
      new.revision_id,
      revision_de_aspecto;
  end if;

  if new.revision_elemento_id <> revision_elemento_de_aspecto then
    raise exception 'El elemento de revisión del hallazgo (%) no coincide con el elemento de revisión del aspecto (%)',
      new.revision_elemento_id,
      revision_elemento_de_aspecto;
  end if;

  if new.elemento_caso_id <> elemento_de_aspecto then
    raise exception 'El elemento del hallazgo (%) no coincide con el elemento del aspecto (%)',
      new.elemento_caso_id,
      elemento_de_aspecto;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_revision_hallazgos_relaciones on public.revision_hallazgos;

create trigger validar_revision_hallazgos_relaciones
before insert or update of paciente_id, caso_id, revision_id, revision_elemento_id, revision_aspecto_id, elemento_caso_id on public.revision_hallazgos
for each row
execute function public.validar_revision_hallazgo_relaciones();

create index if not exists idx_revision_hallazgos_paciente_id
on public.revision_hallazgos(paciente_id);

create index if not exists idx_revision_hallazgos_caso_id
on public.revision_hallazgos(caso_id);

create index if not exists idx_revision_hallazgos_revision_id
on public.revision_hallazgos(revision_id);

create index if not exists idx_revision_hallazgos_revision_elemento_id
on public.revision_hallazgos(revision_elemento_id);

create index if not exists idx_revision_hallazgos_revision_aspecto_id
on public.revision_hallazgos(revision_aspecto_id);

create index if not exists idx_revision_hallazgos_elemento_caso_id
on public.revision_hallazgos(elemento_caso_id);

create index if not exists idx_revision_hallazgos_categoria
on public.revision_hallazgos(categoria_hallazgo);

create index if not exists idx_revision_hallazgos_estado
on public.revision_hallazgos(estado_hallazgo);

create index if not exists idx_revision_hallazgos_prioridad
on public.revision_hallazgos(prioridad_hallazgo);
