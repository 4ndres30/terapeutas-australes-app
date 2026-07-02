# BE-026 - Contrato API publica de agendamiento

## Estado

Diseno documental / pendiente implementacion futura.

## Fecha

2026-07-02

## Rama

`be-026-diseno-contrato-api-agendamiento`

## Nivel documental

Nivel 3 - Contrato tecnico sensible.

## Origen

- API-001 - Diseno API publica segura e integracion Google Workspace.
- DEC-033 - API segura como frontera entre pagina publica, sistema interno y servicios Google.
- DEC-034 - Agenda operativa separada de consulta clinica confirmada.
- BE-012 / BE-017 - Diseno de Agenda Operativa.
- BE-028 - Modelo DB de Agenda Operativa.
- BE-029 - Validacion runtime Agenda Operativa.
- QA-008 - Agenda interna cerrada local/demo.

## Objetivo

Definir el contrato tecnico de la futura API publica de agendamiento para que una pagina publica pueda solicitar horas de forma controlada, sin escribir directamente en Supabase ni crear pacientes, consultas, pagos, fotos, eventos Google o datos clinicos.

Este documento no implementa API real.

## Alcance

- Versionado conceptual de rutas bajo `/api/v1`.
- Contratos publicos para disponibilidad, agendamiento y consentimiento.
- Payloads permitidos y prohibidos.
- Respuestas publicas neutras.
- Validaciones minimas.
- Idempotencia y deduplicacion.
- Relacion conceptual con `public.solicitudes_agenda`.
- Reglas de seguridad que deben respetarse en una implementacion futura.

## Fuera de alcance

- Crear endpoints reales.
- Crear backend productivo.
- Crear Supabase Edge Functions, Cloud Run, Cloud Functions o servidor Node.
- Instalar dependencias.
- Modificar frontend publico o interno.
- Modificar migraciones.
- Modificar Auth, RLS, policies o grants.
- Ejecutar SQL.
- Tocar `.env`, secretos o credenciales.
- Tocar Supabase remoto.
- Integrar Google Calendar, Gmail o Workspace.
- Habilitar produccion, datos reales, fotos reales o pagos reales.

## Principios del contrato

La API publica debe operar como frontera segura:

```text
Pagina publica
-> API segura
-> validacion / consentimiento / anti-spam
-> public.solicitudes_agenda
-> revision interna
-> agenda_eventos
-> consultas solo si corresponde
```

Reglas base:

- La pagina publica no debe usar `@supabase/supabase-js` contra tablas internas.
- La pagina publica no debe escribir directo en `consultas`, `pacientes`, `agenda_eventos`, tablas clinicas, tablas financieras ni Storage.
- El destino conceptual de una solicitud publica es `public.solicitudes_agenda`.
- La respuesta publica no debe confirmar una cita clinica definitiva salvo que exista un flujo posterior aprobado.
- Google Calendar y Gmail quedan fuera de BE-026.
- Los errores publicos deben ser neutros.

## Versionado

Version inicial propuesta:

```text
/api/v1/public/agenda/disponibilidad
/api/v1/public/agendamientos
/api/v1/public/consentimientos
```

No se recomienda exponer rutas sin version.

## Modelo de autenticacion

Los endpoints publicos no deben requerir Supabase Auth de usuario interno.

La proteccion publica debe basarse en:

- CORS estricto por dominio autorizado.
- Rate limit.
- CAPTCHA o mecanismo anti-spam equivalente.
- Idempotency key.
- Validacion estricta de payload.
- Auditoria tecnica minima.

Si la API usa una credencial de servicio para escribir en Supabase, esa credencial debe existir solo en backend seguro y nunca en frontend.

## Contrato `GET /api/v1/public/agenda/disponibilidad`

### Proposito

Consultar disponibilidad publicable o bloques sugeridos sin exponer agenda interna completa.

### Query permitida

```json
{
  "servicio": "consulta",
  "modalidad": "online",
  "desde": "2026-07-10",
  "hasta": "2026-07-17",
  "zona_horaria": "America/Santiago"
}
```

### Reglas de validacion

- `servicio` debe pertenecer a catalogo publico aprobado.
- `modalidad` debe pertenecer a valores permitidos.
- `desde` y `hasta` deben ser fechas validas.
- El rango debe ser acotado.
- La zona horaria debe ser valida y estar permitida.
- El endpoint debe aplicar rate limit.

### Respuesta OK

```json
{
  "ok": true,
  "data": {
    "zona_horaria": "America/Santiago",
    "slots": [
      {
        "inicio": "2026-07-10T10:00:00-04:00",
        "fin": "2026-07-10T11:00:00-04:00",
        "modalidad": "online",
        "tipo": "publicable"
      }
    ]
  }
}
```

### Datos prohibidos en respuesta

