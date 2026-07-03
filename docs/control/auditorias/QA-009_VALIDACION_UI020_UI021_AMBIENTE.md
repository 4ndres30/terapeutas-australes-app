# QA-009 - Validacion visual UI-020/UI-021 ambiente

## Estado

Validacion local/demo cerrada para UI-020 y UI-021.

## Fecha

2026-07-03

## Rama

`qa-009-validacion-bloqueo-ui021`

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
- Validacion de bloqueo con variables temporales de proceso, sin modificar `.env`.
- Validacion de accion `Cerrar sesion` desde la pantalla de bloqueo.
- Restauracion del servidor local a modo LOCAL despues de la prueba.

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
| Simulacion `PRODUCCION` no habilitada | OK, servidor local en `5173` con variables temporales de proceso |
| Pantalla de bloqueo | OK, `PRODUCCION NO HABILITADA` visible |
| Mensaje PROD-001 | OK, indica que PROD-001 sigue abierto y no permite operar datos reales |
| Boton `Cerrar sesion` | OK, redirige a `/login` tras la salida |
| Restauracion LOCAL | OK, `5173` vuelve a `/login` sin bloqueo de produccion |

## Validacion UI-021 cerrada

La validacion pendiente se cerro usando el mismo puerto local `5173` para conservar la sesion autenticada del navegador.

La simulacion se ejecuto con variables temporales de proceso:

```text
VITE_APP_AMBIENTE=PRODUCCION
VITE_PRODUCCION_HABILITADA=false
```

No se modifico `.env` ni configuracion privada. La pantalla interna fue bloqueada y mostro:

```text
PRODUCCION NO HABILITADA
PROD-001 sigue abierto. Este ambiente no puede operar con datos reales.
```

El boton `Cerrar sesion` desde el bloqueo redirigio correctamente a `/login`. Luego se reinicio el servidor local normal en `5173` sin variables de produccion y se confirmo que ya no aparecia el bloqueo.

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

UI-021 queda validada localmente: la pantalla `PRODUCCION NO HABILITADA` bloquea la superficie interna cuando el ambiente se simula como produccion sin habilitacion explicita, y la accion `Cerrar sesion` funciona desde la pantalla de bloqueo.

## Riesgos pendientes

- El bloqueo visual no reemplaza controles backend, Auth, RLS, Storage ni separacion real de ambientes.
- PROD-001 sigue bloqueante para cualquier uso real con datos sensibles.
- La sesion local del navegador quedo cerrada como parte de la validacion de `Cerrar sesion`.

## Recomendacion

Marcar QA-009 como cerrada en local/demo para UI-020 y UI-021. Mantener PROD-001 como bloqueo para produccion real, datos reales, fotos reales y pagos reales.
