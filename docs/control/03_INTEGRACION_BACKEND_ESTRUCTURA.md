# Integracion backend / estructura

Responsable: Integracion Backend/Estructura
Estado del documento: En análisis
Fecha creacion: `2026-06-11`

Este documento controla tareas tecnicas relacionadas con estructura, Supabase, migraciones, vistas SQL, servicios, tipos, hooks y logica funcional. Las tareas tecnicas deben venir aprobadas por Control de desarrollo o por una decision registrada.

## Alcance futuro permitido con tarea aprobada

- Revisar estructura Supabase local.
- Revisar migraciones existentes.
- Proponer nuevas migraciones.
- Revisar vistas SQL.
- Revisar tipos TypeScript.
- Revisar servicios y hooks.
- Implementar logica funcional aprobada.

## Restricciones actuales

Por defecto, salvo tarea tecnica expresamente autorizada como SEC-008:

- No modificar codigo fuente sin alcance aprobado.
- No modificar migraciones.
- No ejecutar SQL.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No fusionar a `main`.

## Criterio de entrada para una tarea backend

Una tarea backend debe indicar:

- Decision o pendiente que la origina.
- Rama sugerida.
- Archivos o modulos relacionados.
- Si requiere migracion, vista, servicio, hook o tipo.
- Criterios de aceptacion verificables.
- Riesgos de datos o compatibilidad.

## Estado post BE-011

BE-011 queda integrada documentalmente por PR #18.

La decision tecnica registrada es que la primera version de trazabilidad hallazgo a trabajo usara `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal. No se requiere migracion inicial para ese alcance.

La tabla puente `trabajo_hallazgos` no se crea en esta etapa. Queda como alternativa futura solo si se confirma una necesidad real muchos-a-muchos que no pueda resolverse con `revision_hallazgo_origen_id`, `trabajo_elementos.revision_hallazgo_id` o `trabajo_acciones.revision_hallazgo_id`.

La implementacion funcional hallazgo a trabajo queda pendiente para una tarea futura, posterior a QA-002 y UI-012.

## CTRL-008 - Decisiones backend derivadas post auditoria

**Estado:** Integrada
**Origen:** CTRL-008 / Auditoria integral post PR #35
**Fecha:** 2026-06-29

CTRL-008 registra decisiones criticas que deben resolverse antes de nuevas migraciones de seguridad/backend o antes de uso con datos reales.

### Decisiones backend relevantes

- Finanzas no deberia ver `paciente_id` real por defecto. BE-023 debe definir alias/codigo administrativo persistente o identificador financiero no clinico antes de datos reales.
- Terapeuta no deberia administrar cobros/pagos desde ficha clinica. Si Control aprueba visibilidad, debe ser estado minimo y no detalle financiero.
- La primera version debe tratar un aspecto revisado como origen de maximo un hallazgo activo, salvo decision clinica distinta. BE-024 debe resolver si esto requiere constraint DB o ajuste UI.
- IMP-002 mantiene `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal y no crea tabla puente en la primera version.
- BE-021 debe definir anulacion logica transversal. Produccion no debe depender de delete fisico operativo para datos clinicos, financieros, fotos o usuarios internos.
- BE-025 debe definir campos financieros permitidos/prohibidos para evitar que `concepto_cobro`, `descripcion_cobro`, `observaciones`, `notas_internas` o `referencia_pago` filtren clinica.
- SEC-006 debe resolver politica de fotos, retencion y objetos huerfanos antes de fotos reales.
- SEC-007 debe prohibir scripts manuales sobre Auth como practica normal de produccion.

### Tareas backend derivadas

- `BE-023` - Alias/codigo administrativo persistente para Finanzas.
- `BE-024` - Regla de hallazgo unico/multiple por aspecto revisado.
- `BE-025` - Campos financieros permitidos/prohibidos para Finanzas.
- `BE-021` - Anulacion logica transversal.
- `BE-018` - Separacion tecnica de ambientes.
- `BE-019` - Backup/restauracion.
- `BE-020` - Consentimiento informado y tratamiento de datos.

### Restricciones

CTRL-008 no crea migraciones, no modifica SQL existente, no toca `supabase/config.toml`, no toca `.env`, no ejecuta `supabase db push` y no toca Supabase remoto.

