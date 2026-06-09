create table if not exists public.cobros (
  id_cobro uuid primary key default gen_random_uuid(),

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  consulta_id uuid references public.consultas(id_consulta)
    on update cascade
    on delete restrict,

  caso_id uuid references public.casos(id_caso)
    on update cascade
    on delete restrict,

  trabajo_id uuid references public.trabajos(id_trabajo)
    on update cascade
    on delete restrict,

  fecha_cobro date not null default current_date,
  fecha_vencimiento date,

  concepto_cobro text not null,

  tipo_cobro text not null check (
    tipo_cobro in (
      'Consulta',
      'Evaluación',
      'Revisión',
      'Trabajo energético',
      'Seguimiento',
      'Pack/Sesiones',
      'Producto',
      'Otro'
    )
  ),

  descripcion_cobro text,

  monto_cobro numeric(12, 2) not null,
  monto_descuento numeric(12, 2) not null default 0,
  monto_total numeric(12, 2) generated always as (monto_cobro - monto_descuento) stored,

  moneda text not null default 'CLP' check (
    moneda in (
      'CLP',
      'USD',
      'Otro'
    )
  ),

  estado_cobro text not null default 'Pendiente' check (
    estado_cobro in (
      'Pendiente',
      'Parcial',
      'Pagado',
      'Vencido',
      'Anulado',
      'Condonado'
    )
  ),

  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint cobros_monto_cobro_valido
    check (monto_cobro > 0),

  constraint cobros_descuento_valido
    check (monto_descuento >= 0 and monto_descuento <= monto_cobro),

  constraint cobros_fecha_vencimiento_valida
    check (fecha_vencimiento is null or fecha_vencimiento >= fecha_cobro)
);

