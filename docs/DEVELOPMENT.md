# Guia de desarrollo

Responsable del documento: Control de desarrollo. Fecha creacion: `2026-07-06`.

## Setup local

1. `npm install`
2. Copiar `.env.example` a `.env.local` y completar `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` con los valores que imprime `supabase status` (ver paso 3).
3. `npx supabase start` (requiere Docker Desktop corriendo). En Windows, si Docker se cierra solo, reiniciar con PowerShell: `Start-Process -FilePath "<ruta a Docker Desktop.exe>"` — el `&`/`disown` de Bash no mantiene el proceso vivo entre invocaciones de herramientas.
4. `npm run dev` — app en `http://localhost:5173`.

## Usuarios demo (SEC-007B)

Sin usuarios reales en local. Provisionar usuarios ficticios:

```powershell
$env:SUPABASE_URL = "http://127.0.0.1:54321"
$env:SUPABASE_SERVICE_ROLE_KEY = "<Secret key de `supabase status`>"
$env:QA_DEMO_PASSWORD = "<password local, no versionado>"
$env:SEC007B_ALLOW_PROVISIONING = "LOCAL_DEMO_ONLY"
npm run sec007b:provision-demo-users
Remove-Item Env:\SUPABASE_SERVICE_ROLE_KEY, Env:\QA_DEMO_PASSWORD, Env:\SEC007B_ALLOW_PROVISIONING
```

Crea `QA-DEMO-ADMIN`, `QA-DEMO-TERAPEUTA`, `QA-DEMO-FINANZAS`, `QA-DEMO-INACTIVO`, `QA-DEMO-SIN-PERFIL` (emails en `.sec007b.demo-users.local`, ignorado por git). Prohibido fuera de local/demo (DEC-029).

## Datos de prueba

`supabase/dev-seeds/caso_demo_integral.sql` crea un caso ficticio completo (paciente, consulta, evaluacion, caso, revision, hallazgo, cobro, pago). Cargar con:

```bash
docker exec -i supabase_db_<nombre-proyecto> psql -U postgres -d postgres < supabase/dev-seeds/caso_demo_integral.sql
```

Idempotente: correrlo dos veces no duplica registros.

## Crear una migracion

```bash
supabase migration new nombre_descriptivo
```

**Importante:** el archivo generado debe quedar con 14 digitos corridos (`YYYYMMDDHHMMSS_nombre.sql`), sin guion bajo entre fecha y hora. Un guion bajo ahi hace que el CLI de Supabase tome solo la fecha como version, y dos migraciones del mismo dia colisionan en `schema_migrations` (`db reset` falla con `duplicate key`). Ver LOG-081 en `docs/control/06_BITACORA_CAMBIOS.md`.

Tras editar el SQL: `npx supabase db reset` (reaplica todas las migraciones desde cero; borra usuarios demo y seed, hay que reprovisionar/recargar).

## Tests

```bash
npm test          # Vitest (unit), una vez
npm run test:watch
npm run test:coverage
npm run test:e2e   # Playwright, requiere Supabase local + usuarios demo + npm run dev
```

Para `test:e2e`, exportar `QA_DEMO_PASSWORD` (ver seccion de usuarios demo) antes de correr; los specs se saltan solos si no esta seteada.

CI (`.github/workflows/ci-quality.yml`) define `npm ci` + `lint` + `test` (unit) + `build` en cada PR y push a `main`. Al corte 2026-07-11, `CI / Quality gate` se crea, pero queda sin runner ni steps porque GitHub informa que la cuenta esta bloqueada por facturacion (QA-013); hasta resolverlo, las validaciones locales siguen siendo obligatorias. El job de E2E aun no esta en CI: requiere un Supabase completo corriendo en el runner. Por ahora, correr `npm run test:e2e` localmente antes de mergear cambios de auth/routing.

## Checklist antes de abrir PR

- [ ] `npm run lint` sin errores
- [ ] `npm run build` (`tsc -b && vite build`) sin errores
- [ ] `npm test` en verde
- [ ] Si se toco `src/lib/format.ts` u otra utilidad compartida: agregar/actualizar test unitario
- [ ] Si se agrego una migracion: nombre en 14 digitos, `supabase db reset` aplica sin error
- [ ] Sin cambios a `.env`, `.env.local`, ni a datos reales
- [ ] Documentar en `docs/control/06_BITACORA_CAMBIOS.md` si el cambio es parte de un bloque/DEC existente
