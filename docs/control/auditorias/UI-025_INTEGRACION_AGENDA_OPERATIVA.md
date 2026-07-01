# UI-025 - Integracion Agenda Operativa

## Resumen

UI-025 reemplaza el placeholder de `AgendaPage` por una primera integracion interna de lectura con el modelo DB de Agenda Operativa.

La pantalla `/agenda` consulta `public.vista_agenda_operativa` y muestra eventos operativos con busqueda, filtros por contexto/estado, metricas y separacion visual entre solicitudes vinculadas, eventos internos y consultas confirmadas.

## Estado previo

Antes de UI-025:

- `src/pages/AgendaPage.tsx` indicaba que no existia tabla real de agenda.
- BE-028 ya habia implementado `solicitudes_agenda`, `agenda_eventos` y `vista_agenda_operativa`.
- BE-029 ya habia validado runtime local, RLS, grants y roles para Agenda.
- La ruta `/agenda` ya estaba protegida para `admin` y `terapeuta`.
- Finanzas y usuarios anonimos quedaban fuera por ruta y por RLS.

## Cambios aplicados

- `AgendaPage` ahora lee desde `public.vista_agenda_operativa`.
- Se agregan estados de carga, error y vacio.
- Se agregan filtros por contexto: todos, solicitudes, eventos internos y consultas clinicas.
- Se agrega filtro por estado operativo.
- Se agrega busqueda por titulo, paciente/contacto, tipo, modalidad, estado u origen.
- Se muestran fecha/hora, modalidad, contacto operativo, estado de solicitud, origen, confirmacion y estado tecnico Google.
- Se mantiene la pantalla como lectura/listado operativo, sin formularios de creacion o edicion.
- Se ajusta CSS para evitar desbordes de textos largos en detalles operativos.

## Archivos modificados

- `src/pages/AgendaPage.tsx`
- `src/pages/ClinicalModuleBase.css`
- `README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

## Datos leidos desde Supabase

La UI lee solo:

```text
public.vista_agenda_operativa
```

Columnas usadas:

- `id_agenda_evento`
- `solicitud_agenda_id`
- `paciente_id`
- `consulta_id`
- `evaluacion_id`
- `caso_id`
- `revision_id`
- `trabajo_id`
- `trabajo_sesion_id`
- `tipo_evento`
- `estado_evento`
- `origen_evento`
- `titulo_evento`
- `titulo_publico`
- `fecha_inicio`
- `fecha_fin`
- `modalidad`
- `requiere_confirmacion`
- `confirmado_por_paciente`
- `google_calendar_sync_estado`
- `estado_solicitud`
- `origen_solicitud`
- `fecha_solicitud`
- `nombre_contacto`
- `email_contacto`
- `telefono_contacto`
- `nombre_operativo`
- `tipo_contexto`
- `created_at`
- `updated_at`

No se leen `mensaje_contacto`, `notas_internas`, hallazgos, fotos, Storage, cobros, pagos ni montos.

## Restricciones respetadas

- No se creo API publica.
- No se crearon endpoints.
- No se integro Google Calendar.
- No se integro Gmail.
- No se toco Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modificaron migraciones SQL.
- No se modifico Auth/RLS.
- No se toco `.env`.
- No se habilito produccion.
- No se usaron datos reales.
- No se crearon pacientes automaticamente.
- No se crearon consultas automaticamente desde solicitudes.
- No se modificaron cobros/pagos.
- No se modifico Storage.
- No se tocaron fotos clinicas.

## Decisiones de seguridad

UI-025 queda como `UI-025A`: lectura/listado operativo.

No se implementa escritura porque crear o editar `agenda_eventos` requiere resolver antes:

- regla UI de alta/edicion;
- auditoria sensible de cambios de agenda;
- consentimiento aplicable;
- conversion controlada solicitud -> evento -> consulta;
- validacion de no duplicidad;
- flujo de autorizacion para cambios de estado.

La ruta `/agenda` sigue protegida para `admin` y `terapeuta` en `App.tsx`. Finanzas no accede al modulo.

## Validaciones ejecutadas

- `git diff --check`: OK.
- `npm run lint`: OK. NPM mostro warning no bloqueante `Unknown env config "min-release-age"`.
- `npm run build`: OK. Vite mostro warning no bloqueante por chunk mayor a 500 kB.

No se ejecutaron comandos contra Supabase remoto.

## Riesgos pendientes

- No hay creacion/edicion controlada desde UI.
- La vista usa `agenda_eventos` como fuente primaria; solicitudes sin evento vinculado no aparecen en esta primera pantalla.
- No hay auditoria sensible completa para cambios de agenda.
- No hay integracion con Google Calendar/Gmail.
- No hay API publica de agendamiento.
- PROD-001 sigue bloqueante para datos reales y produccion.

## Proxima fase recomendada

Control debe decidir entre:

```text
UI-025B - creacion/edicion controlada de agenda
BE-026 - contrato de API publica de agendamiento
```

La recomendacion tecnica es avanzar primero con UI-025B solo si se define una regla clara de creacion/edicion interna sin conversion automatica a pacientes o consultas.