Informe relacionado: `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`

## SEC-003 - Hardening Auth / diseno documental

**Estado:** Integrada como diseno base
**Origen:** CTRL-008 / DEC-029 / DEC-030 / DEC-031
**Fecha:** 2026-06-29

SEC-003 analiza la configuracion local de Supabase Auth y define la politica objetivo antes de cualquier uso real.

### Estado tecnico observado

- `supabase/config.toml` mantiene Auth habilitado para entorno local/demo.
- Signup global y signup por email estan habilitados en configuracion local.
- Confirmacion de email esta deshabilitada.
- Password minimo actual es de 6 caracteres y sin complejidad.
- MFA TOTP/phone esta deshabilitado.
- `site_url` y redirects apuntan a entorno local.
- JWT expira en una hora y refresh token rotation esta habilitado.
- No hay `timebox` ni `inactivity_timeout` activos.
- `src/App.tsx` bloquea usuarios Auth sin `usuarios_internos`, usuarios inactivos y roles no validos.
- `src/pages/LoginPage.tsx` usa login por email/password y no implementa signup ni recuperacion operativa.

### Politica backend objetivo

- Staging/produccion no deben usar signup publico abierto.
- Altas deben realizarse por invitacion/provisioning administrado.
- Todo usuario Auth productivo debe tener registro activo en `usuarios_internos` y rol explicito.
- Password policy, email confirm, MFA, redirects y recuperacion deben definirse por ambiente.
- Scripts manuales sobre `auth.users` quedan prohibidos como practica normal en produccion.
- Eventos Auth y cambios de rol deben conectarse con SEC-005.

### Tareas tecnicas derivadas

- `SEC-008` - Implementacion controlada Hardening Auth.
- `SEC-005` - Auditoria sensible para eventos Auth y cambios de rol.
- `SEC-007` - Procedimiento de scripts manuales locales/demo.
- `BE-018` - Separacion tecnica de ambientes.
- `DOC-001` - Manual de ambientes.
- `QA-006` - Validaciones minimas por rol y estados Auth.

### Restricciones

SEC-003 no modifica `supabase/config.toml`, no crea migraciones, no modifica codigo fuente, no toca `.env`, no ejecuta `supabase db push` y no toca Supabase remoto.

Informe relacionado: `docs/control/auditorias/SEC-003_HARDENING_AUTH.md`

## SEC-008 - Implementacion controlada Hardening Auth

**Estado:** Implementada parcialmente / pendiente validacion PR
**Origen:** SEC-003 / DEC-029 / DEC-030 / DEC-031 / DEC-032
**Fecha:** 2026-06-30

SEC-008 aplica solo controles seguros para local/demo y documenta lo que debe quedar para staging/produccion.

### Cambios tecnicos aplicados

- `supabase/config.toml` sube `minimum_password_length` de 6 a 8.
- `supabase/config.toml` exige `password_requirements = "lower_upper_letters_digits"`.
- `supabase/config.toml` habilita `auth.sessions` con `timebox = "24h"` e `inactivity_timeout = "8h"`.
- `src/pages/LoginPage.tsx` deja de mostrar errores crudos de Supabase en login.
- `src/App.tsx` deja de mostrar mensajes tecnicos al validar sesion o `usuarios_internos`.
- Se mantiene el bloqueo de usuarios Auth sin perfil interno, usuarios inactivos y roles invalidos.

### Cambios no aplicados

- No se cerro signup local por falta de provisioning Auth versionado.
- No se habilito email confirm local por riesgo de bloquear cuentas demo no confirmadas.
- No se habilito MFA por falta de UI de enrolamiento/verificacion.
- No se implemento recovery por falta de flujo de correo/UI/procedimiento.
- No se crearon migraciones.
- No se toco Supabase remoto.

### Tareas derivadas

- `SEC-008B` - Cierre de signup y provisioning Auth controlado.
- `UI-024` - Recuperacion de cuenta, MFA y estados Auth no tecnicos.
- `SEC-005` - Auditoria sensible Auth y cambios de rol.
- `SEC-007` - Procedimiento de scripts manuales locales/demo.
- `BE-018` - Separacion tecnica de ambientes.
- `DOC-001` - Manual de ambientes.
- `QA-006` - Validacion de casos Auth minimos.

