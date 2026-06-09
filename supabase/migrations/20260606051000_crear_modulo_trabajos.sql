create table if not exists public.trabajos (
  id_trabajo uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  revision_inicial_id uuid references public.revisiones(id_revision)
    on update cascade
    on delete restrict,

  revision_cierre_id uuid references public.revisiones(id_revision)
    on update cascade
    on delete restrict,

  revision_hallazgo_origen_id uuid references public.revision_hallazgos(id_revision_hallazgo)
    on update cascade
    on delete restrict,

  fecha_inicio date not null default current_date,
  fecha_estimada_cierre date,
  fecha_cierre date,

  numero_trabajo integer not null,
  nombre_trabajo text not null,

  tipo_trabajo text not null check (
    tipo_trabajo in (
      'Retiro de entidades',
      'Retiro de espíritus trascendidos',
      'Liberación de trabajo energético',
      'Desarme de trabajo energético',
      'Limpieza energética',
      'Ajuste energético',
      'Sello energético',
      'Protección energética',
      'Trabajo sobre vínculo',
      'Trabajo sobre linaje',
      'Trabajo sobre hogar/espacio',
      'Trabajo sobre terreno',
      'Trabajo sobre habitación',
      'Trabajo sobre bloqueo',
      'Integración de cuerpos sutiles',
      'Recuperación de cuerpos sutiles',
      'Liberación de cuerpos sutiles secuestrados',
      'Trabajo sobre trauma localizado',
      'Seguimiento energético',
      'Cierre energético',
      'Mixto',
      'Otro'
    )
  ),

  ambito_trabajo text not null check (
    ambito_trabajo in (
      'Persona',
      'Familia',
      'Hogar/Espacio',
      'Habitación',
      'Terreno',
      'Negocio/Lugar',
      'Vínculo',
      'Linaje',
      'Entidad/Presencia',
      'Trabajo/Bloqueo',
      'Cuerpos sutiles',
      'Trauma energético',
      'Protección/Sello',
      'Mixto',
      'Otro'
    )
  ),

  modalidad_ejecucion text not null default 'Proceso por semanas' check (
    modalidad_ejecucion in (
      'Trabajo único',
      'Proceso por semanas',
      'Seguimiento posterior',
      'Trabajo por etapas',
      'Trabajo de cierre',
      'Mixto'
    )
  ),

  fase_actual text not null default 'Planificación' check (
    fase_actual in (
      'Planificación',
      'Revisión previa',
      'Limpieza/Retiro',
      'Liberación/Desarme',
      'Ajuste energético',
      'Sellado',
      'Seguimiento',
      'Revisión posterior',
      'Cierre',
      'Pausado',
      'Anulado'
    )
  ),

  alcance_trabajo text not null check (
    alcance_trabajo in (
      'Caso completo',
      'Elementos seleccionados',
      'Grupo familiar',
      'Persona individual',
      'Hogar completo',
      'Habitación específica',
      'Terreno',
      'Seguimiento de hallazgo',
      'Seguimiento de ajuste',
      'Cierre general',
      'Otro'
    )
  ),

  metodo_principal text not null default 'Radiestesia y canalización' check (
    metodo_principal in (
      'Radiestesia',
      'Canalización',
      'Radiestesia y canalización',
      'Oración/Decreto',
      'Trabajo energético',
      'Meditación guiada',
      'Mixto',
      'Otro'
    )
  ),

  objetivo_trabajo text not null,
  descripcion_plan text,
  frecuencia_planificada text,
  dias_planificados text,
  duracion_estimada_semanas integer,

  prioridad_trabajo text not null default 'Media' check (
    prioridad_trabajo in (
      'Baja',
      'Media',
      'Alta',
      'Urgente'
    )
  ),

  porcentaje_avance_general integer not null default 0,

  requiere_revision_previa boolean not null default true,
  requiere_revision_posterior boolean not null default true,
  requiere_seguimiento boolean not null default true,

  proxima_accion text,
  resultado_general text,

  estado_trabajo text not null default 'Pendiente' check (
    estado_trabajo in (
      'Pendiente',
      'En proceso',
      'Pausado',
      'Completado',
      'Completado parcialmente',
      'Requiere seguimiento',
      'Cerrado',
      'Anulado'
    )
  ),

  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint trabajos_numero_trabajo_valido
    check (numero_trabajo > 0),

  constraint trabajos_numero_unico_por_caso
    unique (caso_id, numero_trabajo),

  constraint trabajos_porcentaje_avance_valido
    check (porcentaje_avance_general between 0 and 100),

  constraint trabajos_fechas_validas
    check (
      (fecha_estimada_cierre is null or fecha_estimada_cierre >= fecha_inicio)
      and (fecha_cierre is null or fecha_cierre >= fecha_inicio)
    ),

  constraint trabajos_duracion_valida
    check (duracion_estimada_semanas is null or duracion_estimada_semanas > 0)
);

