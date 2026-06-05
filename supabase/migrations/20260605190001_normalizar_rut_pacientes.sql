create or replace function public.formatear_rut_chileno(valor text)
returns text
language plpgsql
as $$
declare
  limpio text;
  cuerpo text;
  dv text;
  resultado text := '';
  contador integer := 0;
  i integer;
begin
  if valor is null or btrim(valor) = '' then
    return null;
  end if;

  limpio := upper(regexp_replace(valor, '[^0-9Kk]', '', 'g'));

  if length(limpio) < 2 then
    raise exception 'RUT inválido: %', valor;
  end if;

  cuerpo := substring(limpio from 1 for length(limpio) - 1);
  dv := substring(limpio from length(limpio) for 1);

  if cuerpo !~ '^[0-9]+$' or dv !~ '^[0-9K]$' then
    raise exception 'RUT inválido: %', valor;
  end if;

  for i in reverse length(cuerpo)..1 loop
    contador := contador + 1;
    resultado := substring(cuerpo from i for 1) || resultado;

    if contador % 3 = 0 and i > 1 then
      resultado := '.' || resultado;
    end if;
  end loop;

  return resultado || '-' || dv;
end;
$$;

create or replace function public.normalizar_rut_paciente()
returns trigger
language plpgsql
as $$
begin
  new.rut := public.formatear_rut_chileno(new.rut);
  return new;
end;
$$;

drop trigger if exists trg_normalizar_rut_paciente on public.pacientes;

create trigger trg_normalizar_rut_paciente
before insert or update of rut on public.pacientes
for each row
execute function public.normalizar_rut_paciente();

update public.pacientes
set rut = public.formatear_rut_chileno(rut)
where rut is not null and btrim(rut) <> '';