### Restricciones

SEC-008 no toca `.env`, no modifica migraciones, no ejecuta `supabase db push`, no ejecuta `supabase db pull`, no toca Supabase remoto y no habilita datos reales, fotos reales, pagos reales ni produccion.

Informe relacionado: `docs/control/auditorias/SEC-008_IMPLEMENTACION_HARDENING_AUTH.md`

## API-001 - API publica segura e integracion Google Workspace

**Estado:** Diseno arquitectonico documental / pendiente implementacion futura
**Origen:** Solicitud arquitectura API publica / DEC-033
**Fecha:** 2026-06-30

API-001 registra que una futura pagina publica de Terapeutas Australes no debe conectarse directamente a tablas clinicas, financieras ni internas de Supabase.

La API futura debe actuar como frontera entre pagina publica, sistema interno, base de datos y Google Calendar/Gmail/Workspace.

### Estado tecnico observado

- No existe API real ni backend propio implementado.
- No existen endpoints funcionales para agendamiento publico.
- Agenda sigue sin backend operativo dedicado.
- El sistema interno consume Supabase desde React como aplicacion autenticada, pero ese patron no debe usarse para una pagina publica.
- No existe integracion funcional con Google Calendar, Gmail, Workspace o Google Cloud.
- PROD-001 sigue bloqueante para datos reales y produccion.

### Reglas backend futuras

- La pagina publica no debe escribir directo en tablas clinicas o financieras.
- Los endpoints publicos deben validar payloads, sanitizar campos, aplicar CORS estricto, rate limit, anti-spam, idempotencia y errores neutros.
- Los endpoints internos deben separarse de los endpoints publicos por autenticacion, autorizacion y superficie de datos.
- Google Calendar y Gmail/Workspace deben integrarse desde backend controlado, nunca desde frontend publico.
- Calendar y correos deben usar informacion neutra, sin motivos clinicos o energeticos sensibles.
- Los secretos deben vivir fuera del frontend y separados por ambiente.

### Tareas derivadas

- `BE-026` - Disenar contrato de API publica de agendamiento.
- `BE-027` - Disenar integracion Google Calendar / Gmail / Workspace.
- `SEC-009` - Disenar seguridad de API publica.
- `DOC-004` - Documentar flujo pagina publica -> API -> sistema interno -> Google.

### Dependencias

Antes de implementar API real deben cerrarse o aprobarse BE-012, BE-017, BE-018, BE-019, BE-020, SEC-005, SEC-009, DOC-001, DOC-003 y PROD-001.

### Restricciones

API-001 no crea backend, no crea endpoints, no instala dependencias, no crea migraciones, no modifica RLS/Auth, no toca `.env`, no toca Supabase remoto y no habilita datos reales ni produccion.

Informe relacionado: `docs/control/auditorias/API-001_DISENO_API_PUBLICA_GOOGLE_WORKSPACE.md`

## BE-001 - Inventariar estructura backend y Supabase local

**Estado:** Integrada
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Fecha documentacion:** 2026-06-12
**Rama sugerida:** `docs/be-001-inventario-backend`
**Dependencias:** PEND-001

### Descripcion
Revisar la estructura tecnica existente para identificar migraciones, tablas esperadas, tipos, servicios, hooks y consultas relevantes. Esta tarea es de auditoria documental y no debe ejecutar cambios.

### Archivos relacionados
- `supabase/migrations/`
- `src/`
- `package.json`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`

### Resumen ejecutivo
- BE-001 queda documentada como inventario backend y Supabase local.
- Se detectaron tablas clinicas base, tablas de revisiones, hallazgos, trabajos, finanzas y usuarios internos.
- Se detecto la vista `vista_cobros_estado`.
- Se detectaron triggers de `updated_at`, validacion de relaciones y actualizacion de estado financiero.
- Se detecto RLS activo para tablas clinicas, financieras y usuarios internos.
- React consume Supabase desde paginas clinicas, paneles de caso, finanzas y reportes.
- Hay formularios operativos para pacientes, consultas, evaluaciones, casos, elementos, revisiones y aspectos.
- No se detecto formulario operativo para hallazgos, trabajos, cobros ni pagos.
- Agenda no tiene tabla backend dedicada.
- La auditoria detecto desalineaciones React/Supabase que requieren tareas posteriores.
- Las observaciones tecnicas quedan registradas en el informe detallado.

### Informe detallado
- [`BE-001_INVENTARIO_BACKEND_SUPABASE.md`](auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md)

### Criterios de aceptacion
- Listar migraciones existentes sin modificarlas.
- Listar servicios, hooks y tipos detectados.
- Identificar posibles desalineaciones con el flujo clinico.
- No ejecutar SQL.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`.

