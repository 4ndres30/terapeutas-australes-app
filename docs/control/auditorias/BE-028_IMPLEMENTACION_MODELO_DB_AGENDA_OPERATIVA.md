# BE-028 - Implementacion modelo DB de Agenda Operativa

## 1. Resumen ejecutivo

BE-028 implementa la base estructural versionada de Agenda Operativa en Supabase/PostgreSQL, siguiendo BE-012/BE-017 y DEC-034.

La implementacion separa:

1. `solicitudes_agenda`: solicitudes iniciales de hora o contacto, publicas futuras o internas, sin crear ficha clinica definitiva.
2. `agenda_eventos`: eventos internos tipificados y programables.
3. `consultas`: se mantiene como registro de atencion/contacto confirmado con paciente real.

Esta tarea no implementa API publica, no modifica frontend funcional, no integra Google Calendar/Gmail y no habilita produccion ni datos reales.

## 2. Estado anterior

Antes de BE-028, Agenda estaba definida documentalmente pero no implementada en base de datos.

El estado observado era:

- `src/pages/AgendaPage.tsx` seguia como placeholder tecnico.
- `supabase/migrations/` no tenia `solicitudes_agenda`, `agenda_eventos` ni `vista_agenda_operativa`.
- La ruta `/agenda` estaba protegida para `admin` y `terapeuta`.
- El frontend interno usaba Supabase directamente con usuario autenticado.
- No existia API/backend propio ni integracion Google.

## 3. Decision tecnica aplicada

Se implementa el modelo DB inicial sin usar `consultas` como bandeja de solicitudes.

La relacion queda normalizada asi:

```text
solicitudes_agenda
  -> revision interna
  -> agenda_eventos.solicitud_agenda_id
  -> agenda_eventos.consulta_id solo si existe consulta confirmada
```

No se agrega una FK circular desde `solicitudes_agenda` hacia `agenda_eventos`. La trazabilidad solicitud -> evento queda por `agenda_eventos.solicitud_agenda_id`.

## 4. Migracion creada

Se crea:

```text
supabase/migrations/20260701040000_crear_modelo_agenda_operativa.sql
```

La migracion incluye:

- tablas `public.solicitudes_agenda` y `public.agenda_eventos`;
- vista `public.vista_agenda_operativa`;
- triggers `updated_at` usando `public.set_updated_at()`;
- checks de estados, tipos, modalidad, contacto minimo y rangos de fecha;
- indices minimos por estado, fecha, tipo y relaciones;
- relaciones opcionales a entidades existentes;
- RLS y policies iniciales para `admin`/`terapeuta`;
- grants minimos sin acceso directo para `anon`.

## 5. Tablas creadas

### `public.solicitudes_agenda`

Representa solicitudes iniciales de hora o contacto.

Incluye datos minimos de contacto, origen, estado, preferencia de modalidad/fecha, consentimiento de contacto, posible vinculacion posterior a paciente/consulta y campos tecnicos para idempotencia o auditoria futura.

Reglas aplicadas:

- `paciente_id` es nullable.
- `consulta_id` es nullable.
- No existe trigger que cree pacientes automaticamente.
- No existe trigger que cree consultas automaticamente.
- El contacto minimo exige email o telefono.
- `convertida_a_consulta` exige `consulta_id`.
- `consentimiento_contacto = true` exige `fecha_consentimiento`.

### `public.agenda_eventos`

Representa eventos internos tipificados.

Incluye relaciones opcionales a:

- `solicitudes_agenda`;
- `pacientes`;
- `consultas`;
- `evaluaciones`;
- `casos`;
- `revisiones`;
- `trabajos`;
- `trabajo_sesiones`.

Reglas aplicadas:

- `tipo_evento` es obligatorio.
- `fecha_inicio` es obligatoria.
- `fecha_fin`, si existe, debe ser posterior a `fecha_inicio`.
- `origen_evento = solicitud_agenda` exige `solicitud_agenda_id`.
- `google_calendar_event_id` queda como campo tecnico futuro, sin integracion real.
- `titulo_publico` queda separado de `titulo_evento` para permitir sincronizaciones futuras con texto neutro.

## 6. Vista creada

Se crea:

```text
public.vista_agenda_operativa
```

La vista usa `agenda_eventos` como fuente primaria y une contexto minimo desde `solicitudes_agenda` y `pacientes`.

No incluye:

- motivos clinicos profundos;
- hallazgos;
- revisiones detalladas;
- fotos;
- rutas de Storage;
- datos financieros;
- pagos;
- notas clinicas extensas.

