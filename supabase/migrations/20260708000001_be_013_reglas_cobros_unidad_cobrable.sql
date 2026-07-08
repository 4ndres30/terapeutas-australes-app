-- Migration: BE-013 - Reglas de cobros por unidad cobrable
-- Autor: Control de desarrollo
-- Fecha: 2026-07-08

-- 1. Redefinir la función de validación de relaciones de cobros para evitar duplicidad de ancestros (D-TECN)
create or replace function public.validar_cobro_relaciones()
returns trigger as $$
declare
  paciente_de_consulta uuid;
  paciente_de_evaluacion uuid;
  paciente_del_caso uuid;
  paciente_de_revision uuid;
  caso_de_revision uuid;
  paciente_del_trabajo uuid;
  caso_del_trabajo uuid;
begin
  -- Validar consistencia con consulta_id
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

  -- Validar consistencia con evaluacion_id
  if new.evaluacion_id is not null then
    select paciente_id
    into paciente_de_evaluacion
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
  end if;

  -- Validar consistencia con caso_id
  if new.caso_id is not null then
    select paciente_id
    into paciente_del_caso
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
  end if;

  -- Validar consistencia con revision_id (se infiere caso_id si es nulo)
  if new.revision_id is not null then
    select paciente_id, caso_id
    into paciente_de_revision, caso_de_revision
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
  end if;

  -- Validar consistencia con trabajo_id (se infiere caso_id si es nulo)
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

-- 2. Establecer restricciones de validación a nivel de tabla (CHECK constraints)
alter table public.cobros
  add constraint chk_cobro_origen_valido check (
    caso_id is not null or
    consulta_id is not null or
    evaluacion_id is not null or
    revision_id is not null or
    trabajo_id is not null
  );

alter table public.cobros
  add constraint chk_cobro_origen_excluyente check (
    (
      (case when consulta_id is not null then 1 else 0 end) +
      (case when evaluacion_id is not null then 1 else 0 end) +
      (case when revision_id is not null then 1 else 0 end) +
      (case when trabajo_id is not null then 1 else 0 end)
    ) <= 1
  );
