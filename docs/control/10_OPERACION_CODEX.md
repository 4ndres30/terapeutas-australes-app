# Operacion Codex para Terapeutas Australes App

## Objetivo

Definir como usar Codex al maximo dentro del proyecto, manteniendo analisis amplio, criterio tecnico, ejecucion controlada, seguridad, validaciones y trazabilidad.

Este documento es la guia humana y operacional. `AGENTS.md` es el contrato persistente que Codex debe seguir al trabajar dentro del repositorio.

## Arquitectura de trabajo recomendada

```text
Javier / Viki
  -> ChatGPT
  -> Codex escritorio - Control de Desarrollo
  -> Codex JetBrains/WebStorm - Ejecucion tecnica fina
  -> GitHub - PRs y trazabilidad
  -> docs/control - memoria oficial del proyecto
```

## Roles

Javier / Viki:

- definen objetivos;
- aprueban prioridades;
- autorizan cambios sensibles;
- revisan decisiones de producto, seguridad y operacion.

ChatGPT:

- ayuda a pensar estrategia;
- refina prompts;
- revisa alternativas;
- acompana decisiones amplias.

Codex escritorio - Control de Desarrollo:

- revisa Git, ramas, PRs y documentacion;
- detecta bloqueos y riesgos;
- propone siguiente tarea;
- crea ramas de trabajo;
- ejecuta cambios aprobados;
- valida;
- documenta;
- prepara commits y PRs.

Codex JetBrains/WebStorm - Ejecucion tecnica fina:

- edita archivos concretos;
- ajusta UI, CSS, formularios y TypeScript;
- trabaja con contexto del IDE;
- responde a prompts acotados generados por Control.

GitHub:

- conserva ramas, commits, PRs, revisiones y trazabilidad.

`docs/control`:

- conserva estado, pendientes, decisiones, bitacora y auditorias.

## Niveles de tarea

Nivel 1: ajuste menor.

- Ejemplos: texto, microcopy, orden visual, pequena correccion documental.
- Requiere alcance claro, validacion proporcional y cierre breve.

Nivel 2: cambio funcional interno.

- Ejemplos: Agenda interna, formularios, filtros, navegacion protegida, UI conectada a Supabase local.
- Requiere plan previo, rama propia, `npm run lint`, `npm run build`, QA proporcional y PR revisable.

Nivel 3: cambio critico.

- Ejemplos: DB, RLS, Auth, migraciones, API publica, Google Calendar/Gmail, datos reales, produccion, seguridad, consentimiento.
- Requiere aprobacion explicita de Javier, informe tecnico, checklist de seguridad, validaciones ampliadas y ninguna ejecucion remota salvo autorizacion directa.

Mientras mayor sea el nivel, mas validacion y aprobacion requiere.

## Agrupacion de tareas simples

Para optimizar tiempo de desarrollo, Control puede agrupar tareas simples en una sola ejecucion cuando todas cumplan estas condiciones:

- pertenecen al mismo objetivo operativo;
- comparten rama, alcance y validaciones;
- son documentales o de bajo riesgo;
- no requieren aprobaciones distintas;
- no tienen PRs abiertos incompatibles;
- no tocan restricciones sensibles.

Ejemplos razonables:

- actualizar `AGENTS.md`, `docs/control/10_OPERACION_CODEX.md`, prompts y bitacora por una misma regla operativa;
- corregir varios textos documentales pequenos relacionados;
- registrar auditoria y bitacora de una tarea documental ya ejecutada;
- ejecutar una sola pasada de `git diff --check`, `npm run lint` y `npm run build` para un bloque homogeneo.

No se deben agrupar tareas si alguna toca produccion, datos reales, `.env`, secretos, Supabase remoto, `supabase db push`, migraciones, Auth/RLS, API publica, Google Calendar/Gmail/Workspace, infraestructura cloud o cambios funcionales con riesgo medio/alto.

Cuando agrupe, Control debe declarar:

1. objetivo del bloque;
2. tareas incluidas;
3. tareas excluidas;
4. archivos permitidos;
5. archivos prohibidos;
6. validaciones comunes;
7. criterio para separar el trabajo si aparece riesgo nuevo.

## Modo Codex Optimizado

El Modo Codex Optimizado debe usarse por defecto en tareas de bajo y medio riesgo, y especialmente cuando Javier quiera ahorrar contexto, evitar prompts gigantes repetidos o mantener reportes breves.

La regla principal es:

```text
Codex debe pensar profundo cuando la tarea lo requiere, pero no debe leer ni modificar mas de lo necesario.
```

Para reducir consumo, Control debe:

- usar `AGENTS.md` como base persistente y no repetir sus reglas completas en cada respuesta;
- separar diagnostico, plan, ejecucion y cierre;
- revisar primero solo archivos directamente relacionados con la tarea;
- ampliar contexto solo cuando exista una razon tecnica, de seguridad o de trazabilidad;
- explicar que archivo o carpeta necesita revisar y por que cuando el alcance inicial no baste;
- evitar explicaciones largas cuando la tarea no tenga riesgo relevante;
- conservar analisis profundo para cambios sensibles, decisiones de arquitectura, seguridad, Auth/RLS, datos, produccion o integraciones futuras.

