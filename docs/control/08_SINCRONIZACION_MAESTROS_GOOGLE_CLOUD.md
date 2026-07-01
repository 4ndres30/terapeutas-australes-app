# Sincronizacion de documentos maestros - Google Cloud

Fecha: `2026-07-01`
Responsable: Control de desarrollo
Estado: Integrada documentalmente en rama / pendiente revision de Javier

## Objetivo

Registrar como complemento maestro la incorporacion de Google Cloud al roadmap del proyecto.

## Regla global

```text
Supabase/PostgreSQL sigue siendo la base actual.
Google Cloud queda como plataforma futura para API segura, Google Workspace, despliegue y automatizacion.
La migracion sera progresiva y requerira aprobacion de Javier.
```

## Documentos maestros cubiertos

Esta sincronizacion complementa:

- `README.md`
- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

## Cambios incorporados

- Roadmap Google Cloud agregado como estrategia futura.
- Documentos maestros actualizados de forma quirurgica.
- Nueva decision DEC-035 registrada en documento especializado.
- Nueva tarea BE-030 registrada en documento especializado.
- Nueva tarea SEC-010 registrada en documento especializado.
- Nueva tarea DOC-005 registrada en documento especializado.
- Nueva tarea QA-007 registrada en documento especializado.
- Nuevo documento `07_ESTRATEGIA_GOOGLE_CLOUD.md` agregado al control del proyecto.
- Nuevo documento `08_SINCRONIZACION_MAESTROS_GOOGLE_CLOUD.md` agregado al control del proyecto.

## Interpretacion para los chats del proyecto

Control de desarrollo debe usar este documento como indice de la sincronizacion.

Integracion Backend/Estructura debe leer BE-030 antes de proponer API, backend o despliegue cloud.

UI/UX debe considerar que cualquier pagina publica futura debe pasar por API segura y no por escritura directa al sistema interno.

Revision de flujo clinico debe validar consentimiento, lenguaje neutro y limites de datos antes de cualquier uso real.

## Restricciones

Esta sincronizacion es solo documental. No implementa infraestructura, no modifica codigo, no modifica base de datos, no despliega y no habilita datos reales ni produccion.

## Resultado

La documentacion queda complementada con una capa maestra de estrategia Google Cloud y documentos especializados para decision, backend, seguridad, estrategia y QA.
