-- Migración: Crear vista_finanzas_fotos_auditoria para Finanzas
-- Responsable: Claude / DEC-038 RLS Fixes
-- Fecha: 2026-07-04
-- Descripción:
--   Finanzas necesita poder auditar fotos adjuntas a cobros (a través del
--   caso al que pertenecen, ya que fotos_elementos_caso no referencia
--   cobros directamente). Esta vista expone solo lo necesario: cobro +
--   nombre de archivo + storage_path, sin descarga directa.
--   Restricta a Finanzas y Admin solamente.
--   Solo fotos asociadas a un caso con cobro (LEFT JOIN + filtro NOT NULL).
--
--   Un intento anterior de esta migración asumía PK genérica `id` en
--   cobros/fotos_elementos_caso (las reales son id_cobro e
--   id_foto_elemento_caso) y una columna fec.fecha_carga inexistente
--   (la real es created_at): no habría aplicado contra el esquema real.

CREATE VIEW public.vista_finanzas_fotos_auditoria AS
SELECT
  c.id_cobro,
  c.paciente_id,
  c.caso_id,
  fec.id_foto_elemento_caso AS id_foto,
  fec.elemento_caso_id,
  fec.nombre_archivo,
  fec.storage_path,
  fec.mime_type,
  fec.created_at AS fecha_carga,
  fec.estado_foto
FROM public.cobros c
LEFT JOIN public.fotos_elementos_caso fec
  ON c.caso_id = fec.caso_id
WHERE public.es_finanzas_o_admin()
  AND fec.id_foto_elemento_caso IS NOT NULL;

GRANT SELECT ON public.vista_finanzas_fotos_auditoria TO authenticated;
