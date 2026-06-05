alter table public.pacientes
alter column nombres set not null,
alter column apellidos set not null,
alter column fecha_nacimiento set not null,
alter column sexo set not null,
alter column telefono set not null,
alter column email set not null,
alter column comuna set not null,
alter column region set not null;

alter table public.pacientes
drop constraint if exists pacientes_estado_check;

alter table public.pacientes
add constraint pacientes_estado_check
check (estado in ('activo', 'inactivo'));

alter table public.pacientes
drop constraint if exists pacientes_sexo_check;

alter table public.pacientes
add constraint pacientes_sexo_check
check (sexo in ('femenino', 'masculino', 'otro', 'prefiere_no_decir'));