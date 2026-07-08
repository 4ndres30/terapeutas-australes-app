-- Migration: SEC-008B - Cierre de signup y provisioning Auth controlado
-- Autor: Control de desarrollo
-- Fecha: 2026-07-08

-- Trigger function to automatically provision the internal user profile on auth.users insert
create or replace function public.handle_new_auth_user()
returns trigger as $$
declare
  meta_nombre text;
  meta_rol text;
  meta_activo boolean;
begin
  -- Extract display_name, full_name, or fallback to email localpart
  meta_nombre := coalesce(
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  -- Extract and validate role (fallback to safe 'terapeuta' role)
  meta_rol := coalesce(
    new.raw_user_meta_data->>'rol',
    new.raw_user_meta_data->>'role',
    'terapeuta'
  );

  if meta_rol not in ('admin', 'terapeuta', 'finanzas') then
    meta_rol := 'terapeuta';
  end if;

  -- Extract active status (default to true)
  meta_activo := coalesce(
    (new.raw_user_meta_data->>'activo')::boolean,
    (new.raw_user_meta_data->>'active')::boolean,
    true
  );

  -- Upsert into public.usuarios_internos
  insert into public.usuarios_internos (id, email, nombre_completo, rol, activo)
  values (
    new.id,
    new.email,
    meta_nombre,
    meta_rol,
    meta_activo
  )
  on conflict (id) do update
  set
    email = excluded.email,
    nombre_completo = excluded.nombre_completo,
    rol = excluded.rol,
    activo = excluded.activo,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

-- Attach the trigger to run on insert of auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