### Observaciones
No se corrigieron errores ni se modifico logica. Las desalineaciones detectadas deben transformarse en tareas posteriores y pasar por Control de Desarrollo antes de implementarse.

## BE-002 - Comparar backend con flujo clinico aprobado

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Fecha documentacion:** 2026-06-12
**Rama sugerida:** `docs/be-002-alineacion-backend-flujo-clinico`
**Dependencias:** RFC-001, BE-001, DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012

### Descripcion
Comparar la estructura tecnica existente con las responsabilidades clinicas aprobadas para detectar campos, relaciones o servicios que requieran ajuste futuro.

### Archivos relacionados
- `supabase/migrations/`
- `src/`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`

### Resumen ejecutivo
- BE-002 valida que el backend esta alineado con el flujo clinico aprobado.
- `revision_aspectos` soporta el registro de lo medido u observado.
- `revision_hallazgos` esta bien trazado hacia caso, revision, elemento y aspecto.
- Hallazgos debe operar dentro del detalle de revision, no como modulo principal.
- `trabajos`, `trabajo_sesiones` y `trabajo_acciones` estan correctamente separados.
- Falta flujo operativo completo para hallazgos, trabajos, sesiones y acciones.
- Agenda no tiene backend dedicado y debe diseñarse como modulo mixto tipificado.
- Cobros/pagos requieren reforzar la regla de unidad cobrable para evitar duplicidad.
- RLS existe, pero debe validarse runtime por roles.
- Reportes requieren evolucionar hacia vistas o separacion por rol.

### Informe detallado
- [`BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`](auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md)

### Criterios de aceptacion
- Separar hallazgos de estructura, datos y logica.
- No proponer cambios visuales.
- No modificar migraciones.
- No ejecutar cambios de base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`.

### Observaciones
BE-002 no implementa cambios. Habilita planificar tareas tecnicas posteriores desde BE-010 en adelante, previa revision de Control de Desarrollo.

## BE-003 - Preparar criterios para futuras migraciones

**Estado:** Aprobada con observaciones
**Prioridad:** Media
**Responsable:** Integracion Backend/Estructura
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Fecha documentacion:** 2026-06-12
**Rama sugerida:** `docs/be-003-criterios-migraciones`
**Dependencias:** BE-001, BE-002

### Descripcion
Definir criterios minimos para crear, revisar, probar y aprobar futuras migraciones de Supabase/PostgreSQL sin afectar `.env`, Supabase remoto ni `main`.

### Archivos relacionados
- `supabase/migrations/`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`

### Resumen ejecutivo
- BE-003 queda documentada como pauta tecnica para futuras migraciones.
- Define criterios previos antes de crear migraciones.
- Define estructura recomendada de migraciones y orden seguro de cambios.
- Registra checklist previo y posterior a ejecucion local.
- Refuerza reglas de seguridad: no tocar `.env`, no usar `supabase db push`, no tocar Supabase remoto y no modificar datos reales.
- Define criterios para PRs con migraciones y validacion por Control de Desarrollo.
- Define criterios por tipo de cambio: tablas, columnas, checks, FK, indices, triggers, vistas, RLS/policies y funciones SQL.
- Establece criterios especiales para BE-010 a BE-017.
- Sugiere tareas posteriores BE-018 a BE-021 como propuestas, no activas.

### Informe detallado
- [`BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`](auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md)

### Criterios de aceptacion
- Definir checklist previo a migracion.
- Definir checklist posterior a migracion local.
- Reforzar que `supabase db push` esta prohibido salvo instruccion expresa futura.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No crear migraciones todavia.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`.

