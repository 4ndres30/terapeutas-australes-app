# PROD-001 / SEC-001 — Auditoría de preparación para datos reales

## Estado general

No listo para datos reales / requiere ajustes críticos antes de producción.

## Resultado

El proyecto está listo solo para pruebas locales/demo con datos ficticios. No debe usarse como sistema oficial con datos reales de pacientes hasta cerrar PROD-001.

## Base técnica existente

El proyecto ya cuenta con una base técnica relevante:

- Supabase Auth.
- Tabla `usuarios_internos`.
- Roles internos.
- RLS habilitado en tablas clínicas y financieras.
- Policies por rol.
- Seed demo local documentado.

## Brechas críticas

- No hay separación formal local/demo/staging/producción.
- No hay validación runtime documentada de RLS por rol.
- No hay backup/restauración probado.
- No hay consentimiento informado definido.
- No hay bitácora/auditoría de cambios sensibles.
- No hay checklist de habilitación productiva.
- No hay barrera operativa contra ejecución de seeds demo en ambiente equivocado.

## Brechas medias

- Reportes puede requerir diseño específico por rol.
- Finanzas lee datos de pacientes y debe definirse su alcance exacto.
- Falta política de eliminación/anulación.
- Falta política de retención de datos.
- Falta indicador visual de ambiente activo.
- Falta checklist de migración segura hacia producción.

## Condiciones mínimas antes del primer paciente real

- Supabase staging/producción separados de local/demo.
- Variables de ambiente separadas y documentadas.
- RLS probado con usuarios reales de prueba: admin, terapeuta y finanzas.
- Backup y restauración probados.
- Consentimiento informado definido.
- Política de eliminación/anulación definida.
- Seeds demo aislados y prohibidos en producción.
- Reportes y finanzas revisados por rol.
- Checklist pre-producción aprobado por Control de Desarrollo.
- Aprobación explícita de Javier para carga real.

## Tareas derivadas

Este informe activa tareas SEC, BE, UI, DOC y PROD registradas en la lista maestra de pendientes.

## Decisión de control

No cargar datos reales todavía.

PROD-001 se mantiene como bloqueo operativo antes de usar la aplicación como sistema oficial con pacientes reales.
