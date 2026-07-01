# DOC-005 - Estrategia de migracion progresiva a Google Cloud

## Estado

Documento estrategico / pendiente aprobacion de Javier.

## Fecha

2026-07-01

## Origen

DEC-035 / BE-030 / SEC-010 / API-001 / PROD-001.

## Objetivo

Documentar la ruta progresiva para incorporar Google Cloud al proyecto **Terapeutas Australes App** sin interrumpir el desarrollo actual ni habilitar prematuramente produccion o datos reales.

## Declaracion principal

La estrategia no es migrar todo ahora.

La estrategia es preparar Google Cloud como plataforma futura para:

- API segura;
- integracion Google Calendar/Gmail/Workspace;
- secretos;
- despliegue;
- CI/CD;
- observabilidad;
- automatizacion.

Supabase/PostgreSQL sigue siendo la base actual.

## Estado actual

El proyecto se encuentra en etapa local/demo.

Cuenta con:

- React + TypeScript + Vite;
- Supabase/PostgreSQL;
- Supabase Auth;
- RLS por roles;
- base clinica principal;
- vista financiera minima;
- Agenda operativa DB inicial;
- documentacion de API publica segura;
- PROD-001 bloqueante.

No cuenta todavia con:

- backend HTTP propio;
- endpoints API reales;
- integracion Google Calendar/Gmail;
- proyecto Google Cloud operativo documentado;
- secretos cloud;
- CI/CD cloud;
- produccion aprobada.

## Ruta de migracion progresiva

### Fase 0 - Control documental

Objetivo: dejar reglas claras antes de tocar infraestructura.

Tareas:

- DEC-035: migracion progresiva.
- BE-030: arquitectura Google Cloud.
- SEC-010: secretos/OAuth/IAM.
- DOC-005: estrategia migracion.
- QA-007: checklist pre-migracion.

Resultado esperado:

- Google Cloud queda incorporado al roadmap sin ejecutar cambios tecnicos.

### Fase 1 - Estabilizacion interna

Objetivo: terminar lo que ya esta en curso antes de sumar infraestructura.

Tareas relacionadas:

- BE-029: validar Agenda operativa runtime.
- UI-025: integrar AgendaPage con modelo DB.
- BE-020: consentimiento informado.
- SEC-005: auditoria sensible.
- BE-018: ambientes.
- BE-019: backup/restauracion.
- BE-021: anulacion logica.
- QA-006: pruebas por rol.

Resultado esperado:

- Sistema interno estable para demo/staging sin datos reales.

### Fase 2 - API publica segura

Objetivo: disenar contrato antes de implementar endpoints.

Tareas:

- BE-026: contrato API publica.
- SEC-009: seguridad API publica.
- DOC-004: flujo pagina publica -> API -> sistema interno -> Google.

Resultado esperado:

- API definida en payloads, validaciones, errores, CORS, rate limit, consentimiento e idempotencia.

### Fase 3 - Integracion Google Workspace

Objetivo: preparar Calendar/Gmail sin exponer datos sensibles.

Tareas:

- BE-027: integracion Calendar/Gmail/Workspace.
- SEC-010: secretos/OAuth/IAM aplicado.
- SEC-005: auditoria de sincronizacion.

Resultado esperado:

- Diseno de integracion con titulos/correos neutros.
- Sincronizacion solo despues de confirmacion interna.

### Fase 4 - Despliegue cloud controlado

Objetivo: desplegar API/backend en entorno no productivo.

Candidatos:

- Cloud Run para backend/API.
- Firebase App Hosting si la arquitectura frontend lo justifica.

Condiciones:

- secretos separados;
- dominios/callbacks por ambiente;
- CI/CD controlado;
- logs sin datos sensibles;
- QA-007 aprobado;
- sin datos reales si PROD-001 sigue abierto.

### Fase 5 - Produccion futura

Objetivo: habilitar uso real solo si PROD-001 se cierra.

Condiciones minimas:

- seguridad validada;
- RLS y roles validados;
- auditoria sensible;
- consentimiento;
- backup/restauracion probado;
- anulacion logica;
- politicas de datos reales;
- checklist preproduccion;
- aprobacion expresa de Javier.

## Criterios para decidir Cloud Run vs Firebase App Hosting

### Cloud Run recomendado si:

- se necesita backend/API flexible;
- se requiere control de endpoints;
- se requiere integracion Calendar/Gmail desde servidor;
- se necesita manejar secretos de runtime;
- se quiere escalar backend independiente del frontend.

### Firebase App Hosting evaluable si:

- el frontend evoluciona hacia framework soportado por ese flujo;
- se busca hosting integrado con GitHub;
- no reemplaza la necesidad de backend seguro para secretos.

## Criterios para NO migrar Supabase todavia

No migrar Supabase/PostgreSQL si:

- el modelo clinico aun cambia;
- los flujos clinicos no estan cerrados;
- no hay produccion aprobada;
- no hay presupuesto cloud definido;
- no hay rollback;
- no hay comparativa de Cloud SQL vs Supabase;
- no hay plan de migracion de Auth/RLS/Storage;
- no hay responsable tecnico permanente.

## Criterios para evaluar migracion de base futura

Solo considerar migrar base cuando:

- el MVP este estable;
- existan datos reales y necesidad operacional real;
- Supabase limite el crecimiento;
- se requiera integracion profunda con Google Cloud;
- existan costos claros;
- exista plan de exportacion/importacion;
- exista validacion de RLS/permisos equivalente;
- exista rollback probado.

## Relacion con Codex y WebStorm

WebStorm sigue como IDE principal.

Codex puede apoyar:

- crear codigo;
- revisar PRs;
- generar scripts no sensibles;
- documentar arquitectura;
- preparar tareas;
- detectar errores.

Codex no debe recibir secretos reales ni credenciales productivas.

## Reglas de seguridad documental

Ningun documento debe contener:

- claves reales;
- tokens OAuth;
- service account JSON;
- secrets de Supabase;
- URLs privadas sensibles si no son necesarias;
- datos reales de pacientes;
- fotos reales;
- informacion financiera real.

## Resultado esperado

Una migracion progresiva, segura, auditable y reversible.

## Restricciones

DOC-005 no implementa infraestructura, no modifica codigo, no modifica `.env`, no crea credenciales, no toca Supabase remoto y no habilita produccion.
