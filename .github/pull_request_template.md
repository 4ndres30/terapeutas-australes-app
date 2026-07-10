<!-- Checklist AGENTS.md — completar TODO antes de pedir merge. PR sin esto = no listo. -->

## Resumen
<!-- Que hace este PR y por que. ID de tarea (BE-xxx/UI-xxx/SEC-xxx) y DEC-xxx si aplica. -->

## Alcance / fuera de alcance
-

## Checklist obligatorio (AGENTS.md)

- [ ] `gh pr list --state open` estaba vacio al crear este PR (flujo serial)
- [ ] ID de tarea verificado sin colision en `01_PENDIENTES_PROYECTO.md`
- [ ] Si toca Auth/RLS/migraciones/datos sensibles (Nivel 3): existe `DEC-xxx` aprobada que lo autoriza
- [ ] `LOG-xxx` agregado en `06_BITACORA_CAMBIOS.md` **en esta misma rama**
- [ ] Estado actualizado en `01_PENDIENTES_PROYECTO.md` (fila de tabla Y ficha de detalle)
- [ ] Ningun estado "Integrada" refiere a codigo que no este en este PR o ya en `main`
- [ ] `tsc --noEmit` + `npm run lint` + `npm run test` + `npm run build` limpios (pegar evidencia abajo)
- [ ] Si hay migraciones: `supabase db reset` limpio + RLS probada con rol real (`/verificar-rls`)
- [ ] Si hay UI observable: validacion visual con ambiente demo (`/demo-env`) — describir que se probo
- [ ] Valores de enum/estado tomados del CHECK constraint real, no inventados
- [ ] `git status` revisado: solo archivos de ESTA tarea en el commit

## Como se probo
<!-- Comandos reales y resultados. "Tests OK" sin evidencia no cuenta. -->

## Riesgos / pendientes
-
