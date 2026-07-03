# CTRL-011 - Optimizacion operativa Codex

**Estado:** Documentado
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Javier
**Fecha:** 2026-07-03
**Rama:** `ctrl-011-optimizacion-operacion-codex`

## Objetivo

Registrar una regla permanente para que Codex agrupe tareas simples en una sola ejecucion cuando eso reduzca tiempo de desarrollo sin aumentar riesgo.

## Regla aprobada

Codex puede agrupar tareas simples si:

- pertenecen al mismo objetivo;
- comparten rama, alcance y validaciones;
- son documentales o de bajo riesgo;
- no requieren aprobaciones distintas;
- no mezclan PRs abiertos incompatibles;
- no tocan restricciones sensibles.

## Tareas que no deben agruparse

No se deben agrupar tareas si alguna toca:

- produccion;
- datos reales, fotos reales o pagos reales;
- `.env`, secretos, tokens, credenciales o service accounts;
- Supabase remoto o `supabase db push`;
- migraciones, Auth/RLS o seguridad sensible;
- API publica;
- Google Calendar, Gmail o Workspace funcional;
- infraestructura cloud;
- codigo funcional con riesgo medio o alto.

## Criterio operativo

Antes de agrupar, Control debe declarar:

1. objetivo del bloque;
2. tareas incluidas;
3. tareas excluidas;
4. archivos permitidos;
5. archivos prohibidos;
6. validaciones comunes;
7. criterio para separar el trabajo si aparece riesgo nuevo.

Si durante la ejecucion aparece una diferencia de alcance, riesgo o validacion, Control debe separar la tarea en rama o PR propio.

## Archivos actualizados

- `AGENTS.md`
- `.codex/README.md`
- `docs/control/10_OPERACION_CODEX.md`
- `docs/control/prompts/CODEX_CONTROL_DESARROLLO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

## Restricciones respetadas

- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se modifico `.env`.
- No se tocaron credenciales.
- No se ejecuto SQL.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth/RLS.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Resultado

La operacion Codex queda optimizada para agrupar tareas simples sin perder trazabilidad, validacion ni control de riesgos.
