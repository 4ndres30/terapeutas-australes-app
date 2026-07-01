# SEC-010 - Secretos, OAuth, IAM y cuentas de servicio para Google Cloud

## Estado

Diseno documental / pendiente implementacion futura.

## Fecha

2026-07-01

## Origen

DEC-035 / BE-030 / API-001 / BE-027 / SEC-009 / PROD-001.

## Objetivo

Definir criterios de seguridad para cualquier futura integracion entre Terapeutas Australes App, Google Cloud y Google Workspace, sin crear credenciales ni modificar configuracion real.

## Principio rector

Ningun secreto, token, clave de servicio, refresh token OAuth, client secret, service role key ni credencial productiva debe vivir en:

- frontend;
- repositorio GitHub;
- archivos versionados;
- capturas de pantalla;
- prompts de Codex/ChatGPT;
- `.env` compartidos;
- documentacion publica o semipublica.

## Alcance

SEC-010 cubre criterios para:

- Secret Manager;
- OAuth Calendar/Gmail;
- service accounts;
- IAM minimo privilegio;
- CI/CD desde GitHub;
- separacion de ambientes;
- rotacion y revocacion;
- auditoria de uso;
- manejo seguro con Codex/WebStorm.

## Fuera de alcance

SEC-010 no crea:

- proyecto Google Cloud;
- secretos;
- OAuth clients;
- service accounts;
- Workload Identity Federation;
- workflows CI/CD;
- infraestructura;
- endpoints;
- cambios en `.env`;
- cambios en Supabase.

## Ambientes

Cada ambiente debe tener credenciales separadas:

```text
LOCAL
DEMO
STAGING
PRODUCCION
```

No se deben reutilizar secretos de produccion en local/demo.

No se deben usar datos reales en LOCAL/DEMO.

STAGING solo podra usar datos reales anonimizados si DOC-003 lo permite expresamente.

## Secret Manager

Cuando exista backend en Google Cloud, Secret Manager debe almacenar secretos operativos por ambiente.

Ejemplos futuros posibles:

- `SUPABASE_SERVICE_ROLE_KEY_STAGING` si el backend realmente lo necesita;
- `GOOGLE_OAUTH_CLIENT_SECRET_STAGING`;
- `GOOGLE_WORKSPACE_REFRESH_TOKEN_STAGING` si aplica;
- `API_INTERNAL_SHARED_SECRET_STAGING` si se aprueba;
- claves anti-spam/CAPTCHA.

Reglas:

- nombres claros por ambiente;
- acceso minimo por service account;
- versionado y rotacion;
- no imprimir valores en logs;
- no documentar valores reales;
- no exponer desde frontend.

## OAuth Google Calendar/Gmail

La integracion con Calendar/Gmail debe definir previamente:

- tipo de cuenta usada;
- scopes minimos;
- flujo OAuth;
- callbacks por ambiente;
- almacenamiento seguro de refresh tokens;
- revocacion;
- responsable de la cuenta Workspace;
- limite de informacion enviada a Calendar/Gmail.

### Scopes

Usar el scope minimo que permita la operacion requerida.

No solicitar permisos amplios si solo se requiere crear o editar eventos operativos neutros.

Gmail debe limitarse a envio de correos neutros si esa es la necesidad.

## IAM

Reglas de IAM:

- minimo privilegio;
- separar identidad de deploy e identidad de runtime;
- no usar Owner para ejecucion normal;
- no usar credenciales personales como practica de produccion;
- revisar permisos antes de cada fase;
- registrar responsables.

## Service accounts

Se recomiendan identidades separadas para:

- despliegue CI/CD;
- ejecucion de API;
- acceso a Secret Manager;
- integracion Calendar/Gmail si aplica;
- tareas programadas futuras.

Cada cuenta debe tener permisos especificos y auditables.

## CI/CD GitHub -> Google Cloud

La estrategia preferida debe evitar claves largas guardadas como secretos permanentes cuando sea posible.

La autenticacion desde GitHub hacia Google Cloud debe documentarse antes de implementarse.

Reglas:

- despliegue solo desde ramas autorizadas;
- PR obligatorio antes de main;
- no desplegar automaticamente a produccion mientras PROD-001 siga abierto;
- logs sin secretos;
- permisos separados por ambiente;
- rollback documentado.

## Codex / WebStorm

Codex puede ayudar a generar codigo, scripts, documentacion y PRs.

Codex no debe recibir:

- secretos reales;
- claves productivas;
- service account JSON productivo;
- tokens OAuth reales;
- `.env` reales.

WebStorm puede usarse como IDE principal, pero las credenciales locales deben mantenerse fuera de Git y fuera de prompts.

## Logs y auditoria

Los logs tecnicos no deben incluir:

- motivos clinicos;
- relatos personales;
- informacion energetica sensible;
- fotos;
- rutas privadas de Storage cuando no sean necesarias;
- datos financieros sensibles;
- tokens;
- headers Authorization;
- payloads completos.

SEC-005 debe cubrir auditoria sensible de eventos internos y SEC-010 debe coordinar auditoria tecnica cloud.

## Checklist previo a credenciales reales

Antes de crear credenciales reales debe existir:

- DEC-035 aprobada;
- BE-030 aprobado;
- BE-026 definido;
- BE-027 definido;
- SEC-009 definido;
- DOC-001 definido;
- DOC-003 definido;
- DOC-005 definido;
- aprobacion expresa de Javier.

## Restricciones

SEC-010 no autoriza uso con datos reales, no habilita produccion, no crea secretos, no crea credenciales y no modifica configuracion tecnica.

## Criterios de aceptacion

- Queda prohibido exponer secretos en frontend o repositorio.
- Se define separacion de credenciales por ambiente.
- Se define minimo privilegio IAM.
- Se define que Calendar/Gmail requieren OAuth/scopes minimos y backend seguro.
- Se define que Codex/WebStorm no deben recibir credenciales reales.
- Se mantiene PROD-001 como bloqueante.
