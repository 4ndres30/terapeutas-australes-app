# CTRL-009 - Sincronizacion documental Google Cloud

## Estado

Integrada documentalmente / pendiente revision de Javier.

## Fecha

2026-07-01

## Rama

`docs/google-cloud-migracion-progresiva`

## Origen

Solicitud de Javier para actualizar la documentacion tecnica considerando:

- futura migracion progresiva hacia plataforma Google;
- integracion Google Calendar / Gmail / Workspace;
- uso de Codex/WebStorm como soporte de desarrollo;
- preparacion futura de API segura;
- continuidad del desarrollo actual con Supabase/PostgreSQL.

## Objetivo

Registrar una sincronizacion documental que formalice que el proyecto no debe migrar inmediatamente todo su backend, base de datos ni Auth hacia Google Cloud, sino avanzar mediante una estrategia progresiva, segura y reversible.

## Decision operativa de esta sincronizacion

Esta tarea no modifica codigo fuente, migraciones, `.env`, Supabase local/remoto, credenciales, secretos, configuracion de Google Cloud ni configuracion productiva.

La actualizacion documental se realiza creando documentos especializados y sincronizando los documentos maestros con cambios minimos, sin reemplazar documentos completos.

## Documentos nuevos creados

- `docs/control/auditorias/DEC-035_MIGRACION_PROGRESIVA_GOOGLE_CLOUD.md`
- `docs/control/auditorias/BE-030_ARQUITECTURA_PLATAFORMA_GOOGLE_CLOUD.md`
- `docs/control/auditorias/SEC-010_SECRETOS_OAUTH_IAM_GOOGLE_CLOUD.md`
- `docs/control/auditorias/DOC-005_ESTRATEGIA_MIGRACION_PROGRESIVA_GOOGLE_CLOUD.md`
- `docs/control/auditorias/QA-007_CHECKLIST_PRE_MIGRACION_CLOUD.md`

## Documentos maestros sincronizados en esta revision

La rama del PR #43 sincroniza los cambios en:

- `README.md`
- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

## Cambios conceptuales reflejados en los maestros

### Nueva decision

`DEC-035 - Migracion progresiva a plataforma Google Cloud`.

### Nuevas tareas

- `BE-030 - Disenar arquitectura de plataforma Google Cloud`.
- `SEC-010 - Disenar manejo de secretos, OAuth, IAM y cuentas de servicio`.
- `DOC-005 - Documentar estrategia de migracion progresiva a Google Cloud`.
- `QA-007 - Validar checklist de pre-migracion cloud`.

### Regla principal

```text
Supabase/PostgreSQL sigue siendo la base actual.
Google Cloud queda como plataforma futura para API segura, integracion Google Workspace, secretos, despliegue y automatizacion.
No se migra la base de datos, Auth ni produccion en esta fase.
```

## Resumen ejecutivo para Control de desarrollo

El proyecto ya tenia una base correcta para API publica segura y Google Calendar/Gmail/Workspace mediante API-001, DEC-033 y BE-012/BE-017.

La brecha detectada era que Google Cloud aparecia solo como referencia conceptual, no como plataforma tecnica planificada.

CTRL-009 corrige esa brecha documental creando una capa especifica para:

- arquitectura Google Cloud;
- migracion progresiva;
- IAM/OAuth/secretos;
- criterios de despliegue futuro;
- separacion de ambientes;
- continuidad segura con Supabase;
- bloqueo de produccion mientras PROD-001 siga abierto.

## Riesgos controlados

- Evita migracion prematura.
- Evita mezclar desarrollo clinico con infraestructura cloud.
- Evita exponer secretos en frontend.
- Evita tocar `.env` o credenciales.
- Mantiene Google Calendar/Gmail fuera del frontend publico.
- Mantiene PROD-001 como bloqueo para datos reales.

## Restricciones

CTRL-009 no autoriza:

- crear proyecto Google Cloud;
- activar facturacion;
- crear service accounts;
- crear OAuth client IDs;
- crear secretos;
- modificar `.env`;
- modificar codigo;
- crear endpoints;
- desplegar en Cloud Run/Firebase;
- migrar base de datos;
- tocar Supabase remoto;
- usar datos reales;
- habilitar produccion.

## Criterios de aceptacion

- La estrategia de migracion progresiva queda documentada.
- Se diferencia Google Workspace de Google Cloud Platform.
- Se conserva Supabase/PostgreSQL como base actual.
- Se define que Cloud Run/Firebase App Hosting son evaluaciones futuras, no decisiones implementadas.
- Se crean tareas posteriores para backend, seguridad, documentacion y QA.
- PROD-001 sigue bloqueante.

## Resultado

Sincronizacion integrada en rama. Queda pendiente revision de Javier.
