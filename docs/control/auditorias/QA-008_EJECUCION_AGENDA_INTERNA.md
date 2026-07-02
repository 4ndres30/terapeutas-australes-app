# QA-008 - Ejecucion de validacion funcional de Agenda interna

## Estado

Ejecutado con validacion visual autenticada / responsive movil corregido por UI-027.

## Fecha

2026-07-02

## Rama

`qa-008-validacion-funcional-agenda-interna`

Actualizacion visual autenticada:

`qa-008-validacion-visual-agenda-interna`

## Base validada

- `main` actualizado.
- PR #45 integrado en `main`.
- PR #46 integrado en `main`.
- PR #48 integrado en `main`.
- Commit base observado para validacion visual: `ce63f1e feat: mejora selector de horario en agenda (#48)`.

## Entorno

- Repositorio local: `4ndres30/terapeutas-australes-app`.
- Supabase local activo.
- Vite local verificado.
- Navegador integrado disponible en `http://127.0.0.1:5173/agenda`.
- Sesion autenticada como `Administrador Local`.
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
- Titulo visual autenticado: `QA-008 Visual Agenda Codex editado`
- Titulo base solapamiento: `QA-008 Visual Solape Base`
- Estado final de eventos visuales: `cancelado`

No se usaron nombres reales, correos reales, telefonos reales ni datos clinicos reales.

## Resumen ejecutivo

Agenda interna funciona correctamente en la parte de modelo local, RLS, operaciones principales de `agenda_eventos` y recorrido visual autenticado con usuario `admin`.

Se valido creacion, visualizacion desde `public.vista_agenda_operativa`, edicion, reagendamiento, cambio a completado, cancelacion sin delete fisico, persistencia, bloqueo de solapamiento desde UI y ausencia de efectos colaterales clinicos/financieros/Storage.

No se detectaron hallazgos bloqueantes ni altos en la parte ejecutada.

La validacion visual autenticada queda ejecutada en desktop con resultado funcional OK. La observacion responsive detectada en viewport movil queda corregida por UI-027 mediante menu superior y drawer lateral desde la izquierda.

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
| Revision visual autenticada admin | OK. `/agenda` carga con sesion `Administrador Local`. |
| Modal de creacion | OK en desktop. Controles presentes, sin solapes visibles. |
| Edicion visual | OK. Cambios se reflejan en listado. |
| Reagendamiento visual | OK. Campos no permitidos quedan deshabilitados; hora y fin calculado actualizan. |
| Validacion UI de solapamiento | OK. El segundo evento demo superpuesto fue bloqueado y no se creo. |
| Acciones rapidas visuales | OK. Completado y cancelado cambian estado sin delete fisico. |
| Responsive desktop 1280x720 | OK. Sin overflow horizontal observado. |
| Responsive movil 390x844 | OK tras UI-027. Menu superior abre drawer lateral y no hay overflow horizontal. |
| Responsive movil 360x740 | OK tras UI-027. Sin overflow horizontal. |
| Consola navegador | OK. Sin errores ni warnings capturados durante el recorrido. |

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
| admin | OK por SQL local y validacion visual autenticada. Puede crear, editar, reagendar, completar y cancelar. |
| terapeuta | OK por SQL local. Puede leer vista y actualizar evento dentro del alcance. |
| finanzas | OK por SQL local y codigo de ruta. No tiene acceso funcional a Agenda. |
| anonimo | OK por SQL local y codigo de ruta. No tiene permiso sobre la vista ni acceso sin sesion. |

Validacion visual por login real: ejecutada para `admin`. No se ejecuto login visual separado por `terapeuta` ni `finanzas` por falta de credenciales demo documentadas; esas coberturas se mantienen validadas por SQL local y codigo de rutas.

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

**Severidad:** Cerrada.
**Descripcion:** La limitacion original queda resuelta en la actualizacion visual autenticada.
**Evidencia:** Se valido `/agenda` en navegador integrado con sesion `Administrador Local`.
**Impacto:** Ya no bloquea la revision visual admin de Agenda.
**Recomendacion:** Mantener evidencia en esta ejecucion y no reabrir salvo que el navegador vuelva a quedar indisponible.

### QA008-OBS-002 - Credenciales demo por rol no documentadas

**Severidad:** Observacion
**Descripcion:** Existen usuarios locales por rol en DB, pero el repositorio no documenta contrasenas demo para login visual.
**Evidencia:** Busqueda documental encontro usuarios demo, pero no contrasenas versionadas.
**Impacto:** QA visual por rol depende de conocimiento externo o intervencion manual.
**Recomendacion:** Definir procedimiento controlado de usuarios demo locales sin exponer secretos en Git.
**Tarea sugerida:** Documentar provisioning local/demo de usuarios internos en una tarea de seguridad/control, sin habilitar produccion.

### QA008-OBS-003 - Overflow horizontal en viewport movil

**Severidad:** Cerrada por UI-027.
**Descripcion:** En viewport `390x844`, la barra lateral fija ocupaba gran parte del ancho y la superficie de Agenda quedaba recortada con scroll horizontal.
**Evidencia original:** Validacion visual autenticada en navegador integrado. `documentElement.scrollWidth` superaba `clientWidth` y la captura movil mostraba contenido principal parcialmente oculto.
**Correccion:** `UI-027` reemplaza la sidebar movil por boton superior y drawer lateral desde la izquierda.
**Evidencia posterior:** En `390x844`, `documentElement.clientWidth` y `scrollWidth` quedan iguales. En `360x740` tampoco hay overflow. Desktop `1280x720` conserva sidebar fija y dos columnas.
**Impacto:** Agenda interna queda aprobada como experiencia responsive local/demo, sin habilitar datos reales ni produccion.
**Tarea relacionada:** `UI-027 - Ajuste responsive de shell y Agenda interna`.

## Riesgos

- Avanzar a `BE-026` requiere integrar la trazabilidad QA-008/UI-027 y mantener API publica/Google/produccion fuera de alcance.
- La ausencia de historial detallado de cambios de Agenda sigue siendo riesgo antes de uso real.
- `PROD-001` sigue bloqueante para cualquier dato real.

## Limitaciones

- No se hizo login visual por rol `terapeuta` ni `finanzas`; se mantiene validacion por SQL local y rutas.
- La validacion responsive desktop y movil pasa tras UI-027.
- Se crearon eventos demo locales persistentes en `agenda_eventos`; se dejaron en estado `cancelado` para respetar la prueba de persistencia y no ejecutar delete fisico.

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
- Navegador integrado cargo `/agenda` en `http://127.0.0.1:5173/agenda` con sesion `Administrador Local`.
- UI visual confirmo modal de creacion, edicion, reagendamiento, fin calculado, acciones rapidas y bloqueo de solapamiento.
- Consola del navegador no registro errores ni warnings durante el recorrido visual.
- Responsive desktop 1280x720 sin overflow horizontal; responsive movil 390x844 y 360x740 sin overflow horizontal tras UI-027.

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

No hay hallazgos bloqueantes ni altos en las pruebas ejecutadas.

Agenda interna queda funcionalmente consistente a nivel local/DB/RLS y validada visualmente en desktop con usuario `admin`.

La unica observacion nueva de QA visual fue responsive movil y queda corregida por UI-027. `BE-026` sigue correspondiendo al diseno de contrato de API publica, sin habilitar Google ni produccion.

## Proximo paso recomendado

Integrar PR #49 y UI-027 para dejar cerrada la trazabilidad de Agenda interna antes de iniciar `BE-026`.

`BE-027` Google Calendar/Gmail debe seguir en espera.