create table if not exists public.trabajo_elementos (
  id_trabajo_elemento uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  trabajo_id uuid not null references public.trabajos(id_trabajo)
    on update cascade
    on delete cascade,

  elemento_caso_id uuid not null references public.elementos_caso(id_elemento_caso)
    on update cascade
    on delete restrict,

  revision_hallazgo_id uuid references public.revision_hallazgos(id_revision_hallazgo)
    on update cascade
    on delete restrict,

  orden_trabajo integer,

  rol_en_trabajo text not null check (
    rol_en_trabajo in (
      'Beneficiario principal',
      'Miembro familiar',
      'Hogar/Espacio',
      'Habitación',
      'Terreno',
      'Negocio/Lugar',
      'Objeto',
      'Vínculo asociado',
      'Hallazgo asociado',
      'Entidad/Presencia objetivo',
      'Elemento de apoyo',
      'Otro'
    )
  ),

  prioridad_elemento_trabajo text not null default 'Media' check (
    prioridad_elemento_trabajo in (
      'Baja',
      'Media',
      'Alta',
      'Urgente'
    )
  ),

  objetivo_elemento text,

  tipo_intervencion_prevista text check (
    tipo_intervencion_prevista is null or tipo_intervencion_prevista in (
      'Retiro de entidad',
      'Retiro de espíritu trascendido',
      'Liberación energética',
      'Desarme energético',
      'Limpieza energética',
      'Ajuste energético',
      'Sello energético',
      'Sello de daño',
      'Sello de entidades',
      'Protección',
      'Integración de cuerpos sutiles',
      'Recuperación de cuerpos sutiles',
      'Liberación de cuerpo sutil secuestrado',
      'Trabajo sobre trauma',
      'Seguimiento',
      'Otro'
    )
  ),

  estado_inicial_resumen text,
  estado_final_resumen text,
  porcentaje_avance_elemento integer not null default 0,
  requiere_seguimiento boolean not null default true,

  estado_trabajo_elemento text not null default 'Pendiente' check (
    estado_trabajo_elemento in (
      'Pendiente',
      'En proceso',
      'Trabajado',
      'Trabajado parcialmente',
      'Requiere seguimiento',
      'Cerrado',
      'Descartado',
      'No aplica'
    )
  ),

  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint trabajo_elementos_orden_valido
    check (orden_trabajo is null or orden_trabajo > 0),

  constraint trabajo_elementos_porcentaje_valido
    check (porcentaje_avance_elemento between 0 and 100),

  constraint trabajo_elementos_elemento_unico_por_trabajo
    unique (trabajo_id, elemento_caso_id)
);

