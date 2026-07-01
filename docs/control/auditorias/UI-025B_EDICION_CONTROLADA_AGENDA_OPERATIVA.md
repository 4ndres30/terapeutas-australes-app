# UI-025B - Edicion controlada Agenda Operativa

## Resumen

UI-025B extiende `/agenda` desde la lectura integrada en UI-025A hacia una gestion manual minima de `public.agenda_eventos`.

La implementacion queda limitada al sistema interno y a usuarios autorizados por la ruta protegida y por RLS (`admin` y `terapeuta`). No habilita pagina publica, API publica, Google Calendar, Gmail, Workspace, produccion ni datos reales.

## Estado previo

Antes de UI-025B:

- UI-025A mostraba `public.vista_agenda_operativa` en modo lectura.
- BE-028 habia implementado `solicitudes_agenda`, `agenda_eventos` y `vista_agenda_operativa`.
- BE-029 habia validado en local/demo que `admin` y `terapeuta` pueden seleccionar, insertar y actualizar `agenda_eventos`.
- No existia policy de `delete`.
- `/agenda` ya estaba protegida para `admin` y `terapeuta`.

## Cambios aplicados

- Se agrega accion `Nuevo evento interno`.
- Se agrega formulario modal para crear eventos internos usando columnas existentes de `agenda_eventos`.
- Se permite editar eventos existentes de `agenda_eventos`.
- Se permite reagendar con edicion limitada a fecha/hora y estado.
- Se agregan acciones rapidas para marcar `completado` y `cancelado`.
- Se mantiene la lectura principal desde `public.vista_agenda_operativa`.
- Se agrega lectura puntual de `agenda_eventos` para cargar datos editables (`ubicacion`, `enlace_online`, `notas_internas`) antes de abrir el formulario.
- Se ajustan estilos reutilizados para botones con iconos, acciones por tarjeta y notas de formulario.

## Operaciones habilitadas

- `select` sobre `public.vista_agenda_operativa`.
- `select` puntual sobre `public.agenda_eventos`.
- `insert` sobre `public.agenda_eventos`.
- `update` sobre `public.agenda_eventos`.
- Cambio de estado solo con valores reales del modelo:
  - `programado`
  - `confirmado`
  - `reagendado`
  - `cancelado`
  - `completado`
  - `no_asistio`

## Operaciones prohibidas

No se habilita:

- borrado fisico de eventos;
- creacion o edicion directa de `solicitudes_agenda`;
- creacion automatica de pacientes;
- creacion automatica de consultas;
- conversion automatica de solicitudes en consultas;
- modificacion de evaluaciones, casos, revisiones, trabajos, pagos, cobros, Storage o fotos;
- API publica o endpoints;
- Google Calendar, Gmail o Workspace;
- Supabase remoto, migraciones SQL, Auth/RLS, `.env`, credenciales, produccion o datos reales.

## Archivos modificados

- `src/pages/AgendaPage.tsx`
- `src/pages/ClinicalModuleBase.css`
- `README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/auditorias/UI-025B_EDICION_CONTROLADA_AGENDA_OPERATIVA.md`

## Validaciones ejecutadas

- `git checkout main`
- `git pull origin main`
- `git log --oneline -10`
- `git status`
- `npm run lint`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`

No se ejecutaron comandos contra Supabase remoto. No se ejecutaron comandos cloud.

## Riesgos pendientes

- No existe auditoria sensible completa para cambios de agenda.
- No existe historial de cambios por evento mas alla de `updated_at`/`updated_by`.
- No existe flujo de conversion controlada solicitud -> evento -> consulta.
- No existe API publica segura de agendamiento.
- No existe integracion Google Calendar/Gmail.
- PROD-001 sigue bloqueante para datos reales y produccion.

## Relacion con BE-026 y BE-027

UI-025B no reemplaza BE-026.

La futura pagina publica debe seguir usando una API segura como frontera y `solicitudes_agenda` como destino conceptual, no escritura directa desde frontend publico.

UI-025B no reemplaza BE-027.

La integracion Google Calendar/Gmail debe implementarse posteriormente desde backend seguro, con secretos fuera del frontend y eventos/correos neutros.

## Veredicto

UI-025B queda lista para revision como gestion interna controlada de Agenda Operativa.

No queda lista para produccion.
