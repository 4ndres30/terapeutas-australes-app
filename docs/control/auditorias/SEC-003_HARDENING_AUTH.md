# SEC-003 - Hardening Auth

## Estado

Diseno documental / pendiente implementacion tecnica.

## Fecha

2026-06-29

## Origen

CTRL-008 / DEC-029, DEC-030, DEC-031.

## Objetivo

Definir una politica de autenticacion segura antes de permitir datos reales, fotos reales, pagos reales o produccion.

SEC-003 no habilita produccion. La tarea deja criterios tecnicos, riesgos y tareas derivadas para una implementacion posterior controlada.

## Alcance

- Revision documental y tecnica en modo lectura.
- Revision de `supabase/config.toml`, `src/lib/supabase.ts`, `src/App.tsx`, `src/pages/LoginPage.tsx`, `package.json` y documentacion de control.
- Sin cambios tecnicos de Auth.
- Sin cambios en `supabase/config.toml`.
- Sin codigo fuente.
- Sin migraciones.
- Sin Supabase remoto.
- Sin datos reales, fotos reales ni pagos reales.

## Estado actual observado

### Configuracion local Supabase Auth

`supabase/config.toml` mantiene una configuracion orientada a desarrollo local:

- Auth habilitado.
- `site_url` apunta a entorno local.
- `additional_redirect_urls` contiene redireccion local.
- `jwt_expiry` esta definido en una hora.
- La rotacion de refresh tokens esta habilitada.
- `enable_signup = true`.
- Signup por email habilitado.
- Confirmacion de email deshabilitada.
- Longitud minima de password igual a 6.
- Sin requisitos de complejidad de password.
- Signup anonimo deshabilitado.
- Signup por SMS deshabilitado.
- MFA TOTP y phone deshabilitados.
- No hay `timebox` ni `inactivity_timeout` activos para sesiones.
- Los hooks Auth de Supabase estan comentados.

Esta configuracion es aceptable solo como base local/demo con datos ficticios. No es aceptable para produccion con datos clinicos, financieros o fotos reales.

### Flujo frontend observado

