# BE-030 - Arquitectura de plataforma Google Cloud

## Estado

Diseno arquitectonico documental / pendiente implementacion futura.

## Fecha

2026-07-01

## Origen

DEC-035 / API-001 / BE-027 / DOC-004 / PROD-001.

## Objetivo

Definir como Google Cloud debe participar en la arquitectura futura del proyecto **Terapeutas Australes App** sin migrar prematuramente la base de datos, Auth, produccion ni datos reales.

## Resumen ejecutivo

Google Cloud debe considerarse inicialmente como plataforma futura para:

- API segura;
- integracion Google Calendar / Gmail / Workspace;
- manejo de secretos;
- OAuth y credenciales controladas;
- despliegue futuro;
- automatizacion CI/CD;
- observabilidad tecnica;
- separacion de ambientes.

Supabase/PostgreSQL sigue siendo la base actual del sistema interno.

## Estado actual del proyecto

El proyecto actual opera como aplicacion React + TypeScript + Vite conectada a Supabase/PostgreSQL.

No existe backend HTTP propio implementado.

No existe integracion funcional con Google Calendar, Gmail, Workspace o Google Cloud.

Agenda operativa cuenta con diseno, modelo DB inicial y validacion runtime local. Sigue pendiente UI funcional, API publica, integracion Google y produccion.

PROD-001 sigue bloqueante.

## Arquitectura actual

```text
Usuario interno autenticado
  -> React/Vite
  -> Supabase Auth
  -> Supabase/PostgreSQL + RLS
```

Este patron es valido para el sistema interno protegido, pero no debe copiarse para pagina publica anonima.

## Arquitectura objetivo futura

```text
Pagina publica
  -> API publica segura
  -> backend controlado
  -> Supabase/PostgreSQL actual
  -> Google Calendar/Gmail/Workspace

Sistema interno
  -> React/Vite autenticado
  -> Supabase/PostgreSQL
  -> backend interno futuro cuando corresponda

Google Cloud
  -> runtime API futuro
  -> Secret Manager
  -> IAM / service accounts
  -> OAuth clients
  -> logs/observabilidad
  -> despliegue y automatizacion
```

## Componentes Google Cloud evaluables

### Cloud Run

Candidato para ejecutar una API segura o backend Node/TypeScript cuando el contrato BE-026 este definido.

Uso posible:

- endpoints publicos de agendamiento;
- endpoints internos de sincronizacion;
- integracion Calendar/Gmail;
- workers livianos;
- webhooks futuros.

No debe activarse antes de definir ambientes, secretos, IAM, CORS, rate limit, consentimiento y auditoria.

### Firebase App Hosting

Candidato si se decide alojar una futura aplicacion web compatible con ese flujo.

Uso posible:

- hosting de frontend o app web;
- integracion con GitHub;
- despliegue administrado.

No reemplaza por si solo la API segura ni el control de secretos.

### Secret Manager

Debe ser el destino futuro para secretos de produccion/staging cuando exista backend cloud.

Debe almacenar, segun corresponda:

- tokens OAuth;
- credenciales de integracion;
- claves tecnicas del backend;
- configuracion sensible por ambiente.

No debe almacenar informacion clinica operacional.

### IAM y service accounts

Debe usarse con minimo privilegio.

Cada ambiente debe tener identidad separada.

No se debe usar una cuenta con permisos amplios tipo Owner para despliegues o ejecucion normal.

### Cloud Build / GitHub Actions

La automatizacion futura debe pasar por PR, revision y rama aprobada.

La autenticacion de CI/CD hacia Google Cloud debe definirse en SEC-010 antes de implementarse.

### Logging / observabilidad

Los logs deben evitar informacion sensible.

No deben registrar motivos clinicos, detalles energeticos, fotos, notas internas, datos financieros sensibles ni payloads completos de formularios publicos.

## Relacion con Supabase

Supabase sigue siendo:

- base de datos actual;
- Auth actual;
- RLS actual;
- Storage actual para fotos demo/local;
- origen de migraciones SQL actuales.

Google Cloud no reemplaza automaticamente:

- Supabase Auth;
- RLS;
- PostgreSQL;
- Storage;
- migraciones existentes.

