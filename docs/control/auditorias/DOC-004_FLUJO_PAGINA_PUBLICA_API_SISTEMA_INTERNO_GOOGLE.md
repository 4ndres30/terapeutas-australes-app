# DOC-004 - Flujo pagina publica -> API -> sistema interno -> Google

Estado: Documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Control de desarrollo
Rama usada: `doc-004-flujo-publica-api-google`

## Objetivo

Documentar el flujo operativo futuro entre pagina publica, API segura, Agenda interna, Supabase/PostgreSQL y Google Calendar/Gmail/Workspace.

Este documento no implementa API, Google, backend, infraestructura ni produccion. Solo alinea el mapa funcional antes de construir.

## Fuera de alcance

- Endpoints reales.
- Codigo fuente.
- Migraciones.
- SQL.
- Cambios Auth/RLS.
- `.env`.
- Credenciales.
- Supabase remoto.
- `supabase db push`.
- Google Calendar/Gmail funcional.
- Infraestructura cloud.
- Produccion.
- Datos reales, fotos reales o pagos reales.

## Principio rector

La pagina publica no escribe directo en Supabase ni crea pacientes, consultas, eventos internos, casos, trabajos, cobros, pagos, fotos o eventos Google.

El destino conceptual de una solicitud publica es `solicitudes_agenda`, mediante API segura y controles definidos por BE-026 y SEC-009.

## Flujo futuro de solicitud publica

1. Persona completa formulario publico con datos minimos.
2. Frontend publico envia solicitud a `POST /api/v1/public/agendamientos`.
3. API valida CORS, rate limit, anti-spam, payload, consentimiento e idempotencia.
4. API crea una solicitud en `solicitudes_agenda`.
5. Sistema interno muestra la solicitud para revision humana.
6. Usuario interno valida datos, consentimiento y disponibilidad.
7. Usuario interno puede convertir la solicitud en evento operativo interno o asociarla a paciente/consulta si corresponde.
8. Solo despues de revision interna se evalua sincronizacion Google.
9. Google Calendar/Gmail recibe contenido neutro, sin detalle clinico sensible.
10. El sistema registra auditoria minima y estado final.

## Datos permitidos desde pagina publica

- Nombre de contacto.
- Email.
- Telefono.
- Servicio o motivo general no sensible.
- Modalidad.
- Preferencia de fecha/hora.
- Aceptacion de consentimiento, cuando BE-020 lo defina.

## Datos prohibidos desde pagina publica v1

- Diagnosticos o antecedentes clinicos extensos.
- Fotos o adjuntos.
- Datos financieros.
- IDs internos.
- Instrucciones para Google.
- Mensajes que deban entrar directo a ficha clinica.
- Datos de terceros no necesarios.

## Estados conceptuales

### Solicitud publica

Estados sugeridos:

- `recibida`
- `en_revision`
- `requiere_contacto`
- `aceptada`
- `rechazada`
- `duplicada`
- `cancelada`

La solicitud publica no equivale a cita confirmada.

### Evento interno

Solo usuarios internos autorizados pueden crear o actualizar `agenda_eventos`.

Estados internos siguen el modelo ya validado por Agenda interna y no deben exponerse completos al publico.

### Consulta clinica

`consultas` solo debe usarse cuando exista validacion interna, paciente real y consentimiento suficiente.

## Consentimiento

BE-020 define la base documental pendiente de validacion clinica/legal para:

- finalidades de tratamiento;
- datos permitidos y prohibidos;
- forma de aceptacion futura;
- version aceptada;
- fecha/hora;
- canal de aceptacion;
- relacion con solicitud, paciente o consulta;
- revocacion, rechazo o reemplazo.

DOC-004 no implementa BE-020 ni reemplaza validacion legal/clinica.

## Disponibilidad publica

`GET /api/v1/public/agenda/disponibilidad` debe devolver ventanas publicables, no agenda interna completa.

No debe exponer:

- nombres internos no aprobados;
- IDs de eventos;
- IDs de consultas;
- datos de pacientes;
- ocupacion completa;
- estados internos.

## Revision interna

Antes de confirmar:

- revisar duplicados;
- revisar consentimiento;
- validar contacto;
- validar disponibilidad real;
- decidir si corresponde solicitud, evento operativo, paciente o consulta;
- mantener trazabilidad.

## Google Calendar

Google Calendar no se sincroniza al recibir una solicitud no revisada.

Si BE-027 se implementa en el futuro:

- sincronizar solo desde backend seguro;
- usar titulos neutros;
- evitar datos clinicos;
- no exponer errores de Google al publico;
- registrar resultado tecnico;
- permitir reintentos idempotentes.

## Gmail / Workspace

Correos futuros deben ser neutros.

No deben incluir:

- diagnosticos;
- detalles clinicos;
- informacion financiera;
- IDs internos;
- enlaces con tokens inseguros;
- contenido sensible innecesario.

## Errores, duplicados y reintentos

La API publica debe responder con mensajes neutros.

Casos minimos:

- validacion fallida;
- rate limit;
- CAPTCHA fallido;
- duplicado;
- error interno;
- disponibilidad no publicable;
- solicitud recibida pero pendiente revision.

Los reintentos deben usar idempotencia definida por BE-026/SEC-009.

## Auditoria

SEC-005 define el modelo documental de auditoria. Su implementacion real debe cerrarse antes de produccion.

Eventos minimos futuros:

- solicitud recibida;
- solicitud rechazada por validacion;
- duplicado detectado;
- solicitud revisada;
- conversion a evento interno;
- asociacion a paciente o consulta;
- sincronizacion Google intentada;
- correo enviado o fallido;
- cancelacion o cambio sensible.

## Ambientes

- Local: pruebas con datos ficticios.
- Demo: demostracion controlada sin datos reales.
- Staging: pendiente definicion y aislamiento.
- Produccion: bloqueada hasta cerrar PROD-001.

Cada ambiente debe tener dominios, CORS, secretos, datos y auditoria separados.

## Dependencias antes de implementacion real

- BE-020 consentimiento informado.
- SEC-005 auditoria sensible.
- BE-018 separacion tecnica de ambientes.
- DOC-001 manual de ambientes.
- DOC-003 politica de carga de datos reales.
- BE-027 integracion Google Calendar/Gmail.
- SEC-010 secretos, OAuth e IAM.
- PROD-001 cierre de preparacion para datos reales.

## Criterios de aceptacion de DOC-004

- Describe flujo publico -> API -> sistema interno -> Google.
- Separa solicitud publica, evento interno y consulta clinica.
- Define datos permitidos y prohibidos por tramo.
- Mantiene Google despues de revision interna.
- Documenta errores, duplicados y reintentos.
- Mantiene PROD-001 como bloqueo.
- No implementa endpoints, codigo, migraciones, Supabase remoto ni Google real.

## Recomendacion

Antes de construir API publica real, validar BE-020 e implementar SEC-005. Sin consentimiento y auditoria operativa, la API no debe avanzar a datos reales ni produccion.
