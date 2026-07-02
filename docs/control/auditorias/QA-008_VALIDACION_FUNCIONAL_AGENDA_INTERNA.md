# QA-008 - Validacion funcional completa de Agenda interna

## Estado

Cerrada post-merge con validacion visual autenticada admin / responsive movil corregido por UI-027.

## Fecha

2026-07-02

## Origen

- PR #45 - UI-025B edicion controlada de Agenda operativa.
- PR #46 - pauta QA-008 y niveles de documentacion.
- PR #48 - UI-026 selector calendario/horario Agenda.
- UI-025A lectura de Agenda desde `public.vista_agenda_operativa`.
- BE-028 modelo DB Agenda operativa.
- BE-029 validacion runtime local Agenda operativa.
- DEC-034 separacion entre solicitud de agenda, evento operativo y consulta clinica.

## Objetivo

Validar funcionalmente Agenda interna posterior a la integracion de PR #45 y determinar si el proyecto puede avanzar hacia `BE-026`.

Resultado sintetico: las operaciones de datos y permisos locales pasaron en Supabase local. La revision visual autenticada con usuario `admin` paso en desktop, incluyendo alta, edicion, reagendamiento, completado, cancelacion y bloqueo de solapamiento desde UI. La observacion responsive movil por overflow horizontal del shell en viewport `390x844` queda corregida por UI-027 e integrada en `main` por PR #50.

## Nivel documental

Nivel 2 - Cambio funcional interno.

QA-008 valida una pantalla interna conectada a modelo DB existente y operaciones controladas de `agenda_eventos`. No modifica DB, RLS, Auth, API, Google ni produccion.

## Alcance

- Visualizacion de Agenda desde `public.vista_agenda_operativa`.
- Busqueda.
- Filtros.
- Creacion de evento interno.
- Edicion de evento interno.
- Cambio de estado.
- Cancelacion sin delete fisico.
- Reagendamiento.
- Marcado como completado.
- Persistencia despues de recargar.
- Errores controlados.
- Responsive del formulario/modal.
- Proteccion por rol.
- Ausencia de efectos colaterales clinicos.

## Fuera de alcance

- API publica.
- Endpoints.
- Google Calendar.
- Gmail.
- Workspace.
- Produccion.
- Datos reales.
- Migraciones SQL.
- Auth/RLS.
- Supabase remoto.
- Conversion automatica de solicitudes en pacientes o consultas.
- Creacion automatica de entidades clinicas, financieras o de Storage.

## Precondiciones

- `main` contiene PR #45 integrado: cumplido.
- `main` contiene PR #46 integrado: cumplido.
- `main` contiene PR #48 integrado: cumplido.
- `main` contiene PR #49 integrado: cumplido.
- `main` contiene PR #50 integrado: cumplido.
- Ambiente local/demo disponible: cumplido.
- Datos usados son ficticios o demo: cumplido.
- Usuario local con rol `admin`: disponible por SQL local.
- Usuario local con rol `terapeuta`: disponible por SQL local.
- Usuario local con rol `finanzas`: disponible por SQL local.
- Navegador integrado: disponible en `http://127.0.0.1:5173/agenda`.
- Sesion visual autenticada: disponible como `Administrador Local`.
- Credenciales demo para login visual separado por rol: no documentadas en repositorio.
- `PROD-001` sigue bloqueante: cumplido.

## Checklist funcional

- [x] `/agenda` responde desde Vite local.
- [x] La lista se construye desde `public.vista_agenda_operativa` segun codigo servido y prueba SQL local.
- [x] La pantalla distingue solicitudes, eventos internos y consultas clinicas segun logica de `AgendaPage`.
- [x] La busqueda esta implementada sobre titulo, paciente/contacto, tipo, modalidad, estado y origen.
- [x] Los filtros por contexto se muestran como opciones estaticas.
- [x] Los filtros por estado usan los estados reales del modelo.
- [x] Se pudo crear un evento interno demo en `agenda_eventos` con rol `admin` simulado.
- [x] El evento creado aparece en `public.vista_agenda_operativa`.
- [x] El evento persiste despues de commit y nueva consulta.
- [x] Se pudo editar titulo, ubicacion y notas internas.
- [x] Se pudo cambiar estado usando estados reales del modelo.
- [x] Cancelar cambio el estado a `cancelado` sin borrar fisicamente el evento.
- [x] Reagendar modifico fecha/hora y estado.
- [x] Marcar completado cambio el estado a `completado`.
- [x] El evento permanecio visible tras quedar `cancelado`.
- [x] Modal de alta sin desborde horizontal en desktop: validado visualmente con navegador integrado y sesion `admin`.
- [x] Modal de edicion sin desborde horizontal en desktop: validado visualmente con navegador integrado y sesion `admin`.
- [x] Campos Inicio y Fin sin superposicion visual en desktop: validado visualmente; fin calculado responde a hora/duracion.
- [x] Bloqueo visual de solapamiento: el segundo evento demo superpuesto fue rechazado y no se creo.
- [x] Responsive movil sin overflow horizontal: corregido por UI-027 y validado en `390x844` y `360x740`.
- [x] CSS conserva controles tecnicos para evitar desborde (`box-sizing`, `overflow-x: hidden`, `max-width` y media queries).
- [x] Fecha fin anterior a fecha inicio fue rechazada por constraint local.
- [x] No existe boton `Eliminar` en el modulo servido por Vite ni operacion delete autorizada por RLS/grants.
- [x] No se crearon pacientes automaticamente.
- [x] No se crearon consultas automaticamente.
- [x] No se crearon solicitudes publicas automaticamente.
- [x] No se escribio en Storage.
- [x] No se sincronizo Google Calendar.
- [x] No se envio Gmail.
- [x] No se llamo API publica.

