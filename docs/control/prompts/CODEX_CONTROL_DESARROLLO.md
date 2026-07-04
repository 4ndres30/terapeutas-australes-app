# Prompts operativos para Codex

Estos prompts son reutilizables por Javier para operar Codex como Control de Desarrollo dentro de **Terapeutas Australes App**.

Usar junto con:

- `AGENTS.md`
- `docs/control/10_OPERACION_CODEX.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`

## Prompt - Modo Codex Optimizado

```text
Control, aplica `AGENTS.md` y trabaja en Modo Codex Optimizado.

Objetivo:
[DESCRIBIR TAREA]

Reglas de eficiencia:

1. No revises todo el repositorio por defecto.
2. Revisa primero solo los archivos directamente relacionados con la tarea.
3. Si necesitas ampliar contexto, dime que archivos o carpetas necesitas revisar y por que.
4. No repitas instrucciones ya contenidas en `AGENTS.md`.
5. No generes explicaciones largas si no hay riesgo.
6. Separa diagnostico, plan, ejecucion y cierre.
7. No modifiques archivos hasta que apruebe el plan.
8. Si detectas que la instruccion no es optima, detente y propone una alternativa.
9. Si existen varias alternativas, compara:
   - opcion mas segura;
   - opcion mas rapida;
   - opcion mas mantenible;
   - opcion con menor deuda tecnica;
   - opcion recomendada.
10. Ejecuta solo dentro del alcance aprobado.

Archivos permitidos inicialmente:
[LISTA DE ARCHIVOS]

Archivos prohibidos:
[LISTA DE ARCHIVOS O CARPETAS]

Respuesta inicial esperada:

1. Estado actual.
2. Archivos minimos que necesitas revisar.
3. Riesgo de la tarea.
4. Plan recomendado.
5. Validaciones necesarias.
6. Si necesitas ampliar alcance, justificar por que.
```

## Prompt corto - Modo Codex Optimizado

```text
Control, aplica `AGENTS.md` y trabaja en Modo Codex Optimizado.

Tarea: [DESCRIBIR TAREA]

No revises todo el repo. Revisa solo lo necesario. Si necesitas ampliar contexto, dime que archivo necesitas y por que.

No modifiques archivos hasta aprobar el plan.

Entrega:
1. diagnostico breve;
2. archivos minimos a revisar;
3. plan recomendado;
4. validaciones;
5. riesgos.
```

## Prompt base - Revisar estado del repositorio

```text
Actua como Control de Desarrollo principal del proyecto Terapeutas Australes App.

Antes de modificar archivos, ejecuta:

git status
git branch --show-current
git log --oneline -10
gh pr list --state open

Luego revisa docs/control/00_ESTADO_GENERAL_PROYECTO.md, 01_PENDIENTES_PROYECTO.md, 05_DECISIONES_PROYECTO.md y 06_BITACORA_CAMBIOS.md.

Entregame:

1. Estado actual.
2. PRs abiertos.
3. Ultimos cambios relevantes.
4. Bloqueos vigentes.
5. Riesgos detectados.
6. Siguiente tarea recomendada.
7. Rama propuesta.
8. Archivos que tocarias.
9. Archivos que no tocarias.
10. Validaciones necesarias.

No modifiques archivos.
```

## Prompt - Preparar plan de tarea

```text
Control, prepara plan para [CODIGO - TAREA].

No modifiques archivos todavia.

Incluye:

1. Objetivo.
2. Rama propuesta.
3. Nivel de riesgo.
4. Alternativas posibles.
5. Opcion recomendada.
6. Archivos permitidos.
7. Archivos prohibidos.
8. Restricciones aplicables.
9. Validaciones.
10. Criterio de exito.
```

## Prompt - Ejecutar tarea documental

```text
Control, ejecuta la tarea documental [CODIGO - NOMBRE].

Alcance:

- Solo documentacion.
- Rama propia.
- No modificar codigo funcional.
- No modificar migraciones.
- No tocar .env.
- No tocar Supabase remoto.
- No crear API publica.
- No integrar Google.
- No habilitar produccion ni datos reales.

Al cierre ejecuta git diff --check, npm run lint, npm run build y git status si aplica al flujo acordado.

Crea o actualiza PR draft contra main. No hagas merge.
```

## Prompt - Ejecutar bloque simple agrupado

```text
Control, agrupa y ejecuta en una sola rama las tareas simples relacionadas con [OBJETIVO].

Antes de modificar archivos, confirma:

1. tareas incluidas;
2. tareas excluidas;
3. archivos permitidos;
4. archivos prohibidos;
5. restricciones aplicables;
6. validaciones comunes;
7. criterio para separar el trabajo si aparece riesgo nuevo.

Solo agrupa tareas documentales o de bajo riesgo. No agrupes nada que toque produccion, datos reales, .env, secretos, Supabase remoto, migraciones, Auth/RLS, API publica, Google Workspace, infraestructura cloud o cambios funcionales sensibles.

Al cierre valida, crea commit, sube rama y prepara PR draft. No hagas merge.
```

## Prompt - Generar prompt para Codex JetBrains/WebStorm

```text
Control, genera un prompt especifico para Codex JetBrains/WebStorm.

Tarea: [DESCRIBIR TAREA]

El prompt debe incluir:

- objetivo tecnico;
- contexto minimo;
- archivos permitidos;
- archivos prohibidos;
- restricciones aplicables;
- pasos de validacion;
- criterios de aceptacion;
- respuesta final esperada;
- instruccion de no hacer commit, push ni merge salvo autorizacion.

No ejecutes la tarea. Solo genera el prompt para revision.
```

## Prompt - Ejecutar QA funcional local

```text
Control, prepara y ejecuta QA funcional local para [MODULO/TAREA].

Valida:

- funcionalidad esperada;
- permisos por rol si aplica;
- errores controlados;
- ausencia de efectos colaterales;
- alcance aprobado;
- evidencia de pruebas.

No corrijas bugs dentro del mismo PR salvo autorizacion.

Entrega:

1. Informe QA.
2. Evidencia.
3. Hallazgos por severidad.
4. Bloqueos.
5. Riesgos.
6. Recomendacion.
```

## Prompt - Revisar PR antes de integrar

```text
Control, revisa el PR #[NUMERO].

Evalua:

- alcance real;
- archivos modificados;
- coincidencia con el resumen;
- restricciones respetadas;
- validaciones ejecutadas;
- riesgos;
- conflictos o dependencia con otros PRs;
- si debe seguir draft o pasar a ready;
- si recomiendas integrar o pedir cambios.

No hagas merge. Presenta analisis para Javier.
```

## Prompt - Cerrar tarea y preparar PR

```text
Control, cierra la tarea actual.

Ejecuta:

git diff --check
npm run lint
npm run build
git status

Luego:

1. Revisa el diff.
2. Confirma que no hay archivos fuera de alcance.
3. Crea commit con mensaje claro.
4. Sube la rama.
5. Crea o actualiza PR draft contra main.
6. No hagas merge.

Entrega resumen final con rama, commit, archivos, validaciones, resultado, riesgos pendientes y PR.
```
