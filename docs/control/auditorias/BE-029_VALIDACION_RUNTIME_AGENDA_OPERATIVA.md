# BE-029 - Validacion runtime Agenda Operativa

## 1. Resumen ejecutivo

BE-029 valida en Supabase local/demo el modelo DB de Agenda Operativa integrado por BE-028.

La validacion confirma que existen y operan:

- `public.solicitudes_agenda`;
- `public.agenda_eventos`;
- `public.vista_agenda_operativa`.

Resultado: **aprobada localmente con observaciones no bloqueantes para demo/local**.

La validacion no habilita produccion, datos reales, API publica, Google Calendar, Gmail ni UI funcional de Agenda.

## 2. Base usada

Base Git usada:

```text
main actualizado con PR #41
commit d0115c9 feat: implementa modelo DB de agenda operativa (#41)
```

Rama de validacion:

```text
be-029-validacion-runtime-agenda-operativa
```

## 3. Migracion validada

Migracion validada:

```text
supabase/migrations/20260701040000_crear_modelo_agenda_operativa.sql
```

La migracion crea:

- `public.solicitudes_agenda`;
- `public.agenda_eventos`;
- `public.vista_agenda_operativa`;
- checks, indices, FKs, triggers `updated_at`, RLS y policies iniciales.

## 4. Entorno local usado

Se uso Supabase local.

Comandos de control:

```bash
npx supabase status
npx supabase migration list --local
npx supabase migration up --local
```

`npx supabase migration up --local` aplico la migracion pendiente solo contra la base local.

No se ejecuto `supabase db push`.

No se toco Supabase remoto.

## 5. Comandos ejecutados

Comandos principales:

```bash
git status
gh pr view 41
gh pr diff 41 --name-only
gh pr checks 41
gh pr merge 41 --squash
git switch main
git pull origin main
git switch -c be-029-validacion-runtime-agenda-operativa
npx supabase status
npx supabase migration list --local
npx supabase migration up --local
psql contra PostgreSQL local
```

Tambien se valido ausencia de `service_role` en frontend mediante busqueda local.

## 6. Pruebas de estructura

Resultado: OK.

Se confirmo existencia de:

- `public.solicitudes_agenda`;
- `public.agenda_eventos`;
- `public.vista_agenda_operativa`.

Tambien se confirmo:

- RLS habilitado en `solicitudes_agenda`;
- RLS habilitado en `agenda_eventos`;
- `vista_agenda_operativa` con `security_invoker=true`;
- triggers `set_solicitudes_agenda_updated_at` y `set_agenda_eventos_updated_at`.

## 7. Pruebas de checks

Resultado: OK.

Checks validados:

- `origen_solicitud` invalido queda bloqueado.
- `estado_solicitud` invalido queda bloqueado.
- `tipo_evento` invalido queda bloqueado.
- `estado_evento` invalido queda bloqueado.
- `solicitudes_agenda` exige contacto minimo por email o telefono.
- `consentimiento_contacto = true` exige `fecha_consentimiento`.
- `agenda_eventos.fecha_fin` debe ser posterior a `fecha_inicio`.
- `origen_evento = solicitud_agenda` exige `solicitud_agenda_id`.
- `estado_solicitud = convertida_a_consulta` exige `consulta_id`.

La matriz de checks/FKs/triggers devolvio 17 resultados OK.

## 8. Pruebas de relaciones

Resultado: OK.

Validaciones:

- `solicitudes_agenda.paciente_id` es opcional.
- `solicitudes_agenda.consulta_id` es opcional.
- `agenda_eventos.solicitud_agenda_id` permite vincular solicitud previa.
- `agenda_eventos.consulta_id` bloquea UUID inexistente por FK.
- `agenda_eventos.consulta_id` permite consulta existente.
- `convertida_a_consulta` permite `consulta_id` existente.
- Crear una solicitud no crea automaticamente pacientes.
- Crear una solicitud no crea automaticamente consultas.

Los datos usados fueron ficticios y quedaron dentro de transacciones revertidas.

## 9. Pruebas de RLS / policies

Resultado: OK.

Se confirmo:

- `solicitudes_agenda` tiene 3 policies: `select`, `insert`, `update`.
- `agenda_eventos` tiene 3 policies: `select`, `insert`, `update`.
- No existe policy de `delete` para las tablas nuevas.
- `anon` no tiene grant directo de lectura.
- `authenticated` tiene `select`, `insert`, `update`, pero no `delete`.
- RLS bloquea a roles sin policy efectiva.

## 10. Pruebas de roles

Se usaron usuarios Auth ficticios dentro de transacciones con `ROLLBACK`.

Patron utilizado:

- insertar usuarios ficticios en `auth.users`;
- insertar perfiles ficticios en `public.usuarios_internos`;
- usar `SET LOCAL ROLE authenticated`;
- usar claims locales con `request.jwt.claim.sub`;
- ejecutar `ROLLBACK` final.

