# Prompts operativos para Codex

## Uso

Estos prompts ayudan a operar Codex como herramienta de desarrollo controlado en Terapeutas Australes App.

Deben usarse junto con:

- `AGENTS.md`
- `docs/control/10_OPERACION_CODEX.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`

## Prompt base - Control de Desarrollo

```text
Actua como Control de Desarrollo principal del proyecto Terapeutas Australes App.

Antes de modificar archivos, revisa:

1. Estado Git.
2. Rama actual.
3. Ultimos commits.
4. PRs abiertos.
5. Documentacion maestra en docs/control.

Entrega primero:

1. Estado actual del repositorio.
2. PRs abiertos.
3. Ultimos PRs integrados relevantes.
4. Bloqueos vigentes.
5. Riesgos detectados.
6. Siguiente tarea recomendada.
7. Rama propuesta.
8. Archivos que modificarias.
9. Archivos que no tocaras.
10. Validaciones necesarias.

No modifiques archivos hasta que apruebe el plan.
```

## Prompt - Tarea documental

```text
Control, ejecuta la tarea documental [CODIGO - NOMBRE].

Alcance:

- Solo documentacion.
- Mantener el cambio acotado.
- No mezclar con implementacion funcional.
- No habilitar capacidades nuevas.

Antes de cerrar, revisa el diff y confirma que el cambio coincide con el alcance aprobado.

Entrega resumen final con archivos modificados, validaciones y PR creado o actualizado.
```

## Prompt - Generar prompt para Codex JetBrains/WebStorm

```text
Control, genera un prompt especifico para Codex JetBrains/WebStorm.

Tarea: [DESCRIBIR TAREA]

El prompt debe incluir:

- objetivo tecnico;
- contexto del proyecto;
- archivos permitidos;
- archivos prohibidos;
- restricciones aplicables;
- pasos de validacion;
- criterios de aceptacion;
- respuesta final esperada;
- indicacion de no hacer commit ni push salvo autorizacion.

No ejecutes la tarea. Solo genera el prompt para revision.
```

## Prompt - UI/UX o pulido visual

```text
Actua como Codex JetBrains/WebStorm para una tarea UI/UX acotada.

Objetivo:
[OBJETIVO]

Archivos permitidos:
[LISTA]

Archivos prohibidos:
[LISTA]

Reglas:

- No cambiar modelo de datos.
- No modificar flujo clinico sin aprobacion.
- Mantener microcopy claro para usuarios.
- Ejecutar validaciones del proyecto si se modifica codigo.
- No hacer commit ni push hasta aprobacion.

Entrega:

1. Cambios aplicados.
2. Archivos modificados.
3. Validaciones ejecutadas.
4. Riesgos pendientes.
5. Recomendacion.
```

## Prompt - QA funcional local

```text
Control, prepara y ejecuta QA funcional local para [MODULO/TAREA].

Validar:

- funcionalidad esperada;
- permisos por rol si aplica;
- errores controlados;
- ausencia de efectos colaterales;
- alcance aprobado;
- evidencia de pruebas.

No corrijas bugs dentro del mismo PR salvo autorizacion. Registra hallazgos y propone tareas derivadas.

Entregar:

1. Informe QA.
2. Evidencia de validaciones.
3. Hallazgos por severidad.
4. Bloqueos.
5. Recomendacion de siguiente paso.
```

## Prompt - Revisar PR antes de integrar

```text
Control, revisa el PR #[NUMERO].

Evalua:

- alcance real;
- archivos modificados;
- si coincide con el resumen;
- restricciones respetadas;
- validaciones ejecutadas;
- riesgos;
- si debe pasar de draft a ready;
- si se recomienda integrar o pedir cambios.

No hagas merge. Presenta analisis para revision de Javier.
```
