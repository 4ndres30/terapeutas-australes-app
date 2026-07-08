-- Migración: Identidad financiera persistente y actualización de vista
-- Tarea: BE-023

create table if not exists public.pacientes_identidad_financiera (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null unique references public.pacientes(id)
    on update cascade
    on delete cascade,
  codigo_financiero text not null unique,
  alias_administrativo text not null unique,
  estado text not null default 'Activo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Habilitar RLS en la nueva tabla
alter table public.pacientes_identidad_financiera enable row level security;

-- Políticas RLS: Solo administradores pueden realizar operaciones
create policy "pacientes_identidad_financiera_admin"
  on public.pacientes_identidad_financiera
  for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- Función de provisión automática al insertar pacientes
create or replace function public.provisionar_identidad_financiera_paciente()
returns trigger as $$
begin
  insert into public.pacientes_identidad_financiera (paciente_id, codigo_financiero, alias_administrativo)
  values (
    new.id,
    concat('PAC-', upper(left(replace(new.id::text, '-', ''), 8))),
    concat('Paciente ', upper(left(replace(new.id::text, '-', ''), 8)))
  )
  on conflict (paciente_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger asociado
drop trigger if exists trigger_provisionar_identidad_financiera on public.pacientes;

create trigger trigger_provisionar_identidad_financiera
after insert on public.pacientes
for each row
execute function public.provisionar_identidad_financiera_paciente();

-- Backfill para pacientes existentes
insert into public.pacientes_identidad_financiera (paciente_id, codigo_financiero, alias_administrativo)
select
  id,
  concat('PAC-', upper(left(replace(id::text, '-', ''), 8))),
  concat('Paciente ', upper(left(replace(id::text, '-', ''), 8)))
from public.pacientes
on conflict (paciente_id) do nothing;

-- Actualizar vista financiera para remover paciente_id y cruzar con la nueva tabla
drop view if exists public.vista_finanzas_unidades_cobrables;

create or replace view public.vista_finanzas_unidades_cobrables as
select
  c.id_cobro,
  ultimo_pago.id_pago,
  pif.codigo_financiero as codigo_paciente,
  pif.alias_administrativo as alias_administrativo_paciente,
  case
    when c.trabajo_id is not null then 'trabajo'
    when c.revision_id is not null then 'revision'
    when c.caso_id is not null then 'caso'
    when c.evaluacion_id is not null then 'evaluacion'
    when c.consulta_id is not null then 'consulta'
    else 'cobro'
  end as tipo_unidad_cobrable,
  concat(
    case
      when c.trabajo_id is not null then 'TRA'
      when c.revision_id is not null then 'REV'
      when c.caso_id is not null then 'CAS'
      when c.evaluacion_id is not null then 'EVA'
      when c.consulta_id is not null then 'CON'
      else 'COB'
    end,
    '-',
    upper(left(replace(coalesce(c.trabajo_id, c.revision_id, c.caso_id, c.evaluacion_id, c.consulta_id, c.id_cobro)::text, '-', ''), 8))
  ) as referencia_unidad_administrativa,
  concat('Cobro ', c.tipo_cobro) as concepto_cobro_administrativo,
  c.tipo_cobro,
  c.fecha_cobro,
  c.fecha_vencimiento,
  c.monto_cobro,
  c.monto_descuento,
  c.monto_total,
  pagos_resumen.monto_pagado,
  c.monto_total - pagos_resumen.monto_pagado as saldo_pendiente,
  c.moneda,
  c.estado_cobro,
  ultimo_pago.estado_pago,
  ultimo_pago.fecha_pago as fecha_ultimo_pago,
  ultimo_pago.metodo_pago as metodo_ultimo_pago,
  ultimo_pago.referencia_pago
from public.cobros c
left join public.pacientes_identidad_financiera pif on pif.paciente_id = c.paciente_id
left join lateral (
  select
    coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0)::numeric(12, 2) as monto_pagado
  from public.pagos p
  where p.cobro_id = c.id_cobro
) pagos_resumen on true
left join lateral (
  select
    p.id_pago,
    p.fecha_pago,
    p.metodo_pago,
    p.referencia_pago,
    p.estado_pago
  from public.pagos p
  where p.cobro_id = c.id_cobro
  order by p.fecha_pago desc, p.hora_pago desc, p.created_at desc, p.id_pago desc
  limit 1
) ultimo_pago on true;

alter view public.vista_finanzas_unidades_cobrables set (security_invoker = true);

revoke all privileges on table public.vista_finanzas_unidades_cobrables from public;
revoke all privileges on table public.vista_finanzas_unidades_cobrables from anon;
revoke all privileges on table public.vista_finanzas_unidades_cobrables from authenticated;

grant select on table public.vista_finanzas_unidades_cobrables to authenticated;

comment on view public.vista_finanzas_unidades_cobrables is
  'Vista financiera minima por unidad cobrable. No expone paciente_id, nombres, contacto, datos clinicos, fotos ni rutas de Storage.';
