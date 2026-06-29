# Decisiones del proyecto

Responsable del documento: Control de desarrollo
Fecha creacion: `2026-06-11`

Este documento registra decisiones estables. No reemplaza la conversacion, pero evita perder acuerdos importantes entre chats.

## Reglas

- Registrar decisiones tomadas y, cuando Control lo solicite, propuestas de decision o preguntas bloqueantes con estado explicito.
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
| DEC-013 | Hallazgo origen principal de trabajo. | Validada | 2026-06-17 |
| DEC-014 | No crear tabla puente `trabajo_hallazgos` en esta etapa. | Validada | 2026-06-17 |
| DEC-015 | Crear trabajo no crea derivados automaticos. | Validada | 2026-06-17 |
| DEC-016 | Finanzas no accede a datos clinicos sensibles. | Aprobada documentalmente | 2026-06-19 |
| DEC-017 | Finanzas opera con alias administrativo y datos financieros mínimos. | Aprobada documentalmente | 2026-06-19 |
| DEC-018 | Fotos de elementos con Storage privado y tabla relacional. | Aprobada documentalmente | 2026-06-19 |
| DEC-019 | SEC-001 valida RLS local pero no habilita datos reales. | Validada | 2026-06-27 |
| DEC-020 | Finanzas usa vista financiera minima dedicada. | Validada localmente | 2026-06-27 |
| DEC-021 | Reportes se separan por rol y Finanzas no consulta clinica. | Integrada | 2026-06-29 |
| DEC-022 | Finanzas no debe ver `paciente_id` real por defecto. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-023 | Terapeuta no administra pagos desde ficha clinica. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-024 | Un aspecto revisado debe tener maximo un hallazgo activo en v1. | Propuesta pendiente aprobacion clinica | 2026-06-29 |
| DEC-025 | Hallazgo a trabajo mantiene origen principal sin automatismos. | Estable v1 / abierta evolucion | 2026-06-29 |
| DEC-026 | Produccion debe usar anulacion logica, no delete fisico operativo. | Propuesta bloqueante | 2026-06-29 |
| DEC-027 | Finanzas solo debe ver textos administrativos financieros. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-028 | Fotos reales quedan bloqueadas hasta politica, QA, auditoria y anulacion. | Propuesta bloqueante | 2026-06-29 |
| DEC-029 | Scripts manuales sobre Auth solo local/demo y prohibidos en produccion. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-030 | El proyecto debe reconocer LOCAL, DEMO, STAGING y PRODUCCION. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-031 | Carga real requiere aprobacion explicita y checklist. | Pregunta abierta bloqueante | 2026-06-29 |
| DEC-032 | Auth productivo por invitacion/provisioning y MFA por rol. | Propuesta pendiente aprobacion | 2026-06-29 |

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

## DEC-013 - Hallazgo origen principal de trabajo

**Estado:** Validada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** BE-011
**Fecha creacion:** 2026-06-17
**Rama sugerida:** `docs/ctrl-004-sync-post-imp-data-be011`
**Dependencias:** DEC-007, DEC-008, DEC-009, DEC-010, BE-011

