# Decisiones del proyecto

Responsable del documento: Control de desarrollo  
Fecha creacion: `2026-06-11`

Este documento registra decisiones estables. No reemplaza la conversacion, pero evita perder acuerdos importantes entre chats.

## Reglas

- Registrar solo decisiones tomadas, no ideas.
- Si una decision cambia, crear una nueva entrada y marcar la anterior como reemplazada en observaciones.
- Toda decision que implique cambios tecnicos debe generar una tarea relacionada.
- Toda decision clinica debe poder ser entendida por Revision de flujo clinico.

## Vista rapida

| Codigo | Decision | Estado | Fecha |
| --- | --- | --- | --- |
| DEC-001 | Repositorio oficial del proyecto. | Validada | 2026-06-11 |
| DEC-002 | Sistema de chats y responsabilidades. | Validada | 2026-06-11 |
| DEC-003 | Sistema de codigos, estados y prioridades. | Validada | 2026-06-11 |
| DEC-004 | Restricciones de seguridad operativa. | Validada | 2026-06-11 |
| DEC-005 | `docs/control/` como centro documental. | Integrada | 2026-06-11 |
| DEC-006 | Revisiones y detalle de revisiones viven dentro de la ficha del caso. | Validada | 2026-06-12 |
| DEC-007 | Responsabilidad de `revision_hallazgos`. | Validada | 2026-06-12 |
| DEC-008 | Hallazgos viven dentro del detalle de revision. | Validada | 2026-06-12 |
| DEC-009 | Criterio de conversion hallazgo a trabajo. | Validada | 2026-06-12 |
| DEC-010 | Separacion trabajo, sesion y accion. | Validada | 2026-06-12 |
| DEC-011 | Agenda como modulo mixto tipificado. | Validada | 2026-06-12 |
| DEC-012 | Cobros por unidad cobrable. | Validada | 2026-06-12 |

## DEC-001 - Repositorio oficial del proyecto

**Estado:** Validada  
**Prioridad:** Crítica  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
El repositorio oficial del proyecto es `4ndres30/terapeutas-australes-app`.

### Razon
Evitar trabajar sobre el repositorio antiguo o mezclar historiales.

### Impacto
Todo trabajo futuro debe verificar remoto antes de editar, commitear, empujar o abrir PR.

### Observaciones
El repositorio antiguo no oficial no debe usarse.

## DEC-002 - Sistema de chats y responsabilidades

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
El proyecto se ordena en cuatro chats: Control de desarrollo, Revision de flujo clinico, Integracion estructura / backend y UI / UX / Pulido visual.

### Razon
Separar decisiones, revision clinica, ejecucion tecnica y pulido visual para evitar mezclas de responsabilidad.

### Impacto
Cada tarea debe indicar responsable y no invadir dominios ajenos.

### Observaciones
Control de desarrollo coordina; no ejecuta codigo salvo instruccion expresa.

## DEC-003 - Sistema de codigos, estados y prioridades

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
Se usaran codigos por tipo de trabajo, estados permitidos y prioridades permitidas definidos en `README.md`.

### Razon
Facilitar trazabilidad sin crear burocracia pesada.

### Impacto
Todo pendiente nuevo debe usar codigo, estado, prioridad y responsable.

### Observaciones
No crear estados o prioridades nuevas sin actualizar esta decision.

## DEC-004 - Restricciones de seguridad operativa

**Estado:** Validada  
**Prioridad:** Crítica  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
Queda prohibido tocar `.env`, ejecutar `supabase db push`, tocar Supabase remoto, fusionar a `main`, modificar codigo fuente, modificar migraciones, ejecutar cambios de base de datos o abrir PR desde esta tarea documental.

### Razon
Proteger datos, configuracion sensible, estabilidad de `main` y flujo de desarrollo.

### Impacto
Cualquier tarea futura que requiera romper una restriccion necesita instruccion expresa de Javier.

### Observaciones
Estas restricciones aplican especialmente a Codex y ChatGPT cuando trabajan con autonomia.

