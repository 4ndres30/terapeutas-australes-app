# Pendientes del proyecto

Fecha de apertura: `2026-06-11`
Ultima actualizacion: `2026-07-01`
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
| CTRL-004 | Sincronizar control post IMP-001, DATA-001 y BE-011. | Integrada | Alta | Control de desarrollo |
| CTRL-007 | Sincronizar documentacion maestra post BE-016, QA-004 y UI-016. | Integrada | Alta | Control de desarrollo |
| CTRL-008 | Registrar decisiones criticas post auditoria. | Integrada | Alta | Control de desarrollo |
| CTRL-009 | Sincronizacion documental Google Cloud. | Integrada documentalmente / pendiente revision | Alta | Control de desarrollo |
| PEND-001 | Levantar inventario real del proyecto desde `main`. | Integrada | Alta | Control de desarrollo |
| PEND-002 | Clasificar pendientes por chat responsable. | Integrada | Alta | Control de desarrollo |
| QA-001 | Auditoria inicial del proyecto. | Integrada | Alta | Control de desarrollo |
| QA-002 | Validacion funcional de hallazgos operativos con caso demo. | Integrada | Alta | Control de desarrollo |
| QA-004 | Validacion funcional local de BE-016 / Finanzas. | Integrada | Alta | Control de desarrollo |
| QA-005 | Validacion funcional local UI-016 / Reportes por rol. | Integrada | Alta | Control de desarrollo |
| QA-006 | Base minima de pruebas por rol y no exposicion sensible. | Pendiente | Alta | Control de desarrollo / QA |
| QA-007 | Checklist pre-migracion cloud. | Checklist documental / pendiente ejecucion futura | Alta | Control de desarrollo / QA |
| API-001 | Disenar API publica segura e integracion Google Workspace. | Diseno documental / pendiente implementacion | Alta | Control de desarrollo / Integracion Backend |
| DEC-035 | Migracion progresiva a plataforma Google Cloud. | Propuesta documental / pendiente validacion Javier | Alta | Control de desarrollo |
| BE-001 | Inventariar estructura backend y Supabase local. | Integrada | Alta | Integracion Backend/Estructura |
| RFC-001 | Auditar flujo clinico completo. | Integrada | Alta | Revision de flujo clinico |
| BE-002 | Comparar backend con flujo clinico aprobado. | Integrada | Alta | Integracion Backend/Estructura |
| BE-003 | Preparar criterios para futuras migraciones. | Integrada | Media | Integracion Backend/Estructura |
| RFC-002 | Detectar duplicidades entre entidades clinicas. | Pendiente | Alta | Revision de flujo clinico |
| UI-001 | Auditar pantallas principales y pulido visual. | Integrada | Media | UI / UX / Pulido visual |
| UI-002 | Revisar formularios del flujo clinico. | Integrada | Alta | UI / UX / Pulido visual |
| BE-010 | Ajustar soporte operativo de hallazgos derivados de aspectos. | Integrada | Alta | Integracion Backend/Estructura |
| IMP-001 | Implementar hallazgos operativos en `DetalleRevisionesPanel`. | Integrada | Alta | Implementacion |
| DATA-001 | Agregar seed local de caso demo integral. | Integrada | Alta | Control de desarrollo |
| UI-010 | Redisenar navegacion del detalle de caso. | Aprobada obs. / pend. implementacion | Alta | UI / UX / Pulido visual |
| UI-011 | Disenar panel operativo de hallazgos dentro del detalle de revision. | Integrada | Alta | UI / UX / Pulido visual |
| UI-012 | Disenar flujo visual Evaluar trabajo. | Integrada | Alta | UI / UX / Pulido visual |
| UI-013 | Disenar experiencia de trabajos, sesiones y acciones. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-014 | Disenar agenda tipificada. | Pendiente | Media-alta | UI / UX / Pulido visual |
| UI-015 | Mejorar experiencia de finanzas por unidad cobrable. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-016 | Mejorar reportes por rol. | Integrada | Media-alta | UI / UX / Pulido visual |
| UI-017 | Definir checklist responsive de pantallas clinicas. | Pendiente | Media | UI / UX / Pulido visual |
| UI-018 | Normalizar microcopy clinica y retirar textos tecnicos visibles. | Pendiente | Media | UI / UX / Pulido visual |
| UI-019 | Definir patron comun de formularios clinicos largos. | Pendiente | Media-alta | UI / UX / Pulido visual |
| BE-011 | Disenar trazabilidad hallazgo a trabajo. | Integrada | Alta | Integracion Backend/Estructura |
| BE-012 | Disenar backend de Agenda tipificada. | Diseno documentado / pend. implementacion | Alta | Integracion Backend/Estructura |
| BE-013 | Ajustar reglas de cobros por unidad cobrable. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-014 | Crear vistas clinicas agregadas. | Pendiente | Media-alta | Integracion Backend/Estructura |
| BE-015 | Validar RLS por roles para modulos nuevos. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-016 | Disenar vista financiera por unidad cobrable. | Integrada | Media | Integracion Backend/Estructura |
| BE-017 | Definir estrategia SQL de agenda operativa. | Diseno documentado / pend. implementacion | Media | Integracion Backend/Estructura |
| SEC-001 | Validar RLS runtime por roles. | Aprobada con observaciones | Alta | Integracion Backend / Seguridad |
| SEC-002 | Crear matriz de permisos por tabla y rol. | Validada runtime / obs. | Alta | Integracion Backend / Seguridad |
| SEC-003 | Hardening Auth para produccion. | Integrada | Alta | Integracion Backend / Seguridad |
| SEC-004 | Definir alcance del rol Finanzas. | Validada runtime / obs. | Alta | Control de desarrollo / Integracion Backend |
| SEC-005 | Disenar bitacora/auditoria de cambios sensibles. | Pendiente | Alta | Integracion Backend |
| SEC-006 | Politica de fotos, retencion y objetos huerfanos. | Pendiente | Alta | Integracion Backend / Seguridad |
| SEC-007 | Procedimiento de scripts manuales locales/demo y prohibicion en produccion. | Pendiente | Alta | Integracion Backend / Seguridad |
| SEC-008 | Implementacion controlada Hardening Auth. | Implementada parcial / pendiente PR | Alta | Integracion Backend / Seguridad |
| SEC-008B | Cierre de signup y provisioning Auth controlado. | Pendiente | Alta | Integracion Backend / Seguridad |
| SEC-009 | Disenar seguridad de API publica. | Pendiente | Alta | Integracion Backend / Seguridad |
| SEC-010 | Disenar seguridad cloud, OAuth, IAM e identidades tecnicas. | Diseno documental / pendiente implementacion futura | Alta | Integracion Backend / Seguridad |
| BE-018 | Separacion tecnica de ambientes. | Pendiente | Alta | Integracion Backend |
| BE-019 | Estrategia de backup/restauracion. | Pendiente | Alta | Integracion Backend / Produccion |
| BE-020 | Consentimiento informado y tratamiento de datos. | Pendiente | Alta | Control de desarrollo / Revision Clinica / Backend |
| BE-021 | Politica de anulacion vs eliminacion. | Pendiente | Media-alta | Control de desarrollo / Backend |
| BE-022 | Soporte de fotos para elementos del caso con Supabase Storage. | Implementada local / pend. QA | Alta | Integracion Backend/Estructura |
| BE-023 | Alias/codigo administrativo persistente para Finanzas. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-024 | Regla de hallazgo unico/multiple por aspecto revisado. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-025 | Campos financieros permitidos/prohibidos para Finanzas. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-026 | Disenar contrato de API publica de agendamiento. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-027 | Disenar integracion Google Calendar / Gmail / Workspace. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-028 | Implementar modelo DB de Agenda operativa. | Integrada por PR #41 | Alta | Integracion Backend/Estructura |
| BE-029 | Validar runtime local de Agenda operativa. | Integrada por PR #42 / validada local | Alta | Integracion Backend / Seguridad |
| BE-030 | Disenar arquitectura de plataforma Google Cloud. | Diseno documental / pendiente implementacion futura | Alta | Integracion Backend/Estructura |
| UI-020 | Indicador visual de ambiente activo. | Pendiente | Alta | UI / UX |
| UI-021 | Bloqueo visual de produccion no habilitada. | Pendiente | Alta | UI / UX |
| UI-022 | Integracion visual minima de fotos dentro de Elementos del caso. | Implementada local / pend. QA | Alta | UI / UX / Pulido visual |
| UI-023 | Navegacion y superficies filtradas por rol. | Pendiente | Alta | UI / UX |
| UI-024 | Recuperacion de cuenta, MFA y estados Auth no tecnicos. | Pendiente | Alta | UI / UX / Integracion Backend |
| UI-025 | Integrar AgendaPage con modelo DB de Agenda operativa. | Integrada lectura / pendiente UI-025B | Alta | UI / UX / Integracion Backend |
| DOC-001 | Manual de ambientes. | Pendiente | Alta | Control de desarrollo |
| DOC-002 | Procedimiento de backup/restauracion. | Pendiente | Alta | Control de desarrollo / Integracion Backend |
| DOC-003 | Politica de carga de datos reales. | Pendiente | Alta | Control de desarrollo |
| DOC-004 | Documentar flujo pagina publica -> API -> sistema interno -> Google. | Pendiente | Alta | Control de desarrollo |
| DOC-005 | Documentar estrategia de migracion progresiva a Google Cloud. | Documental / pendiente validacion | Alta | Control de desarrollo |
| QA-003 | Validacion funcional local de fotos de elementos del caso. | Pendiente | Alta | Control de desarrollo |
| IMP-002 | Implementacion funcional hallazgo a trabajo. | Pendiente | Alta | Implementacion |
| PROD-001 | Preparacion para uso real con datos sensibles. | Mantener pendiente / bloqueante | Alta | Control de desarrollo / Integracion Backend |

