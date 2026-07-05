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
| DEC-022 | Finanzas no debe ver `paciente_id` real por defecto. | Diseno documental / pendiente implementacion | 2026-06-29 |
| DEC-023 | Terapeuta no administra pagos desde ficha clinica. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-024 | Un aspecto revisado debe tener maximo un hallazgo activo en v1. | Propuesta pendiente aprobacion clinica | 2026-06-29 |
| DEC-025 | Hallazgo a trabajo mantiene origen principal sin automatismos. | Estable v1 / abierta evolucion | 2026-06-29 |
| DEC-026 | Produccion debe usar anulacion logica, no delete fisico operativo. | Propuesta bloqueante | 2026-06-29 |
| DEC-027 | Finanzas solo debe ver textos administrativos financieros. | Diseno documental / pendiente implementacion | 2026-06-29 |
| DEC-028 | Fotos reales quedan bloqueadas hasta politica, QA, auditoria y anulacion. | Propuesta bloqueante | 2026-06-29 |
| DEC-029 | Scripts manuales sobre Auth solo local/demo y prohibidos en produccion. | Procedimiento documental / pendiente ejecucion controlada | 2026-06-29 |
| DEC-030 | El proyecto debe reconocer LOCAL, DEMO, STAGING y PRODUCCION. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-031 | Carga real requiere aprobacion explicita y checklist. | Pregunta abierta bloqueante | 2026-06-29 |
| DEC-032 | Auth productivo por invitacion/provisioning y MFA por rol. | Propuesta pendiente aprobacion | 2026-06-29 |
| DEC-033 | API segura como frontera entre pagina publica, sistema interno y servicios Google. | Propuesta arquitectonica / pendiente implementacion | 2026-06-30 |
| DEC-034 | Agenda operativa separada de consulta clinica confirmada. | Arquitectura aprobada / DB validada localmente | 2026-07-01 |
| DEC-035 | Migracion progresiva a plataforma Google Cloud. | Propuesta documental / pendiente validacion Javier | 2026-07-01 |
| DEC-036 | State management centralizado con Context + useReducer. | Aprobada / POC en validacion tecnica | 2026-07-04 |
| DEC-037 | Utilidades compartidas en `lib/`. | Aprobada / implementacion en curso | 2026-07-04 |
| DEC-038 | Migraciones SQL para cerrar brechas RLS. | Aprobada / migraciones sin aplicar | 2026-07-04 |
| DEC-039 | Testing minimo requerido (E2E + unit). | Aprobada / pendiente implementacion | 2026-07-04 |
| DEC-040 | Reservada. | Sin definir | - |

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
- SEC-011 define el diseno documental del hardening posterior para revisar grants de `fotos_elementos_caso`, Storage, auditoria y objetos huerfanos.

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

**Estado:** Diseno documental / pendiente implementacion
**Origen:** CTRL-008
**Fecha:** 2026-06-29

### Decision propuesta

Finanzas no debe ver ni consumir `paciente_id` real por defecto en pantallas, reportes o exportaciones.

El `paciente_id` puede seguir existiendo como clave tecnica interna para joins, RLS y conciliacion backend, pero la superficie visible de Finanzas debe usar alias/codigo administrativo persistente o identificador financiero no clinico.

### Razon

`public.vista_finanzas_unidades_cobrables` reduce correctamente datos clinicos, pero aun expone `paciente_id` y deriva alias/codigo desde ese UUID. En datos reales, ese identificador estable puede facilitar correlacion con tablas clinicas si existe otro canal de acceso.

### Impacto

- BE-016 sigue valido para local/demo.
- BE-023 define documentalmente identidad financiera persistente separada y recomienda ocultar `paciente_id` en la vista financiera futura.
- QA-006 debe validar no exposicion de identificadores clinicos al rol Finanzas.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

Diseno relacionado: `docs/control/auditorias/BE-023_ALIAS_CODIGO_ADMINISTRATIVO_FINANZAS.md`.

## DEC-023 - Terapeuta no administra pagos desde ficha clinica

**Estado:** Diseno documental / pendiente implementacion
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

**Estado:** Diseno documental / pendiente implementacion futura
**Origen:** CTRL-008 / SEC-001 / SEC-002 / SEC-004
**Fecha:** 2026-06-29

### Decision propuesta

Para produccion y datos reales, el sistema debe usar anulacion logica transversal y no delete fisico operativo para datos clinicos, financieros, fotos ni usuarios internos.