### Decision
La primera version de trazabilidad hallazgo a trabajo usara `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal del trabajo.

### Razon
La estructura actual ya permite vincular un trabajo con un hallazgo sin crear migracion inicial. Esto cubre el flujo inicial recomendado: un hallazgo relevante se evalua manualmente y puede originar un trabajo principal.

### Impacto
- La implementacion futura debe insertar trabajos con `revision_hallazgo_origen_id` cuando el origen sea un hallazgo.
- La UI debe advertir si ya existe un trabajo asociado al mismo hallazgo.
- No se debe sobredisenar el modelo antes de validar necesidad real muchos-a-muchos.

### Observaciones
Esta decision confirma BE-011 y debe guiar UI-012 e IMP-002.

## DEC-014 - No crear tabla puente `trabajo_hallazgos` en esta etapa

**Estado:** Validada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** BE-011
**Fecha creacion:** 2026-06-17
**Rama sugerida:** `docs/ctrl-004-sync-post-imp-data-be011`
**Dependencias:** BE-011, DEC-013

### Decision
No se crea tabla puente `trabajo_hallazgos` en esta etapa.

### Razon
La primera version puede operar con un hallazgo origen principal mediante `trabajos.revision_hallazgo_origen_id`. Una tabla puente agregaria complejidad antes de confirmar si el flujo requiere una relacion muchos-a-muchos formal.

### Impacto
- No crear migracion para `trabajo_hallazgos` en la implementacion inicial.
- Mantener `trabajo_hallazgos` como alternativa futura si se confirma necesidad clinica y tecnica.
- Si se requiere mayor trazabilidad granular, evaluar primero `trabajo_elementos.revision_hallazgo_id` y `trabajo_acciones.revision_hallazgo_id`.

### Observaciones
Cualquier tabla puente futura debe pasar por tarea backend especifica y aplicar criterios BE-003.

## DEC-015 - Crear trabajo no crea derivados automaticos

**Estado:** Validada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** BE-011
**Fecha creacion:** 2026-06-17
**Rama sugerida:** `docs/ctrl-004-sync-post-imp-data-be011`
**Dependencias:** DEC-009, DEC-010, DEC-012, BE-011

### Decision
Crear un trabajo desde un hallazgo no crea cobro, sesiones ni acciones automaticamente.

### Razon
Un trabajo representa una decision clinica y un plan operativo. Las sesiones, acciones y cobros requieren decisiones posteriores, con contexto propio y validaciones especificas.

### Impacto
- El flujo `Evaluar trabajo` debe pedir confirmacion manual antes de crear un trabajo.
- El trabajo creado no debe generar sesiones automaticamente.
- El trabajo creado no debe generar acciones automaticamente.
- El trabajo creado no debe generar cobros automaticamente.
- Finanzas debe decidir posteriormente si el trabajo es unidad cobrable separada, parte de un paquete o seguimiento sin cobro.

### Observaciones
Esta decision protege DEC-009, DEC-010 y DEC-012, y debe quedar visible en UI-012 e IMP-002.

## DEC-016 - Finanzas no accede a datos clínicos sensibles

**Estado:** Aprobada documentalmente
**Origen:** SEC-002
**Fecha:** 2026-06-19

### Decisión

El rol Finanzas debe operar cobros, pagos y reportes financieros con datos administrativos mínimos, pero no debe acceder a datos clínicos sensibles.

### Alcance

Finanzas no debe leer evaluaciones, elementos del caso, aspectos revisados, hallazgos, notas clínicas, información canalizada, acciones terapéuticas ni resultados de sesiones.

### Consecuencia

Las vistas financieras futuras deben exponer solo datos mínimos administrativos o unidades cobrables. Esta decisión debe guiar SEC-001, SEC-004, BE-016 y UI-016.

## DEC-017 - Finanzas opera con alias administrativo y datos financieros mínimos

**Estado:** Aprobada documentalmente
**Origen:** SEC-004
**Fecha:** 2026-06-19

### Decisión

El rol Finanzas debe operar con alias administrativo, identificador interno y datos financieros mínimos. No debe ver por defecto nombre completo, teléfono, email ni ficha completa del paciente.

### Alcance

Finanzas puede ver datos necesarios para cobranza, pagos, saldos, conciliación y reportes financieros. El nombre completo, teléfono o email solo podrán exponerse con aprobación expresa de Control de Desarrollo y consentimiento/autorización suficiente definido en BE-020.

### Consecuencia

BE-016 ya diseño e integro una vista financiera minima por unidad cobrable. UI-016 ya separo reportes por rol. SEC-001 probo runtime que Finanzas no acceda a clinica sensible ni archivos clinicos asociados. BE-021 debe definir anulacion logica y prohibicion de delete fisico financiero en produccion.

## DEC-018 - Fotos de elementos con Storage privado y tabla relacional

**Estado:** Aprobada documentalmente
**Origen:** BE-022 / UI-022
**Fecha:** 2026-06-19

### Decisión

Las fotos de elementos del caso se gestionan mediante Supabase Storage privado y la tabla `public.fotos_elementos_caso`.

### Alcance

La columna `elementos_caso.foto_url` queda deprecada para uso operativo principal y no debe usarse como solucion de almacenamiento documental.

Las fotos de elementos del caso son archivos clinicos sensibles. Finanzas no debe ver fotos ni rutas de Storage asociadas.

### Consecuencia

Las fotos pueden existir en multiples registros por elemento, con metadatos, estado logico, tipo de foto, principalidad y RLS. Cualquier uso con datos reales requiere cerrar PROD-001, validar Storage/RLS runtime y definir auditoria de accesos o cambios sensibles.

## DEC-019 - SEC-001 valida RLS local pero no habilita datos reales

**Estado:** Validada
**Origen:** SEC-001
**Fecha:** 2026-06-27

### Decision

La validacion runtime local de SEC-001 se considera aprobada con observaciones, pero no habilita produccion ni carga de datos reales.

### Razon

RLS se comporta correctamente por rol en Supabase local, incluyendo fotos y Storage privado, pero quedan pendientes de hardening y gobierno de datos antes de operar informacion sensible real.

### Impacto

- PROD-001 sigue bloqueante.
- Finanzas permanece sin acceso a clinica sensible, fotos ni rutas Storage.
- BE-016 ya integro la vista financiera minima.
- UI-016 ya separo reportes por rol.
- SEC-005 debe definir auditoria de accesos/cambios sensibles.
- BE-021 debe definir anulacion logica vs delete fisico.
- Un hardening posterior debe revisar grants amplios de `fotos_elementos_caso` y Storage.

### Observaciones

Informe relacionado: `docs/control/auditorias/SEC-001_VALIDACION_RUNTIME_RLS_ROLES.md`.

## DEC-020 - Finanzas usa vista financiera minima dedicada

**Estado:** Validada localmente
**Origen:** BE-016 / SEC-001 / SEC-004
**Fecha:** 2026-06-27

### Decision

El rol Finanzas debe consumir `public.vista_finanzas_unidades_cobrables` como superficie financiera minima por unidad cobrable.

`public.vista_cobros_estado` se mantiene por compatibilidad interna/admin, pero no debe usarse como vista autorizada para Finanzas.

### Razon

SEC-001 confirmo que `vista_cobros_estado` exponia referencias tecnicas a unidades clinicas. Aunque no contenia contenido clinico, BE-016 reduce la superficie a datos financieros y administrativos minimos.

### Impacto

- `FinanzasPage` usa `vista_finanzas_unidades_cobrables`.
- Finanzas no recibe filas desde `vista_cobros_estado`.
- La vista nueva no expone nombre completo, telefono, email, IDs clinicos directos, datos clinicos, fotos, miniaturas ni `storage_path`.
- QA-004 valido funcionalmente el alcance de BE-016 en local.
- UI-016 ya separo `ReportesPage` por rol.
- BE-021 y SEC-005 siguen pendientes antes de datos reales.

### Observaciones

Informe relacionado: `docs/control/auditorias/BE-016_VISTA_FINANCIERA_MINIMA.md`.

## DEC-021 - Reportes se separan por rol y Finanzas no consulta clinica

**Estado:** Integrada
**Origen:** UI-016 / SEC-002 / SEC-004 / BE-016
**Fecha:** 2026-06-29

### Decision

`ReportesPage` debe renderizar superficies distintas por rol activo:

- Admin: reportes generales, clinicos, financieros y operativos autorizados.
- Terapeuta: reportes clinicos sin panel financiero completo.
- Finanzas: reportes financieros desde `public.vista_finanzas_unidades_cobrables`.

Finanzas no debe consultar ni mostrar datos clinicos desde reportes.

### Razon

La seguridad visual no debe depender de que RLS devuelva cero filas despues de intentar consultar tablas clinicas. El frontend debe evitar la consulta clinica cuando el rol activo es Finanzas.

### Impacto

- `ReportesPage` detecta rol activo antes de cargar datos.
- Finanzas solo carga `public.vista_finanzas_unidades_cobrables`.
- Finanzas no ve pacientes clinicos, consultas, evaluaciones, casos, elementos, hallazgos, trabajos clinicos sensibles, fotos, miniaturas ni `storage_path`.
- Este avance no habilita datos reales, fotos reales, pagos reales ni produccion.
- QA-005 debe registrar validacion funcional local de UI-016.

### Observaciones

Informe relacionado: `docs/control/auditorias/UI-016_REPORTES_POR_ROL.md`.

## DEC-022 - Finanzas no debe ver `paciente_id` real por defecto

**Estado:** Propuesta pendiente aprobacion
**Origen:** CTRL-008
**Fecha:** 2026-06-29

### Decision propuesta

Finanzas no debe ver ni consumir `paciente_id` real por defecto en pantallas, reportes o exportaciones.

El `paciente_id` puede seguir existiendo como clave tecnica interna para joins, RLS y conciliacion backend, pero la superficie visible de Finanzas debe usar alias/codigo administrativo persistente o identificador financiero no clinico.

### Razon

`public.vista_finanzas_unidades_cobrables` reduce correctamente datos clinicos, pero aun expone `paciente_id` y deriva alias/codigo desde ese UUID. En datos reales, ese identificador estable puede facilitar correlacion con tablas clinicas si existe otro canal de acceso.

### Impacto

- BE-016 sigue valido para local/demo.
- BE-023 debe definir alias/codigo administrativo persistente y evaluar ocultar `paciente_id` en la vista financiera.
- QA-006 debe validar no exposicion de identificadores clinicos al rol Finanzas.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-023 - Terapeuta no administra pagos desde ficha clinica

**Estado:** Propuesta pendiente aprobacion
**Origen:** CTRL-008
**Fecha:** 2026-06-29

### Decision propuesta

Terapeuta no debe administrar cobros ni pagos dentro de la ficha clinica.

Si Control aprueba visibilidad financiera para Terapeuta, esta debe limitarse a estado minimo administrativo, sin montos detallados, metodos, referencias, notas ni acciones de gestion.

### Razon

`PagosCasoPanel` vive dentro de la ficha de caso y consulta `vista_cobros_estado` y `pagos`. Aunque RLS limite accesos, la UI mezcla superficie clinica con detalle financiero.

### Impacto

- UI-023 debe revisar superficies por rol, incluido el panel financiero de ficha clinica.
- BE-025 debe definir contrato minimo si se aprueba estado financiero para Terapeuta.
- Finanzas mantiene la administracion detallada desde `FinanzasPage`.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-024 - Un aspecto revisado debe tener maximo un hallazgo activo en v1

**Estado:** Propuesta pendiente aprobacion clinica
**Origen:** CTRL-008 / QA-002 / IMP-001
**Fecha:** 2026-06-29

### Decision propuesta

Para la primera version operativa, un aspecto revisado debe tener maximo un hallazgo activo.

Si se requiere registrar multiples hallazgos asociados al mismo aspecto, debe aprobarse una regla clinica especifica antes de crear migracion o modificar UI.

### Razon

La UI ya previene duplicados por `revision_aspecto_id`, pero la base de datos no tiene constraint unico equivalente. La regla no debe depender solo del frontend.

### Impacto

- BE-024 debe definir si corresponde constraint parcial, validacion SQL o ajuste UI.
- QA-006 debe validar duplicados por rol y por intento tecnico local si se implementa DB.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-025 - Hallazgo a trabajo mantiene origen principal sin automatismos

**Estado:** Estable v1 / abierta evolucion
**Origen:** CTRL-008 / DEC-013 / DEC-014 / DEC-015
**Fecha:** 2026-06-29

### Decision

La primera version de IMP-002 debe mantener:

- `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal;
- decision manual del terapeuta;
- boton/flujo `Evaluar trabajo`;
- validacion de trabajo existente asociado al mismo hallazgo;
- no crear cobros, sesiones ni acciones automaticamente;
- no crear tabla puente `trabajo_hallazgos` en esta etapa.

