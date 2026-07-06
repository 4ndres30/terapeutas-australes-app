create table if not exists public.resumenes_agenda_semanal (
  id uuid primary key default gen_random_uuid(),

  semana_inicio date not null,
  semana_fin date not null,

  contenido_resumen text not null,
  datos_agregados jsonb not null,

  generado_en timestamptz not null default now(),

  constraint resumenes_agenda_semanal_rango_semana_check
    check (semana_fin >= semana_inicio),
  constraint resumenes_agenda_semanal_contenido_resumen_check
    check (nullif(btrim(contenido_resumen), '') is not null)
);

create index if not exists idx_resumenes_agenda_semanal_semana_inicio
on public.resumenes_agenda_semanal(semana_inicio);

alter table public.resumenes_agenda_semanal enable row level security;

revoke all privileges on table public.resumenes_agenda_semanal from public;
revoke all privileges on table public.resumenes_agenda_semanal from anon;
revoke all privileges on table public.resumenes_agenda_semanal from authenticated;

grant select on table public.resumenes_agenda_semanal to authenticated;

drop policy if exists resumenes_agenda_semanal_select_clinica on public.resumenes_agenda_semanal;

create policy resumenes_agenda_semanal_select_clinica
on public.resumenes_agenda_semanal
for select
to authenticated
using (public.es_terapeuta_o_admin());

comment on table public.resumenes_agenda_semanal is
  'Resumenes ejecutivos generados por IA sobre huecos y sobrecarga de agenda. Escritura solo via service role desde la Edge Function agenda-resumen-semanal.';