## Pendientes integrados

### CTRL-007 - Sincronizar documentacion maestra post BE-016, QA-004 y UI-016

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Auditoria integral post PR #33
**Fecha creacion:** 2026-06-29
**Rama usada:** `ctrl-007-sync-docs-post-pr33`
**Dependencias:** BE-016, QA-004, UI-016

#### Resultado
Sincroniza la documentacion maestra para reflejar que BE-016, QA-004 y UI-016 ya estan integradas en `main`.

Corrige estados obsoletos que indicaban `Implementada local / pendiente PR` para BE-016 y UI-016, y deja explicito que:

- `FinanzasPage` usa `public.vista_finanzas_unidades_cobrables`;
- `ReportesPage` esta separado por rol;
- PR #31, PR #32 y PR #33 ya estan integrados;
- PROD-001 sigue bloqueante;
- no se autoriza uso con datos reales, fotos reales ni pagos reales.

### CTRL-008 - Registrar decisiones criticas post auditoria

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Auditoria integral post PR #35
**Fecha creacion:** 2026-06-29
**Rama usada:** `ctrl-008-decisiones-criticas-post-auditoria`
**PR:** #36
**Informe:** `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`
**Dependencias:** CTRL-007, QA-005, SEC-001, SEC-002, SEC-004, BE-016, UI-016

#### Resultado

Registra decisiones o propuestas criticas antes de avanzar a seguridad, backend, UI o produccion.

CTRL-008 distingue:

- decisiones estables;
- decisiones propuestas pendientes de aprobacion;
- preguntas abiertas bloqueantes;
- riesgos detectados;
- tareas derivadas requeridas.

#### Observaciones

CTRL-008 no implemento seguridad, backend, UI ni migraciones. PROD-001 sigue bloqueante.

### CTRL-009 - Sincronizacion documental Google Cloud

**Estado:** Integrada documentalmente / pendiente revision
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** PR #43 / estrategia Google Cloud
**Fecha creacion:** 2026-07-01
**Rama usada:** `docs/google-cloud-migracion-progresiva`
**Informe:** `docs/control/auditorias/CTRL-009_SYNC_DOCUMENTAL_GOOGLE_CLOUD.md`
**Dependencias:** API-001, DEC-033, DEC-034, BE-028, BE-029, PROD-001

#### Descripcion
Sincronizar los documentos maestros con la estrategia progresiva Google Cloud, manteniendo Supabase/PostgreSQL como base actual y Google Cloud como plataforma futura para API segura, Workspace, despliegue y automatizacion.

#### Resultado
Documentacion integrada en la rama del PR #43 y pendiente de revision de Javier. No implementa infraestructura, credenciales, endpoints, migraciones ni despliegues.

### DEC-035 - Migracion progresiva a plataforma Google Cloud

**Estado:** Propuesta documental / pendiente validacion Javier
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** CTRL-009 / API-001 / PROD-001
**Fecha creacion:** 2026-07-01
**Informe:** `docs/control/auditorias/DEC-035_MIGRACION_PROGRESIVA_GOOGLE_CLOUD.md`
**Dependencias:** DEC-033, DEC-034, BE-030, SEC-010, DOC-005, QA-007, PROD-001

#### Descripcion
Registrar que el proyecto no migra inmediatamente base de datos, Auth ni backend hacia Google Cloud. La migracion sera progresiva y solo documental en esta fase.

#### Resultado
Pendiente validacion de Javier. Supabase/PostgreSQL sigue siendo la base actual y PROD-001 sigue bloqueante.

### BE-030 - Disenar arquitectura de plataforma Google Cloud

**Estado:** Diseno documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** DEC-035 / API-001 / BE-027
**Fecha creacion:** 2026-07-01
**Informe:** `docs/control/auditorias/BE-030_ARQUITECTURA_PLATAFORMA_GOOGLE_CLOUD.md`
**Dependencias:** BE-026, BE-027, SEC-009, SEC-010, DOC-004, DOC-005, PROD-001

#### Descripcion
Disenar Google Cloud como plataforma futura para API segura, integracion Workspace, despliegue, automatizacion y operacion por ambientes.

#### Resultado
Diseno documental. Cloud Run, Firebase App Hosting y Cloud Functions quedan como opciones futuras no implementadas. No se crean servicios cloud.

### SEC-010 - Disenar seguridad cloud, OAuth, IAM e identidades tecnicas

**Estado:** Diseno documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** DEC-035 / BE-030 / SEC-009
**Fecha creacion:** 2026-07-01
**Informe:** `docs/control/auditorias/SEC-010_SECRETOS_OAUTH_IAM_GOOGLE_CLOUD.md`
**Dependencias:** BE-018, DOC-001, DOC-003, BE-026, BE-027, SEC-009, DOC-005, PROD-001

#### Descripcion
Definir manejo futuro de secretos, OAuth, IAM, service accounts, CI/CD y credenciales por ambiente sin crear credenciales reales.

#### Resultado
Diseno documental. No autoriza secretos, proyectos Google Cloud, OAuth clients, service accounts, `.env`, datos reales ni produccion.

### DOC-005 - Documentar estrategia de migracion progresiva a Google Cloud

**Estado:** Documental / pendiente validacion
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** DEC-035 / BE-030 / SEC-010
**Fecha creacion:** 2026-07-01
**Informe:** `docs/control/auditorias/DOC-005_ESTRATEGIA_MIGRACION_PROGRESIVA_GOOGLE_CLOUD.md`
**Dependencias:** DEC-035, BE-030, SEC-010, DOC-001, DOC-003, DOC-004, PROD-001

#### Descripcion
Ordenar la ruta progresiva para incorporar Google Cloud sin interrumpir el desarrollo actual ni habilitar produccion o datos reales.

#### Resultado
Documento creado para revision. Mantiene migracion progresiva, no inmediata.

### QA-007 - Checklist pre-migracion cloud

**Estado:** Checklist documental / pendiente ejecucion futura
**Prioridad:** Alta
**Responsable:** Control de desarrollo / QA
**Origen:** DEC-035 / BE-030 / SEC-010 / DOC-005
**Fecha creacion:** 2026-07-01
**Informe:** `docs/control/auditorias/QA-007_CHECKLIST_PRE_MIGRACION_CLOUD.md`
**Dependencias:** DEC-035, BE-030, SEC-010, DOC-001, DOC-003, DOC-004, BE-026, BE-027, SEC-009, PROD-001

#### Descripcion
Definir checklist previo a cualquier implementacion o despliegue real en Google Cloud.

#### Resultado
Checklist documental. No habilita produccion mientras PROD-001 siga abierto.

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

### BE-010 - Ajustar soporte operativo de hallazgos derivados de aspectos

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002 / Control de desarrollo
**Fecha creacion:** 2026-06-12
**Fecha documentacion:** 2026-06-13
**Rama sugerida:** `docs/be-010-plan-hallazgos-operativos`
**Dependencias:** DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, BE-002, BE-003, UI-011

#### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`.

### UI-011 - Disenar panel operativo de hallazgos dentro del detalle de revision

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002 / BE-010
**Fecha creacion:** 2026-06-13
**Fecha documentacion:** 2026-06-13
**Rama sugerida:** `docs/ui-011-panel-hallazgos`
**Dependencias:** DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, BE-010

#### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/UI-011_PANEL_OPERATIVO_HALLAZGOS.md`. IMP-001 llevo esta definicion a una implementacion funcional minima dentro de `DetalleRevisionesPanel`.

### IMP-001 - Implementar hallazgos operativos en `DetalleRevisionesPanel`

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Implementacion
**Origen:** BE-010 + UI-011
**Fecha integracion:** 2026-06-13
**PR:** #16
**Dependencias:** BE-010, UI-011, DEC-007, DEC-008

#### Resultado
Integrada por PR #16. Deja visible el hallazgo registrado, habilita `Ver hallazgo`, abre `Crear hallazgo` desde aspecto revisado y hereda revision, elemento, area y aspecto. Falta QA-002 para validar guardado real de un hallazgo nuevo desde la UI.

### DATA-001 - Agregar seed local de caso demo integral

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Control de desarrollo
**Fecha integracion:** 2026-06-17
**PR:** #17
**Dependencias:** IMP-001

#### Resultado
Integrada por PR #17. El seed local `supabase/dev-seeds/caso_demo_integral.sql` fue ejecutado correctamente en Supabase local y el caso `DATA-001 - Caso Demo Integral` permite validar visualmente el flujo de hallazgos.

### BE-011 - Disenar trazabilidad hallazgo a trabajo

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** Control de desarrollo / BE-010
**Fecha documentacion:** 2026-06-16
**Fecha integracion:** 2026-06-17
**PR:** #18
**Dependencias:** BE-010, UI-011, DEC-007, DEC-008, DEC-009, DEC-010, DEC-012