### Observaciones
BE-003 no crea migraciones ni implementa cambios. Habilita planificar BE-010 a BE-017 bajo un marco seguro, revisable y alineado con el flujo clinico aprobado.

## BE-010 - Ajustar soporte operativo de hallazgos derivados de aspectos

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002 / Control de desarrollo
**Fecha creacion:** 2026-06-12
**Fecha documentacion:** 2026-06-13
**Rama sugerida:** `docs/be-010-plan-hallazgos-operativos`
**Dependencias:** DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, BE-002, BE-003, UI-011

### Descripcion
Definir el soporte tecnico minimo para operar `revision_hallazgos` dentro del detalle de revision, respetando que los hallazgos nacen desde aspectos revisados y viven dentro del caso.

### Archivos relacionados
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`
- `supabase/migrations/20260606042000_crear_tabla_revision_aspectos.sql`
- `supabase/migrations/20260606041000_crear_tabla_revision_elementos.sql`
- `supabase/migrations/20260606055000_activar_rls_y_policies.sql`
- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/RevisionesCasoPanel.tsx`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`

### Resumen ejecutivo
- BE-010 queda documentada como plan tecnico para hallazgos operativos.
- `revision_hallazgos` parece suficiente para iniciar soporte operativo minimo sin migracion inicial.
- La tabla mantiene trazabilidad hacia paciente, caso, revision, elemento de revision, elemento del caso y aspecto revisado.
- La brecha principal esta en frontend, servicio/hook y tipos TypeScript.
- La accion de crear hallazgo debe vivir dentro de `DetalleRevisionesPanel`.
- No debe crearse modulo principal independiente de hallazgos.
- No deben crearse trabajos automaticamente desde hallazgos.
- BE-011 queda fuera de alcance y debera tratar la trazabilidad hallazgo a trabajo.
- Debe coordinarse con UI-011 antes de la implementacion visual.

### Informe detallado
- [`BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`](auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md)

### Criterios de aceptacion
- Confirmar estado tecnico de `revision_hallazgos`.
- Confirmar si requiere migracion inicial.
- Definir flujo tecnico recomendado.
- Definir flujo esperado desde UI.
- Definir cambios futuros en frontend, servicio/hook y tipos TypeScript.
- Mantener hallazgos dentro del detalle de revision.
- No crear modulo principal independiente de hallazgos.
- No crear trabajos automaticamente.
- No modificar codigo fuente.
- No modificar migraciones.
- No crear migraciones.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`.

### Observaciones
BE-010 no implementa cambios. No requiere migracion inicial para el soporte operativo minimo. Requiere implementacion posterior en frontend, servicio/hook y tipos TypeScript. Debe coordinarse con UI-011. BE-011 queda fuera de alcance.

## BE-011 - Trazabilidad hallazgo → trabajo

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** Control de desarrollo / BE-010
**Fecha creacion:** 2026-06-16
**Fecha documentacion:** 2026-06-16
**Rama sugerida:** `docs/be-011-trazabilidad-hallazgo-trabajo`
**Dependencias:** BE-010, UI-011, DEC-007, DEC-008, DEC-009, DEC-010, DEC-012

### Descripcion
Diseñar la trazabilidad tecnica entre `revision_hallazgos` y `trabajos`, sin implementar cambios, migraciones ni codigo.

