# QA-006F - Validacion RLS/Storage local por rol

## Estado

Ejecutada local/demo.

## Fecha

2026-07-04

## Rama

`qa-006f-validacion-rls-storage`

## Origen

- QA-006.
- QA-006D.
- QA-006E.
- SEC-001.
- SEC-002.
- SEC-004.
- BE-022.
- UI-022.
- PROD-001.

## Objetivo

Revalidar, en entorno local/demo, que RLS y Storage mantienen la separacion esperada por rol despues del bloque QA/Finanzas y Auth local/demo.

Esta tarea no modifica policies, Auth, migraciones, codigo funcional ni datos reales.

## Alcance

- Supabase local en `127.0.0.1`.
- PostgreSQL local por `psql`.
- Lectura estatica de migraciones y auditorias previas.
- Consultas runtime de solo lectura con usuarios internos locales activos.
- Simulacion por rol con `SET LOCAL ROLE authenticated` y claims locales.

## Fuera de alcance

- Supabase remoto.
- `supabase db push`.
- Produccion.
- `.env`.
- Credenciales.
- Usuarios reales.
- Datos reales.
- Fotos reales.
- Cambios de Auth/RLS.
- Cambios en `supabase/migrations/`.
- Cambios en `src/`.

## Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| `git status --short --branch` | OK, `main` limpio antes de rama y rama `qa-006f-validacion-rls-storage` creada. |
| `gh pr list --state open` | OK, sin PRs abiertos despues de integrar CTRL-012. |
| Lectura `docs/control` | OK, siguiente tarea vigente confirmada como QA-006F. |
| Conectividad local `127.0.0.1:54321` | OK. |
| Conectividad local `127.0.0.1:54322` | OK. |
| Inventario usuarios internos activos por rol | OK, existen usuarios locales para `admin`, `terapeuta` y `finanzas`. |
| Policies RLS relevantes | OK, existen policies para clinica, finanzas, `fotos_elementos_caso` y `storage.objects`. |
| Bucket `elementos-caso` | OK, bucket privado (`public = false`). |
| `git diff --check` | OK, solo advertencias habituales LF/CRLF del workspace. |
| `npm run lint` | OK. |
| `npm run build` | OK, con warning conocido de Vite por chunk mayor a 500 kB. |
| `git status --short --branch` | OK, solo cambios documentales esperados en la rama. |

## Evidencia runtime resumida

La matriz local uso usuarios internos activos y no registro correos, passwords, tokens ni service role.

| Rol simulado | Helper activo | Clinica | Fotos metadata | Storage `elementos-caso` | Cobros/pagos |
| --- | --- | --- | --- | --- | --- |
| `admin` | OK | Permitido | Permitido | Permitido | Permitido |
| `terapeuta` | OK | Permitido | Permitido | Permitido | Bloqueado |
| `finanzas` | OK | Bloqueado | Bloqueado | Bloqueado | Permitido |

Resultado observado en conteos runtime locales:

- `admin`: ve pacientes, metadatos de fotos, objetos Storage del bucket privado, cobros y pagos.
- `terapeuta`: ve pacientes, metadatos de fotos y objetos Storage del bucket privado; no ve cobros ni pagos.
- `finanzas`: no ve pacientes, metadatos de fotos ni objetos Storage; ve cobros y pagos.

## Policies confirmadas

Se confirmaron policies activas para:

- `public.pacientes`: `select`, `insert`, `update` clinico.
- `public.fotos_elementos_caso`: `select`, `insert`, `update` clinico.
- `storage.objects`: `select`, `insert`, `update` para bucket `elementos-caso` y rol clinico.
- `public.cobros`: `select`, `insert`, `update` financiero.
- `public.pagos`: `select`, `insert`, `update` financiero.

No se agregaron ni modificaron policies.

## Resultado

QA-006F queda ejecutada local/demo y confirma que la separacion base RLS/Storage por rol sigue consistente con SEC-001, SEC-002 y SEC-004:

- `finanzas` no accede a clinica, fotos ni Storage clinico.
- `terapeuta` no accede a cobros/pagos directos.
- `admin` mantiene acceso transversal esperado.
- El bucket `elementos-caso` sigue privado.

## Observaciones

- La validacion es local/demo y no habilita uso real.
- SEC-001 mantiene observaciones de hardening antes de datos reales.
- BE-023 y BE-025 siguen pendientes de implementacion tecnica futura.
- SEC-006 y QA-003 siguen recomendadas para completar politica y QA especifica de fotos.
- PROD-001 sigue bloqueante.

## Riesgos pendientes

- Falta politica operativa completa de fotos, retencion y objetos huerfanos (`SEC-006`).
- Falta QA funcional especifica de fotos de elementos del caso (`QA-003`).
- Falta hardening final de grants y auditoria sensible antes de datos reales.
- Falta separacion real de ambientes antes de cualquier uso productivo.

## Recomendacion de Control

Integrar QA-006F como cierre local/demo de RLS/Storage dentro de QA-006 y continuar con `SEC-006 - Politica de fotos, retencion y objetos huerfanos` antes de ejecutar QA funcional de fotos o cualquier uso con archivos reales.
