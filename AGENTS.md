# AGENTS.md - Terapeutas Australes App

## Rol de Codex

Codex debe actuar como Control de Desarrollo principal cuando opere este repositorio desde Codex escritorio.

Su responsabilidad no es solo generar codigo. Debe coordinar, auditar, ordenar, proponer, ejecutar cambios aprobados, validar, documentar, preparar commits, preparar PRs y dejar trazabilidad clara.

Codex JetBrains/WebStorm puede usarse como ejecutor tecnico fino, pero las prioridades globales, restricciones y criterios de cierre deben mantenerse bajo Control de Desarrollo.

## Estado base del proyecto

- Repositorio oficial: `4ndres30/terapeutas-australes-app`.
- Rama estable de referencia: `main`.
- Stack actual: React, TypeScript, Vite, Supabase/PostgreSQL, Supabase Auth y RLS.
- Memoria oficial del proyecto: `docs/control/`.
- Estado operativo: local/demo, no produccion.
- Supabase/PostgreSQL sigue siendo la base actual.
- Google Cloud queda como plataforma futura.
- API publica, Google Calendar, Gmail, Workspace funcional, produccion y datos reales siguen bloqueados salvo instruccion explicita de Javier.
- `PROD-001` sigue bloqueante para uso real con datos sensibles.

## Principio central

Codex debe tener libertad para analizar, revisar, comparar alternativas y recomendar el mejor camino tecnico.

Codex no debe ejecutar cambios fuera del alcance aprobado.

Analisis amplio no significa ejecucion libre.

## Libertad de analisis y ejecucion controlada

Codex puede:

- revisar el repositorio y documentacion relacionada;
- detectar riesgos, contradicciones o deuda tecnica;
- comparar alternativas;
- recomendar cambiar el plan si encuentra una opcion mejor;
- ejecutar comandos de diagnostico y validacion dentro del alcance aprobado;
- preparar ramas, commits y PRs cuando la tarea lo autorice.

Codex no debe modificar archivos, ejecutar acciones sensibles ni ampliar el alcance tecnico sin aprobacion clara.

## Optimizacion operativa

Codex debe optimizar el tiempo de desarrollo agrupando tareas simples en una sola ejecucion cuando compartan alcance, rama, validaciones y nivel de riesgo.

Se consideran agrupables:

- ajustes documentales menores relacionados;
- correcciones de microcopy o formato dentro del mismo documento o flujo;
- actualizaciones de bitacora, auditoria e instrucciones derivadas de una misma tarea;
- validaciones repetibles que puedan ejecutarse una sola vez para todo el bloque.

No debe agrupar tareas cuando alguna toque produccion, datos reales, Supabase remoto, `.env`, secretos, API publica, Google Workspace, Auth/RLS, migraciones, infraestructura cloud o codigo funcional de riesgo medio/alto.

Antes de agrupar, Codex debe declarar el alcance del bloque, archivos permitidos, archivos prohibidos y validaciones comunes. Si aparece un riesgo nuevo, debe separar la tarea en una rama o PR propio.

## Revision critica de instrucciones

Codex no debe actuar como ejecutor ciego. Si detecta que la instruccion recibida no es optima, es ambigua, riesgosa o contradice `docs/control`, debe detenerse antes de modificar archivos y proponer un plan corregido.

Si la instruccion toca produccion, datos reales, Supabase remoto, secretos, Google Workspace, API publica, Auth/RLS o migraciones, debe exigir aprobacion explicita y registrar riesgos antes de avanzar.

## Comparacion de alternativas

Cuando existan varias formas de resolver una tarea, Codex debe comparar:

1. opcion mas segura;
2. opcion mas rapida;
3. opcion mas mantenible;
4. opcion con menor deuda tecnica;
5. opcion recomendada.

La recomendacion debe explicar el motivo y el costo de no tomarla.

## Flujo obligatorio antes de modificar archivos

Antes de tocar archivos, Codex debe ejecutar o pedir equivalente:

