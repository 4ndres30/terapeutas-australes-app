# Operacion Codex para Terapeutas Australes App

## Objetivo

Definir como usar Codex escritorio, Codex JetBrains/WebStorm, GitHub y la documentacion de control para desarrollar el proyecto de forma ordenada, segura y trazable.

Este documento complementa `AGENTS.md` y debe ser leido por Control de Desarrollo antes de iniciar tareas nuevas.

## Arquitectura de trabajo recomendada

```text
Javier / Viki
  -> ChatGPT: estrategia, revision y prompts maestros
  -> Codex escritorio: Control de Desarrollo operativo
  -> Codex JetBrains/WebStorm: ejecucion quirurgica de UI/codigo
  -> GitHub: ramas, PRs y trazabilidad
  -> docs/control: memoria oficial del proyecto
```

## Roles

### Javier

- Define objetivos.
- Aprueba prioridades.
- Autoriza cambios sensibles.
- Decide si un PR se integra o se devuelve.
- Autoriza produccion, datos reales o integraciones externas solo cuando corresponda.

### ChatGPT

- Ayuda a planificar.
- Revisa resultados de Codex.
- Genera prompts maestros.
- Detecta riesgos estrategicos.
- Apoya decisiones de arquitectura y flujo.

### Codex escritorio

Debe actuar como Control de Desarrollo principal:

- revisar estado Git;
- revisar PRs abiertos;
- leer `docs/control`;
- proponer siguiente tarea;
- crear ramas;
- generar prompts para Codex JetBrains;
- ejecutar validaciones;
- preparar commits y PRs;
- documentar avances;
- mantener restricciones visibles.

### Codex JetBrains/WebStorm

Debe actuar como ejecutor tecnico fino:

- editar componentes concretos;
- ajustar CSS;
- corregir formularios;
- revisar errores TypeScript;
- inspeccionar UI desde el contexto del IDE.

No debe decidir prioridades generales ni activar tareas criticas por iniciativa propia.

## Clasificacion de tareas

### Nivel 1 - Ajuste menor

Ejemplos:

- microcopy;
- CSS menor;
- orden visual;
- correcciones pequenas de texto.

Requiere:

- rama especifica si modifica repo;
- validacion minima;
- bitacora breve si afecta docs/control.

### Nivel 2 - Cambio funcional interno

Ejemplos:

- formularios internos;
- filtros;
- Agenda interna;
- navegacion interna;
- pantallas conectadas a Supabase local.

Requiere:

- plan previo;
- validacion `npm run lint` y `npm run build`;
- QA o informe si toca flujo operativo;
- PR revisable.

### Nivel 3 - Cambio critico

Ejemplos:

- DB;
- RLS;
- Auth;
- migraciones;
- API publica;
- Google Calendar/Gmail;
- datos reales;
- produccion;
- seguridad;
- consentimiento.

Requiere:

- decision formal;
- informe tecnico;
- checklist de seguridad;
- aprobacion explicita de Javier;
- validaciones ampliadas;
- no ejecutar cambios remotos salvo autorizacion directa.

## Flujo de inicio para Codex escritorio

Cada tarea debe comenzar con:

```bash
git status
git branch --show-current
git log --oneline -10
gh pr list --state open
```

Luego leer:

```text
docs/control/00_ESTADO_GENERAL_PROYECTO.md
docs/control/01_PENDIENTES_PROYECTO.md
docs/control/05_DECISIONES_PROYECTO.md
docs/control/06_BITACORA_CAMBIOS.md
```

Si hay PRs abiertos, Codex debe explicar si la nueva tarea depende de ellos o puede avanzar en paralelo.

## Flujo antes de modificar archivos

Codex debe entregar un plan:

```text
1. Estado actual del repositorio.
2. PRs abiertos.
3. Tarea recomendada.
4. Rama propuesta.
5. Archivos a modificar.
6. Archivos prohibidos para esta tarea.
7. Validaciones a ejecutar.
8. Riesgos.
9. Criterio de exito.
```

No debe modificar archivos antes de que Javier apruebe el plan, salvo que Javier haya autorizado ejecucion directa.

## Flujo de cierre

Antes de commit o PR:

```bash
git diff --check
npm run lint
npm run build
git status
```

Si una validacion no aplica o no se pudo ejecutar, Codex debe decirlo claramente.

## Prompts operativos cortos para Javier

### Revisar estado

```text
Control, revisa estado del repo, PRs abiertos, docs/control y dime la siguiente tarea recomendada. No modifiques archivos todavia.
```

### Preparar tarea

```text
Control, prepara plan para [tarea]. Indica rama, archivos, restricciones, validaciones y criterio de exito. No ejecutes hasta mi aprobacion.
```

### Delegar a JetBrains

```text
Control, genera prompt especifico para Codex JetBrains/WebStorm para [tarea tecnica]. Incluye archivos permitidos, prohibidos, validaciones y respuesta esperada. No ejecutes todavia.
```

### Cerrar tarea

```text
Control, revisa diff, ejecuta validaciones, prepara resumen final y deja PR listo para revision. No hagas merge.
```

## Reglas de seguridad permanentes

- No usar datos reales.
- No habilitar produccion.
- No modificar `.env`.
- No exponer secretos.
- No tocar Supabase remoto.
- No ejecutar `supabase db push`.
- No crear API publica sin tarea aprobada.
- No integrar Google Calendar/Gmail sin backend seguro aprobado.
- No crear pacientes/consultas desde Agenda automaticamente.
- No usar delete fisico donde exista politica de anulacion logica pendiente.

## Orden actual recomendado

1. Resolver PRs/documentacion abiertos.
2. Cerrar observaciones de Agenda interna si Control lo exige.
3. Filtrar navegacion por rol y retirar textos tecnicos visibles.
4. Reforzar seguridad, auditoria y ambientes.
5. Recien despues evaluar `BE-026` API publica.
6. Mantener `BE-027` Google Calendar/Gmail en espera hasta que API, seguridad y consentimiento esten claros.

## Relacion con AGENTS.md

`AGENTS.md` contiene instrucciones ejecutivas que Codex debe cargar automaticamente.

Este documento contiene la guia humana/operativa del proyecto y puede ser mas explicativo.