Cualquier migracion futura de base de datos debe tener tarea independiente, plan de rollback, comparacion de costos, analisis de seguridad y validacion de compatibilidad.

## Relacion con Agenda

BE-030 depende de la arquitectura de Agenda:

- `solicitudes_agenda` recibe solicitudes iniciales.
- `agenda_eventos` representa eventos internos.
- `consultas` representa atencion confirmada asociada a paciente real.

La API publica futura debe operar sobre `solicitudes_agenda`, no sobre `consultas`.

Google Calendar solo debe sincronizar eventos confirmados o internamente aprobados, no solicitudes publicas crudas.

## Relacion con Calendar/Gmail

Calendar y Gmail deben integrarse desde backend seguro.

Reglas:

- no exponer tokens en frontend;
- no guardar credenciales en repositorio;
- no escribir detalles sensibles en Calendar;
- no enviar detalles clinicos sensibles por correo;
- usar titulos y plantillas neutras;
- registrar estado tecnico de sincronizacion;
- auditar errores sin filtrar datos sensibles.

## Ambientes requeridos

BE-030 debe respetar la separacion definida por DEC-030:

```text
LOCAL
DEMO
STAGING
PRODUCCION
```

Cada ambiente debe tener:

- URLs propias;
- callbacks OAuth propios;
- secretos propios;
- base/servicios definidos;
- politica de datos permitidos;
- restricciones visuales y operativas;
- checklist de validacion.

## Criterios para primer despliegue Google Cloud

No se debe desplegar backend/API real a Google Cloud hasta que exista al menos:

- contrato API BE-026;
- diseno integracion Google BE-027;
- seguridad API SEC-009;
- secretos/IAM/OAuth SEC-010;
- manual de ambientes DOC-001;
- estrategia migracion DOC-005;
- consentimiento BE-020;
- auditoria SEC-005;
- backup/restauracion BE-019;
- BE-029 integrado como antecedente de validacion runtime local de Agenda;
- checklist QA-007;
- aprobacion expresa de Javier.

## Criterios para NO migrar todavia

No migrar si:

- el MVP clinico aun cambia estructuralmente;
- Agenda no esta validada;
- no hay contrato API;
- no hay manejo de secretos definido;
- no hay ambientes separados;
- no hay auditoria sensible;
- no hay consentimiento informado;
- no hay backup/restauracion probado;
- no hay estimacion de costos;
- no hay rollback.

## Fases recomendadas

### Fase 1 - Preparacion documental

- DEC-035.
- BE-030.
- SEC-010.
- DOC-005.
- QA-007.

### Fase 2 - Contratos y seguridad

- BE-026.
- SEC-009.
- DOC-004.

### Fase 3 - Integracion Google Workspace

- BE-027.
- pruebas con entorno no productivo;
- correos neutros;
- Calendar neutro;
- auditoria de sync.

### Fase 4 - Deploy tecnico controlado

- Cloud Run/Firebase segun decision;
- sin datos reales si PROD-001 sigue abierto;
- secretos por ambiente;
- CI/CD controlado.

### Fase 5 - Produccion futura

Solo despues de cerrar PROD-001 y checklist preproduccion.

## Riesgos

- Migracion prematura.
- Exposicion de secretos.
- Mezcla de datos demo y reales.
- Costos cloud no controlados.
- Logs con informacion sensible.
- Eventos Calendar con informacion clinica.
- Correos con informacion sensible.
- CI/CD con permisos excesivos.
- Dependencia de infraestructura antes de estabilizar producto.

## Restricciones

BE-030 no implementa infraestructura, no crea archivos de configuracion cloud, no toca `.env`, no modifica codigo, no crea endpoints, no modifica migraciones, no toca Supabase remoto y no habilita produccion.

## Criterios de aceptacion

- Google Cloud queda definido como plataforma futura, no como migracion inmediata.
- Supabase/PostgreSQL queda confirmado como base actual.
- Cloud Run/Firebase quedan como opciones evaluables, no decisiones ejecutadas.
- Secret Manager, IAM, OAuth y CI/CD quedan derivados a SEC-010.
- PROD-001 sigue bloqueante.
- BE-026, BE-027, SEC-009 y DOC-004 quedan relacionados.
