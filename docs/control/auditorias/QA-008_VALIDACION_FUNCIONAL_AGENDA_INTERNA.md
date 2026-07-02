# QA-008 - Validacion funcional completa de Agenda interna

## Estado

Pauta creada / pendiente ejecucion.

## Fecha

2026-07-02

## Origen

- PR #45 - UI-025B edicion controlada de Agenda operativa.
- UI-025A lectura de Agenda desde `public.vista_agenda_operativa`.
- BE-028 modelo DB Agenda operativa.
- BE-029 validacion runtime local Agenda operativa.
- DEC-034 separacion entre solicitud de agenda, evento operativo y consulta clinica.

## Objetivo

Definir la pauta de validacion funcional completa de Agenda interna posterior a la integracion de PR #45.

Esta pauta debe ejecutarse en una tarea posterior sobre `main` actualizado. No valida produccion, datos reales, Google Calendar, Gmail ni API publica.

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

- `main` contiene PR #45 integrado.
- Ambiente local/demo disponible.
- Datos usados son ficticios o demo.
- Usuario de prueba con rol `admin`.
- Usuario de prueba con rol `terapeuta`.
- Usuario de prueba con rol `finanzas` o equivalente no autorizado para Agenda.
- Sesion anonima o usuario no autorizado para probar bloqueo de acceso.
- `PROD-001` sigue bloqueante.

## Checklist funcional

- [ ] `/agenda` carga sin errores para rol autorizado.
- [ ] La lista se construye desde `public.vista_agenda_operativa`.
- [ ] La pantalla distingue solicitudes, eventos internos y consultas clinicas si la vista entrega esos contextos.
- [ ] La busqueda encuentra por titulo, paciente/contacto u otros campos operativos disponibles.
- [ ] Los filtros por contexto se muestran completos aunque no haya registros.
- [ ] Los filtros por estado usan estados reales del modelo.
- [ ] Se puede crear un evento interno demo.
- [ ] El evento creado aparece en el listado sin recargar manualmente.
- [ ] El evento persiste despues de recargar la pagina.
- [ ] Se puede editar titulo, modalidad, ubicacion/enlace o notas internas si el modelo lo permite.
- [ ] Se puede cambiar estado usando solo `programado`, `confirmado`, `reagendado`, `cancelado`, `completado` y `no_asistio`.
- [ ] Cancelar cambia el estado a `cancelado` sin borrar fisicamente el evento.
- [ ] Reagendar modifica fecha/hora y estado sin crear historial complejo no soportado por el modelo.
- [ ] Marcar completado cambia el estado a `completado`.
- [ ] El evento no desaparece por estar cancelado o completado.
- [ ] El modal de alta no tiene desborde horizontal.
- [ ] El modal de edicion no tiene desborde horizontal.
- [ ] Los campos Inicio y Fin no se superponen.
- [ ] El formulario responde correctamente en pantalla normal y angosta.
- [ ] Los errores de Supabase/RLS se muestran de forma controlada y no exponen detalles sensibles innecesarios.
- [ ] No existe boton de delete fisico.
- [ ] No existen acciones de crear paciente, crear consulta o convertir solicitud automaticamente.

## Validacion por rol

### admin

- [ ] Puede acceder a Agenda.
- [ ] Puede crear evento interno.
- [ ] Puede editar evento interno.
- [ ] Puede cancelar evento interno.
- [ ] Puede reagendar evento interno.
- [ ] Puede marcar evento interno como completado.

### terapeuta

- [ ] Puede acceder segun permisos vigentes.
- [ ] Puede operar dentro del alcance permitido por RLS y UI.
- [ ] No accede a funciones fuera de su rol.
- [ ] No ve datos financieros sensibles ni superficies no autorizadas.

### finanzas

- [ ] No accede a Agenda clinica/operativa si la politica vigente no lo permite.
- [ ] No ve datos clinicos sensibles.
- [ ] No puede crear ni editar eventos de agenda si no esta autorizado.

### usuario no autorizado / anonimo

- [ ] No accede a `/agenda`.
- [ ] No consulta `public.vista_agenda_operativa`.
- [ ] No crea eventos.
- [ ] No edita eventos.

## Validacion de no efectos colaterales

Confirmar que Agenda interna no hace automaticamente:

- [ ] Crear paciente.
- [ ] Crear consulta.
- [ ] Crear solicitud publica.
- [ ] Crear evaluacion.
- [ ] Crear caso.
- [ ] Crear revision.
- [ ] Crear trabajo.
- [ ] Crear cobro.
- [ ] Crear pago.
- [ ] Subir fotos.
- [ ] Escribir en Storage.
- [ ] Sincronizar Google Calendar.
- [ ] Enviar Gmail.
- [ ] Llamar API publica.

## Riesgos a observar

- Estados de Agenda que se muestren como acciones clinicas reales.
- Notas internas usadas para registrar informacion clinica sensible extensa.
- Errores RLS visibles con mensajes tecnicos innecesarios.
- Eventos cancelados o completados que pierdan acciones basicas de edicion/reagendamiento.
- Filtros incompletos cuando no hay registros.
- Desbordes responsive en modal o tarjetas.
- Confusion entre solicitud de agenda, evento interno y consulta confirmada.

## Criterios de aprobacion

- Todos los puntos criticos del checklist funcional pasan con datos demo.
- Roles autorizados pueden operar segun alcance vigente.
- Roles no autorizados no acceden ni operan Agenda.
- No se crean pacientes, consultas, solicitudes, entidades clinicas, pagos, fotos ni objetos Storage automaticamente.
- No se ejecuta integracion Google, Gmail, Workspace ni API publica.
- No hay delete fisico de eventos.
- No hay bloqueos visuales graves en desktop ni pantalla angosta.
- Los errores se muestran de forma controlada.

## Criterios de rechazo

- Agenda queda accesible para anonimos o roles no autorizados.
- Crear, editar, cancelar, reagendar o completar falla sin mensaje controlado.
- Cancelar borra fisicamente un evento.
- La UI crea pacientes, consultas o solicitudes automaticamente.
- La UI dispara API publica, Google Calendar, Gmail o Workspace.
- El modal presenta desborde horizontal o campos superpuestos.
- Se exponen datos clinicos, financieros o tecnicos fuera del rol autorizado.

## Resultado

Pendiente de ejecucion.

QA-008 queda creada como pauta documental. No fue ejecutada en esta tarea.

## Observaciones

La ejecucion de QA-008 debe realizarse en una tarea posterior, sobre `main` actualizado y usando solo datos demo.

El resultado de esa ejecucion debe registrarse en un informe separado, indicando hallazgos, correcciones requeridas y si Agenda interna queda lista para evaluar `BE-026`.
