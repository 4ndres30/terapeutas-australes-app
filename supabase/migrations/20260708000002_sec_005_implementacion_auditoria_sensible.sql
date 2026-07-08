-- Migration: SEC-005 - Implementación de auditoría sensible
-- Autor: Control de desarrollo
-- Fecha: 2026-07-08

-- 1. Crear tabla física para bitácora de auditoría sensible
create table if not exists public.logs_auditoria_sensible (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid,
  actor_email text,
  actor_rol text,
  ip_address text,
  entidad_tipo text not null,
  entidad_id uuid,
  operacion text not null,
  datos_antes jsonb,
  datos_despues jsonb
);

-- 2. Activar Row Level Security (RLS) en la tabla de logs
alter table public.logs_auditoria_sensible enable row level security;

-- 3. Crear política para que únicamente el rol admin pueda consultar logs
create policy logs_select_admin
  on public.logs_auditoria_sensible
  for select
  to authenticated
  using (public.es_admin());

-- Nota: Al no definir políticas de INSERT, UPDATE o DELETE, éstas quedan bloqueadas para todos
-- los usuarios Authenticated/Anon por defecto. Los inserts ocurrirán mediante funciones SECURITY DEFINER.

-- 4. Crear función para enmascarar información PII y clínica de los logs
create or replace function public.minimizar_datos_auditoria(datos jsonb)
returns jsonb as $$
declare
  k text;
  cleaned jsonb := '{}'::jsonb;
begin
  if datos is null then
    return null;
  end if;

  for k in select jsonb_object_keys(datos) loop
    -- Filtrar columnas que contienen PII, notas libres clínicas o descripciones no financieras
    if k in (
      'nombre_completo', 'email', 'telefono', 'direccion', 'identificador_interno',
      'relato_antecedentes', 'motivo_consulta', 'informacion_canalizada',
      'observaciones', 'notas_internas', 'sintomas_reportados', 'objetivo_trabajo',
      'objetivo_revision', 'descripcion_general', 'resultado_cierre',
      'storage_path', 'foto_url', 'descripcion_cobro', 'referencia_pago'
    ) then
      cleaned := cleaned || jsonb_build_object(k, '[ENMASCARADO]');
    else
      cleaned := cleaned || jsonb_build_object(k, datos->k);
    end if;
  end loop;

  return cleaned;
end;
$$ language plpgsql security definer;

-- 5. Crear función disparadora genérica para procesar auditorías
create or replace function public.procesar_auditoria_sensible()
returns trigger as $$
declare
  v_actor_id uuid;
  v_actor_email text;
  v_actor_rol text;
  v_entidad_id uuid;
  v_old_data jsonb := null;
  v_new_data jsonb := null;
  v_operacion text;
  v_ip_address text;
