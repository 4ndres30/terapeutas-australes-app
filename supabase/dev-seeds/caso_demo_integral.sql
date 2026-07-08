begin;

do $$
declare
  v_paciente_id uuid;
  v_consulta_id uuid;
  v_evaluacion_id uuid;
  v_caso_id uuid;

  v_elemento_persona_id uuid;
  v_elemento_vinculo_id uuid;
  v_elemento_hogar_id uuid;
  v_elemento_objeto_id uuid;
  v_elemento_linaje_id uuid;

  v_revision_1_id uuid;
  v_revision_2_id uuid;

  v_revision_elemento_persona_id uuid;
  v_revision_elemento_persona_seguimiento_id uuid;
  v_revision_elemento_vinculo_id uuid;
  v_revision_elemento_hogar_id uuid;
  v_revision_elemento_objeto_id uuid;
  v_revision_elemento_linaje_id uuid;

  v_aspecto_bloqueo_id uuid;
  v_aspecto_hogar_id uuid;
  v_aspecto_objeto_id uuid;
  v_aspecto_vinculo_id uuid;
  v_aspecto_linaje_id uuid;
  v_aspecto_pendiente_id uuid;

  v_hallazgo_bloqueo_id uuid;
  v_trabajo_id uuid;
  v_cobro_id uuid;
  v_pago_id uuid;
