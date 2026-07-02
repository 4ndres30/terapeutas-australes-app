# BE-020 - Consentimiento informado y tratamiento de datos

Estado: Diseno documental base / pendiente validacion clinica y legal.
Fecha: 2026-07-02
Responsable: Control de desarrollo / Revision Clinica / Backend
Rama usada: `be-020-consentimiento-tratamiento-datos`

## Objetivo

Definir el marco operativo minimo para consentimiento informado y autorizacion de tratamiento de datos antes de usar el sistema con pacientes reales, API publica real o integracion Google funcional.

Este documento no reemplaza revision juridica ni clinica. Debe ser validado por responsables del proyecto antes de convertirse en texto final para pacientes.

## Fuera de alcance

- Texto legal definitivo.
- Firma electronica real.
- Endpoints.
- Formularios funcionales.
- Migraciones.
- SQL.
- Cambios Auth/RLS.
- `.env`.
- Supabase remoto.
- Google Calendar/Gmail funcional.
- Produccion.
- Datos reales, fotos reales o pagos reales.

## Principios

- No registrar pacientes reales sin consentimiento o base de autorizacion aprobada.
- Separar solicitud publica, registro interno y consulta clinica.
- Solicitar solo datos necesarios para la finalidad declarada.
- Evitar datos clinicos extensos en formularios publicos.
- Registrar evidencia de aceptacion cuando corresponda.
- Permitir revision interna antes de confirmar atenciones o sincronizar Google.
- Mantener PROD-001 bloqueante hasta cerrar ambientes, auditoria y validaciones.

## Finalidades de tratamiento

Finalidades minimas a declarar y separar:

- responder solicitudes de contacto o agenda;
- coordinar horas y comunicaciones asociadas;
- registrar antecedentes necesarios para atencion;
- gestionar ficha clinica interna cuando exista relacion de atencion;
- gestionar cobros y pagos cuando corresponda;
- cumplir obligaciones administrativas y de trazabilidad;
- enviar recordatorios neutros si la persona lo autoriza.

## Consentimientos por contexto

### Pagina publica

Debe solicitar aceptacion antes de enviar una solicitud de agenda.

Debe informar:

- datos solicitados;
- finalidad de contacto y coordinacion;
- que la solicitud no confirma automaticamente una cita;
- que no debe ingresar detalles clinicos extensos en texto libre;
- canal de contacto alternativo;
- referencia a politica de privacidad cuando exista.

### Sistema interno

Antes de registrar paciente real o consulta clinica, usuario interno debe verificar que exista consentimiento suficiente o autorizacion aplicable.

### Finanzas

Nombre completo, telefono o email para cobranza directa requieren aprobacion expresa de Control y consentimiento/autorizacion suficiente. Por defecto Finanzas debe operar con alias o datos administrativos minimos.

### Fotos y archivos

Fotos reales o archivos clinicos requieren autorizacion especifica, finalidad clara, acceso restringido y auditoria. Mientras PROD-001 este abierto, siguen prohibidos.

### Google Calendar/Gmail

Google no debe recibir datos clinicos sensibles. Eventos y correos deben usar contenido neutro y solo despues de revision interna.

## Datos permitidos y prohibidos

### Permitidos en solicitud publica inicial

- nombre de contacto;
- email;
- telefono;
- modalidad;
- preferencia de fecha/hora;
- servicio o motivo general no sensible;
- aceptacion de consentimiento.

### Prohibidos en solicitud publica inicial

- diagnosticos;
- antecedentes clinicos extensos;
- fotos;
- documentos;
- datos financieros;
- datos de terceros no necesarios;
- IDs internos;
- instrucciones para Calendar/Gmail.

## Evidencia minima de aceptacion

La implementacion futura debe poder registrar:

- version del texto aceptado;
- fecha y hora;
- canal de aceptacion;
- usuario interno responsable, si aplica;
- origen publico o interno;
- solicitud, paciente o consulta asociada cuando corresponda;
- estado de revocacion o reemplazo, si aplica.

No se define estructura de base de datos en esta tarea.

## Estados conceptuales

- `pendiente`: falta aceptacion o verificacion.
- `aceptado`: consentimiento registrado.
- `rechazado`: persona no acepta o no autoriza.
- `revocado`: consentimiento retirado para usos futuros.
- `reemplazado`: existe nueva version aceptada.
- `no_aplica`: caso justificado por proceso interno aprobado.

## Reglas operativas

- No convertir solicitud publica en consulta clinica sin revision interna.
- No cargar datos reales mientras PROD-001 siga abierto.
- No usar fotos reales sin autorizacion especifica.
- No enviar informacion clinica sensible por correo.
- No exponer datos clinicos a Finanzas.
- No usar Google Calendar como ficha clinica.
- No tratar consentimiento como un checkbox generico sin version ni finalidad.

## Relacion con API publica

BE-026 define `POST /api/v1/public/consentimientos` como contrato conceptual opcional.

BE-020 define que cualquier implementacion futura debe:

- validar version del consentimiento;
- asociar aceptacion a solicitud o persona cuando corresponda;
- rechazar solicitudes incompletas;
- mantener errores publicos neutros;
- evitar datos sensibles en respuesta publica.

## Relacion con auditoria

SEC-005 define el modelo documental de trazabilidad, pendiente implementacion futura, para:

- creacion de consentimiento;
- cambios de version;
- revocacion;
- conversion de solicitud a paciente o consulta;
- acceso o modificacion de datos sensibles;
- exposicion excepcional de datos a Finanzas;
- autorizacion de fotos o archivos.

## Criterios de aceptacion de BE-020

- Define finalidades de tratamiento.
- Separa consentimiento publico, interno, financiero, fotos y Google.
- Define datos permitidos y prohibidos para solicitud publica.
- Define evidencia minima de aceptacion.
- Define estados conceptuales.
- Mantiene necesidad de validacion clinica/legal.
- Mantiene PROD-001 bloqueante.
- No implementa codigo, migraciones, endpoints, Supabase remoto, Google ni produccion.

## Riesgos pendientes

- Falta texto legal final aprobado.
- Falta politica de privacidad publica.
- Falta implementar SEC-005 para auditoria sensible.
- Falta BE-018/DOC-001/DOC-003 para ambientes y carga real.
- Falta definir almacenamiento tecnico de consentimientos.
- Falta definir revocacion operativa y efectos.
- PROD-001 sigue bloqueante.

## Recomendacion

El siguiente paso recomendado es cerrar `BE-021 - Politica de anulacion vs eliminacion`, porque consentimiento y auditoria requieren reglas claras para correcciones, revocaciones y anulaciones antes de usar datos reales.
