# QA-013 - Diagnostico de confiabilidad de GitHub Actions

**Fecha:** 2026-07-10; revalidacion 2026-07-11
**Rama:** `qa-013-recuperar-confiabilidad-ci`
**Responsable:** Control de desarrollo (Codex)
**Nivel documental:** Nivel 2
**Estado:** Cerrada con CI remoto exitoso

## Resumen ejecutivo

GitHub Actions no alcanzo a ejecutar el workflow CI desde su incorporacion. Al iniciar
QA-013 existian 192 ejecuciones y todas habian terminado como `startup_failure` antes de
crear jobs: 95 eventos `push` y 97 eventos `pull_request`.

El workflow activo `CI` (`id=308145174`) tiene 0 ejecuciones. Los 192 runs quedaron asociados
a una identidad interna eliminada llamada `BuildFailed` (`id=308144935`), creada durante la
primera ingestion del archivo. El YAML vigente es valido segun `actionlint 1.7.12`, Actions
esta habilitado y la cadena npm pasa localmente.

La correccion versionada reemplazo la ruta del workflow para forzar una identidad nueva y
agrego controles acotados de confiabilidad. Mientras el repositorio fue privado, seis runs
adicionales volvieron a `startup_failure`, asociados a `BuildFailed` y con 0 jobs.

El 2026-07-11 el propietario hizo publico el repositorio y se disparo una validacion nueva
mediante el commit vacio `63297ab`. GitHub registro `.github/workflows/ci-quality.yml` como
workflow `CI` (`id=311082990`), creo el run `29138928820`, el check `Quality gate` y un job
real. El job no recibio runner ni ejecuto steps: su anotacion informa exactamente `The job
was not started because your account is locked due to a billing issue.` La causa queda
confirmada como categoria E, problema de cuenta/facturacion.

El commit documental posterior `c385c85` genero el run `29139105668` sin modificar el
workflow. GitHub asigno runner y `Quality gate` completo checkout, setup de Node, `npm ci`,
lint, 24 tests y build en 29 segundos. Con esta evidencia QA-013 queda cerrada con CI remoto
exitoso.

## Estado inicial

- Repositorio: `4ndres30/terapeutas-australes-app` (privado, no archivado).
- `main` local/remoto: `43f2ff42fd63fd7385b02fada983d014bce690af`.
- PR #127: `MERGED` el `2026-07-10T23:59:31Z`.
- PR abiertos antes de iniciar: ninguno.
- Rama exclusiva: `qa-013-recuperar-confiabilidad-ci`.
- Archivo local ajeno: `supabase/snippets/Untitled query 315.sql`, no trackeado y excluido.
- `PROD-001`: vigente y bloqueante.

Cambio externo posterior: al corte de revalidacion el repositorio es publico. Este cambio no
fue realizado por la rama, pero permitio registrar y observar el workflow nuevo.

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
- revalidacion posterior al cambio de visibilidad, incluyendo job, check run y anotaciones;
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
| `29133601911` | `pull_request` | `qa-013-recuperar-confiabilidad-ci` / `caa17a7` | 2026-07-11 00:54:26 | `startup_failure` | 0 |
| `29138928820` | `pull_request` | `qa-013-recuperar-confiabilidad-ci` / `63297ab` | 2026-07-11 04:01:11 | `failure` | 1, sin runner/steps |
| `29139105668` | `pull_request` | `qa-013-recuperar-confiabilidad-ci` / `c385c85` | 2026-07-11 04:07:38 | `success` | 1, todos los steps OK |

Resumen completo:

- Corte inicial: 192 runs, todos `startup_failure`.
- Validacion remota privada QA-013: 6 runs adicionales, todos `startup_failure`.
- Corte de cierre: 200 runs totales; 97 `push` y 103
  `pull_request`.
- Runs asociados a `BuildFailed`: 198.
- Runs asociados al workflow nuevo `CI` (`311082990`): 2, uno fallido por facturacion y uno
  exitoso.

## Evidencia de startup_failure

- `gh run view 29131617934` informa: el run probablemente fallo por un problema del archivo
  de workflow.
- La API devuelve `path: BuildFailed`, `workflow_id: 308144935` y
  `conclusion: startup_failure`.
- `gh run view ... --json jobs` devuelve `jobs: []`.
- El endpoint de jobs devuelve `total_count: 0`.
- La check suite termina como `startup_failure` con `latest_check_runs_count: 0`.
- `gh run view ... --log-failed` responde `log not found`.
- Los seis runs privados de PR #128 conservan `path: BuildFailed`,
  `workflow_id: 308144935` y `jobs: []`, aun despues de reemplazar la ruta versionada del
  workflow.
- Tras hacer publico el repositorio, `29138928820` usa
  `path: .github/workflows/ci-quality.yml`, `workflow_id: 311082990` y crea el job
  `Quality gate` (`86508389905`).
- El job tiene `runner_id: 0`, `steps: []` y no genera logs.
- La API de anotaciones del check devuelve el mensaje exacto: `The job was not started
  because your account is locked due to a billing issue.`
- El run siguiente `29139105668` usa la misma identidad y definicion, recibe runner y completa
  todos los steps con conclusion `success`.

El sintoma evoluciono de fallos de ingestion sin jobs a un check correctamente registrado
que GitHub bloquea antes de asignar runner.

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

Identidades observadas tras la revalidacion:

