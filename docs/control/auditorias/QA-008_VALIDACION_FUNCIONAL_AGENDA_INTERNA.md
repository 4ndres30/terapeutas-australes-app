# QA-008 - Validacion funcional completa de Agenda interna

## Estado

Ejecutado parcialmente / pendiente validaciones no disponibles.

## Fecha

2026-07-02

## Origen

- PR #45 - UI-025B edicion controlada de Agenda operativa.
- PR #46 - pauta QA-008 y niveles de documentacion.
- UI-025A lectura de Agenda desde `public.vista_agenda_operativa`.
- BE-028 modelo DB Agenda operativa.
- BE-029 validacion runtime local Agenda operativa.
- DEC-034 separacion entre solicitud de agenda, evento operativo y consulta clinica.

## Objetivo

Validar funcionalmente Agenda interna posterior a la integracion de PR #45 y determinar si el proyecto puede avanzar hacia `BE-026`.

Resultado sintetico: las operaciones de datos y permisos locales pasaron en Supabase local, pero no se pudo ejecutar revision visual autenticada en navegador integrado. Por eso QA-008 no se declara aprobado total.

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
- Ambiente local/demo disponible: cumplido.
- Datos usados son ficticios o demo: cumplido.
- Usuario local con rol `admin`: disponible por SQL local.
- Usuario local con rol `terapeuta`: disponible por SQL local.
- Usuario local con rol `finanzas`: disponible por SQL local.
- Navegador integrado: no disponible en esta sesion.
- Credenciales demo para login visual por rol: no documentadas en repositorio.
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
- [ ] Modal de alta sin desborde horizontal: no validado visualmente por falta de navegador integrado.
- [ ] Modal de edicion sin desborde horizontal: no validado visualmente por falta de navegador integrado.
- [ ] Campos Inicio y Fin sin superposicion visual: no validado visualmente por falta de navegador integrado.
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

Validacion visual por login real: no ejecutada por falta de navegador integrado y credenciales demo documentadas.

### terapeuta

- [x] Puede leer `public.vista_agenda_operativa` con JWT simulado.
- [x] Puede actualizar evento interno dentro del alcance permitido.
- [x] Puede reagendar un evento cancelado, lo que confirma que no hay bloqueo irreversible por estado.

Validacion visual por login real: no ejecutada por falta de navegador integrado y credenciales demo documentadas.

### finanzas

- [x] La ruta `/agenda` esta protegida en codigo para `admin` y `terapeuta`.
- [x] Con JWT simulado de `finanzas`, `public.es_terapeuta_o_admin()` devuelve `false`.
- [x] `finanzas` no ve registros en `public.vista_agenda_operativa`.
- [x] `finanzas` no puede insertar eventos por RLS.

Validacion visual por login real: no ejecutada por falta de navegador integrado y credenciales demo documentadas.

### usuario no autorizado / anonimo

- [x] La ruta protegida redirige a login si no hay sesion autorizada segun `App.tsx`.
- [x] Rol `anon` no tiene permiso de lectura sobre `public.vista_agenda_operativa`.
- [x] Rol `anon` no puede crear ni editar eventos.

Validacion visual anonima en navegador: no ejecutada por falta de navegador integrado.

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

Unico cambio de datos local esperado: se agrego un evento demo en `public.agenda_eventos` con titulo `QA-008 Evento demo Agenda editado` y estado final `cancelado`.

## Riesgos a observar

- La validacion visual autenticada sigue pendiente.
- El repositorio no documenta contrasenas demo para login por rol, lo que limita reproducibilidad de QA visual.
- No hay historial detallado de cambios de agenda; solo `updated_at`/`updated_by`.
- Antes de `BE-026`, conviene cerrar una revision visual manual o automatizada de `/agenda` con sesion real.

## Criterios de aprobacion

QA-008 no alcanza aprobacion total porque no se ejecuto revision visual autenticada de modal/formulario.

Los criterios de datos, permisos y ausencia de efectos colaterales si pasan en entorno local/demo.

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

QA-008 ejecutado parcialmente.

No hay hallazgos bloqueantes, altos ni medios en la parte ejecutada. La limitacion principal es de cobertura visual/autenticada, no un bug funcional comprobado.

## Observaciones

No se recomienda avanzar todavia a `BE-026` como siguiente PR funcional hasta completar revision visual autenticada de `/agenda` o aceptar formalmente esta limitacion.

`PROD-001` sigue bloqueante. QA-008 no habilita produccion, datos reales, Google Calendar, Gmail ni API publica.

Ver informe de ejecucion: `docs/control/auditorias/QA-008_EJECUCION_AGENDA_INTERNA.md`.
