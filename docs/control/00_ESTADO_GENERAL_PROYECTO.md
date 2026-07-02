# Estado general del proyecto

Fecha de corte: `2026-07-02`
Responsable del documento: Control de desarrollo
Estado general documental: En control activo

## Resumen

El proyecto cuenta con una estructura documental de control en `docs/control/`. Esta estructura ordena responsabilidades, pendientes, decisiones, bitacora, auditorias y flujo de trabajo sin modificar codigo, migraciones ni base de datos.

Al corte actual ya quedaron integradas las auditorias iniciales de control, backend, flujo clinico y UI/UX. Tambien quedaron registrados BE-003, BE-010, UI-011, IMP-001, DATA-001, BE-011, QA-002, SEC-001, BE-016, QA-004, UI-016, API-001, el diseno BE-012/BE-017 de Agenda Operativa, la implementacion DB inicial BE-028, la validacion runtime local BE-029 y la integracion interna UI-025/UI-025B de Agenda, junto con las decisiones clinicas/operativas y arquitectonicas clave que permiten avanzar sin romper el flujo definido.

PR #45 ya esta integrado en `main`: Agenda interna cuenta con lectura, alta y edicion controlada de `agenda_eventos`. PR #48 tambien quedo integrado: el modal suma selector calendario/horario, duracion controlada, fin calculado y validacion basica de solapamiento. PR #49 y PR #50 quedaron integrados en `main`: QA-008 queda cerrada como validacion funcional local/demo de Agenda interna, con validacion visual autenticada admin y correccion responsive movil UI-027 mediante menu superior y drawer lateral. BE-026 define el contrato documental de la futura API publica de agendamiento sobre `solicitudes_agenda`, sin endpoints reales. SEC-009 define el marco documental de seguridad, DOC-004 documenta el flujo pagina publica -> API -> sistema interno -> Google, BE-020 define la base documental de consentimiento/tratamiento de datos pendiente de validacion clinica/legal, SEC-005 define el modelo documental de auditoria de cambios sensibles, BE-021 define la politica documental de anulacion vs eliminacion y BE-018/DOC-001/DOC-003 ordenan ambientes y carga de datos reales. API publica funcional, Google Calendar/Gmail y produccion siguen en espera.

UI-026 incorpora selector de fecha, selector de hora, duracion controlada, fin calculado y validacion basica de solapamiento con buffer operativo de 15 minutos para consultas. El cambio se mantiene en UI interna; no modifica DB, RLS, API publica ni Google. UI-027 quedo integrado en `main` y ajusta el shell responsive para que Agenda no presente overflow horizontal en mobile y la navegacion se despliegue desde el costado izquierdo.

La estrategia progresiva Google Cloud queda incorporada como propuesta documental en revision: Supabase/PostgreSQL sigue siendo la base actual y Google Cloud queda como plataforma futura para API segura, integracion Google Workspace, despliegue, automatizacion y operacion por ambientes.

IMP-001 dejo disponible una implementacion funcional minima de hallazgos operativos dentro de `DetalleRevisionesPanel`. DATA-001 dejo un seed local demo integral ejecutado correctamente en Supabase local. BE-011 confirmo que la primera version de trazabilidad hallazgo a trabajo puede usar `trabajos.revision_hallazgo_origen_id` sin migracion inicial. QA-002 valido funcionalmente el flujo de hallazgos operativos con el caso demo DATA-001 en ambiente local. BE-016 incorporo la vista financiera minima para Finanzas, QA-004 la valido localmente y UI-016 separo `ReportesPage` por rol en main mediante PR #33.

El proyecto se mantiene alineado con el metodo acordado: primero documentar, auditar y decidir; luego implementar por tareas aprobadas.

## Aprobado / integrado

- Repositorio oficial de trabajo: `4ndres30/terapeutas-australes-app`.
- Rama estable de referencia: `main`.
- Sistema de chats del proyecto:
  - Control de desarrollo.
  - Revision de flujo clinico.
  - Integracion estructura / backend.
  - UI / UX / Pulido visual.
