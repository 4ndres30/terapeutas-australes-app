---
name: verificar-rls
description: Verifica una tabla/vista/policy de Supabase simulando el rol REAL (terapeuta/admin/finanzas/anon), no como superusuario. Usar SIEMPRE antes de dar por buena una migracion con RLS, una vista nueva, o un cambio de policy — y al investigar "no veo datos" o "el update no hace nada".
---

# Verificar RLS con rol real

Regla del proyecto (2 bugs reales la originaron, ver DEC-042 y FASE1-BARRIDO-2026-07-08):
**leer el SQL no alcanza; el service role bypasea RLS y esconde exactamente los bugs que
buscas.** Probar siempre como el rol que va a usar la funcionalidad.

## Gotchas conocidos (revisar ANTES de diagnosticar)

- **Vista sin `security_invoker = true` corre como owner y bypasea RLS** de las tablas base.
  Toda vista nueva del proyecto lo lleva + `revoke` explicito + `grant select` (patron:
  `20260706000001_crear_vista_riesgo_abandono_casos.sql`).
- **UPDATE sin policy SELECT devuelve 0 filas EN SILENCIO** — sin error. Si un update "no
  hace nada", verificar que el rol tenga policy SELECT sobre esas filas.
- **Policy sin GRANT es inerte**: Postgres corta por privilegios antes de evaluar la policy
  (bug real: DELETE policies inertes hasta PR #113). Verificar `role_table_grants`, no solo
  `pg_policy`.
- **RLS de `cobros` es solo finanzas/admin**: una vista `security_invoker` que la necesite
  para terapeuta requiere funcion `security definer` acotada (patron:
  `caso_tiene_cobro_vencido`).

## Procedimiento

1. Crear usuario de prueba con el rol a verificar (si no existe uno demo; limpiar al final):
   ```sql
   insert into auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,created_at,updated_at,confirmation_token,recovery_token,raw_app_meta_data,raw_user_meta_data)
   values ('00000000-0000-0000-0000-000000000000','<uuid>','authenticated','authenticated','rls.test@example.test','',now(),now(),now(),'','','{}','{}');
   -- el trigger provisiona rol='terapeuta' activo=false; ajustar:
   update public.usuarios_internos set rol='<rol>', activo=true where id='<uuid>';
   ```
2. Ejecutar la consulta bajo el rol real (via `docker exec -i supabase_db_... psql -U postgres -d postgres`):
   ```sql
   begin;
   set local request.jwt.claims = '{"sub":"<uuid>","role":"authenticated"}';
   set local role authenticated;
   -- aqui el SELECT/INSERT/UPDATE/DELETE a verificar
   rollback; -- o commit si el efecto es parte de la prueba
   ```
3. Probar tambien el caso NEGATIVO (el rol que NO debe ver/poder): un resultado vacio para
   el rol correcto es tan importante como el resultado lleno para el autorizado. Para anon:
   `set local role anon;` sin claims.
4. Chequeos estructurales rapidos:
   ```sql
   select relname, reloptions from pg_class where relname='<vista>';                  -- security_invoker?
   select privilege_type from information_schema.role_table_grants where table_name='<tabla>' and grantee='authenticated';
   select polname, pg_get_expr(polqual, polrelid) from pg_policy where polrelid='public.<tabla>'::regclass;
   ```
5. Limpiar los datos de prueba (usuario, filas sinteticas) y reportar: que rol se simulo,
   que se esperaba, que se obtuvo, con el SQL exacto usado.
