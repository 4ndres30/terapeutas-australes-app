# UI-026 - Selector calendario/horario y duracion estandar de consulta

## Estado

Integrado por PR #48 / validado visualmente en desktop con observacion responsive movil.

## Fecha

2026-07-02

## Rama

`ui-026-selector-calendario-horario-agenda`

## Base integrada

- PR #48 integrado en `main`.
- Validacion visual autenticada ejecutada en `qa-008-validacion-visual-agenda-interna`.

## Objetivo

Mejorar el modal de Agenda interna para evitar ingreso manual complejo de fecha/hora y preparar una seleccion operativa mas segura.

## Alcance

- Separar fecha y hora de inicio en el formulario de Agenda.
- Usar selector calendario con `input type="date"`.
- Usar selector de hora en intervalos de 15 minutos.
- Calcular hora de fin desde duracion controlada.
- Mantener creacion, edicion, reagendamiento, cancelacion y completado.
- Validar solapamientos basicos contra eventos cargados desde Agenda.
- Mantener Agenda como UI interna sobre `agenda_eventos`.

## Fuera de alcance

- Migraciones SQL.
- Cambios en RLS/Auth.
- Supabase remoto.
- API publica.
- Google Calendar.
- Gmail.
- Workspace.
- Produccion.
- Datos reales.
- Creacion automatica de pacientes, consultas o solicitudes.

## Decision funcional

Se reemplaza el campo combinado de fecha/hora por:

- `Fecha`: selector calendario nativo.
- `Hora inicio`: selector de horarios cada 15 minutos.
- `Duracion`: opciones controladas, sin texto libre.
- `Fin calculado`: resumen solo lectura calculado desde inicio + duracion.

El formulario unico se mantiene para crear, editar y reagendar.

## Duracion estandar

La duracion por defecto queda en 60 minutos.

Cuando el usuario cambia el tipo de evento a `consulta`, el formulario fuerza la duracion estandar de consulta a 60 minutos.

Para eventos existentes se conserva la duracion derivada de `fecha_inicio` y `fecha_fin` cuando se abre el modal. Si esa duracion no pertenece a las opciones base, se incorpora como opcion controlada temporal para no destruir datos existentes.

## Buffer operativo

El buffer operativo queda definido en 15 minutos.

No se crea un evento separado para el buffer.

El buffer se usa solo para validar disponibilidad cuando el evento candidato o un evento existente es de tipo `consulta`.

## Validacion de solapamientos

La validacion se hace contra eventos cargados en memoria desde `public.vista_agenda_operativa`.

Estados considerados ocupantes:

- `programado`
- `confirmado`
- `reagendado`
- `completado`

Estados no bloqueantes:

- `cancelado`
- `no_asistio`

El evento actualmente editado se excluye de la comparacion.

Si hay cruce, el formulario muestra:

```text
El horario seleccionado se cruza con otro evento o con el espacio de 15 minutos entre consultas.
```

## Correccion post revision visual

Se agrega un disparador explicito `Elegir fecha` junto al campo Fecha para que el usuario entienda que debe abrir el calendario y no escribir la fecha completa manualmente.

Se mantiene `input type="date"` nativo, sin dependencia externa ni datepicker de terceros.

La accion usa `HTMLInputElement.showPicker()` cuando esta disponible. Si el navegador no lo expone, aplica fallback con `focus()` y `click()` sobre el input date.

Se muestra un resumen legible:

- `Fecha seleccionada: 20 jul 2026` cuando existe fecha.
- `Selecciona una fecha desde el calendario` cuando no existe fecha.

Se mantienen la duracion estandar de consulta de 60 minutos y el buffer operativo de 15 minutos.

## Archivos modificados

- `src/pages/AgendaPage.tsx`
- `src/pages/ClinicalModuleBase.css`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/auditorias/UI-026_SELECTOR_CALENDARIO_HORARIO_AGENDA.md`

## Pruebas realizadas

- `npm run build`
- `git diff --check`
- `npm run lint`
- `npm run build`
- `npm run dev -- --force` con verificacion tecnica de servidor local.
- Revision visual autenticada de `/agenda` con sesion `Administrador Local`.
- Validacion UI de alta, edicion, reagendamiento, completado, cancelacion y bloqueo de solapamiento.
- Revision responsive desktop 1280x720 y movil 390x844.

## Validacion visual autenticada QA-008

La revision visual admin confirmo que el modal de Agenda permite crear y editar eventos internos con fecha, hora, duracion y fin calculado sin desborde en desktop.

El reagendamiento conserva bloqueados los campos que no corresponden y permite ajustar estado, fecha y hora. El fin calculado se actualiza al cambiar hora/duracion.

La validacion de solapamiento mostro el mensaje esperado y no creo el evento superpuesto.

Desktop 1280x720 no mostro overflow horizontal. En movil 390x844 se observo overflow horizontal del shell por la navegacion lateral fija, con contenido principal parcialmente recortado.

## Limitaciones

La validacion visual autenticada fue ejecutada para `admin`. No se ejecuto login visual separado por `terapeuta` ni `finanzas` por falta de credenciales demo documentadas.

La experiencia movil no queda aprobada por overflow horizontal del shell en viewport `390x844`.

La validacion de solapamiento usa los eventos visibles/cargados en la Agenda. No reemplaza una validacion transaccional de backend, que corresponderia a una fase posterior si se expone API publica.

## Riesgos

- Dos usuarios simultaneos podrian intentar crear eventos en el mismo horario si no existe validacion backend transaccional.
- Eventos historicos con horarios no alineados a 15 minutos se conservan para evitar perdida de informacion, pero conviene normalizarlos si aparecen.
- La regla de buffer es funcional/UI; no modifica el modelo DB.

## Resultado

UI-026 deja el modal de Agenda con selector calendario, selector de hora, duracion controlada, fin calculado y validacion basica de solapamiento con buffer de consulta.

Post revision visual, el selector de fecha queda reforzado con boton visible `Elegir fecha` y apertura programatica del calendario nativo cuando el navegador lo permite.

La validacion visual autenticada en desktop/admin queda aprobada. Queda observacion responsive movil derivable a UI-027.

No se modifican migraciones, Auth/RLS, Supabase remoto, API publica, Google ni produccion.

## Proximo paso recomendado

Decidir si se corrige responsive movil antes de `BE-026` o si se registra como `UI-027 - Ajuste responsive de shell y Agenda interna`.