- Sistema de codigos, estados y prioridades definido en `README.md`.
- Carpeta de control documental: `docs/control/`.
- QA-001: auditoria inicial del proyecto integrada.
- BE-001: inventario backend/Supabase integrado.
- RFC-001: revision de flujo clinico integrada.
- DEC-006: revisiones y detalle de revisiones viven dentro de la ficha del caso.
- DEC-007 a DEC-012: decisiones clinicas/operativas derivadas de BE-001 y RFC-001 integradas.
- BE-002: alineacion backend con flujo clinico aprobado integrada.
- UI-001 + UI-002: auditoria visual y revision de formularios del flujo clinico integradas.
- BE-003: criterios para futuras migraciones integrada.
- BE-010: plan tecnico de hallazgos operativos integrado.
- UI-011: diseno del panel operativo de hallazgos integrado y llevado a implementacion funcional minima por IMP-001.
- IMP-001: hallazgos operativos en `DetalleRevisionesPanel` integrado por PR #16.
- DATA-001: seed local de caso demo integral integrado por PR #17 y ejecutado correctamente en Supabase local.
- BE-011: trazabilidad hallazgo a trabajo integrada documentalmente por PR #18.
- QA-002: validacion funcional local de hallazgos operativos con caso demo DATA-001 aprobada.
- SEC-001: validacion runtime local de roles, RLS y Storage integrada por PR #30 con observaciones.
- BE-016: vista financiera minima `public.vista_finanzas_unidades_cobrables` integrada por PR #31.
- QA-004: validacion funcional local de BE-016 / Finanzas integrada por PR #32.
- UI-016: reportes separados por rol integrados por PR #33.

## En revision / planificacion

- Implementacion funcional hallazgo a trabajo: pendiente futura, posterior a QA-002 y UI-012.
- UI-010, UI-012 y UI-015: prioridades de planificacion UI derivadas de UI-001 + UI-002 y del estado post IMP-001.
- UI-013, UI-014, UI-017, UI-018 y UI-019: pendientes UI derivados, aun sin activacion tecnica.
- UI-025/UI-025B/UI-026/UI-027: Agenda operativa cuenta con vista interna, filtros, gestion manual minima de `agenda_eventos`, selector controlado de fecha/hora y correccion responsive del shell con drawer movil; QA-008 queda cerrada post-merge como validacion funcional local/demo, con desktop/admin y mobile sin overflow horizontal.
- BE-013 a BE-015: tareas backend sugeridas por BE-002 para cobros, vistas, RLS y reportes.
- API-001, BE-026, BE-027, SEC-009 y DOC-004: estrategia futura para API publica segura, contrato de agendamiento, integracion Google Workspace, seguridad API y flujo pagina publica -> API -> sistema interno -> Google.
- CTRL-009, DEC-035, BE-030, SEC-010, DOC-005 y QA-007: estrategia progresiva Google Cloud en revision documental; no migra base de datos, Auth ni produccion.
- RFC-002: deteccion de duplicidades entre entidades clinicas.

## Pendiente operativo

- Mantener la implementacion funcional hallazgo a trabajo como pendiente futura; no crear trabajo automaticamente.
- Mantener UI-010, UI-012 y UI-015 como prioridades de planificacion.
- Sincronizar periodicamente `01_PENDIENTES_PROYECTO.md` cuando una tarea cambie de estado.
- Mantener `06_BITACORA_CAMBIOS.md` actualizado despues de cada bloque documental o tecnico relevante.
- Mantener `QA008-OBS-003` como corregida por UI-027 y usar el cierre QA-008 como precondicion documental para evaluar `BE-026`.
- Atender observaciones de SEC-001 antes de avanzar a datos reales, fotos reales, pagos reales o produccion.

## Estrategia futura de API publica

API-001 registra la necesidad arquitectonica futura de una API segura entre la pagina publica de Terapeutas Australes, el sistema interno, Supabase y Google Calendar/Gmail/Workspace.

