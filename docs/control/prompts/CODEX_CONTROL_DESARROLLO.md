# Prompts operativos para Codex

Estos prompts son reutilizables por Javier para operar Codex como Control de Desarrollo dentro de **Terapeutas Australes App**.

Usar junto con:

- `AGENTS.md`
- `docs/control/10_OPERACION_CODEX.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`

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