Delete fisico debe quedar reservado a mantenimiento tecnico excepcional, aprobado y auditado.

### Razon

No existe politica transversal de anulacion logica. Hay grants amplios con `delete`, una policy `usuarios_internos_delete_admin` y varias FK con cascadas. Esto es riesgoso para informacion sensible real.

### Impacto

- BE-021 queda documentado como politica transversal pendiente implementacion real.
- SEC-005 define el modelo documental para registrar auditoria de anulaciones y cambios sensibles.
- PROD-001 sigue bloqueante.

Politica relacionada: `docs/control/auditorias/BE-021_POLITICA_ANULACION_ELIMINACION.md`.

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

- BE-025 define documentalmente campos permitidos/prohibidos.
- UI-015 debe ajustar microcopy para evitar contenido clinico en finanzas.
- QA-006 debe incluir validacion de textos sensibles.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

Contrato relacionado: `docs/control/auditorias/BE-025_CAMPOS_FINANCIEROS_PERMITIDOS_PROHIBIDOS.md`.

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

- SEC-006 define la politica documental de fotos, retencion y objetos huerfanos.
- QA-003 debe validar funcionalidad local con imagen ficticia.
- SEC-011 debe guiar la implementacion tecnica futura de hardening de grants, auditoria, anulacion logica y objetos huerfanos.
- No se habilitan fotos reales.

### Observaciones

Informes relacionados:

- `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.
- `docs/control/auditorias/SEC-006_POLITICA_FOTOS_RETENCION_OBJETOS_HUERFANOS.md`.

## DEC-029 - Scripts manuales sobre Auth solo local/demo y prohibidos en produccion

**Estado:** Procedimiento documental / pendiente ejecucion controlada
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

Procedimiento relacionado: `docs/control/auditorias/SEC-007_PROCEDIMIENTO_USUARIOS_DEMO_LOCAL.md`.

## DEC-030 - El proyecto debe reconocer LOCAL, DEMO, STAGING y PRODUCCION

**Estado:** Diseno documental / pendiente implementacion futura
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

- BE-018 y DOC-001 definen ambientes a nivel documental.
- UI-020 debe mostrar ambiente activo.
- UI-021 debe advertir/bloquear produccion no habilitada.

### Observaciones

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`.

Separacion relacionada: `docs/control/auditorias/BE-018_SEPARACION_TECNICA_AMBIENTES.md`.

Manual relacionado: `docs/control/auditorias/DOC-001_MANUAL_AMBIENTES.md`.

Indicador relacionado: `docs/control/auditorias/UI-020_INDICADOR_AMBIENTE_ACTIVO.md`.

Bloqueo relacionado: `docs/control/auditorias/UI-021_BLOQUEO_PRODUCCION_NO_HABILITADA.md`.

## DEC-031 - Carga real requiere aprobacion explicita y checklist

**Estado:** Politica documental / pendiente implementacion futura
**Origen:** CTRL-008 / PROD-001
**Fecha:** 2026-06-29

### Decision propuesta

La carga real requiere aprobacion explicita de Javier / Control de Desarrollo y checklist documentado antes de usar pacientes, fotos o pagos reales.

### Checklist preliminar

- SEC-003 aprobado como diseno.
- SEC-008 implementado y validado.
- SEC-005 documentado e implementado para uso real.
- BE-021 documentado e implementado para uso real.
- BE-018 documentado e implementado para uso real.
- BE-019 documentado y prueba de restauracion pendiente antes de uso real.
- BE-020 cerrado.
- QA-006 cerrado.
- QA-003 cerrado si habra fotos reales.
- BE-023 cerrado si Finanzas no debe ver `paciente_id`.
- BE-025 cerrado si Finanzas operara textos financieros.
- UI-020 y UI-021 documentados, implementados y validados antes de habilitar produccion.
- Matriz de permisos vigente y validada.
- DOC-001 y DOC-003 documentados y aprobados.
- DOC-002 documentado y restauracion probada antes de produccion.
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

Politica relacionada: `docs/control/auditorias/DOC-003_POLITICA_CARGA_DATOS_REALES.md`.

Backup relacionado: `docs/control/auditorias/BE-019_ESTRATEGIA_BACKUP_RESTAURACION.md`.

