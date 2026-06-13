# Pendientes del proyecto

Fecha de apertura: `2026-06-11`  
Ultima actualizacion: `2026-06-13`  
Responsable del documento: Control de desarrollo

Este documento es la lista maestra de pendientes. Cada pendiente debe tener un codigo, un responsable y un estado permitido. Los detalles tecnicos o clinicos pueden vivir en los documentos especializados, pero este archivo debe permitir ver rapidamente que falta.

## Reglas de uso

- No registrar ideas vagas sin siguiente accion.
- No mezclar decisiones con pendientes; las decisiones van en `05_DECISIONES_PROYECTO.md`.
- No marcar como `Validada` una tarea que Javier no haya validado o que no tenga criterio de validacion cumplido.
- Si una tarea cambia de responsable, actualizar tambien el documento especializado correspondiente.
- No reutilizar codigos ya usados.

## Vista rapida

| Codigo | Tarea | Estado | Prioridad | Responsable |
| --- | --- | --- | --- | --- |
| CTRL-001 | Mantener centro de mando documental. | En proceso | Alta | Control de desarrollo |
| CTRL-002 | Sincronizar documentacion maestra tras BE-002. | Integrada | Alta | Control de desarrollo |
| CTRL-003 | Sincronizar documentacion maestra tras UI-001/UI-002 y BE-003. | Integrada | Alta | Control de desarrollo |
| PEND-001 | Levantar inventario real del proyecto desde `main`. | Integrada | Alta | Control de desarrollo |
| PEND-002 | Clasificar pendientes por chat responsable. | Integrada | Alta | Control de desarrollo |
| QA-001 | Auditoria inicial del proyecto. | Integrada | Alta | Control de desarrollo |
| BE-001 | Inventariar estructura backend y Supabase local. | Integrada | Alta | Integracion Backend/Estructura |
| RFC-001 | Auditar flujo clinico completo. | Integrada | Alta | Revision de flujo clinico |
| BE-002 | Comparar backend con flujo clinico aprobado. | Integrada | Alta | Integracion Backend/Estructura |
| BE-003 | Preparar criterios para futuras migraciones. | Integrada | Media | Integracion Backend/Estructura |
| RFC-002 | Detectar duplicidades entre entidades clinicas. | Pendiente | Alta | Revision de flujo clinico |
| UI-001 | Auditar pantallas principales y pulido visual. | Integrada | Media | UI / UX / Pulido visual |
| UI-002 | Revisar formularios del flujo clinico. | Integrada | Alta | UI / UX / Pulido visual |
| BE-010 | Ajustar soporte operativo de hallazgos derivados de aspectos. | Pendiente | Alta | Integracion Backend/Estructura |
| UI-010 | Redisenar navegacion del detalle de caso. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-011 | Disenar panel operativo de hallazgos dentro del detalle de revision. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-012 | Disenar flujo visual hallazgo a trabajo. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-013 | Disenar experiencia de trabajos, sesiones y acciones. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-014 | Disenar agenda tipificada. | Pendiente | Media-alta | UI / UX / Pulido visual |
| UI-015 | Mejorar experiencia de finanzas por unidad cobrable. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-016 | Mejorar reportes por rol. | Pendiente | Media-alta | UI / UX / Pulido visual |
| UI-017 | Definir checklist responsive de pantallas clinicas. | Pendiente | Media | UI / UX / Pulido visual |
| UI-018 | Normalizar microcopy clinica y retirar textos tecnicos visibles. | Pendiente | Media | UI / UX / Pulido visual |
| UI-019 | Definir patron comun de formularios clinicos largos. | Pendiente | Media-alta | UI / UX / Pulido visual |
| BE-011 | Disenar trazabilidad hallazgo a trabajo. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-012 | Disenar backend de Agenda tipificada. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-013 | Ajustar reglas de cobros por unidad cobrable. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-014 | Crear vistas clinicas agregadas. | Pendiente | Media-alta | Integracion Backend/Estructura |
| BE-015 | Validar RLS por roles para modulos nuevos. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-016 | Disenar vista financiera por unidad cobrable. | Pendiente | Media | Integracion Backend/Estructura |
| BE-017 | Definir estrategia SQL de agenda operativa. | Pendiente | Media | Integracion Backend/Estructura |

