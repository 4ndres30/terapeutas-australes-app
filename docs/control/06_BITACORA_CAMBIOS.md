# Bitacora de cambios

Responsable del documento: Control de desarrollo
Fecha creacion: `2026-06-11`

Esta bitacora registra cambios relevantes del control del proyecto. Debe ser breve y verificable.

## Como registrar

Cada entrada debe indicar:

- Codigo `LOG-###`.
- Fecha.
- Rama.
- Responsable.
- Resumen.
- Archivos tocados.
- Restricciones respetadas.
- Resultado.

## LOG-001 - Creacion de estructura documental de control

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Javier
**Fecha creacion:** 2026-06-11
**Rama sugerida:** `docs/control-proyecto`
**Dependencias:** Ninguna

### Descripcion
Se crea la carpeta `docs/control/` con documentos de estado, pendientes, revision clinica, backend, UI/UX, decisiones y bitacora.

### Archivos relacionados
- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.

### Resultado
Estructura documental inicial integrada.

### Observaciones
Base del sistema de control documental del proyecto.

## LOG-002 - Integracion de QA-001

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** QA-001
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `docs/control-proyecto`
**Dependencias:** LOG-001

### Descripcion
Se registra la auditoria inicial QA-001 del proyecto.

### Archivos relacionados
- `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase remoto.

### Resultado
QA-001 integrada como auditoria inicial. El build registrado en QA-001 paso correctamente.

### Observaciones
QA-001 queda reservada como validacion inicial y no debe reutilizarse como codigo de tarea.

## LOG-003 - Integracion de BE-001

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-001
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `docs/be-001-inventario-backend`
**Dependencias:** QA-001

### Descripcion
Se documenta el inventario backend y Supabase local.

### Archivos relacionados
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.

### Resultado
BE-001 integrada como inventario tecnico base.

### Observaciones
Detecto tablas, vistas, triggers, RLS, formularios y brechas funcionales pendientes.

## LOG-004 - Integracion de RFC-001

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Revision de flujo clinico
**Origen:** RFC-001
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `docs/rfc-001-revision-flujo-clinico`
**Dependencias:** QA-001, BE-001, DEC-006

### Descripcion
Se documenta la revision del flujo clinico completo.

### Archivos relacionados
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se hizo merge sin aprobacion de Javier.

### Resultado
RFC-001 integrada como aprobada con observaciones.

### Observaciones
Valida el flujo `Paciente -> Caso -> Revision -> Detalle -> Hallazgo -> Trabajo` y confirma que el caso conecta el proceso.

## LOG-005 - Registro de DEC-007 a DEC-012

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** RFC-001 / BE-001
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `docs/decisiones-rfc-001`
**Dependencias:** RFC-001, BE-001

### Descripcion
Se registran decisiones clinicas y operativas derivadas de BE-001 y RFC-001.

### Archivos relacionados
- `docs/control/05_DECISIONES_PROYECTO.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se toco Supabase remoto.

### Resultado
DEC-007 a DEC-012 integradas.

### Observaciones
Estas decisiones fijan responsabilidad de hallazgos, criterio hallazgo a trabajo, separacion trabajo/sesion/accion, agenda tipificada y cobros por unidad cobrable.

## LOG-006 - Integracion de BE-002

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `docs/be-002-alineacion-backend-flujo-clinico`
**Dependencias:** BE-001, RFC-001, DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012

### Descripcion
Se documenta la alineacion backend con el flujo clinico aprobado.

### Archivos relacionados
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.

### Resultado
BE-002 integrada como aprobada con observaciones.

### Observaciones
BE-002 habilita planificar BE-010 a BE-017 antes de implementar cambios tecnicos.

## LOG-007 - Sincronizacion de documentos maestros tras BE-002

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `docs/control-sync-be002`
**Dependencias:** QA-001, BE-001, RFC-001, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012, BE-002

