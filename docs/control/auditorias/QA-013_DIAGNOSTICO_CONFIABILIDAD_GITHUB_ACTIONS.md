# QA-013 - Diagnostico de confiabilidad de GitHub Actions

**Fecha:** 2026-07-10
**Rama:** `qa-013-recuperar-confiabilidad-ci`
**Responsable:** Control de desarrollo (Codex)
**Nivel documental:** Nivel 2
**Estado:** Diagnostico parcial / bloqueo externo

## Resumen ejecutivo

GitHub Actions no alcanzo a ejecutar el workflow CI desde su incorporacion. Al iniciar
QA-013 existian 192 ejecuciones y todas habian terminado como `startup_failure` antes de
crear jobs: 95 eventos `push` y 97 eventos `pull_request`.

El workflow activo `CI` (`id=308145174`) tiene 0 ejecuciones. Los 192 runs quedaron asociados
a una identidad interna eliminada llamada `BuildFailed` (`id=308144935`), creada durante la
primera ingestion del archivo. El YAML vigente es valido segun `actionlint 1.7.12`, Actions
esta habilitado y la cadena npm pasa localmente.

La correccion versionada reemplazo la ruta del workflow para forzar una identidad nueva y
agrego controles acotados de confiabilidad. La validacion remota de PR #128 genero dos runs
adicionales, pero ambos volvieron a `startup_failure`, asociados a `BuildFailed` y con 0
jobs. QA-013 queda en diagnostico parcial / bloqueo externo.

## Estado inicial

- Repositorio: `4ndres30/terapeutas-australes-app` (privado, no archivado).
- `main` local/remoto: `43f2ff42fd63fd7385b02fada983d014bce690af`.
- PR #127: `MERGED` el `2026-07-10T23:59:31Z`.
- PR abiertos antes de iniciar: ninguno.
- Rama exclusiva: `qa-013-recuperar-confiabilidad-ci`.
- Archivo local ajeno: `supabase/snippets/Untitled query 315.sql`, no trackeado y excluido.
- `PROD-001`: vigente y bloqueante.

## Optimizacion aplicada al prompt

Se conservaron alcance, restricciones y estados exigidos. Se agregaron comprobaciones para
evitar atribuir el fallo al YAML o a npm sin evidencia:

- comparacion entre IDs del workflow activo y del workflow asociado a los runs;
- conteo completo de las 192 ejecuciones mediante API paginada;
- consulta de jobs, check suites, check runs y disponibilidad de logs;
- validacion independiente del YAML con `actionlint 1.7.12`, descargado desde su release y
  verificado por SHA-256;
- consulta read-only de permisos de Actions, workflows, runners, branch protection y rulesets;
- intento read-only de facturacion, sin ampliar scopes cuando GitHub exigio permiso `user`;
- reproduccion local posterior a `npm ci` y registro de duraciones aproximadas.

No se uso navegador para inferir estados que la CLI/API ya entregaban de forma estructurada.

## Ejecuciones analizadas

| Run | Evento | Rama / commit | Fecha UTC | Conclusion | Jobs |
| --- | --- | --- | --- | --- | --- |
| `29131617934` | `push` | `main` / `43f2ff4` | 2026-07-10 23:59:33 | `startup_failure` | 0 |
| `29131618193` | `pull_request` | `ctrl-015-sync-docs-post-pr-125-126` / `fc6bfbc` | 2026-07-10 23:59:33 | `startup_failure` | 0 |
| `28805413952` | `push` | `test/setup-vitest-unit-tests` / `9c58451` | 2026-07-06 16:05:13 | `startup_failure` | 0 |
| `29133444311` | `push` | `qa-013-recuperar-confiabilidad-ci` / `e28ef87` | 2026-07-11 00:49:56 | `startup_failure` | 0 |
| `29133463045` | `pull_request` | `qa-013-recuperar-confiabilidad-ci` / `e28ef87` | 2026-07-11 00:50:26 | `startup_failure` | 0 |

Resumen completo:

- Corte inicial: 192 runs, todos `startup_failure`.
- Validacion remota QA-013: 2 runs adicionales, ambos `startup_failure`.
- Corte observado tras abrir PR #128: 194 runs; 96 `push` y 98 `pull_request`.
- Runs asociados al workflow activo `CI`: 0.
- Runs asociados a `BuildFailed`: 194.

## Evidencia de startup_failure

- `gh run view 29131617934` informa: el run probablemente fallo por un problema del archivo
  de workflow.
- La API devuelve `path: BuildFailed`, `workflow_id: 308144935` y
  `conclusion: startup_failure`.
- `gh run view ... --json jobs` devuelve `jobs: []`.
- El endpoint de jobs devuelve `total_count: 0`.
- La check suite termina como `startup_failure` con `latest_check_runs_count: 0`.
- `gh run view ... --log-failed` responde `log not found`.
- Los dos runs de PR #128 conservan `path: BuildFailed`, `workflow_id: 308144935` y
  `jobs: []`, aun despues de reemplazar la ruta versionada del workflow.

El workflow fallo antes de crear jobs.

## Estado del workflow

Configuracion original revisada:

- archivo unico `.github/workflows/ci.yml`;
- workflow visible `CI`, estado `active`, ID `308145174`;
- eventos `push` a `main` y `pull_request`;
- runner `ubuntu-latest`;
- Node 20;
- `npm ci`, lint, build y tests;
- `package-lock.json` existente, `lockfileVersion: 3` y compatible con `npm ci`;
- scripts `lint`, `test` y `build` existentes.

Permisos del repositorio:

- Actions: `enabled=true`;
- acciones permitidas: `all`;
- permisos por defecto del token: `read`;
- runners self-hosted: 0; el workflow usa GitHub-hosted `ubuntu-latest`.

`actionlint 1.7.12` no reporta errores en el archivo original.

## Reproduccion local

Entorno:

- Node: `v24.16.0`.
- npm: `11.13.0`.

Resultados iniciales:

| Comando | Resultado | Duracion aproximada |
| --- | --- | --- |
| `npm ci` | OK en segundo intento | 32 s |
| `npm run lint` | OK | 17.3 s |
| `npm run test` | 2 archivos / 24 tests OK | 4.1 s |
| `npm run build` | OK | 16.1 s |
| `git diff --check` | OK | 0.2 s |

El primer `npm ci` local fallo con `EPERM` porque el servidor Vite mantenia abierto el
binario nativo de Rolldown. Se detuvo exclusivamente ese proceso de desarrollo y el segundo
intento finalizo con `exit 0`; no es una falla del lockfile ni del workflow Linux.

## Causa raiz

GitHub no esta ejecutando la identidad activa del workflow. Desde la primera ingestion del
archivo, cada evento se dirige a la identidad eliminada `BuildFailed`, mientras el workflow
activo `CI` permanece con 0 runs. Esta asociacion obsoleta ocurre antes de construir el grafo
de jobs y explica la ausencia total de logs.

La sustitucion versionada por una ruta nueva no modifico el comportamiento en PR #128. Por
lo tanto, la causa exacta no puede resolverse desde los archivos, CLI o API disponibles: el
bloqueo persiste en la capa externa de ingestion/configuracion de GitHub Actions.

No se encontro un error sintactico actual que justifique editar comandos npm. La correccion
debe forzar un registro limpio del workflow, no modificar codigo funcional ni dependencias.

## Clasificacion del fallo

**Categoria I - combinacion de A y H.**

- **A, configuracion/registro del workflow:** todos los eventos se asocian a `BuildFailed` y
  nunca al workflow activo.
- **H, informacion parcial del servicio:** GitHub no expone por CLI/API el mensaje interno de
  la primera ingestion, la correccion versionada no cambia el resultado y la consulta de
  facturacion requiere scope `user`, no disponible.

Descartado con evidencia:

- B/C: Actions esta habilitado y permite todas las acciones.
- D: el fallo ocurre antes de crear jobs o solicitar runner.
- F: instalacion, lint, tests y build pasan localmente.
- G: los eventos `push` y `pull_request` si se generan; quedan asociados al workflow errado.

