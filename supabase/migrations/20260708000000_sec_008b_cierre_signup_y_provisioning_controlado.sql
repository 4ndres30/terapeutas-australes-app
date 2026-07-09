-- Migration: SEC-008B - Cierre de signup y provisioning Auth controlado
-- Autor: Control de desarrollo
-- Fecha: 2026-07-08

-- Trigger function to automatically provision the internal user profile on auth.users insert.
--
-- SEGURIDAD: rol y activo NUNCA se leen de raw_user_meta_data. Ese campo lo controla
-- quien llama signUp() desde el cliente (anon key) -- confiar en el para asignar rol
-- es una escalada de privilegios directa (cualquiera podria auto-asignarse 'admin').
-- Todo usuario nuevo se provisiona SIEMPRE con el rol menos privilegiado y desactivado;
-- un admin existente debe promoverlo/activarlo manualmente (update directo a
-- usuarios_internos, unica via de escritura para esos dos campos).
create or replace function public.handle_new_auth_user()
returns trigger as $$
declare
  meta_nombre text;
begin
  -- Extract display_name/full_name (dato de presentacion, no privilegio) o fallback a email
  meta_nombre := coalesce(
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  -- Insert con rol/activo fijos, nunca derivados de metadata del cliente
  insert into public.usuarios_internos (id, email, nombre_completo, rol, activo)
  values (
    new.id,
    new.email,
    meta_nombre,
    'terapeuta',
    false
  )
  on conflict (id) do update
  set
    email = excluded.email,
    nombre_completo = excluded.nombre_completo,
    updated_at = now();
    -- rol/activo deliberadamente fuera del update: si el registro ya existia
    -- (un admin ya lo promovio/activo), un re-signup no debe poder revertirlo.

  return new;
end;
$$ language plpgsql security definer;

-- Attach the trigger to run on insert of auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
