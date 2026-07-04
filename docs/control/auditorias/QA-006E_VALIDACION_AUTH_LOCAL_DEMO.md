# QA-006E - Validacion Auth local/demo

## Estado

Ejecutada local/demo.

## Fecha

2026-07-03

## Rama

`qa-006e-auth-estados-local-demo`

## Origen

- QA-006.
- QA-006B.
- QA-006D.
- SEC-007B.
- SEC-008.
- SEC-008B.
- UI-024.
- PROD-001.

## Base validada

- `main` actualizado con PR #76 integrado.
- Servidor local: `http://127.0.0.1:5173`.
- Navegador integrado: disponible.
- Usuarios demo/locales: identidades ficticias preparadas por SEC-007B.
- Credenciales: leidas solo desde archivo local ignorado por Git; no se registran en documentacion.

## Objetivo

Validar estados Auth minimos visibles en local/demo, confirmando que los errores y bloqueos de acceso usan mensajes internos no tecnicos y no exponen errores crudos de Supabase, Auth, RLS ni estructura interna.

Esta pasada no modifica Auth, RLS, usuarios, perfiles, configuracion, migraciones ni base de datos.

## Casos ejecutados

| Caso | Ruta / usuario | Resultado observado | Estado |
| --- | --- | --- | --- |
| QA006E-001 | Sin sesion en `/pacientes` | Redirige a `/login`; encabezado `Acceso interno`; no muestra error tecnico. | OK |
| QA006E-002 | Credenciales invalidas | Permanece en `/login`; muestra `No se pudo iniciar sesion. Revisa tus credenciales o solicita acceso a un administrador.`; no muestra error crudo de Auth. | OK |
| QA006E-003 | Usuario demo inactivo | Permanece en `/login`; muestra `Acceso interno no habilitado. Solicita revision a un administrador.`; no muestra error tecnico. | OK |
| QA006E-004 | Usuario demo sin perfil interno | Permanece en `/login`; muestra `Acceso interno no habilitado. Solicita revision a un administrador.`; no muestra error tecnico. | OK |
| QA006E-005 | Admin demo valido | Inicia sesion y llega a `/pacientes`; encabezado `Pacientes`. | OK |

## Senales revisadas

- Los estados bloqueados no exponen texto visible de error Supabase, RLS, policy, Postgres ni estructura de `usuarios_internos`.
- Las credenciales invalidas usan mensaje generico.
- Los usuarios sin habilitacion interna usan mensaje operativo unico.
- La navegacion sin sesion no muestra shell interno.
- La sesion se limpio entre casos para aislar resultados.

## Casos no cerrados en esta pasada

- Rol invalido: no se ejecuto porque no hay fixture local versionado para un perfil con rol invalido y no se modificaron constraints ni perfiles.
- Password policy: pendiente de validar cuando SEC-008 quede aplicable tras reinicio local controlado.
- Signup/provisioning cerrado: pendiente de SEC-008B.
- Recuperacion de cuenta, MFA y estados avanzados: pendiente de UI-024.
- RLS/Storage: pendiente de fase separada para evitar mezclar Auth visual con permisos runtime.

## Restricciones respetadas

- No se modifico codigo fuente funcional.
- No se modifico `.env`.
- No se modificaron migraciones.
- No se modifico Auth/RLS.
- No se crearon usuarios.
- No se modifico `usuarios_internos`.
- No se ejecuto SQL manual.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.
- No se documentaron credenciales.

## Validaciones

- Validacion visual local/demo de estados Auth: OK.
- `git diff --check`: OK.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia existente de chunk Vite mayor a 500 kB.

## Riesgos pendientes

- QA-006 aun mantiene fase RLS/Storage local pendiente.
- SEC-008B sigue pendiente para cerrar signup/provisioning Auth controlado.
- UI-024 sigue pendiente para recuperacion de cuenta, MFA y estados Auth avanzados.
- BE-023 sigue pendiente para definir alias/codigo administrativo persistente y reducir exposicion de identificadores internos hacia Finanzas.
- BE-025 sigue pendiente para contrato de campos financieros permitidos/prohibidos.
- PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

## Resultado

QA-006E confirma local/demo que los estados Auth minimos revisados se comportan de forma controlada y con mensajes no tecnicos.

La siguiente fase recomendada de QA-006 es RLS/Storage local en bloque separado. Como tareas de menor riesgo antes de esa fase, Control recomienda cerrar primero BE-023 y BE-025 en modo documental para precisar la superficie financiera permitida.
