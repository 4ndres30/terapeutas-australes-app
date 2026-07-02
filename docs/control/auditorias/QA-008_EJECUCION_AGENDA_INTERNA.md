# QA-008 - Ejecucion de validacion funcional de Agenda interna

## Estado

Ejecutado parcialmente / pendiente validacion visual autenticada.

## Fecha

2026-07-02

## Rama

`qa-008-validacion-funcional-agenda-interna`

## Base validada

- `main` actualizado.
- PR #45 integrado en `main`.
- PR #46 integrado en `main`.
- Commit base observado: `bc64b21 docs: actualiza pauta y prepara QA Agenda (#46)`.

## Entorno

- Repositorio local: `4ndres30/terapeutas-australes-app`.
- Supabase local activo.
- Vite local verificado.
- Navegador integrado no disponible en esta sesion.
- No se uso Supabase remoto.
- No se uso produccion.

## Datos demo utilizados

- Titulo inicial: `QA-008 Evento demo Agenda`
- Titulo editado: `QA-008 Evento demo Agenda editado`
- Tipo: `administrativo`
- Modalidad: `videollamada`
- Ubicacion inicial: `Sala demo QA`
- Ubicacion editada: `Sala demo QA editada`
- Notas internas: `Prueba QA-008 sin datos reales`
- Estado final del evento demo local: `cancelado`

No se usaron nombres reales, correos reales, telefonos reales ni datos clinicos reales.

## Resumen ejecutivo

Agenda interna funciona correctamente en la parte de modelo local, RLS y operaciones principales de `agenda_eventos`.

Se valido creacion, visualizacion desde `public.vista_agenda_operativa`, edicion, reagendamiento, cambio a completado, cancelacion sin delete fisico, persistencia y ausencia de efectos colaterales clinicos/financieros/Storage.

No se detectaron hallazgos bloqueantes, altos ni medios en la parte ejecutada.

La validacion no queda aprobada total porque no se pudo realizar revision visual autenticada de `/agenda` en navegador integrado ni login real por roles. Se recomienda completar esa revision antes de iniciar `BE-026`.

## Revision critica del prompt y estrategia aplicada

El objetivo de QA-008 estaba claro y no presentaba contradicciones graves.

Se agregaron validaciones tecnicas al checklist original:

- fecha fin anterior a inicio;
- evento cancelado reabierto por reagendamiento controlado;
- intento de delete fisico;
- acceso `finanzas`;
- acceso anonimo;
- comparacion de conteos antes/despues para confirmar no efectos colaterales;
- verificacion de modulo servido por Vite.

No se expandio el alcance hacia desarrollo. No se corrigieron bugs ni se modifico codigo.

## Pruebas ejecutadas

| Prueba | Resultado |
| --- | --- |
| Verificacion inicial de `main` | OK. PR #45 y PR #46 estan mergeados. |
| Lectura de pauta QA-008 | OK. Pauta usada como base. |
| Supabase local disponible | OK con `npx supabase status`. |
| Vite local forzado | OK en puerto alternativo 5174 por puerto 5173 ocupado. |
| `/agenda` servido por Vite | OK. Responde 200. |
| Modulo `AgendaPage.tsx` servido | OK. Contiene UI-025B, Nuevo evento interno y no contiene Eliminar. |
| Crear evento interno | OK por RLS local con rol `admin`. |
| Visualizar desde `vista_agenda_operativa` | OK. Evento aparece con `tipo_contexto = interno`. |
| Editar evento | OK. Titulo, ubicacion y notas cambian. |
| Reagendar evento | OK. Estado `reagendado`, rango valido. |
| Marcar completado | OK. Estado `completado`. |
| Cancelar sin delete | OK. Estado `cancelado`, fila persiste. |
| Persistencia | OK. Evento persiste tras commit y nueva consulta. |
| Fecha fin anterior a inicio | OK. Constraint rechaza el cambio. |
| Delete fisico | OK. Permiso denegado para `authenticated`. |
| Rol terapeuta | OK por SQL local: puede ver y actualizar. |
| Rol finanzas | OK por SQL local/ruta: no ve datos y no puede insertar. |
| Rol anonimo | OK por SQL local/ruta: sin permiso sobre vista. |
| No efectos colaterales | OK. Solo aumento `agenda_eventos`. |

## Resultado funcional

La parte funcional local valida que Agenda interna puede operar manualmente sobre `agenda_eventos` sin romper la separacion clinico-operativa.

Resultado de conteos:

- `agenda_eventos`: aumento esperado en 1 por evento demo QA.
- `solicitudes_agenda`: sin cambios.
- `pacientes`: sin cambios.
- `consultas`: sin cambios.
- `evaluaciones`: sin cambios.
- `casos`: sin cambios.
- `revisiones`: sin cambios.
- `trabajos`: sin cambios.
- `cobros`: sin cambios.
- `pagos`: sin cambios.
- `storage.objects`: sin cambios.

Google queda `no_sincronizado` y sin `google_calendar_event_id`.

## Resultado por rol

| Rol | Resultado |
| --- | --- |
| admin | OK por SQL local. Puede crear, editar, reagendar, completar y cancelar. |
| terapeuta | OK por SQL local. Puede leer vista y actualizar evento dentro del alcance. |
| finanzas | OK por SQL local y codigo de ruta. No tiene acceso funcional a Agenda. |
| anonimo | OK por SQL local y codigo de ruta. No tiene permiso sobre la vista ni acceso sin sesion. |

