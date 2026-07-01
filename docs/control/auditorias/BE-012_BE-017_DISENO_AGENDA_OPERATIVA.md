# BE-012 / BE-017 - Diseno de Agenda Operativa

## 1. Resumen ejecutivo

Agenda debe ser un modulo operativo mixto, pero no debe mezclar en una sola entidad la solicitud publica, el evento interno y la consulta clinica confirmada.

La arquitectura recomendada separa:

1. `solicitudes_agenda`: recepcion controlada de solicitudes publicas o internas iniciales, con datos minimos y sin ficha clinica definitiva.
2. `agenda_eventos`: agenda interna tipificada, con eventos programados, confirmados o administrativos.
3. `consultas`: registro clinico de una atencion, contacto o cita confirmada asociada a un paciente real.

Esta separacion permite que la futura API publica `BE-026` reciba solicitudes sin escribir directamente en tablas clinicas, sin crear pacientes automaticamente y sin exponer Google Calendar/Gmail desde frontend.

Esta tarea no implementa tablas, migraciones, endpoints, UI, Auth/RLS ni integraciones Google. Solo define la arquitectura base.

## 2. Estado actual detectado en documentacion

- `DEC-011` ya define Agenda como modulo mixto de eventos programados con `tipo_evento` obligatorio.
- `BE-001`, `BE-002` y `RFC-001` confirman que Agenda no tiene backend dedicado.
- `BE-002` sugiere una futura tabla `agenda_eventos` con relaciones opcionales a paciente, consulta, evaluacion, caso, revision, trabajo y sesion.
- `API-001` establece que la pagina publica no debe conectarse directo a Supabase ni escribir en tablas clinicas/financieras.
- `API-001` deja a BE-012 y BE-017 como dependencias antes de disenar el contrato real `BE-026`.
- `BE-020`, `SEC-005`, `BE-018`, `DOC-001`, `DOC-003`, `SEC-009` y `PROD-001` siguen bloqueando cualquier uso real con datos sensibles.

## 3. Estado actual detectado en codigo

- `src/App.tsx` contiene la ruta interna `/agenda`, protegida para roles `admin` y `terapeuta`.
- `src/pages/AgendaPage.tsx` es un placeholder tecnico. Declara que no hay tabla publica de agenda, citas o eventos y que no existe logica de guardado.
- `src/lib/supabase.ts` expone un cliente Supabase de frontend para la aplicacion interna autenticada.
- `package.json` no contiene backend HTTP propio ni dependencias Google Calendar/Gmail.
- `supabase/migrations/` no contiene tabla `agenda_eventos`, `solicitudes_agenda` ni integracion Google.
- La tabla `consultas` existe y exige `paciente_id`, `tipo_consulta`, `modalidad`, `motivo_consulta` y estado controlado.

## 4. Problema arquitectonico

Si Agenda se implementa usando directamente `consultas` para solicitudes publicas, se producirian riesgos:

- una persona externa podria crear registros clinicos prematuramente;
- se podria crear un paciente sin revision interna ni deduplicacion;
- se mezclaria una intencion comercial/operativa con una atencion clinica;
- se perderia trazabilidad entre solicitud, confirmacion y atencion;
- se dificultaria aplicar consentimiento, anti-spam, auditoria e idempotencia;
- se expondria la estructura interna a la futura pagina publica.

Agenda debe resolver disponibilidad, programacion y seguimiento operativo sin convertir toda solicitud en ficha clinica.

## 5. Propuesta de entidad o entidades

### `solicitudes_agenda`

Representa una solicitud inicial de hora. Puede venir desde pagina publica futura, llamada, WhatsApp, correo o carga manual interna.

No es una consulta clinica. No es un paciente definitivo. No debe contener relato clinico profundo ni informacion energetica sensible.

### `agenda_eventos`

Representa un evento interno programado y tipificado.

Puede ser:

- consulta;
- evaluacion;
- revision;
- sesion_trabajo;
- seguimiento;
- recordatorio;
- administrativo.

Debe tener `tipo_evento` obligatorio y relaciones opcionales a entidades clinicas existentes.

### `consultas`

Se mantiene como registro clinico/operativo de una atencion, cita o contacto confirmado, asociado a un `paciente_id`.

