-- cobros tiene RLS restringida a es_finanzas_o_admin(): un terapeuta no puede
-- hacer select directo sobre esa tabla. Esta funcion SECURITY DEFINER expone
-- unicamente el booleano (nunca montos ni conceptos) para que la vista
-- funcione igual para terapeuta/admin, sin ampliar el acceso real a Finanzas.
create or replace function public.caso_tiene_cobro_vencido(p_caso_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cobros cb
    where cb.caso_id = p_caso_id
      and cb.estado_cobro not in ('Pagado', 'Anulado', 'Condonado')
      and cb.fecha_vencimiento is not null
      and cb.fecha_vencimiento < current_date
  );
$$;

revoke all on function public.caso_tiene_cobro_vencido(uuid) from public;
revoke all on function public.caso_tiene_cobro_vencido(uuid) from anon;
grant execute on function public.caso_tiene_cobro_vencido(uuid) to authenticated;

create or replace view public.vista_riesgo_abandono_casos as
select
  base.caso_id,
  base.nombre_operativo,
  base.prioridad,
  base.estado_caso,
  base.inasistencias_60d,
  base.dias_sin_actividad,
  base.cobros_vencidos,
  case
    when base.dias_sin_actividad > 45 then 'Alto'
    when base.inasistencias_60d >= 2 then 'Alto'
    when base.inasistencias_60d >= 1 and base.cobros_vencidos then 'Alto'
    when base.inasistencias_60d = 1 then 'Medio'
    when base.dias_sin_actividad between 25 and 45 then 'Medio'
    else 'Bajo'
  end as nivel_riesgo,
  case
    when base.dias_sin_actividad > 45
      then 'Sin consulta hace mas de 45 dias. Evaluar contacto o cierre por abandono.'
    when base.inasistencias_60d >= 2
      then '2 o mas inasistencias en 60 dias. Contactar antes de la proxima cita.'
    when base.inasistencias_60d >= 1 and base.cobros_vencidos
      then 'Inasistencia reciente y cobro vencido. Revisar caso.'
    when base.inasistencias_60d = 1
      then '1 inasistencia en 60 dias. Confirmar proxima cita con anticipacion.'
    when base.dias_sin_actividad between 25 and 45
      then 'Entre 25 y 45 dias sin actividad. Seguimiento preventivo sugerido.'
    else 'Sin senales de riesgo.'
  end as recomendacion
from (
  select
    c.id_caso as caso_id,
    concat_ws(' ', p.nombres, p.apellidos) as nombre_operativo,
    c.prioridad,
    c.estado_caso,
    coalesce(inasist.inasistencias_60d, 0) as inasistencias_60d,
    coalesce(
      current_date - ultima_consulta.fecha_ultima_consulta_realizada,
      current_date - c.fecha_apertura
    ) as dias_sin_actividad,
    public.caso_tiene_cobro_vencido(c.id_caso) as cobros_vencidos
  from public.casos c
  left join public.pacientes p
    on p.id = c.paciente_id
  left join lateral (
    select count(*) as inasistencias_60d
    from public.consultas co
    where co.paciente_id = c.paciente_id
      and co.estado_consulta = 'No asistió'
      and co.fecha_consulta >= current_date - 60
  ) inasist on true
  left join lateral (
    select max(co.fecha_consulta) as fecha_ultima_consulta_realizada
    from public.consultas co
    where co.paciente_id = c.paciente_id
      and co.estado_consulta = 'Realizada'
  ) ultima_consulta on true
  where c.estado_caso in ('Abierto', 'En proceso', 'Pausado')
    and public.es_terapeuta_o_admin()
) base;

alter view public.vista_riesgo_abandono_casos set (security_invoker = true);

revoke all privileges on table public.vista_riesgo_abandono_casos from public;
revoke all privileges on table public.vista_riesgo_abandono_casos from anon;
revoke all privileges on table public.vista_riesgo_abandono_casos from authenticated;

grant select on table public.vista_riesgo_abandono_casos to authenticated;

comment on view public.vista_riesgo_abandono_casos is
  'Vista de riesgo de abandono por caso activo, calculada en Postgres a partir de inasistencias recientes, dias sin actividad y cobros vencidos. No incluye reprogramaciones porque estado_consulta es mutable y sin historial de eventos. No usa IA ni servicios externos.';
