-- Migración: Crear vista_finanzas_fotos_auditoria para Finanzas
-- Responsable: Claude / DEC-038 RLS Fixes
-- Fecha: 2026-07-04
-- Descripción:
--   Finanzas necesita poder auditar fotos adjuntas a cobros.
--   Esta vista expone solo información necesaria: cobro + nombre de archivo + storage_path.
--   Restricto a Finanzas y Admin solamente.
--   Solo fotos asociadas a cobros (LEFT JOIN con cobros).

CREATE VIEW public.vista_finanzas_fotos_auditoria AS
SELECT
  c.id AS id_cobro,
  c.paciente_id,
  c.caso_id,
  fec.id AS id_foto,
  fec.elemento_caso_id,
  fec.nombre_archivo,
  fec.storage_path,
  fec.mime_type,
  fec.fecha_carga,
  fec.estado_foto
FROM cobros c
LEFT JOIN fotos_elementos_caso fec
  ON c.caso_id = fec.caso_id
WHERE (public.es_finanzas_o_admin() OR public.es_admin())
  AND fec.id IS NOT NULL;

GRANT SELECT ON public.vista_finanzas_fotos_auditoria TO authenticated;