No debe recibir escrituras directas desde pagina publica ni desde API publica sin revision interna.

## 6. Flujo recomendado

### Flujo publico futuro

1. Paciente potencial envia solicitud desde pagina publica.
2. API publica valida payload, consentimiento, rate limit, CORS, CAPTCHA/anti-spam e idempotencia.
3. Backend crea `solicitudes_agenda` con datos minimos.
4. Equipo interno revisa la solicitud.
5. Equipo interno busca posible paciente existente por correo, telefono y nombre.
6. Equipo interno decide:
   - rechazar;
   - pedir aclaracion;
   - confirmar una cita;
   - vincular a paciente existente;
   - crear paciente nuevo si corresponde.
7. Si se confirma, se crea o vincula `agenda_eventos`.
8. Si el evento corresponde a atencion clinica, se crea o vincula `consultas`.
9. Solo despues de confirmacion interna se sincroniza Calendar y se envia correo de confirmacion.

### Flujo interno

Un usuario `admin` o `terapeuta` puede crear eventos internos directamente en `agenda_eventos`, por ejemplo seguimiento, recordatorio, revision programada o sesion de trabajo.

Un evento interno puede vincularse a paciente, consulta, evaluacion, caso, revision, trabajo o sesion de trabajo segun el contexto aprobado.

## 7. Campos minimos recomendados

### Campos publicos posibles para `solicitudes_agenda`

- `nombre_contacto`
- `email_contacto`
- `telefono_contacto`
- `servicio_solicitado`
- `modalidad_preferida`
- `fecha_preferida`
- `bloque_horario_preferido`
- `motivo_general`
- `consentimiento_aceptado`
- `consentimiento_version`

### Campos internos para `solicitudes_agenda`

- `estado_solicitud`
- `paciente_id`
- `agenda_evento_id`
- `consulta_id`
- `responsable_interno_id`
- `decision_interna`
- `notas_administrativas`
- `motivo_rechazo`

### Campos tecnicos/auditoria para `solicitudes_agenda`

- `id_solicitud_agenda`
- `canal_origen`
- `idempotency_key`
- `ip_hash`
- `user_agent_hash`
- `created_at`
- `updated_at`
- `revisada_at`
- `confirmada_at`

### Campos minimos para `agenda_eventos`

- `id_agenda_evento`
- `tipo_evento`
- `estado_evento`
- `fecha_inicio`
- `fecha_fin`
- `modalidad`
- `origen_evento`
- `paciente_id`
- `consulta_id`
- `evaluacion_id`
- `caso_id`
- `revision_id`
- `trabajo_id`
- `trabajo_sesion_id`
- `solicitud_agenda_id`
- `titulo_interno`
- `notas_internas`
- `google_calendar_event_id`
- `google_calendar_sync_estado`
- `created_by`
- `updated_by`
- `created_at`
- `updated_at`

## 8. Relacion con Pacientes

La solicitud publica no debe crear un paciente definitivo automaticamente.

Debe existir revision interna para:

- buscar paciente existente por telefono, correo y nombre;
- detectar duplicados;
- decidir si la persona es paciente nuevo o potencial;
- crear ficha `pacientes` solo cuando exista consentimiento suficiente y decision interna;
- vincular `solicitudes_agenda.paciente_id` despues de la revision.

La tabla `pacientes` sigue siendo la identidad clinica principal. `solicitudes_agenda` solo conserva datos minimos de contacto mientras la solicitud se revisa.

## 9. Relacion con Consultas

No se recomienda usar `consultas` directamente como bandeja de solicitudes publicas.

`consultas` requiere `paciente_id` y `motivo_consulta`, por lo que ya presupone una entidad clinica interna. Debe crearse solo cuando:

- un usuario interno confirma que corresponde una atencion/contacto/consulta real;
- existe paciente vinculado o se crea uno validado;
- existe consentimiento suficiente;
- la cita tiene fecha/modalidad/tipo definidos;
- el evento de agenda fue aceptado o programado internamente.

Una solicitud puede terminar sin consulta si se rechaza, se cancela, es spam, no corresponde o queda como contacto no convertido.

## 10. Relacion con Evaluaciones, Casos y Revisiones

Agenda no debe crear automaticamente:

