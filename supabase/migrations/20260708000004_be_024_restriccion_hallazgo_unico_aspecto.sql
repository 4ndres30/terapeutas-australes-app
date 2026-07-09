-- Migración: Restricción de hallazgo único activo por aspecto de revisión
-- Tarea: BE-024

create unique index if not exists idx_unique_activo_por_aspecto
on public.revision_hallazgos (revision_aspecto_id)
where estado_hallazgo not in ('Cerrado', 'Descartado');