#### Resultado
Integrada documentalmente por PR #18. La primera version usara `trabajos.revision_hallazgo_origen_id`; no se requiere migracion inicial y `trabajo_hallazgos` queda como alternativa futura si se confirma necesidad muchos-a-muchos.

### QA-002 - Validacion funcional de hallazgos operativos con caso demo

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** IMP-001 + DATA-001
**Fecha creacion:** 2026-06-17
**Fecha integracion:** 2026-06-17
**PR:** #20
**Rama sugerida:** `docs/qa-002-validacion-hallazgos-operativos`
**Dependencias:** IMP-001, DATA-001, BE-011

#### Resultado
Integrada por PR #20. QA-002 validó correctamente en ambiente local el flujo de hallazgos operativos con DATA-001: creación manual de hallazgo, persistencia tras recarga, visualización en revisión, prevención visual de duplicado y botón `Evaluar trabajo próximamente` deshabilitado.

### QA-004 - Validacion funcional local BE-016 / Finanzas

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** BE-016 / SEC-001 / SEC-004
**Fecha creacion:** 2026-06-28
**PR:** #32
**Informe:** `docs/control/auditorias/QA-004_VALIDACION_BE016_FINANZAS.md`
**Dependencias:** BE-016

#### Resultado
Integrada por PR #32. QA-004 valido localmente que el rol Finanzas inicia sesion, accede a `Finanzas / Pagos`, opera con alias/codigos administrativos y consume informacion financiera minima.

La validacion confirmo que Finanzas no ve nombre completo, telefono, email, motivo de consulta, evaluaciones, elementos del caso, hallazgos, trabajos clinicos sensibles, fotos, miniaturas ni `storage_path`.

QA-004 no habilita datos reales, fotos reales, pagos reales ni produccion. PROD-001 sigue bloqueante.

### QA-005 - Validacion funcional local UI-016 / Reportes por rol

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** UI-016 / PR #33 / CTRL-007
**Fecha creacion:** 2026-06-29
**Rama usada:** `qa-005-validacion-ui016-reportes`
**PR:** #35
**Informe:** `docs/control/auditorias/QA-005_VALIDACION_UI016_REPORTES_POR_ROL.md`
**Dependencias:** UI-016, BE-016, QA-004, CTRL-007

#### Resultado
QA-005 registra validacion funcional local de `/reportes` para Admin, Terapeuta y Finanzas.

La validacion confirma:

- Admin ve reportes generales, clinicos, financieros y operativos autorizados.
- Terapeuta ve reportes clinicos sin panel financiero completo.
- Finanzas ve solo reportes financieros desde `public.vista_finanzas_unidades_cobrables`.
- Finanzas no ve reportes clinicos, pacientes clinicos, consultas, evaluaciones, casos, elementos, revisiones, hallazgos, trabajos clinicos sensibles, fotos, miniaturas, rutas internas, `storage_path`, nombre completo, telefono, email ni motivo de consulta.
- La UI no muestra secciones clinicas vacias ni mensajes tecnicos de RLS para Finanzas.

QA-005 no habilita datos reales, fotos reales, pagos reales ni produccion. PROD-001 sigue bloqueante.

### UI-012 - Disenar flujo visual Evaluar trabajo

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002
**Fecha creacion:** 2026-06-13
**Fecha integracion:** 2026-06-17
**PR:** #21
**Rama sugerida:** `docs/ui-012-evaluar-trabajo`
**Dependencias:** UI-011, BE-010, BE-011, DEC-009, DEC-013, DEC-014, DEC-015

#### Resultado
Integrada por PR #21. UI-012 definió el diseño del flujo `Evaluar trabajo`: evaluación manual desde hallazgo, prevención de automatismos, uso futuro de `trabajos.revision_hallazgo_origen_id` y no creación automática de cobros, sesiones ni acciones.

## Pendientes activos

El siguiente paso de control es integrar CTRL-008 y resolver sus decisiones criticas antes de avanzar a seguridad, backend, UI o produccion.

IMP-002 sigue siendo la siguiente implementacion funcional clinica relevante, pero no debe ejecutarse antes de cerrar las decisiones criticas aplicables, especialmente hallazgo unico/multiple por aspecto, relacion hallazgo -> trabajo, anulacion logica y no automatizacion de cobros/sesiones/acciones.

QA-002 y UI-012 ya fueron integradas por PR #20 y PR #21, respectivamente, y no quedan como pendientes activos.

No se deben cargar datos reales como uso oficial todavia. Antes de produccion debe cerrarse PROD-001.

### RFC-002 - Detectar duplicidades entre entidades clinicas

**Estado:** Integrada lectura / pendiente UI-025B
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

### UI-010 - Redisenar navegacion del detalle de caso

**Estado:** Aprobada con observaciones / Pendiente implementacion
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002
**Fecha creacion:** 2026-06-13
**Fecha documentacion:** 2026-06-18
**Rama sugerida:** `docs/ui-010-diseno-resumen-detalle-caso`
**Dependencias:** UI-001, UI-002, RFC-001

#### Descripcion
Convertir la ficha de caso en una vista resumen navegable por secciones, evitando depender de una lista vertical extensa. La vista por elemento queda como modo secundario o fase posterior.

#### Criterios de aceptacion
- Usar vista resumen general por secciones como recomendacion principal.
- Mantener tarjetas o modulos para elementos, revisiones, detalle de revision, hallazgos, trabajos, pagos y seguimiento.
- Mantener el caso como contenedor central del flujo clinico.
- Conservar trazabilidad entre caso, revision, elemento, aspecto, hallazgo y trabajo.
- Considerar como obligatorias las observaciones de Revision de flujo clinico antes de implementar.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

#### Resultado
Aprobada con observaciones como diseno UI/UX y validada clinicamente con observaciones. No debe implementarse hasta considerar los criterios clinicos obligatorios. PR #24 puede integrarse documentalmente. Informe detallado en `docs/control/auditorias/UI-010_DISENO_RESUMEN_DETALLE_CASO.md`.

### PROD-001 - Preparacion para uso real con datos sensibles

**Estado:** Mantener pendiente / bloqueante
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Integracion Backend
**Origen:** Control de desarrollo / Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-18
**Fecha actualizacion:** 2026-06-19
**Rama sugerida:** `docs/prod-001-sec-001-tareas-datos-reales`
**Dependencias:** SEC-001, SEC-002, SEC-003, SEC-004, SEC-005, SEC-008, BE-018, BE-019, BE-020, BE-021, UI-020, UI-021, DOC-001, DOC-002, DOC-003

#### Descripcion
Definir y cerrar las condiciones minimas antes de ingresar datos reales de pacientes al sistema. No se habilita uso oficial con datos reales hasta cerrar separacion de ambientes, seguridad, backups, consentimiento y auditoria.

#### Criterios de aceptacion
- Separar ambientes local, demo, staging y produccion.
- Confirmar que datos demo no se mezclen con datos reales.
- Validar runtime de RLS por rol con usuarios de prueba.
- Crear matriz de permisos por tabla y rol.
- Definir y probar respaldo y restauracion.
- Definir consentimiento informado o autorizacion de tratamiento de datos.
- Definir bitacora/auditoria de cambios sensibles.
- Aprobar checklist pre-produccion por Control de desarrollo.
- Contar con aprobacion explicita de Javier antes del primer paciente real.
- No modificar datos reales.
- No tocar Supabase remoto sin autorizacion expresa.

#### Resultado
Pendiente y bloqueante. Informes relacionados en `docs/control/auditorias/PROD-001_PREPARACION_USO_REAL_DATOS_SENSIBLES.md` y `docs/control/auditorias/PROD-001_SEC-001_PREPARACION_DATOS_REALES.md`.

### SEC-001 - Validar RLS runtime por roles

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha validacion runtime:** 2026-06-27
**Informe:** `docs/control/auditorias/SEC-001_VALIDACION_RUNTIME_RLS_ROLES.md`

#### Descripcion
Probar con usuarios reales de prueba `admin`, `terapeuta` y `finanzas` que cada rol ve y modifica solo lo permitido tabla por tabla.

#### Criterios de aceptacion preliminares
- Ejecutar pruebas con usuario admin.
- Ejecutar pruebas con usuario terapeuta.
- Ejecutar pruebas con usuario finanzas.
- Validar select, insert, update y delete/anulacion cuando corresponda.
- Documentar resultados por tabla.
- No tocar Supabase remoto sin autorizacion expresa.

#### Resultado

Aprobada con observaciones en Supabase local. Se validaron roles, helpers, RLS, tablas clinicas, tablas financieras, `public.fotos_elementos_caso`, bucket privado `elementos-caso`, `storage.objects`, `vista_cobros_estado` y rutas frontend por rol.

La matriz runtime confirma que Finanzas queda bloqueado frente a clinica sensible, fotos y Storage; Admin y Terapeuta acceden a clinica/fotos segun lo esperado; Admin y Finanzas acceden a cobros/pagos; Terapeuta queda bloqueado frente a cobros/pagos.

#### Observaciones

