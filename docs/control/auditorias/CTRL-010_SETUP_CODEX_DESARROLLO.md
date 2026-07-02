# CTRL-010 - Setup operativo de Codex para desarrollo

## Estado

Propuesta documental / pendiente revision de Javier.

## Fecha

2026-07-02

## Rama

`ctrl-010-operacion-codex`

## Objetivo

Crear y ordenar instrucciones permanentes para usar Codex con maximo potencial dentro de **Terapeutas Australes App**, manteniendo analisis amplio, ejecucion controlada, seguridad, validaciones y trazabilidad.

## Origen

Solicitud de Javier para preparar el uso permanente de Codex como Control de Desarrollo principal y separar claramente la operacion de Codex escritorio de la ejecucion fina en Codex JetBrains/WebStorm.

## Archivos creados o revisados

- `AGENTS.md`
- `.codex/README.md`
- `docs/control/10_OPERACION_CODEX.md`
- `docs/control/prompts/CODEX_CONTROL_DESARROLLO.md`
- `docs/control/auditorias/CTRL-010_SETUP_CODEX_DESARROLLO.md`

## Proposito de cada archivo

- `AGENTS.md`: contrato persistente principal para Codex dentro del repositorio.
- `.codex/README.md`: explicacion local de la carpeta `.codex` y precauciones de uso.
- `docs/control/10_OPERACION_CODEX.md`: guia humana y operacional para usar Codex en el proyecto.
- `docs/control/prompts/CODEX_CONTROL_DESARROLLO.md`: prompts reutilizables para Javier.
- `docs/control/auditorias/CTRL-010_SETUP_CODEX_DESARROLLO.md`: trazabilidad de esta tarea.

## Restricciones respetadas

- No modifica codigo funcional.
- No modifica base de datos.
- No modifica migraciones.
- No modifica `.env`.
- No toca credenciales ni secretos.
- No toca Supabase remoto.
- No ejecuta `supabase db push`.
- No habilita produccion.
- No habilita datos reales.
- No habilita fotos reales.
- No habilita pagos reales.
- No habilita API publica.
- No habilita Google Calendar, Gmail ni Workspace funcional.
- No hace merge a `main`.
- No modifica la rama `be-026-diseno-contrato-api-agendamiento`.
- No modifica el PR #52.

## Relacion con docs/control

CTRL-010 complementa el centro documental existente:

- `00_ESTADO_GENERAL_PROYECTO.md` mantiene el estado global.
- `01_PENDIENTES_PROYECTO.md` mantiene la prioridad vigente.
- `05_DECISIONES_PROYECTO.md` mantiene decisiones estables y propuestas.
- `06_BITACORA_CAMBIOS.md` mantiene registro historico.
- `10_OPERACION_CODEX.md` define como debe operar Codex dentro de ese sistema.

## Validaciones ejecutadas

Validaciones ejecutadas durante el cierre de CTRL-010:

```bash
git diff --check
npm run lint
npm run build
git status
```

Resultado:

- `git diff --check`: OK. Solo advertencias esperadas de normalizacion LF/CRLF en Windows.
- `npm run lint`: OK.
- `npm run build`: OK. Vite mantiene advertencia no bloqueante de chunk mayor a 500 kB.
- `git status`: rama `ctrl-010-operacion-codex`, cambios documentales pendientes de commit al momento de esta auditoria.

## Riesgos

- Si `AGENTS.md` crece demasiado, puede volverse menos util como instruccion persistente. Por eso queda ejecutivo y complementado por `10_OPERACION_CODEX.md`.
- Si Codex JetBrains/WebStorm se usa sin prompt acotado, puede mezclar prioridades o tocar archivos fuera de alcance.
- Si se omite revisar PRs abiertos, se puede mezclar trabajo con `BE-026` u otra rama activa.

## Proximo paso recomendado

Revisar este PR draft. Si Javier aprueba el enfoque, integrar CTRL-010 antes de seguir ampliando flujos de trabajo con Codex.

## Veredicto

CTRL-010 es un cambio solo documental y operativo. Mejora la forma de trabajar con Codex, pero no modifica comportamiento de la aplicacion, base de datos, migraciones, API publica, Google, produccion ni datos reales.
