-- Migración: Corregir vista_cobros_estado para acceso a Finanzas
-- Responsable: Claude / DEC-038 RLS Fixes
-- Fecha: 2026-07-04
-- Descripción:
--   La vista vista_cobros_estado (definida en 20260627231000_crear_vista_finanzas_unidades_cobrables.sql)
--   tenía WHERE clause restringido solo a public.es_admin().
--   Finanzas necesita acceso a esta vista para validar historial de cobros/pagos
--   sin depender de queries directas a la tabla cobros.
--
--   Se reemplaza el cuerpo por el mismo definido en 20260627231000 (misma
--   lista/orden de columnas, para preservar security_invoker=true y el GRANT
--   ya existentes vía CREATE OR REPLACE VIEW) cambiando únicamente el WHERE:
--   public.es_finanzas_o_admin() ya incluye 'admin' en su definición
--   (rol_usuario_actual() in ('admin','finanzas')), por lo que no hace falta
--   el OR es_admin() adicional.
--
--   Un intento anterior de esta migración asumía columnas/PK inexistentes
--   (c.id, p.id, p.monto_pagado, estado_pago = 'cancelado' en minúscula) y
--   perdía la agregación de pagos/estado_calculado: no habría aplicado, y de
--   haber aplicado habría reemplazado la vista real por una con otra forma.

CREATE OR REPLACE VIEW public.vista_cobros_estado AS
SELECT
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
  COALESCE(SUM(p.monto_pago) FILTER (WHERE p.estado_pago IN ('Registrado', 'Confirmado')), 0) AS monto_pagado,
  c.monto_total - COALESCE(SUM(p.monto_pago) FILTER (WHERE p.estado_pago IN ('Registrado', 'Confirmado')), 0) AS saldo_pendiente,
  CASE
    WHEN c.estado_cobro IN ('Anulado', 'Condonado') THEN c.estado_cobro
    WHEN COALESCE(SUM(p.monto_pago) FILTER (WHERE p.estado_pago IN ('Registrado', 'Confirmado')), 0) <= 0 THEN 'Pendiente'
    WHEN COALESCE(SUM(p.monto_pago) FILTER (WHERE p.estado_pago IN ('Registrado', 'Confirmado')), 0) < c.monto_total THEN 'Parcial'
    ELSE 'Pagado'
  END AS estado_calculado
FROM public.cobros c
LEFT JOIN public.pagos p ON p.cobro_id = c.id_cobro
WHERE public.es_finanzas_o_admin()
GROUP BY c.id_cobro;