SEC-001 uso la matriz SEC-002 y el alcance SEC-004 como criterio esperado. No habilita datos reales: quedan observaciones de hardening de grants, vista financiera minima, reportes por rol, auditoria sensible y anulacion logica.

### SEC-002 - Crear matriz de permisos por tabla y rol

**Estado:** Validada runtime / observaciones
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha validacion documental:** 2026-06-19
**Dependencias:** SEC-001, SEC-004, SEC-005, BE-016, BE-021, UI-016, PROD-001

#### Descripcion
Disenar una matriz documental de permisos esperados para `admin`, `terapeuta` y `finanzas` antes de ejecutar pruebas runtime de RLS en SEC-001.

#### Resultado

Aprobada con observaciones como diseno documental. Informe registrado en `docs/control/auditorias/SEC-002_MATRIZ_PERMISOS_ROLES.md`.

#### Observaciones

No se implementaron policies, migraciones, tablas ni cambios de codigo. SEC-001 valido runtime esta matriz en Supabase local y dejo observaciones de hardening, vistas financieras minimas, reportes por rol, auditoria sensible y anulacion logica.

### SEC-003 - Hardening Auth para produccion

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** Auditoria PROD-001 / SEC-001 / CTRL-008
**Fecha creacion:** 2026-06-19
**Fecha diseno documental:** 2026-06-29
**Rama usada:** `sec-003-hardening-auth-diseno`
**Informe:** `docs/control/auditorias/SEC-003_HARDENING_AUTH.md`
**Dependencias:** CTRL-008, DEC-029, DEC-030, DEC-031, PROD-001

#### Descripcion
Definir medidas de endurecimiento de Supabase Auth antes de habilitar produccion con datos sensibles.

#### Resultado documental

SEC-003 registra el diseno de politica Auth objetivo y confirma que la configuracion actual corresponde a local/demo:

- signup abierto en config local;
- password minimo debil para produccion;
- email confirm deshabilitado;
- MFA deshabilitado;
- redirects locales;
- sin timebox/inactividad de sesion activa;
- alta real dependiente de `usuarios_internos`, rol valido y usuario activo.

La politica propuesta exige signup cerrado/controlado, provisioning administrado, email confirmado, password fuerte, MFA por rol, redirects por ambiente, recuperacion controlada y auditoria Auth conectada con SEC-005.

SEC-003 queda integrada como diseno base. SEC-008 implementa una primera parte tecnica segura sin cerrar Auth productivo.

#### Criterios de aceptacion de implementacion posterior
- Aprobar el diseno SEC-003 antes de modificar configuracion Auth.
- Separar implementacion tecnica en `SEC-008`.
- Definir configuracion por ambiente junto a BE-018/DOC-001.
- Validar signup, password policy, email confirm, MFA, redirects, sesiones y recuperacion.
- Conectar eventos Auth y cambios de rol con SEC-005.
- Cubrir casos minimos en QA-006.
- No tocar Supabase remoto sin autorizacion expresa.

#### Observaciones

SEC-003 no modifico `supabase/config.toml`, codigo fuente, migraciones, `.env` ni Supabase remoto. La implementacion controlada queda registrada por separado en SEC-008.

PROD-001 sigue bloqueante hasta completar provisioning, email confirm, MFA, recuperacion, auditoria Auth y QA-006.

### SEC-004 - Definir alcance del rol Finanzas

**Estado:** Validada runtime / observaciones
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Integracion Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha validacion documental:** 2026-06-19
**Dependencias:** SEC-001, SEC-002, BE-016, BE-020, BE-021, UI-016, PROD-001

#### Descripcion
Definir el alcance documental del rol Finanzas para que opere cobros, pagos y reportes financieros con alias administrativo, identificador interno y datos financieros minimos, sin acceder a ficha completa del paciente ni datos clinicos sensibles.

#### Criterios de aceptacion
- Definir datos minimos necesarios para cobranza y pagos.
- Establecer alias administrativo e identificador interno como identidad visible por defecto.
- Dejar nombre completo, telefono y email prohibidos por defecto o pendientes de aprobacion expresa.
- Separar informacion financiera de informacion clinica sensible.
- Prohibir acceso de Finanzas a fotos o archivos clinicos asociados.
- Documentar restricciones por tabla, vista o feature futuro.
- Mantener PROD-001 como bloqueo antes de uso real.
- No modificar datos reales ni datos demo.

#### Resultado

SEC-004 queda aprobada con observaciones como diseño documental. Informe relacionado en `docs/control/auditorias/SEC-004_ALCANCE_ROL_FINANZAS.md`.

#### Observaciones

Finanzas ve alias administrativo, identificador interno y datos financieros minimos por defecto. Nombre completo, telefono y email quedan prohibidos por defecto o pendientes de aprobacion expresa y consentimiento suficiente en BE-020.

SEC-001 valido runtime que Finanzas no accede a clinica sensible, elementos del caso, hallazgos, revisiones, sesiones, acciones terapeuticas, fotos ni archivos clinicos. BE-016 ya implemento la vista financiera minima y UI-016 ya separo reportes por rol. BE-021 sigue pendiente para definir anulacion logica vs delete fisico.

### SEC-005 - Disenar bitacora/auditoria de cambios sensibles

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Disenar una bitacora de auditoria para cambios sensibles en datos clinicos, financieros y de acceso.

#### Criterios de aceptacion preliminares
- Identificar eventos sensibles que deben auditarse.
- Definir actor, fecha, entidad afectada y tipo de cambio.
- Definir alcance inicial sin crear tablas todavia.
- Considerar trazabilidad para anulaciones y correcciones.
- No crear migraciones ni policies durante esta tarea.

#### Observaciones

SEC-005 debe considerar los riesgos detectados por SEC-002 sobre acciones sensibles, anulacion logica y cambios financieros/clinicos.

CTRL-008 agrega que SEC-005 debe cubrir, al menos, cambios sobre pacientes, consultas, evaluaciones, casos, elementos, revisiones, hallazgos, trabajos, cobros, pagos, fotos, cambios de rol, anulaciones e intentos criticos.

### SEC-006 - Politica de fotos, retencion y objetos huerfanos

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** CTRL-008 / DEC-028 / SEC-001
**Fecha creacion:** 2026-06-29
**Dependencias:** BE-022, UI-022, QA-003, SEC-005, BE-021, PROD-001

#### Descripcion
Definir politica operativa y tecnica para fotos de elementos del caso antes de cualquier uso con fotos reales.

#### Criterios de aceptacion preliminares
- Confirmar que fotos reales siguen bloqueadas mientras PROD-001 este abierto.
- Definir quien puede subir, ver, anular, archivar o descartar fotos.
- Definir retencion y eliminacion excepcional.
- Definir manejo de objetos huerfanos entre Storage y `fotos_elementos_caso`.
- Definir auditoria minima de cambios y accesos sensibles.
- Confirmar que Finanzas no ve fotos, miniaturas, rutas ni `storage_path`.
- No tocar Storage remoto ni usar fotos reales.

### SEC-007 - Procedimiento de scripts manuales locales/demo y prohibicion en produccion

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** CTRL-008 / DEC-029 / SEC-003
**Fecha creacion:** 2026-06-29
**Dependencias:** SEC-003, DOC-001, PROD-001

#### Descripcion
Definir procedimiento seguro para scripts manuales de usuarios demo/local y prohibir su uso como practica normal en produccion.

#### Criterios de aceptacion preliminares
- Permitir scripts manuales solo en local/demo.
- Prohibir scripts manuales sobre `auth.users` en produccion.
- Exigir scripts idempotentes, documentados y sin secretos.
- Definir alta, baja y cambio de rol por procedimiento aprobado.
- Evitar convertir archivos tipo `console.sql` en practica operativa normal.
- No tocar `.env`, Supabase remoto ni datos reales.

### SEC-008 - Implementacion controlada Hardening Auth

**Estado:** Implementada parcial / pendiente PR
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** SEC-003 / DEC-029 / DEC-030 / DEC-031 / DEC-032
**Fecha creacion:** 2026-06-29
**Fecha implementacion parcial:** 2026-06-30
**Rama usada:** `sec-008-implementacion-hardening-auth`
**Informe:** `docs/control/auditorias/SEC-008_IMPLEMENTACION_HARDENING_AUTH.md`
**Dependencias:** SEC-003, SEC-005, SEC-007, BE-018, DOC-001, QA-006, PROD-001

#### Descripcion
Aplicar tecnicamente, en tarea separada y aprobada, la politica de hardening Auth definida por SEC-003, sin romper local/demo ni tocar Supabase remoto.

#### Resultado parcial

Se aplican cambios seguros para local/demo:

- password minimo local sube a 8 caracteres;
- se exige `lower_upper_letters_digits` para nuevas altas/cambios de contrasena;
- se habilita timebox de sesion de 24h e inactividad de 8h en config local;
- el login deja de mostrar mensajes crudos de Supabase;
- la validacion de `usuarios_internos` deja de mostrar errores tecnicos de RLS/DB;
- se conserva el bloqueo de usuario Auth sin perfil interno, usuario inactivo y rol invalido.

#### Cambios no aplicados por riesgo

