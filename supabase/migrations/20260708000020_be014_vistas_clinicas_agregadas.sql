-- BE-014: Vistas clínicas agregadas para reportes evolutivos por caso
-- Rama: feature/be-014-vistas-clinicas
-- Fecha: 2026-07-08
-- SOLO Supabase local. No ejecutar supabase db push sin autorización de Javier.

-- ─────────────────────────────────────────────────────────────────────────
-- VISTA 1: resumen_evolutivo_caso
-- Propósito: muestra el estado consolidado de un caso con sus conteos clave
-- Rol objetivo: terapeuta, admin (lectura)
-- Nota de seguridad: security_invoker=true hace que la vista respete la RLS
-- de las tablas base al momento de la consulta. casos/revisiones/
-- revision_hallazgos/trabajos/elementos_caso ya restringen SELECT a
-- public.es_terapeuta_o_admin() (ver 20260606055000_activar_rls_y_policies.sql),
-- por lo que no se requiere un filtro de rol adicional en esta vista.
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.vista_resumen_evolutivo_caso AS
SELECT
  c.id_caso,
  c.paciente_id,
  c.tipo_caso,
  c.estado_caso,
  c.fecha_apertura,
  c.fecha_cierre,
  c.requiere_seguimiento,
  -- Revisiones
  COUNT(DISTINCT r.id_revision)                                     AS total_revisiones,
  COUNT(DISTINCT r.id_revision) FILTER (WHERE r.estado_revision = 'Completada')  AS revisiones_cerradas,
  MAX(r.fecha_revision)                                             AS ultima_revision,
  -- Hallazgos
  COUNT(DISTINCT h.id_revision_hallazgo)                            AS total_hallazgos,
  COUNT(DISTINCT h.id_revision_hallazgo) FILTER (WHERE h.estado_hallazgo = 'Activo')   AS hallazgos_activos,
  COUNT(DISTINCT h.id_revision_hallazgo) FILTER (
    WHERE EXISTS (
      SELECT 1
      FROM public.trabajos tho
      WHERE tho.revision_hallazgo_origen_id = h.id_revision_hallazgo
    )
  )                                                                  AS hallazgos_derivados,
  -- Trabajos
  COUNT(DISTINCT t.id_trabajo)                                      AS total_trabajos,
  COUNT(DISTINCT t.id_trabajo) FILTER (WHERE t.estado_trabajo NOT IN ('Cerrado', 'Anulado')) AS trabajos_activos,
  ROUND(
    AVG(t.porcentaje_avance_general) FILTER (WHERE t.estado_trabajo NOT IN ('Anulado'))
  )::integer                                                        AS avance_promedio_trabajos,
  -- Elementos
  COUNT(DISTINCT e.id_elemento_caso)                                AS total_elementos,
  -- Cobros
  COUNT(DISTINCT co.id_cobro)                                       AS total_cobros,
  COALESCE(SUM(co.monto_cobro) FILTER (WHERE co.estado_cobro = 'Pagado'), 0) AS monto_pagado
FROM
  public.casos c
  LEFT JOIN public.revisiones r       ON r.caso_id = c.id_caso
  LEFT JOIN public.revision_hallazgos h ON h.revision_id = r.id_revision
  LEFT JOIN public.trabajos t         ON t.caso_id = c.id_caso
  LEFT JOIN public.elementos_caso e   ON e.caso_id = c.id_caso
  LEFT JOIN public.cobros co          ON co.caso_id = c.id_caso
GROUP BY
  c.id_caso,
  c.paciente_id,
  c.tipo_caso,
  c.estado_caso,
  c.fecha_apertura,
  c.fecha_cierre,
  c.requiere_seguimiento;

COMMENT ON VIEW public.vista_resumen_evolutivo_caso IS
  'BE-014: Resumen evolutivo consolidado por caso. Conteos de revisiones, hallazgos, trabajos, elementos y cobros. Solo lectura. No expone datos clínicos sensibles directamente.';

ALTER VIEW public.vista_resumen_evolutivo_caso SET (security_invoker = true);

REVOKE ALL PRIVILEGES ON TABLE public.vista_resumen_evolutivo_caso FROM public;
REVOKE ALL PRIVILEGES ON TABLE public.vista_resumen_evolutivo_caso FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.vista_resumen_evolutivo_caso FROM authenticated;

GRANT SELECT ON TABLE public.vista_resumen_evolutivo_caso TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- VISTA 2: vista_actividad_clinica_reciente
-- Propósito: las últimas 90 revisiones activas para el panel de actividad
-- Rol objetivo: terapeuta, admin
-- Nota de seguridad: security_invoker=true + RLS de revisiones/revision_hallazgos/
-- casos (public.es_terapeuta_o_admin()) ya restringen el acceso; no requiere
-- filtro de rol adicional.
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.vista_actividad_clinica_reciente AS
SELECT
  r.id_revision,
  r.caso_id,
  r.paciente_id,
  r.fecha_revision,
  r.tipo_revision,
  r.modalidad,
  r.estado_revision,
  r.numero_revision,
  r.requiere_seguimiento,
  r.proxima_accion,
  -- Agregados de la revisión
  COUNT(DISTINCT h.id_revision_hallazgo)                                          AS hallazgos_en_revision,
  COUNT(DISTINCT h.id_revision_hallazgo) FILTER (
    WHERE EXISTS (
      SELECT 1
      FROM public.trabajos tho
      WHERE tho.revision_hallazgo_origen_id = h.id_revision_hallazgo
    )
  )                                                                                AS hallazgos_derivados,
  -- Datos del caso
  c.tipo_caso,
  c.estado_caso
