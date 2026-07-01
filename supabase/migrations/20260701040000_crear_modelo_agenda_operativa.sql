create table if not exists public.solicitudes_agenda (
  id_solicitud_agenda uuid primary key default gen_random_uuid(),

  fecha_solicitud timestamptz not null default now(),
  origen_solicitud text not null default 'interno' check (
    origen_solicitud in (
      'web_publica',
      'telefono',
      'whatsapp',
      'email',
      'interno',
      'otro'
    )
  ),
  estado_solicitud text not null default 'recibida' check (
    estado_solicitud in (
      'recibida',
      'en_revision',
      'pendiente_confirmacion',
      'confirmada',
      'rechazada',
      'cancelada',
      'convertida_a_evento',
      'convertida_a_consulta'
    )
  ),

  nombre_contacto text not null,
  telefono_contacto text,
  email_contacto text,
  canal_preferido text check (
    canal_preferido is null
    or canal_preferido in (
      'telefono',
      'whatsapp',
      'email',
      'indiferente',
      'otro'
    )
  ),
  modalidad_preferida text check (
    modalidad_preferida is null
    or modalidad_preferida in (
      'presencial',
      'online',
      'telefonica',
      'whatsapp',
      'videollamada',
      'por_definir'
    )
  ),
  tipo_atencion_solicitada text,
  fecha_preferida date,
  rango_horario_preferido text,
  mensaje_contacto text,

  consentimiento_contacto boolean not null default false,
  fecha_consentimiento timestamptz,
  consentimiento_version text,

  paciente_id uuid references public.pacientes(id)
    on update cascade
    on delete restrict,
  consulta_id uuid references public.consultas(id_consulta)
    on update cascade
    on delete restrict,
  responsable_interno_id uuid references public.usuarios_internos(id)
    on update cascade
    on delete set null,

  decision_interna text,
  motivo_rechazo text,
  notas_internas text,

  idempotency_key text,
  ip_hash text,
  user_agent_hash text,

  revisada_at timestamptz,
  confirmada_at timestamptz,
  created_by uuid references public.usuarios_internos(id)
    on update cascade
    on delete set null,
  updated_by uuid references public.usuarios_internos(id)
    on update cascade
    on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint solicitudes_agenda_contacto_minimo_check
    check (
      nullif(btrim(coalesce(email_contacto, '')), '') is not null
      or nullif(btrim(coalesce(telefono_contacto, '')), '') is not null
    ),
  constraint solicitudes_agenda_nombre_contacto_check
    check (nullif(btrim(nombre_contacto), '') is not null),
  constraint solicitudes_agenda_consentimiento_fecha_check
    check (
      consentimiento_contacto is false
      or fecha_consentimiento is not null
    ),
  constraint solicitudes_agenda_convertida_consulta_check
    check (
      estado_solicitud <> 'convertida_a_consulta'
      or consulta_id is not null
    )
);

drop trigger if exists set_solicitudes_agenda_updated_at on public.solicitudes_agenda;

create trigger set_solicitudes_agenda_updated_at
before update on public.solicitudes_agenda
for each row
execute function public.set_updated_at();

create index if not exists idx_solicitudes_agenda_estado
on public.solicitudes_agenda(estado_solicitud);

create index if not exists idx_solicitudes_agenda_fecha
on public.solicitudes_agenda(fecha_solicitud);

create index if not exists idx_solicitudes_agenda_paciente
on public.solicitudes_agenda(paciente_id);

create index if not exists idx_solicitudes_agenda_consulta
on public.solicitudes_agenda(consulta_id);

create index if not exists idx_solicitudes_agenda_responsable
on public.solicitudes_agenda(responsable_interno_id);

create unique index if not exists idx_solicitudes_agenda_idempotency_key
on public.solicitudes_agenda(idempotency_key)
where idempotency_key is not null;