### Pregunta abierta

El equipo clinico debe confirmar si un hallazgo puede originar mas de un trabajo formal. Mientras no exista esa aprobacion, varios trabajos desde un mismo hallazgo no deben ser camino principal.

### Impacto

- IMP-002 debe depender de CTRL-008.
- Cualquier relacion muchos-a-muchos futura requiere tarea backend separada.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-026 - Produccion debe usar anulacion logica, no delete fisico operativo

**Estado:** Propuesta bloqueante
**Origen:** CTRL-008 / SEC-001 / SEC-002 / SEC-004
**Fecha:** 2026-06-29

### Decision propuesta

Para produccion y datos reales, el sistema debe usar anulacion logica transversal y no delete fisico operativo para datos clinicos, financieros, fotos ni usuarios internos.

Delete fisico debe quedar reservado a mantenimiento tecnico excepcional, aprobado y auditado.

### Razon

No existe politica transversal de anulacion logica. Hay grants amplios con `delete`, una policy `usuarios_internos_delete_admin` y varias FK con cascadas. Esto es riesgoso para informacion sensible real.

### Impacto

- BE-021 pasa a ser bloqueante para datos reales.
- SEC-005 debe registrar auditoria de anulaciones y cambios sensibles.
- PROD-001 sigue bloqueante.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-027 - Finanzas solo debe ver textos administrativos financieros

