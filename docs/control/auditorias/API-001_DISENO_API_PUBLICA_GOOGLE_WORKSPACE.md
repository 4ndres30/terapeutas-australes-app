# API-001 - Diseno API publica segura e integracion Google Workspace

## Estado

Diseno arquitectonico documental / pendiente implementacion futura.

Este informe no implementa API real, no crea endpoints, no modifica RLS, no crea migraciones, no toca Supabase remoto y no habilita produccion ni datos reales.

## Fecha

2026-06-30

## Rama analizada

`api-001-diseno-api-publica-google-workspace`

Base de referencia: `main` actualizado desde el repositorio oficial `4ndres30/terapeutas-australes-app`.

## Origen

- PROD-001: preparacion para uso real con datos sensibles.
- BE-012: diseno de backend de Agenda tipificada.
- BE-017: estrategia SQL de agenda operativa.
- BE-018: separacion tecnica de ambientes.
- BE-020: consentimiento informado y tratamiento de datos.
- SEC-005: auditoria de cambios sensibles.
- DOC-001: manual de ambientes.
- DOC-003: politica de carga de datos reales.
- DEC-030: ambientes LOCAL, DEMO, STAGING y PRODUCCION.
- DEC-031: carga real requiere aprobacion explicita y checklist.

## Objetivo

Registrar la estrategia futura para una API segura, robusta y escalable que actue como frontera entre:

```text
Pagina web publica
-> API segura
-> Sistema interno de gestion
-> Base de datos
-> Google Calendar / Gmail / Google Workspace / Google Cloud
```

La API debe permitir, cuando el proyecto este preparado, recibir solicitudes de agendamiento publico, validar datos minimos, registrar consentimiento, crear solicitudes o citas operativas, sincronizar Google Calendar, enviar correos neutros y registrar auditoria minima sin exponer datos sensibles.

## Alcance

- Definir la necesidad arquitectonica de una API publica segura.
- Separar responsabilidades entre pagina publica, API, sistema interno, Supabase y servicios Google.
- Documentar reglas de seguridad para datos sensibles, consentimiento, auditoria y ambientes.
- Proponer endpoints conceptuales futuros.
- Registrar dependencias antes de cualquier implementacion.
- Dejar criterios de aceptacion para tareas posteriores.

## Fuera de alcance

- Implementar endpoints funcionales.
- Crear backend productivo.
- Crear Supabase Edge Functions, Cloud Run, servidor Node u otro runtime.
- Crear o modificar migraciones.
- Modificar Auth, RLS o policies.
- Instalar dependencias.
- Tocar `.env` o secretos.
- Tocar Supabase remoto.
- Conectar Google Calendar, Gmail o Workspace.
- Habilitar datos reales, fotos reales, pagos reales o produccion.

## Fuentes revisadas

- `README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`
- `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`
- `docs/control/auditorias/PROD-001_PREPARACION_USO_REAL_DATOS_SENSIBLES.md`
- `docs/control/auditorias/SEC-003_HARDENING_AUTH.md`
- `docs/control/auditorias/SEC-008_IMPLEMENTACION_HARDENING_AUTH.md`
- `src/App.tsx`
- `src/pages/AgendaPage.tsx`
- `src/lib/supabase.ts`
- `package.json`
- `supabase/migrations/`

## Hallazgos del estado actual

### API y backend propio

No se detecta API real ni backend propio implementado en el repositorio.

La aplicacion actual es una SPA React + Vite que consume Supabase desde el frontend interno mediante `@supabase/supabase-js`.

`package.json` no contiene dependencias de servidor HTTP ni librerias de Google Workspace. `supabase/config.toml` contiene configuracion local de Supabase, pero no se detectaron funciones Edge implementadas para exponer una API publica.

### Agenda

Agenda no tiene backend operativo real. `src/pages/AgendaPage.tsx` es una pantalla placeholder que deja explicito que no existe tabla propia de agenda, logica de guardado ni eventos operativos.

BE-012 y BE-017 siguen pendientes y son dependencias directas antes de exponer disponibilidad o agendamiento publico.