La API no esta implementada y no habilita produccion, datos reales, fotos reales ni pagos reales. BE-026 define solo el contrato documental futuro bajo `/api/v1`, usando `solicitudes_agenda` como destino conceptual. SEC-009 define CORS, rate limit, anti-spam, validacion, idempotencia, errores neutros, logs y separacion de ambientes como requisitos de seguridad. DOC-004 ordena el flujo futuro desde formulario publico hasta revision interna y eventual sincronizacion Google.

La pagina publica no debe escribir directamente en tablas clinicas, financieras ni internas. Tampoco debe consultar agenda interna completa ni exponer estructura de Supabase.

La integracion con Google Calendar y Gmail/Workspace debe pasar por backend controlado, con secretos fuera del frontend, eventos neutros, correos neutros, validacion, consentimiento segun BE-020, auditoria y revision interna previa.

La implementacion futura depende de validar clinica/legalmente BE-020, implementar separacion real de ambientes, implementar auditoria sensible, cerrar backup/restauracion y cerrar PROD-001.

## Estrategia futura Google Cloud

Google Cloud queda definido como plataforma futura para API segura, integracion Google Workspace, despliegue, automatizacion y operacion por ambientes.

Supabase/PostgreSQL sigue siendo la base actual. Supabase Auth, RLS y el modelo vigente no se migran en esta fase.

La migracion sera progresiva, documentada y reversible. Cloud Run, Firebase App Hosting y Cloud Functions quedan solo como opciones futuras evaluables; no estan implementadas ni autorizan produccion.

Google Calendar y Gmail deben integrarse solo desde backend seguro, nunca desde frontend publico ni con secretos versionados.

En esta fase no se crean proyectos, credenciales, secretos, service accounts, endpoints ni infraestructura Google Cloud.

PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

## Diseno de Agenda Operativa

BE-012/BE-017 define que Agenda no debe confundirse con una consulta clinica confirmada ni con una API publica operativa.

La arquitectura recomendada separa:

- `solicitudes_agenda`: solicitud inicial de hora o contacto.
- `agenda_eventos`: evento interno tipificado.
- `consultas`: atencion/contacto/cita confirmada asociada a paciente real.

BE-028 implementa el modelo DB inicial versionado para Agenda operativa mediante migracion local:

```text
supabase/migrations/20260701040000_crear_modelo_agenda_operativa.sql
```

El modelo crea `solicitudes_agenda`, `agenda_eventos` y `vista_agenda_operativa` con RLS para `admin`/`terapeuta`, sin acceso directo para `anon` ni `finanzas`.

BE-029 valido el runtime local/demo de este modelo:

- estructura, seguridad, roles y vista: 30/30 OK;
- checks, FKs y triggers: 17/17 OK;
- `agenda_eventos` por rol: 11/11 OK;
- no se crean pacientes ni consultas automaticamente;
- no se toco Supabase remoto ni se ejecuto `supabase db push`.

UI-025 integra `/agenda` como primera vista interna de lectura desde `public.vista_agenda_operativa`, con filtros por contexto/estado y separacion visual entre solicitudes vinculadas, eventos internos y consultas confirmadas.

UI-025B agrega alta y edicion manual minima sobre `agenda_eventos` para usuarios internos autorizados, incluyendo cambio de estado, cancelacion logica, reagendamiento y cierre como completado. No crea pacientes, consultas ni solicitudes automaticamente.

QA-008 valida Agenda interna en entorno local/demo: creacion, edicion, reagendamiento, completado, cancelacion sin delete y no efectos colaterales pasan en Supabase local. La revision visual autenticada desktop/admin confirma el flujo de alta, edicion, reagendamiento, acciones rapidas y bloqueo de solapamiento. La pasada post-merge sobre `main` confirma que UI-027 deja desktop `1280x720`, mobile `390x844` y mobile `360x740` sin overflow horizontal. Agenda aun no tiene API publica real, Google Calendar, Gmail ni produccion habilitada.

