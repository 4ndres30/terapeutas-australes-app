# Estrategia Google Cloud

Fecha creacion: `2026-07-01`
Responsable documental: Control de desarrollo
Estado: Propuesta documental / pendiente validacion de Javier

## Objetivo

Este documento resume la estrategia de incorporacion progresiva de Google Cloud en **Terapeutas Australes App**.

No reemplaza a los documentos tecnicos detallados, sino que actua como punto de entrada rapido para Control de desarrollo, Integracion Backend/Estructura, UI/UX y Revision de flujo clinico.

## Regla principal

```text
Supabase/PostgreSQL sigue siendo la base actual.
Google Cloud queda como plataforma futura para API segura, integracion Google Workspace, despliegue y automatizacion.
No se migra la base de datos, Auth ni produccion en esta fase.
```

## Estado actual

El proyecto se mantiene en etapa local/demo.

No esta habilitado para:

- datos reales;
- fotos reales;
- pagos reales;
- produccion;
- despliegue cloud productivo;
- integracion Calendar/Gmail desde frontend.

PROD-001 sigue bloqueante.

## Relacion con documentos existentes

Esta estrategia complementa:

- `API-001_DISENO_API_PUBLICA_GOOGLE_WORKSPACE.md`;
- `BE-012_BE-017_DISENO_AGENDA_OPERATIVA.md`;
- `BE-028_IMPLEMENTACION_MODELO_DB_AGENDA_OPERATIVA.md`;
- `PROD-001_PREPARACION_USO_REAL_DATOS_SENSIBLES.md`;
- `SEC-003_HARDENING_AUTH.md`;
- `SEC-008_IMPLEMENTACION_HARDENING_AUTH.md`.

## Documentos nuevos relacionados

- `auditorias/CTRL-009_SYNC_DOCUMENTAL_GOOGLE_CLOUD.md`
- `auditorias/DEC-035_MIGRACION_PROGRESIVA_GOOGLE_CLOUD.md`
- `auditorias/BE-030_ARQUITECTURA_PLATAFORMA_GOOGLE_CLOUD.md`
- `auditorias/SEC-010_SECRETOS_OAUTH_IAM_GOOGLE_CLOUD.md`
- `auditorias/DOC-005_ESTRATEGIA_MIGRACION_PROGRESIVA_GOOGLE_CLOUD.md`
- `auditorias/QA-007_CHECKLIST_PRE_MIGRACION_CLOUD.md`

## Arquitectura objetivo conceptual

```text
WebStorm + Codex
  -> GitHub / PRs
  -> sistema interno React + Supabase actual
  -> API segura futura
  -> Google Cloud como runtime/despliegue futuro
  -> Google Calendar / Gmail / Workspace desde backend controlado
```

## Camino recomendado

### 1. Mantener el desarrollo actual

Continuar con:

- WebStorm;
- GitHub;
- Supabase/PostgreSQL;
- React + Vite;
- documentacion de control;
- ramas y PRs.

### 2. Cerrar la base funcional pendiente

Priorizar:

- Agenda operativa runtime;
- AgendaPage;
- consentimiento;
- auditoria sensible;
- backup/restauracion;
- ambientes;
- seguridad API;
- checklist PROD-001.

### 3. Disenar API y Google Workspace

Antes de implementar:

- BE-026 contrato API publica;
- BE-027 integracion Calendar/Gmail;
- SEC-009 seguridad API publica;
- SEC-010 seguridad cloud;
- DOC-004 flujo pagina publica -> API -> sistema interno -> Google.

### 4. Evaluar despliegue cloud controlado

Opciones futuras:

- Cloud Run para backend/API.
- Firebase App Hosting si el frontend evoluciona hacia ese camino.

Ninguna opcion habilita por si sola datos reales ni produccion.

### 5. Evaluar migracion de base solo en fase posterior

La base no debe migrarse todavia.

Una eventual migracion desde Supabase/PostgreSQL debe requerir:

- necesidad real;
- comparativa tecnica;
- estimacion de costos;
- plan de rollback;
- seguridad equivalente;
- aprobacion expresa de Javier.

## Tareas nuevas sugeridas

- `BE-030` - Disenar arquitectura de plataforma Google Cloud.
- `SEC-010` - Disenar seguridad cloud.
- `DOC-005` - Documentar estrategia de migracion progresiva a Google Cloud.
- `QA-007` - Validar checklist de pre-migracion cloud.

## Restricciones

Este documento no autoriza:

- crear proyecto Google Cloud;
- activar facturacion;
- instalar dependencias;
- crear endpoints;
- desplegar infraestructura;
- migrar Supabase;
- migrar Auth;
- tocar Supabase remoto;
- usar datos reales;
- habilitar produccion.

## Resultado esperado

Google Cloud queda incorporado al roadmap de forma ordenada, pero sin romper la estrategia actual ni exponer datos sensibles.