### Sistema interno

`src/App.tsx` protege rutas internas por Supabase Auth, `usuarios_internos`, estado activo y roles validos. Las paginas internas consultan Supabase directamente porque son parte del sistema interno protegido.

Ese patron no debe copiarse a una pagina publica. La pagina publica no debe consultar ni escribir directamente en tablas clinicas, financieras o de usuarios internos.

### Google Workspace

No se detecta integracion funcional con Google Calendar, Gmail, Workspace o Google Cloud.

Cualquier integracion futura debe ejecutarse desde backend controlado. El frontend publico no debe portar tokens, credenciales OAuth, claves de servicio ni permisos de Calendar/Gmail.

### Produccion y datos reales

PROD-001 sigue bloqueante. El proyecto no esta habilitado para datos reales, fotos reales, pagos reales ni produccion.

La API futura no puede habilitar produccion por si sola; debe depender del cierre de ambientes, consentimiento, auditoria, backup/restauracion, hardening Auth, QA y checklist pre-produccion.

## Por que se requiere una API

Una pagina publica esta expuesta a usuarios anonimos, bots, abuso, errores de integracion y trafico no confiable. Conectar esa pagina directamente a Supabase o a tablas internas agregaria riesgos innecesarios:

- escritura directa sobre tablas clinicas o financieras;
- exposicion accidental de campos sensibles;
- dependencia excesiva de RLS para trafico anonimo;
- falta de rate limit, CAPTCHA, anti-spam e idempotencia;
- errores tecnicos visibles para usuarios externos;
- dificultad para registrar consentimiento y auditoria consistente;
- riesgo de filtrar motivos clinicos o energeticos en Calendar/Gmail;
- exposicion de tokens o secretos si Google se integra desde frontend;
- acoplamiento fuerte entre pagina publica y estructura interna de datos.

La API debe ser la frontera que convierte solicitudes publicas en operaciones controladas, validadas, auditables y compatibles con el sistema interno.

## Arquitectura conceptual futura

```text
Pagina web publica
  - formulario minimo de agenda
  - consentimiento explicito
  - CAPTCHA / anti-spam
  - sin acceso directo a Supabase clinico

API publica segura
  - validacion de payloads
  - sanitizacion
  - rate limit
  - CORS estricto
  - idempotencia y deduplicacion
  - errores neutros
  - registro de consentimiento
  - creacion de solicitud/cita inicial
  - auditoria minima

Servicio interno / backend
  - reglas operativas de agenda
  - control de disponibilidad
  - integracion con Supabase
  - integracion con Google Calendar/Gmail
  - manejo de secretos fuera del frontend

Sistema interno
  - gestion por usuarios autenticados
  - roles, RLS y auditoria
  - detalle clinico solo dentro del sistema protegido

Google Workspace
  - Calendar con titulos neutros
  - Gmail con correos neutros
  - credenciales y tokens en backend/secret manager
```

## Datos permitidos desde pagina publica

La pagina publica puede solicitar solo datos minimos:

- nombre;
- correo;
- telefono;
- servicio solicitado;
- modalidad;
- fecha/hora deseada;
- consentimiento;
- motivo general no sensible.

## Datos prohibidos desde pagina publica

La pagina publica no debe exigir detalles intimos, clinicos o energeticos profundos como condicion de agenda.

No deben pedirse ni enviarse como requisito publico:

- relatos clinicos extensos;
- diagnosticos;
- antecedentes familiares intimos;
- informacion canalizada;
- detalles de entidades, conflictos, bloqueos o situaciones espirituales profundas;
- fotos;
- datos financieros;
- documentos sensibles.

## Reglas de seguridad de la API