### Archivos relacionados
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`
- `supabase/migrations/20260606051000_crear_modulo_trabajos.sql`
- `src/hooks/useRevisionHallazgos.ts`
- `src/types/revisionHallazgos.ts`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `docs/control/auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`

### Resumen ejecutivo
- BE-011 queda documentada como informe tecnico de trazabilidad hallazgo a trabajo.
- La estructura actual permite vincular trabajos con hallazgos mediante `trabajos.revision_hallazgo_origen_id`.
- No se requiere migracion inicial para una primera version.
- La primera version debe usar un hallazgo origen principal por trabajo.
- La tabla puente `trabajo_hallazgos` queda como alternativa futura si se confirma necesidad muchos-a-muchos.
- No deben crearse trabajos automaticamente desde hallazgos.
- No deben crearse sesiones, acciones ni cobros automaticamente.
- Debe coordinarse con UI-012 para el flujo visual hallazgo a trabajo.
- Debe coordinarse con BE-013/BE-016 para evitar duplicidad financiera si el trabajo se cobra.

### Informe detallado
- [`BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`](auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md)

### Criterios de aceptacion
- Confirmar si `trabajos` permite vincularse a un hallazgo.
- Confirmar si `revision_hallazgo_origen_id` es suficiente para primera version.
- Definir si se requiere tabla puente futura.
- Definir escenarios uno a uno, uno a varios y varios a uno.
- Definir flujo tecnico recomendado.
- Definir validaciones frontend y base de datos.
- Definir riesgos clinicos, tecnicos y financieros.
- No modificar codigo fuente.
- No modificar migraciones.
- No crear migraciones.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No fusionar a `main`.

### Resultado
Integrada documentalmente por PR #18. Resultado registrado en `docs/control/auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`.

### Observaciones
La estructura actual permite vincular trabajos con hallazgos mediante `trabajos.revision_hallazgo_origen_id`, por lo que no se requiere migracion inicial. La primera version debe usar un hallazgo origen principal por trabajo. La tabla puente `trabajo_hallazgos` queda como alternativa futura si se confirma necesidad muchos-a-muchos.

## SEC-002 - Matriz de permisos por tabla y rol

**Estado:** Aprobada con observaciones como diseño documental.

Se documenta la matriz esperada de permisos para `admin`, `terapeuta` y `finanzas`. Esta matriz debe usarse como referencia para SEC-001, donde se probará runtime que RLS y policies se comporten según lo esperado.

### Decisiones relevantes

- Finanzas debe operar cobros/pagos y solo datos mínimos administrativos.
- Finanzas no debe acceder a datos clínicos sensibles.
- Terapeuta opera flujo clínico y trabajos, pero no administra cobros/pagos.
- Admin mantiene acceso transversal, preferentemente con anulación lógica antes que delete físico.
- Delete físico debe prohibirse en producción para datos clínicos y financieros.
- Reportes debe separarse por rol.

### Informe relacionado

`docs/control/auditorias/SEC-002_MATRIZ_PERMISOS_ROLES.md`

## SEC-004 - Alcance del rol Finanzas

**Estado:** Aprobada con observaciones como diseño documental.

Se define que el rol Finanzas debe operar con alias administrativo, identificador interno y datos financieros mínimos. No debe acceder a ficha completa del paciente, datos clínicos sensibles, elementos del caso, hallazgos, sesiones, acciones terapéuticas, fotos ni archivos clínicos asociados.

### Decisiones relevantes

- Finanzas debe operar cobros, pagos y reportes financieros.
- Finanzas debe usar alias administrativo o código financiero por defecto.
- Nombre completo, teléfono y email quedan prohibidos por defecto o pendientes de aprobación expresa y consentimiento suficiente.
- BE-016 ya diseño e integro una vista financiera minima por unidad cobrable.
- SEC-001 debe probar runtime que RLS bloquee acceso financiero a datos clínicos.
- BE-021 debe definir anulación lógica y prohibición de delete físico financiero en producción.

### Informe relacionado

`docs/control/auditorias/SEC-004_ALCANCE_ROL_FINANZAS.md`

## BE-022 - Soporte de fotos para elementos del caso

**Estado:** Implementada local / pendiente QA.

Se agrega soporte backend/local para fotos de elementos del caso usando Supabase Storage privado y tabla relacional de metadatos.

### Decisiones técnicas

- Bucket privado: `elementos-caso`.
- Tabla: `public.fotos_elementos_caso`.
- La columna `elementos_caso.foto_url` queda deprecada para uso operativo principal.
- No se habilita delete fisico para fotos en esta etapa.
- RLS y Storage policies se limitan a `admin` y `terapeuta`.
- Finanzas no accede a fotos de elementos ni rutas de Storage.
- La validacion relacional exige que paciente, caso y elemento coincidan.

### Migración relacionada

`supabase/migrations/20260619183000_crear_fotos_elementos_caso.sql`

### Informe relacionado

`docs/control/auditorias/BE-022_UI-022_FOTOS_ELEMENTOS_CASO.md`

## SEC-001 - Validacion runtime RLS / roles

**Estado:** Aprobada con observaciones.

SEC-001 ejecuto validacion runtime local de roles, RLS y Storage usando datos ficticios dentro de transacciones revertidas con `ROLLBACK`.

### Resultado tecnico

- `admin` accede a clinica, finanzas, fotos y Storage segun matriz esperada.
- `terapeuta` accede a clinica, fotos y Storage; queda bloqueado frente a `cobros`, `pagos` y `vista_cobros_estado`.
- `finanzas` accede a `cobros`, `pagos` y `vista_cobros_estado`; queda bloqueado frente a tablas clinicas, `fotos_elementos_caso` y bucket `elementos-caso`.
- `public.fotos_elementos_caso` cumple RLS runtime para `select`, `insert`, `update` y no permite delete fisico.
- `storage.objects` cumple RLS runtime para bucket `elementos-caso`; delete directo queda bloqueado por `storage.protect_delete()`.
- `vista_cobros_estado` usa `security_invoker=true`.

### Observaciones tecnicas

- `public.fotos_elementos_caso` mantiene grants amplios a `anon` y `authenticated`; RLS bloquea runtime, pero se recomienda hardening antes de datos reales.
- `storage.objects` mantiene grants amplios propios de Storage; RLS y trigger protegen, pero debe mantenerse bajo revision antes de produccion.
- `vista_cobros_estado` exponia IDs de origen clinico a Finanzas antes de BE-016. Desde PR #31 se mantiene para compatibilidad interna/admin y filtra con `public.es_admin()`.
- `public.vista_finanzas_unidades_cobrables` es la superficie minima autorizada para Finanzas.
- `cobros` permite a Finanzas leer columnas completas de la tabla; debe evitarse registrar informacion clinica en `descripcion_cobro`, `observaciones` o `notas_internas`.

### Informe relacionado

`docs/control/auditorias/SEC-001_VALIDACION_RUNTIME_RLS_ROLES.md`

## BE-016 - Vista financiera minima por unidad cobrable

**Estado:** Integrada por PR #31 / validada funcionalmente por QA-004 en PR #32.

Se crea `public.vista_finanzas_unidades_cobrables` como superficie minima para el rol Finanzas.

### Migracion relacionada

`supabase/migrations/20260627231000_crear_vista_finanzas_unidades_cobrables.sql`

### Resultado tecnico

- La nueva vista usa `security_invoker = true`.
- La nueva vista concede solo `select` a `authenticated`.
- Finanzas puede leer `vista_finanzas_unidades_cobrables`.
- Terapeuta no puede leer filas de la nueva vista porque RLS de `cobros`/`pagos` lo bloquea.
- Admin puede leer la nueva vista.
- `vista_cobros_estado` se mantiene para compatibilidad, pero ahora filtra con `public.es_admin()` y deja de devolver filas a Finanzas.
- `FinanzasPage` deja de consultar `pacientes`, `pagos` directo y `vista_cobros_estado`; consume solo `vista_finanzas_unidades_cobrables`.

### Campos expuestos

La vista expone identificadores y datos financieros minimos: `id_cobro`, `id_pago`, `paciente_id`, `codigo_paciente`, `alias_administrativo_paciente`, tipo/referencia administrativa de unidad cobrable, concepto administrativo, fechas, montos, moneda, estado de cobro y datos del ultimo pago.

### Campos excluidos

No expone nombre completo, telefono, email, IDs clinicos directos, motivo/resumen de consulta, relato/sintomas/hechos/personas, motivo o descripcion clinica de caso, elementos, hallazgos, notas internas clinicas, acciones terapeuticas, resultados, fotos, miniaturas ni `storage_path`.

### Validacion

Se valido localmente con datos ficticios en transaccion revertida con `ROLLBACK`. Todos los checks runtime por rol devolvieron OK.

QA-004 valido funcionalmente en local que Finanzas puede operar sobre la vista minima y no ve nombre completo, telefono, email, motivo de consulta, hallazgos, trabajos clinicos sensibles, fotos, miniaturas ni `storage_path`.

UI-016 quedo integrado por PR #33 y separa `ReportesPage` por rol. Finanzas consume reportes financieros desde `public.vista_finanzas_unidades_cobrables`.

### Informe relacionado

`docs/control/auditorias/BE-016_VISTA_FINANCIERA_MINIMA.md`