**Estado:** Propuesta pendiente aprobacion
**Origen:** CTRL-008 / SEC-001 / BE-016
**Fecha:** 2026-06-29

### Decision propuesta

Finanzas debe ver conceptos y referencias administrativas, no textos clinicos.

Campos libres como `descripcion_cobro`, `observaciones`, `notas_internas` y referencias de pago no deben contener ni exponer informacion clinica.

### Razon

Aunque BE-016 usa una vista minima, `cobros` y `pagos` tienen campos libres que pueden filtrar clinica si se usan mal o si una vista/pantalla futura los expone.

### Impacto

- BE-025 debe definir campos permitidos/prohibidos.
- UI-015 debe ajustar microcopy para evitar contenido clinico en finanzas.
- QA-006 debe incluir validacion de textos sensibles.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-028 - Fotos reales quedan bloqueadas hasta politica, QA, auditoria y anulacion

**Estado:** Propuesta bloqueante
**Origen:** CTRL-008 / DEC-018 / SEC-001
**Fecha:** 2026-06-29

### Decision propuesta

Fotos reales siguen prohibidas hasta cerrar:

- QA-003;
- SEC-005;
- BE-021;
- SEC-006;
- PROD-001.

Admin y Terapeuta pueden operar fotos solo en local/demo con imagenes ficticias. Finanzas no debe ver fotos, miniaturas, rutas ni `storage_path`.