- `src/lib/supabase.ts` crea el cliente con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`; si faltan, la app falla en arranque.
- `src/pages/LoginPage.tsx` implementa inicio de sesion con email y password.
- No existe pantalla operativa de signup.
- No se observo flujo UI de recuperacion de password.
- La UI muestra el mensaje tecnico devuelto por Supabase cuando falla el login.
- `src/App.tsx` consulta `usuarios_internos` para validar que el usuario Auth tenga perfil interno activo y rol valido.
- Usuarios Auth sin perfil en `usuarios_internos` quedan bloqueados por la app.
- Usuarios internos con `activo = false` quedan bloqueados por la app.
- Las rutas se protegen por rol en frontend, pero la navegacion visible por rol sigue siendo tarea pendiente separada.

### Usuarios internos y RLS

La tabla `public.usuarios_internos` relaciona usuarios internos con `auth.users` y define `rol` y `activo`.

Las funciones RLS usan `auth.uid()` y `usuarios_internos.activo = true` para resolver rol y acceso. Esto es una base correcta, pero produccion requiere endurecer provisioning, desactivacion, auditoria de cambios de rol y prohibicion de scripts manuales.

### Seeds y scripts

No se observo `supabase/seed.sql`.

`supabase/dev-seeds/README.md` mantiene el criterio correcto: datos ficticios, uso local/demo y prohibicion de `supabase db push`.

Los scripts manuales tipo `console.sql` quedan cubiertos por DEC-029: solo local/demo, nunca como practica normal en produccion.

## Riesgos principales

1. Signup abierto en un ambiente real puede crear usuarios Auth no autorizados o huerfanos de `usuarios_internos`.
2. Password minimo de 6 caracteres y sin complejidad es debil para datos clinicos y financieros.
3. Email no confirmado permite cuentas con correo no verificado.
4. MFA deshabilitado deja Admin y Finanzas expuestos a toma de cuenta.
5. `site_url` y redirects locales no sirven para staging/produccion y pueden romper recuperacion, confirmacion o flujos de invitacion.
6. No hay politica documentada de expiracion por inactividad; sesiones largas son un riesgo en equipos compartidos.
7. No hay flujo documentado de recuperacion de cuenta para usuarios internos.
8. Cambios de rol, desactivaciones e invitaciones no tienen auditoria sensible definida.
9. Mensajes tecnicos de error Auth pueden exponer detalles innecesarios a usuarios finales.
10. Scripts manuales sobre `auth.users` pueden saltar confirmaciones, roles y trazabilidad si se normalizan fuera de local/demo.

## Politica objetivo por ambiente

| Ambiente | Signup | Email confirm | Password policy | MFA | Redirects | Datos permitidos | Usuarios demo | Restricciones |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LOCAL | Permitido solo para desarrollo controlado o usuarios ficticios. | Opcional en local. | Puede ser laxa para desarrollo, pero documentada como no productiva. | Opcional. | Solo URLs locales. | Ficticios. | Permitidos. | No datos reales, no fotos reales, no pagos reales, no Supabase remoto. |
| DEMO | Preferir cuentas demo precreadas o invitadas; signup publico no debe ser normal. | Recomendado. | Mejor que local; no usar passwords triviales. | Recomendado para Admin demo. | URLs demo exactas. | Ficticios o anonimizados no sensibles si Control lo aprueba. | Permitidos y rotulados. | No debe mezclarse con staging/produccion. |
| STAGING | Cerrado o solo invitacion/provisioning administrado. | Obligatorio. | Minimo fuerte y requisitos de complejidad. | Obligatorio para Admin y Finanzas; obligatorio para Terapeuta si se prueban flujos con datos sensibles o equivalentes. | URLs staging exactas y allowlist limitada. | Ficticios; reales solo si existe aprobacion explicita y base legal/documental. | No usar seeds demo productivos. | No usar remoto productivo; no copiar secretos entre ambientes. |
| PRODUCCION | Cerrado; solo invitacion/provisioning administrado. | Obligatorio. | Minimo fuerte y complejidad obligatoria. | Obligatorio para Admin, Finanzas y Terapeuta. | Solo dominios productivos aprobados. | Reales solo despues de cerrar PROD-001. | Prohibidos. | Sin scripts manuales Auth, sin seeds demo, sin cambios fuera de procedimiento aprobado. |

## Politica objetivo por rol

| Rol | Creacion de cuenta | MFA | Recuperacion | Cambio de rol | Bloqueo/desactivacion | Auditoria minima |
| --- | --- | --- | --- | --- | --- | --- |
| Admin | Solo por provisioning aprobado por Control/Admin autorizado. | Obligatorio en staging/produccion. | Flujo controlado con verificacion administrativa. | Solo Admin autorizado y auditado. | Desactivar antes que eliminar; delete fisico excepcional. | Login, fallos, recuperacion, cambio de password, cambio de rol, activacion/desactivacion. |
| Terapeuta | Invitacion/provisioning con perfil `usuarios_internos` activo y rol explicito. | Obligatorio en produccion; opcional solo local/demo. | Flujo controlado; no scripts manuales. | No autogestionado; solo Admin autorizado. | `activo = false` para baja operativa. | Login, fallos, recuperacion, acceso critico si SEC-005 lo define, activacion/desactivacion. |
| Finanzas | Invitacion/provisioning con alcance financiero minimo. | Obligatorio en staging/produccion. | Flujo controlado; no scripts manuales. | No autogestionado; solo Admin autorizado. | `activo = false` para baja operativa. | Login, fallos, recuperacion, cambio de password, activacion/desactivacion, cambios de alcance. |

## Analisis detallado

### 1. Signup abierto

**Estado actual observado:** `enable_signup = true` y signup por email habilitado en config local.

**Riesgo:** en produccion, un signup abierto permitiria crear cuentas Auth sin alta administrativa. Aunque `usuarios_internos` y RLS bloqueen acceso sensible, se normalizaria una puerta de entrada innecesaria y se abririan riesgos de enumeracion, spam, cuentas huerfanas y soporte operativo confuso.

**Politica objetivo:** signup publico cerrado en staging/produccion. Alta de usuarios solo por invitacion o provisioning administrado, con registro activo en `usuarios_internos`, rol explicito y trazabilidad.

**Local/demo:** puede mantenerse para pruebas controladas con usuarios ficticios, siempre documentado como no productivo.

**Tarea derivada:** `SEC-008` debe implementar el cierre/control de signup segun ambiente cuando Control apruebe el diseno.

**Bloqueo PROD-001:** produccion no puede habilitarse mientras signup productivo siga abierto o sin procedimiento de provisioning.

### 2. Password policy

**Estado actual observado:** minimo 6 caracteres y sin requisitos de complejidad.

**Riesgo:** password debil aumenta probabilidad de toma de cuenta, especialmente con datos clinicos y financieros.

**Politica objetivo:** para staging/produccion, definir minimo fuerte y complejidad. Recomendacion inicial: minimo 12 caracteres, combinacion de mayusculas, minusculas, numero y simbolo, bloqueo de passwords triviales si Supabase lo permite en la configuracion disponible.

**Local/demo:** puede usar credenciales simples solo para usuarios ficticios, pero no deben copiarse como criterio productivo.

**Tarea derivada:** `SEC-008` debe ajustar politica tecnica por ambiente; `QA-006` debe validar que la politica esperada se aplica.

### 3. Confirmacion de email

**Estado actual observado:** confirmacion de email deshabilitada.

**Riesgo:** cuentas internas podrian quedar asociadas a correos no verificados o incorrectos, complicando recuperacion y responsabilidad de acceso.

**Politica objetivo:** confirmacion de email obligatoria en staging/produccion. Cambios de email deben mantener doble confirmacion.

**Impacto:** puede exigir un flujo de invitacion y recuperacion mas formal para usuarios internos.

**Tarea derivada:** `SEC-008` debe definir e implementar confirmacion segun ambiente; `DOC-001` debe documentarlo.

### 4. MFA / segundo factor

**Estado actual observado:** MFA TOTP y phone deshabilitados.

**Riesgo:** una password comprometida basta para acceder al sistema con el rol del usuario.

**Politica propuesta por rol:**

- Admin: MFA obligatorio en staging/produccion.
- Finanzas: MFA obligatorio en staging/produccion por acceso a cobros, pagos y reportes financieros.
- Terapeuta: MFA obligatorio en produccion por acceso clinico sensible; opcional solo local/demo.

**Tarea derivada:** `SEC-008` debe definir el mecanismo MFA viable y `QA-006` debe validar flujos por rol.

### 5. Redirects y `site_url`

**Estado actual observado:** `site_url` y redirects apuntan a entorno local.

**Riesgo:** en staging/produccion, redirects incorrectos pueden romper confirmacion, recuperacion e invitacion, o permitir flujos hacia dominios no aprobados.

**Politica objetivo:** cada ambiente debe tener `site_url` y allowlist de redirects exacta. No se deben usar wildcards amplios ni mezclar dominios de demo/staging/produccion.

**Tareas derivadas:** `BE-018` y `DOC-001` deben definir ambientes y URLs; `SEC-008` debe aplicar los criterios tecnicos aprobados.

### 6. Usuarios internos y roles

**Estado actual observado:** la app bloquea usuarios Auth sin `usuarios_internos`, usuarios inactivos y roles no validos. RLS usa helpers basados en usuario interno activo.

**Riesgo:** si el alta de Auth y el alta de `usuarios_internos` no se coordinan, se crean cuentas huerfanas o perfiles con rol incorrecto. Si cambios de rol no se auditan, no hay trazabilidad de privilegios.

**Politica objetivo:** provisioning atomico o procedimiento de dos pasos controlado:

1. Crear/invitar usuario Auth.
2. Crear `usuarios_internos` activo con rol explicito.
3. Confirmar email y MFA segun rol/ambiente.
4. Auditar alta, cambio de rol, desactivacion y reactivacion.

**Tareas derivadas:** `SEC-005` debe cubrir eventos de acceso y rol; `SEC-008` debe definir controles tecnicos; `BE-021` debe resolver anulacion/desactivacion frente a delete fisico.

### 7. Scripts manuales tipo `console.sql`

**Estado actual observado:** DEC-029 ya prohibe scripts manuales Auth como practica normal en produccion.

**Riesgo:** actualizar `auth.users` manualmente puede saltar confirmaciones, hashes, recuperacion, trazabilidad y politicas de rol.

**Politica objetivo:** local/demo puede usar scripts idempotentes, documentados y sin secretos para usuarios ficticios. Staging/produccion no debe usar scripts manuales sobre `auth.users` como operacion normal.

**Tarea derivada:** `SEC-007` debe definir procedimiento de scripts locales/demo y prohibicion productiva.

### 8. Sesiones, expiracion y recuperacion

**Estado actual observado:** JWT de una hora y rotacion de refresh tokens habilitada. No hay `timebox` ni `inactivity_timeout` activos. No se observo UI de recuperacion de password.

**Riesgo:** sesiones largas en equipos compartidos aumentan exposicion de datos clinicos. Sin recuperacion controlada, se tendera a resolver cuentas con scripts manuales.

**Politica objetivo:** definir expiracion por inactividad y recuperacion segura antes de produccion. Recuperacion debe pasar por email confirmado y proceso administrativo, no por manipulacion manual de `auth.users`.

**Tareas derivadas:** `SEC-008` debe definir session hardening; una tarea UI futura puede cubrir microcopy/login/recuperacion si Control decide separarla; `QA-006` debe validar flujos principales.

### 9. Logging y auditoria Auth

**Estado actual observado:** no existe auditoria sensible implementada para eventos Auth. SEC-005 sigue pendiente.

**Eventos minimos a auditar conceptualmente:**

- Login exitoso.
- Login fallido o intentos sospechosos.
- Recuperacion de password.
- Cambio de password.
- Invitacion/alta.
- Cambio de rol.
- Desactivacion.
- Reactivacion.
- Cambio de email.
- Cambios MFA.

**Politica objetivo:** integrar Auth con SEC-005 antes de produccion. Si un evento no puede registrarse desde DB localmente, documentar fuente alternativa, limitacion y evidencia operativa.

**Tarea derivada:** `SEC-005` debe incorporar eventos Auth y cambios de rol.

### 10. Checklist minimo para cerrar SEC-003

SEC-003 como diseno documental puede considerarse cerrado cuando:

- Signup productivo quede definido como cerrado/controlado.
- Password policy objetivo quede aprobada.
- Confirmacion de email quede definida por ambiente.
- MFA quede decidido por rol.
- Redirects y `site_url` queden definidos por ambiente.
- Provisioning y offboarding de usuarios internos queden definidos.
- Scripts manuales Auth queden prohibidos en produccion.
- Recuperacion de cuenta quede definida.
- Sesion, expiracion e inactividad queden definidas.
- Auditoria Auth quede conectada a SEC-005.
- QA minimo quede conectado a QA-006.
- Implementacion tecnica posterior quede separada en tarea propia.

## Decisiones reforzadas

- DEC-029: scripts manuales Auth solo local/demo y prohibidos en produccion.
- DEC-030: ambientes reconocidos `LOCAL`, `DEMO`, `STAGING` y `PRODUCCION`.
- DEC-031: carga real requiere aprobacion explicita y checklist.

## Decision nueva propuesta

### DEC-032 - Auth productivo por invitacion/provisioning y MFA por rol

**Estado:** Propuesta pendiente aprobacion.

En staging/produccion, Auth no debe operar con signup publico abierto. El alta debe realizarse por invitacion/provisioning administrado, con usuario interno activo, rol explicito, email confirmado y MFA obligatorio para Admin, Finanzas y Terapeuta antes de produccion.

## Tareas derivadas

### Seguridad

- `SEC-008` - Implementacion controlada Hardening Auth.
- `SEC-005` - Auditoria sensible debe incorporar eventos Auth y cambios de rol.
- `SEC-007` - Procedimiento de scripts manuales locales/demo y prohibicion en produccion.

### Backend

- `BE-018` - Separacion tecnica de ambientes debe definir URLs, callbacks y allowlist por ambiente.
- `BE-021` - Anulacion/desactivacion debe resolver baja de usuarios internos sin delete fisico operativo.

### UI/UX

- `UI-020` - Indicador visual de ambiente.
- `UI-021` - Bloqueo visual de produccion no habilitada.
- Tarea UI futura - Mensajes Auth, recuperacion y errores visibles no tecnicos, si Control decide separarlo de `SEC-008`.

### QA

- `QA-006` - Debe validar rutas/roles y agregar casos Auth minimos: usuario sin perfil interno, usuario inactivo, rol invalido, recuperacion, no exposicion de mensajes tecnicos y no acceso de Finanzas a clinica.

### Produccion

- `PROD-001` - Sigue bloqueante hasta cerrar hardening Auth, auditoria, ambientes, backup, consentimiento, anulacion logica y checklist.

### Control

- `DOC-001` - Manual de ambientes debe documentar Auth por ambiente.
- `DOC-003` - Politica de carga de datos reales debe exigir SEC-003 aprobado y `SEC-008` implementado/validado.

## Riesgos si no se implementa

- Usuarios no autorizados podrian crear cuenta Auth en ambientes reales.
- Passwords debiles podrian comprometer datos clinicos o financieros.
- Recuperaciones manuales podrian saltar trazabilidad.
- Admin o Finanzas sin MFA quedan como punto critico de ataque.
- Roles internos podrian cambiar sin evidencia suficiente.
- Un ambiente mal configurado podria enviar confirmaciones o recuperaciones al dominio incorrecto.

## Checklist de cierre productivo

Para que Auth deje de bloquear produccion se requiere, al menos:

- `SEC-003` aprobado como diseno.
- `SEC-008` implementado y validado.
- Signup cerrado o controlado en staging/produccion.
- Password policy fuerte aplicada.
- Email confirm habilitado donde corresponda.
- MFA aplicado por rol segun politica aprobada.
- Redirects y `site_url` exactos por ambiente.
- Provisioning/offboarding documentado.
- Recuperacion de cuenta documentada y probada.
- Scripts manuales Auth prohibidos en produccion.
- Eventos Auth cubiertos por SEC-005 o por procedimiento equivalente.
- QA-006 con casos Auth minimos ejecutados.
- Aprobacion de Control/Javier para cualquier uso real.

## Criterios de no produccion

No se autoriza produccion si cualquiera de estos puntos sigue abierto:

- Signup productivo abierto o sin control administrativo.
- Password policy debil o no aprobada.
- Email confirm no decidido.
- MFA no decidido para roles criticos.
- Redirects no definidos por ambiente.
- Provisioning/offboarding no documentado.
- Scripts manuales Auth aceptados como practica productiva.
- Sin auditoria de eventos Auth y cambios de rol.
- Sin QA minimo por rol y por estado de usuario.
- PROD-001 abierto.

## Conclusion

La base actual protege rutas y RLS mediante `usuarios_internos`, pero Auth sigue configurado como entorno local/demo. El siguiente paso no debe ser produccion ni datos reales: primero se debe aprobar esta politica y luego ejecutar una tarea tecnica separada para aplicar hardening Auth por ambiente, con QA y auditoria vinculados.