- No exponer `service_role` ni secretos en frontend.
- No permitir que la pagina publica escriba directo en tablas clinicas o financieras.
- Separar endpoints publicos de endpoints internos.
- Validar payloads con esquema estricto.
- Sanitizar campos libres y limitar longitud.
- Aplicar rate limit por IP, fingerprint razonable o mecanismo equivalente.
- Aplicar CAPTCHA o anti-spam antes de aceptar solicitudes publicas.
- Aplicar CORS estricto por dominio autorizado.
- Usar idempotency key o deduplicacion para evitar citas duplicadas.
- Registrar consentimiento con version, fecha, origen y evidencia minima.
- Registrar auditoria tecnica minima sin guardar contenido sensible innecesario.
- Retornar errores neutros, sin stack traces ni detalles de RLS, SQL o estructura de base de datos.
- Usar titulos neutros en Google Calendar.
- Usar correos neutros en Gmail/Workspace.
- Mantener detalles sensibles solo en el sistema interno protegido por login, roles, RLS y auditoria.

## Relacion con Agenda

La API publica de agendamiento depende de que Agenda deje de ser placeholder y cuente con modelo operativo definido.

Antes de implementar endpoints publicos deben cerrarse o aprobarse:

- BE-012: backend de Agenda tipificada.
- BE-017: estrategia SQL de agenda operativa.
- UI-014: experiencia de Agenda tipificada.
- QA asociado a disponibilidad, duplicados, estados y permisos.

La API no debe inventar una tabla de agenda aislada ni escribir en `consultas` como sustituto improvisado si la decision de Agenda no esta cerrada.

## Relacion con Consentimiento

BE-020 es bloqueante para cualquier flujo publico con datos reales.

La API debe registrar consentimiento antes o junto con la solicitud de agenda. El consentimiento debe incluir como minimo:

- version del texto aceptado;
- fecha y hora;
- origen del canal;
- datos minimos del solicitante;
- finalidad declarada;
- estado de aceptacion;
- referencia a solicitud/cita cuando corresponda.

No se debe confirmar atencion real ni crear ficha clinica completa sin consentimiento suficiente y politica de tratamiento de datos aprobada.

## Relacion con Google Calendar

Google Calendar debe recibir eventos con informacion neutral.

Ejemplo permitido:

```text
Cita Terapeutas Australes - Servicio reservado
```

Ejemplo prohibido:

```text
Revision energetica por entidades, conflicto familiar o bloqueo espiritual
```

Reglas minimas:

- no incluir motivos sensibles en titulo, descripcion o ubicacion del evento;
- no incluir diagnosticos ni detalles del caso;
- no sincronizar datos clinicos profundos;
- registrar solo lo necesario para operar la cita;
- manejar errores de sincronizacion sin exponerlos al usuario publico;
- conservar auditoria interna de intentos de sync.

## Relacion con Gmail / Workspace

Los correos deben ser neutros y no revelar detalles sensibles.

Ejemplo permitido:

```text
Tu cita fue registrada correctamente para el dia y hora seleccionados.
```

Ejemplo prohibido:

```text
Confirmamos tu revision por conflicto familiar, entidades o situacion intima.
```

Reglas minimas:

- no enviar informacion clinica sensible por correo;
- no incluir campos libres sensibles del formulario publico;
- usar plantillas revisadas;
- registrar estado de envio y errores internos;
- no exponer credenciales ni tokens de Gmail/Workspace en frontend.

## Relacion con ambientes y produccion

La API debe disenarse por ambiente:

| Ambiente | Uso permitido | API publica |
| --- | --- | --- |
| LOCAL | Desarrollo con datos ficticios. | Puede existir mock o entorno local sin datos reales. |
| DEMO | Demostracion controlada con datos ficticios. | Puede simular flujo sin integraciones reales o con sandbox. |
| STAGING | Validacion previa a produccion. | Solo con checklist, secretos separados, dominio definido y datos ficticios/anonimizados segun politica. |
| PRODUCCION | Uso real aprobado. | Solo despues de cerrar PROD-001 y checklist completo. |

La API no debe compartir secretos, callbacks, dominios, bases ni credenciales entre ambientes.

## Relacion con auditoria sensible

SEC-005 debe definir la auditoria minima antes de implementar API con datos reales.

Eventos a considerar:

- solicitud publica recibida;
- validacion rechazada;
- consentimiento aceptado;
- solicitud/cita creada;
- duplicado detectado;
- sincronizacion Calendar iniciada, completada o fallida;
- correo de confirmacion o recordatorio enviado/fallido;
- cambio manual posterior desde sistema interno;
- anulacion o cancelacion de cita;
- intentos sospechosos o bloqueados por rate limit.

La auditoria debe evitar guardar contenido sensible innecesario en logs.

## Endpoints conceptuales futuros

### GET `/api/public/disponibilidad`

**Proposito:** exponer bloques disponibles o alternativas de agenda sin filtrar calendario interno completo.

**Consumidor:** pagina publica.

**Datos permitidos:** servicio, modalidad, rango de fechas, zona horaria.

**Datos prohibidos:** nombres de pacientes, terapeutas no autorizados, detalle clinico, eventos internos, notas, pagos.

**Validaciones:** rango acotado, servicio valido, modalidad valida, rate limit, CORS, CAPTCHA si aplica.

**Riesgos:** enumeracion de agenda, scraping, inferencia de disponibilidad real, bloqueo por abuso.

**Reglas de seguridad:** devolver disponibilidad agregada o slots publicables, no eventos reales; cache controlado; errores neutros.

**Relacion con tablas:** futura `agenda_eventos`, estrategia BE-017 o vista operacional aprobada.

**Dependencias:** BE-012, BE-017, BE-018, SEC-009, DOC-001, PROD-001.

### POST `/api/public/agendamientos`

**Proposito:** recibir una solicitud publica de cita o agendamiento inicial.

**Consumidor:** pagina publica.

**Datos permitidos:** nombre, correo, telefono, servicio, modalidad, fecha/hora deseada, consentimiento aceptado, motivo general no sensible.

**Datos prohibidos:** relatos clinicos extensos, informacion canalizada, detalles energeticos profundos, fotos, datos financieros, IDs internos.

**Validaciones:** esquema estricto, campos requeridos, longitud maxima, sanitizacion, consentimiento vigente, idempotencia, duplicados, rate limit, CAPTCHA.

**Riesgos:** spam, duplicados, inyeccion en campos libres, creacion de registros sin consentimiento, exposicion de estructura interna por errores.

**Reglas de seguridad:** no escribir directo desde frontend; respuesta neutral; no confirmar disponibilidad definitiva si requiere revision interna; logs minimos.

**Relacion con tablas:** futura solicitud/cita de agenda; posible relacion posterior con `pacientes`, `consultas` o `agenda_eventos` segun BE-012/BE-017.

**Dependencias:** BE-012, BE-017, BE-020, SEC-005, SEC-009, BE-018, DOC-003, PROD-001.

### POST `/api/public/consentimientos`

**Proposito:** registrar consentimiento explicito del solicitante.

**Consumidor:** pagina publica.

**Datos permitidos:** identificacion minima, canal, version de consentimiento, fecha/hora, aceptacion, referencia a solicitud.

**Datos prohibidos:** detalles clinicos profundos, archivos, datos de pago, credenciales.

**Validaciones:** version vigente, aceptacion explicita, trazabilidad temporal, anti-spam, deduplicacion.

**Riesgos:** consentimiento ambiguo, version incorrecta, falta de evidencia, abuso automatizado.

**Reglas de seguridad:** registrar evidencia minima sin exceder datos necesarios; no usar como sustituto de ficha clinica.

**Relacion con tablas:** futura tabla de consentimientos o modelo definido en BE-020.

**Dependencias:** BE-020, SEC-005, BE-018, DOC-003, PROD-001.

### GET `/api/internal/agenda/eventos`

**Proposito:** entregar eventos operativos al sistema interno autenticado.

**Consumidor:** sistema interno, usuarios con rol autorizado.

**Datos permitidos:** eventos segun rol, estado, horario, relacion operativa autorizada.

**Datos prohibidos:** datos financieros para roles no autorizados, clinica sensible fuera de contexto, eventos de otros ambientes.

**Validaciones:** autenticacion interna, rol valido, `usuarios_internos` activo, RLS/servicio autorizado, filtros de rango.