- evaluaciones;
- casos;
- elementos del caso;
- revisiones;
- detalle de revisiones;
- hallazgos;
- trabajos.

Esas entidades pertenecen al flujo clinico interno y deben nacer por decision del terapeuta o del equipo autorizado.

Agenda puede programar un evento asociado a una evaluacion, revision o sesion de trabajo ya existente, pero no debe inventar la entidad clinica por el solo hecho de recibir una solicitud.

## 11. Estados operativos recomendados

### `solicitudes_agenda.estado_solicitud`

Lista minima recomendada:

- `recibida`
- `en_revision`
- `pendiente_confirmacion`
- `confirmada`
- `rechazada`
- `cancelada`
- `convertida`

### `agenda_eventos.estado_evento`

Lista minima recomendada:

- `programado`
- `confirmado`
- `reagendado`
- `cancelado`
- `completado`
- `no_asistio`

No se recomienda una lista mayor en v1. Estados adicionales deben justificarse por flujo real.

## 12. Relacion futura con Google Calendar

Google Calendar debe sincronizarse solo desde backend seguro, nunca desde frontend publico.

La creacion de evento en Calendar debe ocurrir despues de confirmacion interna, no al recibir una solicitud publica.

Datos permitidos para Calendar:

- titulo neutro;
- fecha/hora;
- modalidad general;
- identificador operativo no sensible si es necesario;
- estado tecnico de sincronizacion.

Datos prohibidos para Calendar:

- motivo sensible;
- informacion clinica;
- informacion canalizada;
- detalles energeticos profundos;
- fotos;
- datos financieros;
- notas internas.

Titulo recomendado:

```text
Cita Terapeutas Australes - Servicio reservado
```

`agenda_eventos.google_calendar_event_id` puede quedar como referencia tecnica futura, pero solo cuando BE-027 implemente integracion real.

## 13. Relacion futura con Gmail

Gmail/Workspace debe operar desde backend seguro.

Correos futuros posibles:

- recepcion de solicitud;
- confirmacion de cita;
- cancelacion;
- reagendamiento;
- recordatorio;
- aviso interno al equipo.

Los correos deben ser neutros y no deben incluir motivo sensible ni detalle clinico.

Ejemplo correcto:

```text
Tu solicitud fue recibida. El equipo revisara disponibilidad y te contactara.
```

Ejemplo prohibido:

```text
Recibimos tu solicitud por entidades, conflicto familiar o bloqueo espiritual.
```

## 14. Relacion futura con API publica BE-026

BE-026 debe partir de esta separacion:

- `POST /api/public/agendamientos` crea `solicitudes_agenda`, no `consultas`.
- `GET /api/public/disponibilidad` devuelve disponibilidad publicable, no agenda interna completa.
- `POST /api/public/consentimientos` registra consentimiento o referencia a consentimiento.
- Endpoints internos crean o actualizan `agenda_eventos` y, si corresponde, `consultas`.

BE-026 debe definir payloads, validaciones, CORS, rate limit, anti-spam, idempotencia, errores neutros y auditoria.

No debe crear endpoints reales hasta cerrar BE-012, BE-017, BE-020, BE-018, SEC-005, SEC-009, BE-027 y PROD-001.

## 15. Estrategia SQL conceptual BE-017

Se recomienda que `vista_agenda_operativa` tenga como fuente primaria `agenda_eventos`.

La vista debe unir contexto desde `pacientes`, `consultas`, `evaluaciones`, `casos`, `revisiones`, `trabajos` y `trabajo_sesiones` solo cuando exista relacion desde `agenda_eventos`.

No se recomienda una vista que haga `UNION` automatico de todas las consultas, evaluaciones, revisiones y sesiones, porque puede duplicar eventos si tambien existen filas en `agenda_eventos`.

Si se requiere migrar datos historicos, debe hacerse por backfill controlado en una tarea futura, no en esta fase documental.

## 16. Riesgos

