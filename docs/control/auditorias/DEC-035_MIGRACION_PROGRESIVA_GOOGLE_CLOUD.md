# DEC-035 - Migracion progresiva a plataforma Google Cloud

## Estado

Propuesta arquitectonica / pendiente aprobacion de Javier.

## Fecha

2026-07-01

## Origen

Conversacion sobre integracion de Codex, WebStorm, Google Cloud Console y momento adecuado para migrar el desarrollo hacia la plataforma Google.

## Decision propuesta

El proyecto **Terapeutas Australes App** no debe migrar inmediatamente toda su base de datos, autenticacion, backend ni operacion productiva hacia Google Cloud.

La estrategia aprobable debe ser progresiva:

1. Mantener Supabase/PostgreSQL como base actual del sistema interno.
2. Preparar Google Cloud como plataforma futura de integracion, secretos, API, despliegue y automatizacion.
3. Integrar Google Calendar/Gmail/Workspace exclusivamente desde backend seguro.
4. Mantener la pagina publica fuera de las tablas clinicas, financieras e internas.
5. Evaluar Cloud Run, Firebase App Hosting u otra alternativa solo cuando el MVP clinico, Agenda operativa, seguridad y ambientes esten estabilizados.
6. Evaluar migracion de base de datos solo en fase posterior, con analisis tecnico, costo, seguridad, cumplimiento y rollback.

## Razon

El proyecto todavia esta en etapa local/demo, con PROD-001 bloqueante para datos reales, fotos reales, pagos reales y produccion.

Migrar demasiado temprano agregaria complejidad de infraestructura antes de cerrar:

- modelo clinico principal;
- Agenda operativa;
- contrato API publica;
- integracion Google Calendar/Gmail;
- separacion de ambientes;
- consentimiento informado;
- auditoria sensible;
- backup/restauracion;
- hardening Auth;
- checklist preproduccion.

La migracion debe servir al producto, no interrumpir su construccion.

## Alcance de la decision

Esta decision cubre:

- Google Cloud como plataforma futura;
- continuidad de Supabase como base actual;
- API segura como frontera;
- Google Calendar/Gmail desde backend controlado;
- Secret Manager/IAM/OAuth como componentes futuros;
- despliegue futuro mediante Cloud Run, Firebase App Hosting o alternativa equivalente;
- CI/CD futuro desde GitHub;
- separacion por ambientes LOCAL, DEMO, STAGING y PRODUCCION.

## Fuera de alcance

Esta decision no autoriza:

- crear un proyecto Google Cloud;
- activar facturacion;
- crear credenciales;
- modificar `.env`;
- instalar dependencias;
- crear endpoints;
- desplegar infraestructura;
- migrar Supabase;
- migrar Auth;
- cambiar RLS;
- tocar Supabase remoto;
- cargar datos reales;
- habilitar produccion.

## Impacto documental

Debe generar o actualizar tareas:

- `BE-030` - Disenar arquitectura de plataforma Google Cloud.
- `SEC-010` - Disenar manejo de secretos, OAuth, IAM y cuentas de servicio.
- `DOC-005` - Documentar estrategia de migracion progresiva a Google Cloud.
- `QA-007` - Validar checklist de pre-migracion cloud.

Debe mantener vigentes:

- `API-001` - API publica segura e integracion Google Workspace.
- `BE-026` - Contrato de API publica de agendamiento.
- `BE-027` - Integracion Google Calendar / Gmail / Workspace.
- `SEC-009` - Seguridad de API publica.
- `DOC-004` - Flujo pagina publica -> API -> sistema interno -> Google.
- `PROD-001` - Preparacion para uso real con datos sensibles.

## Arquitectura objetivo conceptual

```text
WebStorm + Codex
  -> GitHub / PRs
  -> sistema interno React + Supabase actual
  -> API segura futura
  -> Google Cloud como runtime/secretos/despliegue futuro
  -> Google Calendar / Gmail / Workspace desde backend
```

## Reglas

- Supabase/PostgreSQL sigue siendo la fuente de datos actual.
- Google Cloud no reemplaza automaticamente Supabase.
- Google Calendar y Gmail no deben integrarse desde frontend publico.
- Los secretos nunca deben vivir en frontend ni en repositorio.
- El despliegue cloud no habilita por si solo uso con datos reales.
- La produccion sigue bloqueada por PROD-001.
- Toda integracion debe ser reversible y separada por ambiente.

## Observaciones

Esta decision complementa DEC-033 y DEC-034.

No reemplaza API-001, sino que agrega la capa faltante de plataforma cloud y migracion progresiva.