**Riesgos:** exposicion cruzada por rol, fuga de datos sensibles, acceso fuera de ambiente.

**Reglas de seguridad:** separar de endpoints publicos; no usar anonimo; auditar accesos sensibles si corresponde.

**Relacion con tablas:** futura `agenda_eventos` y vistas derivadas de BE-017.

**Dependencias:** BE-012, BE-017, SEC-002, SEC-005, QA-006, PROD-001.

### POST `/api/internal/calendar/sync`

**Proposito:** sincronizar eventos internos autorizados con Google Calendar.

**Consumidor:** backend interno o usuarios internos autorizados mediante accion controlada.

**Datos permitidos:** ID interno de evento, fecha/hora, duracion, modalidad, titulo neutral, estado de sync.

**Datos prohibidos:** motivo sensible, informacion canalizada, diagnosticos, fotos, pagos, notas clinicas profundas.

**Validaciones:** evento existente, rol autorizado, consentimiento si aplica, estado sincronizable, idempotencia, secretos disponibles por ambiente.

**Riesgos:** filtracion en calendario, duplicados, credenciales mal gestionadas, desalineacion entre DB y Google.

**Reglas de seguridad:** tokens solo backend; titulos neutros; retries controlados; auditoria de sync; rollback o compensacion documentada.

**Relacion con tablas:** futura agenda operativa y tabla/estado de integracion Google si se aprueba.

**Dependencias:** BE-012, BE-017, BE-027, SEC-005, SEC-009, BE-018, DOC-001, PROD-001.

### POST `/api/internal/notificaciones/confirmacion`

**Proposito:** enviar correo neutral de confirmacion de cita.

**Consumidor:** backend interno o flujo controlado de agenda.

**Datos permitidos:** destinatario, fecha/hora, modalidad, texto neutral aprobado.

**Datos prohibidos:** detalles clinicos, motivo intimo, informacion canalizada, datos financieros, IDs internos visibles.

**Validaciones:** destinatario valido, consentimiento/comunicacion permitida, plantilla vigente, idempotencia.

**Riesgos:** filtracion por correo, envio duplicado, plantilla con informacion sensible.

**Reglas de seguridad:** plantillas revisadas; no incluir campos libres sensibles; auditar envio/fallo; manejar errores de forma interna.

**Relacion con tablas:** futura agenda y consentimientos; posible tabla de notificaciones si se aprueba.

**Dependencias:** BE-020, BE-027, SEC-005, SEC-009, BE-018, DOC-003, PROD-001.

### POST `/api/internal/notificaciones/recordatorio`

**Proposito:** enviar recordatorio neutral antes de la cita.

**Consumidor:** scheduler backend o sistema interno autorizado.

**Datos permitidos:** destinatario, fecha/hora, modalidad, texto neutral, referencia operativa minima.

**Datos prohibidos:** detalles clinicos, motivo sensible, notas internas, datos financieros.

**Validaciones:** cita vigente, consentimiento/comunicacion permitida, ventana de envio, no duplicado.

**Riesgos:** recordatorios duplicados, envio despues de cancelacion, exposicion accidental de motivo sensible.

**Reglas de seguridad:** scheduler controlado; plantillas neutras; cancelacion respetada; auditoria de envio.

**Relacion con tablas:** futura agenda, consentimientos y notificaciones.

**Dependencias:** BE-012, BE-017, BE-020, BE-027, SEC-005, SEC-009, PROD-001.

## Riesgos de no tener API

| Riesgo | Impacto |
| --- | --- |
| Pagina publica escribe directo en Supabase | Puede crear, alterar o inferir datos internos si falla RLS o el contrato. |
| Integracion Google desde frontend | Expone tokens, callbacks o permisos sensibles. |
| Sin rate limit ni anti-spam | Riesgo de abuso, agenda saturada o costos externos. |
| Sin consentimiento trazable | Riesgo legal/operativo antes de datos reales. |
| Emails o eventos no neutros | Filtracion de datos sensibles fuera del sistema interno. |
| Errores tecnicos visibles | Exposicion de estructura interna, RLS, SQL o proveedores. |
| Sin separacion por ambiente | Riesgo de mezclar datos demo y reales o usar secretos equivocados. |

