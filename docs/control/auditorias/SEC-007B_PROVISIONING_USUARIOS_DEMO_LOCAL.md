# SEC-007B - Provisioning local/demo de usuarios de prueba

## Estado

Ejecutado local/demo / pendiente validacion visual QA-006B.

## Fecha

2026-07-03

## Rama

`sec-007b-provisioning-demo-local`

## Origen

- SEC-007.
- DEC-029.
- DEC-032.
- QA-006B.
- PROD-001.

## Objetivo

Preparar un procedimiento ejecutable, idempotente y local-only para crear o actualizar usuarios Auth ficticios que permitan continuar la validacion autenticada multirol de QA-006B.

La tarea no habilita produccion, no modifica `.env`, no usa Supabase remoto y no versiona passwords, tokens ni service role keys.

## Herramienta creada

Se agrega:

```text
scripts/provision-demo-users.mjs
```

El script:

- solo permite `http://127.0.0.1:54321`, `http://localhost:54321` o `http://[::1]:54321`;
- exige `SEC007B_ALLOW_PROVISIONING=LOCAL_DEMO_ONLY`;
- exige `SUPABASE_SERVICE_ROLE_KEY` como variable temporal;
- exige `QA_DEMO_PASSWORD` como variable temporal;
- valida largo minimo y complejidad basica de password;
- crea o actualiza usuarios Auth demo;
- sincroniza `public.usuarios_internos` para perfiles autorizados;
- elimina el perfil interno del caso `QA-DEMO-SIN-PERFIL`;
- no imprime passwords, tokens ni service role keys;
- no ejecuta `supabase db push`;
- no toca migraciones.

## Identidades preparadas

| Identidad logica | Email ficticio | Perfil interno | Estado esperado |
| --- | --- | --- | --- |
| `QA-DEMO-ADMIN` | `qa.demo.admin@example.test` | `admin` | Activo |
| `QA-DEMO-TERAPEUTA` | `qa.demo.terapeuta@example.test` | `terapeuta` | Activo |
| `QA-DEMO-FINANZAS` | `qa.demo.finanzas@example.test` | `finanzas` | Activo |
| `QA-DEMO-INACTIVO` | `qa.demo.inactivo@example.test` | `terapeuta` | Inactivo |
| `QA-DEMO-SIN-PERFIL` | `qa.demo.sin-perfil@example.test` | Sin registro en `usuarios_internos` | Sin autorizacion |

Los emails son ficticios y pertenecen al dominio reservado `example.test`.

## Ejecucion autorizada

Javier autorizo continuar el trabajo y usar o modificar lo requerido. Control limita esa autorizacion a ambiente local/demo y mantiene bloqueadas las restricciones permanentes del proyecto.

La ejecucion tecnica debe usar variables temporales o un archivo local ignorado por Git. No debe registrar credenciales en Git, PRs, bitacoras, capturas ni chats.

Ejecucion local realizada en la rama `sec-007b-provisioning-demo-local`:

| Identidad logica | Resultado Auth | Resultado perfil |
| --- | --- | --- |
| `QA-DEMO-ADMIN` | Creado | Activo |
| `QA-DEMO-TERAPEUTA` | Creado | Activo |
| `QA-DEMO-FINANZAS` | Creado | Activo |
| `QA-DEMO-INACTIVO` | Creado | Inactivo |
| `QA-DEMO-SIN-PERFIL` | Creado | Sin perfil interno |

Las credenciales quedaron fuera de Git en un archivo local ignorado por `.gitignore`. Su contenido no se imprime ni se documenta.

Se ejecuto una segunda pasada de verificacion de idempotencia. Resultado: las cinco identidades quedaron como `updated` y no se duplicaron registros.

Ejemplo de ejecucion segura:

```powershell
$env:SUPABASE_URL = "http://127.0.0.1:54321"
$env:SUPABASE_SERVICE_ROLE_KEY = "<local-service-role-key>"
$env:QA_DEMO_PASSWORD = "<password-local-no-versionado>"
$env:SEC007B_ALLOW_PROVISIONING = "LOCAL_DEMO_ONLY"
npm run sec007b:provision-demo-users
Remove-Item Env:\SUPABASE_SERVICE_ROLE_KEY
Remove-Item Env:\QA_DEMO_PASSWORD
Remove-Item Env:\SEC007B_ALLOW_PROVISIONING
```

## Validacion esperada

Despues del provisioning:

- `QA-DEMO-ADMIN` debe entrar a superficies de admin;
- `QA-DEMO-TERAPEUTA` debe entrar a superficies clinicas y quedar fuera de Finanzas;
- `QA-DEMO-FINANZAS` debe entrar a Finanzas/Reportes financieros y quedar fuera de superficies clinicas;
- `QA-DEMO-INACTIVO` debe quedar bloqueado por estado interno inactivo;
- `QA-DEMO-SIN-PERFIL` debe quedar bloqueado por falta de perfil interno.

## Restricciones respetadas

- No se modifica `.env`.
- No se versionan credenciales.
- No se imprimen passwords ni tokens.
- No se toca Supabase remoto.
- No se ejecuta `supabase db push`.
- No se modifica produccion.
- No se modifican migraciones.
- No se crea API publica.
- No se integra Google Calendar, Gmail ni Workspace.
- No se usan datos reales, fotos reales ni pagos reales.

## Resultado

SEC-007B deja disponible la herramienta controlada y ejecuta el provisioning local/demo de usuarios ficticios.

La siguiente tarea recomendada es completar `QA-006B - Validacion visual autenticada de navegacion por rol` usando estas identidades ficticias.

PROD-001 sigue bloqueante.
