# CTRL-011 - Modo Codex Optimizado

## Estado

Propuesta documental / pendiente revision de Javier.

## Fecha

2026-07-03

## Objetivo

Integrar un modo de trabajo para reducir consumo innecesario de contexto/tokens sin limitar la capacidad critica de Codex.

## Archivos modificados

- AGENTS.md
- docs/control/10_OPERACION_CODEX.md
- docs/control/prompts/CODEX_CONTROL_DESARROLLO.md
- docs/control/06_BITACORA_CAMBIOS.md

## Criterio aplicado

El modo optimiza lectura, analisis, ejecucion y reporte. No reduce la capacidad tecnica de Codex; reduce exploracion innecesaria.

## Restricciones respetadas

Cambio solo documental.

No se toca codigo funcional, `src/`, `supabase/`, migraciones, `.env`, configuracion privada, base de datos, API publica, Google/Gmail ni produccion.

## Validaciones ejecutadas

- `git diff --check`: OK, con advertencias LF/CRLF propias de Windows.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia conocida de chunk grande de Vite.
- `git status`: revisado.

## Riesgos

- Si se acota demasiado el contexto, Codex podria no ver dependencias relevantes.
- Mitigacion: Codex debe pedir ampliar contexto cuando lo justifique.

## Veredicto

Recomendado para uso permanente en tareas de bajo y medio riesgo.