Validacion visual por login real: no ejecutada por falta de navegador integrado y credenciales demo documentadas.

## Validacion de base de datos local

Ejecutada contra PostgreSQL local `127.0.0.1:54322`.

Comandos/acciones:

- `npx supabase status`.
- Consultas SQL locales con JWT simulado para `admin`, `terapeuta`, `finanzas` y `anon`.
- Insert/update/select sobre `public.agenda_eventos`.
- Select sobre `public.vista_agenda_operativa`.
- Intentos esperados de error para delete fisico, fecha invalida, insert de finanzas y select anonimo.

No se ejecuto `supabase db push`.
No se ejecuto `supabase db reset`.
No se toco Supabase remoto.

## Validacion de no efectos colaterales

Confirmado:

- No se creo paciente.
- No se creo consulta.
- No se creo solicitud publica.
- No se creo evaluacion.
- No se creo caso.
- No se creo revision.
- No se creo trabajo.
- No se creo cobro.
- No se creo pago.
- No se subieron fotos.
- No se escribio en Storage.
- No se sincronizo Google Calendar.
- No se envio Gmail.
- No se llamo API publica.

## Hallazgos

### QA008-OBS-001 - Navegador integrado no disponible

**Severidad:** Observacion
**Descripcion:** No hubo navegador integrado disponible para ejecutar la revision visual autenticada de `/agenda`.
**Evidencia:** La lista de navegadores disponibles para la sesion retorno vacia.
**Impacto:** No se pudo aprobar visualmente el modal de alta/edicion/reagendamiento ni validar clicks reales sobre la UI autenticada.
**Recomendacion:** Ejecutar una validacion visual manual o automatizada con navegador disponible antes de iniciar `BE-026`.
**Tarea sugerida:** Completar revision visual autenticada de Agenda interna, sin cambiar alcance funcional.

### QA008-OBS-002 - Credenciales demo por rol no documentadas

**Severidad:** Observacion
**Descripcion:** Existen usuarios locales por rol en DB, pero el repositorio no documenta contrasenas demo para login visual.
**Evidencia:** Busqueda documental encontro usuarios demo, pero no contrasenas versionadas.
**Impacto:** QA visual por rol depende de conocimiento externo o intervencion manual.
**Recomendacion:** Definir procedimiento controlado de usuarios demo locales sin exponer secretos en Git.
**Tarea sugerida:** Documentar provisioning local/demo de usuarios internos en una tarea de seguridad/control, sin habilitar produccion.

## Riesgos

- Avanzar a `BE-026` sin cerrar revision visual autenticada puede arrastrar problemas de UX del modal a la API publica.
- La ausencia de historial detallado de cambios de Agenda sigue siendo riesgo antes de uso real.
- `PROD-001` sigue bloqueante para cualquier dato real.

## Limitaciones

- No se ejecuto navegador integrado.
- No se hizo login visual por rol.
- No se validaron clicks reales del modal en desktop/mobile.
- La validacion responsive fue estatica por CSS y modulo servido, no visual.
- Se creo un evento demo local persistente en `agenda_eventos`; no se borro para respetar la prueba de persistencia y no ejecutar delete fisico.

## Evidencia tecnica

- `git log --oneline -10` mostro PR #45 y PR #46 integrados.
- `gh pr view 45` mostro estado `MERGED`.
- `gh pr view 46` mostro estado `MERGED`.
- `npx supabase status` confirmo Supabase local activo.
- SQL local confirmo operaciones de crear, leer y actualizar; delete fisico fue denegado.
- SQL local confirmo rechazo de fecha fin anterior a inicio.
- SQL local confirmo rechazo de insert por `finanzas`.
- SQL local confirmo rechazo de acceso anonimo a la vista.
- Vite forzado sirvio `/agenda` con HTTP 200 en puerto 5174.
- Modulo servido contiene `Nuevo evento interno` y nota UI-025B, y no contiene `Eliminar`.
- CSS contiene `box-sizing`, `overflow-x: hidden`, `max-width` y media queries para modal/grilla.

## Validaciones ejecutadas

- `git status`
- `git checkout main`
- `git pull --ff-only origin main`
- `git log --oneline -10`
- `gh pr view 45`
- `gh pr view 46`
- `npx supabase status`
- SQL local contra Supabase local
- `npm run dev -- --force --host 127.0.0.1 --port 5174 --strictPort`
- Verificacion HTTP de `/agenda`
- Verificacion de modulo servido `AgendaPage.tsx`
- Verificacion estatica de rutas y CSS
- `git diff --check`
- `npm run lint`
- `npm run build`
- `git diff --cached --check`

## Veredicto

**QA-008 ejecutado parcialmente.**

No hay hallazgos bloqueantes, altos ni medios en las pruebas ejecutadas.

Agenda interna queda funcionalmente consistente a nivel local/DB/RLS, pero no suficientemente validada en UI visual autenticada para recomendar avanzar directamente a `BE-026`.

## Proximo paso recomendado

Completar revision visual autenticada de `/agenda` con navegador disponible y usuario demo por rol.

Si esa revision no detecta problemas, Control puede evaluar `BE-026`. `BE-027` Google Calendar/Gmail debe seguir en espera.