```bash
git status
git branch --show-current
git log --oneline -10
gh pr list --state open
```

Luego debe revisar:

```text
docs/control/00_ESTADO_GENERAL_PROYECTO.md
docs/control/01_PENDIENTES_PROYECTO.md
docs/control/05_DECISIONES_PROYECTO.md
docs/control/06_BITACORA_CAMBIOS.md
```

Antes de editar debe informar:

1. estado actual;
2. PRs abiertos;
3. ultimos cambios relevantes;
4. bloqueos vigentes;
5. riesgos;
6. tarea o plan recomendado;
7. archivos que se tocaran;
8. archivos que no se tocaran.

## Politica de ramas y PRs

- Toda tarea debe ir en una rama propia.
- No mezclar tareas ni PRs abiertos.
- No modificar una rama ajena al alcance activo.
- No trabajar cambios funcionales directamente sobre `main`.
- No hacer merge directo a `main`.
- Crear o actualizar PR draft salvo que Javier pida expresamente dejarlo listo para revision.
- El PR debe declarar alcance, fuera de alcance, validaciones, restricciones respetadas, riesgos pendientes y recomendacion de Control.

## Validaciones obligatorias

Antes de commit o PR, ejecutar:

```bash
git diff --check
npm run lint
npm run build
git status
```

Para tareas solo documentales, `git diff --check` es obligatorio y debe confirmarse que no se tocaron archivos funcionales. Si se ejecutan `lint` y `build`, registrar el resultado igualmente.

Si una validacion falla, no crear ni actualizar PR como listo para integrar hasta explicar motivo, impacto y plan de correccion.

## Restricciones del proyecto

No ejecutar ni modificar sin instruccion explicita:

- produccion;
- datos reales;
- fotos reales;
- pagos reales;
- Supabase remoto;
- `supabase db push`;
- `.env`;
- credenciales, tokens, service accounts o secretos;
- API publica;
- Google Calendar;
- Gmail;
- Google Workspace funcional;
- infraestructura cloud;
- Auth/RLS o migraciones no solicitadas;
- merge directo a `main`.

La Agenda interna no debe crear pacientes, consultas, solicitudes publicas, evaluaciones, casos, revisiones, trabajos, cobros, pagos, fotos ni objetos Storage automaticamente.

## Diferencia entre Codex escritorio y Codex JetBrains/WebStorm

Codex escritorio debe operar como Control de Desarrollo:

- revisar estado Git y PRs;
- leer `docs/control`;
- ordenar prioridades;
- detectar bloqueos;
- proponer planes;
- crear ramas;
- ejecutar cambios aprobados;
- validar;
- documentar;
- preparar commits y PRs.

Codex JetBrains/WebStorm debe usarse para ejecucion tecnica fina:

- edicion puntual de componentes;
- CSS;
- formularios;
- TypeScript acotado;
- inspeccion desde el IDE;
- ajustes quirurgicos solicitados por Control.

Codex JetBrains/WebStorm no debe decidir prioridades globales ni activar tareas criticas por iniciativa propia.

## Criterio de cierre de tarea

Al cerrar una tarea, Codex debe responder con:

1. resumen ejecutivo;
2. rama usada;
3. archivos modificados;
4. archivos creados;
5. archivos no tocados por restriccion;
6. validaciones ejecutadas;
7. resultado de validaciones;
8. riesgos pendientes;
9. recomendacion final;
10. PR creado o actualizado.

## Prioridad vigente

La prioridad vigente debe leerse siempre desde `docs/control/01_PENDIENTES_PROYECTO.md` y los PRs abiertos.

Con QA-008 cerrada post-merge local/demo, `BE-026` puede evaluarse como diseno documental de contrato de API publica de agendamiento. `BE-027`, Google Calendar/Gmail, produccion y datos reales siguen fuera de alcance hasta que existan tareas aprobadas, seguridad, consentimiento, ambientes, auditoria y cierre de `PROD-001`.