begin
  select id
  into v_paciente_id
  from public.pacientes
  where email = 'demo.casos.integrales@example.test'
  order by created_at asc
  limit 1;

  if v_paciente_id is null then
    insert into public.pacientes (
      nombres,
      apellidos,
      fecha_nacimiento,
      sexo,
      telefono,
      email,
      comuna,
      region,
      estado
    )
    values (
      'Paciente Demo',
      'Casos Integrales',
      date '1990-04-12',
      'prefiere_no_decir',
      '+56 9 0000 0001',
      'demo.casos.integrales@example.test',
      'Comuna Demo',
      'Region Demo',
      'activo'
    )
    returning id into v_paciente_id;
  end if;

  select id_consulta
  into v_consulta_id
  from public.consultas
  where paciente_id = v_paciente_id
    and motivo_consulta = 'DATA-001 - Consulta ficticia para caso integral'
  order by created_at asc
  limit 1;

  if v_consulta_id is null then
    insert into public.consultas (
      paciente_id,
      fecha_consulta,
      hora_inicio,
      hora_termino,
      tipo_consulta,
      modalidad,
      estado_consulta,
      motivo_consulta,
      resumen_consulta,
      observaciones_internas
    )
    values (
      v_paciente_id,
      date '2026-06-10',
      time '10:00',
      time '10:45',
      'Evaluación inicial',
      'Online',
      'Realizada',
      'DATA-001 - Consulta ficticia para caso integral',
      'Consulta demo para validar el flujo desde paciente hasta caso, revisión y hallazgos.',
      'Datos ficticios locales. No representan a una persona real.'
    )
    returning id_consulta into v_consulta_id;
  end if;

  select id_evaluacion
  into v_evaluacion_id
  from public.evaluaciones
  where paciente_id = v_paciente_id
    and consulta_id = v_consulta_id
    and relato_antecedentes = 'DATA-001 - Evaluación ficticia para caso integral'
  order by created_at asc
  limit 1;

  if v_evaluacion_id is null then
    insert into public.evaluaciones (
      paciente_id,
      consulta_id,
      fecha_evaluacion,
      hora_evaluacion,
      relato_antecedentes,
      sintomas_reportados,
      hechos_clave,
      personas_mencionadas,
      decision_revision,
      fundamento_decision,
      notas_internas,
      estado_evaluacion
    )
    values (
      v_paciente_id,
      v_consulta_id,
      date '2026-06-10',
      time '11:00',
      'DATA-001 - Evaluación ficticia para caso integral',
      'Síntomas demo: cansancio inespecífico, preocupación por hogar y vínculo familiar ficticio.',
      'Hecho clave demo: se solicita revisión integral de elementos del caso.',
      'Persona Demo Vinculo, Hogar Demo, Objeto Demo y Linaje Demo.',
      'Sí requiere revisión',
      'La evaluación demo habilita una revisión completa con aspectos, hallazgos y seguimiento.',
      'Registro creado únicamente para pruebas locales DATA-001.',
      'Completada'
    )
    returning id_evaluacion into v_evaluacion_id;
  end if;

  select id_caso
  into v_caso_id
  from public.casos
  where paciente_id = v_paciente_id
    and nombre_caso = 'DATA-001 - Caso Demo Integral'
  order by created_at asc
  limit 1;

  if v_caso_id is null then
    insert into public.casos (
      paciente_id,
      consulta_id,
      evaluacion_id,
      fecha_apertura,
      hora_apertura,
      nombre_caso,
      motivo_apertura,
      descripcion_general,
      objetivo_trabajo,
      tipo_caso,
      prioridad,
      estado_caso,
      requiere_seguimiento,
      notas_seguimiento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_consulta_id,
      v_evaluacion_id,
      date '2026-06-10',
      time '11:15',
      'DATA-001 - Caso Demo Integral',
      'Validar de punta a punta el módulo Casos con datos ficticios locales.',
      'Caso demo con persona, vínculo, hogar, objeto, linaje, revisiones, aspectos, hallazgos, trabajo y finanzas.',
      'Probar navegación clínica desde el listado hasta el detalle operativo de revisión.',
      'Personal',
      'Alta',
      'En proceso',
      true,
      'Seguimiento demo pendiente para validar indicadores del caso.',
      'Creado por seed local DATA-001. No usar como dato real.'
    )
    returning id_caso into v_caso_id;
  end if;

  select id_elemento_caso
  into v_elemento_persona_id
  from public.elementos_caso
  where caso_id = v_caso_id
    and nombre_elemento = 'DATA-001 - Persona demo involucrada'
  order by created_at asc
  limit 1;

  if v_elemento_persona_id is null then
    insert into public.elementos_caso (
      paciente_id,
      caso_id,
      tipo_elemento,
      nombre_elemento,
      vinculo_con_paciente,
      rol_en_caso,
      prioridad_elemento,
      orden_elemento,
      fecha_nacimiento,
      descripcion_referencia,
      antecedentes_relevantes,
      motivo_inclusion,
      fuente_informacion,
      nivel_confirmacion,
      estado_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      'Persona',
      'DATA-001 - Persona demo involucrada',
      'Paciente demo',
      'Foco principal',
      'Alta',
      1,
      date '1990-04-12',
      'Elemento persona ficticio para validar tarjetas y filtros.',
      'Antecedente demo asociado a cansancio inespecífico.',
      'Elemento central para la revisión inicial.',
      'Evaluación',
      'Declarado por consultante',
      'Activo',
      'Elemento ficticio creado por seed local DATA-001.'
    )
    returning id_elemento_caso into v_elemento_persona_id;
  end if;

  select id_elemento_caso
  into v_elemento_vinculo_id
  from public.elementos_caso
  where caso_id = v_caso_id
    and nombre_elemento = 'DATA-001 - Vínculo demo familiar'
  order by created_at asc
  limit 1;

  if v_elemento_vinculo_id is null then
    insert into public.elementos_caso (
      paciente_id,
      caso_id,
      tipo_elemento,
      nombre_elemento,
      vinculo_con_paciente,
      rol_en_caso,
      prioridad_elemento,
      orden_elemento,
      descripcion_referencia,
      antecedentes_relevantes,
      motivo_inclusion,
      fuente_informacion,
      nivel_confirmacion,
      estado_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      'Persona',
      'DATA-001 - Vínculo demo familiar',
      'Vínculo ficticio de prueba',
      'Involucrado directo',
      'Media',
      2,
      'Representa un vínculo clínico usando tipo_elemento Persona, porque el enum no incluye Vínculo.',
      'Antecedente demo para probar área de revisión Vínculo.',
      'Permite validar aspectos asociados a vínculo sin inventar columnas ni enums.',
      'Evaluación',
      'Por confirmar',
      'En observación',
      'Vínculo ficticio creado por seed local DATA-001.'
    )
    returning id_elemento_caso into v_elemento_vinculo_id;
  end if;

  select id_elemento_caso
  into v_elemento_hogar_id
  from public.elementos_caso
  where caso_id = v_caso_id
    and nombre_elemento = 'DATA-001 - Hogar demo'
  order by created_at asc
  limit 1;

  if v_elemento_hogar_id is null then
    insert into public.elementos_caso (
      paciente_id,
      caso_id,
      tipo_elemento,
      nombre_elemento,
      rol_en_caso,
      prioridad_elemento,
      orden_elemento,
      descripcion_referencia,
      antecedentes_relevantes,
      motivo_inclusion,
      fuente_informacion,
      nivel_confirmacion,
      estado_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      'Hogar',
      'DATA-001 - Hogar demo',
      'Elemento de contexto',
      'Media',
      3,
      'Hogar ficticio para validar tipo Hogar y área Hogar/Espacio.',
      'Antecedente demo de ambiente pesado declarado en evaluación.',
      'Permite probar presencia detectada y seguimiento.',
      'Evaluación',
      'Referencial',
      'Activo',
      'Hogar ficticio creado por seed local DATA-001.'
    )
    returning id_elemento_caso into v_elemento_hogar_id;
  end if;

  select id_elemento_caso
  into v_elemento_objeto_id
  from public.elementos_caso
  where caso_id = v_caso_id
    and nombre_elemento = 'DATA-001 - Objeto demo'
  order by created_at asc
  limit 1;

  if v_elemento_objeto_id is null then
    insert into public.elementos_caso (
      paciente_id,
      caso_id,
      tipo_elemento,
      nombre_elemento,
      rol_en_caso,
      prioridad_elemento,
      orden_elemento,
      descripcion_referencia,
      motivo_inclusion,
      fuente_informacion,
      nivel_confirmacion,
      estado_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      'Objeto',
      'DATA-001 - Objeto demo',
      'Elemento en observación',
      'Baja',
      4,
      'Objeto ficticio usado para validar canalización y notas internas.',
      'Permite probar aspecto sin hallazgo y botón Crear hallazgo.',
      'Consultante',
      'Por confirmar',
      'En observación',
      'Objeto ficticio creado por seed local DATA-001.'
    )
    returning id_elemento_caso into v_elemento_objeto_id;
  end if;

  select id_elemento_caso
  into v_elemento_linaje_id
  from public.elementos_caso
  where caso_id = v_caso_id
    and nombre_elemento = 'DATA-001 - Linaje demo materno'
  order by created_at asc
  limit 1;

  if v_elemento_linaje_id is null then
    insert into public.elementos_caso (
      paciente_id,
      caso_id,
      tipo_elemento,
      nombre_elemento,
      rol_en_caso,
      prioridad_elemento,
      orden_elemento,
      descripcion_referencia,
      antecedentes_relevantes,
      motivo_inclusion,
      fuente_informacion,
      nivel_confirmacion,
      estado_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      'Otro',
      'DATA-001 - Linaje demo materno',
      'Elemento de contexto',
      'Media',
      5,
      'Representa linaje usando tipo_elemento Otro, porque el enum no incluye Linaje.',
      'Antecedente demo para validar área de revisión Linaje.',
      'Permite cubrir revisión de linaje sin inventar columnas ni constraints.',
      'Evaluación',
      'Referencial',
      'Activo',
      'Linaje ficticio creado por seed local DATA-001.'
    )
    returning id_elemento_caso into v_elemento_linaje_id;
  end if;

  select id_revision
  into v_revision_1_id
  from public.revisiones
  where caso_id = v_caso_id
    and numero_revision = 1
  order by created_at asc
  limit 1;

  if v_revision_1_id is null then
    insert into public.revisiones (
      paciente_id,
      caso_id,
      consulta_id,
      evaluacion_id,
      fecha_revision,
      hora_inicio,
      hora_termino,
      numero_revision,
      tipo_revision,
      modalidad,
      metodo_revision,
      alcance_revision,
      objetivo_revision,
      resumen_general,
      resultado_general,
      requiere_seguimiento,
      proxima_accion,
      estado_revision,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_consulta_id,
      v_evaluacion_id,
      date '2026-06-11',
      time '09:30',
      time '10:40',
      1,
      'Inicial',
      'Interna',
      'Radiestesia y canalización',
      'Caso completo',
      'Revisión demo inicial para cubrir elementos, aspectos y hallazgos.',
      'Se revisan persona, vínculo, hogar, objeto y linaje ficticios.',
      'Se detecta un bloqueo demo y quedan aspectos sin hallazgo para pruebas manuales.',
      true,
      'Crear hallazgo manual desde un aspecto sin hallazgo para validar UI.',
      'Completada',
      'Revisión ficticia creada por seed local DATA-001.'
    )
    returning id_revision into v_revision_1_id;
  end if;

  select id_revision
  into v_revision_2_id
  from public.revisiones
  where caso_id = v_caso_id
    and numero_revision = 2
  order by created_at asc
  limit 1;

  if v_revision_2_id is null then
    insert into public.revisiones (
      paciente_id,
      caso_id,
      consulta_id,
      evaluacion_id,
      fecha_revision,
      numero_revision,
      tipo_revision,
      modalidad,
      metodo_revision,
      alcance_revision,
      objetivo_revision,
      resumen_general,
      requiere_seguimiento,
      proxima_accion,
      estado_revision,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_consulta_id,
      v_evaluacion_id,
      date '2026-06-12',
      2,
      'Seguimiento',
      'Interna',
      'Radiestesia',
      'Seguimiento de pendientes',
      'Revisión demo de seguimiento para probar estado pendiente.',
      'Deja un aspecto pendiente para validar filtros y métricas.',
      true,
      'Resolver aspecto pendiente demo.',
      'Requiere seguimiento',
      'Revisión ficticia de seguimiento creada por seed local DATA-001.'
    )
    returning id_revision into v_revision_2_id;
  end if;

  select id_revision_elemento
  into v_revision_elemento_persona_id
  from public.revision_elementos
  where revision_id = v_revision_1_id
    and elemento_caso_id = v_elemento_persona_id
  limit 1;

  if v_revision_elemento_persona_id is null then
    insert into public.revision_elementos (
      paciente_id,
      caso_id,
      revision_id,
      elemento_caso_id,
      orden_revision,
      prioridad_revision,
      estado_revision_elemento,
      requiere_seguimiento,
      resumen_elemento,
      proxima_accion_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_elemento_persona_id,
      1,
      'Alta',
      'Revisado',
      true,
      'Persona demo revisada con bloqueo operativo ficticio.',
      'Usar el hallazgo existente para validar Hallazgo registrado.',
      'Vínculo revisión-elemento creado por seed local DATA-001.'
    )
    returning id_revision_elemento into v_revision_elemento_persona_id;
  end if;

  select id_revision_elemento
  into v_revision_elemento_persona_seguimiento_id
  from public.revision_elementos
  where revision_id = v_revision_2_id
    and elemento_caso_id = v_elemento_persona_id
  limit 1;

  if v_revision_elemento_persona_seguimiento_id is null then
    insert into public.revision_elementos (
      paciente_id,
      caso_id,
      revision_id,
      elemento_caso_id,
      orden_revision,
      prioridad_revision,
      estado_revision_elemento,
      requiere_seguimiento,
      resumen_elemento,
      proxima_accion_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_2_id,
      v_elemento_persona_id,
      1,
      'Media',
      'Requiere seguimiento',
      true,
      'Persona demo en revisión de seguimiento.',
      'Resolver aspecto pendiente demo.',
      'Vínculo revisión-elemento de seguimiento creado por seed local DATA-001.'
    )
    returning id_revision_elemento into v_revision_elemento_persona_seguimiento_id;
  end if;

  select id_revision_elemento
  into v_revision_elemento_vinculo_id
  from public.revision_elementos
  where revision_id = v_revision_1_id
    and elemento_caso_id = v_elemento_vinculo_id
  limit 1;

  if v_revision_elemento_vinculo_id is null then
    insert into public.revision_elementos (
      paciente_id,
      caso_id,
      revision_id,
      elemento_caso_id,
      orden_revision,
      prioridad_revision,
      estado_revision_elemento,
      requiere_seguimiento,
      resumen_elemento,
      proxima_accion_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_elemento_vinculo_id,
      2,
      'Media',
      'Revisado parcialmente',
      true,
      'Vínculo demo revisado parcialmente.',
      'Revisar si se requiere hallazgo manual.',
      'Vínculo revisión-elemento creado por seed local DATA-001.'
    )
    returning id_revision_elemento into v_revision_elemento_vinculo_id;
  end if;

  select id_revision_elemento
  into v_revision_elemento_hogar_id
  from public.revision_elementos
  where revision_id = v_revision_1_id
    and elemento_caso_id = v_elemento_hogar_id
  limit 1;

  if v_revision_elemento_hogar_id is null then
    insert into public.revision_elementos (
      paciente_id,
      caso_id,
      revision_id,
      elemento_caso_id,
      orden_revision,
      prioridad_revision,
      estado_revision_elemento,
      requiere_seguimiento,
      resumen_elemento,
      proxima_accion_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_elemento_hogar_id,
      3,
      'Media',
      'Revisado',
      true,
      'Hogar demo con presencia ficticia detectada.',
      'Crear hallazgo manual si la UI lo requiere.',
      'Vínculo revisión-elemento creado por seed local DATA-001.'
    )
    returning id_revision_elemento into v_revision_elemento_hogar_id;
  end if;

  select id_revision_elemento
  into v_revision_elemento_objeto_id
  from public.revision_elementos
  where revision_id = v_revision_1_id
    and elemento_caso_id = v_elemento_objeto_id
  limit 1;

  if v_revision_elemento_objeto_id is null then
    insert into public.revision_elementos (
      paciente_id,
      caso_id,
      revision_id,
      elemento_caso_id,
      orden_revision,
      prioridad_revision,
      estado_revision_elemento,
      requiere_seguimiento,
      resumen_elemento,
      proxima_accion_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_elemento_objeto_id,
      4,
      'Baja',
      'Revisado',
      false,
      'Objeto demo sin hallazgo inicial.',
      'Disponible para probar Crear hallazgo.',
      'Vínculo revisión-elemento creado por seed local DATA-001.'
    )
    returning id_revision_elemento into v_revision_elemento_objeto_id;
  end if;

  select id_revision_elemento
  into v_revision_elemento_linaje_id
  from public.revision_elementos
  where revision_id = v_revision_1_id
    and elemento_caso_id = v_elemento_linaje_id
  limit 1;

  if v_revision_elemento_linaje_id is null then
    insert into public.revision_elementos (
      paciente_id,
      caso_id,
      revision_id,
      elemento_caso_id,
      orden_revision,
      prioridad_revision,
      estado_revision_elemento,
      requiere_seguimiento,
      resumen_elemento,
      proxima_accion_elemento,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_elemento_linaje_id,
      5,
      'Media',
      'Revisado',
      false,
      'Linaje demo revisado sin hallazgo inicial.',
      'Disponible para validar aspectos de linaje.',
      'Vínculo revisión-elemento creado por seed local DATA-001.'
    )
    returning id_revision_elemento into v_revision_elemento_linaje_id;
  end if;

  select id_revision_aspecto
  into v_aspecto_bloqueo_id
  from public.revision_aspectos
  where revision_id = v_revision_1_id
    and revision_elemento_id = v_revision_elemento_persona_id
    and aspecto_revisado = 'DATA-001 - Bloqueo principal ficticio'
  limit 1;

  if v_aspecto_bloqueo_id is null then
    insert into public.revision_aspectos (
      paciente_id,
      caso_id,
      revision_id,
      revision_elemento_id,
      elemento_caso_id,
      orden_aspecto,
      area_revision,
      aspecto_revisado,
      metodo_revision,
      tipo_medicion,
      metrica_revision,
      valor_porcentaje,
      presencia_detectada,
      tipo_detectado,
      estado_revision_aspecto,
      resultado_aspecto,
      requiere_seguimiento,
      pendiente_revision,
      informacion_canalizada,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_revision_elemento_persona_id,
      v_elemento_persona_id,
      1,
      'Persona/Involucrado',
      'DATA-001 - Bloqueo principal ficticio',
      'Radiestesia',
      'Porcentaje',
      'Bloqueo',
      72,
      true,
      'Bloqueo demo',
      'Requiere seguimiento',
      'Bloqueo ficticio detectado con intensidad media-alta para probar hallazgo asociado.',
      true,
      false,
      'Información canalizada demo asociada al bloqueo principal.',
      'Aspecto con hallazgo precargado para validar Hallazgo registrado.',
      'Aspecto ficticio creado por seed local DATA-001.'
    )
    returning id_revision_aspecto into v_aspecto_bloqueo_id;
  end if;

  select id_revision_aspecto
  into v_aspecto_hogar_id
  from public.revision_aspectos
  where revision_id = v_revision_1_id
    and revision_elemento_id = v_revision_elemento_hogar_id
    and aspecto_revisado = 'DATA-001 - Presencia ambiental ficticia'
  limit 1;

  if v_aspecto_hogar_id is null then
    insert into public.revision_aspectos (
      paciente_id,
      caso_id,
      revision_id,
      revision_elemento_id,
      elemento_caso_id,
      orden_aspecto,
      area_revision,
      aspecto_revisado,
      metodo_revision,
      tipo_medicion,
      metrica_revision,
      presencia_detectada,
      tipo_detectado,
      estado_revision_aspecto,
      resultado_aspecto,
      requiere_seguimiento,
      pendiente_revision,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_revision_elemento_hogar_id,
      v_elemento_hogar_id,
      2,
      'Hogar/Espacio',
      'DATA-001 - Presencia ambiental ficticia',
      'Radiestesia y canalización',
      'Sí/No',
      'Presencia',
      true,
      'Presencia demo no confirmada',
      'Revisado',
      'Presencia ficticia detectada para validar medición Sí/No y presencia.',
      true,
      false,
      'Aspecto sin hallazgo para probar el botón Crear hallazgo.',
      'Aspecto ficticio creado por seed local DATA-001.'
    )
    returning id_revision_aspecto into v_aspecto_hogar_id;
  end if;

  select id_revision_aspecto
  into v_aspecto_objeto_id
  from public.revision_aspectos
  where revision_id = v_revision_1_id
    and revision_elemento_id = v_revision_elemento_objeto_id
    and aspecto_revisado = 'DATA-001 - Canalización de objeto ficticio'
  limit 1;

  if v_aspecto_objeto_id is null then
    insert into public.revision_aspectos (
      paciente_id,
      caso_id,
      revision_id,
      revision_elemento_id,
      elemento_caso_id,
      orden_aspecto,
      area_revision,
      aspecto_revisado,
      metodo_revision,
      tipo_medicion,
      metrica_revision,
      estado_revision_aspecto,
      resultado_aspecto,
      requiere_seguimiento,
      pendiente_revision,
      informacion_canalizada,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_revision_elemento_objeto_id,
      v_elemento_objeto_id,
      3,
      'Objeto',
      'DATA-001 - Canalización de objeto ficticio',
      'Canalización',
      'Texto/Canalización',
      'Estado general',
      'Revisado',
      'Objeto ficticio sin señal crítica en esta revisión demo.',
      false,
      false,
      'Mensaje demo: observar el objeto en una revisión futura si aparece información nueva.',
      'Aspecto sin hallazgo para validar creación manual desde la tarjeta.',
      'Aspecto ficticio creado por seed local DATA-001.'
    )
    returning id_revision_aspecto into v_aspecto_objeto_id;
  end if;

  select id_revision_aspecto
  into v_aspecto_vinculo_id
  from public.revision_aspectos
  where revision_id = v_revision_1_id
    and revision_elemento_id = v_revision_elemento_vinculo_id
    and aspecto_revisado = 'DATA-001 - Estado de vínculo ficticio'
  limit 1;

  if v_aspecto_vinculo_id is null then
    insert into public.revision_aspectos (
      paciente_id,
      caso_id,
      revision_id,
      revision_elemento_id,
      elemento_caso_id,
      orden_aspecto,
      area_revision,
      aspecto_revisado,
      metodo_revision,
      tipo_medicion,
      metrica_revision,
      valor_porcentaje,
      estado_revision_aspecto,
      resultado_aspecto,
      requiere_seguimiento,
      pendiente_revision,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_revision_elemento_vinculo_id,
      v_elemento_vinculo_id,
      4,
      'Vínculo',
      'DATA-001 - Estado de vínculo ficticio',
      'Radiestesia',
      'Mixto',
      'Estabilidad',
      48,
      'Revisado parcialmente',
      'Vínculo ficticio con estabilidad media para validar medición mixta.',
      true,
      false,
      'Aspecto sin hallazgo precargado para probar creación manual si se decide.',
      'Aspecto ficticio creado por seed local DATA-001.'
    )
    returning id_revision_aspecto into v_aspecto_vinculo_id;
  end if;

  select id_revision_aspecto
  into v_aspecto_linaje_id
  from public.revision_aspectos
  where revision_id = v_revision_1_id
    and revision_elemento_id = v_revision_elemento_linaje_id
    and aspecto_revisado = 'DATA-001 - Lectura de linaje ficticio'
  limit 1;

  if v_aspecto_linaje_id is null then
    insert into public.revision_aspectos (
      paciente_id,
      caso_id,
      revision_id,
      revision_elemento_id,
      elemento_caso_id,
      orden_aspecto,
      area_revision,
      aspecto_revisado,
      metodo_revision,
      tipo_medicion,
      metrica_revision,
      estado_revision_aspecto,
      resultado_aspecto,
      requiere_seguimiento,
      pendiente_revision,
      informacion_canalizada,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_revision_elemento_linaje_id,
      v_elemento_linaje_id,
      5,
      'Linaje',
      'DATA-001 - Lectura de linaje ficticio',
      'Canalización',
      'Texto/Canalización',
      'Estado general',
      'Revisado',
      'Lectura demo de linaje sin hallazgo operativo inicial.',
      false,
      false,
      'Información canalizada demo para validar texto largo en detalle de revisión.',
      'Aspecto sin hallazgo para conservar variedad de estados.',
      'Aspecto ficticio creado por seed local DATA-001.'
    )
    returning id_revision_aspecto into v_aspecto_linaje_id;
  end if;

  select id_revision_aspecto
  into v_aspecto_pendiente_id
  from public.revision_aspectos
  where revision_id = v_revision_2_id
    and elemento_caso_id = v_elemento_persona_id
    and aspecto_revisado = 'DATA-001 - Seguimiento pendiente ficticio'
  limit 1;

  if v_aspecto_pendiente_id is null then
    insert into public.revision_aspectos (
      paciente_id,
      caso_id,
      revision_id,
      revision_elemento_id,
      elemento_caso_id,
      orden_aspecto,
      area_revision,
      aspecto_revisado,
      metodo_revision,
      tipo_medicion,
      metrica_revision,
      estado_revision_aspecto,
      resultado_aspecto,
      requiere_seguimiento,
      pendiente_revision,
      motivo_pendiente,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_2_id,
      v_revision_elemento_persona_seguimiento_id,
      v_elemento_persona_id,
      1,
      'Persona/Involucrado',
      'DATA-001 - Seguimiento pendiente ficticio',
      'Radiestesia',
      'No aplica',
      'Estado general',
      'Pendiente',
      'Aspecto pendiente para validar métricas de seguimiento.',
      true,
      true,
      'Se deja pendiente de forma intencional para pruebas manuales.',
      'Aspecto sin hallazgo en revisión de seguimiento.',
      'Aspecto ficticio creado por seed local DATA-001.'
    )
    returning id_revision_aspecto into v_aspecto_pendiente_id;
  end if;

  select id_revision_hallazgo
  into v_hallazgo_bloqueo_id
  from public.revision_hallazgos
  where revision_aspecto_id = v_aspecto_bloqueo_id
  order by created_at asc
  limit 1;

  if v_hallazgo_bloqueo_id is null then
    insert into public.revision_hallazgos (
      paciente_id,
      caso_id,
      revision_id,
      revision_elemento_id,
      revision_aspecto_id,
      elemento_caso_id,
      categoria_hallazgo,
      tipo_hallazgo,
      subtipo_hallazgo,
      descripcion_hallazgo,
      intensidad_hallazgo_porcentaje,
      nivel_bloqueo_porcentaje,
      origen_sugerido,
      fuente_deteccion,
      nivel_confirmacion,
      requiere_seguimiento,
      prioridad_hallazgo,
      estado_hallazgo,
      informacion_canalizada,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_revision_elemento_persona_id,
      v_aspecto_bloqueo_id,
      v_elemento_persona_id,
      'Bloqueo',
      'Bloqueo demo operacional',
      'Ficticio local',
      'Hallazgo demo asociado al aspecto de bloqueo para probar Hallazgo registrado y Ver hallazgo.',
      68,
      72,
      'Origen ficticio definido para pruebas locales',
      'Radiestesia',
      'Detectado',
      true,
      'Alta',
      'Activo',
      'Información canalizada demo asociada al hallazgo.',
      'Este hallazgo existe para validar la prevención visual de duplicados.',
      'Hallazgo ficticio creado por seed local DATA-001.'
    )
    returning id_revision_hallazgo into v_hallazgo_bloqueo_id;
  end if;

  select id_trabajo
  into v_trabajo_id
  from public.trabajos
  where caso_id = v_caso_id
    and numero_trabajo = 1
  order by created_at asc
  limit 1;

  if v_trabajo_id is null then
    insert into public.trabajos (
      paciente_id,
      caso_id,
      revision_inicial_id,
      revision_hallazgo_origen_id,
      fecha_inicio,
      fecha_estimada_cierre,
      numero_trabajo,
      nombre_trabajo,
      tipo_trabajo,
      ambito_trabajo,
      modalidad_ejecucion,
      fase_actual,
      alcance_trabajo,
      metodo_principal,
      objetivo_trabajo,
      descripcion_plan,
      frecuencia_planificada,
      duracion_estimada_semanas,
      prioridad_trabajo,
      porcentaje_avance_general,
      requiere_revision_previa,
      requiere_revision_posterior,
      requiere_seguimiento,
      proxima_accion,
      estado_trabajo,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      v_caso_id,
      v_revision_1_id,
      v_hallazgo_bloqueo_id,
      date '2026-06-13',
      date '2026-07-04',
      1,
      'DATA-001 - Trabajo demo de seguimiento',
      'Seguimiento energético',
      'Persona',
      'Proceso por semanas',
      'Planificación',
      'Seguimiento de hallazgo',
      'Radiestesia y canalización',
      'Trabajo ficticio mínimo para probar el panel de trabajos del caso.',
      'Plan demo no operativo. No fue creado automáticamente por la app.',
      'Semanal demo',
      3,
      'Media',
      20,
      true,
      true,
      true,
      'Revisar avance demo en próxima revisión local.',
      'En proceso',
      'Trabajo demo asociado al hallazgo para validar lectura del panel.',
      'Trabajo ficticio creado por seed local DATA-001.'
    )
    returning id_trabajo into v_trabajo_id;
  end if;

  select id_cobro
  into v_cobro_id
  from public.cobros
  where paciente_id = v_paciente_id
    and caso_id = v_caso_id
    and concepto_cobro = 'DATA-001 - Cobro demo revisión integral'
  order by created_at asc
  limit 1;

  if v_cobro_id is null then
    insert into public.cobros (
      paciente_id,
      consulta_id,
      evaluacion_id,
      caso_id,
      revision_id,
      trabajo_id,
      fecha_cobro,
      fecha_vencimiento,
      concepto_cobro,
      tipo_cobro,
      descripcion_cobro,
      monto_cobro,
      monto_descuento,
      moneda,
      estado_cobro,
      observaciones,
      notas_internas
    )
    values (
      v_paciente_id,
      null, -- consulta_id
      null, -- evaluacion_id
      v_caso_id,
      v_revision_1_id,
      null, -- trabajo_id
      date '2026-06-13',
      date '2026-06-30',
      'DATA-001 - Cobro demo revisión integral',
      'Revisión',
      'Cobro ficticio para validar panel de pagos del caso.',
      45000,
      5000,
      'CLP',
      'Pendiente',
      'Cobro demo con pago parcial.',
      'Cobro ficticio creado por seed local DATA-001.'
    )
    returning id_cobro into v_cobro_id;
  end if;

  select id_pago
  into v_pago_id
  from public.pagos
  where cobro_id = v_cobro_id
    and referencia_pago = 'DATA-001-PAGO-DEMO-001'
  order by created_at asc
  limit 1;

  if v_pago_id is null then
    insert into public.pagos (
      cobro_id,
      paciente_id,
      fecha_pago,
      hora_pago,
      monto_pago,
      moneda,
      metodo_pago,
      estado_pago,
      referencia_pago,
      recibido_por,
      observaciones,
      notas_internas
    )
    values (
      v_cobro_id,
      v_paciente_id,
      date '2026-06-13',
      time '12:00',
      20000,
      'CLP',
      'Transferencia',
      'Confirmado',
      'DATA-001-PAGO-DEMO-001',
      'Operador demo',
      'Pago parcial ficticio para validar saldo pendiente.',
      'Pago ficticio creado por seed local DATA-001.'
    )
    returning id_pago into v_pago_id;
  end if;

  raise notice 'DATA-001 seed local listo. Paciente %, caso %, revision %, hallazgo %',
    v_paciente_id,
    v_caso_id,
    v_revision_1_id,
    v_hallazgo_bloqueo_id;
end $$;

commit;