## DEC-005 - docs/control como centro documental

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** DEC-001, DEC-002, DEC-003, DEC-004  

### Decision
La carpeta `docs/control/` sera el centro documental practico del proyecto.

### Razon
Centralizar estado, pendientes, decisiones y bitacora para que Javier, ChatGPT y Codex compartan contexto.

### Impacto
Los chats deben revisar este directorio antes de proponer o ejecutar tareas relevantes.

### Observaciones
La estructura queda pendiente de validacion final por Javier antes de abrir PR.

## DEC-006 - Revisiones y detalle de revisiones viven dentro de la ficha del caso

**Estado:** Validada
**Prioridad:** Crítica
**Responsable:** Control de desarrollo
**Origen:** Javier / Control de desarrollo
**Fecha creación:** 2026-06-12
**Rama sugerida:** `docs/control-proyecto`
**Dependencias:** DEC-002, QA-001

### Decisión
Las revisiones y el detalle de revisiones no serán módulos principales independientes. Deben vivir dentro de la ficha del caso.

### Razón
Una revisión pertenece a un caso. El detalle de revisión depende de una revisión existente y de elementos reales del caso.

### Impacto
- `/revisiones` debe redirigir o depender de `/casos`.
- `/detalle-revisiones` debe redirigir o depender de `/casos`.
- La creación de revisiones debe realizarse desde la ficha del caso.
- La creación de detalles debe exigir revisión y elemento del caso existentes.

### Observaciones
Esta decisión protege el flujo clínico central y evita duplicidades funcionales.

## DEC-007 - Responsabilidad de `revision_hallazgos`

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** RFC-001 / BE-001  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/decisiones-rfc-001`  
**Dependencias:** DEC-006, BE-001, RFC-001  

### Decision
`revision_hallazgos` registra solo hallazgos clinicamente relevantes derivados preferentemente de `revision_aspectos`.

### Razon
`revision_aspectos` registra todo lo revisado o medido. `revision_hallazgos` debe guardar solo aquello que requiere destacarse, priorizarse, seguirse, derivarse o transformarse en trabajo/intervencion.

### Impacto
- No todo aspecto revisado debe convertirse en hallazgo.
- El origen clinico preferente de un hallazgo es un aspecto revisado.
- Un hallazgo debe mantener trazabilidad hacia caso, revision, elemento y aspecto cuando corresponda.
- Un trabajo responde a un hallazgo; no debe ser considerado origen principal del hallazgo.

### Observaciones
Esta decision no implementa cambios tecnicos. Debe guiar futuras tareas de Backend y UI/UX.

## DEC-008 - Hallazgos viven dentro del detalle de revision

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** RFC-001  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/decisiones-rfc-001`  
**Dependencias:** DEC-006, DEC-007, RFC-001  

### Decision
Los hallazgos no tendran un modulo principal independiente de creacion. Deben gestionarse desde la ficha del caso, dentro del detalle de revision.

### Razon
El hallazgo nace del trabajo clinico realizado en una revision y debe conservar contexto inmediato con el caso, la revision, el elemento revisado y el aspecto que lo origina.

### Impacto
- La creacion principal de hallazgos debe ocurrir desde `CasoDetallePage` / detalle de revision.
- Una vista global futura de hallazgos puede existir solo como consulta, seguimiento o tablero operativo, no como origen principal de creacion.
- UI/UX debe diferenciar visualmente aspecto revisado, hallazgo relevante, trabajo generado y seguimiento pendiente.

### Observaciones
Esta decision complementa DEC-006 y evita que `revision_hallazgos` se transforme en un modulo aislado del caso.

