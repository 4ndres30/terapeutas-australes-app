# SEC-009 - Seguridad de API publica

Estado: Diseno documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Control de desarrollo / Integracion Backend / Seguridad
Rama usada: `sec-009-diseno-seguridad-api-publica`
Nivel documental: Nivel 3 - Seguridad de frontera publica.

## Origen

Este documento deriva de:

- `API-001` - Diseno API publica segura e integracion Google Workspace.
- `BE-026` - Contrato de API publica de agendamiento.
- `DEC-033` - API segura como frontera entre pagina publica, sistema interno y servicios Google.
- `DEC-034` - Agenda operativa separada de consulta clinica confirmada.
- `SEC-010` - Secretos, OAuth, IAM e identidades tecnicas Google Cloud.
- `BE-018` - Separacion tecnica de ambientes.
- `BE-020` - Consentimiento informado y tratamiento de datos.
- `SEC-005` - Auditoria de cambios sensibles.
- `DOC-001` - Manual de ambientes.
- `DOC-003` - Politica de carga de datos reales.
- `PROD-001` - Preparacion para uso real con datos sensibles.

## Objetivo

Definir el marco de seguridad que debera cumplir la futura API publica de Terapeutas Australes antes de implementar endpoints reales, pagina publica funcional, integracion Google Calendar/Gmail o uso con datos reales.

SEC-009 no implementa controles. Deja los criterios minimos que deberan guiar una implementacion posterior.

## Alcance

Incluye:

- modelo de amenazas de la API publica;
- separacion entre endpoints publicos, internos y de servicio;
- reglas de CORS por ambiente;
- rate limit, anti-spam y CAPTCHA o mecanismo equivalente;
- validacion y sanitizacion de payloads;
- minimizacion de datos publicos;
- idempotencia y deduplicacion de solicitudes;
- acceso backend a Supabase;
- relacion con secretos, OAuth e identidades tecnicas;
- errores publicos neutros;
- logs y auditoria minima;
- restricciones por ambiente;
- checklist minimo antes de implementar endpoints reales.

## Fuera de alcance

No se realiza en esta tarea:

- endpoints reales;
- backend runtime;
- dependencias;
- codigo fuente;
- migraciones;
- cambios de Auth, RLS, policies o grants;
- SQL;
- cambios en `.env`;
- credenciales;
- Supabase remoto;
- `supabase db push`;
- Google Calendar, Gmail o Workspace funcional;
- infraestructura cloud;
- produccion;
- datos reales, fotos reales o pagos reales.

## Principio central

La pagina publica nunca debe escribir directamente en Supabase ni leer datos internos.

Toda interaccion publica debe pasar por una API controlada que valide, limite, registre y reduzca datos antes de crear una solicitud operativa revisable por el equipo interno.

## Modelo de amenazas

| Riesgo | Impacto | Control requerido |
| --- | --- | --- |
| Spam de solicitudes | Saturacion operativa y ruido en agenda | Rate limit, CAPTCHA, deduplicacion y revision interna |
| Enumeracion de disponibilidad | Exposicion indirecta de agenda interna | Disponibilidad publicable agregada y sin IDs internos |
| Payload malicioso | XSS, inyeccion o contaminacion de datos | Validacion por esquema, sanitizacion y limites de longitud |
| Exposicion de datos sensibles | Riesgo clinico, legal y reputacional | Minimizacion, datos prohibidos y errores neutros |
| Uso indebido de credenciales | Acceso no autorizado a Supabase o Google | Secretos solo backend, rotacion y minimo privilegio |
| Abuso de reintentos | Duplicados o carga excesiva | Idempotency-Key, hash de solicitud y ventanas de deduplicacion |
| Error tecnico expuesto | Filtracion de estructura interna | Respuestas genericas, logging interno y sin stack traces publicos |
| Mezcla de ambientes | Datos demo o reales en contexto incorrecto | Separacion de ambientes, dominios y claves por ambiente |

## Clasificacion de superficies

### Superficie publica

Endpoints conceptuales de BE-026:

- `GET /api/v1/public/agenda/disponibilidad`
- `POST /api/v1/public/agendamientos`
- `POST /api/v1/public/consentimientos`

Reglas:

- no requiere sesion interna;
- solo acepta datos publicos minimos;
- no retorna IDs internos de pacientes, consultas, agenda, casos, trabajos, cobros, pagos o Storage;
- no confirma automaticamente citas clinicas;
- no crea pacientes automaticamente;
- no sincroniza Google Calendar al recibir una solicitud no revisada.

### Superficie interna

Endpoints futuros para panel interno, si existieran:

- deben requerir autenticacion;
- deben validar rol y estado de usuario interno;
- deben respetar RLS y reglas funcionales existentes;
- no deben compartir contratos con endpoints publicos.

### Superficie de servicio

Integraciones futuras con Google Calendar/Gmail o jobs internos:

- deben usar identidad tecnica separada;
- deben operar con minimo privilegio;
- deben registrar auditoria;
- deben quedar fuera del frontend publico.

## CORS

La API publica debe usar CORS estricto por ambiente.

Reglas minimas:

- permitir solo dominios publicos autorizados por ambiente;
- no usar comodin `*` en ambientes staging o produccion;
- separar dominios local, demo, staging y produccion;
- limitar metodos por endpoint;
- limitar headers permitidos;
- revisar `credentials` con criterio restrictivo;
- registrar intentos rechazados de origen no autorizado sin exponer detalle tecnico al cliente.

## Rate limit

Debe existir rate limit antes de publicar cualquier endpoint.

Minimos recomendados:

- limite por IP;
- limite por identificador de navegador o token anti-abuso cuando exista;
- limite por email/telefono normalizado para solicitudes de agenda;
- limite por ventana temporal corta y ventana diaria;
- respuesta publica neutra cuando se exceda el limite;
- logging interno de abuso.

Los valores exactos deben definirse en la tarea de implementacion segun infraestructura elegida.

## Anti-spam y CAPTCHA

La pagina publica debe incorporar un mecanismo anti-spam antes de operar con formularios reales.

Opciones futuras evaluables:

- CAPTCHA administrado;
- proof-of-work liviano;
- campo honeypot;
- bloqueo por reputacion;
- verificacion por email o telefono antes de confirmar acciones sensibles.

Para v1 publica no se debe confiar solo en validacion frontend.

## Validacion de payloads

Toda entrada publica debe validarse en backend con esquema estricto.

Reglas:

- rechazar campos desconocidos cuando sea posible;
- validar tipos, formatos, longitudes y enumeraciones;
- normalizar email, telefono y modalidad;
- limitar texto libre;
- impedir HTML activo;
- prohibir IDs internos enviados por cliente publico;
- validar que fecha/hora solicitada pertenezca a una ventana publicable;
- validar consentimiento segun lo que defina BE-020.

## Sanitizacion y minimizacion

Datos permitidos de forma conceptual para solicitud publica:

- nombre de contacto;
- email;
- telefono;
- servicio o motivo general no sensible;
- modalidad;
- preferencia de fecha/hora;
- aceptacion de consentimiento cuando corresponda.

Datos prohibidos desde formulario publico v1:

- diagnosticos;
- antecedentes clinicos extensos;
- fotos;
- documentos adjuntos;
- datos financieros;
- IDs internos;
- instrucciones para Google Calendar/Gmail;
- contenido que deba quedar en ficha clinica sin revision interna.

## Idempotencia y deduplicacion

`POST /api/v1/public/agendamientos` debe contemplar idempotencia antes de implementarse.

Criterios:

- aceptar `Idempotency-Key` o mecanismo equivalente;
- generar hash interno con datos normalizados cuando no exista clave confiable;
- definir ventana temporal de deduplicacion;
- devolver respuesta neutra ante duplicado;
- evitar crear multiples `solicitudes_agenda` por reintento de red;
- no usar idempotencia como autenticacion.

## Acceso a Supabase

La API futura debe ser el unico componente publico con capacidad de escribir solicitudes.

Reglas:

- el frontend publico no debe usar la anon key para insertar directamente en tablas internas;
- el backend no debe exponer service role al navegador;
- cualquier uso de service role debe quedar confinado a backend seguro;
- las escrituras publicas deben apuntar conceptualmente a `solicitudes_agenda`;
- no debe escribir en `pacientes`, `consultas`, `agenda_eventos`, tablas clinicas, tablas financieras ni Storage;
- las operaciones internas posteriores deben pasar por revision humana y permisos internos.

## Autenticacion y autorizacion

La API publica puede tener endpoints sin sesion, pero nunca sin controles.

Requisitos:

- endpoints publicos: controles anti-abuso, CORS, validacion e idempotencia;
- endpoints internos: Supabase Auth o mecanismo equivalente, roles y usuario activo;
- endpoints de servicio: identidad tecnica, minimo privilegio y auditoria;
- cambios sensibles: trazabilidad segun SEC-005.

## Secretos e identidades tecnicas

SEC-009 depende de SEC-010 para el diseno de secretos, OAuth, IAM e identidades tecnicas.

Reglas:

- ningun secreto en frontend publico;
- ningun token Google en frontend publico;
- ningun service role versionado;
- secretos separados por ambiente;
- rotacion documentada antes de produccion;
- minimo privilegio por integracion.

## Errores publicos

Los errores de la API publica deben ser neutros.

Permitido:

- mensaje generico de validacion;
- codigo funcional estable;
- sugerencia simple de intentar nuevamente o contactar por canal alternativo.

Prohibido:

- stack traces;
- nombres de tablas;
- detalles de RLS;
- IDs internos;
- errores SQL;
- rutas internas;
- configuracion de infraestructura;
- estado real de Google Calendar/Gmail.

## Logs y auditoria

La API debe registrar eventos suficientes para investigar abuso y cambios relevantes, sin guardar datos sensibles innecesarios.

Eventos minimos:

- solicitud recibida;
- validacion rechazada;
- rate limit aplicado;
- CAPTCHA fallido;
- solicitud duplicada;
- solicitud creada;
- error interno;
- intento desde origen no autorizado.

Los logs deben ser internos. No deben exponer datos clinicos ni secretos. La auditoria de cambios sensibles debe cerrarse en conjunto con SEC-005 antes de produccion.

## Disponibilidad publicable

La disponibilidad publica debe ser una abstraccion.

No debe exponer:

- agenda interna completa;
- nombres de terapeutas si no estan aprobados publicamente;
- IDs de `agenda_eventos`;
- IDs de `consultas`;
- ocupacion exacta no necesaria;
- datos de pacientes;
- eventos privados;
- estados internos.

Puede exponer ventanas publicables calculadas por backend futuro, segun reglas operativas aprobadas.

## Relacion con Google Calendar y Gmail

SEC-009 no habilita Google Calendar ni Gmail.

Cuando BE-027 avance:

- Google debe integrarse desde backend seguro;
- eventos deben usar contenido neutro;
- correos deben usar contenido neutro;
- no se deben enviar datos clinicos sensibles a Calendar/Gmail;
- errores de Google no deben exponerse al publico;
- reintentos deben ser idempotentes;
- toda sincronizacion debe quedar auditada.

## Ambientes

Antes de implementar endpoints reales deben existir reglas claras por ambiente:

- local: pruebas con datos ficticios;
- demo: demostracion controlada sin datos reales;
- staging: validacion previa con configuracion aislada;
- produccion: bloqueada hasta cerrar PROD-001.

Cada ambiente debe tener:

- dominio propio o identificable;
- CORS especifico;
- secretos separados;
- base de datos separada o claramente aislada;
- logging y auditoria acordes al riesgo;
- indicador operativo para evitar confusion.

## Checklist minimo antes de implementar

- Agenda interna validada como base local/demo.
- Contrato BE-026 aprobado.
- SEC-009 aprobado.
- BE-020 definido para consentimiento y tratamiento de datos.
- SEC-005 definido para auditoria sensible.
- BE-018 definido para ambientes.
- DOC-001 creado para manual de ambientes.
- DOC-003 creado para carga de datos reales.
- SEC-010 alineado con secretos e identidades tecnicas.
- PROD-001 cerrado antes de datos reales o produccion.

## Pruebas futuras requeridas

Cuando exista implementacion real, deberan validarse:

- CORS por dominio permitido y rechazado;
- rate limit por IP y datos normalizados;
- CAPTCHA o anti-spam;
- validacion de payloads validos e invalidos;
- rechazo de campos desconocidos o prohibidos;
- idempotencia ante reintentos;
- deduplicacion;
- errores neutros;
- no exposicion de IDs internos;
- no escritura directa en tablas clinicas, financieras ni Storage;
- no uso de Google en solicitudes no revisadas;
- logging y auditoria minima.

## Criterios de aceptacion de SEC-009

- Se documenta separacion entre endpoints publicos, internos y de servicio.
- Se define CORS estricto por ambiente.
- Se define rate limit y anti-spam.
- Se define validacion y sanitizacion de payloads.
- Se definen errores publicos neutros.
- Se prohiben secretos y tokens en frontend publico.
- Se define idempotencia y deduplicacion.
- Se define relacion con Supabase sin exposicion directa.
- Se define relacion con SEC-005, SEC-010, BE-020, BE-018, DOC-001, DOC-003 y PROD-001.
- Se mantienen fuera de alcance endpoints, codigo, migraciones, `.env`, Supabase remoto, Google y produccion.

## Riesgos pendientes

- SEC-005 aun debe cerrar auditoria de cambios sensibles.
- BE-020 aun debe definir consentimiento y tratamiento de datos.
- BE-018/DOC-001/DOC-003 aun deben cerrar separacion y operacion de ambientes.
- SEC-010 aun debe ser validado antes de credenciales reales.
- BE-027 aun debe definir integracion Google Calendar/Gmail.
- PROD-001 sigue bloqueando datos reales, fotos reales, pagos reales y produccion.

## Recomendacion

Antes de implementar endpoints reales, se recomienda cerrar el siguiente bloque documental:

1. `DOC-004` - Flujo pagina publica -> API -> sistema interno -> Google.
2. `BE-020` - Consentimiento informado y tratamiento de datos.
3. `SEC-005` - Auditoria de cambios sensibles.

La implementacion de API publica debe esperar aprobacion explicita y mantenerse inicialmente en entorno local/demo con datos ficticios.
