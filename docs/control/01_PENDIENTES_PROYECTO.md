# Pendientes del proyecto

Fecha de apertura: `2026-06-11`  
Ultima actualizacion: `2026-06-12`  
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
| PEND-001 | Levantar inventario real del proyecto desde `main`. | Integrada | Alta | Control de desarrollo |
| PEND-002 | Clasificar pendientes por chat responsable. | Integrada | Alta | Control de desarrollo |
| QA-001 | Auditoria inicial del proyecto. | Integrada | Alta | Control de desarrollo |
| BE-001 | Inventariar estructura backend y Supabase local. | Integrada | Alta | Integracion Backend/Estructura |
| RFC-001 | Auditar flujo clinico completo. | Integrada | Alta | Revision de flujo clinico |
| BE-002 | Comparar backend con flujo clinico aprobado. | Integrada | Alta | Integracion Backend/Estructura |
| BE-003 | Preparar criterios para futuras migraciones. | Pendiente | Media | Integracion Backend/Estructura |
| RFC-002 | Detectar duplicidades entre entidades clinicas. | Pendiente | Alta | Revision de flujo clinico |
| UI-001 | Auditar pantallas principales y pulido visual. | Pendiente | Media | UI / UX / Pulido visual |
| UI-002 | Revisar formularios del flujo clinico. | Pendiente | Alta | UI / UX / Pulido visual |
| BE-010 | Ajustar soporte operativo de hallazgos derivados de aspectos. | Pendiente | Alta | Integracion Backend/Estructura |
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

## Pendientes activos

### BE-003 - Preparar criterios para futuras migraciones

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/criterios-migraciones`  
**Dependencias:** BE-001, BE-002  

#### Descripcion
Definir criterios minimos para crear, revisar y validar futuras migraciones sin afectar Supabase remoto ni `main`.

#### Criterios de aceptacion
- Definir checklist previo a migracion.
- Definir checklist posterior a migracion local.
- Reforzar que `supabase db push` esta prohibido salvo instruccion expresa futura.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main` sin aprobacion.

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

### UI-001 - Auditar pantallas principales y pulido visual

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** UI / UX / Pulido visual  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/auditoria-ui-ux`  
**Dependencias:** QA-001, RFC-001, BE-001  

#### Descripcion
Revisar pantallas principales de la aplicacion para detectar problemas de jerarquia, consistencia, responsive, formularios y experiencia de uso.

#### Criterios de aceptacion
- Listar pantallas revisadas.
- Clasificar hallazgos en criticos, importantes y posteriores.
- Separar problemas visuales de problemas de logica o datos.
- No modificar base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main` sin aprobacion.

### UI-002 - Revisar formularios del flujo clinico

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/revision-formularios-clinicos`  
**Dependencias:** RFC-001, BE-002, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012  

#### Descripcion
Revisar si los formularios respetan el flujo clinico y si los campos aparecen en el momento correcto, con etiquetas comprensibles y estados de validacion claros.

#### Criterios de aceptacion
- Identificar formularios revisados.
- Detectar campos confusos, duplicados o mal ubicados visualmente.
- No cambiar reglas clinicas por criterio visual.
- No modificar base de datos.
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