## DEC-009 - Criterio de conversion hallazgo a trabajo

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** RFC-001  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/decisiones-rfc-001`  
**Dependencias:** DEC-007, DEC-008, RFC-001  

### Decision
Un hallazgo se convierte en trabajo/intervencion solo cuando requiere intervencion, seguimiento operativo, cierre terapeutico o acciones planificadas.

### Razon
No todo hallazgo amerita un trabajo. Algunos hallazgos pueden quedar como registro, observacion, seguimiento o antecedente clinico sin abrir una intervencion formal.

### Impacto
- La UI no debe crear trabajos automaticamente por cada hallazgo.
- El terapeuta debe decidir cuando un hallazgo genera trabajo.
- Un trabajo puede nacer desde caso, revision, hallazgo, elemento o decision clinica posterior, pero la ruta recomendada es hallazgo relevante -> decision clinica -> trabajo.
- Backend debe mantener trazabilidad entre trabajo y hallazgo origen cuando corresponda.

### Observaciones
Esta decision debe orientar futuras tareas sobre flujo operativo de trabajos/intervenciones.

## DEC-010 - Separacion trabajo, sesion y accion

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** RFC-001 / BE-001  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/decisiones-rfc-001`  
**Dependencias:** DEC-009, RFC-001, BE-001  

### Decision
`trabajos` define la intervencion; `trabajo_sesiones` registra sesiones o jornadas de ejecucion; `trabajo_acciones` registra actos concretos realizados dentro de una sesion.

### Razon
Separar estos niveles evita mezclar el plan de intervencion, la ejecucion temporal y las acciones especificas.

### Impacto
- `trabajos` debe contener objetivo, plan, fase, prioridad, avance y estado general de la intervencion.
- `trabajo_sesiones` debe contener fecha, horario, estado previo, ejecucion, resultado y continuidad de cada sesion.
- `trabajo_acciones` debe contener acciones concretas como retiro, limpieza, sello, integracion, recuperacion, liberacion, ajuste o cierre.
- UI/UX debe evitar formularios gigantes y proponer una experiencia guiada por niveles.

### Observaciones
Esta decision no obliga a implementar el modulo de trabajos inmediatamente; solo fija su responsabilidad funcional.

## DEC-011 - Agenda como modulo mixto tipificado

**Estado:** Validada  
**Prioridad:** Media-alta  
**Responsable:** Control de desarrollo  
**Origen:** RFC-001 / BE-001  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/decisiones-rfc-001`  
**Dependencias:** RFC-001, BE-001  

### Decision
Agenda sera un modulo mixto de eventos programados con tipo de evento obligatorio.

### Razon
Agenda no debe limitarse solo a consultas ni inventar estructura operativa sin distinguir el tipo de actividad que se programa.

### Impacto
Agenda debe poder representar, al menos:

- consulta programada;
- evaluacion programada;
- revision programada;
- sesion de trabajo;
- seguimiento;
- recordatorio interno.

Backend debe proponer una estructura antes de implementar UI operativa.

### Observaciones
BE-001 confirma que Agenda actualmente no tiene backend dedicado. Esta decision habilita una tarea posterior para disenar su modelo.

## DEC-012 - Cobros por unidad cobrable

**Estado:** Validada  
**Prioridad:** Media-alta  
**Responsable:** Control de desarrollo  
**Origen:** RFC-001 / BE-001  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/decisiones-rfc-001`  
**Dependencias:** RFC-001, BE-001  

### Decision
Cada cobro debe representar una unidad cobrable clara. Los cobros pueden asociarse a consulta, evaluacion, caso, revision o trabajo, pero no deben duplicar el cobro de una misma prestacion.

### Razon
El modelo financiero necesita flexibilidad, pero sin reglas podria cobrar simultaneamente una misma prestacion desde varios niveles del flujo clinico.

### Impacto
Regla operativa inicial:

- si se cobra una consulta, asociar a consulta;
- si se cobra una evaluacion, asociar a evaluacion;
- si se cobra una revision, asociar a revision;
- si se cobra una intervencion, asociar a trabajo;
- si se cobra un paquete completo, asociar a caso y describir claramente el alcance.

Los pagos deben aplicarse a cobros, no directamente a caso, revision o trabajo.

### Observaciones
Backend debe revisar posteriormente si se requieren validaciones SQL o reglas de UI para impedir asociaciones contradictorias.