create table if not exists public.agenda_eventos (
  id_agenda_evento uuid primary key default gen_random_uuid(),

  solicitud_agenda_id uuid references public.solicitudes_agenda(id_solicitud_agenda)
    on update cascade
    on delete restrict,
  paciente_id uuid references public.pacientes(id)
    on update cascade
    on delete restrict,
  consulta_id uuid references public.consultas(id_consulta)
    on update cascade
    on delete restrict,
  evaluacion_id uuid references public.evaluaciones(id_evaluacion)
    on update cascade
    on delete restrict,
  caso_id uuid references public.casos(id_caso)
    on update cascade
    on delete restrict,
  revision_id uuid references public.revisiones(id_revision)
    on update cascade
    on delete restrict,
  trabajo_id uuid references public.trabajos(id_trabajo)
    on update cascade
    on delete restrict,
  trabajo_sesion_id uuid references public.trabajo_sesiones(id_trabajo_sesion)
    on update cascade
    on delete restrict,

  titulo_evento text not null,
  titulo_publico text not null default 'Cita Terapeutas Australes - Servicio reservado',
  tipo_evento text not null check (
    tipo_evento in (
      'solicitud',
      'consulta',
      'evaluacion',
      'revision',
      'sesion_trabajo',
      'seguimiento',
      'administrativo',
      'bloqueo_horario',
      'otro'
    )
  ),
  estado_evento text not null default 'programado' check (
    estado_evento in (
      'programado',
      'confirmado',
      'reagendado',
      'cancelado',
      'completado',
      'no_asistio'
    )
  ),
  origen_evento text not null default 'interno' check (
    origen_evento in (
      'interno',
      'solicitud_agenda',
      'consulta',
      'evaluacion',
      'revision',
      'trabajo',
      'otro'
    )
  ),

  fecha_inicio timestamptz not null,
  fecha_fin timestamptz,
  modalidad text check (
    modalidad is null
    or modalidad in (
      'presencial',
      'online',
      'telefonica',
      'whatsapp',
      'videollamada',
      'por_definir'
    )
  ),
  ubicacion text,
  enlace_online text,

  requiere_confirmacion boolean not null default false,
  confirmado_por_paciente boolean not null default false,

  google_calendar_event_id text,
  google_calendar_sync_estado text not null default 'no_sincronizado' check (
    google_calendar_sync_estado in (
      'no_sincronizado',
      'pendiente',
      'sincronizado',
      'error',
      'omitido'
    )
  ),
  google_calendar_synced_at timestamptz,

  notas_internas text,

  created_by uuid references public.usuarios_internos(id)
    on update cascade
    on delete set null,
  updated_by uuid references public.usuarios_internos(id)
    on update cascade
    on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint agenda_eventos_titulo_evento_check
    check (nullif(btrim(titulo_evento), '') is not null),
  constraint agenda_eventos_titulo_publico_check
    check (nullif(btrim(titulo_publico), '') is not null),
  constraint agenda_eventos_rango_fecha_check
    check (
      fecha_fin is null
      or fecha_fin > fecha_inicio
    ),
  constraint agenda_eventos_solicitud_origen_check
    check (
      origen_evento <> 'solicitud_agenda'
      or solicitud_agenda_id is not null
    )
);

drop trigger if exists set_agenda_eventos_updated_at on public.agenda_eventos;

create trigger set_agenda_eventos_updated_at
before update on public.agenda_eventos
for each row
execute function public.set_updated_at();

create index if not exists idx_agenda_eventos_fecha_inicio
on public.agenda_eventos(fecha_inicio);

create index if not exists idx_agenda_eventos_estado
on public.agenda_eventos(estado_evento);

create index if not exists idx_agenda_eventos_tipo
on public.agenda_eventos(tipo_evento);

create index if not exists idx_agenda_eventos_solicitud
on public.agenda_eventos(solicitud_agenda_id);

create index if not exists idx_agenda_eventos_paciente
on public.agenda_eventos(paciente_id);

create index if not exists idx_agenda_eventos_consulta
on public.agenda_eventos(consulta_id);

create index if not exists idx_agenda_eventos_evaluacion
on public.agenda_eventos(evaluacion_id);

create index if not exists idx_agenda_eventos_caso
on public.agenda_eventos(caso_id);

create index if not exists idx_agenda_eventos_revision
on public.agenda_eventos(revision_id);

create index if not exists idx_agenda_eventos_trabajo
on public.agenda_eventos(trabajo_id);

create index if not exists idx_agenda_eventos_trabajo_sesion
on public.agenda_eventos(trabajo_sesion_id);

create unique index if not exists idx_agenda_eventos_google_calendar_event_id
on public.agenda_eventos(google_calendar_event_id)
where google_calendar_event_id is not null;