Restauracion relacionada: `docs/control/auditorias/DOC-002_PROCEDIMIENTO_BACKUP_RESTAURACION.md`.

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

## DEC-033 - API segura como frontera entre pagina publica, sistema interno y servicios Google

**Estado:** Arquitectura aprobada / DB inicial implementada local
**Origen:** API-001 / PROD-001 / BE-012 / BE-017 / BE-020 / SEC-005
**Fecha:** 2026-06-30

### Decision propuesta

La futura pagina publica de Terapeutas Australes no debe conectarse directamente a tablas clinicas, financieras ni internas de Supabase.

La conexion entre pagina publica, sistema interno y servicios Google debe pasar por una API segura que actue como frontera controlada.

La API sera responsable de:

- validar y sanitizar solicitudes publicas;
- aplicar CORS estricto, rate limit y anti-spam;
- registrar consentimiento cuando corresponda;
- crear solicitudes o citas segun el modelo de Agenda aprobado;
- registrar auditoria minima;
- sincronizar Google Calendar desde backend controlado;
- enviar correos neutros mediante Gmail/Workspace;
- no exponer errores tecnicos, secretos, stack traces, politicas RLS ni estructura de base de datos.

### Reglas

- La pagina publica no debe escribir directamente en tablas clinicas o financieras.
- La pagina publica no debe consultar disponibilidad leyendo agenda interna completa.
- Google Calendar y Gmail/Workspace no deben integrarse desde el frontend publico.
- Los eventos de Calendar deben usar titulos neutros.
- Los correos deben usar contenido neutro.
- Los detalles sensibles deben quedar solo dentro del sistema interno protegido por login, roles, RLS y auditoria.

### Condiciones previas

La API no debe implementarse con datos reales hasta cerrar, al menos:

- BE-012: backend de Agenda tipificada.
- BE-017: estrategia SQL de agenda operativa.
- BE-018: separacion tecnica de ambientes.
- BE-019: backup/restauracion.
- BE-020: consentimiento informado y tratamiento de datos.
- SEC-005: auditoria de cambios sensibles.
- SEC-009: seguridad de API publica.
- DOC-001: manual de ambientes.
- DOC-003: politica de carga de datos reales.
- PROD-001: preparacion para uso real con datos sensibles.

### Impacto

API-001 queda como informe arquitectonico y origina tareas tecnicas posteriores para contrato de API, integracion Google y seguridad de API publica.

Esta decision no implementa endpoints, no modifica codigo, no crea migraciones, no toca Supabase remoto y no habilita produccion.

### Observaciones

La API sera requisito para conectar agendamiento publico con datos reales. Mientras esta decision no este implementada y validada, cualquier pagina publica debe operar sin escribir directamente en el sistema interno.

Informe relacionado: `docs/control/auditorias/API-001_DISENO_API_PUBLICA_GOOGLE_WORKSPACE.md`.

Contrato relacionado: `docs/control/auditorias/BE-026_CONTRATO_API_PUBLICA_AGENDAMIENTO.md`.

Seguridad relacionada: `docs/control/auditorias/SEC-009_SEGURIDAD_API_PUBLICA.md`.

Flujo relacionado: `docs/control/auditorias/DOC-004_FLUJO_PAGINA_PUBLICA_API_SISTEMA_INTERNO_GOOGLE.md`.

Consentimiento relacionado: `docs/control/auditorias/BE-020_CONSENTIMIENTO_TRATAMIENTO_DATOS.md`.

Auditoria relacionada: `docs/control/auditorias/SEC-005_AUDITORIA_CAMBIOS_SENSIBLES.md`.

Anulacion relacionada: `docs/control/auditorias/BE-021_POLITICA_ANULACION_ELIMINACION.md`.

## DEC-034 - Agenda operativa separada de consulta clinica confirmada

**Estado:** Arquitectura aprobada / DB validada localmente
**Origen:** BE-012 / BE-017 / API-001 / DEC-011 / DEC-033
**Fecha:** 2026-07-01

### Decision propuesta

Agenda debe separar tres conceptos:

- `solicitudes_agenda`: solicitud inicial de hora o contacto, publica o interna, con datos minimos y sin ficha clinica definitiva.
- `agenda_eventos`: evento operativo interno tipificado.
- `consultas`: registro clinico/operativo de una atencion, cita o contacto confirmado, asociado a un paciente real.

### Se aprueba como criterio arquitectonico

