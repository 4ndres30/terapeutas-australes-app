alter table public.pacientes
drop column if exists direccion;

alter table public.pacientes
drop column if exists ocupacion;

alter table public.pacientes
drop column if exists contacto_emergencia_nombre;

alter table public.pacientes
drop column if exists contacto_emergencia_telefono;

alter table public.pacientes
drop column if exists motivo_consulta;

alter table public.pacientes
drop column if exists observaciones_generales;