FROM
  public.revisiones r
  LEFT JOIN public.revision_hallazgos h ON h.revision_id = r.id_revision
  JOIN  public.casos c                  ON c.id_caso = r.caso_id
WHERE
  r.fecha_revision >= (CURRENT_DATE - INTERVAL '90 days')
GROUP BY
  r.id_revision,
  r.caso_id,
  r.paciente_id,
  r.fecha_revision,
  r.tipo_revision,
  r.modalidad,
  r.estado_revision,
  r.numero_revision,
  r.requiere_seguimiento,
  r.proxima_accion,
  c.tipo_caso,
  c.estado_caso
ORDER BY r.fecha_revision DESC;

COMMENT ON VIEW public.vista_actividad_clinica_reciente IS
  'BE-014: Actividad clínica reciente (últimos 90 días). Revisiones con conteos de hallazgos. Solo lectura.';

ALTER VIEW public.vista_actividad_clinica_reciente SET (security_invoker = true);

REVOKE ALL PRIVILEGES ON TABLE public.vista_actividad_clinica_reciente FROM public;
REVOKE ALL PRIVILEGES ON TABLE public.vista_actividad_clinica_reciente FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.vista_actividad_clinica_reciente FROM authenticated;

GRANT SELECT ON TABLE public.vista_actividad_clinica_reciente TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- VISTA 3: vista_carga_trabajo_terapeutica
-- Propósito: métricas de carga activa por paciente (para panel de salud operativa)
-- Rol objetivo: admin (no expone clínica directa a finanzas)
-- Nota de seguridad: casos/trabajos/revisiones solo restringen SELECT a
-- public.es_terapeuta_o_admin() (terapeuta O admin), sin filtro por
-- propiedad/paciente. Sin un filtro adicional, un terapeuta podría ver
-- carga agregada de TODOS los pacientes (no solo los propios), lo cual
-- contradice docs/control/BE-014_VISTAS_CLINICAS_AGREGADAS.md ("Uso
-- esperado: Panel de salud operativa para admin"). Se agrega
-- public.es_admin() como filtro explícito, siguiendo el mismo patrón que
-- 20260706000001_crear_vista_riesgo_abandono_casos.sql.
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.vista_carga_trabajo_terapeutica AS
SELECT
  c.paciente_id,
  COUNT(DISTINCT c.id_caso) FILTER (WHERE c.estado_caso NOT IN ('Cerrado', 'Archivado')) AS casos_activos,
  COUNT(DISTINCT t.id_trabajo) FILTER (WHERE t.estado_trabajo NOT IN ('Cerrado', 'Anulado')) AS trabajos_en_curso,
  COUNT(DISTINCT t.id_trabajo) FILTER (WHERE t.requiere_seguimiento = TRUE AND t.estado_trabajo NOT IN ('Cerrado', 'Anulado')) AS trabajos_con_seguimiento,
  COUNT(DISTINCT r.id_revision) FILTER (WHERE r.fecha_revision >= (CURRENT_DATE - INTERVAL '30 days')) AS revisiones_ultimo_mes,
  MAX(r.fecha_revision) AS ultima_revision_global,
  ROUND(AVG(t.porcentaje_avance_general) FILTER (WHERE t.estado_trabajo NOT IN ('Anulado')))::integer AS avance_global_promedio
FROM
  public.casos c
  LEFT JOIN public.trabajos t   ON t.caso_id = c.id_caso
  LEFT JOIN public.revisiones r ON r.caso_id = c.id_caso
WHERE
  public.es_admin()
GROUP BY c.paciente_id;

COMMENT ON VIEW public.vista_carga_trabajo_terapeutica IS
  'BE-014: Carga terapéutica agregada por paciente. No expone datos clínicos directos. Solo lectura. Restringida a admin (public.es_admin()).';

ALTER VIEW public.vista_carga_trabajo_terapeutica SET (security_invoker = true);

REVOKE ALL PRIVILEGES ON TABLE public.vista_carga_trabajo_terapeutica FROM public;
REVOKE ALL PRIVILEGES ON TABLE public.vista_carga_trabajo_terapeutica FROM anon;
REVOKE ALL PRIVILEGES ON TABLE public.vista_carga_trabajo_terapeutica FROM authenticated;

GRANT SELECT ON TABLE public.vista_carga_trabajo_terapeutica TO authenticated;
