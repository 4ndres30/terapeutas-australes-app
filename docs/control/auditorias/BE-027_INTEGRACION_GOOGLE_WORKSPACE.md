# BE-027 - Diseño de Integración con Google Workspace (Google Calendar)

## Estado

Diseño documental / pendiente integración futura.

## Fecha

2026-07-08

## Rama

`feature/recuperacion-y-agendamiento-contrato`

## Objetivo

Definir la arquitectura conceptual y las directrices de privacidad para sincronizar los eventos de la agenda interna del terapeuta (`public.agenda_eventos`) con Google Calendar de forma segura, garantizando el aislamiento de la información clínica y de datos personales de los pacientes.

---

## Flujo de Autenticación (OAuth 2.0)

Para que el sistema sincronice eventos con las cuentas de Google de cada terapeuta, se define un flujo estándar de delegación de credenciales (OAuth 2.0 Web Application Flow):

```text
Terapeuta (UI)
  -> 1. Clic "Conectar con Google Calendar"
  -> 2. Redirección a Google OAuth Consent Screen (con Scopes específicos)
  -> 3. Consentimiento y callback a la API del sistema con `code`
  -> 4. Intercambio de `code` por `access_token` y `refresh_token`
  -> 5. Almacenamiento encriptado de tokens
```

### Scopes requeridos
- `https://www.googleapis.com/auth/calendar.events` (Lectura y escritura de eventos del calendario del terapeuta).

---

## Almacenamiento Seguro de Credenciales

Los tokens obtenidos representan acceso directo al calendario personal de los terapeutas y deben ser protegidos celosamente:

1. **Tabla de Credenciales:** `public.terapeuta_oauth_tokens`.
2. **Políticas RLS:** Acceso de lectura/escritura únicamente permitido al propio terapeuta (autenticado) y al rol administrativo de servicio.
3. **Encriptación de Refresh Tokens:** Los tokens de refresco (`refresh_token`) deben almacenarse encriptados a nivel de fila (por ejemplo, usando la extensión `pgcrypto` de PostgreSQL con una clave secreta no expuesta en el cliente).

---

## Políticas de Privacidad y Contrato de Datos (Calendar Payload)

> [!IMPORTANT]
> Para cumplir con las políticas de aislamiento de datos clínicos de Terapeutas Australes, queda estrictamente prohibido enviar detalles clínicos o identificadores reales del paciente a los servidores de Google.

### Estructura de Payload del Evento

| Campo de Google Calendar | Criterio de Privacidad | Ejemplo de Valor |
| --- | --- | --- |
| **Title (Título)** | Genérico. No debe contener nombres de pacientes ni tipo de sesión clínica. | `"Sesión de Acompañamiento - [Código Paciente]"` |
| **Description (Descripción)** | Breve, administrativa. Sin motivo de consulta ni notas. | `"Servicio: Consulta Integral. Modalidad: Online. Referencia: TRA-ABCD1234."` |
| **Start / End Time** | Coincide exactamente con el evento de la agenda local. | `2026-07-10T10:00:00-04:00` |
| **Attendees (Invitados)** | Vacío por defecto para evitar revelar el correo del paciente. | `[]` |
| **Location (Ubicación)** | Genérica o enlace de videollamada administrativo. | `"Sala virtual de Terapeutas Australes"` |

---

## Estrategia de Sincronización y Conflictos

1. **Direccionalidad:** Sincronización unidireccional (de `public.agenda_eventos` hacia Google Calendar) en la primera versión para evitar colisiones complejas y borrado accidental de eventos internos.
2. **Trigger/Webhook:** Al insertar o modificar un evento en `agenda_eventos`, se encola un trabajo asíncrono que consume la API de Google Calendar y almacena el `google_event_id` en nuestra base de datos.
3. **Manejo de Errores:** En caso de expiración del `access_token`, el backend seguro utilizará el `refresh_token` para obtener uno nuevo antes de reintentar la llamada.

---

## Conclusión

Este diseño permite que los terapeutas tengan visibilidad de sus bloques agendados en sus calendarios cotidianos sin comprometer la confidencialidad médica de los pacientes del centro.
