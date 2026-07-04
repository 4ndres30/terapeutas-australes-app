# UI-023 - Navegacion y superficies filtradas por rol

## Estado

Implementada local/demo / PR pendiente.

## Fecha

2026-07-03

## Rama

`ui-023-navegacion-filtrada-roles`

## Origen

- CTRL-008.
- DEC-023.
- UI-016.
- QA-005.
- QA-006B.
- SEC-007B.
- PROD-001.

## Objetivo

Corregir la observacion de QA-006B donde el menu visible mostraba enlaces no autorizados por rol aunque las rutas protegidas redirigian correctamente.

## Alcance

- Filtrar los items visibles de navegacion desde `src/App.tsx`.
- Usar el mismo filtro en sidebar desktop y drawer movil.
- Mantener guards de ruta existentes.
- Mantener Admin con navegacion transversal.
- Ocultar Finanzas al rol Terapeuta.
- Ocultar superficies clinicas y Agenda al rol Finanzas.

## Fuera de alcance

- No se modifica `.env`.
- No se modifican migraciones.
- No se toca Supabase remoto.
- No se ejecuta `supabase db push`.
- No se modifica Auth/RLS.
- No se crean usuarios.
- No se crea API publica.
- No se integra Google Calendar, Gmail ni Workspace.
- No se habilita produccion.
- No se usan datos reales, fotos reales ni pagos reales.

## Implementacion

`src/App.tsx` agrega `rolesPermitidos` a cada item de navegacion y filtra la lista con `obtenerNavegacionPorRol(usuarioInterno.rol)` antes de renderizarla.

La configuracion resultante queda asi:

| Item | Roles visibles |
| --- | --- |
| Inicio | Admin, Terapeuta, Finanzas |
| Pacientes | Admin, Terapeuta |
| Consultas | Admin, Terapeuta |
| Evaluaciones | Admin, Terapeuta |
| Casos | Admin, Terapeuta |
| Agenda | Admin, Terapeuta |
| Finanzas / Pagos | Admin, Finanzas |
| Reportes | Admin, Terapeuta, Finanzas |
| Configuracion | Admin |

## Validacion visual local/demo

Se valido en navegador integrado con identidades ficticias locales preparadas por SEC-007B. No se registraron credenciales.

| Rol | Resultado observado | Estado |
| --- | --- | --- |
| Admin desktop | Ve Inicio, Pacientes, Consultas, Evaluaciones, Casos, Agenda, Finanzas/Pagos, Reportes y Configuracion. Accede a `/agenda`. | OK |
| Terapeuta desktop | Ve Inicio, Pacientes, Consultas, Evaluaciones, Casos, Agenda y Reportes. No ve Finanzas. `/finanzas` redirige a `/pacientes`. | OK |
| Finanzas desktop | Ve Inicio, Finanzas/Pagos y Reportes. No ve Pacientes, Consultas, Evaluaciones, Casos ni Agenda. `/pacientes` y `/casos` redirigen a `/finanzas`. | OK |
| Finanzas mobile `390x844` | El drawer abre y muestra Inicio, Finanzas/Pagos y Reportes. No muestra superficies clinicas ni Agenda. | OK |

## Validaciones tecnicas

- `npm run lint`: OK.
- `npm run build`: OK, con advertencia existente de chunk Vite mayor a 500 kB.
- `git diff --check`: OK.

## Riesgos pendientes

- `PagosCasoPanel` dentro de ficha clinica sigue mencionado por CTRL-008/UI-023 como superficie sensible a revisar si se decide mostrar estado financiero minimo a Terapeuta.
- UI-023 no reemplaza RLS ni guards de ruta; solo reduce exposicion visual.
- PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

## Resultado

UI-023 queda implementada y validada local/demo para navegacion visible por rol.

La siguiente accion recomendada es preparar PR draft, revisar y luego revalidar post-merge sobre `main`.
