# QA-006B - Validacion visual autenticada de navegacion por rol

## Estado

Ejecucion autenticada local/demo con observaciones UI-023.

## Fecha

2026-07-03

## Rama

`qa-006b-validacion-autenticada-roles`

## Origen

- QA-006.
- QA-006A.
- UI-023.
- SEC-001.
- SEC-003.
- SEC-007.
- SEC-007B.
- SEC-008B.
- PROD-001.

## Objetivo

Validar visualmente la navegacion protegida por rol, partiendo desde la matriz QA-006A y usando las identidades ficticias preparadas por SEC-007B.

La validacion no registra credenciales, no modifica `.env`, no usa Supabase remoto y no toca produccion.

## Estado inicial

- Rama base: `main` actualizado con PR #71 integrado.
- Servidor local: activo en `http://127.0.0.1:5173`.
- Navegador integrado: disponible.
- Supabase local: activo.
- Usuarios demo/locales: preparados por SEC-007B.
- Credenciales: disponibles solo en archivo local ignorado por Git.
- Produccion: no habilitada.

## Alcance mantenido de la pasada sin sesion

La pasada anterior valido navegacion sin sesion sobre rutas internas protegidas.

| Caso | Ruta solicitada | Resultado observado | Estado |
| --- | --- | --- | --- |
| QA006B-001A | `/pacientes` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001B | `/consultas` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001C | `/evaluaciones` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001D | `/casos` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001E | `/agenda` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001F | `/finanzas` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001G | `/reportes` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |

Resultado mantenido: 7/7 rutas protegidas redirigen correctamente a `/login` cuando no existe sesion activa.

## Alcance autenticado ejecutado

| Caso | Rol / identidad | Ruta / superficie | Resultado observado | Estado |
| --- | --- | --- | --- | --- |
| QA006B-002 | Finanzas / `QA-DEMO-FINANZAS` | `/pacientes` -> `/finanzas` | Redirecciona a `/finanzas`; encabezado `Cobros y Pagos`. | OK |
| QA006B-003 | Finanzas / `QA-DEMO-FINANZAS` | `/casos/:id` -> `/finanzas` | Redirecciona a `/finanzas`; encabezado `Cobros y Pagos`. | OK |
| QA006B-004 | Terapeuta / `QA-DEMO-TERAPEUTA` | `/finanzas` -> `/pacientes` | Redirecciona a `/pacientes`; encabezado `Pacientes`. | OK |
| QA006B-005 | Finanzas / `QA-DEMO-FINANZAS` | `/reportes` financiero | Permanece en `/reportes`; encabezado `Reportes financieros`. | OK |
| QA006B-006 | Terapeuta / `QA-DEMO-TERAPEUTA` | `/reportes` clinico | Permanece en `/reportes`; encabezado `Reportes clinicos`. | OK |
| QA006B-007 | Admin / `QA-DEMO-ADMIN` | `/reportes` clinico + financiero | Permanece en `/reportes`; muestra secciones clinicas y financieras. | OK |
| QA006B-008 | Admin / `QA-DEMO-ADMIN` | `/agenda` | Permanece en `/agenda`; encabezado `Agenda`. | OK |
| QA006B-008B | Terapeuta / `QA-DEMO-TERAPEUTA` | `/agenda` | Permanece en `/agenda`; encabezado `Agenda`. | OK |
| QA006B-009 | Finanzas / `QA-DEMO-FINANZAS` | Menu lateral | El menu muestra enlaces clinicos y Agenda, aunque las rutas bloqueadas redirigen. | OBS |
| QA006B-010A | Usuario inactivo / `QA-DEMO-INACTIVO` | `/login` y `/pacientes` | Queda en `/login` con `Acceso interno no habilitado`. | OK |
| QA006B-010B | Usuario sin perfil / `QA-DEMO-SIN-PERFIL` | `/login` y `/pacientes` | Queda en `/login` con `Acceso interno no habilitado`. | OK |

## Evidencia operacional

Se usaron identidades logicas ficticias, no credenciales versionadas.

Rutas iniciales observadas tras login:

| Identidad | Ruta inicial |
| --- | --- |
| `QA-DEMO-ADMIN` | `/pacientes` |
| `QA-DEMO-TERAPEUTA` | `/pacientes` |
| `QA-DEMO-FINANZAS` | `/finanzas` |
| `QA-DEMO-INACTIVO` | `/login` |
| `QA-DEMO-SIN-PERFIL` | `/login` |

Entre identidades se limpio el almacenamiento local del navegador de pruebas para aislar sesiones. Esto no modifica base de datos, usuarios, `.env`, Supabase remoto ni archivos del proyecto.

## Hallazgos

| Codigo | Hallazgo | Severidad | Estado recomendado |
| --- | --- | --- | --- |
| QA006B-OBS-001 | La proteccion sin sesion funciona en las rutas internas revisadas. | Media | Mantener cobertura OK. |
| QA006B-OBS-002 | SEC-007B resolvio el bloqueo operativo de usuarios demo/locales para esta pasada. | Alta para QA | Cerrada para local/demo. |
| QA006B-OBS-003 | Crear usuarios Auth quedo controlado por SEC-007/SEC-007B, sin secretos versionados ni remoto. | Alta | Cerrada para local/demo. |
| QA006B-OBS-004 | Finanzas ve enlaces del menu a superficies clinicas y Agenda, aunque las rutas bloqueadas redirigen a `/finanzas`. | Media-alta | Ejecutar UI-023 para filtrar navegacion por rol. |
| QA006B-OBS-005 | Terapeuta ve enlace de Finanzas en menu, aunque la ruta bloqueada redirige a `/pacientes`. | Media | Ejecutar UI-023 para filtrar navegacion por rol. |

## Decision de Control

La proteccion por rutas y los reportes por rol quedan validados local/demo.

La navegacion visible sigue pendiente de pulido por UI-023: el menu debe ocultar o desactivar superficies no autorizadas por rol para no sugerir accesos que luego redirigen.

## Siguiente tarea recomendada

Ejecutar:

```text
UI-023 - Navegacion y superficies filtradas por rol
```

Objetivo recomendado:

- filtrar enlaces del menu lateral y drawer movil por rol;
- no mostrar Finanzas a Terapeuta;
- no mostrar superficies clinicas ni Agenda a Finanzas;
- mantener Admin con acceso amplio;
- revalidar desktop/mobile sin datos reales.

## Restricciones respetadas

- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se modifico `.env`.
- No se imprimieron ni documentaron credenciales.
- No se modificaron usuarios Auth.
- No se modifico `usuarios_internos`.
- No se ejecuto SQL manual.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth/RLS.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Resultado

QA-006B queda ejecutada con cobertura autenticada local/demo.

Queda observacion abierta para UI-023 por navegacion visible no filtrada por rol.

PROD-001 sigue bloqueante.