- Exposicion de datos personales por escribir solicitudes publicas directo en tablas clinicas.
- Duplicacion de pacientes por crear fichas automaticamente.
- Creacion prematura de consultas clinicas desde un formulario publico.
- Mezcla entre solicitud comercial/operativa y ficha clinica.
- Falta de consentimiento antes de almacenar o procesar datos reales.
- Exposicion de secretos Google si Calendar/Gmail se conectan desde frontend.
- Eventos o correos con informacion sensible.
- Duplicacion entre `agenda_eventos` y `consultas` si no existe fuente primaria.
- Falta de auditoria para recepcion, rechazo, confirmacion, cancelacion y conversion.
- Ausencia de ambientes separados.
- Uso con datos reales antes de cerrar PROD-001.

## 17. Bloqueos

- PROD-001 sigue bloqueante.
- BE-020 consentimiento informado pendiente.
- BE-018 separacion tecnica de ambientes pendiente.
- BE-019 backup/restauracion pendiente.
- SEC-005 auditoria sensible pendiente.
- SEC-009 seguridad API publica pendiente.
- BE-027 integracion Google Workspace pendiente.
- DOC-001 manual de ambientes pendiente.
- DOC-003 politica de carga de datos reales pendiente.
- QA-006 pruebas por rol y no exposicion sensible pendiente.

## 18. Decision recomendada

Se recomienda aprobar `DEC-034`: Agenda operativa separada de consulta clinica confirmada.

La decision debe establecer:

- `solicitudes_agenda` recibe solicitudes iniciales sin crear ficha clinica definitiva.
- `agenda_eventos` representa la agenda interna tipificada.
- `consultas` se crea o vincula solo despues de revision interna y paciente validado.
- Agenda no crea automaticamente evaluaciones, casos, revisiones, elementos, hallazgos ni trabajos.
- Google Calendar/Gmail quedan fuera de frontend y se integran solo por backend futuro.

## 19. Criterios de aceptacion para cerrar BE-012

- Confirmar que Agenda se separa en solicitud inicial, evento interno y consulta confirmada.
- Definir entidad conceptual `solicitudes_agenda`.
- Definir entidad conceptual `agenda_eventos`.
- Definir relacion con `pacientes` y regla de no creacion automatica desde publico.
- Definir relacion con `consultas` y momento de conversion.
- Definir relacion con evaluaciones, casos, revisiones y trabajos sin automatismos.
- Definir estados minimos.
- Definir campos minimos publicos, internos y tecnicos.
- No crear migracion.
- No modificar codigo funcional.
- No tocar Supabase remoto ni `.env`.

## 20. Criterios de aceptacion para cerrar BE-017

- Definir que `vista_agenda_operativa` debe basarse principalmente en `agenda_eventos`.
- Definir que las entidades clinicas se unen como contexto, no como eventos duplicados por defecto.
- Definir que eventos derivados deben existir como `agenda_eventos` relacionados o mediante backfill controlado.
- Definir campos minimos que la vista puede exponer por rol.
- Mantener `tipo_evento` obligatorio.
- Separar eventos manuales, solicitudes convertidas y eventos asociados a entidades clinicas.
- No crear vista SQL todavia.
- No modificar migraciones.
- No tocar Supabase remoto ni `.env`.

## 21. Tareas derivadas

- `BE-028` - Implementar modelo DB de Agenda operativa, con migracion futura para `solicitudes_agenda`, `agenda_eventos` y `vista_agenda_operativa`.
- `UI-014` - Disenar Agenda tipificada usando BE-012/BE-017 y DEC-034 como base.
- `BE-026` - Disenar contrato de API publica de agendamiento usando `solicitudes_agenda` como destino publico.
- `BE-027` - Disenar integracion Google Calendar/Gmail/Workspace desde backend.
- `SEC-009` - Seguridad de API publica.
- `SEC-005` - Auditoria sensible de solicitudes, conversiones, cancelaciones, syncs y notificaciones.
- `QA-006` - Validacion por rol y no exposicion sensible.

## 22. Conclusion

Agenda no debe ser una unica tabla ni una extension directa de `consultas`.

La arquitectura segura es:

```text
Solicitud publica o interna inicial
-> solicitudes_agenda
-> revision interna
-> agenda_eventos
-> consulta confirmada solo si corresponde
-> Google Calendar/Gmail solo desde backend futuro
```

Esta definicion permite avanzar luego a `BE-026` sin exponer Supabase, sin crear pacientes prematuros y sin confundir solicitud de hora con registro clinico.

El proyecto sigue sin Agenda operativa implementada y PROD-001 continua bloqueante.
