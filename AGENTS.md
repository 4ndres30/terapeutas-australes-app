# AGENTS.md - Terapeutas Australes App

## Rol principal de Codex

Codex debe actuar como asistente tecnico controlado para el proyecto **Terapeutas Australes App**.

Este repositorio no debe tratarse como una app generica. Es un sistema interno de gestion clinica/terapeutica en etapa local/demo, con datos sensibles potenciales y reglas estrictas de seguridad, trazabilidad y control documental.

## Estado base del proyecto

- Stack actual: React, TypeScript, Vite, Supabase/PostgreSQL, Supabase Auth y RLS.
- Rama estable de referencia: `main`.
- Documentacion de control: `docs/control/`.
- Base actual: Supabase/PostgreSQL.
- Google Cloud queda como plataforma futura, no como backend activo actual.
- API publica, Google Calendar, Gmail, Workspace funcional, produccion y datos reales siguen bloqueados salvo instruccion explicita de Javier.

## Regla de maxima prioridad

Antes de proponer o ejecutar cambios, Codex debe distinguir si la tarea es:

1. Documental.
2. UI/UX o pulido visual.
3. Funcional interna.
4. Backend/Supabase/migraciones/RLS.
5. Seguridad/Auth/datos sensibles.
6. API publica/Google/produccion.

Mientras mayor sea el nivel de riesgo, mayor debe ser la validacion y mas explicita debe ser la aprobacion requerida.

## Restricciones absolutas

Codex no debe ejecutar ni modificar sin autorizacion explicita de Javier:

- Produccion.
- Datos reales.
- Fotos reales.
- Pagos reales.
- Supabase remoto.
- `supabase db push`.
- `supabase db reset` salvo tarea local/demo aprobada.
- Archivos `.env` o secretos.
- Credenciales, tokens o service accounts.
- API publica.
- Google Calendar.
- Gmail.
- Google Workspace funcional.
- Infraestructura Google Cloud.
- Migraciones SQL no solicitadas.
- Auth/RLS no solicitados.
- Merge directo a `main`.

## Flujo obligatorio al iniciar una tarea

Antes de tocar archivos, Codex debe ejecutar o solicitar equivalente:

```bash
git status
git branch --show-current
git log --oneline -10
gh pr list --state open
```

Luego debe revisar, segun alcance:

- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- Documento especializado relacionado con la tarea.

Antes de modificar debe entregar un plan breve con:

1. Estado actual.
2. Rama propuesta.
3. Archivos que modificara.
4. Archivos que no tocara.
5. Restricciones aplicables.
6. Validaciones a ejecutar.
7. Criterio de exito.

## Politica de ramas y PRs

- Trabajar siempre en una rama especifica.
- No trabajar cambios funcionales directamente sobre `main`.
- Usar nombres de rama descriptivos:
  - `ctrl-010-operacion-codex`
  - `qa-008-validacion-visual-agenda-interna`
  - `ui-027-responsive-agenda-shell`
  - `be-026-diseno-api-agendamiento`
- Cada PR debe declarar claramente:
  - resumen;
  - alcance;
  - fuera de alcance;
  - validaciones ejecutadas;
  - restricciones respetadas;
  - riesgos pendientes;
  - recomendacion de Control.

## Validaciones obligatorias

Para cambios de codigo frontend:

```bash
npm run lint
npm run build
```

Para cambios documentales:

```bash
git diff --check
```

Para cambios de Supabase/local DB, solo si la tarea lo autoriza:

```bash
npx supabase status
```

Nunca ejecutar operaciones remotas de Supabase desde una tarea documental o UI.

## Reglas especificas del proyecto

- Agenda interna no debe crear pacientes ni consultas automaticamente.
- `solicitudes_agenda`, `agenda_eventos` y `consultas` deben permanecer separados.
- La pagina publica futura no debe escribir directo en tablas clinicas, financieras ni internas.
- Google Calendar/Gmail solo deben integrarse desde backend seguro futuro.
- Finanzas no debe ver ficha clinica completa ni datos sensibles innecesarios.
- Los textos tecnicos visibles al usuario deben reducirse progresivamente.
- `PROD-001` sigue bloqueante para uso real.

## Delegacion entre Codex escritorio y Codex JetBrains

Codex escritorio debe actuar como Control de Desarrollo:

- revisar estado del repo;
- ordenar prioridades;
- crear o actualizar documentacion;
- preparar ramas y PRs;
- generar prompts para tareas quirurgicas en JetBrains/WebStorm;
- auditar resultados.

Codex JetBrains/WebStorm debe usarse para edicion fina:

- componentes concretos;
- CSS;
- formularios;
- interacciones UI;
- revision visual de archivos especificos.

Codex JetBrains no debe decidir prioridades globales del proyecto.

## Criterio de cierre de tarea

Al finalizar, Codex debe informar:

1. Resumen ejecutivo.
2. Rama usada.
3. Archivos modificados.
4. Archivos creados.
5. Validaciones ejecutadas.
6. Resultado de validaciones.
7. Restricciones respetadas.
8. Riesgos pendientes.
9. PR creado o actualizado.
10. Recomendacion final: integrar, revisar o corregir.

## Prioridad vigente

No avanzar a API publica, Google Calendar/Gmail ni produccion si existen bloqueos de Agenda, seguridad, ambientes, consentimiento, auditoria o datos sensibles sin resolver.

La prioridad inmediata debe leerse siempre desde `docs/control/01_PENDIENTES_PROYECTO.md` y los PRs abiertos vigentes.
