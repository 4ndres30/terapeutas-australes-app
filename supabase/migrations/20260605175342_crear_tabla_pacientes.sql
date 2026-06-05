create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),

  nombres text not null,
  apellidos text not null,
  rut text unique,
  fecha_nacimiento date,
  sexo text,

  telefono text,
  email text,
  direccion text,
  comuna text,
  region text,

  ocupacion text,

  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,

  motivo_consulta text,
  observaciones_generales text,

  estado text not null default 'activo',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_pacientes_nombres
on public.pacientes (nombres);

create index if not exists idx_pacientes_apellidos
on public.pacientes (apellidos);

create index if not exists idx_pacientes_rut
on public.pacientes (rut);