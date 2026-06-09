alter table public.cobros
  add column if not exists evaluacion_id uuid references public.evaluaciones(id_evaluacion)
    on update cascade
    on delete restrict;

alter table public.cobros
  add column if not exists revision_id uuid references public.revisiones(id_revision)
    on update cascade
    on delete restrict;

create or replace function public.validar_cobro_relaciones()
returns trigger as $$
declare
  paciente_de_consulta uuid;
  paciente_de_evaluacion uuid;
  consulta_de_evaluacion uuid;
  paciente_del_caso uuid;
  consulta_del_caso uuid;
  evaluacion_del_caso uuid;
  paciente_de_revision uuid;
  caso_de_revision uuid;
  consulta_de_revision uuid;
  evaluacion_de_revision uuid;
  paciente_del_trabajo uuid;
  caso_del_trabajo uuid;
begin
  if new.consulta_id is not null then
    select paciente_id
    into paciente_de_consulta
    from public.consultas
    where id_consulta = new.consulta_id;

    if paciente_de_consulta is null then
      raise exception 'La consulta indicada no existe: %', new.consulta_id;
    end if;

    if new.paciente_id <> paciente_de_consulta then
      raise exception 'El paciente del cobro (%) no coincide con el paciente de la consulta (%)',
        new.paciente_id,
        paciente_de_consulta;
    end if;
  end if;

  if new.evaluacion_id is not null then
    select paciente_id, consulta_id
    into paciente_de_evaluacion, consulta_de_evaluacion
    from public.evaluaciones
    where id_evaluacion = new.evaluacion_id;

    if paciente_de_evaluacion is null then
      raise exception 'La evaluación indicada no existe: %', new.evaluacion_id;
    end if;

    if new.paciente_id <> paciente_de_evaluacion then
      raise exception 'El paciente del cobro (%) no coincide con el paciente de la evaluación (%)',
        new.paciente_id,
        paciente_de_evaluacion;
    end if;

    if new.consulta_id is null then
      new.consulta_id = consulta_de_evaluacion;
    elsif new.consulta_id <> consulta_de_evaluacion then
      raise exception 'La consulta del cobro (%) no coincide con la consulta de la evaluación (%)',
        new.consulta_id,
        consulta_de_evaluacion;
    end if;
  end if;

  if new.caso_id is not null then
    select paciente_id, consulta_id, evaluacion_id
    into paciente_del_caso, consulta_del_caso, evaluacion_del_caso
    from public.casos
    where id_caso = new.caso_id;

    if paciente_del_caso is null then
      raise exception 'El caso indicado no existe: %', new.caso_id;
    end if;

    if new.paciente_id <> paciente_del_caso then
      raise exception 'El paciente del cobro (%) no coincide con el paciente del caso (%)',
        new.paciente_id,
        paciente_del_caso;
    end if;

    if new.consulta_id is not null and consulta_del_caso is not null and new.consulta_id <> consulta_del_caso then
      raise exception 'La consulta del cobro (%) no coincide con la consulta del caso (%)',
        new.consulta_id,
        consulta_del_caso;
    end if;

    if new.evaluacion_id is not null and evaluacion_del_caso is not null and new.evaluacion_id <> evaluacion_del_caso then
      raise exception 'La evaluación del cobro (%) no coincide con la evaluación del caso (%)',
        new.evaluacion_id,
        evaluacion_del_caso;
    end if;
  end if;

  if new.revision_id is not null then
    select paciente_id, caso_id, consulta_id, evaluacion_id
    into paciente_de_revision, caso_de_revision, consulta_de_revision, evaluacion_de_revision
    from public.revisiones
    where id_revision = new.revision_id;

    if paciente_de_revision is null then
      raise exception 'La revisión indicada no existe: %', new.revision_id;
    end if;

    if new.paciente_id <> paciente_de_revision then
      raise exception 'El paciente del cobro (%) no coincide con el paciente de la revisión (%)',
        new.paciente_id,
        paciente_de_revision;
    end if;

    if new.caso_id is null then
      new.caso_id = caso_de_revision;
    elsif new.caso_id <> caso_de_revision then
      raise exception 'El caso del cobro (%) no coincide con el caso de la revisión (%)',
        new.caso_id,
        caso_de_revision;
    end if;

    if new.consulta_id is null and consulta_de_revision is not null then
      new.consulta_id = consulta_de_revision;
    elsif new.consulta_id is not null and consulta_de_revision is not null and new.consulta_id <> consulta_de_revision then
      raise exception 'La consulta del cobro (%) no coincide con la consulta de la revisión (%)',
        new.consulta_id,
        consulta_de_revision;
    end if;

    if new.evaluacion_id is null and evaluacion_de_revision is not null then
      new.evaluacion_id = evaluacion_de_revision;
    elsif new.evaluacion_id is not null and evaluacion_de_revision is not null and new.evaluacion_id <> evaluacion_de_revision then
      raise exception 'La evaluación del cobro (%) no coincide con la evaluación de la revisión (%)',
        new.evaluacion_id,
        evaluacion_de_revision;
    end if;
  end if;

  if new.trabajo_id is not null then
    select paciente_id, caso_id
    into paciente_del_trabajo, caso_del_trabajo
    from public.trabajos
    where id_trabajo = new.trabajo_id;

    if paciente_del_trabajo is null then
      raise exception 'El trabajo indicado no existe: %', new.trabajo_id;
    end if;

    if new.paciente_id <> paciente_del_trabajo then
      raise exception 'El paciente del cobro (%) no coincide con el paciente del trabajo (%)',
        new.paciente_id,
        paciente_del_trabajo;
    end if;

    if new.caso_id is null then
      new.caso_id = caso_del_trabajo;
    elsif new.caso_id <> caso_del_trabajo then
      raise exception 'El caso del cobro (%) no coincide con el caso del trabajo (%)',
        new.caso_id,
        caso_del_trabajo;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_cobros_relaciones on public.cobros;

create trigger validar_cobros_relaciones
before insert or update of paciente_id, consulta_id, evaluacion_id, caso_id, revision_id, trabajo_id on public.cobros
for each row
execute function public.validar_cobro_relaciones();

drop view if exists public.vista_cobros_estado;

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
group by c.id_cobro;

create index if not exists idx_cobros_evaluacion_id
on public.cobros(evaluacion_id);

create index if not exists idx_cobros_revision_id
on public.cobros(revision_id);