- La pagina publica futura debe crear solicitudes de agenda mediante API segura, no consultas.
- `agenda_eventos` debe tener `tipo_evento` obligatorio.
- `consultas` solo debe crearse o vincularse despues de revision interna, paciente validado y consentimiento suficiente.
- La agenda interna puede vincular eventos a paciente, consulta, evaluacion, caso, revision, trabajo o sesion cuando corresponda.
- `vista_agenda_operativa` debe usar `agenda_eventos` como fuente primaria y unir contexto clinico solo mediante relaciones existentes.

### Se descarta para v1

- Usar `consultas` como bandeja de solicitudes publicas.
- Crear pacientes automaticamente desde pagina publica.
- Crear evaluaciones, casos, elementos, revisiones, hallazgos o trabajos automaticamente desde Agenda.
- Sincronizar Google Calendar al recibir una solicitud no revisada.
- Integrar Google Calendar/Gmail desde frontend.

### Queda pendiente

- Definir UI de Agenda tipificada.
- Definir contrato real `BE-026`: documentado como contrato conceptual, pendiente implementacion futura.
- Definir consentimiento, auditoria, ambientes, seguridad API e integracion Google.

### Impacto

BE-012 y BE-017 quedan documentados como diseno arquitectonico. BE-028 aplica la primera implementacion DB versionada para Agenda Operativa y BE-029 valida su runtime local con roles, RLS, checks, FKs, triggers y vista operativa.

La implementacion DB no habilita API publica, Google Calendar/Gmail, uso con datos reales ni produccion mientras PROD-001 siga abierto.

### Observaciones

Informe relacionado: `docs/control/auditorias/BE-012_BE-017_DISENO_AGENDA_OPERATIVA.md`.

Implementacion relacionada: `docs/control/auditorias/BE-028_IMPLEMENTACION_MODELO_DB_AGENDA_OPERATIVA.md`.

Validacion relacionada: `docs/control/auditorias/BE-029_VALIDACION_RUNTIME_AGENDA_OPERATIVA.md`.

Contrato relacionado: `docs/control/auditorias/BE-026_CONTRATO_API_PUBLICA_AGENDAMIENTO.md`.

Seguridad relacionada: `docs/control/auditorias/SEC-009_SEGURIDAD_API_PUBLICA.md`.

Flujo relacionado: `docs/control/auditorias/DOC-004_FLUJO_PAGINA_PUBLICA_API_SISTEMA_INTERNO_GOOGLE.md`.

Consentimiento relacionado: `docs/control/auditorias/BE-020_CONSENTIMIENTO_TRATAMIENTO_DATOS.md`.

Auditoria relacionada: `docs/control/auditorias/SEC-005_AUDITORIA_CAMBIOS_SENSIBLES.md`.

Anulacion relacionada: `docs/control/auditorias/BE-021_POLITICA_ANULACION_ELIMINACION.md`.

## DEC-035 - Migracion progresiva a plataforma Google Cloud

**Estado:** Propuesta documental / pendiente validacion Javier
**Origen:** CTRL-009 / API-001 / DEC-033 / DEC-034 / PROD-001
**Fecha:** 2026-07-01

### Decision propuesta

El proyecto no migrara inmediatamente toda su base de datos, Auth ni backend hacia Google Cloud.

La estrategia sera progresiva:

- Supabase/PostgreSQL sigue como base actual.
- Supabase Auth y RLS siguen como control actual del sistema interno.
- Google Cloud se prepara como plataforma futura para API segura, integracion Google Workspace, despliegue, automatizacion y operacion por ambientes.
- Google Calendar y Gmail deben integrarse solo desde backend seguro futuro.
- La pagina publica no debe escribir directamente en tablas clinicas, financieras ni internas.

### Razon

El proyecto sigue en etapa local/demo y PROD-001 bloquea datos reales, fotos reales, pagos reales y produccion.

Migrar la base, Auth o backend antes de cerrar Agenda operativa, consentimiento, ambientes, auditoria sensible, seguridad API, backup/restauracion y checklist cloud agregaria complejidad prematura.

### Impacto

- `BE-030` debe disenar la arquitectura futura Google Cloud.
- `SEC-010` debe definir secretos, OAuth, IAM e identidades tecnicas.
- `DOC-005` debe documentar la ruta progresiva.
- `QA-007` debe funcionar como checklist previo a cualquier implementacion cloud.
- `BE-026`, `BE-027`, `SEC-009` y `DOC-004` siguen vigentes para API publica y Google Workspace.