## Correccion aplicada

- Se elimina `.github/workflows/ci.yml`.
- Se crea `.github/workflows/ci-quality.yml`, forzando una identidad de workflow nueva.
- Se mantienen checkout, Node 20, `npm ci`, lint, tests y build.
- Se agrega `permissions: contents: read` como minimo privilegio.
- Se agrega cache npm con dependencia explicita en `package-lock.json`.
- Se agrega `timeout-minutes: 15`.
- Se agrega concurrencia cancelable por workflow/ref.
- Se asigna al job el nombre estable `Quality gate`.
- Se sincronizan `docs/DEVELOPMENT.md` y `docs/ARCHITECTURE.md` con la nueva ruta y cadena.

No se modifican `package.json`, `package-lock.json`, dependencias ni codigo funcional.

Resultado remoto: la correccion propuesta no logro crear jobs en PR #128. Se conserva en el
PR para revision humana, sin iterar nuevamente sobre YAML por ensayo y error.

## Configuracion manual pendiente

No se modifico configuracion externa. Si el workflow nuevo vuelve a fallar antes de crear
jobs, el propietario debe revisar en GitHub:

1. `Settings > Billing & licensing > Usage`, filtrando producto Actions.
2. Presupuesto o limite que impida consumo de minutos en repositorios privados.
3. Estado de pagos del propietario, si GitHub muestra una advertencia.
4. `Settings > Actions > General`, confirmando que Actions siga habilitado.

Despues de cualquier ajuste manual debe reejecutarse el run del PR una sola vez y comprobar
que se cree `Quality gate`.

## Validaciones posteriores

Resultados locales despues del cambio:

| Validacion | Resultado | Duracion aproximada |
| --- | --- | --- |
| `actionlint 1.7.12 .github/workflows/ci-quality.yml` | OK | < 1 s |
| `npm ci` | 214 paquetes, 0 vulnerabilidades, exit 0 | 32.7 s |
| `npm run lint` | OK | 16.6 s |
| `npm run test` | 2 archivos / 24 tests OK | 4.0 s |
| `npm run build` | OK | 15.1 s |
| `git diff --check` | OK | < 1 s |

Resultados remotos de PR #128:

| Run | Evento | Resultado |
| --- | --- | --- |
| `29133444311` | `push` | `startup_failure`, `BuildFailed`, 0 jobs, sin logs |
| `29133463045` | `pull_request` | `startup_failure`, `BuildFailed`, 0 jobs, sin logs |

No se creo `Quality gate`; `gh pr checks 128` informa que no existen checks reportados.

## Riesgos restantes

- El detalle de facturacion no fue accesible sin ampliar el token con scope `user`.
- GitHub conserva el bloqueo con la identidad versionada nueva; no corresponde seguir
  cambiando YAML y debe revisarse facturacion/configuracion manual.
- No existe todavia un nombre de check exitoso confirmado para branch protection.
- `PROD-001` sigue bloqueante.

## Branch protection

Estado actual: no configurable en el plan/visibilidad actuales. Tanto el endpoint de branch
protection como el de rulesets responden HTTP 403: `Upgrade to GitHub Pro or make this
repository public to enable this feature`.

No se activa automaticamente. Cuando el plan lo permita y QA-013 este cerrada, configurar:

- requerir pull request;
- requerir el check exitoso cuyo nombre remoto se confirme para `Quality gate`;
- requerir rama actualizada;
- bloquear push directo;
- requerir conversaciones resueltas;
- conservar un unico PR activo.

## Proxima tarea recomendada

Despues de cerrar QA-013: `UI-047 - Normalizacion de queryKeys TanStack Query`.

No iniciar UI-047, UI-048, QA-012, UI-049 ni UI-050 dentro de esta ejecucion.

## Veredicto

Diagnostico parcial / bloqueo externo. La correccion versionada pasa localmente pero PR #128
reproduce `startup_failure` sin jobs. QA-013 permanece abierta, el PR queda para revision
humana y no debe mergearse hasta resolver la configuracion externa y obtener un run exitoso.