### Descripcion
Se sincronizan documentos maestros para reflejar el estado real del proyecto luego de integrar BE-002.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.

### Resultado
Documentacion maestra sincronizada para revision de Control de desarrollo.

### Observaciones
Luego de esta sincronizacion se debe priorizar el siguiente bloque: BE-010, UI-001/UI-002 o BE-003.

## LOG-008 - Integracion de UI-001 + UI-002

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002
**Fecha creacion:** 2026-06-13
**Rama sugerida:** `docs/auditoria-ui-ux`
**Dependencias:** QA-001, RFC-001, BE-001, BE-002

### Descripcion
Se integra la auditoria visual y revision de formularios del flujo clinico.

### Archivos relacionados
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.
- No se modificaron datos reales.

### Resultado
UI-001 y UI-002 quedan integradas como auditoria aprobada con observaciones.

### Observaciones
La auditoria deriva UI-010 a UI-019 como tareas de planificacion visual y operativa.

## LOG-009 - Integracion de BE-003

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-003
**Fecha creacion:** 2026-06-13
**Rama sugerida:** `docs/be-003-criterios-migraciones`
**Dependencias:** BE-001, BE-002

### Descripcion
Se integran los criterios para futuras migraciones de Supabase/PostgreSQL.

### Archivos relacionados
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.
- No se modificaron datos reales.

### Resultado
BE-003 queda integrada como pauta tecnica documental para futuras migraciones.

### Observaciones
BE-018 a BE-021 quedan solo como tareas sugeridas posteriores, no activas.

## LOG-010 - Sincronizacion documental CTRL-003

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** CTRL-003
**Fecha creacion:** 2026-06-13
**Rama sugerida:** `docs/ctrl-003-sincronizacion-final`
**Dependencias:** UI-001, UI-002, BE-003

### Descripcion
Se sincronizan documentos maestros posterior a la integracion de UI-001/UI-002 y BE-003.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.
- No se modificaron datos reales.
- No se hizo merge a `main`.

### Resultado
Documentacion maestra sincronizada para revision de Control de desarrollo.

### Observaciones
El siguiente bloque recomendado queda como BE-010 coordinado con UI-011, manteniendo BE-010, UI-010, UI-011, UI-012 y UI-015 como prioridades de planificacion.

## LOG-011 - Sincronizacion post IMP-001, DATA-001 y BE-011

**Estado:** En proceso
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** CTRL-004
**Fecha creacion:** 2026-06-17
**Rama sugerida:** `docs/ctrl-004-sync-post-imp-data-be011`
**Dependencias:** IMP-001, DATA-001, BE-011

### Descripcion
Se sincroniza la documentacion de control despues de integrar hallazgos operativos, seed local demo integral y trazabilidad documental hallazgo a trabajo.