## Pendientes integrados

### PEND-001 - Levantar inventario real del proyecto desde main

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/inventario-proyecto`  
**Dependencias:** Ninguna  

#### Resultado
Integrada mediante QA-001 y BE-001. El inventario tecnico inicial quedo registrado en `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md` y `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`.

### PEND-002 - Clasificar pendientes por chat responsable

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/clasificacion-pendientes`  
**Dependencias:** PEND-001  

#### Resultado
Integrada. Las tareas quedaron separadas entre Control de desarrollo, Revision de flujo clinico, Integracion Backend/Estructura y UI / UX / Pulido visual.

### QA-001 - Auditoria inicial del proyecto

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/auditoria-control-proyecto`  
**Dependencias:** CTRL-001  

#### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`.

### BE-001 - Inventariar estructura backend y Supabase local

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/be-001-inventario-backend`  
**Dependencias:** PEND-001  

#### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`.

### RFC-001 - Auditar flujo clinico completo

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/rfc-001-revision-flujo-clinico`  
**Dependencias:** PEND-001, QA-001, BE-001, DEC-006  

#### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md`.

### BE-002 - Comparar backend con flujo clinico aprobado

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/be-002-alineacion-backend-flujo-clinico`  
**Dependencias:** RFC-001, BE-001, DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012  

#### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`.

### BE-003 - Preparar criterios para futuras migraciones

**Estado:** Integrada  
**Prioridad:** Media  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/be-003-criterios-migraciones`  
**Dependencias:** BE-001, BE-002  

#### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`.

### UI-001 - Auditar pantallas principales y pulido visual

**Estado:** Integrada  
**Prioridad:** Media  
**Responsable:** UI / UX / Pulido visual  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/auditoria-ui-ux`  
**Dependencias:** QA-001, RFC-001, BE-001  

#### Resultado
Integrada. Resultado consolidado en `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`.

### UI-002 - Revisar formularios del flujo clinico

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/revision-formularios-clinicos`  
**Dependencias:** RFC-001, BE-002, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012  

#### Resultado
Integrada. Resultado consolidado en `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`.

## Pendientes activos

La siguiente prioridad tecnica recomendada es BE-010, coordinada con UI-011 para disenar y soportar hallazgos dentro del detalle de revision.

### RFC-002 - Detectar duplicidades entre entidades clinicas

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Origen:** Revision de flujo clinico  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/duplicidades-flujo-clinico`  
**Dependencias:** RFC-001, BE-002  

#### Descripcion
Revisar si existen campos repetidos o responsabilidades solapadas entre consultas, evaluaciones, casos, revisiones, detalle de revision, hallazgos y trabajos.

#### Criterios de aceptacion
- Clasificar cada duplicidad como clinica, tecnica o visual.
- Proponer ubicacion correcta del dato.
- No ordenar cambios de base de datos sin decision registrada.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main` sin aprobacion.

### BE-010 - Ajustar soporte operativo de hallazgos derivados de aspectos

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `feature/be-010-hallazgos-operativos`  
**Dependencias:** DEC-007, DEC-008, BE-002  

#### Descripcion
Definir soporte tecnico minimo para crear, listar y consultar hallazgos desde el detalle de revision, respetando que `revision_hallazgos` nace desde `revision_aspectos`.

#### Criterios de aceptacion
- Mantener hallazgos dentro del detalle de revision.
- No crear modulo principal independiente para crear hallazgos.
- Mantener trazabilidad hacia caso, revision, elemento y aspecto.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### UI-010 - Redisenar navegacion del detalle de caso

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-010-navegacion-detalle-caso`  
**Dependencias:** UI-001, UI-002, RFC-001  

#### Descripcion
Convertir la ficha de caso en una experiencia operativa clara, con navegacion interna mas usable para elementos, revisiones, detalle, trabajos y pagos.

#### Criterios de aceptacion
- Proponer estructura de navegacion interna para detalle de caso.
- Mantener el caso como contenedor central del flujo clinico.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-011 - Disenar panel operativo de hallazgos dentro del detalle de revision

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-011-panel-hallazgos-revision`  
**Dependencias:** UI-001, UI-002, BE-010, DEC-007, DEC-008  

