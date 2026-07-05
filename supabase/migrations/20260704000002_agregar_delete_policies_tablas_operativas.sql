-- Migración: Agregar DELETE policies en tablas operativas
-- Responsable: Claude / DEC-038 RLS Fixes
-- Fecha: 2026-07-04
-- Descripción:
--   Implementar anulación lógica en lugar de DELETE físico.
--   Las policies requieren que la fila esté anulada logicamente (estado específico)
--   antes de permitir DELETE, o solo admin puede eliminar.
--   Esto previene borrado accidental de datos activos.
--   NOTA: valores de estado corregidos contra el esquema real (pacientes.estado
--   en vez de la columna inexistente estado_activo; 'Cancelada'/'Anulada'/'Anulado'
--   capitalizados en vez de 'anulada'/'anulado' en minusculas).

-- Pacientes: solo si estado = 'inactivo' (anulado)
CREATE POLICY "pacientes_delete_anulado_solo" ON pacientes
  FOR DELETE
  USING (estado = 'inactivo' AND public.es_admin());

-- Consultas: solo si estado_consulta = 'Cancelada'
CREATE POLICY "consultas_delete_anulado_solo" ON consultas
  FOR DELETE
  USING (
    (estado_consulta = 'Cancelada' AND public.es_terapeuta_o_admin())
    OR public.es_admin()
  );

-- Evaluaciones: solo si estado_evaluacion = 'Anulada'
CREATE POLICY "evaluaciones_delete_anulado_solo" ON evaluaciones
  FOR DELETE
  USING (
    (estado_evaluacion = 'Anulada' AND public.es_terapeuta_o_admin())
    OR public.es_admin()
  );

-- Casos: solo si estado_caso = 'Anulado'
CREATE POLICY "casos_delete_anulado_solo" ON casos
  FOR DELETE
  USING (
    (estado_caso = 'Anulado' AND public.es_terapeuta_o_admin())
    OR public.es_admin()
  );

-- Elementos caso: solo admin
CREATE POLICY "elementos_caso_delete_admin_solo" ON elementos_caso
  FOR DELETE
  USING (public.es_admin());

-- Revisiones: solo admin
CREATE POLICY "revisiones_delete_admin_solo" ON revisiones
  FOR DELETE
  USING (public.es_admin());

-- Trabajos: solo admin
CREATE POLICY "trabajos_delete_admin_solo" ON trabajos
  FOR DELETE
  USING (public.es_admin());

-- Cobros: solo admin
CREATE POLICY "cobros_delete_admin_solo" ON cobros
  FOR DELETE
  USING (public.es_admin());

-- Pagos: solo admin
CREATE POLICY "pagos_delete_admin_solo" ON pagos
  FOR DELETE
  USING (public.es_admin());