- No se cerro signup local porque no existe provisioning Auth versionado suficiente.
- No se habilito email confirm local porque podria bloquear cuentas demo no confirmadas.
- No se habilito MFA porque no existe UI de enrolamiento/verificacion.
- No se implemento recovery porque requiere correo/SMTP/flujo UI y procedimiento administrativo.
- No se tocaron migraciones ni `auth.users`.
- No se toco Supabase remoto.

#### Observaciones

SEC-008 no cierra Auth para produccion. Quedan derivadas SEC-008B, UI-024, SEC-005, SEC-007, BE-018, DOC-001 y QA-006.

PROD-001 sigue bloqueante.

### SEC-008B - Cierre de signup y provisioning Auth controlado

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** SEC-008 / SEC-003 / DEC-032
**Fecha creacion:** 2026-06-30
**Dependencias:** SEC-008, SEC-005, SEC-007, BE-018, DOC-001, QA-006, PROD-001

#### Descripcion
Implementar el cierre de signup por ambiente y un procedimiento de provisioning/invitacion administrada para usuarios internos.

#### Criterios de aceptacion preliminares
- Definir si LOCAL mantiene signup abierto o usa provisioning demo.
- Cerrar signup en STAGING/PRODUCCION.
- Crear o documentar alta controlada sin scripts manuales sobre `auth.users` como practica normal.
- Coordinar usuario Auth con `usuarios_internos`, rol valido y `activo=true`.
- Definir email confirm por ambiente.
- Definir MFA por rol antes de produccion.
- No tocar Supabase remoto sin autorizacion expresa.
- No usar datos reales, fotos reales ni pagos reales.

### SEC-009 - Disenar seguridad de API publica

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** API-001 / DEC-033 / PROD-001
**Fecha creacion:** 2026-06-30
**Dependencias:** API-001, BE-012, BE-017, BE-018, BE-020, SEC-005, SEC-008, SEC-008B, DOC-001, DOC-003, QA-006, PROD-001

#### Descripcion
Definir el modelo de seguridad para la futura API publica que conectara la pagina publica con Agenda, consentimiento, sistema interno y Google Workspace.

#### Criterios de aceptacion preliminares
- Definir separacion entre endpoints publicos e internos.
- Definir CORS estricto por ambiente y dominio.
- Definir rate limit, anti-spam y CAPTCHA o mecanismo equivalente.
- Definir validacion y sanitizacion de payloads.
- Definir errores publicos neutros sin detalles tecnicos.
- Definir manejo de secretos y prohibicion de tokens en frontend publico.
- Definir idempotencia y deduplicacion para solicitudes de agenda.
- Definir auditoria minima junto a SEC-005.
- Definir estrategia de pruebas sin datos reales.
- No crear endpoints, migraciones ni cambios RLS en esta tarea.
- No tocar `.env`, Supabase remoto ni servicios Google reales sin autorizacion expresa.

#### Observaciones
SEC-009 debe cerrarse antes de implementar cualquier endpoint publico operativo. No habilita produccion ni datos reales.

### API-001 - Disenar API publica segura e integracion Google Workspace

**Estado:** Diseno documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Integracion Backend
**Origen:** Solicitud arquitectura API publica / DEC-033
**Fecha creacion:** 2026-06-30
**Rama usada:** `api-001-diseno-api-publica-google-workspace`
**Informe:** `docs/control/auditorias/API-001_DISENO_API_PUBLICA_GOOGLE_WORKSPACE.md`
**Dependencias:** BE-012, BE-017, BE-018, BE-019, BE-020, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Registrar la estrategia futura de una API segura que actue como frontera entre pagina publica, sistema interno, Supabase y Google Calendar/Gmail/Workspace.

API-001 establece que la pagina publica no debe escribir directamente en tablas clinicas o financieras, y que la integracion Google debe ejecutarse desde backend controlado.

#### Criterios de aceptacion
- Crear informe arquitectonico en `docs/control/auditorias/`.
- Registrar decision arquitectonica en `05_DECISIONES_PROYECTO.md`.
- Registrar tareas derivadas para contrato API, integracion Google, seguridad API y documentacion de flujo.
- Identificar que Agenda no tiene backend operativo todavia.
- Identificar que no existe API real ni backend propio implementado.
- Definir endpoints conceptuales futuros sin implementarlos.
- Mantener PROD-001 bloqueante.
- No modificar codigo funcional.
- No modificar migraciones.
- No tocar `.env` ni Supabase remoto.

#### Observaciones
API-001 no habilita agendamiento publico real, datos reales, fotos reales, pagos reales ni produccion. Su objetivo es dejar preparada la arquitectura antes de construir.

### BE-018 - Separacion tecnica de ambientes

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Definir separacion tecnica entre local, demo, staging y produccion, evitando mezcla de configuraciones y datos.

#### Criterios de aceptacion preliminares
- Documentar ambientes requeridos y proposito de cada uno.
- Definir variables de ambiente por contexto.
- Identificar barreras para evitar uso de seeds demo en produccion.
- Definir criterio de habilitacion de staging y produccion.
- No tocar `.env` ni Supabase remoto sin autorizacion expresa.

### BE-019 - Estrategia de backup/restauracion

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend / Produccion
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Definir estrategia de respaldo y restauracion antes de operar con datos reales.

#### Criterios de aceptacion preliminares
- Definir frecuencia, responsable y alcance de backups.
- Definir procedimiento de restauracion.
- Probar restauracion antes de produccion.
- Documentar resultado de prueba de restauracion.
- No tocar Supabase remoto sin autorizacion expresa.

### BE-020 - Consentimiento informado y tratamiento de datos

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Revision Clinica / Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Definir el consentimiento informado o autorizacion de tratamiento de datos requerida antes de registrar pacientes reales.

#### Criterios de aceptacion preliminares
- Definir texto o referencia del consentimiento informado.
- Validar alcance con Revision Clinica.
- Definir donde se registra la aceptacion o autorizacion.
- Revisar implicancias de privacidad y confidencialidad.
- No cargar datos reales antes de aprobacion explicita.

#### Observaciones

SEC-004 deja nombre completo, telefono y email prohibidos por defecto para Finanzas. BE-020 debe definir consentimiento o autorizacion especifica si Control de Desarrollo decide exponer alguno de esos datos para cobranza directa.

### BE-021 - Politica de anulacion vs eliminacion

**Estado:** Pendiente
**Prioridad:** Media-alta
**Responsable:** Control de desarrollo / Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Definir cuando corresponde anular, corregir o eliminar informacion clinica, financiera o administrativa.

#### Criterios de aceptacion preliminares
- Separar anulacion operativa de eliminacion fisica.
- Definir criterios por tipo de dato sensible.
- Considerar trazabilidad y auditoria de cambios.
- Documentar casos permitidos y prohibidos.
- No modificar base de datos ni datos existentes.

#### Observaciones

BE-021 debe definir la politica transversal de anulacion logica vs delete fisico, considerando que SEC-002 recomienda prohibir delete fisico clinico/financiero en produccion.

SEC-004 agrega que cobros y pagos deben operar con anulacion logica y que el delete fisico financiero debe quedar prohibido en produccion para mantener trazabilidad.

### UI-020 - Indicador visual de ambiente activo

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Disenar un indicador visible del ambiente activo para reducir el riesgo de operar en el contexto equivocado.

#### Criterios de aceptacion preliminares
- Definir estados visuales para local, demo, staging y produccion.
- Evitar que el indicador tape informacion clinica.
- Considerar version mobile y desktop.
- Documentar comportamiento esperado antes de implementar.
- No modificar codigo fuente ni CSS en esta tarea documental.

### UI-021 - Bloqueo visual de produccion no habilitada

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Disenar una advertencia o bloqueo visual para impedir uso productivo cuando PROD-001 siga abierto.

#### Criterios de aceptacion preliminares
- Definir mensaje de produccion no habilitada.
- Definir condiciones para mostrar advertencia o bloqueo.
- Considerar rutas clinicas, financieras y administrativas.
- Asegurar que no se confunda demo con produccion.
- No modificar codigo fuente ni CSS en esta tarea documental.

### DOC-001 - Manual de ambientes

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Crear manual documental para uso y administracion de ambientes local, demo, staging y produccion.

#### Criterios de aceptacion preliminares
- Describir proposito y restricciones de cada ambiente.
- Documentar responsable operativo por ambiente.
- Registrar reglas para variables de entorno sin exponer secretos.
- Incluir regla de no mezclar datos demo con datos reales.
- No tocar `.env`.

### DOC-002 - Procedimiento de backup/restauracion

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Integracion Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Documentar el procedimiento de respaldo y restauracion que debe probarse antes de produccion.

#### Criterios de aceptacion preliminares
- Describir pasos de respaldo.
- Describir pasos de restauracion.
- Definir responsable y evidencia requerida.
- Registrar resultado esperado de prueba.
- No tocar Supabase remoto sin autorizacion expresa.

### DOC-003 - Politica de carga de datos reales

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19

#### Descripcion
Definir politica operativa para autorizar, ejecutar y controlar la primera carga de datos reales.

#### Criterios de aceptacion preliminares
- Exigir cierre de PROD-001 antes de cargar pacientes reales.
- Definir aprobacion explicita de Javier como condicion.
- Prohibir seeds demo en produccion.
- Definir checklist pre-produccion.
- Documentar responsable de autorizacion y evidencia.

