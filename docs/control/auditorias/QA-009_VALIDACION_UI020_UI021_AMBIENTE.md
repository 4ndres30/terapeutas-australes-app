# QA-009 - Validacion visual UI-020/UI-021 ambiente

## Estado

Validacion parcial autenticada / pendiente mobile y bloqueo produccion.

## Fecha

2026-07-03

## Rama

`qa-009-validacion-ui020-ui021-ambiente`

## Origen

- PR #62 integrado en `main`.
- UI-020.
- UI-021.
- PROD-001.

## Objetivo

Validar post-merge que el indicador de ambiente activo y el bloqueo visual de produccion no habilitada funcionan en la aplicacion local sin tocar configuracion sensible ni ambientes reales.

## Alcance ejecutado

- Validacion local post-merge sobre `main` actualizado.
- Verificacion autenticada del shell interno con sesion `Administrador Local`.
- Revision de presencia del indicador `LOCAL - datos ficticios`.
- Revision de overflow horizontal en el viewport activo del navegador integrado.
- Intento de validacion de bloqueo con variables temporales de proceso, sin modificar `.env`.

## Evidencia obtenida

| Punto | Resultado |
| --- | --- |
| `main` post PR #62 | Actualizado en commit `4dca739` |
| PRs abiertos | Ninguno al iniciar QA |
| `npm run lint` | OK |
| `npm run build` | OK, con aviso Vite de chunk mayor a 500 kB |
| Sesion autenticada local | OK, usuario visible `Administrador Local` |
| Indicador ambiente LOCAL | OK, texto visible `LOCAL - datos ficticios` |
| Viewport activo navegador integrado | 843 px de ancho |
| Overflow horizontal viewport activo | No observado, `scrollWidth` igual a `clientWidth` |

## Validaciones no cerradas

No se pudo cerrar la validacion completa por limitacion de herramienta del navegador integrado:

- la pasada multi-viewport `1280x720`, `390x844` y `360x740` quedo bloqueada por timeout al cambiar viewport;
- la navegacion posterior a `/agenda` quedo bloqueada por timeout;
- la simulacion de `VITE_APP_AMBIENTE=PRODUCCION` con `VITE_PRODUCCION_HABILITADA=false` levanto Vite localmente, pero la lectura DOM del bloqueo quedo bloqueada por timeout;
- no se valido el boton `Cerrar sesion` desde la pantalla de bloqueo.

## Restricciones respetadas

- No se modifico `.env`.
- No se crearon variables reales de ambiente.
- No se tocaron credenciales.
- No se modificaron migraciones.
- No se ejecuto SQL.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth/RLS.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Resultado

UI-020 queda parcialmente validada en sesion autenticada local para el viewport activo del navegador integrado.

UI-021 sigue pendiente de validacion visual autenticada porque no se pudo confirmar el DOM de la pantalla de bloqueo tras simular produccion no habilitada.

## Riesgos pendientes

- Falta validar mobile real o equivalente.
- Falta validar `/agenda` especificamente post-merge con indicador visible.
- Falta validar la pantalla de bloqueo `PRODUCCION NO HABILITADA`.
- Falta validar accion `Cerrar sesion` desde bloqueo.
- El bloqueo visual no reemplaza controles backend, Auth, RLS, Storage ni separacion real de ambientes.

## Recomendacion

Mantener UI-020/UI-021 como implementadas pero no cerradas. La siguiente pasada debe usar una sesion autenticada estable y validar:

1. `/agenda` desktop.
2. `/agenda` mobile.
3. bloqueo por produccion no habilitada.
4. cierre de sesion desde bloqueo.