UI-026 mejora el modal de Agenda con seleccion de fecha por calendario, hora de inicio en intervalos de 15 minutos, duracion por opciones controladas y fin calculado. Para consultas se usa duracion estandar de 60 minutos y buffer operativo de 15 minutos en la validacion de solapamientos.

Este diseno es insumo de `BE-026`, porque el contrato publico debe crear solicitudes de agenda y no consultas clinicas directas. BE-026 queda como diseno documental de contrato y SEC-009 como diseno documental de seguridad, manteniendo `BE-027` Google Calendar/Gmail en espera y sin habilitar produccion.

PROD-001 sigue bloqueante para cualquier uso con datos reales.

## Estado para uso real con datos sensibles

**Estado:** No listo para datos reales como sistema oficial.

El proyecto está habilitado solo para pruebas locales/demo con datos ficticios.

Antes de cargar pacientes reales deben cerrarse las tareas minimas de PROD-001 y las observaciones derivadas de SEC-001:

- separacion tecnica de ambientes documentada por BE-018/DOC-001, pendiente implementacion real;
- validación runtime de RLS por rol;
- matriz de permisos;
- hardening Auth;
- backup/restauración probado;
- consentimiento informado;
- auditoría de cambios sensibles;
- política de datos demo vs reales;
- checklist pre-producción.

**Decisión:** No cargar datos reales todavía.

### Avance SEC-002

SEC-002 ya cuenta con matriz documental de permisos esperados por tabla y rol. La matriz define permisos para `admin`, `terapeuta` y `finanzas`, y queda como insumo obligatorio para SEC-001.

SEC-001 ya fue ejecutada en local y quedo aprobada con observaciones. BE-016 y UI-016 ya resolvieron la vista financiera minima y la separacion de reportes por rol en main. Siguen pendientes:

- SEC-005: diseno documental de auditoria sensible registrado, pendiente implementacion real.
- BE-021: politica documental de anulacion logica vs eliminacion fisica registrada, pendiente implementacion real.
- Hardening posterior de grants para fotos/Storage antes de datos reales.

El proyecto sigue no listo para datos reales como sistema oficial.

### Avance SEC-004

SEC-004 define que Finanzas debe operar con alias administrativo, identificador interno y datos financieros mínimos. Finanzas no debe ver ficha completa del paciente, datos clínicos sensibles ni archivos clínicos asociados.

El nombre completo, teléfono y email quedan prohibidos por defecto o pendientes de aprobación expresa y consentimiento.

El proyecto sigue no listo para datos reales como sistema oficial.

### Avance BE-016 / QA-004

BE-016 quedo integrado por PR #31. `FinanzasPage` consume `public.vista_finanzas_unidades_cobrables` y dejo de consultar `pacientes`, `pagos` directo y `vista_cobros_estado`.

QA-004 quedo integrado por PR #32. La validacion funcional local confirmo que Finanzas opera sobre datos financieros minimos y no ve nombre completo, telefono, email, motivo de consulta, hallazgos, fotos, miniaturas ni `storage_path`.

Este avance no habilita datos reales, fotos reales, pagos reales ni produccion.

### Avance UI-016

UI-016 quedo integrado por PR #33. `ReportesPage` separa superficies por rol:

- Admin: reportes generales, clinicos, financieros y operativos autorizados.
- Terapeuta: reportes clinicos sin panel financiero completo.
- Finanzas: reportes financieros desde `public.vista_finanzas_unidades_cobrables`.

Finanzas no debe ver reportes clinicos, pacientes clinicos, consultas, casos, hallazgos, trabajos clinicos sensibles, fotos, miniaturas ni `storage_path`.

Este avance no habilita datos reales, fotos reales, pagos reales ni produccion.

### Avance fotos de elementos del caso

BE-022 / UI-022 incorpora una primera version local/demo para asociar fotos a elementos del caso mediante Supabase Storage privado y `public.fotos_elementos_caso`.

La columna antigua `elementos_caso.foto_url` queda deprecada para uso operativo principal.

Las fotos de elementos del caso se consideran archivos clinicos sensibles. Finanzas no debe ver fotos ni rutas de Storage asociadas.

