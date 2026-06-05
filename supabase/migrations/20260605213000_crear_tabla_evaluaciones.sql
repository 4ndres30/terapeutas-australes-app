create table if not exists public.evaluaciones (
  id_evaluacion uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  consulta_id uuid not null references public.consultas(id_consulta)
    on update cascade
    on delete restrict,

  fecha_evaluacion date not null default current_date,
  hora_evaluacion time not null default localtime,

  relato_antecedentes text not null,
  sintomas_reportados text,
  hechos_clave text,
  personas_mencionadas text,

  decision_revision text not null default 'Pendiente' check (
    decision_revision in (
      'Pendiente',
      'Sí requiere revisión',
      'No requiere revisión'
    )
  ),

  fundamento_decision text,
  notas_internas text,

  estado_evaluacion text not null default 'Abierta' check (
    estado_evaluacion in (
      'Abierta',
      'Completada',
      'Anulada'
    )
  ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_evaluaciones_updated_at on public.evaluaciones;

create trigger set_evaluaciones_updated_at
before update on public.evaluaciones
for each row
execute function public.set_updated_at();

create index if not exists idx_evaluaciones_paciente_id
on public.evaluaciones(paciente_id);

create index if not exists idx_evaluaciones_consulta_id
on public.evaluaciones(consulta_id);

create index if not exists idx_evaluaciones_fecha
on public.evaluaciones(fecha_evaluacion);
