# UI-020/UI-021 - Implementacion indicador ambiente y bloqueo produccion

## Estado

UI-020/UI-021 validadas local/demo por QA-009.

## Fecha

2026-07-02

## Rama

`ui-020-ui021-implementacion-ambiente-produccion`

## Origen

- UI-020.
- UI-021.
- PROD-001.
- DEC-030.
- DEC-031.
- PR #61.

## Objetivo

Implementar en el shell interno el indicador visual de ambiente activo y el bloqueo visual de produccion no habilitada, sin habilitar produccion ni modificar configuracion sensible.

## Cambio aplicado

Se agrega una lectura conservadora de ambiente desde variables Vite opcionales y no secretas:

```text
VITE_APP_AMBIENTE
VITE_PRODUCCION_HABILITADA
```

No se crean ni modifican archivos `.env`.

### Reglas implementadas

- Si `VITE_APP_AMBIENTE` no existe en dev local, la UI muestra `LOCAL - datos ficticios`.
- Si `VITE_APP_AMBIENTE` no existe en build no-dev, la UI trata el ambiente como `DESCONOCIDO`.
- `LOCAL` y `DEMO` permiten uso solo local/demo con indicador visible.
- `STAGING` muestra advertencia visual, sin habilitar datos reales.
- `PRODUCCION` solo deja operar si `VITE_PRODUCCION_HABILITADA` tiene valor verdadero controlado.
- `PRODUCCION` sin habilitacion explicita bloquea la superficie interna.
- Un valor desconocido bloquea la superficie interna.

### Valores reconocidos

- `LOCAL`.
- `DEMO`.
- `STAGING`.
- `PRODUCCION`, `PRODUCTION` o `PROD`.

### Valores verdaderos para habilitacion futura

- `1`.
- `true`.
- `yes`.
- `habilitada`.

## Superficie implementada

El indicador se renderiza en `DashboardShell`, dentro de la barra superior autenticada.

El bloqueo se renderiza en el mismo shell y reemplaza el contenido interno cuando el ambiente queda bloqueado. Mantiene disponible la accion `Cerrar sesion`.

El login queda fuera del bloqueo para permitir salida o correccion de acceso sin exponer rutas internas.

## Archivos modificados

- `src/App.tsx`.
- `src/ReferenceFinalPass.css`.
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`.
- `docs/control/01_PENDIENTES_PROYECTO.md`.
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`.
- `docs/control/06_BITACORA_CAMBIOS.md`.
- `docs/control/auditorias/UI-020_INDICADOR_AMBIENTE_ACTIVO.md`.
- `docs/control/auditorias/UI-021_BLOQUEO_PRODUCCION_NO_HABILITADA.md`.
- `docs/control/auditorias/UI-020_UI-021_IMPLEMENTACION_AMBIENTE_PRODUCCION.md`.

## Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK, con aviso Vite de chunk mayor a 500 kB |
| Navegador integrado login local | OK, `/login` carga sin overflow observado |

## Validacion QA-009

QA-009 ejecuto revision post-merge. La sesion autenticada local disponible permitio validar que el indicador `LOCAL - datos ficticios` aparece en `/agenda` con usuario `Administrador Local`, sin overflow horizontal en ancho mobile equivalente de 375 px ni en desktop de 1265 px.

La validacion pendiente de UI-021 se cerro con el mismo puerto local `5173`, usando variables temporales de proceso y sin modificar `.env`:

```text
VITE_APP_AMBIENTE=PRODUCCION
VITE_PRODUCCION_HABILITADA=false
```

Resultado:

- bloqueo visible `PRODUCCION NO HABILITADA`;
- mensaje PROD-001 visible;
- superficie interna reemplazada por la barrera de ambiente;
- accion `Cerrar sesion` validada y redirigida a `/login`;
- servidor local restaurado a modo LOCAL normal despues de la prueba.

Informe QA: `docs/control/auditorias/QA-009_VALIDACION_UI020_UI021_AMBIENTE.md`.

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

## Riesgos pendientes

- El bloqueo visual no reemplaza controles backend, RLS, Auth, Storage ni separacion real de ambientes.
- La habilitacion productiva por variable futura debe depender de procedimiento aprobado y cierre de PROD-001.
- La validacion local/demo no habilita produccion real.

## Recomendacion

Mantener UI-020/UI-021 como validadas local/demo y conservar PROD-001 como bloqueo antes de cualquier produccion real, datos reales, fotos reales o pagos reales.