### Razon

Las fotos son archivos clinicos sensibles y requieren retencion, anulacion, auditoria, control de objetos huerfanos y hardening de Storage antes de uso real.

### Impacto

- SEC-006 debe definir politica de fotos, retencion y objetos huerfanos.
- QA-003 debe validar funcionalidad local con imagen ficticia.
- No se habilitan fotos reales.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-029 - Scripts manuales sobre Auth solo local/demo y prohibidos en produccion

**Estado:** Propuesta pendiente aprobacion
**Origen:** CTRL-008 / SEC-003
**Fecha:** 2026-06-29

### Decision propuesta

Scripts manuales sobre `auth.users` o usuarios demo solo pueden usarse en local/demo, de forma idempotente, documentada y sin secretos.

Quedan prohibidos como practica normal en produccion.

### Razon

Manipular Auth manualmente puede dejar usuarios huerfanos, roles inconsistentes, confirmaciones saltadas o practicas inseguras que luego se copian a produccion.

### Impacto

- SEC-007 debe definir procedimiento de usuarios demo/local.
- SEC-003 debe cubrir alta/baja/cambio de rol, signup, confirmacion, MFA y usuarios invitados.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-030 - El proyecto debe reconocer LOCAL, DEMO, STAGING y PRODUCCION

**Estado:** Propuesta pendiente aprobacion
**Origen:** CTRL-008 / PROD-001
**Fecha:** 2026-06-29

