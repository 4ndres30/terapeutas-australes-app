drop trigger if exists trg_normalizar_rut_paciente on public.pacientes;

drop function if exists public.normalizar_rut_paciente();

drop function if exists public.formatear_rut_chileno(text);

alter table public.pacientes
drop constraint if exists pacientes_rut_key;

drop index if exists public.idx_pacientes_rut;

alter table public.pacientes
drop column if exists rut;

alter table public.pacientes
add column if not exists fecha_nacimiento date;