create table if not exists public.trabajo_sesiones (
  id_trabajo_sesion uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  trabajo_id uuid not null references public.trabajos(id_trabajo)
    on update cascade
    on delete cascade,

  revision_previa_id uuid references public.revisiones(id_revision)
    on update cascade
    on delete restrict,

  revision_posterior_id uuid references public.revisiones(id_revision)
    on update cascade
    on delete restrict,

  fecha_sesion date not null default current_date,
  hora_inicio time,
  hora_termino time,
  numero_semana integer,
  numero_sesion integer not null,

  fase_sesion text not null check (
    fase_sesion in (
      'Revisión previa',
      'Limpieza/Retiro',
      'Liberación/Desarme',
      'Ajuste energético',
      'Sellado',
      'Protección',
      'Seguimiento',
      'Revisión posterior',
      'Cierre',
      'Mixta',
      'Otro'
    )
  ),

  tipo_sesion text not null check (
    tipo_sesion in (
      'Trabajo principal',
      'Trabajo de continuidad',
      'Ajuste posterior',
      'Seguimiento semanal',
      'Sellado',
      'Revisión de control',
      'Cierre de trabajo',
      'Urgencia',
      'Mixta',
      'Otro'
    )
  ),

  objetivo_sesion text,
  estado_previo_resumen text,
  acciones_realizadas text,
  estado_posterior_resumen text,
  resultado_sesion text,
  porcentaje_avance_sesion integer not null default 0,

  requiere_revision_posterior boolean not null default true,
  requiere_continuidad boolean not null default false,
  proxima_fecha_sugerida date,

  estado_sesion text not null default 'Planificada' check (
    estado_sesion in (
      'Planificada',
      'En proceso',
      'Realizada',
      'Realizada parcialmente',
      'Reagendada',
      'Cancelada',
      'No realizada',
      'Anulada'
    )
  ),

  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint trabajo_sesiones_numero_sesion_valido
    check (numero_sesion > 0),

  constraint trabajo_sesiones_numero_unico_por_trabajo
    unique (trabajo_id, numero_sesion),

  constraint trabajo_sesiones_numero_semana_valido
    check (numero_semana is null or numero_semana > 0),

  constraint trabajo_sesiones_porcentaje_valido
    check (porcentaje_avance_sesion between 0 and 100),

  constraint trabajo_sesiones_horario_valido
    check (hora_inicio is null or hora_termino is null or hora_termino >= hora_inicio)
);

