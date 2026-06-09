create table if not exists public.usuarios_internos (
  id uuid primary key references auth.users(id)
    on delete cascade,

  email text not null unique,
  nombre_completo text not null,

  rol text not null check (
    rol in (
      'admin',
      'terapeuta',
      'finanzas'
    )
  ),

  activo boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_usuarios_internos_updated_at on public.usuarios_internos;

create trigger set_usuarios_internos_updated_at
before update on public.usuarios_internos
for each row
execute function public.set_updated_at();

create index if not exists idx_usuarios_internos_email
on public.usuarios_internos(email);

create index if not exists idx_usuarios_internos_rol
on public.usuarios_internos(rol);

create index if not exists idx_usuarios_internos_activo
on public.usuarios_internos(activo);
