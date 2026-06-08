create table if not exists public.revisiones (
  id_revision uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  consulta_id uuid references public.consultas(id_consulta)
    on update cascade
    on delete restrict,

  evaluacion_id uuid references public.evaluaciones(id_evaluacion)
    on update cascade
    on delete restrict,

  fecha_revision date not null default current_date,
  hora_inicio time,
  hora_termino time,

  numero_revision integer not null,

  tipo_revision text not null check (
    tipo_revision in (
      'Inicial',
      'Seguimiento',
      'Profundización',
      'Control',
      'Cierre',
      'Urgencia',
      'Interna',
      'Otro'
    )
  ),

  modalidad text not null check (
    modalidad in (
      'Presencial',
      'Online',
      'WhatsApp',
      'Llamada telefónica',
      'Videollamada',
      'Interna'
    )
  ),

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

  alcance_revision text not null check (
    alcance_revision in (
      'Caso completo',
      'Elementos seleccionados',
      'Seguimiento de pendientes',
      'Cierre general'
    )
  ),

  objetivo_revision text not null,
  resumen_general text,
  resultado_general text,

  requiere_seguimiento boolean not null default false,
  proxima_accion text,

  estado_revision text not null default 'Pendiente' check (
    estado_revision in (
      'Pendiente',
      'En proceso',
      'Completada',
      'Requiere seguimiento',
      'Anulada'
    )
  ),

  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint revisiones_numero_revision_valido
    check (numero_revision > 0),

  constraint revisiones_horario_valido
    check (hora_inicio is null or hora_termino is null or hora_termino >= hora_inicio),

  constraint revisiones_numero_unico_por_caso
    unique (caso_id, numero_revision)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_revisiones_updated_at on public.revisiones;

create trigger set_revisiones_updated_at
before update on public.revisiones
for each row
execute function public.set_updated_at();

create or replace function public.validar_revision_relaciones()
returns trigger as $$
declare
  paciente_del_caso uuid;
  paciente_de_consulta uuid;
  paciente_de_evaluacion uuid;
begin
  select paciente_id
  into paciente_del_caso
  from public.casos
  where id_caso = new.caso_id;

  if paciente_del_caso is null then
    raise exception 'El caso indicado no existe: %', new.caso_id;
  end if;

  if new.paciente_id <> paciente_del_caso then
    raise exception 'El paciente de la revisión (%) no coincide con el paciente del caso (%)',
      new.paciente_id,
      paciente_del_caso;
  end if;

  if new.consulta_id is not null then
    select paciente_id
    into paciente_de_consulta
    from public.consultas
    where id_consulta = new.consulta_id;

    if paciente_de_consulta is null then
      raise exception 'La consulta indicada no existe: %', new.consulta_id;
    end if;

    if new.paciente_id <> paciente_de_consulta then
      raise exception 'El paciente de la revisión (%) no coincide con el paciente de la consulta (%)',
        new.paciente_id,
        paciente_de_consulta;
    end if;
  end if;

  if new.evaluacion_id is not null then
    select paciente_id
    into paciente_de_evaluacion
    from public.evaluaciones
    where id_evaluacion = new.evaluacion_id;

    if paciente_de_evaluacion is null then
      raise exception 'La evaluación indicada no existe: %', new.evaluacion_id;
    end if;

    if new.paciente_id <> paciente_de_evaluacion then
      raise exception 'El paciente de la revisión (%) no coincide con el paciente de la evaluación (%)',
        new.paciente_id,
        paciente_de_evaluacion;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_revisiones_relaciones on public.revisiones;

create trigger validar_revisiones_relaciones
before insert or update of paciente_id, caso_id, consulta_id, evaluacion_id on public.revisiones
for each row
execute function public.validar_revision_relaciones();

create index if not exists idx_revisiones_paciente_id
on public.revisiones(paciente_id);

create index if not exists idx_revisiones_caso_id
on public.revisiones(caso_id);

create index if not exists idx_revisiones_consulta_id
on public.revisiones(consulta_id);

create index if not exists idx_revisiones_evaluacion_id
on public.revisiones(evaluacion_id);

create index if not exists idx_revisiones_fecha_revision
on public.revisiones(fecha_revision);

create index if not exists idx_revisiones_estado_revision
on public.revisiones(estado_revision);

create index if not exists idx_revisiones_tipo_revision
on public.revisiones(tipo_revision);
