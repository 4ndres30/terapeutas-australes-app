alter table public.revision_aspectos
  drop constraint if exists revision_aspectos_area_revision_check;

alter table public.revision_aspectos
  add constraint revision_aspectos_area_revision_check
  check (
    area_revision in (
      'Persona/Involucrado',
      'Hogar/Espacio',
      'Negocio/Lugar',
      'Objeto',
      'Vínculo',
      'Linaje',
      'Cuerpo físico',
      'Cuerpo energético',
      'Cuerpo emocional',
      'Cuerpo mental',
      'Cuerpo espiritual',
      'Cuerpos sutiles',
      'Campo energético',
      'Trauma energético',
      'Entidad/Presencia',
      'Trabajo/Bloqueo',
      'Protección',
      'Abundancia',
      'Otro'
    )
  );

alter table public.revision_aspectos
  drop constraint if exists revision_aspectos_metrica_revision_check;

alter table public.revision_aspectos
  add constraint revision_aspectos_metrica_revision_check
  check (
    metrica_revision is null or metrica_revision in (
      'Estabilidad',
      'Bloqueo',
      'Presencia',
      'Abundancia',
      'Protección',
      'Intensidad',
      'Estado general',
      'Separación',
      'Retraimiento',
      'Aislamiento',
      'Secuestro',
      'Integración',
      'Alineación',
      'Localización',
      'Otro'
    )
  );

alter table public.revision_hallazgos
  drop constraint if exists revision_hallazgos_categoria_hallazgo_check;

alter table public.revision_hallazgos
  add constraint revision_hallazgos_categoria_hallazgo_check
  check (
    categoria_hallazgo in (
      'Cuerpo inestable',
      'Bloqueo',
      'Trabajo energético',
      'Magia negra',
      'Entidad/Presencia',
      'Abundancia afectada',
      'Protección debilitada',
      'Vínculo afectado',
      'Linaje afectado',
      'Hogar/Espacio afectado',
      'Cuerpo sutil alterado',
      'Cuerpo sutil separado',
      'Cuerpo sutil retraído',
      'Cuerpo sutil aislado',
      'Cuerpo sutil secuestrado',
      'Trauma localizado',
      'Desalineación energética',
      'Información canalizada',
      'Otro'
    )
  );
