# Pendientes del proyecto

Fecha de apertura: `2026-06-11`
Ultima actualizacion: `2026-07-10`
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
| CTRL-012 | Cierre documental bloque QA/Finanzas. | Integrada | Alta | Control de desarrollo |
| CTRL-015 | Sincronizacion documental post PR #125/#126. | Integrada por este PR documental | Alta | Control de desarrollo |
| PEND-001 | Levantar inventario real del proyecto desde `main`. | Integrada | Alta | Control de desarrollo |
| PEND-002 | Clasificar pendientes por chat responsable. | Integrada | Alta | Control de desarrollo |
| QA-001 | Auditoria inicial del proyecto. | Integrada | Alta | Control de desarrollo |
| QA-002 | Validacion funcional de hallazgos operativos con caso demo. | Integrada | Alta | Control de desarrollo |
| QA-004 | Validacion funcional local de BE-016 / Finanzas. | Integrada | Alta | Control de desarrollo |
| QA-005 | Validacion funcional local UI-016 / Reportes por rol. | Integrada | Alta | Control de desarrollo |
| QA-006 | Base minima de pruebas por rol y no exposicion sensible. | QA-006F RLS/Storage local OK / PROD-001 pendiente | Alta | Control de desarrollo / QA |
| QA-006F | Validacion RLS/Storage local por rol. | Ejecutada local/demo | Alta | Control de desarrollo / QA |
| QA-007 | Checklist pre-migracion cloud. | Checklist documental / pendiente ejecucion futura | Alta | Control de desarrollo / QA |
| QA-008 | Validacion funcional completa de Agenda interna. | Cerrada post-merge local/demo | Alta | Control de Desarrollo / QA / UI-UX / Integracion Backend |
| QA-009 | Validacion visual UI-020/UI-021 ambiente. | Cerrada local/demo | Alta | Control de desarrollo / QA / UI-UX |
| QA-012 | Regresion visual y funcional de PacientesPage. | Pendiente / recomendada como siguiente paso | Alta | Control de desarrollo / QA / UI-UX |
| QA-013 | Revisar `startup_failure` de GitHub Actions CI. | Cerrada con CI remoto exitoso | Alta | Control de desarrollo / QA / DevOps |
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
| UI-010 | Redisenar navegacion del detalle de caso. | Integrada (PR #107) | Alta | UI / UX / Pulido visual |
| UI-011 | Disenar panel operativo de hallazgos dentro del detalle de revision. | Integrada | Alta | UI / UX / Pulido visual |
| UI-012 | Disenar flujo visual Evaluar trabajo. | Integrada | Alta | UI / UX / Pulido visual |
| UI-013 | Disenar experiencia de trabajos, sesiones y acciones. | Integrada (PR #108) | Alta | UI / UX / Pulido visual |
| UI-014 | Disenar agenda tipificada. | Pendiente | Media-alta | UI / UX / Pulido visual |
| UI-015 | Mejorar experiencia de finanzas por unidad cobrable. | Pendiente | Alta | UI / UX / Pulido visual |
| UI-016 | Mejorar reportes por rol. | Integrada | Media-alta | UI / UX / Pulido visual |
| UI-017 | Definir checklist responsive de pantallas clinicas. | Pendiente | Media | UI / UX / Pulido visual |
| UI-018 | Normalizar microcopy clinica y retirar textos tecnicos visibles. | Integrada (PR #107) | Media | UI / UX / Pulido visual |
| UI-019 | Definir patron comun de formularios clinicos largos. | Pendiente | Media-alta | UI / UX / Pulido visual |
| BE-011 | Disenar trazabilidad hallazgo a trabajo. | Integrada | Alta | Integracion Backend/Estructura |
| BE-012 | Disenar backend de Agenda tipificada. | Diseno documentado / pend. implementacion | Alta | Integracion Backend/Estructura |
| BE-013 | Ajustar reglas de cobros por unidad cobrable. | Integrada (PR #106) | Alta | Integracion Backend/Estructura |
| BE-014 | Crear vistas clinicas agregadas. | Integrada (PR #109) / RLS pendiente | Media-alta | Integracion Backend/Estructura |
| BE-015 | Validar RLS por roles para modulos nuevos. | Pendiente | Alta | Integracion Backend/Estructura |
| BE-016 | Disenar vista financiera por unidad cobrable. | Integrada | Media | Integracion Backend/Estructura |
| BE-017 | Definir estrategia SQL de agenda operativa. | Diseno documentado / pend. implementacion | Media | Integracion Backend/Estructura |
| SEC-001 | Validar RLS runtime por roles. | Integrada | Alta | Integracion Backend / Seguridad |
| SEC-002 | Crear matriz de permisos por tabla y rol. | Validada runtime / obs. | Alta | Integracion Backend / Seguridad |
| SEC-003 | Hardening Auth para produccion. | Integrada | Alta | Integracion Backend / Seguridad |
| SEC-004 | Definir alcance del rol Finanzas. | Validada runtime / obs. | Alta | Control de desarrollo / Integracion Backend |
| SEC-005 | Disenar bitacora/auditoria de cambios sensibles. | Integrada | Alta | Integracion Backend |
| SEC-006 | Politica de fotos, retencion y objetos huerfanos. | Politica documental / pendiente implementacion tecnica | Alta | Integracion Backend / Seguridad |
| SEC-007 | Procedimiento de scripts manuales locales/demo y prohibicion en produccion. | Procedimiento documental / pendiente ejecucion local autorizada | Alta | Integracion Backend / Seguridad |
| SEC-007B | Provisioning local/demo de usuarios de prueba. | Ejecutado local/demo / usado en QA-006B | Alta | Integracion Backend / Seguridad |
| SEC-008 | Implementacion controlada Hardening Auth. | Implementada parcial / pendiente PR | Alta | Integracion Backend / Seguridad |
| SEC-008B | Cierre de signup y provisioning Auth controlado. | Integrada | Alta | Integracion Backend / Seguridad |
| SEC-009 | Disenar seguridad de API publica. | Diseno documental / pendiente implementacion futura | Alta | Integracion Backend / Seguridad |
| SEC-010 | Disenar seguridad cloud, OAuth, IAM e identidades tecnicas. | Diseno documental / pendiente implementacion futura | Alta | Integracion Backend / Seguridad |
| SEC-011 | Disenar hardening tecnico de fotos y Storage. | Integrada | Alta | Integracion Backend / Seguridad |
| BE-018 | Separacion tecnica de ambientes. | Diseno documental / pendiente implementacion futura | Alta | Integracion Backend |
| BE-019 | Estrategia de backup/restauracion. | Diseno documental / pendiente implementacion futura | Alta | Integracion Backend / Produccion |
| BE-020 | Consentimiento informado y tratamiento de datos. | Diseno documental base / pendiente validacion clinica/legal | Alta | Control de desarrollo / Revision Clinica / Backend |
| BE-021 | Politica de anulacion vs eliminacion. | Diseno documental / Integrada (DELETE policies) | Media-alta | Control de desarrollo / Backend |
| BE-022 | Soporte de fotos para elementos del caso con Supabase Storage. | QA-003 local/demo con observacion | Alta | Integracion Backend/Estructura |
| BE-023 | Alias/codigo administrativo persistente para Finanzas. | Integrada | Alta | Integracion Backend/Estructura |
| BE-024 | Regla de hallazgo unico/multiple por aspecto revisado. | Integrada | Alta | Integracion Backend/Estructura |
| BE-025 | Campos financieros permitidos/prohibidos para Finanzas. | Integrada | Alta | Integracion Backend/Estructura |
| BE-026 | Disenar contrato de API publica de agendamiento. | Integrada | Alta | Integracion Backend/Estructura |
| BE-027 | Disenar integracion Google Calendar / Gmail / Workspace. | Integrada | Alta | Integracion Backend/Estructura |
| BE-028 | Implementar modelo DB de Agenda operativa. | Integrada por PR #41 | Alta | Integracion Backend/Estructura |
| BE-029 | Validar runtime local de Agenda operativa. | Integrada por PR #42 / validada local | Alta | Integracion Backend / Seguridad |
| BE-030 | Disenar arquitectura de plataforma Google Cloud. | Diseno documental / pendiente implementacion futura | Alta | Integracion Backend/Estructura |
| UI-020 | Indicador visual de ambiente activo. | Validada local/demo en Agenda desktop/mobile | Alta | UI / UX |
| UI-021 | Bloqueo visual de produccion no habilitada. | Validada local/demo | Alta | UI / UX |
| UI-022 | Integracion visual minima de fotos dentro de Elementos del caso. | QA-003 local/demo con observacion | Alta | UI / UX / Pulido visual |
| UI-023 | Navegacion y superficies filtradas por rol. | Integrada por PR #74 / validada post-merge | Alta | UI / UX |
| UI-024 | Recuperacion de cuenta, MFA y estados Auth no tecnicos. | Integrada (PR #105) / MFA pendiente | Alta | UI / UX / Integracion Backend |
| UI-025 | Integrar AgendaPage con modelo DB de Agenda operativa. | Integrada lectura por PR #44 | Alta | UI / UX / Integracion Backend |
| UI-025B | Alta y edicion controlada de Agenda operativa interna. | Integrada por PR #45 / QA-008 cerrada local/demo | Alta | UI / UX / Integracion Backend |
| UI-026 | Selector calendario/horario y duracion estandar de consulta en Agenda interna. | Integrada por PR #48 / QA-008 cerrada local/demo | Alta | UI / UX / Integracion Backend |
| UI-027 | Ajuste responsive de shell y Agenda interna. | Integrada por PR #50 / validada post-merge | Media-alta | UI / UX / Pulido visual |
| UI-028 | Reemplazar `as unknown as` por tipos generados de Supabase (25 ocurrencias en 13 archivos: paneles de caso, AgendaPage, ConsultasPage, EvaluacionesPage, FinanzasPage, ReportesPage, CasoDetallePage, useRevisionHallazgos). | Pendiente | Baja | UI / UX / Integracion Backend |
| UI-029 | Retirar o conectar campana de notificaciones del topbar (placeholder hardcodeado sin backend). | Integrada (placeholder retirado, App.tsx) | Baja | UI / UX |
| UI-030 | Extraer hook `useClinicalList` + componentes compartidos (`ClinicalMetrics`/`ClinicalList`/`ClinicalEmpty`) para RevisionesCasoPanel/TrabajosCasoPanel/PagosCasoPanel/ElementosCasoPanel, hoy con andamiaje duplicado. | Pendiente | Media | UI / UX / Integracion Backend |
| UI-031 | Consolidar `src/lib/queries.ts` (migrar paginas a `QUERY_COLUMNS` o eliminar el archivo, hoy sin consumidores reales fuera de su propio test). | Pendiente | Baja | Integracion Backend |
| UI-032 | Edicion y anulacion de pacientes ya registrados (hoy solo crear+listar; la matriz SEC-002 asume edicion que nunca se construyo). | Absorbida por UI-034 (DEC-043) | Alta | UI / UX / Integracion Backend |
| UI-033 | Edicion y anulacion de consultas, evaluaciones y casos (ninguna pagina clinica tiene UI de update/anulacion; policies UPDATE/DELETE ya activas en BD sin consumidor). | Pendiente | Alta | UI / UX / Integracion Backend |
| UI-034 | Redisenar PacientesPage como panel de trabajo diario: metricas arriba, barra de acciones (registro completo / nuevo / editar / anular), directorio del dia con citas de hoy desde agenda_eventos. Absorbe UI-032. | Integrada local/demo por PR #118 / validada visual con admin demo | Alta | UI / UX / Integracion Backend |
| UI-035 | ConsultasPage: vista del dia (consultas de hoy por defecto) + formulario de alta bajo demanda, replicando el patron DEC-043 de Pacientes. | Pendiente | Media-alta | UI / UX |
| UI-036 | EvaluacionesPage: exponer hora_evaluacion en formulario y tarjetas (columna NOT NULL en BD, hoy invisible: siempre guarda hora del servidor). | Pendiente | Baja | UI / UX |
| UI-037 | Migrar CasosPage y CasoDetallePage a TanStack Query + corregir bug de carga (si falla 1 de 4 consultas encadenadas se descarta todo el estado, incluidos datos ya cargados). | Pendiente | Alta | UI / UX / Integracion Backend |
| UI-038 | Verificar y activar el formulario de intervenciones (UI-013/PR #108) dentro del flujo real de CasoDetallePage post-merge de tabs (PR #107); ambos PRs tocaron TrabajosCasoPanel. | Pendiente | Media | UI / UX / QA |
| UI-039 | AgendaPage: anulacion/cancelacion de eventos desde UI (unica pagina con update pero sin flujo de anulacion; estados cancelado/anulado existen en el CHECK). | Pendiente | Media-alta | UI / UX |
| UI-040 | Finanzas: flujo de creacion de cobros y registro de pagos desde UI. Todo el modulo de pagos en BD (tablas, triggers, vistas, RLS) existe sin forma de recibir datos desde la app: la pagina solo lee. | Pendiente | Alta | UI / UX / Integracion Backend |
| UI-041 | Finanzas/Reportes: paginacion o agregacion server-side; PostgREST trunca en 1000 filas (max_rows en config.toml) en silencio y los KPIs calculados client-side saldrian incompletos. | Pendiente | Alta | Integracion Backend |
| UI-042 | ReportesPage: corregir guarda de pantalla de carga (cargando && !rolActivo deja de bloquear apenas se setea el rol y muestra estados vacios enganosos antes de que lleguen los datos). | Integrada local/demo por PR #123 | Media | UI / UX |
| UI-043 | ReportesPage: eliminar re-resolucion de rol (rolesValidos/esRolUsuario/obtenerRolActivo duplican AuthContext byte a byte y agregan 2 llamadas de red redundantes por carga). | Pendiente | Media | UI / UX |
| UI-044 | ErrorBoundary global por ruta: evita pantalla blanca ante errores de render. | Integrada por PR #124 / pendiente regresion QA-012 | Alta | UI / UX |
| BE-031 | Columna de terapeuta responsable en agenda_eventos (hoy solo created_by, que es auditoria, no responsabilidad clinica). Prerrequisito para filtrar "mis pacientes de hoy" en UI-034 con multiples terapeutas. Nivel 3: requiere DEC previa. | Pendiente | Media-alta | Integracion Backend |
| UI-045 | Formulario plano de edicion de pacientes: todos los campos visibles a la vez, sin pasos ni preview vivo (DEC-044: crear=guiado, editar=plano; validaciones compartidas con el wizard via hook comun). | Integrada en main por PR #125 / local-demo / pendiente QA-012 | Alta | UI / UX |
| UI-046 | Preview adaptativo en wizard de alta de pacientes: panel lateral en desktop, overlay/modal de confirmacion al guardar en tablet/mobile (DEC-045). | Integrada en main por PR #126 / local-demo / pendiente QA-012 | Alta | UI / UX |
| UI-047 | Normalizacion de queryKeys TanStack Query para pacientes y selectores. | Implementada en PR #129 / pendiente validacion remota | Alta | UI / UX / Integracion Backend |
| UI-048 | Compactar fila de indicadores superiores de PacientesPage manteniendo una sola linea desktop. | Pendiente recomendado | Media-alta | UI / UX / Pulido visual |
| UI-049 | Convertir la sidebar desktop en rail colapsable: iconos por defecto, expansion por hover/foco y fijado opcional, conservando drawer movil y navegacion por rol. | Pendiente recomendado | Media-alta | UI / UX / Pulido visual |
| UI-050 | Redisenar la barra superior como encabezado contextual compacto, sin franja vacia y preservando ambiente, usuario y acciones del modulo. | Pendiente recomendado | Media-alta | UI / UX / Pulido visual |
| DOC-001 | Manual de ambientes. | Documental / pendiente implementacion futura | Alta | Control de desarrollo |
| DOC-002 | Procedimiento de backup/restauracion. | Documental / pendiente prueba futura | Alta | Control de desarrollo / Integracion Backend |
| DOC-003 | Politica de carga de datos reales. | Documental / pendiente implementacion futura | Alta | Control de desarrollo |
| DOC-004 | Documentar flujo pagina publica -> API -> sistema interno -> Google. | Documental / pendiente implementacion futura | Alta | Control de desarrollo |
| DOC-005 | Documentar estrategia de migracion progresiva a Google Cloud. | Documental / pendiente validacion | Alta | Control de desarrollo |
| QA-003 | Validacion funcional local de fotos de elementos del caso. | Ejecutada local/demo con observacion | Alta | Control de desarrollo |
| IMP-002 | Implementacion funcional hallazgo a trabajo. | Integrada (PR #104) | Alta | Implementacion |
| PROD-001 | Preparacion para uso real con datos sensibles. | Mantener pendiente / bloqueante | Alta | Control de desarrollo / Integracion Backend |
| AUDIT-2026-07-04 | Revision integral de estructura y arquitectura; roadmap 5 bloques. | Aprobada por Javier (DEC-036 a DEC-039) | Alta | Control de desarrollo |
| BLOQUE-1-RLS | 3 migraciones RLS para DEC-038 en ramas fix/rls-*. | Mergeado a `main` (PR #85, #86, #87) | Alta | Integracion Backend / Seguridad |
| BLOQUE-2-UTIL | Extraccion de lib/format.ts, lib/queries.ts, lib/constants.ts para DEC-037. | Mergeado a `main` (PR #89), 12 de 14 paginas | Media | Integracion Backend/Estructura |
| BLOQUE-3-AUTH | POC AuthContext para DEC-036. | Mergeado a `main` (PR #88) | Media | Integracion Backend/Estructura |
| BLOQUE-4-TEST | Vitest + tests unitarios lib/format.ts + CI para DEC-039. | Mergeado a `main` (PR #91), 24 tests. Playwright E2E pendiente | Media | Control de desarrollo |

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

### CTRL-012 - Cierre documental bloque QA/Finanzas

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** QA-006D / QA-006E / BE-023 / BE-025
**Fecha creacion:** 2026-07-03
**Rama usada:** `ctrl-012-cierre-bloque-qa-finanzas`
**PR:** #80
**Informe:** `docs/control/auditorias/CTRL-012_CIERRE_BLOQUE_QA_FINANZAS.md`
**Dependencias:** QA-006, BE-023, BE-025, SEC-004, PROD-001

#### Descripcion
Cerrar documentalmente el bloque QA/Finanzas ya integrado y dejar una recomendacion unica para la siguiente fase.

#### Resultado
El bloque QA/Finanzas queda ordenado con QA-006D, QA-006E, BE-023 y BE-025 integrados en `main`.

La siguiente tarea recomendada queda como `QA-006F - Validacion RLS/Storage local por rol`, en bloque separado, sin remoto, sin `supabase db push`, sin migraciones nuevas y sin datos reales.

### CTRL-015 - Sincronizacion documental post PR #125/#126

**Estado:** Integrada por este PR documental
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Control de Desarrollo V3 / verificacion post-merge PR #125 y PR #126
**Fecha creacion:** 2026-07-10
**Rama usada:** `ctrl-015-sync-docs-post-pr-125-126`
**Informe:** `docs/control/auditorias/CTRL-015_SYNC_DOCUMENTAL_POST_PR_125_126.md`
**Dependencias:** UI-034, UI-045, UI-046, DEC-044, DEC-045, LOG-103, LOG-104, PROD-001

#### Descripcion
Sincronizar la documentacion de control despues de integrar PR #125 y PR #126 en `main`, retirando referencias temporales a draft, merge pendiente o dependencia de PR anterior para UI-045/UI-046.

#### Resultado
UI-045 queda registrada como integrada en `main` por PR #125 y UI-046 como integrada en `main` por PR #126. Se registra QA-012 como siguiente regresion visual/funcional recomendada para `PacientesPage`, UI-047 como pendiente recomendado para normalizar queryKeys TanStack Query relacionados con pacientes y selectores, UI-048 como ajuste visual recomendado para compactar la fila superior de indicadores, UI-049 para recuperar ancho util mediante una sidebar desktop colapsable y UI-050 para recuperar alto util mediante un encabezado contextual compacto.

No modifica codigo funcional, migraciones, Auth/RLS, `.env`, Supabase remoto, Google/Gemini, produccion ni datos reales.

### QA-006F - Validacion RLS/Storage local por rol

**Estado:** Ejecutada local/demo
**Prioridad:** Alta
**Responsable:** Control de desarrollo / QA
**Origen:** QA-006 / SEC-001 / SEC-002 / SEC-004 / BE-022 / UI-022 / PROD-001
**Fecha creacion:** 2026-07-04
**Rama usada:** `qa-006f-validacion-rls-storage`
**Informe:** `docs/control/auditorias/QA-006F_VALIDACION_RLS_STORAGE_ROLES.md`
**Dependencias:** QA-006D, QA-006E, SEC-001, SEC-002, SEC-004, BE-022, UI-022, PROD-001

#### Descripcion
Revalidar en Supabase local/demo que RLS y Storage mantienen la separacion por rol despues del bloque QA/Finanzas y Auth local/demo.

#### Resultado
La validacion runtime local confirma que `finanzas` no accede a pacientes, metadatos de fotos ni objetos Storage del bucket `elementos-caso`; `terapeuta` accede a clinica/fotos/Storage pero no a cobros/pagos directos; `admin` mantiene acceso transversal esperado.

No se modifico codigo, migraciones, Auth/RLS, `.env`, Supabase remoto ni datos reales.

SEC-006 queda como siguiente politica relacionada y se documenta en esta sincronizacion. La recomendacion vigente posterior es `QA-003 - Validacion funcional local de fotos`, con imagen ficticia.

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

**Estado:** Implementada local / pendiente revision visual autenticada
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

### QA-012 - Regresion visual y funcional de PacientesPage

**Estado:** Pendiente / recomendada como siguiente paso
**Prioridad:** Alta
**Responsable:** Control de desarrollo / QA / UI-UX
**Origen:** CTRL-015 / post-merge PR #118, #125 y #126
**Fecha creacion:** 2026-07-10
**Dependencias:** UI-034, UI-045, UI-046, UI-044, PROD-001

#### Descripcion
Ejecutar una regresion visual y funcional local/demo de `PacientesPage` despues de integrar el panel diario, la edicion plana y el preview adaptativo del wizard de alta.

#### Alcance minimo

- Panel diario de pacientes.
- Registro completo.
- Alta de paciente desktop.
- Alta de paciente tablet/mobile.
- Overlay de confirmacion mobile/tablet.
- Edicion plana.
- Guardar cambios.
- Cancelar edicion.
- Anular paciente.
- Reactivar paciente.
- Sin errores de consola.
- Sin pantalla blanca.
- Sin overflow horizontal.
- Densidad visual de indicadores superiores consistente y sin uso excesivo de alto.
- Sin regresion del wizard de alta.
- Sin regresion del formulario plano de edicion.

#### Restricciones

Solo local/demo con datos ficticios. No habilita produccion, datos reales, fotos reales, pagos reales, Supabase remoto, Google/Gemini ni cambios de esquema.

### QA-013 - Revisar `startup_failure` de GitHub Actions CI

**Estado:** Cerrada con CI remoto exitoso
**Prioridad:** Alta
**Responsable:** Control de desarrollo / QA / DevOps
**Origen:** CTRL-015 / revision GitHub Actions post PR #125/#126
**Fecha creacion:** 2026-07-10
**Fecha diagnostico:** 2026-07-10
**Fecha revalidacion:** 2026-07-11
**Fecha cierre:** 2026-07-11
**Rama usada:** `qa-013-recuperar-confiabilidad-ci`
**Informe:** `docs/control/auditorias/QA-013_DIAGNOSTICO_CONFIABILIDAD_GITHUB_ACTIONS.md`
**Dependencias:** BLOQUE-4-TEST, DEC-039, LOG-099
**Nivel documental:** Nivel 2

#### Descripcion
Investigar por que las corridas recientes de GitHub Actions aparecen con conclusion
`startup_failure`, incluyendo corridas sobre `main` posteriores a PR #125 y PR #126.

#### Criterios de aceptacion propuestos

- Identificar si el fallo corresponde a workflow, permisos, runner, evento, branch protection
  o configuracion de repositorio.
- Confirmar si afecta checks requeridos antes de merge.
- Mantener separada cualquier correccion de workflow en una rama propia.
- No mezclar con QA-012, UI-047, UI-048, UI-049, UI-050 ni features funcionales.

#### Diagnostico

- Las 192 ejecuciones existentes desde la creacion del workflow terminaron como
  `startup_failure`: 95 por `push` y 97 por `pull_request`.
- Cada ejecucion fallo antes de crear jobs y no genero logs.
- Antes del cambio de visibilidad, el workflow `CI` (`id=308145174`) tenia 0 runs y las 198
  ejecuciones acumuladas quedaron asociadas a la identidad eliminada `BuildFailed`
  (`id=308144935`).
- Actions esta habilitado y permite todas las acciones. El YAML vigente pasa
  `actionlint 1.7.12`; `npm ci`, lint, 24 tests y build pasan localmente.
- Tras hacer publico el repositorio, el commit `63297ab` genero el primer run de la identidad
  nueva: `29138928820`, workflow `CI` (`id=311082990`) y check `Quality gate`.
- El check creo un job, pero quedo sin runner y sin steps. Su anotacion exacta informa:
  `The job was not started because your account is locked due to a billing issue.`
- La causa queda clasificada como **E: problema de cuenta/facturacion**. Actions permanece
  habilitado; no corresponde seguir modificando YAML por ensayo y error.
- Sin nuevos cambios de workflow, el run posterior `29139105668` asigno runner y completo
  checkout, Node, `npm ci`, lint, 24 tests y build. `Quality gate` termino exitoso en 29 s.
- Branch protection ya es configurable por la visibilidad publica, pero `main` sigue sin
  proteccion porque QA-013 prohibe activarla automaticamente.

#### Correccion aplicada

Se reemplaza `.github/workflows/ci.yml` por `.github/workflows/ci-quality.yml` para forzar una
identidad limpia del workflow. Se conservan Node 20, `npm ci`, lint, tests y build, y se
agregan permisos `contents: read`, cache npm, timeout, concurrencia y nombres estables.

#### Resultado
La correccion versionada pasa todas las validaciones locales. Publicar el repositorio permitio
registrar `CI / Quality gate`; el primer run expuso un bloqueo de facturacion y el siguiente,
`29139105668`, completo todos los steps en 29 s. QA-013 queda cerrada con CI remoto exitoso.
Branch protection permanece pendiente de aplicacion manual y no bloquea este cierre.

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

**Estado:** Validada local/demo en Agenda desktop/mobile
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

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-08
**Rama usada:** `codex/implementacion-bloque-seguridad-cobros`
**Informe:** `docs/control/auditorias/SEC-005_AUDITORIA_CAMBIOS_SENSIBLES.md`

#### Descripcion
Implementar una bitacora de auditoria para cambios sensibles en datos clinicos, financieros y de acceso.

#### Resultado
Implementada localmente mediante la migración `20260708000002_sec_005_implementacion_auditoria_sensible.sql`. Se creó la tabla `public.logs_auditoria_sensible` con RLS restringido a Administradores (bloqueando modificaciones y eliminaciones físicas), una función enmascaradora `public.minimizar_datos_auditoria(datos jsonb)` para anonimizar datos PII y observaciones clínicas libres, y un trigger disparador genérico asociado a 13 tablas operativas y administrativas.

### SEC-006 - Politica de fotos, retencion y objetos huerfanos

**Estado:** Politica documental / pendiente implementacion tecnica
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** CTRL-008 / DEC-028 / SEC-001
**Fecha creacion:** 2026-06-29
**Fecha documentacion:** 2026-07-04
**Rama usada:** `sec-006-politica-fotos-retencion`
**Informe:** `docs/control/auditorias/SEC-006_POLITICA_FOTOS_RETENCION_OBJETOS_HUERFANOS.md`
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

#### Resultado

SEC-006 define politica documental para fotos de elementos del caso: roles permitidos, estados logicos, retencion, objetos huerfanos, auditoria minima, datos prohibidos en logs y criterios obligatorios antes de fotos reales.

No implementa migraciones, RLS/Auth, Storage, codigo, `.env`, Supabase remoto ni produccion. La siguiente tarea recomendada es `QA-003` con imagen ficticia local o hardening tecnico de grants en tarea separada.

### SEC-007 - Procedimiento de scripts manuales locales/demo y prohibicion en produccion

**Estado:** Procedimiento documental / pendiente ejecucion local autorizada
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** CTRL-008 / DEC-029 / SEC-003
**Fecha creacion:** 2026-06-29
**Fecha documentacion:** 2026-07-03
**Rama usada:** `sec-007-procedimiento-usuarios-demo-local`
**Informe:** `docs/control/auditorias/SEC-007_PROCEDIMIENTO_USUARIOS_DEMO_LOCAL.md`
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

#### Resultado documental

SEC-007 define el procedimiento local/demo para preparar usuarios de prueba sin versionar secretos, sin crear cuentas en esta tarea y sin tocar produccion. La ejecucion tecnica queda pendiente de autorizacion explicita en una tarea separada.

### SEC-007B - Provisioning local/demo de usuarios de prueba

**Estado:** Ejecutado local/demo / usado en QA-006B
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** SEC-007 / DEC-029 / DEC-032 / QA-006B
**Fecha creacion:** 2026-07-03
**Rama usada:** `sec-007b-provisioning-demo-local`
**Informe:** `docs/control/auditorias/SEC-007B_PROVISIONING_USUARIOS_DEMO_LOCAL.md`
**Dependencias:** SEC-007, SEC-003, SEC-008, QA-006B, PROD-001

#### Descripcion

Preparar usuarios Auth ficticios local/demo para completar validacion autenticada multirol sin versionar credenciales, sin modificar `.env`, sin Supabase remoto y sin produccion.

#### Criterios de aceptacion

- Script local-only e idempotente.
- Rechazo automatico de URLs no locales.
- Password y service role recibidos solo por variables temporales.
- Usuarios demo para `admin`, `terapeuta`, `finanzas`, usuario inactivo y usuario sin perfil.
- Registro de evidencia sin passwords, tokens ni service role keys.
- Sin cambios de migraciones ni RLS.

#### Resultado esperado

SEC-007B deja desbloqueada la siguiente fase `QA-006B - Validacion visual autenticada de navegacion por rol`.

#### Resultado local

Se ejecuto provisioning local/demo para las identidades `QA-DEMO-ADMIN`, `QA-DEMO-TERAPEUTA`, `QA-DEMO-FINANZAS`, `QA-DEMO-INACTIVO` y `QA-DEMO-SIN-PERFIL`.

Las credenciales quedaron fuera de Git en archivo local ignorado y no se registran en documentacion, PRs ni bitacora.

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

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** SEC-008 / SEC-003 / DEC-032
**Fecha creacion:** 2026-06-30
**Dependencias:** SEC-008, SEC-005, SEC-007, BE-018, DOC-001, QA-006, PROD-001

#### Descripcion
Sincronizar localmente la migración y provisioning de Auth controlado para evitar accesos no autorizados.

#### Resultado
Sincronizada localmente mediante la migración `20260708000000_sec_008b_cierre_signup_y_provisioning_controlado.sql` (que configura el trigger automático `on_auth_user_created` y la función transaccional `handle_new_auth_user`) y la adaptación del script local `scripts/provision-demo-users.mjs` para inyectar correctamente `rol` y `activo` en los metadatos de usuario Auth.

### SEC-009 - Disenar seguridad de API publica

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** API-001 / DEC-033 / PROD-001
**Fecha creacion:** 2026-06-30
**Fecha diseno:** 2026-07-02
**Rama usada:** `sec-009-diseno-seguridad-api-publica`
**Informe:** `docs/control/auditorias/SEC-009_SEGURIDAD_API_PUBLICA.md`
**Dependencias:** API-001, BE-012, BE-017, BE-018, BE-020, SEC-005, SEC-008, SEC-008B, DOC-001, DOC-003, QA-006, PROD-001

#### Descripcion
Definir el modelo de seguridad para la futura API publica que conectara la pagina publica con Agenda, consentimiento, sistema interno y Google Workspace.

SEC-009 deja documentados los controles minimos para una implementacion futura: separacion de superficies publica/interna/servicio, CORS estricto por ambiente, rate limit, anti-spam, CAPTCHA o mecanismo equivalente, validacion, sanitizacion, minimizacion de datos, idempotencia, errores neutros, logs y auditoria.

#### Criterios de aceptacion
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

#### Restricciones

SEC-009 no crea endpoints, no instala dependencias, no modifica codigo, no modifica migraciones, no ejecuta SQL, no toca `.env`, no toca Supabase remoto, no integra Google y no habilita produccion ni datos reales.

#### Observaciones
SEC-009 debe cerrarse antes de implementar cualquier endpoint publico operativo. No habilita produccion ni datos reales. La implementacion futura debe esperar BE-020, SEC-005, BE-018, DOC-001, DOC-003, SEC-010 y PROD-001.

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

**Estado:** Diseno documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Integracion Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `be-018-doc001-doc003-ambientes-datos-reales`
**Informe:** `docs/control/auditorias/BE-018_SEPARACION_TECNICA_AMBIENTES.md`

#### Descripcion
Definir separacion tecnica entre local, demo, staging y produccion, evitando mezcla de configuraciones y datos.

BE-018 define ambientes local, demo, staging y produccion, reglas de separacion, barreras minimas, manejo de variables de entorno sin secretos y criterios para habilitar staging/produccion.

#### Criterios de aceptacion
- Documentar ambientes requeridos y proposito de cada uno.
- Definir variables de ambiente por contexto.
- Identificar barreras para evitar uso de seeds demo en produccion.
- Definir criterio de habilitacion de staging y produccion.
- No tocar `.env` ni Supabase remoto sin autorizacion expresa.

#### Observaciones

BE-018 no crea ambientes, no modifica `.env`, no toca Supabase remoto, no crea credenciales y no habilita datos reales ni produccion.

### BE-019 - Estrategia de backup/restauracion

**Estado:** Diseno documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Integracion Backend / Produccion
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `be-019-doc002-backup-restauracion`
**Informe:** `docs/control/auditorias/BE-019_ESTRATEGIA_BACKUP_RESTAURACION.md`

#### Descripcion
Definir estrategia de respaldo y restauracion antes de operar con datos reales.

BE-019 define alcance, ambientes, frecuencia futura, responsabilidades, seguridad y criterios antes de produccion para backup/restauracion.

#### Criterios de aceptacion
- Definir frecuencia, responsable y alcance de backups.
- Definir procedimiento de restauracion.
- Probar restauracion antes de produccion.
- Documentar resultado de prueba de restauracion.
- No tocar Supabase remoto sin autorizacion expresa.

#### Observaciones

BE-019 no ejecuta backups, no restaura bases, no toca Supabase remoto, no modifica `.env` y no habilita datos reales ni produccion.

### BE-020 - Consentimiento informado y tratamiento de datos

**Estado:** Diseno documental base / pendiente validacion clinica/legal
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Revision Clinica / Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `be-020-consentimiento-tratamiento-datos`
**Informe:** `docs/control/auditorias/BE-020_CONSENTIMIENTO_TRATAMIENTO_DATOS.md`

#### Descripcion
Definir el consentimiento informado o autorizacion de tratamiento de datos requerida antes de registrar pacientes reales.

BE-020 define la base operativa para finalidades de tratamiento, datos permitidos/prohibidos, evidencia de aceptacion, estados conceptuales y restricciones por contexto. No reemplaza validacion clinica ni legal.

#### Criterios de aceptacion
- Definir texto o referencia del consentimiento informado.
- Validar alcance con Revision Clinica.
- Definir donde se registra la aceptacion o autorizacion.
- Revisar implicancias de privacidad y confidencialidad.
- No cargar datos reales antes de aprobacion explicita.

#### Observaciones

SEC-004 deja nombre completo, telefono y email prohibidos por defecto para Finanzas. BE-020 define que su exposicion requiere aprobacion expresa de Control y consentimiento/autorizacion suficiente.

BE-020 no implementa formularios, endpoints, migraciones, almacenamiento tecnico, firma electronica, `.env`, Supabase remoto, Google ni produccion. PROD-001 sigue bloqueante.

### BE-021 - Politica de anulacion vs eliminacion

**Estado:** Diseno documental / pendiente implementacion futura
**Prioridad:** Media-alta
**Responsable:** Control de desarrollo / Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `be-021-politica-anulacion-eliminacion`
**Informe:** `docs/control/auditorias/BE-021_POLITICA_ANULACION_ELIMINACION.md`

#### Descripcion
Definir cuando corresponde anular, corregir o eliminar informacion clinica, financiera o administrativa.

BE-021 define la politica transversal para correccion, anulacion logica y eliminacion fisica excepcional, con reglas por area funcional y dependencia de auditoria SEC-005.

#### Criterios de aceptacion
- Separar anulacion operativa de eliminacion fisica.
- Definir criterios por tipo de dato sensible.
- Considerar trazabilidad y auditoria de cambios.
- Documentar casos permitidos y prohibidos.
- No modificar base de datos ni datos existentes.

#### Observaciones

BE-021 debe definir la politica transversal de anulacion logica vs delete fisico, considerando que SEC-002 recomienda prohibir delete fisico clinico/financiero en produccion.

SEC-004 agrega que cobros y pagos deben operar con anulacion logica y que el delete fisico financiero debe quedar prohibido en produccion para mantener trazabilidad.

BE-021 no implementa columnas, estados, triggers, policies, migraciones, codigo, `.env`, Supabase remoto ni produccion. PROD-001 sigue bloqueante.

### UI-020 - Indicador visual de ambiente activo

**Estado:** Validada local/demo en Agenda desktop/mobile
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `ui-020-ui021-diseno-ambiente-produccion`
**Informe:** `docs/control/auditorias/UI-020_INDICADOR_AMBIENTE_ACTIVO.md`
**Rama implementacion:** `ui-020-ui021-implementacion-ambiente-produccion`
**Informe implementacion:** `docs/control/auditorias/UI-020_UI-021_IMPLEMENTACION_AMBIENTE_PRODUCCION.md`
**Informe QA:** `docs/control/auditorias/QA-009_VALIDACION_UI020_UI021_AMBIENTE.md`

#### Descripcion
Disenar un indicador visible del ambiente activo para reducir el riesgo de operar en el contexto equivocado.

UI-020 define estados visuales para LOCAL, DEMO, STAGING, PRODUCCION y ambiente desconocido. El indicador debe ser persistente, responsive, accesible, no depender solo del color y no exponer secretos ni identificadores tecnicos sensibles.

#### Criterios de aceptacion
- Definir estados visuales para local, demo, staging y produccion.
- Evitar que el indicador tape informacion clinica.
- Considerar version mobile y desktop.
- Documentar comportamiento esperado antes de implementar.
- No modificar codigo fuente ni CSS en esta tarea documental.
- Tratar ambiente desconocido como estado conservador.
- No exponer claves, project ids, URLs privadas ni service role.
- Mantener PROD-001 como bloqueo para produccion real.

#### Observaciones

La implementacion local agrega indicador en `DashboardShell`. QA-009 confirma indicador `LOCAL - datos ficticios` visible en `/agenda` con sesion autenticada local `Administrador Local`, sin overflow horizontal en ancho mobile equivalente de 375 px ni en desktop de 1265 px. No modifica `.env`, migraciones, Supabase remoto ni produccion.

### UI-021 - Bloqueo visual de produccion no habilitada

**Estado:** Validada local/demo
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `ui-020-ui021-diseno-ambiente-produccion`
**Informe:** `docs/control/auditorias/UI-021_BLOQUEO_PRODUCCION_NO_HABILITADA.md`
**Rama implementacion:** `ui-020-ui021-implementacion-ambiente-produccion`
**Informe implementacion:** `docs/control/auditorias/UI-020_UI-021_IMPLEMENTACION_AMBIENTE_PRODUCCION.md`
**Informe QA:** `docs/control/auditorias/QA-009_VALIDACION_UI020_UI021_AMBIENTE.md`

#### Descripcion
Disenar una advertencia o bloqueo visual para impedir uso productivo cuando PROD-001 siga abierto.

UI-021 define que produccion no habilitada, produccion sin aprobacion explicita o ambiente desconocido deben bloquear rutas internas sensibles. LOCAL/DEMO quedan permitidos solo para datos ficticios con indicador UI-020.

#### Criterios de aceptacion
- Definir mensaje de produccion no habilitada.
- Definir condiciones para mostrar advertencia o bloqueo.
- Considerar rutas clinicas, financieras y administrativas.
- Asegurar que no se confunda demo con produccion.
- No modificar codigo fuente ni CSS en esta tarea documental.
- No ofrecer bypass operativo mientras PROD-001 siga abierto.
- No reemplazar controles backend, Auth, RLS, Storage ni separacion real de ambientes.
- Validar mobile y desktop cuando se implemente.

#### Observaciones

UI-021 queda implementada localmente como barrera visual en `DashboardShell`. QA-009 valida el bloqueo `PRODUCCION NO HABILITADA` en `5173` usando variables temporales de proceso para simular produccion no habilitada, sin modificar `.env`. Tambien valida la accion `Cerrar sesion`, que redirige a `/login`. No habilita produccion ni sustituye controles server-side. Mantiene fuera `.env`, Supabase remoto, migraciones, API publica, Google, datos reales, fotos reales y pagos reales.

### UI-032 - Edicion y anulacion de pacientes ya registrados

**Estado:** Absorbida por UI-034 (DEC-043) — se entrega como parte del rediseno del panel diario
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** Comprobacion visual 2026-07-09 (Javier) / SEC-002 / BE-021
**Fecha creacion:** 2026-07-09
**Dependencias:** BE-021 (politica de anulacion), SEC-002 (matriz de permisos), PR #113 (GRANT DELETE ya activo)

#### Descripcion

`PacientesPage` solo permite crear y listar: no existe ninguna via en la UI para corregir un
dato mal ingresado (typo en nombre, telefono desactualizado) ni para anular/desactivar un
paciente. La matriz de permisos SEC-002 declara que admin/terapeuta pueden "crear y editar
pacientes" — asume una edicion que nunca se construyo, y ninguna tarea UI-xxx previa la cubrio.
La BD ya esta lista: policies UPDATE existen desde 20260606055000 y el DELETE (gated a
`es_admin()` + `estado='inactivo'`) quedo activo con PR #113, pero ningun formulario los consume.

#### Criterios de aceptacion preliminares

- Editar los campos de la ficha del paciente reutilizando el wizard/validaciones existentes.
- Anulacion logica via `estado='inactivo'` (coherente con BE-021), nunca delete fisico desde UI
  de terapeuta; el delete fisico queda solo admin y solo sobre pacientes ya inactivos.
- Respetar la politica de duplicados y la sincronizacion de cache TanStack Query (`invalidateQueries`).
- No tocar Supabase remoto ni datos reales; validar solo con datos sinteticos locales.

### UI-033 - Edicion y anulacion de consultas, evaluaciones y casos

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** Comprobacion visual 2026-07-09 (Javier) / BE-021
**Fecha creacion:** 2026-07-09
**Dependencias:** BE-021, UI-032 (mismo patron de edicion, conviene resolverlo primero en pacientes)

#### Descripcion

Mismo hueco que UI-032 pero en el resto del modulo clinico: `ConsultasPage`,
`EvaluacionesPage` y `CasosPage` solo crean y listan. Ninguna pagina clinica tiene UI de
update — el unico `.update()` de todo `src/` esta en `AgendaPage` (2 usos). Los estados de
anulacion ya existen en los CHECK constraints (`Cancelada`, `Anulada`, `Anulado`) y las
policies UPDATE/DELETE estan activas en BD, pero desde la UI no hay forma de cambiar el estado
de un registro ya creado ni de corregir un error de ingreso.

#### Criterios de aceptacion preliminares

- Edicion de campos y cambio de estado (incluyendo anulacion logica) por registro, con los
  valores exactos de los CHECK constraints reales (leccion de PR #104/#108: valores inventados
  en el front fallan silenciosamente contra la BD).
- Confirmacion explicita antes de anular; sin delete fisico desde UI de terapeuta.
- `invalidateQueries` tras cada mutacion en las paginas ya migradas a TanStack Query.
- Definir con Control si la edicion de una consulta `Realizada` debe quedar restringida
  (trazabilidad clinica) antes de implementar.

### UI-034 - Redisenar PacientesPage como panel de trabajo diario

**Estado:** Integrada local/demo por PR #118 (2026-07-09), validada visual con admin demo: panel del dia, edicion, anulacion/reactivacion y metricas verificadas contra BD
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** Instruccion directa de Javier, comprobacion visual 2026-07-09 / DEC-043
**Fecha creacion:** 2026-07-09
**Rama prevista:** `feature/ui-034-panel-diario-pacientes`
**Dependencias:** DEC-043, BE-021, UI-032 (absorbida), agenda_eventos (BE-028)

#### Descripcion

La vista por defecto de PacientesPage pasa a ser el panel del dia: solo pacientes con cita
agendada HOY via `agenda_eventos`. Layout de arriba a abajo: (1) metricas superiores
(pacientes activos totales, citas de hoy, atendidas hoy, pendientes de hoy); (2) barra de
acciones con Registro completo / Nuevo paciente (wizard existente bajo demanda) / Editar /
Anular; (3) directorio del dia con hora y estado del evento por tarjeta.

#### Criterios de aceptacion preliminares

- Consulta del dia: `agenda_eventos.fecha_inicio` = hoy (fecha local Chile, patron
  `T00:00:00`), estados `programado`/`confirmado`/`reagendado`; `completado` suma a la
  metrica "atendidas hoy"; `cancelado` y `no_asistio` quedan fuera. Un paciente con 2+ citas
  hoy = una tarjeta por cita.
- Registro completo disponible como vista secundaria (el directorio actual no se pierde).
- Edicion reutiliza el wizard/validaciones existentes; anulacion logica `estado='inactivo'`
  (BE-021), delete fisico solo admin sobre inactivos, nunca desde el flujo de terapeuta.
- `invalidateQueries` tras cada mutacion (pagina ya migrada a TanStack Query).
- Empty state explicito cuando no hay citas hoy, con acceso al registro completo.
- Sin cambios de esquema; sin Supabase remoto; validacion con demo SEC-007B + seed local.

### UI-035 a UI-044 y BE-031 - Brechas funcionales detectadas en comprobacion visual 2026-07-09

**Origen comun:** comprobacion visual pagina por pagina (Javier + sesion Claude, 2026-07-09)
cruzada con FASE1-BARRIDO-2026-07-08.md. Criterio: capacidades ausentes verificadas contra
codigo real, no estilo. Cada una se detalla al tomarse; aqui queda el contexto minimo
suficiente para no perder el hallazgo.

#### UI-035 - Vista del dia en Consultas (Media-alta)
`ConsultasPage` muestra todo el historico y el formulario de alta fijo en pantalla. Replicar
patron DEC-043: consultas de hoy por defecto, alta bajo demanda. Depende de que UI-034 valide
el patron primero. Sin cambios de esquema (`fecha_consulta` ya existe).

#### UI-036 - hora_evaluacion invisible (Baja)
`evaluaciones.hora_evaluacion` es NOT NULL con default `localtime` (migracion
20260605213000:13): siempre guarda la hora del servidor al insertar, el formulario no la pide
y ninguna tarjeta la muestra. Decidir: agregarla al formulario (como hora_inicio/termino de
Consultas) o documentarla como dato puramente tecnico.

#### UI-037 - CasosPage/CasoDetallePage sin TanStack Query + bug de carga (Alta)
Unicas paginas de datos sin migrar (junto a Reportes). Bug real en `cargarBaseCasos`
(CasosPage:433-483): 4 consultas encadenadas con los `set*` diferidos al final — si falla solo
la ultima, se descarta TODO (pacientes ya cargados incluidos), select de paciente queda vacio
y el boton Guardar deshabilitado sin explicacion. Migrar a queries independientes +
`invalidateQueries` como Evaluaciones/Consultas. Ademas: chequeo de duplicados solo en memoria
del cliente (sin constraint UNIQUE en BD, riesgo de carrera con 2 usuarios).

#### UI-038 - Verificar formulario de intervenciones post-merge (Media)
PR #107 (tabs) y PR #108 (formulario UI-013) tocaron ambos `TrabajosCasoPanel.tsx` y se
mergearon el mismo dia. QA pendiente: confirmar en la app que el formulario "Nueva
intervencion" quedo activo y funcional dentro del tab Intervenciones del detalle de caso,
con un insert real contra la BD local (los CHECK constraints ya se corrigieron en #108).

#### UI-039 - Anulacion de eventos de Agenda (Media-alta)
AgendaPage es la unica pagina con update, pero no expone cancelar/anular eventos. Los estados
`cancelado`/`anulado` existen en el CHECK de `agenda_eventos.estado_evento` y la policy UPDATE
ya lo permite. Relevante ademas porque el panel del dia de UI-034 excluye cancelados: sin esta
UI no hay forma de sacar una cita del dia.

#### UI-040 - Creacion de cobros y registro de pagos (Alta)
El modulo financiero completo en BD (tablas cobros/pagos, triggers de estado, vistas, RLS
finanzas) existe desde 20260606052000 pero **ninguna UI escribe en el**: FinanzasPage solo
lee `vista_finanzas_unidades_cobrables`. Sin este flujo, todo el modulo de pagos es
infraestructura muerta y las metricas financieras siempre estaran vacias. Definir con Control
el flujo (desde el caso via PagosCasoPanel, desde Finanzas, o ambos) y los campos permitidos
por rol segun BE-025 (ya integrado).

#### UI-041 - Truncamiento silencioso a 1000 filas (Alta)
`max_rows = 1000` en config.toml (PostgREST) trunca sin error. FinanzasPage y ReportesPage
calculan KPIs client-side sobre el array recibido: con 1000+ filas los totales financieros
saldrian incompletos sin aviso. Opciones: paginacion `.range()`, `{count:'exact'}` con aviso
"mostrando N de M", o mover agregados a SQL/RPC (preferido para KPIs).

#### UI-042 - Pantalla de carga de Reportes rota (Media)
ReportesPage:818 usa `if (cargando && !rolActivo)`: `setRolActivo` corre antes que las cargas
de datos, la guarda deja de bloquear y se renderizan "Sin actividad para mostrar"/"Sin pagos
registrados" enganosos mientras los datos reales siguen en vuelo. Fix minimo: `if (cargando)`.
Fix real: migrar a TanStack Query (junto con UI-037).

#### UI-043 - Reportes re-resuelve el rol (Media)
ReportesPage:118/156-158/224-248 duplican byte a byte `rolesValidos`/`esRolUsuario` de
AuthContext y `obtenerRolActivo()` repite `auth.getUser()` + query a `usuarios_internos` que
AuthContext ya resolvio — 2 llamadas de red redundantes por carga, y probable causa del hack
`setTimeout(...,0)`. Usar `useAuth().usuarioInterno.rol` directo.

#### UI-044 - ErrorBoundary global (Alta)
Cubierta por PR #124. La app ya cuenta con ErrorBoundary global para evitar pantalla blanca
ante errores de render y mostrar una pantalla de recuperacion. El riesgo funcional de fondo
detectado durante FASE1, la normalizacion de queryKeys TanStack Query relacionadas con
pacientes y selectores, queda separado como UI-047 para no mezclarlo con esta sincronizacion.

#### BE-031 - Terapeuta responsable en agenda_eventos (Media-alta, Nivel 3)
`agenda_eventos` no tiene columna de profesional responsable; `created_by` es auditoria
(quien registro), no responsabilidad clinica. Sin ella: el panel del dia de UI-034 no puede
filtrar "MIS pacientes de hoy" con 2+ terapeutas, y el detector de huecos/sobrecarga
(agenda-resumen-semanal, DEC-041) agrupa por `created_by` como proxy documentado. Cambio de
esquema + RLS: **Nivel 3, requiere DEC-0xx aprobada antes de implementar** (patron DEC-041/042).

**Ya cubiertos por tareas existentes, no se duplican:** edicion/anulacion de consultas/
evaluaciones/casos = UI-033; gate clinico del detalle de caso = UI-010 (decision de producto
pendiente); MFA = UI-024; casts `as unknown as` = UI-028; queryKeys de pacientes/selectores =
UI-047.

### UI-045 - Formulario plano de edicion de pacientes

**Estado:** Integrada en main por PR #125 / local-demo / pendiente QA-012
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** Observacion de Javier sobre UI-034 en uso / DEC-044
**Fecha creacion:** 2026-07-09
**Fecha implementacion:** 2026-07-10
**Rama:** feature/ui-045-edicion-plana-pacientes
**PR:** #125
**LOG:** LOG-103
**Dependencias:** UI-034 (integrada), DEC-044

#### Descripcion

La edicion abierta desde UI-034 reutilizaba el wizard de alta por secciones. DEC-044 la
reemplaza por formulario plano: 10 campos (nombres, apellidos, fecha nacimiento, sexo,
telefono, email, comuna, region, estado) visibles y editables simultaneamente, grid 2
columnas desktop / 1 mobile, Guardar/Cancelar fijos sin scroll, SIN preview vivo. Alta
sigue con wizard intacto.

#### Criterios de aceptacion

- Extraer validaciones/estado a hook compartido con el wizard (anti-duplicados excluyendo
  al propio paciente incluido) — cero duplicacion de logica de validacion. **OK**
- Sin preview en edicion; el preview del alta no se toca. **OK**
- invalidateQueries y anulacion/reactivar sin cambios. **OK**
- Criterio DEC-044 (crear=guiado, editar=plano) queda como patron para UI-033. **Documentado**
- Validacion de regresion visual/funcional post-merge. **Pendiente QA-012**

#### Resultado

Integrado en `main` por PR #125 (merge 2026-07-10 21:20:30 UTC). Implementado originalmente
en rama `feature/ui-045-edicion-plana-pacientes` (LOG-103). Validado en BD local
(updated_at 2026-07-10 21:07:08 UTC). Wizard de alta intacto con stepper y preview.
tsc/lint/test/build limpios en la implementacion. Queda recomendada QA-012 para regresion
visual y funcional post-merge.

### UI-046 - Preview adaptativo en wizard de alta de pacientes

**Estado:** Integrada en main por PR #126 / local-demo / pendiente QA-012
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** Instrucción de Javier / DEC-045
**Fecha creacion:** 2026-07-10
**Fecha implementacion:** 2026-07-10
**Rama:** feature/ui-046-preview-adaptativo-wizard
**PR:** #126
**LOG:** LOG-104
**Dependencias:** UI-045 (integrada por PR #125), DEC-045

#### Descripcion

El wizard de nuevo paciente (`vista === 'nuevo'`) adaptará la visualización del preview y la confirmación según el tamaño de la pantalla:
- En pantallas de escritorio (`≥ 1025px`), el panel lateral de "Preview vivo" se mantiene visible en tiempo real (comportamiento actual).
- En pantallas de tabletas y teléfonos (`≤ 1024px`), el panel lateral de preview se oculta. Al presionar el botón de guardar (que se renombra a "Revisar y guardar"), se despliega una ventana de confirmación fullscreen con el resumen del nuevo paciente.
- La ventana de confirmación presenta dos acciones claras: "Confirmar y guardar" (envía el formulario a Supabase) y "Volver a editar" (cierra la ventana y permite seguir editando).

#### Criterios de aceptacion

- Breakpoint de ocultación responsiva del preview lateral en `1024px`. **OK**
- Botones adaptativos ("Guardar paciente" en desktop vs "Revisar y guardar" en tablet/mobile). **OK**
- Ventana de confirmación (overlay fullscreen con scroll y centrado) en móviles/tablets con el resumen completo de datos ingresados y acciones correspondientes. **OK**
- Envío correcto del formulario (persistencia en base de datos) al confirmar en el modal móvil. **OK**
- Validación visual en entorno demo local. **OK**

#### Resultado

Integrado en `main` por PR #126 (merge 2026-07-10 21:34:12 UTC). Implementado originalmente
en rama `feature/ui-046-preview-adaptativo-wizard` (LOG-104). Validado localmente con
compilacion, lint, tests y build limpios en la implementacion. Queda recomendada QA-012 para
regresion visual y funcional post-merge.

### UI-047 - Normalizacion de queryKeys TanStack Query para pacientes y selectores

**Estado:** Implementada en PR #129 / pendiente validacion remota
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** CTRL-015 / riesgo funcional detectado en FASE1 y revisado post PR #125/#126
**Fecha creacion:** 2026-07-10
**Fecha ejecucion:** 2026-07-11
**Rama usada:** `ui-047-normalizar-querykeys-pacientes`
**PR:** #129
**Dependencias:** UI-044, UI-045, UI-046, QA-012
**Nivel documental:** Nivel 2

#### Descripcion
Normalizar las queryKeys de TanStack Query usadas para pacientes y selectores derivados para
evitar colisiones de cache entre paginas que consumen la misma entidad con usos distintos.
La revision post PR #125/#126 confirma que `ConsultasPage`, `EvaluacionesPage` y
`PacientesPage` aun usan `queryKey: ['pacientes']`.

#### Criterios de aceptacion propuestos

- Definir nombres de queryKey estables y especificos por superficie o selector.
- Evitar romper invalidateQueries existentes en `PacientesPage`.
- Incluir prueba o verificacion visual de navegacion entre Pacientes, Consultas y Evaluaciones.
- No mezclar con QA-012, UI-048, UI-049, UI-050 ni con nuevas features funcionales.

#### Resultado
Implementada en PR #129 y pendiente de validacion remota/merge. Se crea
`src/lib/queryKeys.ts` con claves
jerarquicas por entidad y proyeccion. `PacientesPage` usa registro completo;
`ConsultasPage` y `EvaluacionesPage` comparten el selector clinico de pacientes; las consultas
completas quedan separadas del selector de evaluaciones. Las invalidaciones usan la raiz de
cada entidad y alcanzan todas sus variantes. La prueba unitaria cubre separacion de cache e
invalidacion jerarquica. QA-012, UI-048, UI-049 y UI-050 no se ejecutan en esta rama.

### UI-048 - Compactar fila de indicadores superiores de PacientesPage

**Estado:** Pendiente recomendado
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** Observacion visual de Javier durante revision local/demo de `PacientesPage`
**Fecha creacion:** 2026-07-10
**Dependencias:** UI-034, UI-045, UI-046, QA-012

#### Descripcion
Reducir el peso visual de los indicadores superiores de `PacientesPage`. La fila actual se
percibe demasiado alta y poco armoniosa para el panel diario: los indicadores deben seguir
en una sola linea en desktop, pero ocupar menos alto y menos espacio visual.

#### Criterios de aceptacion propuestos

- Mantener los indicadores superiores en una sola linea en desktop.
- Reducir alto visual de la fila y tarjetas mediante ajustes de padding, min-height, gap,
  tamano de iconos y jerarquia tipografica.
- Conservar lectura rapida de metricas, etiquetas y estados.
- Evitar overflow horizontal y validar responsive en desktop, tablet y mobile.
- Mantener su implementacion separada de UI-049 y UI-050 para aislar la regresion visual.
- No modificar logica de metricas, datos, queries, Auth/RLS, DB, migraciones ni servicios.

#### Resultado
Pendiente recomendado. Solo se registra documentalmente en CTRL-015; no se implementa CSS ni
codigo funcional en esta rama.

### UI-049 - Sidebar desktop como rail colapsable y accesible

**Estado:** Pendiente recomendado
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** Observacion visual de Javier durante revision local/demo del shell interno
**Fecha creacion:** 2026-07-10
**Dependencias:** UI-023, UI-027
**Nivel documental:** Nivel 2

#### Descripcion
Recuperar ancho util para formularios y paneles reemplazando la sidebar desktop fija de
aproximadamente 240 px por un rail colapsado que muestre iconos. Al interactuar con la
navegacion debe expandirse para mostrar las etiquetas, sin alterar el drawer movil ya
integrado por UI-027 ni el filtrado de modulos por rol de UI-023.

#### Criterios de aceptacion propuestos

- Aplicar el rail solo en desktop (`> 1080px`); en tablet/mobile conservar el drawer lateral,
  backdrop y cierres por boton, enlace y `Escape` de UI-027.
- Usar un ancho colapsado estable cercano a 72 px, con iconos centrados y estado activo
  inequívoco; las etiquetas deben ocultarse sin quedar cortadas ni reservar espacio.
- Expandir con puntero y con `:focus-within` o mecanismo equivalente para teclado. Incorporar
  un control de fijado o alternativa accesible que permita mantener la barra expandida.
- Evitar saltos del contenido principal durante la expansion temporal; la expansion por
  hover/foco debe superponerse de forma controlada y el modo fijado puede reservar ancho.
- Mostrar nombre accesible y tooltip para cada accion cuando el rail este colapsado.
- Adaptar marca, mensaje institucional, version/estado y cierre de sesion al modo compacto,
  sin solapamientos ni perdida de acciones esenciales.
- Respetar `prefers-reduced-motion`, conservar el orden de foco y mantener el filtrado por rol.
- Validar Inicio, Pacientes, Consultas, Evaluaciones, Casos, Agenda, Finanzas/Pagos, Reportes
  y Configuracion con los roles demo que correspondan, sin overflow horizontal.
- No modificar rutas, permisos, Auth/RLS, DB, migraciones, datos, servicios ni produccion.

#### Orden recomendado
Implementar y validar UI-049 antes de UI-050 porque ambas tareas modificaran el shell global,
`App.tsx` y sus capas CSS. Deben ir en ramas y PRs seriales separados.

#### Resultado
Pendiente recomendado. Solo se registra documentalmente en CTRL-015; no se implementa codigo
ni CSS en esta rama.

### UI-050 - Barra superior como encabezado contextual compacto

**Estado:** Pendiente recomendado
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** Observacion visual de Javier durante revision local/demo del shell interno
**Fecha creacion:** 2026-07-10
**Dependencias:** UI-020, UI-021, UI-023, UI-027, UI-029, UI-049
**Nivel documental:** Nivel 2

#### Descripcion
Eliminar la franja superior vacia o sobredimensionada del shell y convertirla en un
encabezado contextual compacto. Debe aprovechar el espacio para identificar el modulo y
acercar sus acciones principales, preservando el indicador de ambiente, la identidad del
usuario y el rol visible.

#### Criterios de aceptacion propuestos

- Mantener una altura desktop estable entre 56 y 72 px y evitar que la fila del grid se
  estire para ocupar espacio vertical disponible.
- Mostrar a la izquierda el contexto real de la ruta (modulo, titulo breve o breadcrumb) y
  evitar duplicar un encabezado equivalente dentro de la pagina.
- Mantener a la derecha `IndicadorAmbiente`, avatar, nombre y rol; UI-020/UI-021 no pueden
  eliminarse ni perder visibilidad por el rediseno.
- Acercar las acciones primarias del modulo al encabezado cuando corresponda, sin cambiar su
  comportamiento ni inventar acciones no existentes.
- En tablet/mobile conservar el boton del drawer, un titulo compacto y los controles de
  ambiente/usuario sin superposiciones, recortes ni overflow horizontal.
- Mantener contexto correcto al navegar por todas las rutas protegidas y respetar las
  superficies visibles para cada rol.
- Validar desktop, tablet y mobile en las rutas principales, incluyendo formularios largos,
  estados vacios y contenido con scroll.
- No modificar logica clinica, datos, queries, rutas, Auth/RLS, DB, migraciones, servicios ni
  produccion.

#### Decision documental
No se crea una DEC en esta etapa: UI-050 registra una propuesta Nivel 2 pendiente. La
implementacion debe definir el contrato de contexto por ruta dentro de su propio alcance y
solo requeriria una DEC nueva si intentara cambiar navegacion, permisos o reglas funcionales.

#### Resultado
Pendiente recomendado. Solo se registra documentalmente en CTRL-015; no se implementa codigo
ni CSS en esta rama.


### DOC-001 - Manual de ambientes

**Estado:** Documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `be-018-doc001-doc003-ambientes-datos-reales`
**Informe:** `docs/control/auditorias/DOC-001_MANUAL_AMBIENTES.md`

#### Descripcion
Crear manual documental para uso y administracion de ambientes local, demo, staging y produccion.

#### Criterios de aceptacion
- Describir proposito y restricciones de cada ambiente.
- Documentar responsable operativo por ambiente.
- Registrar reglas para variables de entorno sin exponer secretos.
- Incluir regla de no mezclar datos demo con datos reales.
- No tocar `.env`.

#### Observaciones

DOC-001 no crea ambientes ni modifica configuracion. Define operacion, responsables, reglas de datos y respuesta ante incidentes de ambiente.

### DOC-002 - Procedimiento de backup/restauracion

**Estado:** Documental / pendiente prueba futura
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Integracion Backend
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `be-019-doc002-backup-restauracion`
**Informe:** `docs/control/auditorias/DOC-002_PROCEDIMIENTO_BACKUP_RESTAURACION.md`

#### Descripcion
Documentar el procedimiento de respaldo y restauracion que debe probarse antes de produccion.

#### Criterios de aceptacion
- Describir pasos de respaldo.
- Describir pasos de restauracion.
- Definir responsable y evidencia requerida.
- Registrar resultado esperado de prueba.
- No tocar Supabase remoto sin autorizacion expresa.

#### Observaciones

DOC-002 no ejecuta comandos ni toca datos. La prueba real de restauracion debe ejecutarse despues en ambiente aislado con datos ficticios o anonimizados aprobados.

### DOC-003 - Politica de carga de datos reales

**Estado:** Documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Auditoria PROD-001 / SEC-001
**Fecha creacion:** 2026-06-19
**Fecha documentacion:** 2026-07-02
**Rama usada:** `be-018-doc001-doc003-ambientes-datos-reales`
**Informe:** `docs/control/auditorias/DOC-003_POLITICA_CARGA_DATOS_REALES.md`

#### Descripcion
Definir politica operativa para autorizar, ejecutar y controlar la primera carga de datos reales.

#### Criterios de aceptacion
- Exigir cierre de PROD-001 antes de cargar pacientes reales.
- Definir aprobacion explicita de Javier como condicion.
- Prohibir seeds demo en produccion.
- Definir checklist pre-produccion.
- Documentar responsable de autorizacion y evidencia.

#### Observaciones

DOC-003 no autoriza carga real. Define que pacientes reales, fotos reales y pagos reales siguen prohibidos hasta cerrar PROD-001 y contar con aprobacion explicita de Javier.

### DOC-004 - Documentar flujo pagina publica -> API -> sistema interno -> Google

**Estado:** Documental / pendiente implementacion futura
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** API-001 / DEC-033
**Fecha creacion:** 2026-06-30
**Fecha documentacion:** 2026-07-02
**Rama usada:** `doc-004-flujo-publica-api-google`
**Informe:** `docs/control/auditorias/DOC-004_FLUJO_PAGINA_PUBLICA_API_SISTEMA_INTERNO_GOOGLE.md`
**Dependencias:** API-001, BE-012, BE-017, BE-018, BE-020, BE-026, BE-027, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Documentar el flujo operativo completo entre pagina publica, API, sistema interno, base de datos y Google Calendar/Gmail/Workspace.

DOC-004 ordena el flujo futuro de solicitud publica, validacion API, registro en `solicitudes_agenda`, revision interna, eventual conversion operativa y sincronizacion Google posterior a revision.

#### Criterios de aceptacion
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
DOC-004 no implementa endpoints, codigo, migraciones, Google, Supabase remoto ni produccion. La implementacion real debe esperar BE-020, SEC-005, BE-018, DOC-001, DOC-003, BE-027, SEC-010 y PROD-001.

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
Implementacion local preparada en esta rama. Informe relacionado en `docs/control/auditorias/BE-022_UI-022_FOTOS_ELEMENTOS_CASO.md`. QA-003 valida local/demo carga programatica de imagen ficticia, registro, visualizacion UI admin y bloqueo para Finanzas, con observacion sobre input de archivo no automatizado.

### BE-023 - Alias/codigo administrativo persistente para Finanzas

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** CTRL-008 / DEC-022 / BE-016
**Fecha creacion:** 2026-06-29
**Rama usada:** `codex/implementacion-bloque-seguridad-cobros`
**Informe:** `docs/control/auditorias/BE-023_ALIAS_CODIGO_ADMINISTRATIVO_FINANZAS.md`

#### Descripcion
Definir e implementar a nivel de base de datos y frontend la ocultación de `paciente_id` para Finanzas, utilizando una identidad financiera persistente separada.

#### Resultado
Implementada localmente mediante la migración `20260708000005_be_023_identidad_financiera_persistente.sql`. Se creó la tabla `public.pacientes_identidad_financiera` (con políticas RLS restringidas a Administradores), un trigger disparador `trigger_provisionar_identidad_financiera` para auto-aprovisionar de forma persistente a los nuevos pacientes, un script de backfill para los pacientes existentes y se rediseñó la vista `public.vista_finanzas_unidades_cobrables` para no exponer el UUID `paciente_id` de forma directa a Finanzas. Asimismo, se modificó [FinanzasPage.tsx](file:///e:/Proyectos/terapeutas-australes-app/src/pages/FinanzasPage.tsx) para no tipar ni seleccionar la columna removida.

### BE-024 - Regla de hallazgo unico/multiple por aspecto revisado

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** CTRL-008 / DEC-024 / QA-002
**Fecha creacion:** 2026-06-29
**Rama usada:** `codex/implementacion-bloque-seguridad-cobros`

#### Descripcion
Implementar a nivel de base de datos la restricción de que un aspecto revisado solo puede tener como máximo un hallazgo activo en la aplicación.

#### Resultado
Implementada localmente mediante la migración `20260708000004_be_024_restriccion_hallazgo_unico_aspecto.sql`. Se creó el índice de unicidad parcial `idx_unique_activo_por_aspecto` sobre `public.revision_hallazgos (revision_aspecto_id)` limitándolo a los estados de hallazgo que no sean `'Cerrado'` o `'Descartado'`. Esto impide registrar más de un hallazgo activo simultáneamente por aspecto de revisión.

### BE-025 - Campos financieros permitidos/prohibidos para Finanzas

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** CTRL-008 / DEC-027 / SEC-001
**Fecha creacion:** 2026-06-29
**Dependencias:** BE-016, SEC-004, BE-020, UI-015
**Informe:** `docs/control/auditorias/BE-025_CAMPOS_FINANCIEROS_PERMITIDOS_PROHIBIDOS.md`
**Rama usada:** `codex/implementacion-bloque-seguridad-cobros`

#### Descripcion
Definir contrato de campos financieros visibles para Finanzas y prohibir contenido clinico en campos libres de cobros/pagos.

#### Criterios de aceptacion preliminares
- Clasificar campos permitidos y prohibidos en `cobros` y `pagos`: cumplido documentalmente.
- Definir microcopy para evitar texto clinico en finanzas: cumplido documentalmente.
- Evaluar si se requieren checks, vistas o campos administrativos separados: cumplido documentalmente.
- Considerar `concepto_cobro`, `descripcion_cobro`, `observaciones`, `notas_internas` y `referencia_pago`: cumplido documentalmente.

#### Resultado
Implementada localmente mediante la migración `20260708000006_be_025_contrato_campos_finanzas.sql`. Se agregaron columnas `observacion_financiera_administrativa` a las tablas `public.cobros` y `public.pagos`, y la columna `nota_conciliacion_financiera` a `public.pagos`. La vista `public.vista_finanzas_unidades_cobrables` se actualizó para exponer únicamente estas observaciones de carácter administrativo financiero, protegiendo las columnas clínicas de observaciones y notas internas. El frontend se adaptó para consultar y renderizar estas notas en las tarjetas financieras.

### BE-026 - Disenar contrato de API publica de agendamiento

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** API-001 / DEC-033
**Fecha creacion:** 2026-06-30
**Fecha diseno:** 2026-07-02
**Rama usada:** `be-026-diseno-contrato-api-agendamiento`
**Informe:** `docs/control/auditorias/BE-026_CONTRATO_API_PUBLICA_AGENDAMIENTO.md`
**Dependencias:** API-001, BE-012, BE-017, BE-028, BE-029, BE-018, BE-020, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Definir el contrato tecnico de la futura API publica de agendamiento, incluyendo endpoints, payloads, validaciones, respuestas, errores neutros, idempotencia, relacion con Agenda y consentimiento.

#### Resultado
Contrato conceptual formalmente definido e integrado en `BE-026_CONTRATO_API_PUBLICA_AGENDAMIENTO.md`. Establece endpoints versionados bajo `/api/v1/public/`, payloads permitidos/prohibidos, respuestas públicas neutras para mitigar la enumeración de usuarios y el aislamiento de la agenda interna.

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
BE-026 queda documentado como contrato conceptual bajo `/api/v1`, usando `solicitudes_agenda` como destino publico. No implementa endpoints reales ni cierra contrato productivo mientras PROD-001 este abierto. La implementacion futura debe esperar SEC-009, BE-020, DOC-001, DOC-003, SEC-005 y cierre de PROD-001.

### BE-027 - Disenar integracion Google Calendar / Gmail / Workspace

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** API-001 / DEC-033
**Fecha creacion:** 2026-06-30
**Dependencias:** API-001, BE-012, BE-017, BE-018, BE-020, BE-026, SEC-005, SEC-009, DOC-001, DOC-003, PROD-001

#### Descripcion
Definir la arquitectura tecnica para sincronizar Agenda con Google Calendar y enviar confirmaciones/recordatorios neutros mediante Gmail/Google Workspace desde backend seguro.

#### Resultado
Diseño conceptual completado y documentado en `BE-027_INTEGRACION_GOOGLE_WORKSPACE.md`. Define el flujo OAuth 2.0 por terapeuta, el almacenamiento encriptado seguro de tokens, y la política de privacidad estricta de envío de payloads genéricos (alias administrativo) sin revelar datos clínicos.

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
Implementacion local preparada en esta rama. QA-003 queda ejecutada local/demo con observacion: visualizacion UI validada y carga local realizada por cliente Supabase, no por input de archivo automatizado.

### UI-023 - Navegacion y superficies filtradas por rol

**Estado:** Integrada por PR #74 / validada post-merge
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** CTRL-008 / DEC-023 / UI-016 / QA-005 / QA-006B
**Fecha creacion:** 2026-06-29
**Dependencias:** SEC-002, SEC-004, UI-016, QA-005, QA-006B, SEC-007B

#### Descripcion
Implementar navegacion coherente por rol y revisar superficies visibles dentro de cada modulo.

#### Implementacion local/demo
- `src/App.tsx` define permisos por item de navegacion y filtra sidebar/drawer segun `usuarioInterno.rol`.
- Admin mantiene acceso transversal a los modulos internos habilitados.
- Terapeuta ve superficies clinicas, Agenda y Reportes, sin entrada a Finanzas.
- Finanzas ve Finanzas/Pagos y Reportes, sin entradas clinicas ni Agenda.
- Configuracion permanece como item futuro solo visible para Admin.

#### Validacion post-merge
- PR #74 queda integrado en `main`.
- QA-006C revalida desktop y mobile sobre `main`.
- Admin, Terapeuta y Finanzas presentan navegacion esperada por rol.
- Finanzas mobile `390x844` abre drawer y mantiene solo Inicio, Finanzas/Pagos y Reportes.

#### Criterios de aceptacion preliminares
- No reutilizar `UI-017`, porque ya existe como checklist responsive clinico.
- Admin ve modulos autorizados de forma transversal.
- Terapeuta ve modulos clinicos autorizados.
- Finanzas ve Finanzas/Pagos y Reportes financieros.
- Finanzas no ve entradas clinicas en navegacion.
- Terapeuta no ve entrada a Finanzas en navegacion.
- Drawer movil usa el mismo filtro que sidebar desktop.
- Mantener guards de ruta como barrera adicional.
- Revisar `PagosCasoPanel` dentro de ficha clinica para definir si Terapeuta ve estado minimo o nada.
- No tocar `.env`, migraciones ni Supabase remoto.

### UI-024 - Recuperacion de cuenta, MFA y estados Auth no tecnicos

**Estado:** Integrada (PR #105) / MFA no implementado
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** SEC-008 / SEC-003 / DEC-032
**Fecha creacion:** 2026-06-30
**Rama usada:** `feature/recuperacion-y-agendamiento-contrato`
**Dependencias:** SEC-008, SEC-008B, BE-018, DOC-001, QA-006

**Nota:** el estado anterior de esta ficha ("Ejecutada local/demo con observacion") era un
error de copy-paste de otra tarea, detectado en `FASE1-BARRIDO-2026-07-08.md` -- UI-024 no
tenia implementacion real hasta PR #105.

#### Descripcion
Definir e implementar el flujo visual de recuperacion de cuenta, enrolamiento/verificacion MFA y estados Auth sin exponer detalles tecnicos.

#### Resultado
Implementado en el frontend el flujo seguro de recuperación de cuenta y restablecimiento de contraseña (`/recuperar` y `/reset-password`). Utiliza microcopy genérico de éxito para mitigar la enumeración de cuentas y restringe las contraseñas a un mínimo de 8 caracteres con mayúscula, minúscula y número. Se modificó `LoginPage.tsx` para enlazar la recuperación y `supabase/config.toml` para admitir las redirecciones locales de desarrollo.

#### Criterios de aceptacion preliminares
- Definir pantallas o modales para recuperacion de contrasena.
- Definir enrolamiento y verificacion MFA por rol si Supabase lo permite.
- Usar microcopy generico que no revele si un email existe.
- Cubrir sesion expirada, inactividad, acceso interno no habilitado y error temporal.
- No mostrar errores crudos de Supabase, RLS, politicas ni estructura de base de datos.
- Coordinar con SEC-008B antes de exigir MFA o email confirm.
- No tocar `.env`, Supabase remoto ni datos reales.

### UI-025 - Integrar AgendaPage con modelo DB de Agenda operativa

**Estado:** Integrada lectura por PR #44
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
UI-025 no reemplaza BE-026 ni BE-027. La pagina publica futura debe seguir pasando por API segura. La fase posterior de alta/edicion controlada queda registrada como `UI-025B`.

### UI-025B - Alta y edicion controlada de Agenda operativa interna

**Estado:** Integrada por PR #45 / QA-008 cerrada local/demo
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** UI-025 / BE-028 / BE-029 / DEC-034
**Fecha creacion:** 2026-07-01
**Fecha integracion:** 2026-07-01
**Rama usada:** `ui-025b-agenda-operativa-edicion-controlada`
**Informe:** `docs/control/auditorias/UI-025B_EDICION_CONTROLADA_AGENDA_OPERATIVA.md`
**Dependencias:** BE-028, BE-029, UI-025, DEC-034, SEC-005, PROD-001

#### Descripcion
Extender `/agenda` para permitir gestion manual minima y segura de `public.agenda_eventos` desde el sistema interno.

#### Resultado
Se habilita:

- crear eventos internos con titulo, tipo, fecha/hora, modalidad, estado, ubicacion/enlace y notas internas breves;
- editar eventos existentes de `agenda_eventos`;
- cambiar estado usando solo `programado`, `confirmado`, `reagendado`, `cancelado`, `completado` y `no_asistio`;
- cancelar sin borrado fisico;
- reagendar como edicion controlada de fecha/hora y estado;
- marcar eventos como completados.

La ruta `/agenda` sigue protegida para `admin` y `terapeuta`. Finanzas, anonimos y usuarios no autorizados quedan fuera por ruta y por RLS.

#### Restricciones
UI-025B no crea pacientes, consultas, solicitudes de agenda, evaluaciones, casos, revisiones, trabajos, pagos ni fotos. Tampoco implementa API publica, endpoints, Google Calendar, Gmail, Workspace, migraciones SQL, Auth/RLS, `.env`, Supabase remoto, produccion ni datos reales.

#### Observaciones
UI-025B no reemplaza BE-026 ni BE-027. La pagina publica futura debe seguir pasando por API segura y la integracion Google debe implementarse solo desde backend controlado. `QA-008` valido el flujo desktop/admin y la observacion responsive movil quedo corregida por UI-027 e integrada en `main`.

### UI-026 - Selector calendario/horario y duracion estandar de consulta en Agenda interna

**Estado:** Integrada por PR #48 / QA-008 cerrada local/demo
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** QA-008 / UI-025B
**Fecha creacion:** 2026-07-02
**Rama usada:** `ui-026-selector-calendario-horario-agenda`
**Informe:** `docs/control/auditorias/UI-026_SELECTOR_CALENDARIO_HORARIO_AGENDA.md`
**Dependencias:** UI-025B, QA-008, BE-028, BE-029, PROD-001
**Nivel documental:** Nivel 2

#### Descripcion
Mejorar el modal de Agenda para que el usuario seleccione fecha desde calendario, hora de inicio desde lista de 15 minutos y duracion desde opciones controladas.

#### Resultado
Se calcula hora de fin automaticamente y se valida solapamiento basico contra eventos cargados, aplicando buffer operativo de 15 minutos cuando participa una consulta.

QA-008 valido visualmente en desktop/admin el selector de fecha, selector de hora, duracion controlada, fin calculado, reagendamiento y bloqueo de solapamiento. La observacion responsive movil por overflow horizontal del shell quedo corregida por UI-027 e integrada en `main`.

#### Restricciones
UI-026 no modifica migraciones, DB, Auth/RLS, Supabase remoto, API publica, Google Calendar, Gmail, produccion ni datos reales.

### UI-027 - Ajuste responsive de shell y Agenda interna

**Estado:** Integrada por PR #50 / validada post-merge
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** QA008-OBS-003
**Fecha creacion:** 2026-07-02
**Rama sugerida:** `ui-027-ajuste-responsive-shell-agenda`
**Rama usada:** `ui-027-ajuste-responsive-shell-agenda`
**Informe:** `docs/control/auditorias/UI-027_AJUSTE_RESPONSIVE_SHELL_AGENDA.md`
**Dependencias:** QA-008, UI-025B, UI-026
**Nivel documental:** Nivel 2

#### Descripcion
Corregir el overflow horizontal observado en `/agenda` con viewport movil `390x844`, reemplazando la sidebar movil por menu superior y drawer lateral desde la izquierda.

#### Criterios preliminares
- `/agenda` no debe presentar overflow horizontal en viewport movil.
- La navegacion lateral no debe recortar la superficie principal.
- El comportamiento desktop validado por QA-008 no debe degradarse.
- La correccion debe validarse con navegador integrado o captura visual equivalente.

#### Restricciones
UI-027 no debe modificar DB, migraciones, Auth/RLS, Supabase remoto, API publica, Google Calendar, Gmail, produccion ni datos reales.

#### Resultado
Se ajustan `src/App.tsx`, `src/App.css` y `src/ReferenceFinalPass.css` para incorporar boton superior, drawer lateral movil, overlay y cierre por boton, Escape o enlace de navegacion. Integrado por PR #50. Validado post-merge en `main` sin overflow horizontal en `390x844`, `360x740` y desktop `1280x720`.

### QA-008 - Validacion funcional completa de Agenda interna

**Estado:** Cerrada post-merge local/demo
**Prioridad:** Alta
**Responsable:** Control de Desarrollo / QA / UI-UX / Integracion Backend
**Origen:** PR #45 / UI-025B / BE-028 / BE-029
**Fecha creacion:** 2026-07-02
**Rama sugerida:** `qa-008-validacion-agenda-interna`
**Rama usada visual:** `qa-008-validacion-visual-agenda-interna`
**Informe:** `docs/control/auditorias/QA-008_VALIDACION_FUNCIONAL_AGENDA_INTERNA.md`
**Informe ejecucion:** `docs/control/auditorias/QA-008_EJECUCION_AGENDA_INTERNA.md`
**Dependencias:** PR #45 integrado, UI-025B, BE-028, BE-029, PROD-001
**Nivel documental:** Nivel 2

#### Descripcion
Validar funcionalmente Agenda interna ya integrada en `main` y registrar el cierre post-merge de QA-008.

#### Alcance esperado
- Visualizacion desde `public.vista_agenda_operativa`.
- Busqueda y filtros.
- Creacion, edicion, cambio de estado, cancelacion, reagendamiento y marcado como completado de eventos internos.
- Persistencia despues de recargar.
- Errores controlados.
- Responsive del formulario/modal.
- Proteccion por rol.
- Ausencia de efectos colaterales clinicos.

#### Restricciones
QA-008 no debe crear pacientes, consultas, solicitudes publicas, evaluaciones, casos, revisiones, trabajos, cobros, pagos, fotos ni objetos Storage. Tampoco debe ejecutar API publica, Google Calendar, Gmail, migraciones, Supabase remoto, produccion ni datos reales.

#### Resultado
QA-008 fue ejecutado en Supabase local, Vite local y navegador integrado autenticado como `Administrador Local`.

Pasaron las validaciones de creacion, lectura desde `vista_agenda_operativa`, edicion, reagendamiento, completado, cancelacion sin delete fisico, persistencia, permisos por rol simulados, ausencia de efectos colaterales sobre entidades clinicas, finanzas y Storage, y recorrido visual desktop/admin.

La observacion responsive movil por overflow horizontal del shell queda corregida por UI-027 e integrada por PR #50. La pasada visual post-merge sobre `main` confirma desktop `1280x720`, mobile `390x844` y mobile `360x740` sin overflow horizontal. `BE-026` puede evaluarse como siguiente diseno de contrato, manteniendo fuera API publica funcional, Google y produccion.

### QA-003 - Validacion funcional local de fotos de elementos del caso

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** BE-022 / UI-022
**Fecha creacion:** 2026-06-19
**Rama sugerida:** `feature/fotos-elementos-caso`
**Fecha validacion:** 2026-07-04
**Rama usada:** `qa-003-validacion-fotos-local`
**Informe:** `docs/control/auditorias/QA-003_VALIDACION_FUNCIONAL_FOTOS_ELEMENTOS_CASO.md`
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

#### Resultado

QA-003 valida local/demo una imagen ficticia PNG: carga a bucket privado `elementos-caso`, registro en `public.fotos_elementos_caso`, signed URL, render UI en detalle de caso para admin y bloqueo de fotos/Storage para Finanzas.

Observacion: el input de archivo de la UI no fue automatizado directamente por limitacion del runtime de navegador; la carga se realizo con cliente Supabase local autenticado como demo admin y la visualizacion si se verifico en UI.
- Confirmar que no se rompen revisiones, detalle de revisiones, trabajos ni pagos.
- No usar datos reales ni imagenes reales.

### QA-006 - Base minima de pruebas por rol y no exposicion sensible

**Estado:** Pendiente
**Prioridad:** Alta
**Responsable:** Control de desarrollo / QA
**Origen:** CTRL-008 / SEC-001 / QA-004 / QA-005
**Fecha creacion:** 2026-06-29
**Dependencias:** SEC-003, SEC-005, SEC-008, SEC-008B, BE-021, UI-023, UI-024, BE-023, BE-025
**Informe:** `docs/control/auditorias/QA-006_PLAN_BASE_PRUEBAS_ROLES.md`
**Informe QA-006A:** `docs/control/auditorias/QA-006A_MATRIZ_RUTAS_SUPERFICIES_ROL.md`
**Informe QA-006B:** `docs/control/auditorias/QA-006B_VALIDACION_NAVEGACION_ROLES.md`
**Informe QA-006C:** `docs/control/auditorias/QA-006C_REVALIDACION_NAVEGACION_FILTRADA_ROLES_POSTMERGE.md`
**Informe QA-006D:** `docs/control/auditorias/QA-006D_VALIDACION_REPORTES_FINANZAS_ROLES.md`
**Informe QA-006E:** `docs/control/auditorias/QA-006E_VALIDACION_AUTH_LOCAL_DEMO.md`
**Informe QA-006F:** `docs/control/auditorias/QA-006F_VALIDACION_RLS_STORAGE_ROLES.md`

#### Descripcion
Definir e implementar progresivamente una base minima de pruebas para roles, navegacion, reportes, finanzas y no exposicion de datos sensibles.

El plan base documental divide QA-006 en fases para evitar cubrir todo en un solo PR. `QA-006A - Matriz de rutas y superficies por rol` queda documentado como base, `QA-006B - Validacion visual autenticada de navegacion por rol` queda ejecutada local/demo, `QA-006C - Revalidacion post-merge navegacion filtrada por rol` confirma que UI-023 resolvio la observacion visible del menu, `QA-006D - Reportes y Finanzas por rol` confirma separacion visual de Reportes/Finanzas, `QA-006E - Validacion Auth local/demo` confirma estados Auth minimos con mensajes no tecnicos y `QA-006F - Validacion RLS/Storage local por rol` confirma separacion runtime para clinica, finanzas, fotos y Storage.

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

#### Resultado actual

QA-006 queda iniciado como plan base documental, QA-006A deja matriz de rutas/superficies por rol y QA-006B confirma que rutas internas sin sesion redirigen a `/login`. Tras SEC-007B, QA-006B valida local/demo redireccion por rol, Reportes por rol, Agenda para Admin/Terapeuta y bloqueo de usuarios inactivo/sin perfil. QA-006C valida post-merge que el menu visible ya queda filtrado por rol en desktop/mobile. QA-006D valida Reportes/Finanzas por rol: Admin ve superficie mixta autorizada, Terapeuta queda clinico y Finanzas queda financiero/administrativo. QA-006E valida estados Auth minimos local/demo: sin sesion, credenciales invalidas, usuario inactivo, usuario sin perfil interno y login admin valido. QA-006F valida runtime local que Finanzas no accede a clinica, fotos ni Storage, que Terapeuta no accede a cobros/pagos directos y que el bucket `elementos-caso` sigue privado.

La siguiente fase recomendada es SEC-011 como diseno documental de hardening tecnico de fotos/Storage, o una revalidacion manual del input de archivo si se quiere cerrar QA-003 sin observacion. PROD-001 sigue bloqueante.

### SEC-011 - Disenar hardening tecnico de fotos y Storage

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** SEC-001 / SEC-005 / SEC-006 / QA-003 / QA-006F / BE-021 / BE-022 / UI-022 / PROD-001
**Fecha creacion:** 2026-07-04
**Rama usada:** `codex/implementacion-bloque-seguridad-cobros`
**Informe:** `docs/control/auditorias/SEC-011_DISENO_HARDENING_FOTOS_STORAGE.md`
**Dependencias:** SEC-001, SEC-005, SEC-006, QA-003, QA-006F, BE-021, BE-022, UI-022, PROD-001

#### Descripcion
Implementar el endurecimiento de privilegios de metadatos de fotos y vistas de auditoría para objetos huérfanos.

#### Resultado
Implementada localmente mediante la migración `20260708000003_sec_011_hardening_fotos_storage.sql`. Se revocaron todos los privilegios sobre `fotos_elementos_caso` de los roles `public` y `anon`, se definieron los privilegios por defecto (`ALTER DEFAULT PRIVILEGES`) para revocar accesos amplios a futuras tablas, y se crearon las vistas de diagnóstico `vista_objetos_storage_huerfanos` y `vista_fotos_metadatos_sin_objeto` (con `security_invoker = true` y acceso restringido).

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

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `codex/implementacion-bloque-seguridad-cobros`
**Dependencias:** DEC-012, BE-002

#### Descripcion
Implementar reglas a nivel de base de datos para asegurar que los cobros representen unidades cobrables consistentes y excluyentes.

#### Resultado
Implementada localmente mediante la migración `20260708000001_be_013_reglas_cobros_unidad_cobrable.sql`. Se agregaron los check constraints `chk_cobro_origen_valido` (mínimo una relación válida) y `chk_cobro_origen_excluyente` (a lo sumo un origen clínico simultáneo), y se redefinió la función de validación `validar_cobro_relaciones` eliminando la duplicación técnica de ancestros.

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

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Implementacion
**Origen:** BE-011
**Fecha creacion:** 2026-06-17
**Rama usada:** `feature/hallazgo-a-trabajo`
**Dependencias:** QA-002, UI-012, BE-011, CTRL-008, DEC-013, DEC-014, DEC-015, DEC-024, DEC-025, BE-024

#### Descripcion
IMP-002 queda como la siguiente implementacion funcional clinica relevante. Debe partir desde UI-012, QA-002, BE-011 y CTRL-008, respetando que `Evaluar trabajo` no crea trabajos automaticamente y que la creacion del trabajo requiere confirmacion manual del terapeuta.

No usar datos reales todavia. Antes de produccion debe cerrarse PROD-001.

#### Resultado
Implementada localmente y validada mediante la suite de tests E2E y unitarios. Se modificó el panel de detalles de revisión clínica `DetalleRevisionesPanel.tsx` para cargar los trabajos asociados, verificar si un hallazgo ya cuenta con una derivación, y renderizar un modal de creación interactivo que hereda datos inteligentes del hallazgo para permitir al terapeuta confirmar la derivación del plan de intervención de manera manual.

### AUDIT-2026-07-04 - Revision integral de estructura y arquitectura

**Estado:** Aprobada por Javier (DEC-036 a DEC-039); DEC-040 reservada sin contenido
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Auditoria tecnica automatizada
**Fecha creacion:** 2026-07-04
**Ramas relacionadas:** `docs/audit-2026-07-04-revision-estructura`, `refactor/extract-utilities`, `fix/rls-vista-cobros-finanzas`, `fix/rls-fotos-auditoria-finanzas`, `fix/rls-delete-policies`, `poc/auth-context`
**Informe:** `docs/control/auditorias/AUDIT-2026-07-04_REVISION_ESTRUCTURA_CODIGO.md`

#### Descripcion

Auditoria de estructura React, migraciones Supabase, RLS y duplicacion de codigo. Detecto 3 brechas RLS, prop drilling de autenticacion y ~40% de duplicacion en utilidades. Propuso el roadmap de 5 bloques que se detalla en `BLOQUE-1-RLS`, `BLOQUE-2-UTIL`, `BLOQUE-3-AUTH` y las decisiones DEC-036 a DEC-039.

#### Resultado

Javier aprobo el roadmap completo. Ver `LOG-076` y `LOG-077` en `06_BITACORA_CAMBIOS.md` para el detalle de ejecucion, incluyendo los errores encontrados y corregidos en los Bloques 1 y 2 respecto del intento inicial.

### BLOQUE-1-RLS - Migraciones RLS para DEC-038

**Estado:** Las 3 corregidas y validadas localmente con `supabase db reset` / pendiente PR
**Prioridad:** Alta
**Responsable:** Integracion Backend / Seguridad
**Origen:** AUDIT-2026-07-04 / DEC-038
**Fecha creacion:** 2026-07-04
**Ramas:** `fix/rls-vista-cobros-finanzas`, `fix/rls-fotos-auditoria-finanzas`, `fix/rls-delete-policies`

#### Resultado

Las 3 migraciones quedaron separadas en sus ramas dedicadas para PRs independientes. Al separarlas se detecto que solo la migracion de DELETE policies habia sido corregida de verdad: usaba la columna inexistente `pacientes.estado_activo` y valores de estado en minuscula (`'anulada'`/`'anulado'`) que no existen en los CHECK constraints reales (que usan `'Cancelada'`/`'Anulada'`/`'Anulado'` capitalizados).

Las otras 2 (`vista_cobros_estado`, `vista_finanzas_fotos_auditoria`) habian quedado identicas al commit original roto: asumian PK generica `id` en `cobros`/`pagos`/`fotos_elementos_caso` (las reales son `id_cobro`, `id_pago`, `id_foto_elemento_caso`), columnas inexistentes (`p.monto_pagado` en vez de `monto_pago`, `fec.fecha_carga` en vez de `created_at`) y, en el caso de `vista_cobros_estado`, reimplementaban la vista completa perdiendo la agregacion de pagos multiples y el `estado_calculado` de la definicion real (`20260627231000_crear_vista_finanzas_unidades_cobrables.sql`). Se corrigieron ambas contra el esquema real.

Las 3 se validaron con `supabase db reset` local: aplican sin errores sobre el esquema completo. Se confirmo ademas con `\d` sobre la base local que `vista_finanzas_fotos_auditoria` expone las columnas esperadas, y con `pg_policies` que las 9 DELETE policies nuevas quedaron creadas. Falta: validacion funcional con usuarios demo SEC-007B (login como finanzas y confirmar lectura de ambas vistas) y PR a `main`. Migraciones sin aplicar a ningun ambiente remoto. No se ejecuto `supabase db push`.

### BLOQUE-2-UTIL - Extraccion de utilidades compartidas para DEC-037

**Estado:** Archivos validados (tsc/eslint) e importados en 12 paginas / pendiente PR
**Prioridad:** Media
**Responsable:** Integracion Backend/Estructura
**Origen:** AUDIT-2026-07-04 / DEC-037
**Fecha creacion:** 2026-07-04
**Rama:** `refactor/extract-utilities`

#### Resultado

`src/lib/constants.ts`, `format.ts` y `queries.ts` fueron reescritos como extraccion fiel de las implementaciones reales duplicadas en `src/pages/` (verificado contra 10+ copias de cada funcion y contra los CHECK constraints de las migraciones). El intento anterior en la misma rama habia sido inventado desde cero y no compilaba.

Se migraron los imports de `formatearFecha`/`normalizarTexto`/`aNumero`/`formatearMoneda`/`textoCorto` en `CasoDetallePage`, `CasosPage`, `ConsultasPage`, `EvaluacionesPage`, `FinanzasPage`, `PacientesPage`, `ReportesPage`, `DetalleRevisionesPanel`, `ElementosCasoPanel`, `PagosCasoPanel`, `RevisionesCasoPanel` y `TrabajosCasoPanel`, verificando cada funcion linea por linea contra la copia local antes de eliminarla. Donde el `largo` por defecto de `textoCorto` no coincidia con el de `lib/format.ts` (96, 110, 112, 128 vs 120), se dejo intacta o se paso el valor original explicito en el call site para no cambiar el comportamiento observable. `AgendaPage` no se toco: sus formatters de fecha/hora son genuinamente distintos, no duplicados.

Validado con `tsc -b`, `eslint` y prueba visual completa (`npm run dev` + seed local DATA-001, usuario admin) en las 7 paginas y 5 paneles de detalle de caso: fechas y montos identicos a antes del cambio, sin errores de consola.

Pendiente: `AgendaPage` y las paginas donde `textoCorto`/otras utilidades tienen variantes de comportamiento no triviales quedan fuera de este alcance; revisar caso por caso si se decide unificarlas a futuro.

### BLOQUE-3-AUTH - POC AuthContext para DEC-036

**Estado:** Validado tecnica y visualmente / pendiente revision final de Javier y PR
**Prioridad:** Media
**Responsable:** Integracion Backend/Estructura
**Origen:** AUDIT-2026-07-04 / DEC-036
**Fecha creacion:** 2026-07-04
**Rama:** `poc/auth-context`

#### Resultado

El POC extrae fielmente la logica de autenticacion de `App.tsx` hacia `AuthContext`/`useAuth()`, eliminando el prop drilling hacia `RutaProtegida`/`AppPrivada`/`DashboardShell`. Se corrigio un bug de compilacion (`usuarioInterno.nombre_completo` sin guard opcional) y se encapsulo el contexto (ya no expone `setEstadoAuth`/`setSession`/`setUsuarioInterno`/`setMensajeAuth`, sin consumidores que los usaran).

Validacion visual completa con `npm run dev` y los usuarios demo SEC-007B: login/logout y sidebar filtrado correctos para los 3 roles (`admin` ve todos los modulos incl. Configuracion; `terapeuta` ve modulos clinicos sin Finanzas; `finanzas` ve solo Finanzas/Pagos y Reportes), sin errores de consola. Sin merge a `main`: pendiente revision final de Javier y PR.

## Tareas sugeridas no activas

Este bloque se mantiene para futuras propuestas no activas.

Las propuestas anteriores de BE-003 fueron reemplazadas por tareas activas derivadas de la auditoria PROD-001 / SEC-001. No quedan tareas sugeridas no activas en este bloque.