begin
  -- Resolver metadatos del actor
  v_actor_id := auth.uid();
  if v_actor_id is not null then
    select email, rol into v_actor_email, v_actor_rol
    from public.usuarios_internos
    where id = v_actor_id;
  else
    v_actor_email := 'system/db';
    v_actor_rol := 'system';
  end if;

  -- Intentar resolver la dirección IP
  begin
    v_ip_address := current_setting('request.headers', true)::json->>'x-forwarded-for';
  exception when others then
    v_ip_address := null;
  end;

  v_operacion := TG_OP;

  -- Resolver la clave primaria de forma dinámica
  if TG_OP = 'DELETE' then
    v_old_data := to_jsonb(OLD);
    v_entidad_id := coalesce(
      (v_old_data->>'id')::uuid,
      (v_old_data->>'id_caso')::uuid,
      (v_old_data->>'id_consulta')::uuid,
      (v_old_data->>'id_evaluacion')::uuid,
      (v_old_data->>'id_revision')::uuid,
      (v_old_data->>'id_revision_elemento')::uuid,
      (v_old_data->>'id_revision_aspecto')::uuid,
      (v_old_data->>'id_revision_hallazgo')::uuid,
      (v_old_data->>'id_trabajo')::uuid,
      (v_old_data->>'id_trabajo_elemento')::uuid,
      (v_old_data->>'id_trabajo_sesion')::uuid,
      (v_old_data->>'id_trabajo_accion')::uuid,
      (v_old_data->>'id_cobro')::uuid,
      (v_old_data->>'id_pago')::uuid,
      (v_old_data->>'id_foto_elemento_caso')::uuid
    );
  else
    v_new_data := to_jsonb(NEW);
    v_entidad_id := coalesce(
      (v_new_data->>'id')::uuid,
      (v_new_data->>'id_caso')::uuid,
      (v_new_data->>'id_consulta')::uuid,
      (v_new_data->>'id_evaluacion')::uuid,
      (v_new_data->>'id_revision')::uuid,
      (v_new_data->>'id_revision_elemento')::uuid,
      (v_new_data->>'id_revision_aspecto')::uuid,
      (v_new_data->>'id_revision_hallazgo')::uuid,
      (v_new_data->>'id_trabajo')::uuid,
      (v_new_data->>'id_trabajo_elemento')::uuid,
      (v_new_data->>'id_trabajo_sesion')::uuid,
      (v_new_data->>'id_trabajo_accion')::uuid,
      (v_new_data->>'id_cobro')::uuid,
      (v_new_data->>'id_pago')::uuid,
      (v_new_data->>'id_foto_elemento_caso')::uuid
    );
    if TG_OP = 'UPDATE' then
      v_old_data := to_jsonb(OLD);
    end if;
  end if;

  -- Insertar registro en bitácora
  insert into public.logs_auditoria_sensible (
    actor_id,
    actor_email,
    actor_rol,
    ip_address,
    entidad_tipo,
    entidad_id,
    operacion,
    datos_antes,
    datos_despues
  ) values (
    v_actor_id,
    v_actor_email,
    v_actor_rol,
    v_ip_address,
    TG_TABLE_NAME,
    v_entidad_id,
    v_operacion,
    public.minimizar_datos_auditoria(v_old_data),
    public.minimizar_datos_auditoria(v_new_data)
  );

  if TG_OP = 'DELETE' then
    return OLD;
  else
    return NEW;
  end if;
end;
$$ language plpgsql security definer;

-- 6. Adjuntar disparadores de auditoría a las tablas operativas sensibles
drop trigger if exists audit_pacientes on public.pacientes;
create trigger audit_pacientes
  after insert or update or delete on public.pacientes
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_consultas on public.consultas;
create trigger audit_consultas
  after insert or update or delete on public.consultas
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_evaluaciones on public.evaluaciones;
create trigger audit_evaluaciones
  after insert or update or delete on public.evaluaciones
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_casos on public.casos;
create trigger audit_casos
  after insert or update or delete on public.casos
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_elementos_caso on public.elementos_caso;
create trigger audit_elementos_caso
  after insert or update or delete on public.elementos_caso
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_revisiones on public.revisiones;
create trigger audit_revisiones
  after insert or update or delete on public.revisiones
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_revision_aspectos on public.revision_aspectos;
create trigger audit_revision_aspectos
  after insert or update or delete on public.revision_aspectos
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_revision_hallazgos on public.revision_hallazgos;
create trigger audit_revision_hallazgos
  after insert or update or delete on public.revision_hallazgos
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_trabajos on public.trabajos;
create trigger audit_trabajos
  after insert or update or delete on public.trabajos
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_cobros on public.cobros;
create trigger audit_cobros
  after insert or update or delete on public.cobros
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_pagos on public.pagos;
create trigger audit_pagos
  after insert or update or delete on public.pagos
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_usuarios_internos on public.usuarios_internos;
create trigger audit_usuarios_internos
  after insert or update or delete on public.usuarios_internos
  for each row execute function public.procesar_auditoria_sensible();

drop trigger if exists audit_fotos_elementos_caso on public.fotos_elementos_caso;
create trigger audit_fotos_elementos_caso
  after insert or update or delete on public.fotos_elementos_caso
  for each row execute function public.procesar_auditoria_sensible();