La vista queda con `security_invoker = true`, grant `select` a `authenticated` y filtro `public.es_terapeuta_o_admin()`.

## 7. RLS / policies aplicadas

Se habilita RLS en:

- `public.solicitudes_agenda`;
- `public.agenda_eventos`.

Se crean policies para:

- `select` por `admin` y `terapeuta`;
- `insert` por `admin` y `terapeuta`;
- `update` por `admin` y `terapeuta`.

No se crea policy de `delete`.

No se otorgan privilegios a `anon`.

El rol `finanzas` no queda autorizado para estas tablas ni para la vista operativa.

## 8. Relacion con pacientes

`solicitudes_agenda.paciente_id` y `agenda_eventos.paciente_id` son opcionales.

Esto permite:

- recibir una solicitud sin crear ficha definitiva;
- revisar duplicados por telefono, correo o nombre;
- vincular un paciente existente despues de revision interna;
- crear un paciente nuevo solo en una tarea/flujo autorizado, no desde la solicitud publica.

## 9. Relacion con consultas

`solicitudes_agenda.consulta_id` y `agenda_eventos.consulta_id` son opcionales.

`consultas` no se modifica.

La conversion a consulta debe ocurrir solo cuando exista:

- revision interna;
- paciente validado;
- consentimiento suficiente;
- decision del equipo autorizado.

## 10. Relacion con API publica futura

BE-028 no implementa `BE-026`.

El modelo deja preparado que el futuro `POST /api/public/agendamientos` use `solicitudes_agenda` como destino conceptual mediante backend seguro.

La pagina publica futura no debe escribir directo en Supabase ni en `consultas`.

## 11. Relacion con Google Calendar / Gmail futura

BE-028 no integra Google Calendar ni Gmail.

Se deja solo preparacion estructural:

- `agenda_eventos.google_calendar_event_id`;
- `agenda_eventos.google_calendar_sync_estado`;
- `agenda_eventos.google_calendar_synced_at`;
- `agenda_eventos.titulo_publico` para textos neutros.

La sincronizacion real debe quedar para BE-027 o tarea tecnica posterior con backend seguro y secretos fuera del frontend.

## 12. Riesgos

- El modelo aun no tiene UI funcional conectada.
- La migracion versionada requiere aplicacion/validacion runtime local completa antes de usarla operativamente.
- No existe auditoria sensible completa para conversiones, cambios de estado o sincronizaciones.
- No existe consentimiento informado final.
- No existe API segura publica.
- No existe separacion tecnica de ambientes.
- PROD-001 sigue bloqueante.

## 13. Restricciones respetadas

- No se modifico `.env`.
- No se toco Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth.
- No se modifico RLS existente, salvo policies de tablas nuevas.
- No se modifico frontend funcional.
- No se crearon pacientes automaticamente.
- No se crearon consultas automaticamente.
- No se integro Google Calendar.
- No se integro Gmail.
- No se habilito produccion.
- No se usaron datos reales.

## 14. Validaciones ejecutadas

Validaciones tecnicas realizadas durante la tarea:

- `npx supabase status`: Supabase local activo.
- `psql` local con `BEGIN` + migracion + `ROLLBACK`: OK, la migracion compila y no persiste cambios.
- `npx supabase migration list --local`: nueva migracion visible en el listado local.

Validaciones finales de PR:

- `git diff --check`: OK, solo advertencias LF/CRLF normales de Windows.
- `git diff --cached --check`: OK.
- `npm run lint`: OK, solo warning npm `min-release-age`.
- `npm run build`: OK, solo warning Vite de chunk grande y warning npm `min-release-age`.
- `git status`: revisado; cambios limitados al alcance BE-028 antes del commit.

## 15. Pendientes derivados

- `BE-029`: validar runtime local de Agenda operativa por rol y RLS.
- `UI-025`: integrar `AgendaPage` con el modelo DB de Agenda operativa.
- `BE-026`: disenar contrato de API publica usando `solicitudes_agenda`.
- `BE-027`: disenar integracion Google Calendar/Gmail/Workspace desde backend seguro.
- `SEC-005`: auditoria de cambios sensibles, conversiones y sincronizaciones.
- `BE-020`: consentimiento informado y tratamiento de datos.
- `PROD-001`: sigue bloqueante para datos reales y produccion.

## 16. Conclusion

BE-028 implementa la base DB versionada para Agenda Operativa sin romper la separacion aprobada:

```text
solicitudes_agenda != agenda_eventos != consultas
```

La implementacion permite avanzar luego a validacion runtime local, UI de Agenda y contrato API publica, pero no habilita produccion, datos reales ni conexion publica directa.
