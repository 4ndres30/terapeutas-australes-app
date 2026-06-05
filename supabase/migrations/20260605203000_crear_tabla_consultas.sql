create table if not exists public.consultas (
                                                id_consulta uuid primary key default gen_random_uuid(),

                                                paciente_id uuid not null references public.pacientes(id)
                                                    on update cascade
                                                    on delete restrict,

                                                fecha_consulta date not null default current_date,
                                                hora_inicio time,
                                                hora_termino time,

                                                tipo_consulta text not null check (
                                                    tipo_consulta in (
                                                                      'Primera consulta',
                                                                      'Seguimiento',
                                                                      'Evaluación inicial',
                                                                      'Revisión energética',
                                                                      'Canalización',
                                                                      'Tarot',
                                                                      'Limpieza energética',
                                                                      'Control posterior',
                                                                      'Urgencia',
                                                                      'Otro'
                                                        )
                                                    ),

                                                modalidad text not null check (
                                                    modalidad in (
                                                                  'Presencial',
                                                                  'Online',
                                                                  'WhatsApp',
                                                                  'Llamada telefónica',
                                                                  'Videollamada'
                                                        )
                                                    ),

                                                estado_consulta text not null default 'Agendada' check (
                                                    estado_consulta in (
                                                                        'Agendada',
                                                                        'Realizada',
                                                                        'Pendiente',
                                                                        'Cancelada',
                                                                        'Reagendada',
                                                                        'No asistió'
                                                        )
                                                    ),

                                                motivo_consulta text not null,
                                                resumen_consulta text,
                                                observaciones_internas text,

                                                created_at timestamptz not null default now(),
                                                updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
    returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_consultas_updated_at on public.consultas;

create trigger set_consultas_updated_at
    before update on public.consultas
    for each row
execute function public.set_updated_at();

create index if not exists idx_consultas_paciente_id
    on public.consultas(paciente_id);

create index if not exists idx_consultas_fecha
    on public.consultas(fecha_consulta);