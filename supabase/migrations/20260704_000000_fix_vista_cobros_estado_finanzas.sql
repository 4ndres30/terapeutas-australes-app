-- Migración: Corregir vista_cobros_estado para acceso a Finanzas
-- Responsable: Claude / DEC-038 RLS Fixes
-- Fecha: 2026-07-04
-- Descripción:
--   La vista vista_cobros_estado tenía WHERE clause restringido solo a admin().
--   Finanzas necesita acceso a esta vista para validar historial de cobros/pagos.
--   Se agrega OR es_finanzas_o_admin() al WHERE clause.

CREATE OR REPLACE VIEW public.vista_cobros_estado AS
SELECT
  c.id AS id_cobro,
  c.paciente_id,
  c.consulta_id,
  c.evaluacion_id,
  c.caso_id,
  c.revision_id,
  c.trabajo_id,
  c.fecha_cobro,
  c.monto_cobro,
  c.estado_cobro,
  p.id AS id_pago,
  p.fecha_pago,
  p.monto_pagado,
  p.metodo_pago,
  (c.monto_cobro - COALESCE(p.monto_pagado, 0)) AS saldo_pendiente,
  p.observaciones
FROM cobros c
LEFT JOIN pagos p ON c.id = p.cobro_id AND p.estado_pago != 'cancelado'
WHERE public.es_admin() OR public.es_finanzas_o_admin();

GRANT SELECT ON public.vista_cobros_estado TO authenticated;