### Restricciones

Esta decision no crea infraestructura ni credenciales, no modifica `.env`, no crea endpoints, no despliega, no migra Supabase, no migra Auth, no cambia RLS, no toca Supabase remoto y no habilita produccion.

### Observaciones

DEC-035 complementa DEC-033 y DEC-034. No las reemplaza: la API segura sigue siendo la frontera futura y Agenda sigue separada de consulta clinica confirmada.

Informe relacionado: `docs/control/auditorias/DEC-035_MIGRACION_PROGRESIVA_GOOGLE_CLOUD.md`.

## DEC-036 - State management centralizado con Context + useReducer

**Estado:** Aprobada / POC validado tecnica y visualmente, pendiente revision final de Javier
**Origen:** AUDIT-2026-07-04 / Javier
**Fecha:** 2026-07-04

### Decision propuesta

Centralizar el manejo de estado de autenticacion (y, a futuro, de formularios complejos como Agenda) usando Context API + useReducer en lugar de prop drilling manual a traves de 4+ niveles de componentes (`App` → `RutaProtegida` → `AppPrivada` → `DashboardShell` → paginas).

### Razon

El prop drilling actual obliga a tocar 4+ componentes cada vez que cambia la forma del estado de auth, dificulta testear y agrega boilerplate sin beneficio funcional.

### Impacto

- Se crea `src/context/AuthContext.tsx` + `src/context/authTypes.ts` con `AuthProvider`/`useAuth()`.
- `App.tsx`, `RutaProtegida`, `AppPrivada` y `DashboardShell` dejan de recibir `estadoAuth`/`usuarioInterno`/`onCerrarSesion` como props.
- No cambia la logica de autenticacion ni las consultas a `usuarios_internos`.
- `useFormularioAgenda` (useReducer para `AgendaPage`) queda para una fase posterior, no incluida en el POC actual.

### Restricciones

No modifica RLS, Auth de Supabase, `.env`, ni datos reales. No habilita produccion.

### Observaciones

Existe un POC funcional en la rama `poc/auth-context` que extrae fielmente la logica existente de `App.tsx` (verificado por comparacion linea por linea). Se corrigio un bug de compilacion (`usuarioInterno.nombre_completo` sin guard opcional) y se encapsulo el contexto: ya no expone `setEstadoAuth`/`setSession`/`setUsuarioInterno`/`setMensajeAuth` (nadie fuera de `AuthContext.tsx` los usaba), solo estado de lectura + `cerrarSesion`.

Validado con `npm run dev` y los usuarios demo SEC-007B: login, logout y sidebar filtrado correctos para `admin`, `terapeuta` y `finanzas`, sin errores de consola. Queda pendiente la revision final de Javier antes de cualquier PR a `main`.

## DEC-037 - Utilidades compartidas en `lib/`

**Estado:** Aprobada / implementacion en curso
**Origen:** AUDIT-2026-07-04 / Javier
**Fecha:** 2026-07-04

### Decision propuesta

Extraer a `src/lib/format.ts`, `src/lib/queries.ts` y `src/lib/constants.ts` las utilidades e identificadores duplicados en multiples paginas: `formatearFecha`, `normalizarTexto`, `textoCorto`, `aNumero`, `formatearMoneda`, `formatearHora`, los `*_SELECT` de columnas SQL y las constantes de roles/estados/validaciones.

### Razon

El mismo formateo de fecha vive en 6 archivos y `normalizarTexto` en 8; un cambio de comportamiento (por ejemplo, el manejo de fechas nulas o el ajuste de timezone) requiere editar cada copia por separado, con riesgo de que queden inconsistentes entre si.

### Impacto

- Los archivos deben extraerse fielmente desde las implementaciones reales ya probadas en produccion interna (por ejemplo, `FinanzasPage.tsx` para fecha/moneda/texto), no reescribirse desde cero.
- Los estados y columnas deben derivarse de las migraciones SQL reales, no inventarse.
- Debe compilar (`tsc -p tsconfig.app.json`) y pasar `npm run lint` sin errores.

### Restricciones

No modifica el comportamiento observable de ninguna pagina. No modifica migraciones ni RLS.

### Observaciones

