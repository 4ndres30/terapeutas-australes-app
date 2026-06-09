create or replace function public.rol_usuario_actual()
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select ui.rol
  from public.usuarios_internos ui
  where ui.id = auth.uid()
    and ui.activo is true
  limit 1;
$$;

create or replace function public.usuario_interno_activo()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.usuarios_internos ui
    where ui.id = auth.uid()
      and ui.activo is true
  );
$$;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select public.rol_usuario_actual() = 'admin';
$$;

create or replace function public.es_terapeuta_o_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select public.rol_usuario_actual() in ('admin', 'terapeuta');
$$;

create or replace function public.es_finanzas_o_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select public.rol_usuario_actual() in ('admin', 'finanzas');
$$;

revoke execute on function public.rol_usuario_actual() from public, anon;
revoke execute on function public.usuario_interno_activo() from public, anon;
revoke execute on function public.es_admin() from public, anon;
revoke execute on function public.es_terapeuta_o_admin() from public, anon;
revoke execute on function public.es_finanzas_o_admin() from public, anon;

grant execute on function public.rol_usuario_actual() to authenticated;
grant execute on function public.usuario_interno_activo() to authenticated;
grant execute on function public.es_admin() to authenticated;
grant execute on function public.es_terapeuta_o_admin() to authenticated;
grant execute on function public.es_finanzas_o_admin() to authenticated;

alter table public.pacientes enable row level security;
alter table public.consultas enable row level security;
alter table public.evaluaciones enable row level security;
alter table public.casos enable row level security;
alter table public.elementos_caso enable row level security;
alter table public.revisiones enable row level security;
alter table public.revision_elementos enable row level security;
alter table public.revision_aspectos enable row level security;
alter table public.revision_hallazgos enable row level security;
alter table public.trabajos enable row level security;
alter table public.trabajo_elementos enable row level security;
alter table public.trabajo_sesiones enable row level security;
alter table public.trabajo_acciones enable row level security;
alter table public.cobros enable row level security;
alter table public.pagos enable row level security;
alter table public.usuarios_internos enable row level security;

alter view public.vista_cobros_estado set (security_invoker = true);

revoke all privileges on all tables in schema public from public;
revoke all privileges on all tables in schema public from anon;
revoke all privileges on all tables in schema public from authenticated;

grant usage on schema public to authenticated;

grant select, insert, update on table
  public.pacientes,
  public.consultas,
  public.evaluaciones,
  public.casos,
  public.elementos_caso,
  public.revisiones,
  public.revision_elementos,
  public.revision_aspectos,
  public.revision_hallazgos,
  public.trabajos,
  public.trabajo_elementos,
  public.trabajo_sesiones,
  public.trabajo_acciones
to authenticated;

grant select, insert, update on table
  public.cobros,
  public.pagos
to authenticated;

grant select, insert, update, delete on table
  public.usuarios_internos
to authenticated;

grant select on table
  public.vista_cobros_estado
to authenticated;

drop policy if exists usuarios_internos_select_self on public.usuarios_internos;
drop policy if exists usuarios_internos_select_admin on public.usuarios_internos;
drop policy if exists usuarios_internos_insert_admin on public.usuarios_internos;
drop policy if exists usuarios_internos_update_admin on public.usuarios_internos;
drop policy if exists usuarios_internos_delete_admin on public.usuarios_internos;

create policy usuarios_internos_select_self
on public.usuarios_internos
for select
to authenticated
using (id = auth.uid());

create policy usuarios_internos_select_admin
on public.usuarios_internos
for select
to authenticated
using (public.es_admin());

create policy usuarios_internos_insert_admin
on public.usuarios_internos
for insert
to authenticated
with check (public.es_admin());

create policy usuarios_internos_update_admin
on public.usuarios_internos
for update
to authenticated
using (public.es_admin())
with check (public.es_admin());

create policy usuarios_internos_delete_admin
on public.usuarios_internos
for delete
to authenticated
using (public.es_admin());

drop policy if exists pacientes_select_clinica on public.pacientes;
drop policy if exists pacientes_insert_clinica on public.pacientes;
drop policy if exists pacientes_update_clinica on public.pacientes;

create policy pacientes_select_clinica
on public.pacientes
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy pacientes_insert_clinica
on public.pacientes
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy pacientes_update_clinica
on public.pacientes
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists consultas_select_clinica on public.consultas;
drop policy if exists consultas_insert_clinica on public.consultas;
drop policy if exists consultas_update_clinica on public.consultas;

create policy consultas_select_clinica
on public.consultas
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy consultas_insert_clinica
on public.consultas
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy consultas_update_clinica
on public.consultas
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists evaluaciones_select_clinica on public.evaluaciones;
drop policy if exists evaluaciones_insert_clinica on public.evaluaciones;
drop policy if exists evaluaciones_update_clinica on public.evaluaciones;

create policy evaluaciones_select_clinica
on public.evaluaciones
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy evaluaciones_insert_clinica
on public.evaluaciones
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy evaluaciones_update_clinica
on public.evaluaciones
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists casos_select_clinica on public.casos;
drop policy if exists casos_insert_clinica on public.casos;
drop policy if exists casos_update_clinica on public.casos;

