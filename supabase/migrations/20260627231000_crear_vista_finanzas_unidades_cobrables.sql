create or replace view public.vista_cobros_estado as
select
  c.id_cobro,
  c.paciente_id,
  c.consulta_id,
  c.evaluacion_id,
  c.caso_id,
  c.revision_id,
  c.trabajo_id,
  c.fecha_cobro,
  c.fecha_vencimiento,
  c.concepto_cobro,
  c.tipo_cobro,
  c.monto_cobro,
  c.monto_descuento,
  c.monto_total,
  c.moneda,
  c.estado_cobro,
  coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) as monto_pagado,
  c.monto_total - coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) as saldo_pendiente,
  case
    when c.estado_cobro in ('Anulado', 'Condonado') then c.estado_cobro
    when coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) <= 0 then 'Pendiente'
    when coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) < c.monto_total then 'Parcial'
    else 'Pagado'
  end as estado_calculado
from public.cobros c
left join public.pagos p on p.cobro_id = c.id_cobro
where public.es_admin()
group by c.id_cobro;

alter view public.vista_cobros_estado set (security_invoker = true);

create or replace view public.vista_finanzas_unidades_cobrables as
select
  c.id_cobro,
  ultimo_pago.id_pago,
  c.paciente_id,
  concat('PAC-', upper(left(replace(c.paciente_id::text, '-', ''), 8))) as codigo_paciente,
  concat('Paciente ', upper(left(replace(c.paciente_id::text, '-', ''), 8))) as alias_administrativo_paciente,
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
  'Vista financiera minima por unidad cobrable. No expone nombres, contacto, datos clinicos, fotos ni rutas de Storage.';
