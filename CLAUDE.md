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
