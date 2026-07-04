# QA-006C - Revalidacion post-merge navegacion filtrada por rol

## Estado

Ejecutada local/demo post-merge.

## Fecha

2026-07-03

## Rama

`qa-006c-revalidacion-ui023-postmerge`

## Origen

- QA-006.
- QA-006A.
- QA-006B.
- UI-023.
- SEC-007B.
- PROD-001.

## Base validada

- `main` actualizado con PR #74 integrado.
- Commit base local: `f334f6f` incluye PR #74 y PR #72.
- Servidor local: `http://127.0.0.1:5173`.
- Navegador integrado: disponible.
- Usuarios demo/locales: identidades ficticias preparadas por SEC-007B.
- Credenciales: leidas solo desde archivo local ignorado por Git; no se registran en documentacion.

## Objetivo

Confirmar sobre `main` que UI-023 resuelve la observacion de QA-006B: el menu visible debe estar filtrado por rol en desktop y drawer mobile, manteniendo los guards de ruta.

## Casos ejecutados

| Caso | Rol / contexto | Resultado observado | Estado |
| --- | --- | --- | --- |
| QA006C-001 | Admin desktop | Ve Inicio, Pacientes, Consultas, Evaluaciones, Casos, Agenda, Finanzas/Pagos, Reportes y Configuracion. Accede a `/agenda`. | OK |
| QA006C-002 | Terapeuta desktop | Ve Inicio, Pacientes, Consultas, Evaluaciones, Casos, Agenda y Reportes. No ve Finanzas. `/finanzas` redirige a `/pacientes`. | OK |
| QA006C-003 | Finanzas desktop | Ve Inicio, Finanzas/Pagos y Reportes. No ve Pacientes, Consultas, Evaluaciones, Casos ni Agenda. `/pacientes` y `/casos` redirigen a `/finanzas`. | OK |
| QA006C-004 | Finanzas mobile `390x844` | El drawer abre y muestra Inicio, Finanzas/Pagos y Reportes. No muestra superficies clinicas ni Agenda. | OK |

## Restricciones respetadas

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

- Validacion visual local/demo post-merge desktop/mobile: OK.
- `git diff --check`: OK.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia existente de chunk Vite mayor a 500 kB.

## Riesgos pendientes

- QA-006 aun mantiene fases posteriores para Reportes, Finanzas, Auth, RLS/Storage y no exposicion sensible.
- `PagosCasoPanel` sigue como superficie sensible a revisar si se define visibilidad financiera minima para Terapeuta.
- PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

## Resultado

QA-006C confirma que UI-023 queda cerrada post-merge para navegacion visible por rol.

La siguiente fase recomendada es continuar QA-006 por bloques: Reportes, Finanzas, Auth y RLS/Storage, sin agrupar tareas sensibles en un solo PR.