### DOC-004 - Documentar flujo pagina publica -> API -> sistema interno -> Google

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** API-001 / DEC-033
**Fecha creacion:** 2026-06-30
**Dependencias:** API-001, BE-012, BE-017, BE-018, BE-020, BE-026, BE-027, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Documentar el flujo operativo completo entre pagina publica, API, sistema interno, base de datos y Google Calendar/Gmail/Workspace.

#### Criterios de aceptacion preliminares
- Describir el flujo de solicitud publica de agenda.
- Describir el registro de consentimiento.
- Describir creacion o revision interna de cita.
- Describir sincronizacion Calendar con datos neutros.
- Describir correos de confirmacion y recordatorio con contenido neutro.
- Describir errores, cancelaciones, duplicados y reintentos.
- Indicar datos permitidos y prohibidos en cada tramo.
- Indicar responsabilidades por ambiente.
- Mantener PROD-001 como bloqueo antes de datos reales.
- No implementar endpoints ni tocar servicios externos.

#### Observaciones
DOC-004 debe ayudar a que implementacion, UI, backend y control trabajen con el mismo mapa antes de construir la API real.

### BE-022 - Soporte de fotos para elementos del caso con Supabase Storage

**Estado:** Implementada local / pendiente QA
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-19
**Rama sugerida:** `feature/fotos-elementos-caso`
**Dependencias:** DEC-018, SEC-001, SEC-004, PROD-001

#### Descripcion
Crear soporte backend/local para asociar fotos a elementos del caso usando bucket privado `elementos-caso` y tabla relacional `public.fotos_elementos_caso`.

#### Criterios de aceptacion
- Crear migracion nueva sin reescribir migraciones existentes.
- Crear bucket privado idempotente.
- Crear tabla de metadatos con RLS.
- Crear policies para tabla y Storage sin delete fisico.
- Validar relacion paciente, caso y elemento.
- Documentar `elementos_caso.foto_url` como deprecada para uso principal.
- Confirmar que Finanzas no accede a fotos ni rutas de Storage.
- No tocar `.env`.
- No ejecutar `supabase db push`.
- No tocar Supabase remoto.
- No cargar datos reales ni imagenes reales.

#### Resultado
Implementacion local preparada en esta rama. Informe relacionado en `docs/control/auditorias/BE-022_UI-022_FOTOS_ELEMENTOS_CASO.md`.

### BE-023 - Alias/codigo administrativo persistente para Finanzas

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** CTRL-008 / DEC-022 / BE-016
**Fecha creacion:** 2026-06-29
**Dependencias:** BE-016, SEC-004, QA-004, QA-005

#### Descripcion
Definir si Finanzas debe dejar de recibir `paciente_id` real y operar solo con alias/codigo administrativo persistente o identificador financiero no clinico.

#### Criterios de aceptacion preliminares
- Revisar `public.vista_finanzas_unidades_cobrables`.
- Revisar consumo de `FinanzasPage` y `ReportesPage`.
- Proponer alternativa sin exponer `paciente_id` en contratos visibles para Finanzas.
- Definir si el alias/codigo vive en `pacientes` o tabla administrativa separada.
- No crear migracion sin aprobacion posterior.
- No tocar Supabase remoto.

### BE-024 - Regla de hallazgo unico/multiple por aspecto revisado

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** CTRL-008 / DEC-024 / QA-002
**Fecha creacion:** 2026-06-29
**Dependencias:** BE-010, BE-011, IMP-001, QA-002

#### Descripcion
Definir si `revision_hallazgos` debe permitir un hallazgo activo por aspecto o multiples hallazgos por aspecto, y como debe sostenerse la regla en DB/UI.

#### Criterios de aceptacion preliminares
- Contrastar regla clinica con Revision de flujo clinico.
- Revisar bloqueo actual de `useRevisionHallazgos`.
- Revisar ausencia de constraint unico en `revision_hallazgos.revision_aspecto_id`.
- Proponer constraint parcial o ajuste UI solo si Control aprueba.
- No crear migracion en esta tarea documental.

### BE-025 - Campos financieros permitidos/prohibidos para Finanzas

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** CTRL-008 / DEC-027 / SEC-001
**Fecha creacion:** 2026-06-29
**Dependencias:** BE-016, SEC-004, BE-020, UI-015

#### Descripcion
Definir contrato de campos financieros visibles para Finanzas y prohibir contenido clinico en campos libres de cobros/pagos.

#### Criterios de aceptacion preliminares
- Clasificar campos permitidos y prohibidos en `cobros` y `pagos`.
- Definir microcopy para evitar texto clinico en finanzas.
- Evaluar si se requieren checks, vistas o campos administrativos separados.
- Considerar `concepto_cobro`, `descripcion_cobro`, `observaciones`, `notas_internas` y `referencia_pago`.
- No crear migracion sin tarea posterior aprobada.

### BE-026 - Disenar contrato de API publica de agendamiento

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** API-001 / DEC-033
**Fecha creacion:** 2026-06-30
**Dependencias:** API-001, BE-012, BE-017, BE-028, BE-029, BE-018, BE-020, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Definir el contrato tecnico de la futura API publica de agendamiento, incluyendo endpoints, payloads, validaciones, respuestas, errores neutros, idempotencia, relacion con Agenda y consentimiento.

#### Criterios de aceptacion preliminares
- Definir contratos conceptuales para disponibilidad, agendamientos y consentimientos.
- Definir datos permitidos desde pagina publica: nombre, correo, telefono, servicio, modalidad, fecha/hora deseada, consentimiento y motivo general no sensible.
- Definir datos prohibidos: detalles clinicos profundos, informacion canalizada, fotos, datos financieros e IDs internos.
- Definir esquema de errores publicos neutros.
- Definir idempotencia y deduplicacion.
- Definir contrato usando `solicitudes_agenda` como destino conceptual, despues de BE-028 y BE-029.
- Definir estrategia de versionado, por ejemplo `/api/v1/...`.
- No crear endpoints reales en esta tarea.
- No modificar migraciones, RLS, Auth, `.env` ni Supabase remoto.

#### Observaciones
BE-026 depende del modelo de Agenda y de consentimiento. No debe cerrar contrato productivo mientras PROD-001 este abierto.

### BE-027 - Disenar integracion Google Calendar / Gmail / Workspace

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** API-001 / DEC-033
**Fecha creacion:** 2026-06-30
**Dependencias:** API-001, BE-012, BE-017, BE-018, BE-020, BE-026, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Definir la arquitectura tecnica para sincronizar Agenda con Google Calendar y enviar confirmaciones/recordatorios neutros mediante Gmail/Google Workspace desde backend seguro.

#### Criterios de aceptacion preliminares
- Definir si la integracion usara Google Cloud Run, Supabase Edge Functions u otro backend aprobado.
- Definir manejo de secretos mediante Secret Manager o mecanismo equivalente.
- Definir OAuth/service account segun el modelo real de Workspace.
- Definir titulos neutros para eventos de Calendar.
- Definir plantillas neutras de correo.
- Definir retries, idempotencia y manejo de fallos.
- Definir auditoria de sincronizacion y envio.
- Prohibir tokens o credenciales Google en frontend publico.
- No conectar Google real en esta tarea.
- No tocar `.env`, Supabase remoto ni datos reales.

#### Observaciones
La integracion Google no debe implementarse antes de cerrar ambientes, consentimiento, seguridad API, auditoria y Agenda operativa.

### BE-028 - Implementar modelo DB de Agenda operativa

**Estado:** Integrada por PR #41
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-012 / BE-017 / DEC-034
**Fecha creacion:** 2026-07-01
**Fecha implementacion local:** 2026-07-01
**Fecha integracion main:** 2026-07-01
**Rama usada:** `be-028-modelo-db-agenda-operativa`
**PR:** #41
**Commit main:** `d0115c9`
**Migracion:** `supabase/migrations/20260701040000_crear_modelo_agenda_operativa.sql`
**Informe:** `docs/control/auditorias/BE-028_IMPLEMENTACION_MODELO_DB_AGENDA_OPERATIVA.md`
**Dependencias:** BE-012, BE-017, DEC-034, BE-018, BE-020, SEC-005, SEC-009, QA-006, DOC-001, DOC-003, PROD-001

#### Descripcion
Implementar el modelo DB de Agenda operativa con migracion controlada para `solicitudes_agenda`, `agenda_eventos` y `vista_agenda_operativa`, siguiendo el diseno BE-012/BE-017.

BE-028 crea la base estructural versionada, sin implementar API publica, UI funcional, Google Calendar/Gmail ni produccion.

#### Resultado local
- Se crea migracion nueva, sin reescribir migraciones existentes.
- Se implementa `solicitudes_agenda` como entrada de solicitudes publicas futuras o internas iniciales.
- Se implementa `agenda_eventos` con `tipo_evento` obligatorio y relaciones opcionales a solicitud, paciente, consulta, evaluacion, caso, revision, trabajo y sesion de trabajo.
- Se implementa `vista_agenda_operativa` basada en `agenda_eventos`.
- Se habilita RLS en las tablas nuevas.
- Se crean policies `select`, `insert` y `update` para `admin`/`terapeuta`.
- No se crea policy de `delete`.
- No se otorga acceso directo a `anon`.
- El rol `finanzas` queda fuera de Agenda operativa.
- Se valida la migracion en Supabase local con `psql` dentro de `BEGIN`/`ROLLBACK`, sin persistir cambios.