### Cambios registrados
- PR #16: IMP-001 integrado. Hallazgos operativos quedaron disponibles en `DetalleRevisionesPanel`.
- PR #17: DATA-001 integrado. Seed local de caso demo integral incorporado.
- PR #18: BE-011 integrado documentalmente. Trazabilidad hallazgo a trabajo definida sin migracion inicial.
- El seed local `supabase/dev-seeds/caso_demo_integral.sql` fue ejecutado correctamente por el usuario en Supabase local.
- El caso demo `DATA-001 - Caso Demo Integral` se visualiza en la app.
- El hallazgo precargado se visualiza correctamente.
- El modal `Ver hallazgo` funciona.
- El modal `Crear hallazgo desde aspecto revisado` abre correctamente y hereda revision, elemento, area y aspecto.
- QA-002 queda pendiente para validar guardado real de un hallazgo nuevo desde la UI.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/auditorias/CTRL-004_SINCRONIZACION_POST_IMP_DATA_BE011.md`

### Restricciones respetadas
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se crearon migraciones.
- No se toco `.env`.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.
- No se modificaron datos reales.
- No se hizo merge a `main`.

### Resultado
Documentacion de control sincronizada para revision mediante PR draft.

### Observaciones
El pendiente inmediato es QA-002. UI-012 queda como siguiente tarea UI posterior. La implementacion funcional hallazgo a trabajo queda como pendiente futuro.

## LOG-012 - Integración de QA-002

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** QA-002
**Fecha creación:** 2026-06-17
**Rama sugerida:** `docs/qa-002-validacion-hallazgos-operativos`
**Dependencias:** IMP-001, DATA-001, BE-011

### Descripción
Se registra la validación funcional local del flujo de hallazgos operativos con el caso demo DATA-001.

### Archivos relacionados
- `docs/control/auditorias/QA-002_VALIDACION_HALLAZGOS_OPERATIVOS.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`

### Restricciones respetadas
- No se modificó código fuente.
- No se modificaron migraciones.
- No se tocó `.env`.
- No se ejecutó `supabase db push`.
- No se tocó Supabase remoto.
- No se modificaron datos reales.

### Resultado
QA-002 queda integrada y aprobada funcionalmente.

### Observaciones
El flujo validó creación manual de hallazgo, persistencia tras recarga, prevención visual de duplicado y botón `Evaluar trabajo próximamente` deshabilitado.

## LOG-013 - Integración de UI-012

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-012
**Fecha creación:** 2026-06-17
**Rama sugerida:** `docs/ui-012-evaluar-trabajo`
**Dependencias:** QA-002, BE-011, DEC-009, DEC-013, DEC-014, DEC-015

### Descripción
Se integra el diseño UI/UX del flujo `Evaluar trabajo` desde hallazgo operativo.

### Archivos relacionados
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/auditorias/UI-012_FLUJO_EVALUAR_TRABAJO.md`

### Restricciones respetadas
- No se modificó código fuente.
- No se modificó CSS.
- No se modificaron migraciones.
- No se tocó `.env`.
- No se ejecutó Supabase.
- No se ejecutó `supabase db push`.
- No se tocó Supabase remoto.
- No se modificaron datos reales.

### Resultado
UI-012 queda integrada como diseño aprobado con observaciones.

### Observaciones
El siguiente paso recomendado es IMP-002: implementación funcional controlada de `Evaluar trabajo`, sin crear cobros, sesiones ni acciones automáticamente.

## LOG-014 - Integración diseño UI-010

**Estado:** Integrada documentalmente
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-010
**Fecha creación:** 2026-06-18
**Rama sugerida:** `docs/ui-010-diseno-resumen-detalle-caso`
**Dependencias:** UI-001, UI-002, RFC-001

### Descripción
Se integra el diseño detallado UI-010 para rediseñar el detalle de caso como vista resumen navegable.

### Archivos relacionados
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/auditorias/UI-010_DISENO_RESUMEN_DETALLE_CASO.md`

### Resultado
La recomendación principal queda como vista resumen general por secciones. La vista por elemento queda como modo secundario o fase posterior.

### Observaciones
Revisión de flujo clínico debe validar alertas obligatorias, datos críticos que no pueden quedar ocultos y tratamiento de trabajos transversales antes de implementar.

## LOG-015 - Registro PROD-001

**Estado:** Registrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Integración Backend
**Origen:** Control de desarrollo
**Fecha creación:** 2026-06-18
**Rama sugerida:** `docs/ui-010-diseno-resumen-detalle-caso`
**Dependencias:** RLS, roles, backups, consentimiento, Supabase producción

### Descripción
Se agrega tarea de preparación para uso real con datos sensibles.

### Archivos relacionados
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/auditorias/PROD-001_PREPARACION_USO_REAL_DATOS_SENSIBLES.md`

### Resultado
No se autoriza carga real oficial de pacientes hasta revisar RLS, roles, backups, consentimiento y separación de ambientes.

### Observaciones
PROD-001 debe cerrarse antes de usar la aplicación como sistema oficial con datos reales.