### Decision propuesta

El proyecto debe reconocer formalmente cuatro ambientes:

- `LOCAL`;
- `DEMO`;
- `STAGING`;
- `PRODUCCION`.

Mientras PROD-001 siga abierto, la UI debe indicar que no se deben usar datos reales.

### Razon

Sin separacion visual, documental y tecnica de ambientes, existe riesgo de cargar informacion sensible en entornos equivocados.

### Impacto

- BE-018 y DOC-001 deben definir ambientes.
- UI-020 debe mostrar ambiente activo.
- UI-021 debe advertir/bloquear produccion no habilitada.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-031 - Carga real requiere aprobacion explicita y checklist

**Estado:** Pregunta abierta bloqueante
**Origen:** CTRL-008 / PROD-001
**Fecha:** 2026-06-29

### Decision propuesta

La carga real requiere aprobacion explicita de Javier / Control de Desarrollo y checklist documentado antes de usar pacientes, fotos o pagos reales.

### Checklist preliminar

- SEC-003 aprobado como diseno.
- SEC-008 implementado y validado.
- SEC-005 cerrado.
- BE-021 cerrado.
- BE-018 cerrado.
- BE-019 cerrado.
- BE-020 cerrado.
- QA-006 cerrado.
- QA-003 cerrado si habra fotos reales.
- BE-023 cerrado si Finanzas no debe ver `paciente_id`.
- BE-025 cerrado si Finanzas operara textos financieros.
- UI-020 y UI-021 cerrados.
- Matriz de permisos vigente y validada.
- Procedimiento de carga real documentado.
- Prohibicion de seeds demo en produccion confirmada.

### Preguntas abiertas

- Quien aprueba formalmente el primer uso con datos reales?
- Que evidencia minima debe adjuntarse?
- Se permitira staging con datos reales anonimizados o solo ficticios?
- Fotos y pagos reales entran en primera fase o fases posteriores?

### Impacto

PROD-001 sigue bloqueante.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

## DEC-032 - Auth productivo por invitacion/provisioning y MFA por rol

**Estado:** Propuesta pendiente aprobacion
**Origen:** SEC-003 / CTRL-008 / DEC-029 / DEC-030 / DEC-031
**Fecha:** 2026-06-29

### Decision propuesta

En staging y produccion, Supabase Auth no debe operar con signup publico abierto.

El alta de usuarios debe realizarse por invitacion o provisioning administrado, con:

- usuario Auth creado por procedimiento aprobado;
- registro activo en `public.usuarios_internos`;
- rol explicito y valido;
- email confirmado;
- password policy fuerte;
- MFA obligatorio para Admin, Finanzas y Terapeuta antes de produccion;
- auditoria de alta, cambio de rol, desactivacion, reactivacion y recuperacion.

### Razon

El proyecto maneja informacion clinica, financiera y fotos potencialmente sensibles. La configuracion local actual de Auth es util para demo/desarrollo, pero no es suficiente para uso real.

Mantener signup abierto o alta manual sin trazabilidad puede generar usuarios huerfanos, roles inconsistentes, recuperaciones inseguras y escalamiento de privilegios.

### Impacto

- `SEC-008` debe implementar hardening Auth en tarea separada.
- `SEC-005` debe incorporar eventos Auth y cambios de rol.
- `SEC-007` debe limitar scripts manuales a local/demo.
- `BE-018` y `DOC-001` deben separar URLs y callbacks por ambiente.
- `QA-006` debe validar casos Auth minimos por rol y estado.
- PROD-001 sigue bloqueante.

### Observaciones

Esta decision no modifica configuracion tecnica. El diseno queda registrado en `docs/control/auditorias/SEC-003_HARDENING_AUTH.md`.
