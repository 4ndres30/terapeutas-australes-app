# CTRL-015 - Sincronizacion documental post PR #125/#126

**Fecha:** 2026-07-10
**Rama:** `ctrl-015-sync-docs-post-pr-125-126`
**Responsable:** Control de desarrollo (Codex)
**Tipo:** Sincronizacion documental / control post-merge

## Objetivo

Ordenar la documentacion de control despues de la integracion de PR #125 y PR #126 en
`main`, retirando referencias temporales que ya no representaban el estado real de
UI-045/UI-046 y dejando registrado el siguiente bloque de QA recomendado.

## Optimizacion aplicada al prompt

Se mantuvo el alcance original: orden documental, trazabilidad y preparacion de QA, sin
nuevas features funcionales.

Ajustes menores aplicados:

- Se corrigio una frase obsoleta en `README.md` sobre IMP-002, porque el documento tenia
  estado de proyecto y seguia diciendo que la derivacion hallazgo -> trabajo estaba pendiente.
- Se registro UI-047 como pendiente recomendado al confirmar que aun existen queryKeys
  `['pacientes']` compartidas en varias superficies internas.
- Se registro QA-013 como pendiente recomendado al detectar `startup_failure` en las ultimas
  corridas de GitHub Actions.
- No se amplio el alcance hacia implementacion, migraciones, Auth/RLS, Supabase remoto,
  Google/Gemini, produccion ni datos reales.

## Estado real de PR #125 y PR #126

- PR #125: `feat(ui-045): formulario plano de edicion de pacientes (DEC-044)`
  - Estado GitHub: `MERGED`
  - Rama: `feature/ui-045-edicion-plana-pacientes`
  - Base: `main`
  - Merge: `2026-07-10T21:20:30Z`

- PR #126: `feat(ui-046): preview adaptativo en el wizard de alta de pacientes (DEC-045)`
  - Estado GitHub: `MERGED`
  - Rama: `feature/ui-046-preview-adaptativo-wizard`
  - Base: `main`
  - Merge: `2026-07-10T21:34:12Z`

## Inconsistencias encontradas

- `UI-045` seguia registrada como `draft pendiente merge Javier`.
- `UI-046` seguia registrada como `rama lista, pendiente merge PR #125`.
- La tabla de vista rapida mantenia referencias a ramas feature en vez de PRs mergeados.
- `LOG-103` y `LOG-104` aun describian PRs por nombre de rama y estado temporal.
- `00_ESTADO_GENERAL_PROYECTO.md` mantenia corte 2026-07-09 y resumen hasta PR #118.
- `README.md` seguia diciendo que IMP-002 estaba pendiente, aunque PR #104 ya lo integro.
- El bloque descriptivo de `UI-044` en `01_PENDIENTES_PROYECTO.md` seguia diciendo que no
  existia ErrorBoundary, aunque PR #124 ya lo integro.

## Archivos revisados

- `README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/09_NIVELES_DOCUMENTACION.md`
- `docs/control/auditorias/`
- `src/pages/ConsultasPage.tsx`
- `src/pages/EvaluacionesPage.tsx`
- `src/pages/PacientesPage.tsx`

## Cambios realizados

- `00_ESTADO_GENERAL_PROYECTO.md`: fecha de corte actualizada a 2026-07-10 y resumen de
  PRs #100-#126 alineado.
- `01_PENDIENTES_PROYECTO.md`: registro de CTRL-015, QA-012, QA-013 y UI-047; estados de
  UI-045 y UI-046 corregidos; UI-044 alineada con PR #124.
- `04_UI_UX_PULIDO_VISUAL.md`: estado post UI-034/UI-045/UI-046 y recomendacion QA-012.
- `05_DECISIONES_PROYECTO.md`: observaciones post-merge para DEC-044 y DEC-045.
- `06_BITACORA_CAMBIOS.md`: LOG-103/LOG-104 alineados con PR #125/#126 y LOG-105 agregado.
- `09_NIVELES_DOCUMENTACION.md`: clasificacion de QA-012, QA-013 y UI-047 como Nivel 2.
- `README.md`: IMP-002 actualizado como integrado local/demo y manual.

## Expresiones obsoletas eliminadas

En referencias activas de UI-045/UI-046 se retiraron o reemplazaron:

- `draft pendiente merge Javier`
- `PR draft abierto para revision de Javier`
- `rama lista, pendiente merge PR #125`
- `pendiente merge de PR #125 primero`
- `UI-045 (pendiente merge)`
- referencias a `PR feature/...` como si no estuvieran mergeadas

Las menciones historicas a `draft` en bitacoras antiguas, prompts operativos o auditorias de
otros PRs se conservaron porque describen el estado historico o la politica general de PRs y
no corresponden a la desincronizacion post PR #125/#126.

## Estado final de UI-045

`UI-045` queda como: integrada en `main` por PR #125 / local-demo / pendiente QA-012.

## Estado final de UI-046

`UI-046` queda como: integrada en `main` por PR #126 / local-demo / pendiente QA-012.

## QA recomendado

`QA-012 - Regresion visual y funcional de PacientesPage` queda registrado como siguiente paso
recomendado, con alcance minimo:

- Panel diario de pacientes.
- Registro completo.
- Alta de paciente desktop.
- Alta de paciente tablet/mobile.
- Overlay de confirmacion mobile/tablet.
- Edicion plana.
- Guardar cambios.
- Cancelar edicion.
- Anular paciente.
- Reactivar paciente.
- Sin errores de consola.
- Sin pantalla blanca.
- Sin overflow horizontal.
- Sin regresion del wizard de alta.
- Sin regresion del formulario plano de edicion.

## Riesgos restantes

- `PROD-001` sigue bloqueante: no datos reales, fotos reales, pagos reales ni produccion.
- `BE-031` sigue pendiente y es Nivel 3: columna de terapeuta responsable en `agenda_eventos`
  requiere DEC previa antes de migraciones/RLS.
- `UI-047` queda recomendado: `ConsultasPage`, `EvaluacionesPage` y `PacientesPage` siguen
  usando `queryKey: ['pacientes']`; no se implementa en esta rama.
- `QA-013` queda recomendado: `gh run list --limit 10` muestra corridas recientes de GitHub
  Actions con conclusion `startup_failure`, incluyendo corridas sobre `main` posteriores a
  PR #125/#126. No se corrige en esta rama.
- Existe un archivo local no versionado fuera de alcance: `supabase/snippets/Untitled query 315.sql`.
  No fue creado ni modificado por CTRL-015 y no debe stagearse accidentalmente.
- Branch protection de `main` sigue como configuracion manual pendiente del dueno del repo,
  segun LOG-099.

## Validaciones ejecutadas

- `git diff --check`: OK.
- `npm run lint`: OK.
- `npm run test`: OK, 2 archivos / 24 tests.
- `npm run build`: OK.
- `gh run list --limit 10`: detecta `startup_failure` en corridas recientes; queda registrado
  como QA-013, sin correccion en esta rama.
- `git diff --cached --check`: OK.
- `git status --short`: OK, solo archivos documentales stageados y `supabase/snippets/` no
  trackeado fuera de alcance.
- `git diff --name-only`: OK, sin diferencias unstaged despues del staging final.

## Veredicto Control Desarrollo V3

Repositorio documentalmente ordenado post PR #125/#126, sin nuevas features funcionales,
listo para QA-012 o para UI-047 en una rama separada.