## Orden recomendado de implementacion

1. Cerrar diseno documental API-001 y DEC-033.
2. Cerrar BE-012 y BE-017 para Agenda operativa.
3. Cerrar BE-020 para consentimiento informado y tratamiento de datos.
4. Cerrar BE-018 y DOC-001 para ambientes, dominios, callbacks y secretos.
5. Cerrar SEC-005 para auditoria sensible.
6. Cerrar SEC-009 para seguridad de API publica.
7. Cerrar BE-027 para integracion Google Calendar/Gmail/Workspace.
8. Cerrar BE-026 para contrato de API publica de agendamiento.
9. Definir runtime backend futuro: Supabase Edge Functions, Cloud Run u otro servicio aprobado.
10. Implementar primero en LOCAL/DEMO con datos ficticios.
11. Validar en STAGING solo con checklist y datos ficticios/anonimizados segun politica.
12. Considerar PRODUCCION solo despues de cerrar PROD-001.

## Dependencias bloqueantes antes de implementar

- BE-012: Agenda tipificada.
- BE-017: estrategia SQL de agenda operativa.
- BE-018: separacion tecnica de ambientes.
- BE-019: backup/restauracion.
- BE-020: consentimiento informado y tratamiento de datos.
- SEC-005: auditoria de cambios sensibles.
- SEC-008B: provisioning Auth controlado cuando afecte usuarios internos.
- SEC-009: seguridad de API publica.
- DOC-001: manual de ambientes.
- DOC-003: politica de carga de datos reales.
- QA-006: pruebas minimas por rol y no exposicion sensible.
- PROD-001: preparacion para uso real con datos sensibles.

## Criterios de aceptacion futuros

- La pagina publica no usa `@supabase/supabase-js` contra tablas clinicas o financieras.
- La API valida y sanitiza todos los payloads.
- La API aplica CORS estricto, rate limit y anti-spam.
- El consentimiento queda registrado antes de operar con datos reales.
- Los errores publicos son neutros y no exponen detalles tecnicos.
- Google Calendar recibe solo eventos neutros.
- Gmail/Workspace envia solo mensajes neutros.
- Los secretos viven fuera del frontend y separados por ambiente.
- Existe auditoria minima de solicitudes, syncs, notificaciones y rechazos.
- La implementacion pasa por LOCAL/DEMO y STAGING antes de cualquier produccion.
- PROD-001 esta cerrado antes de datos reales.

## Recomendaciones tecnicas

- Evaluar Supabase Edge Functions si el alcance es pequeno y cercano a Supabase.
- Evaluar Google Cloud Run si se requiere mayor control de runtime, colas, workers o integraciones Google mas complejas.
- Usar Secret Manager o mecanismo equivalente para credenciales Google.
- Separar API publica y API interna por rutas, autenticacion, CORS y permisos.
- Versionar contratos desde el inicio: `/api/v1/...`.
- Usar schemas compartidos de validacion, preferentemente Zod o equivalente si se mantiene TypeScript.
- Definir idempotencia para creacion de solicitudes y sincronizacion Calendar.
- Usar colas o jobs diferidos para Calendar/Gmail si el flujo requiere reintentos.
- Mantener mensajes de Calendar/Gmail neutrales y revisados.
- Registrar observabilidad sin contenido clinico sensible.
- Documentar rollback: desactivar endpoints publicos, pausar sync Google y operar agenda manual interna si hay incidente.

## Conclusiones

La API publica segura es necesaria para conectar una futura pagina de agendamiento con el sistema interno y Google Workspace sin exponer datos sensibles ni acoplar el sitio publico a Supabase.

El proyecto no esta listo para implementar esa API todavia. Agenda, consentimiento, ambientes, auditoria, seguridad de API, integracion Google y PROD-001 deben cerrarse antes de cualquier uso con datos reales.

API-001 deja definida la ruta arquitectonica, pero no habilita produccion, datos reales, fotos reales ni pagos reales.
