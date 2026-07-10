---
name: pre-pr
description: Checklist ejecutable ANTES de crear una rama o abrir un PR - coordinacion multi-agente, colision de IDs, valores de BD reales y validaciones. Usar al iniciar cualquier tarea nueva y otra vez antes de `gh pr create`.
---

# Checklist pre-rama / pre-PR

Ejecuta las reglas de AGENTS.md (secciones "Coordinacion obligatoria" y "Verificacion de
colision de ID"). Origen: 6 PRs paralelas colisionadas el 2026-07-08 (ver
`docs/control/auditorias/REVISION-6-PRS-PARALELAS-2026-07-08.md`).

## Antes de crear la rama

1. **Solapamiento con PRs abiertas** (bloqueante):
   ```bash
   gh pr list --state open --json number,title,headRefName
   # por cada PR abierta que parezca cercana: gh pr diff <n> --name-only
   ```
   Si la tarea toca el mismo archivo/tabla/vista que una PR abierta, o depende de algo que
   solo existe alli: DETENERSE y declararlo al usuario antes de escribir codigo.
2. **Colision de ID**: si la tarea usa/crea un `BE-/UI-/SEC-/QA-/DOC-/DEC-/LOG-xxx`, buscarlo
   primero en `docs/control/01_PENDIENTES_PROYECTO.md` y `05_DECISIONES_PROYECTO.md`. Numero
   ya ocupado con otro significado = elegir el siguiente libre, no reutilizar.
3. **Nivel 3** (Auth/RLS/migraciones/datos sensibles): confirmar que existe una DEC-0xx
   aprobada para ESTE alcance. Sin DEC: primero diseno + aprobacion, no codigo (patron
   DEC-041/042).
4. **Timestamp de migracion**: si crea migracion, 14 digitos corridos (sin `_` en el bloque
   fecha), estrictamente mayor que la ultima en `supabase/migrations/` Y que cualquier
   migracion en PRs abiertas (bug real: 2 ramas eligieron `20260708000000` a la vez).

## Antes de escribir codigo que toque la BD

5. **Valores de enum/estado desde el CHECK constraint real**, nunca inventados ni "logicos":
   ```bash
   grep -A20 "<campo> text" supabase/migrations/<migracion_que_crea_la_tabla>.sql
   ```
   Bug real x3: `'Planificado'`, opciones genericas de tipo_trabajo, `fase_actual` — inserts
   que fallaban 100% con build y tests verdes. Ojo casing: `pacientes` usa minuscula
   (`'activo'`), el resto capitalizado (`'Abierto'`, `'No asistió'`).

## Antes de `gh pr create`

6. Validaciones (todas deben pasar; si una falla, no abrir el PR como listo):
   ```bash
   git diff --check && npx tsc --noEmit -p tsconfig.json && npm run lint && npm run test && npm run build
   ```
   Si hubo migraciones: `npx supabase db reset` limpio + `/verificar-rls` sobre lo nuevo.
   Si hubo UI observable: verificacion visual con `/demo-env` + preview antes de declarar listo.
7. **Staging exacto**: `git status` tras `git add` — solo los archivos de ESTA tarea (bug
   real: archivos pre-staged de otra herramienta colados en un commit).
8. PR con: alcance, fuera de alcance, como se probo (comandos reales, no "tests OK"
   genericos), pendientes. Un PR = una tarea. Draft salvo pedido contrario.