- IDs internos de `agenda_eventos`.
- Nombres de pacientes.
- Eventos internos.
- Motivos de consulta.
- Notas internas.
- Terapeutas no autorizados.
- Datos financieros.
- Datos clinicos o sensibles.

## Contrato `POST /api/v1/public/agendamientos`

### Proposito

Recibir una solicitud publica de agendamiento inicial.

### Headers recomendados

```text
Content-Type: application/json
Idempotency-Key: <uuid-o-token-cliente>
```

### Payload permitido

```json
{
  "contacto": {
    "nombre": "Persona Demo",
    "email": "persona.demo@example.com",
    "telefono": "+56900000000"
  },
  "agenda": {
    "servicio": "consulta",
    "modalidad": "online",
    "fecha_preferida": "2026-07-10",
    "bloque_horario_preferido": "manana",
    "slot_solicitado": {
      "inicio": "2026-07-10T10:00:00-04:00",
      "fin": "2026-07-10T11:00:00-04:00",
      "zona_horaria": "America/Santiago"
    }
  },
  "mensaje": {
    "motivo_general": "Solicitud general de atencion"
  },
  "consentimiento": {
    "aceptado": true,
    "version": "pendiente-be-020",
    "fecha_aceptacion": "2026-07-02T12:00:00-04:00"
  },
  "control": {
    "captcha_token": "token-demo",
    "canal_origen": "web_publica"
  }
}
```

### Datos prohibidos

- Diagnosticos.
- Relatos clinicos extensos.
- Informacion canalizada.
- Detalles energeticos profundos.
- Fotos o archivos.
- Datos financieros.
- IDs internos de Supabase.
- IDs de paciente, consulta, caso, revision, trabajo o pago.
- Credenciales, tokens internos o datos de sesion.

### Validaciones minimas

- Debe existir nombre de contacto.
- Debe existir email o telefono.
- Email debe tener formato valido si se envia.
- Telefono debe normalizarse o rechazarse si no es interpretable.
- `servicio` debe pertenecer a catalogo publico aprobado.
- `modalidad` debe pertenecer a valores permitidos.
- `motivo_general` debe ser breve y de longitud limitada.
- `consentimiento.aceptado` debe ser `true`.
- `consentimiento.version` debe corresponder a una version vigente definida por BE-020 antes de uso real.
- `slot_solicitado` debe ser futuro y coherente si se envia.
- Debe existir `Idempotency-Key`.
- Debe pasar CAPTCHA o anti-spam equivalente.
- Debe pasar rate limit.

### Mapeo conceptual a `public.solicitudes_agenda`

| Payload API | Campo conceptual |
| --- | --- |
| `contacto.nombre` | `nombre_contacto` |
| `contacto.email` | `email_contacto` |
| `contacto.telefono` | `telefono_contacto` |
| `agenda.servicio` | `servicio_solicitado` |
| `agenda.modalidad` | `modalidad_preferida` |
| `agenda.fecha_preferida` | `fecha_preferida` |
| `agenda.bloque_horario_preferido` | `bloque_horario_preferido` |
| `mensaje.motivo_general` | `mensaje_contacto` o campo equivalente limitado |
| `consentimiento.aceptado` | `consentimiento_contacto` |
| `consentimiento.version` | `consentimiento_version` o campo futuro BE-020 |
| `consentimiento.fecha_aceptacion` | `fecha_consentimiento` |
| `control.canal_origen` | `canal_origen` |
| `Idempotency-Key` | `idempotency_key` |

Estado inicial recomendado:

```text
estado_solicitud = recibida
```

La solicitud no debe crear automaticamente:

- paciente;
- consulta;
- evaluacion;
- caso;
- revision;
- trabajo;
- cobro;
- pago;
- foto;
- evento Google.

### Respuesta aceptada

```json
{
  "ok": true,
  "data": {
    "codigo_solicitud": "pub_ag_20260702_xxxxx",
    "estado": "recibida",
    "mensaje": "Solicitud recibida. El equipo revisara disponibilidad y te contactara."
  }
}
```

La respuesta no debe incluir IDs internos crudos de Supabase.

### Reglas de idempotencia

- El cliente debe enviar `Idempotency-Key`.
- El backend debe asociar esa clave a una huella de payload normalizado.
- Reintentos equivalentes deben devolver el mismo resultado publico.
- Reintentos con la misma clave y payload distinto deben rechazarse con error neutral.
- La ventana de idempotencia debe definirse por SEC-009 o implementacion futura.

## Contrato `POST /api/v1/public/consentimientos`

### Proposito

Registrar o validar consentimiento publico cuando BE-020 defina el modelo final.

En v1 documental, el consentimiento puede viajar embebido en `POST /api/v1/public/agendamientos`. Este endpoint separado queda recomendado solo si BE-020 define una tabla o flujo independiente.