Si una tarea requiere leer mas archivos que los inicialmente permitidos, Control debe justificarlo antes de avanzar, salvo que la lectura sea diagnostica, acotada y necesaria para no romper una restriccion del proyecto.

## Flujo de inicio

Al iniciar una tarea, Control debe ejecutar:

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

Si hay PRs abiertos, Control debe explicar si la tarea depende de ellos, si puede avanzar en paralelo o si hay riesgo de mezcla.

## Flujo antes de modificar archivos

Antes de editar, Control debe informar:

1. estado actual del repositorio;
2. PRs abiertos;
3. ultimos cambios relevantes;
4. bloqueos vigentes;
5. riesgos detectados;
6. rama que usara;
7. archivos que tocara;
8. archivos que no tocara;
9. validaciones a ejecutar;
10. criterio de exito.

No debe modificar archivos antes de aprobacion, salvo que Javier haya autorizado ejecucion directa en la instruccion activa.

## Flujo de cierre

Antes de commit o PR:

```bash
git diff --check
npm run lint
npm run build
git status
```

Para tareas documentales, confirmar ademas que no se tocaron archivos funcionales.

La respuesta final debe incluir rama, archivos creados/modificados, validaciones, resultado, restricciones respetadas, riesgos pendientes y PR creado o actualizado.

## Como debe actuar Codex cuando detecta un mejor camino

Codex no debe seguir instrucciones de forma ciega. Si detecta una alternativa mas segura, mas mantenible o menos riesgosa, debe detenerse antes de modificar archivos y explicar:

1. que instruccion reviso;
2. que riesgo o mejora detecto;
3. que alternativa propone;
4. que impacto tendria;
5. que necesita aprobar Javier.

Si el cambio ya estaba autorizado y el ajuste es menor, puede aplicarlo siempre que no amplie el alcance ni toque restricciones sensibles.

## Como comparar alternativas

Cuando existan varias formas de resolver una tarea, Control debe comparar:

1. opcion mas segura;
2. opcion mas rapida;
3. opcion mas mantenible;
4. opcion con menor deuda tecnica;
5. opcion recomendada.

La opcion recomendada debe explicar por que conviene ahora y que quedaria pendiente.

## Como delegar a Codex JetBrains/WebStorm

Control debe delegar al IDE solo tareas acotadas. El prompt para JetBrains/WebStorm debe incluir:

- objetivo tecnico;
- archivos permitidos;
- archivos prohibidos;
- restricciones aplicables;
- validaciones a ejecutar;
- criterios de aceptacion;
- instruccion de no hacer commit, push ni merge salvo autorizacion;
- respuesta final esperada.

Control debe revisar el resultado antes de commit o PR.

## Prompts operativos cortos para Javier

Revisar estado:

```text
Control, revisa estado del repo, PRs abiertos y docs/control. No modifiques archivos. Dime riesgos, bloqueos y siguiente tarea recomendada.
```

Preparar tarea:

```text
Control, prepara plan para [TAREA]. Indica rama, archivos permitidos/prohibidos, restricciones, validaciones y criterio de exito. No ejecutes hasta mi aprobacion.
```

Ejecutar tarea documental:

```text
Control, ejecuta la tarea documental [CODIGO - NOMBRE] en rama propia. No toques codigo funcional, migraciones, .env, Supabase remoto, API publica ni Google. Valida y prepara PR draft.
```

Delegar a JetBrains/WebStorm:

```text
Control, genera un prompt para Codex JetBrains/WebStorm para [TAREA TECNICA]. Debe ser acotado, con archivos permitidos, prohibidos, validaciones y respuesta esperada.
```

Cerrar tarea:

```text
Control, revisa diff, ejecuta validaciones, confirma restricciones respetadas, crea commit y prepara PR draft. No hagas merge.
```

## Reglas permanentes del proyecto

- No usar produccion.
- No usar datos reales.
- No usar fotos reales.
- No usar pagos reales.
- No modificar `.env`.
- No exponer secretos.
- No tocar Supabase remoto.
- No ejecutar `supabase db push`.
- No crear API publica sin tarea aprobada.
- No integrar Google Calendar/Gmail sin backend seguro aprobado.
- No crear pacientes ni consultas automaticamente desde Agenda.
- No mezclar PRs abiertos.
- No hacer merge directo a `main`.

## Orden actual recomendado

1. Mantener QA-008 como cerrada post-merge local/demo y usarla como base para Agenda interna.
2. Revisar PRs abiertos antes de iniciar tareas nuevas.
3. Evaluar `BE-026` solo como diseno documental de contrato de API publica de agendamiento.
4. Mantener `BE-027`, Google Calendar/Gmail, produccion y datos reales en espera.
5. Priorizar seguridad, ambientes, consentimiento, auditoria y `PROD-001` antes de cualquier uso real.

## Relacion con AGENTS.md

`AGENTS.md` contiene instrucciones persistentes, ejecutivas y cargables por Codex.

Este documento explica el metodo humano de operacion, los roles y los flujos recomendados. Si hay conflicto entre ambos, Control debe detenerse, revisar `docs/control` y pedir confirmacion antes de modificar archivos.
