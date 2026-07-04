# QA-006D - Validacion Reportes y Finanzas por rol

## Estado

Ejecutada local/demo.

## Fecha

2026-07-03

## Rama

`qa-006d-reportes-finanzas-roles`

## Origen

- QA-006.
- QA-006C.
- UI-016.
- BE-016.
- SEC-004.
- SEC-007B.
- PROD-001.

## Base validada

- `main` actualizado con PR #75 integrado.
- Servidor local: `http://127.0.0.1:5173`.
- Navegador integrado: disponible.
- Usuarios demo/locales: identidades ficticias preparadas por SEC-007B.
- Credenciales: leidas solo desde archivo local ignorado por Git; no se registran en documentacion.

## Objetivo

Validar que `/reportes` y `/finanzas` mantengan separacion visual por rol y que Finanzas no vea superficies clinicas ni señales visibles de datos clinicos sensibles en esta pasada local/demo.

## Casos ejecutados

| Caso | Rol / ruta | Resultado observado | Estado |
| --- | --- | --- | --- |
| QA006D-001 | Admin `/reportes` | Encabezado `Reportes`; secciones clinicas, operativas y financieras autorizadas. | OK |
| QA006D-002 | Terapeuta `/reportes` | Encabezado `Reportes clinicos`; secciones clinicas y operativas. No aparecen secciones financieras. | OK |
| QA006D-003 | Terapeuta `/finanzas` | Redirige a `/pacientes`. | OK |
| QA006D-004 | Finanzas `/reportes` | Encabezado `Reportes financieros`; secciones financieras y cobros administrativos. No aparecen secciones clinicas. | OK |
| QA006D-005 | Finanzas `/finanzas` | Encabezado `Cobros y Pagos`; secciones `Metricas financieras`, `Cobros reales` y `Pagos reales`. | OK |

## Senales revisadas

- Finanzas no muestra `storage_path`.
- Finanzas no muestra texto literal `email`.
- Finanzas no muestra texto literal `telefono`.
- Finanzas no muestra `motivo de consulta`.
- Terapeuta no accede a `/finanzas`.
- Finanzas no ve secciones `Indicadores clinicos`, `Panel operativo` ni `Actividad clinica reciente` en `/reportes`.

## Restricciones respetadas

- No se modifico codigo fuente funcional.
- No se modifico `.env`.
- No se modificaron migraciones.
- No se modifico Auth/RLS.
- No se crearon usuarios.
- No se modifico `usuarios_internos`.
- No se ejecuto SQL manual.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Validaciones

- Validacion visual local/demo por rol: OK.
- `git diff --check`: OK.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia existente de chunk Vite mayor a 500 kB.

## Riesgos pendientes

- QA-006 aun mantiene fases posteriores para Auth y RLS/Storage.
- BE-023 sigue pendiente para definir alias/codigo administrativo persistente y reducir exposicion de identificadores internos hacia Finanzas.
- BE-025 sigue pendiente para contrato de campos financieros permitidos/prohibidos.
- PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

## Resultado

QA-006D confirma local/demo que Reportes y Finanzas mantienen separacion visual por rol.

La siguiente fase recomendada es continuar con Auth y RLS/Storage en bloques separados, sin agrupar tareas sensibles.
