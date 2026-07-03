# QA-006B - Validacion visual autenticada de navegacion por rol

## Estado

Ejecucion parcial local / bloqueada para roles autenticados por falta de credenciales demo documentadas.

## Fecha

2026-07-03

## Rama

`qa-006b-validacion-navegacion-roles`

## Origen

- QA-006.
- QA-006A.
- UI-023.
- SEC-001.
- SEC-003.
- SEC-007.
- SEC-008B.
- PROD-001.

## Objetivo

Validar visualmente la navegacion protegida por rol, partiendo desde la matriz QA-006A.

La ejecucion completa requiere usuarios demo/locales para `admin`, `terapeuta` y `finanzas`. En esta pasada no se crean ni modifican usuarios Auth, no se leen secretos y no se exponen credenciales.

## Estado inicial

- Rama base: `main`.
- Servidor local: activo en `http://127.0.0.1:5173`.
- Navegador integrado: disponible.
- Estado de sesion observado: `/login`, sin sesion activa.
- Credenciales demo versionadas: no disponibles.
- Produccion: no habilitada.

## Alcance ejecutado

Se valido navegacion sin sesion sobre rutas internas protegidas.

| Caso | Ruta solicitada | Resultado observado | Estado |
| --- | --- | --- | --- |
| QA006B-001A | `/pacientes` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001B | `/consultas` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001C | `/evaluaciones` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001D | `/casos` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001E | `/agenda` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001F | `/finanzas` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |
| QA006B-001G | `/reportes` | Redireccion a `/login`; pantalla `Acceso interno`. | OK |

Resultado: 7/7 rutas protegidas redirigen correctamente a `/login` cuando no existe sesion activa.

## Alcance no ejecutado

| Caso | Rol | Ruta / superficie | Motivo |
| --- | --- | --- | --- |
| QA006B-002 | Finanzas | `/pacientes` -> `/finanzas` | Sin credenciales demo documentadas. |
| QA006B-003 | Finanzas | `/casos/:id` -> `/finanzas` | Sin credenciales demo documentadas. |
| QA006B-004 | Terapeuta | `/finanzas` -> `/pacientes` | Sin credenciales demo documentadas. |
| QA006B-005 | Finanzas | `/reportes` financiero | Sin credenciales demo documentadas. |
| QA006B-006 | Terapeuta | `/reportes` clinico | Sin credenciales demo documentadas. |
| QA006B-007 | Admin | `/reportes` clinico + financiero | Sin sesion activa disponible en navegador. |
| QA006B-008 | Admin/Terapeuta | `/agenda` | Sin credenciales demo documentadas para cobertura completa. |
| QA006B-009 | Finanzas | Menu lateral | Sin credenciales demo documentadas. |
| QA006B-010 | Usuario inactivo/sin perfil | `/login` y rutas internas | Requiere usuarios Auth/`usuarios_internos` preparados. |

## Evidencia operacional

El navegador integrado observo la pantalla:

```text
TERAPEUTAS AUSTRALES
Acceso interno
Email
Contraseña
Iniciar sesión
```

Para cada ruta interna solicitada, `location.pathname` termino en:

```text
/login
```

## Hallazgos

| Codigo | Hallazgo | Severidad | Estado recomendado |
| --- | --- | --- | --- |
| QA006B-OBS-001 | La proteccion sin sesion funciona en las rutas internas revisadas. | Media | Mantener como cobertura OK para QA-006. |
| QA006B-OBS-002 | No existen credenciales demo versionadas para ejecutar cobertura visual por `admin`, `terapeuta` y `finanzas`. | Alta para QA | Activar `SEC-007` o procedimiento equivalente antes de exigir QA visual multirol. |
| QA006B-OBS-003 | Crear usuarios Auth o cambiar roles para completar QA-006B implicaria tocar Auth/provisioning, fuera de alcance de esta tarea. | Alta | Requiere aprobacion explicita y procedimiento local/demo. |
| QA006B-OBS-004 | La brecha UI-023 detectada en QA-006A no puede comprobarse visualmente para Finanzas sin login demo de ese rol. | Media-alta | Reintentar tras contar con usuario Finanzas demo. |

## Decision de Control

No se deben crear usuarios demo improvisados, modificar Auth, cambiar `usuarios_internos`, usar scripts manuales ni leer `.env` para completar esta fase sin aprobacion explicita.

La validacion visual multirol queda bloqueada de forma correcta por falta de credenciales/provisioning demo documentado.

## Siguiente tarea recomendada

Antes de reintentar la parte autenticada de QA-006B, ejecutar:

```text
SEC-007 - Procedimiento de scripts manuales locales/demo y prohibicion en produccion
```

Alcance recomendado para desbloquear QA:

- documentar procedimiento controlado para usuarios demo/locales;
- definir roles demo requeridos;
- prohibir credenciales versionadas;
- mantener cualquier accion Auth limitada a local/demo y con aprobacion explicita;
- no tocar produccion ni Supabase remoto.

## Restricciones respetadas

- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se modifico `.env`.
- No se leyeron ni expusieron credenciales.
- No se crearon ni modificaron usuarios Auth.
- No se modifico `usuarios_internos`.
- No se ejecuto SQL.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth/RLS.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Resultado

QA-006B queda iniciada con cobertura parcial OK para rutas internas sin sesion.

La cobertura autenticada por rol queda pendiente hasta contar con procedimiento demo/local aprobado.

PROD-001 sigue bloqueante.
