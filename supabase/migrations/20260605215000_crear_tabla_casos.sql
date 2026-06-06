create table if not exists public.casos (
  id_caso uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  consulta_id uuid references public.consultas(id_consulta)
    on update cascade
    on delete restrict,

  evaluacion_id uuid references public.evaluaciones(id_evaluacion)
    on update cascade
    on delete restrict,

  fecha_apertura date not null default current_date,
  hora_apertura time not null default localtime,

  nombre_caso text not null,
  motivo_apertura text not null,
  descripcion_general text,
  objetivo_trabajo text,

  tipo_caso text not null check (
    tipo_caso in (
      'Personal',
      'Familiar',
      'Vínculo',
      'Linaje',
      'Casa/Espacio',
      'Bloqueo',
      'Entidad/Presencia',
      'Protección',
      'Seguimiento',
      'Otro'
    )
  ),

  prioridad text not null default 'Media' check (
    prioridad in (
      'Baja',
      'Media',
      'Alta',
      'Urgente'
    )
  ),

  estado_caso text not null default 'Abierto' check (
    estado_caso in (
      'Abierto',
      'En proceso',
      'Pausado',
      'Cerrado',
      'Anulado'
    )
  ),

  requiere_seguimiento boolean not null default false,
  notas_seguimiento text,

  fecha_cierre date,
  resultado_cierre text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint casos_fecha_cierre_valida
    check (fecha_cierre is null or fecha_cierre >= fecha_apertura)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_casos_updated_at on public.casos;

create trigger set_casos_updated_at
before update on public.casos
for each row
execute function public.set_updated_at();

create index if not exists idx_casos_paciente_id
on public.casos(paciente_id);

create index if not exists idx_casos_consulta_id
on public.casos(consulta_id);

create index if not exists idx_casos_evaluacion_id
on public.casos(evaluacion_id);

create index if not exists idx_casos_fecha_apertura
on public.casos(fecha_apertura);

create index if not exists idx_casos_estado_caso
on public.casos(estado_caso);