create table if not exists public.trabajo_acciones (
  id_trabajo_accion uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  caso_id uuid not null references public.casos(id_caso)
    on update cascade
    on delete cascade,

  trabajo_id uuid not null references public.trabajos(id_trabajo)
    on update cascade
    on delete cascade,

  trabajo_sesion_id uuid not null references public.trabajo_sesiones(id_trabajo_sesion)
    on update cascade
    on delete cascade,

  trabajo_elemento_id uuid not null references public.trabajo_elementos(id_trabajo_elemento)
    on update cascade
    on delete restrict,

  elemento_caso_id uuid not null references public.elementos_caso(id_elemento_caso)
    on update cascade
    on delete restrict,

  revision_hallazgo_id uuid references public.revision_hallazgos(id_revision_hallazgo)
    on update cascade
    on delete restrict,

  orden_accion integer,

  accion_realizada text not null check (
    accion_realizada in (
      'Retiro de entidad',
      'Retiro de espíritu trascendido',
      'Retiro de presencia',
      'Liberación de trabajo energético',
      'Desarme de trabajo energético',
      'Limpieza energética',
      'Limpieza energética de persona',
      'Limpieza energética de casa',
      'Limpieza energética de habitación',
      'Limpieza energética de terreno',
      'Ajuste energético',
      'Ajuste energético posterior',
      'Sello energético',
      'Sello de daño',
      'Sello de entidades',
      'Protección energética',
      'Integración de cuerpos sutiles',
      'Recuperación de cuerpos sutiles',
      'Liberación de cuerpo sutil secuestrado',
      'Alineación energética',
      'Trabajo sobre trauma localizado',
      'Cierre energético',
      'Seguimiento energético',
      'Otro'
    )
  ),

  tipo_intervencion text not null check (
    tipo_intervencion in (
      'Retiro',
      'Liberación',
      'Desarme',
      'Limpieza',
      'Ajuste',
      'Sellado',
      'Protección',
      'Integración',
      'Recuperación',
      'Alineación',
      'Seguimiento',
      'Cierre',
      'Mixta',
      'Otro'
    )
  ),

  tipo_sello text check (
    tipo_sello is null or tipo_sello in (
      'No aplica',
      'Sello de daño',
      'Sello de entidades',
      'Sello de daño y entidades',
      'Sello de protección general',
      'Otro'
    )
  ),

  metodo_accion text check (
    metodo_accion is null or metodo_accion in (
      'Radiestesia',
      'Canalización',
      'Radiestesia y canalización',
      'Oración/Decreto',
      'Trabajo energético',
      'Meditación guiada',
      'Mixto',
      'Otro'
    )
  ),

  estado_previo_elemento text,
  estado_posterior_elemento text,
  porcentaje_avance_accion integer not null default 0,
  resultado_accion text,
  requiere_seguimiento boolean not null default false,
  informacion_canalizada text,
  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint trabajo_acciones_orden_valido
    check (orden_accion is null or orden_accion > 0),

  constraint trabajo_acciones_porcentaje_valido
    check (porcentaje_avance_accion between 0 and 100),

  constraint trabajo_acciones_accion_unica_por_orden
    unique (trabajo_sesion_id, trabajo_elemento_id, orden_accion)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_trabajos_updated_at on public.trabajos;

create trigger set_trabajos_updated_at
before update on public.trabajos
for each row
execute function public.set_updated_at();

drop trigger if exists set_trabajo_elementos_updated_at on public.trabajo_elementos;

create trigger set_trabajo_elementos_updated_at
before update on public.trabajo_elementos
for each row
execute function public.set_updated_at();

drop trigger if exists set_trabajo_sesiones_updated_at on public.trabajo_sesiones;

create trigger set_trabajo_sesiones_updated_at
before update on public.trabajo_sesiones
for each row
execute function public.set_updated_at();

drop trigger if exists set_trabajo_acciones_updated_at on public.trabajo_acciones;

create trigger set_trabajo_acciones_updated_at
before update on public.trabajo_acciones
for each row
execute function public.set_updated_at();

create or replace function public.validar_trabajo_relaciones()
returns trigger as $$
declare
  paciente_del_caso uuid;
  paciente_revision_inicial uuid;
  caso_revision_inicial uuid;
  paciente_revision_cierre uuid;
  caso_revision_cierre uuid;
  paciente_hallazgo uuid;
  caso_hallazgo uuid;
begin
  select paciente_id
  into paciente_del_caso
  from public.casos
  where id_caso = new.caso_id;

  if paciente_del_caso is null then
    raise exception 'El caso indicado no existe: %', new.caso_id;
  end if;

  if new.paciente_id <> paciente_del_caso then
    raise exception 'El paciente del trabajo (%) no coincide con el paciente del caso (%)',
      new.paciente_id,
      paciente_del_caso;
  end if;

  if new.revision_inicial_id is not null then
    select paciente_id, caso_id
    into paciente_revision_inicial, caso_revision_inicial
    from public.revisiones
    where id_revision = new.revision_inicial_id;

    if paciente_revision_inicial is null then
      raise exception 'La revisión inicial indicada no existe: %', new.revision_inicial_id;
    end if;

    if new.paciente_id <> paciente_revision_inicial or new.caso_id <> caso_revision_inicial then
      raise exception 'La revisión inicial no pertenece al mismo paciente y caso del trabajo';
    end if;
  end if;

  if new.revision_cierre_id is not null then
    select paciente_id, caso_id
    into paciente_revision_cierre, caso_revision_cierre
    from public.revisiones
    where id_revision = new.revision_cierre_id;

    if paciente_revision_cierre is null then
      raise exception 'La revisión de cierre indicada no existe: %', new.revision_cierre_id;
    end if;

    if new.paciente_id <> paciente_revision_cierre or new.caso_id <> caso_revision_cierre then
      raise exception 'La revisión de cierre no pertenece al mismo paciente y caso del trabajo';
    end if;
  end if;

  if new.revision_hallazgo_origen_id is not null then
    select paciente_id, caso_id
    into paciente_hallazgo, caso_hallazgo
    from public.revision_hallazgos
    where id_revision_hallazgo = new.revision_hallazgo_origen_id;

    if paciente_hallazgo is null then
      raise exception 'El hallazgo origen indicado no existe: %', new.revision_hallazgo_origen_id;
    end if;

    if new.paciente_id <> paciente_hallazgo or new.caso_id <> caso_hallazgo then
      raise exception 'El hallazgo origen no pertenece al mismo paciente y caso del trabajo';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function public.validar_trabajo_elemento_relaciones()
returns trigger as $$
declare
  paciente_del_trabajo uuid;
  caso_del_trabajo uuid;
  paciente_del_elemento uuid;
  caso_del_elemento uuid;
  paciente_del_hallazgo uuid;
  caso_del_hallazgo uuid;
  elemento_del_hallazgo uuid;
begin
  select paciente_id, caso_id
  into paciente_del_trabajo, caso_del_trabajo
  from public.trabajos
  where id_trabajo = new.trabajo_id;

  if paciente_del_trabajo is null then
    raise exception 'El trabajo indicado no existe: %', new.trabajo_id;
  end if;

  if new.paciente_id <> paciente_del_trabajo or new.caso_id <> caso_del_trabajo then
    raise exception 'El elemento del trabajo no coincide con el paciente y caso del trabajo';
  end if;

  select paciente_id, caso_id
  into paciente_del_elemento, caso_del_elemento
  from public.elementos_caso
  where id_elemento_caso = new.elemento_caso_id;

  if paciente_del_elemento is null then
    raise exception 'El elemento del caso indicado no existe: %', new.elemento_caso_id;
  end if;

  if new.paciente_id <> paciente_del_elemento or new.caso_id <> caso_del_elemento then
    raise exception 'El elemento del caso no pertenece al mismo paciente y caso del trabajo';
  end if;

  if new.revision_hallazgo_id is not null then
    select paciente_id, caso_id, elemento_caso_id
    into paciente_del_hallazgo, caso_del_hallazgo, elemento_del_hallazgo
    from public.revision_hallazgos
    where id_revision_hallazgo = new.revision_hallazgo_id;

    if paciente_del_hallazgo is null then
      raise exception 'El hallazgo indicado no existe: %', new.revision_hallazgo_id;
    end if;

    if new.paciente_id <> paciente_del_hallazgo or new.caso_id <> caso_del_hallazgo then
      raise exception 'El hallazgo no pertenece al mismo paciente y caso del trabajo';
    end if;

    if new.elemento_caso_id <> elemento_del_hallazgo then
      raise exception 'El hallazgo no pertenece al mismo elemento del trabajo';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function public.validar_trabajo_sesion_relaciones()
returns trigger as $$
declare
  paciente_del_trabajo uuid;
  caso_del_trabajo uuid;
  paciente_revision_previa uuid;
  caso_revision_previa uuid;
  paciente_revision_posterior uuid;
  caso_revision_posterior uuid;
begin
  select paciente_id, caso_id
  into paciente_del_trabajo, caso_del_trabajo
  from public.trabajos
  where id_trabajo = new.trabajo_id;

  if paciente_del_trabajo is null then
    raise exception 'El trabajo indicado no existe: %', new.trabajo_id;
  end if;

  if new.paciente_id <> paciente_del_trabajo or new.caso_id <> caso_del_trabajo then
    raise exception 'La sesión del trabajo no coincide con el paciente y caso del trabajo';
  end if;

  if new.revision_previa_id is not null then
    select paciente_id, caso_id
    into paciente_revision_previa, caso_revision_previa
    from public.revisiones
    where id_revision = new.revision_previa_id;

    if paciente_revision_previa is null then
      raise exception 'La revisión previa indicada no existe: %', new.revision_previa_id;
    end if;

    if new.paciente_id <> paciente_revision_previa or new.caso_id <> caso_revision_previa then
      raise exception 'La revisión previa no pertenece al mismo paciente y caso de la sesión';
    end if;
  end if;

  if new.revision_posterior_id is not null then
    select paciente_id, caso_id
    into paciente_revision_posterior, caso_revision_posterior
    from public.revisiones
    where id_revision = new.revision_posterior_id;

    if paciente_revision_posterior is null then
      raise exception 'La revisión posterior indicada no existe: %', new.revision_posterior_id;
    end if;

    if new.paciente_id <> paciente_revision_posterior or new.caso_id <> caso_revision_posterior then
      raise exception 'La revisión posterior no pertenece al mismo paciente y caso de la sesión';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function public.validar_trabajo_accion_relaciones()
returns trigger as $$
declare
  paciente_del_trabajo uuid;
  caso_del_trabajo uuid;
  paciente_de_sesion uuid;
  caso_de_sesion uuid;
  trabajo_de_sesion uuid;
  paciente_de_trabajo_elemento uuid;
  caso_de_trabajo_elemento uuid;
  trabajo_de_trabajo_elemento uuid;
  elemento_de_trabajo_elemento uuid;
  paciente_del_hallazgo uuid;
  caso_del_hallazgo uuid;
  elemento_del_hallazgo uuid;
begin
  select paciente_id, caso_id
  into paciente_del_trabajo, caso_del_trabajo
  from public.trabajos
  where id_trabajo = new.trabajo_id;

  if paciente_del_trabajo is null then
    raise exception 'El trabajo indicado no existe: %', new.trabajo_id;
  end if;

  if new.paciente_id <> paciente_del_trabajo or new.caso_id <> caso_del_trabajo then
    raise exception 'La acción no coincide con el paciente y caso del trabajo';
  end if;

  select paciente_id, caso_id, trabajo_id
  into paciente_de_sesion, caso_de_sesion, trabajo_de_sesion
  from public.trabajo_sesiones
  where id_trabajo_sesion = new.trabajo_sesion_id;

  if paciente_de_sesion is null then
    raise exception 'La sesión de trabajo indicada no existe: %', new.trabajo_sesion_id;
  end if;

  if new.paciente_id <> paciente_de_sesion or new.caso_id <> caso_de_sesion or new.trabajo_id <> trabajo_de_sesion then
    raise exception 'La sesión no pertenece al mismo paciente, caso y trabajo de la acción';
  end if;

  select paciente_id, caso_id, trabajo_id, elemento_caso_id
  into paciente_de_trabajo_elemento, caso_de_trabajo_elemento, trabajo_de_trabajo_elemento, elemento_de_trabajo_elemento
  from public.trabajo_elementos
  where id_trabajo_elemento = new.trabajo_elemento_id;

  if paciente_de_trabajo_elemento is null then
    raise exception 'El elemento de trabajo indicado no existe: %', new.trabajo_elemento_id;
  end if;

  if new.paciente_id <> paciente_de_trabajo_elemento
    or new.caso_id <> caso_de_trabajo_elemento
    or new.trabajo_id <> trabajo_de_trabajo_elemento then
    raise exception 'El elemento de trabajo no pertenece al mismo paciente, caso y trabajo de la acción';
  end if;

  if new.elemento_caso_id <> elemento_de_trabajo_elemento then
    raise exception 'El elemento del caso de la acción no coincide con el elemento del trabajo';
  end if;

  if new.revision_hallazgo_id is not null then
    select paciente_id, caso_id, elemento_caso_id
    into paciente_del_hallazgo, caso_del_hallazgo, elemento_del_hallazgo
    from public.revision_hallazgos
    where id_revision_hallazgo = new.revision_hallazgo_id;

    if paciente_del_hallazgo is null then
      raise exception 'El hallazgo indicado no existe: %', new.revision_hallazgo_id;
    end if;

    if new.paciente_id <> paciente_del_hallazgo or new.caso_id <> caso_del_hallazgo then
      raise exception 'El hallazgo no pertenece al mismo paciente y caso de la acción';
    end if;

    if new.elemento_caso_id <> elemento_del_hallazgo then
      raise exception 'El hallazgo no pertenece al mismo elemento de la acción';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_trabajos_relaciones on public.trabajos;

create trigger validar_trabajos_relaciones
before insert or update of paciente_id, caso_id, revision_inicial_id, revision_cierre_id, revision_hallazgo_origen_id on public.trabajos
for each row
execute function public.validar_trabajo_relaciones();

drop trigger if exists validar_trabajo_elementos_relaciones on public.trabajo_elementos;

create trigger validar_trabajo_elementos_relaciones
before insert or update of paciente_id, caso_id, trabajo_id, elemento_caso_id, revision_hallazgo_id on public.trabajo_elementos
for each row
execute function public.validar_trabajo_elemento_relaciones();

drop trigger if exists validar_trabajo_sesiones_relaciones on public.trabajo_sesiones;

create trigger validar_trabajo_sesiones_relaciones
before insert or update of paciente_id, caso_id, trabajo_id, revision_previa_id, revision_posterior_id on public.trabajo_sesiones
for each row
execute function public.validar_trabajo_sesion_relaciones();

drop trigger if exists validar_trabajo_acciones_relaciones on public.trabajo_acciones;

create trigger validar_trabajo_acciones_relaciones
before insert or update of paciente_id, caso_id, trabajo_id, trabajo_sesion_id, trabajo_elemento_id, elemento_caso_id, revision_hallazgo_id on public.trabajo_acciones
for each row
execute function public.validar_trabajo_accion_relaciones();

create index if not exists idx_trabajos_paciente_id
on public.trabajos(paciente_id);

create index if not exists idx_trabajos_caso_id
on public.trabajos(caso_id);

create index if not exists idx_trabajos_revision_inicial_id
on public.trabajos(revision_inicial_id);

create index if not exists idx_trabajos_revision_cierre_id
on public.trabajos(revision_cierre_id);

create index if not exists idx_trabajos_hallazgo_origen_id
on public.trabajos(revision_hallazgo_origen_id);

create index if not exists idx_trabajos_fecha_inicio
on public.trabajos(fecha_inicio);

create index if not exists idx_trabajos_estado
on public.trabajos(estado_trabajo);

create index if not exists idx_trabajos_tipo
on public.trabajos(tipo_trabajo);

create index if not exists idx_trabajos_prioridad
on public.trabajos(prioridad_trabajo);

create index if not exists idx_trabajo_elementos_paciente_id
on public.trabajo_elementos(paciente_id);

create index if not exists idx_trabajo_elementos_caso_id
on public.trabajo_elementos(caso_id);

create index if not exists idx_trabajo_elementos_trabajo_id
on public.trabajo_elementos(trabajo_id);

create index if not exists idx_trabajo_elementos_elemento_caso_id
on public.trabajo_elementos(elemento_caso_id);

create index if not exists idx_trabajo_elementos_hallazgo_id
on public.trabajo_elementos(revision_hallazgo_id);

create index if not exists idx_trabajo_elementos_estado
on public.trabajo_elementos(estado_trabajo_elemento);

create index if not exists idx_trabajo_elementos_prioridad
on public.trabajo_elementos(prioridad_elemento_trabajo);

create index if not exists idx_trabajo_elementos_trabajo_orden
on public.trabajo_elementos(trabajo_id, orden_trabajo);

create index if not exists idx_trabajo_sesiones_paciente_id
on public.trabajo_sesiones(paciente_id);

create index if not exists idx_trabajo_sesiones_caso_id
on public.trabajo_sesiones(caso_id);

create index if not exists idx_trabajo_sesiones_trabajo_id
on public.trabajo_sesiones(trabajo_id);

create index if not exists idx_trabajo_sesiones_revision_previa_id
on public.trabajo_sesiones(revision_previa_id);

create index if not exists idx_trabajo_sesiones_revision_posterior_id
on public.trabajo_sesiones(revision_posterior_id);

create index if not exists idx_trabajo_sesiones_fecha
on public.trabajo_sesiones(fecha_sesion);

create index if not exists idx_trabajo_sesiones_estado
on public.trabajo_sesiones(estado_sesion);

create index if not exists idx_trabajo_sesiones_trabajo_semana
on public.trabajo_sesiones(trabajo_id, numero_semana);

create index if not exists idx_trabajo_acciones_paciente_id
on public.trabajo_acciones(paciente_id);

create index if not exists idx_trabajo_acciones_caso_id
on public.trabajo_acciones(caso_id);

create index if not exists idx_trabajo_acciones_trabajo_id
on public.trabajo_acciones(trabajo_id);

create index if not exists idx_trabajo_acciones_sesion_id
on public.trabajo_acciones(trabajo_sesion_id);

create index if not exists idx_trabajo_acciones_trabajo_elemento_id
on public.trabajo_acciones(trabajo_elemento_id);

create index if not exists idx_trabajo_acciones_elemento_caso_id
on public.trabajo_acciones(elemento_caso_id);

create index if not exists idx_trabajo_acciones_hallazgo_id
on public.trabajo_acciones(revision_hallazgo_id);

create index if not exists idx_trabajo_acciones_tipo_intervencion
on public.trabajo_acciones(tipo_intervencion);

create index if not exists idx_trabajo_acciones_accion_realizada
on public.trabajo_acciones(accion_realizada);

create index if not exists idx_trabajo_acciones_sesion_orden
on public.trabajo_acciones(trabajo_sesion_id, orden_accion);
