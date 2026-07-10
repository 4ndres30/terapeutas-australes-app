# CLAUDE.md - Terapeutas Australes App

Las instrucciones de este repositorio son unicas para todo agente de IA (Codex, Claude Code,
Gemini CLI, antigravity, u otro) y viven en [`AGENTS.md`](AGENTS.md). Leelo completo antes de
tocar cualquier archivo -- no dupliques sus reglas aca, remitite a el.

Puntos que Claude Code en particular debe recordar de ese documento:

- Antes de empezar, correr `gh pr list --state open` y chequear solapamiento de archivos/IDs
  con la tarea nueva (seccion "Coordinacion obligatoria entre multiples agentes en paralelo").
- Antes de asignar un `BE-xxx`/`UI-xxx`/`SEC-xxx`/`DEC-xxx` nuevo, verificar que no colisione
  con uno ya usado en `docs/control/01_PENDIENTES_PROYECTO.md`.
- Nivel 3 (Auth/RLS/migraciones/datos sensibles): nunca implementar sin una decision `DEC-0xx`
  que lo apruebe explicitamente primero.
- Una tarea, una rama, un PR. Nunca commit directo a `main`.
- **Flujo serial**: jamas abrir PR nuevo con otro PR abierto sin mergear (`gh pr list --state open` vacio antes de `gh pr create`).
- **Registro en la misma rama**: todo PR lleva su `LOG-xxx` en bitacora + estado actualizado en `01_PENDIENTES` (tabla y ficha) antes del merge. Nunca marcar "Integrada" algo cuyo codigo vive en otro PR.
- **`AGENTS.md`/`CLAUDE.md`/`.claude/skills/` son inmutables** salvo instruccion explicita de Javier en la conversacion activa, en PR dedicado que cite esa instruccion.