Un primer intento en la rama `refactor/extract-utilities` genero los 3 archivos escritos desde cero en lugar de extraidos: no compilaban, no pasaban lint y usaban columnas/estados que no existen en el esquema real. Ese intento se descarta y se rehace por extraccion real. Ver [[refactor-extract-utilities-jul-2026]] en memoria de sesion para el detalle de los errores encontrados.

## DEC-038 - Migraciones SQL para cerrar brechas RLS

**Estado:** Aprobada / las 3 migraciones corregidas y validadas localmente, sin aplicar a ningun ambiente
**Origen:** AUDIT-2026-07-04 / Javier
**Fecha:** 2026-07-04

### Decision propuesta

Agregar 3 migraciones SQL para cerrar brechas de seguridad detectadas en el audit:

1. `vista_cobros_estado` pasa a ser accesible tambien para `finanzas` (antes solo `admin`).
2. Nueva vista `vista_finanzas_fotos_auditoria` para que Finanzas pueda auditar que fotos estan asociadas a un cobro, sin exponer descarga directa.
3. DELETE policies explicitas en tablas operativas (`pacientes`, `consultas`, etc.), restringidas a registros ya anulados logicamente y solo para el rol correspondiente.

### Razon

Sin estas policies, Finanzas dependia de queries directas menos seguras para el historial de cobros, no existia forma de auditar fotos asociadas a un cobro, y no habia proteccion contra un DELETE fisico que rompiera la politica de anulacion logica exigida por PROD-001.

### Impacto

- `supabase/migrations/20260704_000000_fix_vista_cobros_estado_finanzas.sql`
- `supabase/migrations/20260704_000001_crear_vista_fotos_auditoria_finanzas.sql`
- `supabase/migrations/20260704_000002_agregar_delete_policies_tablas_operativas.sql`

### Restricciones

No se ejecuta `supabase db push`. No se aplica a Supabase remoto. Debe validarse localmente con los usuarios demo de SEC-007B antes de cualquier PR.

### Observaciones

Las 3 migraciones quedaron escritas en un solo commit y en la rama equivocada (`refactor/extract-utilities`, que corresponde a DEC-037). Se reorganizaron en las ramas dedicadas `fix/rls-vista-cobros-finanzas`, `fix/rls-fotos-auditoria-finanzas` y `fix/rls-delete-policies` para PRs independientes, tal como establecia el roadmap original del audit.

Al separarlas se detecto que la reorganizacion no habia corregido el contenido de 2 de las 3: `vista_cobros_estado` y `vista_finanzas_fotos_auditoria` seguian identicas al commit original, con PK generica `id` inventada (real: `id_cobro`/`id_pago`/`id_foto_elemento_caso`) y columnas inexistentes (`monto_pagado` en vez de `monto_pago`, `fecha_carga` en vez de `created_at`). Se corrigieron ambas contra el esquema real y las 3 se validaron con `supabase db reset` local (ver LOG-078 en `06_BITACORA_CAMBIOS.md`). Falta la validacion funcional con usuarios demo SEC-007B (login como finanzas) antes de PR.

## DEC-039 - Testing minimo requerido (E2E + unit)

**Estado:** Aprobada / pendiente implementacion
**Origen:** AUDIT-2026-07-04 / Javier
**Fecha:** 2026-07-04

### Decision propuesta

Incorporar testing automatizado minimo: Vitest para unit tests (empezando por `lib/format.ts` y `lib/queries.ts`), Playwright para E2E criticos (login/logout, crear caso, crear evento de agenda) y un workflow de GitHub Actions que corra lint/build/test en cada PR.

### Razon

Sin tests automatizados, cada refactor (incluyendo DEC-036 y DEC-037) depende solo de revision manual para detectar regresiones.

### Impacto

- Nuevo `.github/workflows/test.yml`.
- Tests unitarios sobre las utilidades de DEC-037 una vez esten correctamente extraidas.
- Tests E2E sobre los flujos criticos existentes, sin modificar su comportamiento.

### Restricciones

No modifica datos reales ni Supabase remoto. No habilita produccion.

### Observaciones

Esta decision queda como Bloque 4 del roadmap, independiente de los Bloques 1-3 y ejecutable en paralelo. Sin trabajo iniciado a la fecha de este registro.

## DEC-040 - Reservada

**Estado:** Sin definir

Codigo reservado por el audit AUDIT-2026-07-04 sin una decision asociada. No usar hasta que se defina un contenido concreto.
