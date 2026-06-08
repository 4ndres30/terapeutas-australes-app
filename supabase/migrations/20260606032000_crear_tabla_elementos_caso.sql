create table if not exists public.elementos_caso (
  id_elemento_caso uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  tipo_elemento text not null check (
    tipo_elemento in (
      'Persona',
      'Hogar',
      'Negocio',
      'Lugar',
      'Objeto',
      'Mascota/Animal',
      'Organización',
      'Otro'
    )
  ),

  nombre_elemento text not null,
  vinculo_con_paciente text,

  rol_en_caso text not null check (
    rol_en_caso in (
      'Consultante',
      'Foco principal',
      'Involucrado directo',
      'Involucrado secundario',
      'Elemento de contexto',
      'Posible origen',
      'Posible afectado',
      'Elemento en observación'
    )
  ),

  prioridad_elemento text not null default 'Media' check (
    prioridad_elemento in (
      'Baja',
      'Media',
      'Alta',
      'Urgente'
    )
  ),

  orden_elemento integer,
  fecha_nacimiento date,
  foto_url text,

  descripcion_referencia text,
  antecedentes_relevantes text,
  motivo_inclusion text,

  fuente_informacion text not null default 'Consultante' check (
    fuente_informacion in (
      'Consultante',
      'Evaluación',
      'Consulta',
      'Revisión previa',
      'Documento externo',
      'Observación interna',
      'Otro'
    )
  ),

  nivel_confirmacion text not null default 'Declarado por consultante' check (
    nivel_confirmacion in (
      'Declarado por consultante',
      'Confirmado',
      'Por confirmar',
      'Referencial'
    )
  ),

  estado_elemento text not null default 'Activo' check (
    estado_elemento in (
      'Activo',
      'En observación',
      'Descartado',
      'Cerrado'
    )
  ),

  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint elementos_caso_orden_valido
    check (orden_elemento is null or orden_elemento > 0),

  constraint elementos_caso_fecha_nacimiento_valida
    check (fecha_nacimiento is null or fecha_nacimiento <= current_date)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_elementos_caso_updated_at on public.elementos_caso;

create trigger set_elementos_caso_updated_at
before update on public.elementos_caso
for each row
execute function public.set_updated_at();

create or replace function public.validar_elemento_caso_paciente()
returns trigger as $$
declare
  paciente_del_caso uuid;
begin
  select paciente_id
  into paciente_del_caso
  from public.casos
  where id_caso = new.caso_id;

  if paciente_del_caso is null then
    raise exception 'El caso indicado no existe: %', new.caso_id;
  end if;

  if new.paciente_id <> paciente_del_caso then
    raise exception 'El paciente del elemento (%) no coincide con el paciente del caso (%)',
      new.paciente_id,
      paciente_del_caso;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_elementos_caso_paciente on public.elementos_caso;

create trigger validar_elementos_caso_paciente
before insert or update of paciente_id, caso_id on public.elementos_caso
for each row
execute function public.validar_elemento_caso_paciente();

create index if not exists idx_elementos_caso_paciente_id
on public.elementos_caso(paciente_id);

create index if not exists idx_elementos_caso_caso_id
on public.elementos_caso(caso_id);

create index if not exists idx_elementos_caso_tipo_elemento
on public.elementos_caso(tipo_elemento);

create index if not exists idx_elementos_caso_rol_en_caso
on public.elementos_caso(rol_en_caso);

create index if not exists idx_elementos_caso_prioridad
on public.elementos_caso(prioridad_elemento);

create index if not exists idx_elementos_caso_estado
on public.elementos_caso(estado_elemento);

create index if not exists idx_elementos_caso_caso_orden
on public.elementos_caso(caso_id, orden_elemento);