#### Observaciones
BE-028 no habilita uso real, pagina publica, API ni produccion. La validacion runtime local por rol queda abordada por BE-029 y la integracion UI sigue pendiente en UI-025.

### BE-029 - Validar runtime local de Agenda operativa

**Estado:** Integrada por PR #42 / validada local
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** BE-028 / SEC-001 / DEC-034
**Fecha creacion:** 2026-07-01
**Fecha validacion local:** 2026-07-01
**Fecha integracion main:** 2026-07-01
**Rama usada:** `be-029-validacion-runtime-agenda-operativa`
**PR:** #42
**Commit main:** `007b0a7c16e8ba85a22f1f361b97b493474c6c7d`
**Informe:** `docs/control/auditorias/BE-029_VALIDACION_RUNTIME_AGENDA_OPERATIVA.md`
**Dependencias:** BE-028, SEC-001, SEC-002, QA-006, PROD-001

#### Descripcion
Validar en Supabase local, con datos ficticios y sin tocar remoto, que las tablas y vista de Agenda operativa respetan RLS, grants y roles esperados.

#### Resultado local
- Supabase local activo.
- Migracion `20260701040000_crear_modelo_agenda_operativa.sql` aplicada con `npx supabase migration up --local`.
- Matriz de estructura, seguridad, roles y vista: 30/30 OK.
- Matriz de checks, FKs y triggers: 17/17 OK.
- Matriz especifica de `agenda_eventos` por rol: 11/11 OK.
- `admin` y `terapeuta` pueden leer, insertar y actualizar Agenda operativa.
- `finanzas` queda fuera por RLS.
- `anon` queda fuera por ausencia de grants directos.
- `vista_agenda_operativa` usa `security_invoker` y no expone hallazgos, fotos, Storage, pagos, cobros, montos, notas internas ni mensaje de contacto.
- No se crean pacientes automaticamente.
- No se crean consultas automaticamente.
- Las pruebas usaron datos ficticios dentro de transacciones revertidas.
- No se toco Supabase remoto.
- No se ejecuto `supabase db push`.
- No se usaron datos reales.

#### Observaciones
BE-029 valida Agenda en entorno local/demo. No habilita produccion, datos reales, API publica, Google Calendar/Gmail ni UI funcional.

### UI-022 - Integracion visual minima de fotos dentro de Elementos del caso

**Estado:** Implementada local / pendiente QA
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** Control de desarrollo / BE-022
**Fecha creacion:** 2026-06-19
**Rama sugerida:** `feature/fotos-elementos-caso`
**Dependencias:** BE-022, SEC-004, QA-003

#### Descripcion
Integrar carga, listado y visualizacion basica de fotos dentro de `ElementosCasoPanel`, manteniendo el flujo dentro de la ficha del caso.

#### Criterios de aceptacion
- Mostrar cantidad de fotos por elemento.
- Permitir seleccionar elemento existente.
- Validar JPG, PNG o WebP.
- Validar tamaño maximo de 5 MB.
- Subir primero a Storage y luego registrar metadatos.
- Usar `createSignedUrl` para visualizacion temporal.
- No exponer rutas internas de Storage.
- No mostrar fotos al rol Finanzas.
- No crear modulo principal independiente.
- No modificar datos reales ni datos demo.

#### Resultado
Implementacion local preparada en esta rama. Queda pendiente QA-003 para validacion funcional manual local.

### UI-023 - Navegacion y superficies filtradas por rol

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** CTRL-008 / DEC-023 / UI-016 / QA-005
**Fecha creacion:** 2026-06-29
**Dependencias:** SEC-002, SEC-004, UI-016, QA-005

#### Descripcion
Definir e implementar posteriormente navegacion coherente por rol y revisar superficies visibles dentro de cada modulo.

#### Criterios de aceptacion preliminares
- No reutilizar `UI-017`, porque ya existe como checklist responsive clinico.
- Admin ve modulos autorizados de forma transversal.
- Terapeuta ve modulos clinicos autorizados.
- Finanzas ve Finanzas/Pagos y Reportes financieros.
- Finanzas no ve entradas clinicas en navegacion.
- Revisar `PagosCasoPanel` dentro de ficha clinica para definir si Terapeuta ve estado minimo o nada.
- No modificar codigo en esta tarea documental.
- No tocar `.env`, migraciones ni Supabase remoto.

### UI-024 - Recuperacion de cuenta, MFA y estados Auth no tecnicos

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** SEC-008 / SEC-003 / DEC-032
**Fecha creacion:** 2026-06-30
**Dependencias:** SEC-008, SEC-008B, BE-018, DOC-001, QA-006

#### Descripcion
Definir e implementar el flujo visual de recuperacion de cuenta, enrolamiento/verificacion MFA y estados Auth sin exponer detalles tecnicos.

#### Criterios de aceptacion preliminares
- Definir pantallas o modales para recuperacion de contrasena.
- Definir enrolamiento y verificacion MFA por rol si Supabase lo permite.
- Usar microcopy generico que no revele si un email existe.
- Cubrir sesion expirada, inactividad, acceso interno no habilitado y error temporal.
- No mostrar errores crudos de Supabase, RLS, politicas ni estructura de base de datos.
- Coordinar con SEC-008B antes de exigir MFA o email confirm.
- No tocar `.env`, Supabase remoto ni datos reales.

### UI-025 - Integrar AgendaPage con modelo DB de Agenda operativa

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** BE-028 / DEC-034 / UI-014
**Fecha creacion:** 2026-07-01
**Fecha integracion:** 2026-07-01
**Rama usada:** `ui-025-integracion-agenda-operativa`
**Informe:** `docs/control/auditorias/UI-025_INTEGRACION_AGENDA_OPERATIVA.md`
**Dependencias:** BE-028, BE-029, UI-014, DEC-034, QA-006, PROD-001

#### Descripcion
Integrar `src/pages/AgendaPage.tsx` con `vista_agenda_operativa`, manteniendo la separacion entre solicitud inicial, evento interno y consulta confirmada.

#### Resultado
Se reemplaza el placeholder de `/agenda` por una vista interna de lectura desde `public.vista_agenda_operativa`.

La pantalla permite:

- listar eventos operativos;
- buscar por titulo, paciente/contacto, tipo, modalidad, estado u origen;
- filtrar por contexto y estado;
- distinguir solicitudes vinculadas, eventos internos y consultas clinicas confirmadas;
- mostrar fecha/hora, modalidad, contacto operativo, estado, origen, confirmacion y estado tecnico Google.

La ruta sigue protegida para `admin` y `terapeuta`. Finanzas no queda autorizada por navegacion ni por RLS.

No se implementa creacion/edicion en esta fase para evitar conversiones prematuras, creacion automatica de pacientes/consultas o cambios de estado sin auditoria completa.

#### Observaciones
UI-025 no reemplaza BE-026 ni BE-027. La pagina publica futura debe seguir pasando por API segura. La fase posterior recomendada es `UI-025B` para creacion/edicion controlada, solo si Control aprueba el alcance.

### QA-003 - Validacion funcional local de fotos de elementos del caso

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** BE-022 / UI-022
**Fecha creacion:** 2026-06-19
**Rama sugerida:** `feature/fotos-elementos-caso`
**Dependencias:** BE-022, UI-022, Supabase local

#### Descripcion
Validar localmente que las fotos se cargan, registran y muestran asociadas al elemento correcto del caso.

#### Criterios de aceptacion
- Abrir un caso demo existente.
- Confirmar que los elementos cargan igual que antes.
- Crear un elemento demo como `Perro`, `Casa` o `Consultante`.
- Subir una foto ficticia valida.
- Confirmar que aparece asociada al elemento correcto.
- Confirmar que no aparece en otros casos.
- Confirmar que Finanzas no accede a fotos ni rutas de Storage.
- Confirmar que no se rompen revisiones, detalle de revisiones, trabajos ni pagos.
- No usar datos reales ni imagenes reales.

### QA-006 - Base minima de pruebas por rol y no exposicion sensible

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo / QA
**Origen:** CTRL-008 / SEC-001 / QA-004 / QA-005
**Fecha creacion:** 2026-06-29
**Dependencias:** SEC-003, SEC-005, SEC-008, SEC-008B, BE-021, UI-023, UI-024, BE-023, BE-025

#### Descripcion
Definir e implementar progresivamente una base minima de pruebas para roles, navegacion, reportes, finanzas y no exposicion de datos sensibles.

#### Criterios de aceptacion preliminares
- Cubrir rutas protegidas por rol.
- Cubrir navegacion filtrada por rol.
- Cubrir Reportes por rol.
- Cubrir FinanzasPage.
- Confirmar que Finanzas no ve clinica ni `storage_path`.
- Confirmar que Finanzas no recibe identificadores clinicos visibles cuando se cierre BE-023.
- Confirmar que Terapeuta no administra pagos desde Reportes ni ficha clinica.
- Cubrir casos Auth minimos: usuario sin perfil interno, usuario inactivo, rol invalido y errores Auth no tecnicos.
- Validar password policy local aplicada por SEC-008 cuando Supabase local reinicie.
- Validar que signup cerrado/provisioning funcione cuando se implemente SEC-008B.
- Validar recuperacion/MFA cuando se implemente UI-024.
- Evaluar pruebas RLS/Storage locales sin tocar remoto.
- No intentar cubrir todo en un solo PR.

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
**Dependencias:** BE-012, BE-017, BE-028, BE-029, DEC-011, DEC-034