Este avance no cambia el bloqueo PROD-001: la funcionalidad requiere QA-003, atender observaciones SEC-001 y definir politicas de auditoria antes de cualquier uso con datos reales.

### Avance SEC-001

SEC-001 valida runtime local de roles, RLS y Storage con datos ficticios y transacciones revertidas.

Resultado: aprobado con observaciones. La matriz runtime confirma que `admin` y `terapeuta` acceden a clinica, fotos y Storage privado; `finanzas` queda limitado a cobros/pagos y no accede a fotos, rutas Storage, elementos clinicos, revisiones, hallazgos ni trabajos sensibles.

Observaciones pendientes antes de datos reales:

- endurecer grants amplios en `public.fotos_elementos_caso` y revisar defaults de Storage;
- mantener BE-016 como superficie financiera minima autorizada y revisar si `paciente_id` debe seguir visible para Finanzas;
- validar funcionalmente reportes por rol mediante QA-005;
- definir auditoria de accesos/cambios sensibles;
- implementar politica de anulacion logica vs delete fisico antes de datos reales.

Informe: `docs/control/auditorias/SEC-001_VALIDACION_RUNTIME_RLS_ROLES.md`.

El proyecto sigue no listo para datos reales como sistema oficial.

## No debe tocarse sin instruccion expresa

- `.env`.
- Supabase remoto.
- Migraciones existentes.
- Codigo fuente de la aplicacion.
- Base de datos local o remota.
- Rama `main` sin PR aprobado por Javier.

## Lectura inicial recomendada

1. `README.md`.
2. `00_ESTADO_GENERAL_PROYECTO.md`.
3. `01_PENDIENTES_PROYECTO.md`.
4. Documento del chat responsable segun la tarea.
5. `05_DECISIONES_PROYECTO.md`.
6. `06_BITACORA_CAMBIOS.md`.

## CTRL-001 - Mantener centro de mando documental

**Estado:** En proceso
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Javier
**Fecha creacion:** 2026-06-11
**Rama sugerida:** `docs/control-proyecto`
**Dependencias:** Ninguna

### Descripcion
Mantener actualizado el estado general, los pendientes, las decisiones y la bitacora del proyecto para evitar duplicidades y perdida de contexto.

### Archivos relacionados
- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Los documentos existen y son faciles de leer.
- Las tareas usan codigos, estados y prioridades permitidas.
- Las restricciones criticas estan visibles.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main` sin aprobacion.

### Resultado
Centro documental creado y en mantenimiento activo.

### Observaciones
Esta tarea es continua durante el desarrollo del proyecto.

## CTRL-002 - Sincronizar documentacion maestra tras BE-002

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-12
**Rama sugerida:** `docs/control-sync-be002`
**Dependencias:** QA-001, BE-001, RFC-001, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012, BE-002

### Descripcion
Actualizar estado general, pendientes y bitacora para reflejar que QA-001, BE-001, RFC-001, DEC-007 a DEC-012 y BE-002 ya fueron integradas.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Reflejar tareas integradas y pendientes reales.
- Mantener trazabilidad hacia informes y decisiones.
- No modificar codigo fuente.
- No modificar migraciones.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### Resultado
Sincronizacion documental preparada para integracion mediante PR.

### Observaciones
Despues de esta sincronizacion, el siguiente bloque debe priorizar implementacion backend BE-010 en adelante o auditoria UI/UX segun definicion de Javier.

## CTRL-003 - Sincronizar documentacion maestra tras UI-001/UI-002 y BE-003

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-13
**Rama sugerida:** `docs/ctrl-003-sincronizacion-final`
**Dependencias:** UI-001, UI-002, BE-003

### Descripcion
Actualizar estado general, pendientes y bitacora para reflejar que UI-001, UI-002 y BE-003 ya fueron integradas.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Reflejar UI-001, UI-002 y BE-003 como integradas.
- Registrar UI-010 a UI-019 como pendientes derivados.
- Mantener BE-010 como siguiente prioridad tecnica recomendada.
- Registrar las tareas sugeridas por BE-003 como no activas al momento de CTRL-003.
- No modificar codigo fuente.
- No modificar migraciones.
- No tocar `.env`.
- No ejecutar Supabase.
- No ejecutar `supabase db push`.
- No tocar Supabase remoto.
- No modificar datos reales.
- No hacer merge a `main`.

### Resultado
Sincronizacion documental preparada para integracion mediante PR.

### Observaciones
El siguiente bloque recomendado queda como BE-010 coordinado con UI-011, manteniendo BE-010, UI-010, UI-011, UI-012 y UI-015 como prioridades de planificacion.

## CTRL-004 - Sincronizar control post IMP-001, DATA-001 y BE-011

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-17
**Rama sugerida:** `docs/ctrl-004-sync-post-imp-data-be011`
**Dependencias:** IMP-001, DATA-001, BE-011

### Descripcion
Sincronizar documentos maestros de control despues de integrar hallazgos operativos, seed local demo integral y trazabilidad documental hallazgo a trabajo.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/auditorias/CTRL-004_SINCRONIZACION_POST_IMP_DATA_BE011.md`