create policy casos_select_clinica
on public.casos
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy casos_insert_clinica
on public.casos
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy casos_update_clinica
on public.casos
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists elementos_caso_select_clinica on public.elementos_caso;
drop policy if exists elementos_caso_insert_clinica on public.elementos_caso;
drop policy if exists elementos_caso_update_clinica on public.elementos_caso;

create policy elementos_caso_select_clinica
on public.elementos_caso
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy elementos_caso_insert_clinica
on public.elementos_caso
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy elementos_caso_update_clinica
on public.elementos_caso
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists revisiones_select_clinica on public.revisiones;
drop policy if exists revisiones_insert_clinica on public.revisiones;
drop policy if exists revisiones_update_clinica on public.revisiones;

create policy revisiones_select_clinica
on public.revisiones
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy revisiones_insert_clinica
on public.revisiones
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy revisiones_update_clinica
on public.revisiones
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists revision_elementos_select_clinica on public.revision_elementos;
drop policy if exists revision_elementos_insert_clinica on public.revision_elementos;
drop policy if exists revision_elementos_update_clinica on public.revision_elementos;

create policy revision_elementos_select_clinica
on public.revision_elementos
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy revision_elementos_insert_clinica
on public.revision_elementos
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy revision_elementos_update_clinica
on public.revision_elementos
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists revision_aspectos_select_clinica on public.revision_aspectos;
drop policy if exists revision_aspectos_insert_clinica on public.revision_aspectos;
drop policy if exists revision_aspectos_update_clinica on public.revision_aspectos;

create policy revision_aspectos_select_clinica
on public.revision_aspectos
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy revision_aspectos_insert_clinica
on public.revision_aspectos
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy revision_aspectos_update_clinica
on public.revision_aspectos
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists revision_hallazgos_select_clinica on public.revision_hallazgos;
drop policy if exists revision_hallazgos_insert_clinica on public.revision_hallazgos;
drop policy if exists revision_hallazgos_update_clinica on public.revision_hallazgos;

create policy revision_hallazgos_select_clinica
on public.revision_hallazgos
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy revision_hallazgos_insert_clinica
on public.revision_hallazgos
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy revision_hallazgos_update_clinica
on public.revision_hallazgos
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists trabajos_select_clinica on public.trabajos;
drop policy if exists trabajos_insert_clinica on public.trabajos;
drop policy if exists trabajos_update_clinica on public.trabajos;

create policy trabajos_select_clinica
on public.trabajos
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy trabajos_insert_clinica
on public.trabajos
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy trabajos_update_clinica
on public.trabajos
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists trabajo_elementos_select_clinica on public.trabajo_elementos;
drop policy if exists trabajo_elementos_insert_clinica on public.trabajo_elementos;
drop policy if exists trabajo_elementos_update_clinica on public.trabajo_elementos;

create policy trabajo_elementos_select_clinica
on public.trabajo_elementos
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy trabajo_elementos_insert_clinica
on public.trabajo_elementos
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy trabajo_elementos_update_clinica
on public.trabajo_elementos
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists trabajo_sesiones_select_clinica on public.trabajo_sesiones;
drop policy if exists trabajo_sesiones_insert_clinica on public.trabajo_sesiones;
drop policy if exists trabajo_sesiones_update_clinica on public.trabajo_sesiones;

create policy trabajo_sesiones_select_clinica
on public.trabajo_sesiones
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy trabajo_sesiones_insert_clinica
on public.trabajo_sesiones
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy trabajo_sesiones_update_clinica
on public.trabajo_sesiones
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists trabajo_acciones_select_clinica on public.trabajo_acciones;
drop policy if exists trabajo_acciones_insert_clinica on public.trabajo_acciones;
drop policy if exists trabajo_acciones_update_clinica on public.trabajo_acciones;

create policy trabajo_acciones_select_clinica
on public.trabajo_acciones
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy trabajo_acciones_insert_clinica
on public.trabajo_acciones
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy trabajo_acciones_update_clinica
on public.trabajo_acciones
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists cobros_select_finanzas on public.cobros;
drop policy if exists cobros_insert_finanzas on public.cobros;
drop policy if exists cobros_update_finanzas on public.cobros;

create policy cobros_select_finanzas
on public.cobros
for select
to authenticated
using (public.es_finanzas_o_admin());

create policy cobros_insert_finanzas
on public.cobros
for insert
to authenticated
with check (public.es_finanzas_o_admin());

create policy cobros_update_finanzas
on public.cobros
for update
to authenticated
using (public.es_finanzas_o_admin())
with check (public.es_finanzas_o_admin());

drop policy if exists pagos_select_finanzas on public.pagos;
drop policy if exists pagos_insert_finanzas on public.pagos;
drop policy if exists pagos_update_finanzas on public.pagos;

create policy pagos_select_finanzas
on public.pagos
for select
to authenticated
using (public.es_finanzas_o_admin());

create policy pagos_insert_finanzas
on public.pagos
for insert
to authenticated
with check (public.es_finanzas_o_admin());

create policy pagos_update_finanzas
on public.pagos
for update
to authenticated
using (public.es_finanzas_o_admin())
with check (public.es_finanzas_o_admin());
