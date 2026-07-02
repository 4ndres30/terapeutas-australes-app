# UI-027 - Ajuste responsive de shell y Agenda interna

## Estado

Implementado en rama / validado localmente.

## Fecha

2026-07-02

## Rama

`ui-027-ajuste-responsive-shell-agenda`

## Origen

- `QA008-OBS-003`.
- Validacion visual autenticada de Agenda interna.
- PR #49 draft como base documental de la observacion.

## Objetivo

Corregir el overflow horizontal observado en `/agenda` con viewport movil y mejorar la navegacion movil mediante un menu superior que despliega un drawer lateral desde la izquierda, sin modificar datos, backend, migraciones ni logica funcional de Agenda.

## Causa detectada

La capa final de estilos mantenia `.dashboard-shell` en dos columnas en viewport movil por cascada CSS.

En `390x844`, el shell quedaba como `240px 133px`, la sidebar ocupaba la primera columna y la superficie principal de Agenda quedaba comprimida y recortada.

## Cambio aplicado

Se agrega estado local en `DashboardShell` y reglas responsive en `src/ReferenceFinalPass.css`, que es la ultima capa importada por `App.tsx`.

El ajuste:

- agrega boton superior de navegacion movil con iconos `Menu`/`X`;
- despliega `.dashboard-sidebar` como drawer fijo desde el costado izquierdo bajo `1080px`;
- agrega overlay de cierre al tocar fuera del panel;
- permite cierre con boton interno y tecla `Escape`;
- cierra el menu al tocar un enlace de navegacion;
- asegura `min-width: 0` para sidebar y main;
- oculta quote/footer laterales en pantallas angostas;
- conserva el shell desktop con sidebar fija y dos columnas.

## Archivos modificados

- `src/App.tsx`
- `src/App.css`
- `src/ReferenceFinalPass.css`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/auditorias/QA-008_EJECUCION_AGENDA_INTERNA.md`
- `docs/control/auditorias/QA-008_VALIDACION_FUNCIONAL_AGENDA_INTERNA.md`
- `docs/control/auditorias/UI-026_SELECTOR_CALENDARIO_HORARIO_AGENDA.md`
- `docs/control/auditorias/UI-027_AJUSTE_RESPONSIVE_SHELL_AGENDA.md`

## Validacion visual

### Antes

- Viewport `390x844`.
- `documentElement.clientWidth`: `375`.
- `documentElement.scrollWidth`: `460`.
- `.dashboard-shell`: `240px 133px`.
- Resultado: overflow horizontal y Agenda recortada.

### Despues

- Viewport `390x844`.
- `documentElement.clientWidth`: `375`.
- `documentElement.scrollWidth`: `375`.
- Menu cerrado: `.dashboard-sidebar` queda fuera de pantalla y el boton superior `Abrir menu de navegacion` queda visible.
- Menu abierto: `.dashboard-sidebar` queda en `x=0`, overlay activo y sin overflow horizontal.
- Resultado: Agenda usa el ancho movil completo y la navegacion no recorta el contenido.

### Validacion adicional

- Viewport `360x740`: sin overflow horizontal.
- Viewport desktop `1280x720`: sin overflow horizontal y shell conserva dos columnas.
- Cierre por boton interno: OK.
- Cierre por tecla `Escape`: OK.
- Cierre por toque exterior en overlay: OK.
- Consola navegador: sin errores ni warnings capturados durante la revision posterior.

## Restricciones respetadas

- No se modificaron migraciones.
- No se toco `.env`.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth/RLS.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales.

## Resultado

`QA008-OBS-003` queda corregida en la rama `ui-027-ajuste-responsive-shell-agenda`.

Agenda interna queda validada visualmente en desktop y mobile desde el shell responsive, manteniendo pendiente `PROD-001` para cualquier uso real.
