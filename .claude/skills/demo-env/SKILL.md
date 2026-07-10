---
name: demo-env
description: Reconstruye el ambiente demo local completo (db reset + usuarios SEC-007B + seed integral). Usar tras cualquier `supabase db reset`, al empezar QA visual, o cuando el login demo falla con "Invalid login credentials".
---

# Reconstruir ambiente demo local

Contexto: `supabase db reset` borra los usuarios demo y el seed. Sin este procedimiento, el
login falla y las paginas se ven vacias. Todo es LOCAL — jamas apuntar a Supabase remoto
(PROD-001, ver AGENTS.md).

## Pasos

1. Verificar Docker y Supabase local:
   ```bash
   docker info >/dev/null 2>&1 || echo "DOCKER CAIDO: PowerShell Start-Process 'E:\Docker\Docker\Docker Desktop.exe', esperar ~45s-3min"
   npx supabase status | grep -q "is running" || npx supabase start
   ```
2. Si el esquema puede estar desactualizado (migraciones nuevas sin aplicar): `npx supabase db reset`.
3. Provisionar usuarios demo (SEC-007B). La password es temporal de sesion — NUNCA escribirla
   en un archivo trackeado ni mostrarla en la respuesta:
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY=$(npx supabase status -o env 2>/dev/null | grep "^SERVICE_ROLE_KEY" | cut -d= -f2 | tr -d '"')
   export QA_DEMO_PASSWORD='<pedirla al usuario o generar una de 12+ chars con mayus/minus/digito y reportar cual se uso SOLO si el usuario la pide>'
   export SEC007B_ALLOW_PROVISIONING='LOCAL_DEMO_ONLY'
   npm run sec007b:provision-demo-users
   ```
4. Cargar el seed integral:
   ```bash
   docker exec -i supabase_db_terapeutas-australes-app psql -U postgres -d postgres < supabase/dev-seeds/caso_demo_integral.sql
   ```
5. Verificar (gate de salida — no reportar "listo" sin esto):
   ```bash
   docker exec -i supabase_db_terapeutas-australes-app psql -U postgres -d postgres -c "select (select count(*) from public.usuarios_internos) as usuarios, (select count(*) from public.pacientes) as pacientes;"
   ```
   Esperado: usuarios >= 3, pacientes >= 1. Si 0, revisar el output del paso 3/4 antes de seguir.

## Usuarios resultantes

`qa.demo.admin@example.test` (admin) · `qa.demo.terapeuta@example.test` (terapeuta) ·
`qa.demo.finanzas@example.test` (finanzas) — password = la QA_DEMO_PASSWORD usada en el paso 3.