### Criterios de aceptacion
- Registrar IMP-001, DATA-001 y BE-011 como integrados.
- Registrar QA-002 como siguiente validacion funcional.
- Registrar UI-012 como siguiente tarea UI.
- Confirmar decisiones sobre `trabajos.revision_hallazgo_origen_id`, ausencia de tabla puente inicial y no automatizacion de trabajos/cobros/sesiones/acciones.
- No modificar codigo fuente.
- No modificar migraciones.
- No tocar `.env`.
- No ejecutar Supabase.
- No ejecutar `supabase db push`.
- No tocar Supabase remoto.
- No modificar datos reales.
- No hacer merge a `main`.

### Resultado
Sincronizacion documental integrada. QA-002 ya cerro la validacion funcional local de hallazgos operativos con el caso demo DATA-001.

### Observaciones
UI-012 queda como siguiente tarea UI posterior. La implementacion funcional hallazgo a trabajo queda como pendiente futuro.

## QA-001 - Auditoria inicial del proyecto

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Control de desarrollo
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Rama sugerida:** `docs/auditoria-control-proyecto`
**Dependencias:** CTRL-001

### Descripcion
Auditar el estado tecnico inicial del proyecto sin modificar codigo, migraciones, base de datos ni configuracion sensible.

### Archivos relacionados
- `docs/control/`
- `src/`
- `supabase/`
- `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`

### Criterios de aceptacion
- Identificar pantallas, rutas y modulos relevantes.
- Identificar servicios, tipos y hooks relevantes.
- No modificar archivos de codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main` sin aprobacion.

### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`.

### Observaciones
QA-001 queda reservada como auditoria inicial, no como implementacion ni tarea pendiente reutilizable.

## QA-002 - Validacion funcional de hallazgos operativos con caso demo

**Estado:** Aprobada
**Prioridad:** Alta
**Responsable:** Control de desarrollo / Revision de flujo clinico
**Origen:** IMP-001 + DATA-001 + BE-011
**Fecha validacion:** 2026-06-17
**Rama revisada:** `main`
**Dependencias:** IMP-001, DATA-001, BE-011

### Descripcion
Validar funcionalmente el guardado real de un hallazgo nuevo desde la UI usando el caso demo `DATA-001 - Caso Demo Integral`.

### Archivos relacionados
- `docs/control/auditorias/QA-002_VALIDACION_HALLAZGOS_OPERATIVOS.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`

### Resultado
Aprobada funcionalmente en ambiente local. Se valido visualizacion del caso demo, hallazgo precargado, modales, herencia de contexto, creacion manual de nuevo hallazgo, persistencia tras recarga, visibilidad en `Hallazgos de esta revision`, prevencion de duplicado visual y boton `Evaluar trabajo proximamente` deshabilitado.

### Observaciones
QA-002 habilita avanzar a UI-012. No se implemento conversion hallazgo -> trabajo.