Matriz general de estructura, seguridad, roles y vista: 30/30 OK.

Matriz especifica de `agenda_eventos`: 11/11 OK.

## 11. Resultado de `admin`

Resultado: OK.

`admin` puede:

- insertar `solicitudes_agenda`;
- seleccionar `solicitudes_agenda`;
- actualizar `solicitudes_agenda`;
- insertar `agenda_eventos`;
- seleccionar `agenda_eventos`;
- actualizar `agenda_eventos`;
- consultar `vista_agenda_operativa`.

## 12. Resultado de `terapeuta`

Resultado: OK.

`terapeuta` puede:

- insertar `solicitudes_agenda`;
- seleccionar `solicitudes_agenda`;
- actualizar `solicitudes_agenda`;
- insertar `agenda_eventos`;
- seleccionar `agenda_eventos`;
- actualizar `agenda_eventos`;
- consultar `vista_agenda_operativa`.

## 13. Resultado de `finanzas`

Resultado: OK.

`finanzas` queda fuera de Agenda Operativa:

- `select` en `solicitudes_agenda`: 0 filas por RLS.
- `insert` en `solicitudes_agenda`: bloqueado por RLS.
- `update` en `solicitudes_agenda`: 0 filas por RLS.
- `select` en `agenda_eventos`: 0 filas por RLS.
- `insert` en `agenda_eventos`: bloqueado por RLS.
- `update` en `agenda_eventos`: 0 filas por RLS.
- `vista_agenda_operativa`: 0 filas por RLS.

## 14. Resultado de `anon`

Resultado: OK.

`anon` no tiene acceso directo:

- `select` en `solicitudes_agenda`: bloqueado por falta de grant.
- `insert` en `solicitudes_agenda`: bloqueado por falta de grant.
- `select` en `agenda_eventos`: bloqueado por falta de grant.
- `insert` en `agenda_eventos`: bloqueado por falta de grant.
- `select` en `vista_agenda_operativa`: bloqueado por falta de grant.

## 15. Resultado de vista operativa

Resultado: OK.

`vista_agenda_operativa`:

- es consultable por `admin`;
- es consultable por `terapeuta`;
- devuelve 0 filas para `finanzas`;
- no es accesible para `anon`;
- usa `security_invoker=true`;
- no expone columnas de hallazgos;
- no expone fotos;
- no expone Storage;
- no expone pagos;
- no expone cobros;
- no expone montos;
- no expone notas internas ni mensaje de contacto.

La vista conserva contexto operativo minimo de agenda, solicitud y paciente para roles clinicos autorizados.

## 16. Riesgos detectados

- Agenda ya tiene modelo DB local, pero todavia no tiene UI funcional conectada.
- La vista expone datos personales operativos a roles clinicos autorizados; esto es esperado para `admin`/`terapeuta`, pero sigue bloqueado para datos reales por PROD-001.
- No existe aun auditoria sensible completa para cambios de estado, conversiones o sincronizaciones.
- No existe aun consentimiento informado final para uso real.
- No existe API publica segura.
- No existe integracion Google Calendar/Gmail.

## 17. Limitaciones de la validacion

- Validacion ejecutada solo en Supabase local/demo.
- No se probo Supabase remoto.
- No se probo uso con datos reales.
- No se probo frontend funcional de Agenda.
- No se probo API publica.
- No se probo Google Calendar/Gmail.
- No se hizo benchmark ni prueba de carga.

## 18. Restricciones respetadas

- No se toco Supabase remoto.
- No se ejecuto `supabase db push`.
- No se ejecuto deploy.
- No se toco `.env`.
- No se modificaron secretos.
- No se creo API publica.
- No se crearon endpoints.
- No se integro Google Calendar.
- No se integro Gmail.
- No se implemento frontend funcional de Agenda.
- No se modifico Auth.
- No se modifico RLS existente fuera de las tablas nuevas de Agenda.
- No se usaron datos reales.
- No se habilito produccion.

## 19. Conclusion

BE-029 valida correctamente, en entorno local/demo, el modelo DB de Agenda Operativa integrado en BE-028.

La separacion se mantiene:

```text
solicitudes_agenda != agenda_eventos != consultas
```

La validacion confirma que:

- `admin` y `terapeuta` pueden operar Agenda;
- `finanzas` queda fuera;
- `anon` queda fuera;
- no hay creacion automatica de pacientes;
- no hay creacion automatica de consultas;
- la vista operativa no expone hallazgos, fotos, pagos ni datos financieros.

BE-029 no cierra produccion ni habilita datos reales.

## 20. Proximos pasos recomendados

Despues del merge de BE-029, Control debe decidir entre:

- `UI-025`: integrar visualmente `AgendaPage` con el modelo DB.
- `BE-026`: disenar contrato de API publica usando `solicitudes_agenda`.
- `SEC-005`: definir auditoria sensible para cambios de Agenda.
- `BE-020`: cerrar consentimiento informado antes de flujos reales.

PROD-001 sigue bloqueante.