### Payload conceptual

```json
{
  "version": "pendiente-be-020",
  "aceptado": true,
  "fecha_aceptacion": "2026-07-02T12:00:00-04:00",
  "canal_origen": "web_publica",
  "referencia_solicitud": "pub_ag_20260702_xxxxx"
}
```

### Reglas

- No debe almacenar datos clinicos extensos.
- Debe registrar version del texto.
- Debe registrar fecha/hora.
- Debe registrar canal.
- Debe poder vincularse a una solicitud.
- No reemplaza consentimiento clinico completo si el flujo posterior lo requiere.

## Contrato de errores

Los errores deben ser neutros y estables.

### Ejemplo

```json
{
  "ok": false,
  "error": {
    "codigo": "payload_invalido",
    "mensaje": "No fue posible procesar la solicitud. Revisa los datos e intenta nuevamente.",
    "referencia": "err_pub_20260702_xxxxx"
  }
}
```

### Codigos publicos propuestos

| Codigo | HTTP | Uso |
| --- | --- | --- |
| `payload_invalido` | 400 | Formato o campos requeridos invalidos. |
| `consentimiento_requerido` | 400 | Consentimiento ausente o no aceptado. |
| `captcha_requerido` | 400 | Falta validacion anti-spam. |
| `solicitud_duplicada` | 409 | Idempotencia o duplicado detectado. |
| `rate_limit` | 429 | Demasiados intentos. |
| `no_disponible` | 409 | Slot ya no publicable o no disponible. |
| `error_temporal` | 503 | Error transitorio sin detalle tecnico. |

Prohibido exponer:

- stack traces;
- nombres de tablas;
- errores SQL;
- errores RLS;
- secretos;
- configuracion interna;
- IDs internos crudos.

## Seguridad minima para implementacion futura

BE-026 no reemplaza SEC-009. La implementacion futura debe esperar un diseno de seguridad especifico que cubra:

- CORS por dominio.
- Rate limit por IP/fingerprint razonable.
- CAPTCHA o anti-spam.
- Validacion de esquema.
- Sanitizacion.
- Idempotencia.
- Auditoria tecnica.
- Logs sin contenido sensible.
- Secretos solo en backend.
- Separacion LOCAL/DEMO/STAGING/PRODUCCION.
- Politica de errores neutros.

## Relacion con Google Calendar y Gmail

BE-026 no sincroniza Google Calendar ni envia Gmail.

La solicitud publica debe quedar en `solicitudes_agenda` para revision interna. Solo una tarea futura BE-027 puede definir:

- cuando crear evento Calendar;
- que titulo neutral usar;
- que correo neutral enviar;
- como manejar credenciales;
- como auditar reintentos y fallos.

## Relacion con produccion

Este contrato no habilita produccion.

Antes de uso con datos reales deben cerrarse al menos:

- BE-018 - Separacion tecnica de ambientes.
- BE-019 - Backup/restauracion.
- BE-020 - Consentimiento informado y tratamiento de datos.
- SEC-005 - Auditoria de cambios sensibles.
- SEC-009 - Seguridad de API publica.
- DOC-001 - Manual de ambientes.
- DOC-003 - Politica de carga de datos reales.
- QA-006 - Pruebas minimas por rol y no exposicion sensible.
- PROD-001 - Preparacion para uso real con datos sensibles.

## Criterios de aceptacion de BE-026

- Contrato usa `/api/v1`.
- Contrato define disponibilidad, agendamientos y consentimientos.
- Contrato usa `solicitudes_agenda` como destino conceptual.
- Contrato no usa `consultas` para solicitudes publicas.
- Contrato no crea pacientes automaticamente.
- Contrato no crea entidades clinicas, financieras, fotos ni eventos Google.
- Contrato define payloads permitidos y datos prohibidos.
- Contrato define errores neutros.
- Contrato define idempotencia.
- Contrato mantiene BE-027, Google, produccion y datos reales fuera de alcance.
- No se crea codigo, migraciones, endpoints, secretos ni configuracion.

## Riesgos pendientes

- BE-020 aun debe definir consentimiento real y versionado.
- SEC-009 aun debe definir seguridad operativa de la API.
- DOC-001 y BE-018 aun deben separar ambientes.
- SEC-005 aun debe definir auditoria sensible.
- BE-027 aun debe definir Google Calendar/Gmail.
- PROD-001 sigue bloqueante.

## Recomendacion

Con BE-026 documentado, el siguiente bloque recomendado antes de implementar cualquier endpoint es:

1. SEC-009 - Seguridad de API publica.
2. DOC-004 - Flujo pagina publica -> API -> sistema interno -> Google.
3. BE-020 - Consentimiento informado y tratamiento de datos.

La implementacion real debe esperar esas definiciones y seguir trabajando solo en local/demo con datos ficticios.