#### Descripcion
Disenar el panel operativo para registrar hallazgos relevantes desde aspectos revisados dentro del detalle de revision, sin crear un modulo principal independiente.

#### Criterios de aceptacion
- Coordinar el diseno con BE-010 como siguiente prioridad tecnica recomendada.
- Mantener hallazgos dentro del detalle de revision.
- Evitar duplicar responsabilidades entre revision, aspecto y hallazgo.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-012 - Disenar flujo visual hallazgo a trabajo

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-012-flujo-hallazgo-trabajo`  
**Dependencias:** UI-011, BE-010, BE-011, DEC-009  

#### Descripcion
Disenar la decision contextual para convertir un hallazgo en trabajo solo cuando corresponda.

#### Criterios de aceptacion
- Proponer flujo visual desde hallazgo hacia trabajo.
- Diferenciar hallazgo observado de trabajo abierto.
- No cambiar reglas clinicas sin decision registrada.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-013 - Disenar experiencia de trabajos, sesiones y acciones

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-013-trabajos-sesiones-acciones`  
**Dependencias:** UI-012, BE-011, DEC-010  

#### Descripcion
Disenar una experiencia guiada para trabajo, sesion y accion, respetando la diferencia entre plan, instancia y accion concreta.

#### Criterios de aceptacion
- Separar visualmente trabajo, sesion y accion.
- Mantener trazabilidad hacia caso, revision y hallazgo cuando corresponda.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-014 - Disenar agenda tipificada

**Estado:** Pendiente  
**Prioridad:** Media-alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-014-agenda-tipificada`  
**Dependencias:** BE-012, DEC-011  

#### Descripcion
Proponer experiencia visual para eventos tipificados de agenda: consulta, evaluacion, revision, sesion de trabajo, seguimiento y recordatorio interno.

#### Criterios de aceptacion
- Esperar definicion backend de agenda antes de pantalla operativa.
- Separar eventos manuales de eventos derivados.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-015 - Mejorar experiencia de finanzas por unidad cobrable

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-015-finanzas-unidad-cobrable`  
**Dependencias:** BE-013, BE-016, DEC-012  

#### Descripcion
Disenar cobros y pagos con unidad cobrable clara, saldo visible y origen entendible para consulta, evaluacion, revision, trabajo o paquete de caso.

#### Criterios de aceptacion
- Mantener visible la unidad cobrable de cada cobro.
- Evitar duplicidad visual entre cobros y pagos.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-016 - Mejorar reportes por rol

**Estado:** Pendiente  
**Prioridad:** Media-alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-016-reportes-por-rol`  
**Dependencias:** BE-014, BE-016, BE-017  

#### Descripcion
Separar reportes para terapeuta, finanzas y admin segun necesidades operativas y permisos esperados.

#### Criterios de aceptacion
- Proponer vistas de reporte por rol.
- Evitar mostrar informacion tecnica o sensible fuera de contexto.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-017 - Definir checklist responsive de pantallas clinicas

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-017-checklist-responsive-clinico`  
**Dependencias:** UI-001, UI-002  

#### Descripcion
Crear pauta desktop, tablet y mobile para validar pantallas clinicas antes de pulido final.

#### Criterios de aceptacion
- Incluir checklist responsive por tipo de pantalla clinica.
- Cubrir estados vacios, carga, error y acciones principales.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-018 - Normalizar microcopy clinica y retirar textos tecnicos visibles

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-018-microcopy-clinica`  
**Dependencias:** UI-001, UI-002  

#### Descripcion
Reemplazar referencias tecnicas visibles por lenguaje clinico y operativo util para uso interno real.

#### Criterios de aceptacion
- Identificar textos tecnicos visibles en pantallas clinicas.
- Proponer microcopy clinica breve y consistente.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### UI-019 - Definir patron comun de formularios clinicos largos

**Estado:** Pendiente  
**Prioridad:** Media-alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** UI-001 + UI-002  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ui-019-patron-formularios-clinicos`  
**Dependencias:** UI-002  

#### Descripcion
Estandarizar formularios clinicos extensos con secciones reutilizables, jerarquia clara y menor carga cognitiva.