create table if not exists public.pagos (
  id_pago uuid primary key default gen_random_uuid(),

  cobro_id uuid not null references public.cobros(id_cobro)
    on update cascade
    on delete restrict,

  paciente_id uuid not null references public.pacientes(id)
    on update cascade
    on delete restrict,

  fecha_pago date not null default current_date,
  hora_pago time not null default localtime,

  monto_pago numeric(12, 2) not null,

  moneda text not null default 'CLP' check (
    moneda in (
      'CLP',
      'USD',
      'Otro'
    )
  ),

  metodo_pago text not null check (
    metodo_pago in (
      'Efectivo',
      'Transferencia',
      'Tarjeta de débito',
      'Tarjeta de crédito',
      'Webpay',
      'Mercado Pago',
      'Otro'
    )
  ),

  estado_pago text not null default 'Registrado' check (
    estado_pago in (
      'Registrado',
      'Pendiente de confirmación',
      'Confirmado',
      'Rechazado',
      'Anulado',
      'Devuelto'
    )
  ),

  referencia_pago text,
  comprobante_url text,
  recibido_por text,

  observaciones text,
  notas_internas text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint pagos_monto_pago_valido
    check (monto_pago > 0)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_cobros_updated_at on public.cobros;

create trigger set_cobros_updated_at
before update on public.cobros
for each row
execute function public.set_updated_at();

drop trigger if exists set_pagos_updated_at on public.pagos;

create trigger set_pagos_updated_at
before update on public.pagos
for each row
execute function public.set_updated_at();

create or replace function public.validar_cobro_relaciones()
returns trigger as $$
declare
  paciente_de_consulta uuid;
  paciente_del_caso uuid;
  paciente_del_trabajo uuid;
  caso_del_trabajo uuid;
begin
  if new.consulta_id is not null then
    select paciente_id
    into paciente_de_consulta
    from public.consultas
    where id_consulta = new.consulta_id;

    if paciente_de_consulta is null then
      raise exception 'La consulta indicada no existe: %', new.consulta_id;
    end if;

    if new.paciente_id <> paciente_de_consulta then
      raise exception 'El paciente del cobro (%) no coincide con el paciente de la consulta (%)',
        new.paciente_id,
        paciente_de_consulta;
    end if;
  end if;

  if new.caso_id is not null then
    select paciente_id
    into paciente_del_caso
    from public.casos
    where id_caso = new.caso_id;

    if paciente_del_caso is null then
      raise exception 'El caso indicado no existe: %', new.caso_id;
    end if;

    if new.paciente_id <> paciente_del_caso then
      raise exception 'El paciente del cobro (%) no coincide con el paciente del caso (%)',
        new.paciente_id,
        paciente_del_caso;
    end if;
  end if;

  if new.trabajo_id is not null then
    select paciente_id, caso_id
    into paciente_del_trabajo, caso_del_trabajo
    from public.trabajos
    where id_trabajo = new.trabajo_id;

    if paciente_del_trabajo is null then
      raise exception 'El trabajo indicado no existe: %', new.trabajo_id;
    end if;

    if new.paciente_id <> paciente_del_trabajo then
      raise exception 'El paciente del cobro (%) no coincide con el paciente del trabajo (%)',
        new.paciente_id,
        paciente_del_trabajo;
    end if;

    if new.caso_id is null then
      new.caso_id = caso_del_trabajo;
    elsif new.caso_id <> caso_del_trabajo then
      raise exception 'El caso del cobro (%) no coincide con el caso del trabajo (%)',
        new.caso_id,
        caso_del_trabajo;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function public.validar_pago_relaciones()
returns trigger as $$
declare
  paciente_del_cobro uuid;
  moneda_del_cobro text;
  total_cobro numeric(12, 2);
  total_pagado numeric(12, 2);
begin
  select paciente_id, moneda, monto_total
  into paciente_del_cobro, moneda_del_cobro, total_cobro
  from public.cobros
  where id_cobro = new.cobro_id;

  if paciente_del_cobro is null then
    raise exception 'El cobro indicado no existe: %', new.cobro_id;
  end if;

  if new.paciente_id <> paciente_del_cobro then
    raise exception 'El paciente del pago (%) no coincide con el paciente del cobro (%)',
      new.paciente_id,
      paciente_del_cobro;
  end if;

  if new.moneda <> moneda_del_cobro then
    raise exception 'La moneda del pago (%) no coincide con la moneda del cobro (%)',
      new.moneda,
      moneda_del_cobro;
  end if;

  if new.estado_pago in ('Registrado', 'Confirmado') then
    select coalesce(sum(monto_pago), 0)
    into total_pagado
    from public.pagos
    where cobro_id = new.cobro_id
      and estado_pago in ('Registrado', 'Confirmado')
      and (tg_op = 'INSERT' or id_pago <> old.id_pago);

    if total_pagado + new.monto_pago > total_cobro then
      raise exception 'El pago supera el saldo pendiente del cobro. Total cobro: %, pagado previamente: %, pago nuevo: %',
        total_cobro,
        total_pagado,
        new.monto_pago;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function public.actualizar_estado_cobro(p_cobro_id uuid)
returns void as $$
declare
  total_cobro numeric(12, 2);
  total_pagado numeric(12, 2);
  estado_actual text;
begin
  select monto_total, estado_cobro
  into total_cobro, estado_actual
  from public.cobros
  where id_cobro = p_cobro_id;

  if total_cobro is null then
    return;
  end if;

  if estado_actual in ('Anulado', 'Condonado') then
    return;
  end if;

  select coalesce(sum(monto_pago), 0)
  into total_pagado
  from public.pagos
  where cobro_id = p_cobro_id
    and estado_pago in ('Registrado', 'Confirmado');

  update public.cobros
  set estado_cobro = case
    when total_pagado <= 0 then 'Pendiente'
    when total_pagado < total_cobro then 'Parcial'
    else 'Pagado'
  end,
  updated_at = now()
  where id_cobro = p_cobro_id;
end;
$$ language plpgsql;

create or replace function public.actualizar_estado_cobro_desde_pago()
returns trigger as $$
begin
  if tg_op = 'DELETE' then
    perform public.actualizar_estado_cobro(old.cobro_id);
    return old;
  end if;

  perform public.actualizar_estado_cobro(new.cobro_id);

  if tg_op = 'UPDATE' and old.cobro_id <> new.cobro_id then
    perform public.actualizar_estado_cobro(old.cobro_id);
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists validar_cobros_relaciones on public.cobros;

create trigger validar_cobros_relaciones
before insert or update of paciente_id, consulta_id, caso_id, trabajo_id on public.cobros
for each row
execute function public.validar_cobro_relaciones();

drop trigger if exists validar_pagos_relaciones on public.pagos;

create trigger validar_pagos_relaciones
before insert or update of cobro_id, paciente_id, monto_pago, moneda, estado_pago on public.pagos
for each row
execute function public.validar_pago_relaciones();

drop trigger if exists actualizar_cobros_estado_desde_pagos on public.pagos;

create trigger actualizar_cobros_estado_desde_pagos
after insert or update or delete on public.pagos
for each row
execute function public.actualizar_estado_cobro_desde_pago();

create or replace view public.vista_cobros_estado as
select
  c.id_cobro,
  c.paciente_id,
  c.consulta_id,
  c.caso_id,
  c.trabajo_id,
  c.fecha_cobro,
  c.fecha_vencimiento,
  c.concepto_cobro,
  c.tipo_cobro,
  c.monto_cobro,
  c.monto_descuento,
  c.monto_total,
  c.moneda,
  c.estado_cobro,
  coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) as monto_pagado,
  c.monto_total - coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) as saldo_pendiente,
  case
    when c.estado_cobro in ('Anulado', 'Condonado') then c.estado_cobro
    when coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) <= 0 then 'Pendiente'
    when coalesce(sum(p.monto_pago) filter (where p.estado_pago in ('Registrado', 'Confirmado')), 0) < c.monto_total then 'Parcial'
    else 'Pagado'
  end as estado_calculado
from public.cobros c
left join public.pagos p on p.cobro_id = c.id_cobro
group by c.id_cobro;

create index if not exists idx_cobros_paciente_id
on public.cobros(paciente_id);

create index if not exists idx_cobros_consulta_id
on public.cobros(consulta_id);

create index if not exists idx_cobros_caso_id
on public.cobros(caso_id);

create index if not exists idx_cobros_trabajo_id
on public.cobros(trabajo_id);

create index if not exists idx_cobros_fecha_cobro
on public.cobros(fecha_cobro);

create index if not exists idx_cobros_fecha_vencimiento
on public.cobros(fecha_vencimiento);

create index if not exists idx_cobros_estado
on public.cobros(estado_cobro);

create index if not exists idx_cobros_tipo
on public.cobros(tipo_cobro);

create index if not exists idx_pagos_cobro_id
on public.pagos(cobro_id);

create index if not exists idx_pagos_paciente_id
on public.pagos(paciente_id);

create index if not exists idx_pagos_fecha_pago
on public.pagos(fecha_pago);

create index if not exists idx_pagos_metodo
on public.pagos(metodo_pago);

create index if not exists idx_pagos_estado
on public.pagos(estado_pago);
