# QA-009 - Validacion visual UI-020/UI-021 ambiente

## Estado

Validacion local autenticada UI-020 / pendiente bloqueo produccion UI-021.

## Fecha

2026-07-03

## Rama

`qa-009-cierre-visual-ui020-ui021`

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
- Revision especifica de `/agenda` en ancho mobile equivalente de 375 px.
- Revision especifica de `/agenda` en ancho desktop de 1265 px.
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
| Viewport activo navegador integrado inicial | 843 px de ancho |
| `/agenda` mobile equivalente | OK, 375 px, indicador visible y sin overflow |
| `/agenda` desktop | OK, 1265 px, indicador visible y sin overflow |
| Overflow horizontal en `/agenda` | No observado en 375 px ni 1265 px |

## Validaciones no cerradas

No se pudo cerrar la validacion completa por limitacion de herramienta del navegador integrado:

- la pasada mobile/desktop de `/agenda` se completo correctamente con 375 px y 1265 px;
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

UI-020 queda validada localmente en sesion autenticada para `/agenda`, tanto en ancho mobile equivalente como en desktop, sin overflow horizontal observado.

UI-021 sigue pendiente de validacion visual autenticada porque no se pudo confirmar el DOM de la pantalla de bloqueo tras simular produccion no habilitada.

## Riesgos pendientes

- Falta validar la pantalla de bloqueo `PRODUCCION NO HABILITADA`.
- Falta validar accion `Cerrar sesion` desde bloqueo.
- El bloqueo visual no reemplaza controles backend, Auth, RLS, Storage ni separacion real de ambientes.

## Recomendacion

Marcar UI-020 como validada local/demo en `/agenda` para desktop y mobile equivalente. Mantener UI-021 como implementada pero pendiente de validacion visual de bloqueo. La siguiente pasada debe validar:

1. bloqueo por produccion no habilitada.
2. cierre de sesion desde bloqueo.