#### Criterios de aceptacion
- Proponer patron comun para formularios clinicos largos.
- Separar datos clinicos, administrativos, financieros y notas internas.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### BE-011 - Disenar trazabilidad hallazgo a trabajo

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/be-011-trazabilidad-hallazgo-trabajo`  
**Dependencias:** DEC-009, BE-002  

#### Descripcion
Decidir si basta `trabajo_elementos.revision_hallazgo_id` o si se requiere tabla puente `trabajo_hallazgos` para multiples hallazgos origen.

#### Criterios de aceptacion
- No implementar tabla nueva sin decision de Control de desarrollo.
- Separar hallazgo origen principal de hallazgos asociados por elemento.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### BE-012 - Disenar backend de Agenda tipificada

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/be-012-agenda-tipificada`  
**Dependencias:** DEC-011, BE-002  

#### Descripcion
Disenar propuesta tecnica para `agenda_eventos` con `tipo_evento` obligatorio y relaciones opcionales a paciente, consulta, evaluacion, caso, revision, trabajo y sesion.

#### Criterios de aceptacion
- No implementar migracion todavia.
- Proponer tabla, campos, relaciones y vistas derivadas.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### BE-013 - Ajustar reglas de cobros por unidad cobrable

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/be-013-unidad-cobrable`  
**Dependencias:** DEC-012, BE-002  

#### Descripcion
Definir regla SQL, regla de aplicacion o ambas para evitar cobros duplicados por una misma prestacion.

#### Criterios de aceptacion
- Separar cobro por consulta, evaluacion, revision, trabajo o paquete de caso.
- Definir validaciones sin romper la flexibilidad financiera.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### BE-014 - Crear vistas clinicas agregadas

**Estado:** Pendiente  
**Prioridad:** Media-alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/be-014-vistas-clinicas-agregadas`  
**Dependencias:** BE-010, BE-011, BE-002  

#### Descripcion
Evaluar vistas como `vista_caso_clinico_completo`, `vista_revisiones_con_hallazgos` y `vista_trabajos_con_origen`.

#### Criterios de aceptacion
- Proponer vistas antes de implementar SQL.
- Revisar impacto RLS.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### BE-015 - Validar RLS por roles para modulos nuevos

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/be-015-validacion-rls-roles`  
**Dependencias:** BE-010, BE-011, BE-012, BE-013, BE-014  

#### Descripcion
Validar runtime local para perfiles `admin`, `terapeuta` y `finanzas`, especialmente en hallazgos, trabajos, agenda, cobros/pagos y reportes.

#### Criterios de aceptacion
- Definir matriz de permisos esperada.
- Validar lectura/escritura por rol en entorno local.
- No tocar Supabase remoto.
- No hacer `supabase db push`.
- No tocar `.env`.

### BE-016 - Disenar vista financiera por unidad cobrable

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/be-016-vista-financiera-unidad-cobrable`  
**Dependencias:** BE-013  

#### Descripcion
Disenar `vista_finanzas_por_unidad_cobrable` para reportar claramente si el cobro corresponde a consulta, evaluacion, revision, trabajo o paquete de caso.

#### Criterios de aceptacion
- No reemplazar `vista_cobros_estado` sin analisis.
- Mantener pagos aplicados a cobros.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### BE-017 - Definir estrategia SQL de agenda operativa

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** Integracion Backend/Estructura  
**Origen:** BE-002  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/be-017-estrategia-agenda-operativa`  
**Dependencias:** BE-012  

#### Descripcion
Definir si `vista_agenda_operativa` combinara `agenda_eventos`, consultas, evaluaciones, revisiones y sesiones de trabajo.

#### Criterios de aceptacion
- Mantener `tipo_evento` obligatorio.
- Separar eventos manuales de eventos derivados.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

## Tareas sugeridas no activas

Las siguientes tareas provienen de BE-003 y quedan solo como sugeridas. No se registran como pendientes activos ni deben ejecutarse sin activacion expresa de Control de desarrollo.

- BE-018 - Crear plantilla de PR para migraciones.
- BE-019 - Crear matriz de validacion local para migraciones.
- BE-020 - Crear pauta de rollback conceptual.
- BE-021 - Crear checklist RLS para tablas nuevas.