create or replace view public.vista_agenda_operativa as
select
  ae.id_agenda_evento,
  ae.solicitud_agenda_id,
  ae.paciente_id,
  ae.consulta_id,
  ae.evaluacion_id,
  ae.caso_id,
  ae.revision_id,
  ae.trabajo_id,
  ae.trabajo_sesion_id,
  ae.tipo_evento,
  ae.estado_evento,
  ae.origen_evento,
  ae.titulo_evento,
  ae.titulo_publico,
  ae.fecha_inicio,
  ae.fecha_fin,
  ae.modalidad,
  ae.requiere_confirmacion,
  ae.confirmado_por_paciente,
  ae.google_calendar_sync_estado,
  sa.estado_solicitud,
  sa.origen_solicitud,
  sa.fecha_solicitud,
  sa.nombre_contacto,
  sa.email_contacto,
  sa.telefono_contacto,
  case
    when p.id is not null then concat_ws(' ', p.nombres, p.apellidos)
    when sa.id_solicitud_agenda is not null then sa.nombre_contacto
    else 'Sin paciente vinculado'
  end as nombre_operativo,
  case
    when p.id is not null then 'paciente'
    when sa.id_solicitud_agenda is not null then 'solicitud'
    else 'interno'
  end as tipo_contexto,
  ae.created_at,
  ae.updated_at
from public.agenda_eventos ae
left join public.solicitudes_agenda sa
  on sa.id_solicitud_agenda = ae.solicitud_agenda_id
left join public.pacientes p
  on p.id = ae.paciente_id
where public.es_terapeuta_o_admin();

alter view public.vista_agenda_operativa set (security_invoker = true);

alter table public.solicitudes_agenda enable row level security;
alter table public.agenda_eventos enable row level security;

revoke all privileges on table public.solicitudes_agenda from public;
revoke all privileges on table public.solicitudes_agenda from anon;
revoke all privileges on table public.solicitudes_agenda from authenticated;

revoke all privileges on table public.agenda_eventos from public;
revoke all privileges on table public.agenda_eventos from anon;
revoke all privileges on table public.agenda_eventos from authenticated;

revoke all privileges on table public.vista_agenda_operativa from public;
revoke all privileges on table public.vista_agenda_operativa from anon;
revoke all privileges on table public.vista_agenda_operativa from authenticated;

grant select, insert, update on table public.solicitudes_agenda to authenticated;
grant select, insert, update on table public.agenda_eventos to authenticated;
grant select on table public.vista_agenda_operativa to authenticated;

drop policy if exists solicitudes_agenda_select_clinica on public.solicitudes_agenda;
drop policy if exists solicitudes_agenda_insert_clinica on public.solicitudes_agenda;
drop policy if exists solicitudes_agenda_update_clinica on public.solicitudes_agenda;

create policy solicitudes_agenda_select_clinica
on public.solicitudes_agenda
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy solicitudes_agenda_insert_clinica
on public.solicitudes_agenda
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy solicitudes_agenda_update_clinica
on public.solicitudes_agenda
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

drop policy if exists agenda_eventos_select_clinica on public.agenda_eventos;
drop policy if exists agenda_eventos_insert_clinica on public.agenda_eventos;
drop policy if exists agenda_eventos_update_clinica on public.agenda_eventos;

create policy agenda_eventos_select_clinica
on public.agenda_eventos
for select
to authenticated
using (public.es_terapeuta_o_admin());

create policy agenda_eventos_insert_clinica
on public.agenda_eventos
for insert
to authenticated
with check (public.es_terapeuta_o_admin());

create policy agenda_eventos_update_clinica
on public.agenda_eventos
for update
to authenticated
using (public.es_terapeuta_o_admin())
with check (public.es_terapeuta_o_admin());

comment on table public.solicitudes_agenda is
  'Solicitudes iniciales de agenda. No crean automaticamente pacientes ni consultas clinicas.';

comment on table public.agenda_eventos is
  'Eventos internos tipificados de agenda. No sincronizan Google Calendar ni Gmail por si mismos.';

comment on view public.vista_agenda_operativa is
  'Vista interna de agenda basada en agenda_eventos. No expone hallazgos, revisiones profundas, fotos ni datos financieros.';