- `BuildFailed` (`308144935`), eliminada: 198 runs historicos;
- `CI` de `.github/workflows/ci.yml` en `main` (`308145174`): 0 runs;
- `CI` de `.github/workflows/ci-quality.yml` en PR #128 (`311082990`): 2 runs y el check
  estable `Quality gate`; el segundo run fue exitoso.

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

La causa confirmada del primer bloqueo posterior al cambio de visibilidad fue una restriccion
de cuenta por facturacion. GitHub registro el workflow, creo el check y construyo el job, pero
lo detuvo antes de asignar un runner. La evidencia primaria es la anotacion del job
`86508389905`: `The job was not started because your account is locked due to a billing
issue.`

Los 198 runs historicos asociados a `BuildFailed` no conservan una anotacion equivalente, por
lo que no se afirma retrospectivamente que todos tuvieron la misma causa. Sin embargo, el
bloqueo de cuenta confirmado explica de forma consistente que CI no pudiera comenzar. La
hipotesis anterior de ingestion/registro queda superada: el workflow nuevo se registra
correctamente. El run exitoso posterior demuestra que el bloqueo externo dejo de impedir la
ejecucion; no hubo un cambio de workflow entre ambos runs.

No existe evidencia de un error sintactico o de comandos npm que justifique mas cambios en
archivos versionados.

## Clasificacion del fallo

**Categoria E - problema de cuenta, facturacion o limite de minutos.**

- La anotacion remota identifica explicitamente una cuenta bloqueada por un problema de
  facturacion.
- El job se crea, pero no recibe runner ni steps, comportamiento coherente con un bloqueo
  previo al consumo de capacidad.
- El run posterior exitoso confirma que no existia un segundo fallo en YAML o en la cadena
  npm una vez liberada la ejecucion.

Descartado con evidencia:

- A: el YAML pasa `actionlint` y GitHub registra `CI / Quality gate`.
- B/C: Actions esta habilitado y permite todas las acciones.
- D: no es falta de disponibilidad de `ubuntu-latest`; la cuenta impide asignarlo.
- F: instalacion, lint, tests y build pasan localmente.
- G: el evento `pull_request` dispara el workflow nuevo.
- H: la anotacion del check ya entrega causa suficiente para clasificar el fallo actual.

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

Resultado remoto actualizado: despues del cambio externo de visibilidad, la identidad nueva
se registro y creo `CI / Quality gate`. El primer run fue bloqueado por facturacion y el
segundo completo la definicion CI reproducible con exito. La correccion se integro mediante
PR #128, sin iteraciones adicionales sobre YAML.

## Configuracion manual pendiente

No queda una correccion manual bloqueante para cerrar CI: el run `29139105668` confirma que la
cuenta puede usar un runner. Como seguimiento preventivo, el propietario debe revisar
`Billing & licensing` si reaparece el mensaje de cuenta bloqueada.

Branch protection permanece pendiente de aplicacion manual. QA-013 no la activa
automaticamente; la configuracion recomendada se detalla mas abajo.

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
| `29138928820` | `pull_request` | `failure`, `CI / Quality gate`, 1 job, sin runner/steps por bloqueo de facturacion |
| `29139105668` | `pull_request` | `success`, `CI / Quality gate`, checkout + Node + npm ci + lint + 24 tests + build OK, 29 s |

`gh pr checks 128` informa `Quality gate` exitoso. Eventos, ruta, identidad, runner y cadena
npm quedan validados remotamente.

## Riesgos restantes

- El repositorio ahora es publico; su codigo e historial quedan accesibles publicamente hasta
  que el propietario decida otro cambio de visibilidad.
- El primer run publico reporto bloqueo de facturacion; aunque el siguiente fue exitoso,
  conviene vigilar que el aviso no reaparezca.
- GitHub advierte que `actions/checkout@v4` y `actions/setup-node@v4` usan runtime Node 20
  deprecado y los fuerza a Node 24; es una advertencia no bloqueante para mantenimiento futuro.
- `main` no tiene branch protection y no existen rulesets.
- `PROD-001` sigue bloqueante.

## Branch protection

Estado actual: configurable tras hacer publico el repositorio, pero no activada. El endpoint
de branch protection responde `404 Branch not protected` y el repositorio tiene 0 rulesets.

No se activa automaticamente, por restriccion expresa de QA-013. El nombre estable ya esta
confirmado. Configuracion recomendada para aplicacion manual posterior:

- requerir pull request con al menos una aprobacion;
- requerir el check `Quality gate` exitoso;
- exigir rama actualizada antes de merge (`strict`);
- aplicar las reglas tambien a administradores para bloquear push directo;
- requerir conversaciones resueltas;
- no permitir force pushes ni eliminacion de `main`;
- conservar un unico PR activo como regla operativa del proyecto.

## Proxima tarea recomendada

Despues de cerrar QA-013: `UI-047 - Normalizacion de queryKeys TanStack Query`.

No iniciar UI-047, UI-048, QA-012, UI-049 ni UI-050 dentro de esta ejecucion.

## Veredicto

Cerrada con CI remoto exitoso. El workflow nuevo se registra, crea `CI / Quality gate`, asigna
runner y completa instalacion, lint, 24 tests y build en el run `29139105668`. PR #128 fue
integrado en `main` como `d0c22ce` el 2026-07-11; el run post-merge `29139395491` tambien paso
`Quality gate`. UI-047 comienza despues en una rama separada.