#### Descripcion
Proponer experiencia visual para eventos tipificados de agenda: consulta, evaluacion, revision, sesion de trabajo, seguimiento y recordatorio interno.

#### Criterios de aceptacion
- Esperar definicion backend y validacion runtime de agenda antes de pantalla operativa.
- Respetar separacion entre solicitud de agenda, evento interno y consulta confirmada.
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

**Estado:** Integrada
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002
**Fecha creacion:** 2026-06-13
**Fecha implementacion local:** 2026-06-28
**Rama usada:** `ui-016-reportes-por-rol`
**PR:** #33
**Dependencias:** SEC-001, SEC-002, SEC-004, BE-016

#### Descripcion
Separar reportes para terapeuta, finanzas y admin segun necesidades operativas y permisos esperados.

#### Criterios de aceptacion
- Mantener la ruta `/reportes`.
- Renderizar contenido distinto segun rol activo.
- Admin ve panel general, clinico, financiero y operativo.
- Terapeuta ve reportes clinicos sin gestion financiera.
- Finanzas ve solo reportes financieros.
- Finanzas usa `vista_finanzas_unidades_cobrables`.
- Finanzas no consulta tablas clinicas desde Reportes.
- Evitar mostrar informacion tecnica o sensible fuera de contexto.
- No crear migraciones.
- No modificar base de datos.
- No tocar `.env`.

#### Resultado

Integrada por PR #33 en `src/pages/ReportesPage.tsx`.

`ReportesPage` detecta el rol activo y separa la pantalla en `ReportesAdmin`, `ReportesTerapeuta` y `ReportesFinanzas`. Admin mantiene panel general con indicadores clinicos y financieros autorizados. Terapeuta ve indicadores clinicos, seguimiento, hallazgos y trabajos sin finanzas completas. Finanzas ve solo metricas financieras desde `public.vista_finanzas_unidades_cobrables`.

Informe relacionado: `docs/control/auditorias/UI-016_REPORTES_POR_ROL.md`

#### Observaciones

UI-016 deja reportes diferenciados por rol: admin completo, terapeuta clinico sin finanzas detalladas y finanzas financiero sin clinica sensible.

SEC-004 agrega que los reportes para Finanzas deben usar alias administrativo, codigo financiero o identificador interno, sin nombre completo, telefono, email, ficha clinica ni archivos clinicos salvo aprobacion expresa y consentimiento aplicable.

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

### BE-012 - Disenar backend de Agenda tipificada

**Estado:** Diseno documentado / pendiente implementacion
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002 / API-001 / DEC-034
**Fecha creacion:** 2026-06-12
**Fecha diseno:** 2026-07-01
**Rama usada:** `be-012-be-017-diseno-agenda-operativa`
**Informe:** `docs/control/auditorias/BE-012_BE-017_DISENO_AGENDA_OPERATIVA.md`
**Dependencias:** DEC-011, DEC-033, DEC-034, BE-002, API-001, BE-017, BE-020, BE-018, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Definir la arquitectura backend de Agenda tipificada antes de implementar tablas, API o UI operativa.

La recomendacion documentada separa:

- `solicitudes_agenda`: solicitud inicial publica o interna, sin ficha clinica definitiva.
- `agenda_eventos`: evento interno tipificado con `tipo_evento` obligatorio.
- `consultas`: atencion/contacto/cita confirmada, asociada a paciente real.

#### Criterios de aceptacion
- Separar solicitud inicial, evento operativo y consulta confirmada.
- Definir campos minimos publicos, internos y tecnicos.
- Definir estados minimos de solicitud y evento.
- Definir relacion con pacientes sin creacion automatica desde publico.
- Definir relacion con consultas y momento de conversion.
- Definir que Agenda no crea automaticamente evaluaciones, casos, elementos, revisiones, hallazgos ni trabajos.
- Preparar insumo para BE-026 sin crear endpoints reales.
- No implementar migracion todavia.
- No modificar codigo funcional.
- No tocar `.env`, Auth/RLS ni Supabase remoto.

#### Resultado documental

BE-012 queda documentado como diseno arquitectonico. BE-028 implementa el modelo DB inicial y BE-029 valida runtime local. Queda pendiente integracion UI.

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

**Estado:** Integrada
**Prioridad:** Media
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002
**Fecha creacion:** 2026-06-12
**Fecha implementacion local:** 2026-06-27
**Rama usada:** `codex/be-016-vista-financiera-minima`
**PR:** #31
**QA:** QA-004 integrada por PR #32
**Dependencias:** BE-013, SEC-001, SEC-002, SEC-004, DEC-019
**Informe:** `docs/control/auditorias/BE-016_VISTA_FINANCIERA_MINIMA.md`

#### Descripcion
Disenar e implementar `vista_finanzas_unidades_cobrables` para reportar claramente si el cobro corresponde a consulta, evaluacion, revision, trabajo, caso o cobro administrativo sin exponer clinica sensible.

#### Criterios de aceptacion
- No reemplazar `vista_cobros_estado` sin analisis.
- Mantener pagos aplicados a cobros.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

#### Observaciones

BE-016 implementa `public.vista_finanzas_unidades_cobrables` como vista minima para Finanzas y ajusta `FinanzasPage` para usar solo esa vista. La vista no expone nombres completos, telefono, email, IDs clinicos directos, datos clinicos, fotos, miniaturas ni `storage_path`.

`vista_cobros_estado` se mantiene para compatibilidad interna/admin, pero deja de devolver filas a Finanzas. UI-016 ya separo reportes por rol. BE-021 y SEC-005 siguen pendientes antes de datos reales.

### BE-017 - Definir estrategia SQL de agenda operativa

**Estado:** Diseno documentado / pendiente implementacion
**Prioridad:** Media
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002 / BE-012 / API-001 / DEC-034
**Fecha creacion:** 2026-06-12
**Fecha diseno:** 2026-07-01
**Rama usada:** `be-012-be-017-diseno-agenda-operativa`
**Informe:** `docs/control/auditorias/BE-012_BE-017_DISENO_AGENDA_OPERATIVA.md`
**Dependencias:** BE-012, DEC-034, API-001, BE-018, BE-020, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Definir la estrategia SQL conceptual para una futura `vista_agenda_operativa`.

La recomendacion documentada es usar `agenda_eventos` como fuente primaria y unir contexto desde pacientes, consultas, evaluaciones, casos, revisiones, trabajos o sesiones solo cuando exista relacion desde el evento.

#### Criterios de aceptacion
- Mantener `tipo_evento` obligatorio.
- Separar eventos manuales, solicitudes convertidas y eventos asociados a entidades clinicas.
- Evitar `UNION` automatico de todas las consultas/evaluaciones/revisiones/sesiones para no duplicar eventos.
- Definir que datos puede exponer la vista por rol en tarea futura.
- Definir que backfill historico debe ser tarea separada si se requiere.
- No crear vista SQL todavia.
- No modificar migraciones.
- No tocar `.env`, Auth/RLS ni Supabase remoto.

#### Resultado documental

BE-017 queda documentado como estrategia SQL conceptual. BE-028 implementa `vista_agenda_operativa` y BE-029 valida runtime local por rol.

## Pendientes futuros

### IMP-002 - Implementacion funcional hallazgo a trabajo

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Implementacion
**Origen:** BE-011
**Fecha creacion:** 2026-06-17
**Rama sugerida:** `feature/hallazgo-a-trabajo`
**Dependencias:** QA-002, UI-012, BE-011, CTRL-008, DEC-013, DEC-014, DEC-015, DEC-024, DEC-025, BE-024

#### Descripcion
IMP-002 queda como la siguiente implementacion funcional clinica relevante. Debe partir desde UI-012, QA-002, BE-011 y CTRL-008, respetando que `Evaluar trabajo` no crea trabajos automaticamente y que la creacion del trabajo requiere confirmacion manual del terapeuta.

No usar datos reales todavia. Antes de produccion debe cerrarse PROD-001.

#### Criterios de aceptacion preliminares
- Partir desde QA-002, UI-012 y BE-011.
- Usar `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal.
- No crear tabla puente `trabajo_hallazgos` en esta primera version.
- No crear trabajo automaticamente desde un hallazgo.
- No crear cobros, sesiones ni acciones automaticamente.
- Validar si ya existe trabajo asociado al hallazgo antes de crear uno nuevo.
- No promover multiples trabajos desde el mismo hallazgo como camino principal sin aprobacion clinica.
- No avanzar si BE-024 cambia la regla de hallazgo unico/multiple por aspecto.
- No tocar `.env`.
- No ejecutar `supabase db push`.
- No tocar Supabase remoto.
- No usar datos reales hasta cerrar PROD-001.

## Tareas sugeridas no activas

Este bloque se mantiene para futuras propuestas no activas.

Las propuestas anteriores de BE-003 fueron reemplazadas por tareas activas derivadas de la auditoria PROD-001 / SEC-001. No quedan tareas sugeridas no activas en este bloque.