## Validacion por rol

### admin

- [x] Puede operar `agenda_eventos` en Supabase local con JWT simulado.
- [x] Puede crear evento interno.
- [x] Puede editar evento interno.
- [x] Puede cancelar evento interno.
- [x] Puede reagendar evento interno.
- [x] Puede marcar evento interno como completado.
- [x] Puede operar visualmente `/agenda` con sesion `Administrador Local`.

Validacion visual por login real: ejecutada para rol `admin` en navegador integrado.

### terapeuta

- [x] Puede leer `public.vista_agenda_operativa` con JWT simulado.
- [x] Puede actualizar evento interno dentro del alcance permitido.
- [x] Puede reagendar un evento cancelado, lo que confirma que no hay bloqueo irreversible por estado.

Validacion visual por login real: no ejecutada para rol `terapeuta` por falta de credenciales demo documentadas; cobertura mantenida por SQL local y codigo de rutas.

### finanzas

- [x] La ruta `/agenda` esta protegida en codigo para `admin` y `terapeuta`.
- [x] Con JWT simulado de `finanzas`, `public.es_terapeuta_o_admin()` devuelve `false`.
- [x] `finanzas` no ve registros en `public.vista_agenda_operativa`.
- [x] `finanzas` no puede insertar eventos por RLS.

Validacion visual por login real: no ejecutada para rol `finanzas` por falta de credenciales demo documentadas; cobertura mantenida por SQL local, RLS y codigo de rutas.

### usuario no autorizado / anonimo

- [x] La ruta protegida redirige a login si no hay sesion autorizada segun `App.tsx`.
- [x] Rol `anon` no tiene permiso de lectura sobre `public.vista_agenda_operativa`.
- [x] Rol `anon` no puede crear ni editar eventos.

Validacion visual anonima en navegador: no ejecutada como login separado; cobertura mantenida por ruta protegida y permisos `anon`.

## Validacion de no efectos colaterales

Confirmado en Supabase local:

- [x] No se creo paciente.
- [x] No se creo consulta.
- [x] No se creo solicitud publica.
- [x] No se creo evaluacion.
- [x] No se creo caso.
- [x] No se creo revision.
- [x] No se creo trabajo.
- [x] No se creo cobro.
- [x] No se creo pago.
- [x] No se subieron fotos.
- [x] No se escribio en Storage.
- [x] No se sincronizo Google Calendar.
- [x] No se envio Gmail.
- [x] No se llamo API publica.

Cambios de datos locales esperados: se agregaron eventos demo ficticios en `public.agenda_eventos`, incluyendo `QA-008 Evento demo Agenda editado`, `QA-008 Visual Agenda Codex editado` y `QA-008 Visual Solape Base`, todos con estado final `cancelado`. El intento `QA-008 Visual Solape Bloqueado` fue rechazado por la UI y no se creo.

## Riesgos a observar

- Riesgo responsive movil `QA008-OBS-003` corregido por UI-027; desktop 1280x720 y mobile 390x844/360x740 quedaron sin overflow observado post-merge.
- El repositorio no documenta contrasenas demo para login por rol, lo que limita reproducibilidad de QA visual separada por `terapeuta` y `finanzas`.
- No hay historial detallado de cambios de agenda; solo `updated_at`/`updated_by`.
- `BE-026` puede evaluarse como siguiente tarea de diseno de contrato, manteniendo fuera API publica funcional, Google y produccion.

## Criterios de aprobacion

QA-008 alcanza aprobacion funcional local/demo y visual admin para Agenda interna.

La experiencia responsive movil queda corregida por UI-027 integrada en `main`.

## Criterios de rechazo

No se detectaron condiciones de rechazo en las pruebas ejecutadas:

- `/agenda` responde desde Vite.
- Crear, editar, reagendar, completar y cancelar funcionan a nivel DB/RLS local.
- Cancelar no borra fisicamente.
- No se crean pacientes, consultas ni solicitudes.
- No aparece delete fisico en codigo servido ni en permisos.
- No hay Google/Gmail/API publica.
- No se usaron datos reales.

## Resultado

QA-008 cerrada post-merge con validacion visual autenticada admin.

No hay hallazgos bloqueantes ni altos en la parte ejecutada. La observacion media responsive movil queda corregida por UI-027.

## Observaciones

`QA008-OBS-003` queda corregida por `UI-027 - Ajuste responsive de shell y Agenda interna`, dado que el flujo desktop/admin ya paso y mobile queda sin overflow horizontal.

`PROD-001` sigue bloqueante. QA-008 no habilita produccion, datos reales, Google Calendar, Gmail ni API publica.

Ver informe de ejecucion: `docs/control/auditorias/QA-008_EJECUCION_AGENDA_INTERNA.md`.
