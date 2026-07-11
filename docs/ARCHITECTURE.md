# Arquitectura de Terapeutas Australes App

Responsable del documento: Control de desarrollo. Fecha creacion: `2026-07-06`.

Este documento describe el estado real del codigo, no un diseño aspiracional. Si algo aqui no coincide con el codigo, confiar en el codigo y corregir este archivo.

## Stack

React 19 + Vite + TypeScript, sin backend propio: Supabase (Postgres + Auth + RLS + Storage) es la unica capa de servidor. Sin SSR.

## Estructura de carpetas

- `src/pages/` — un componente por ruta. Varias superan las 900 lineas (`AgendaPage.tsx`, `CasosPage.tsx`, `PacientesPage.tsx`) porque cada pagina gestiona su propio estado de formulario, listado y validacion sin dividir en subcomponentes.
- `src/pages/casos/` — subcomponentes especificos del detalle de un caso (`ElementosCasoPanel`, `RevisionesCasoPanel`, `DetalleRevisionesPanel`, `TrabajosCasoPanel`, `PagosCasoPanel`), montados como pestañas dentro de `CasoDetallePage`.
- `src/context/` — `AuthContext.tsx`/`authTypes.ts`: unico contexto del proyecto. Centraliza `estadoAuth`/`session`/`usuarioInterno`/`cerrarSesion`, consumido via `useAuth()`. Expone solo estado de lectura, no setters.
- `src/hooks/` — `useRevisionHallazgos.ts` es el unico hook custom compartido.
- `src/lib/` — `supabase.ts` (cliente), `format.ts` (formatters compartidos: `formatearFecha`, `normalizarTexto`, `textoCorto`, `aNumero`, `formatearMoneda`, `obtenerInicialesNombre`), `constants.ts` (roles/estados/validaciones derivados de los CHECK constraints reales), `queries.ts` (catalogo de referencia de columnas `*_SELECT`, no consumido automaticamente por todas las paginas: cada pagina puede seguir manteniendo su propia constante local si su proyeccion difiere).
- `supabase/migrations/` — SQL versionado. Convencion de nombre: 14 digitos corridos `YYYYMMDDHHMMSS_descripcion.sql`, sin guion bajo entre fecha y hora (un guion bajo ahi rompe el parseo de version del CLI de Supabase — ver LOG-081 en `06_BITACORA_CAMBIOS.md`).
- `supabase/dev-seeds/` — `caso_demo_integral.sql`, datos ficticios para validar el flujo de Casos end-to-end en local.
- `docs/control/` — centro documental: decisiones (`05_DECISIONES_PROYECTO.md`), pendientes (`01_PENDIENTES_PROYECTO.md`), bitacora (`06_BITACORA_CAMBIOS.md`).

## Autenticacion y autorizacion

`AuthContext` escucha `supabase.auth.onAuthStateChange` y resuelve el perfil interno consultando `usuarios_internos` por `id`. Estados posibles: `cargando | sin_sesion | autorizado | sin_autorizacion | inactivo | error`. `App.tsx` usa un componente `RutaProtegida` por ruta que redirige a `/login` o a la ruta por defecto del rol si el usuario no tiene permiso.

Autorizacion real de datos vive en RLS (Postgres), no en el frontend: las funciones `es_admin()`, `es_terapeuta_o_admin()`, `es_finanzas_o_admin()` (definidas en `20260606055000_activar_rls_y_policies.sql`) son la fuente de verdad. El frontend solo oculta UI por rol; nunca asumir que ocultar un boton es la proteccion.

Roles: `admin`, `terapeuta`, `finanzas`. Terapeuta no ve Finanzas; Finanzas solo ve Finanzas/Pagos y Reportes.

## Datos sensibles

- Clinicos (`pacientes`, `consultas`, `evaluaciones`, `casos`, `elementos_caso`, `revisiones`, `trabajos`): solo `terapeuta`/`admin`.
- Financieros (`cobros`, `pagos`, vistas `vista_cobros_estado`/`vista_finanzas_unidades_cobrables`/`vista_finanzas_fotos_auditoria`): `finanzas`/`admin`. Finanzas no ve `paciente_id` real por defecto (usa alias/codigo administrativo).
- Fotos (`fotos_elementos_caso`): Storage privado (bucket `elementos-caso`, no publico), signed URLs de 10 minutos.
- Borrado: anulacion logica, no DELETE fisico. Hay policies RLS que solo permiten `DELETE` sobre filas ya anuladas (o solo para `admin`) — ver `20260704000002_agregar_delete_policies_tablas_operativas.sql`.

## Convenciones de esquema no obvias

- Estados en Postgres son strings capitalizados en español con espacios/acentos (`'Abierto'`, `'En proceso'`, `'No asistió'`), nunca snake_case en minuscula.
- PKs no son uniformes: `pacientes.id`, pero `casos.id_caso`, `consultas.id_consulta`, `evaluaciones.id_evaluacion`, `cobros.id_cobro`, `pagos.id_pago`, `fotos_elementos_caso.id_foto_elemento_caso`. Un bug recurrente en este proyecto (ver LOG-078) fue asumir `id` generico donde la tabla real usa `id_<tabla>`.

## Testing

Vitest para unit tests (`src/lib/*.test.ts`, corridos con `npm test`). CI en GitHub Actions (`.github/workflows/ci-quality.yml`) corre `npm ci` + `lint` + `test` + `build` en cada push a `main` y cada PR. Sin E2E todavia (Playwright pendiente, requiere Supabase local en el runner de CI).

## Ambientes

`LOCAL`/`DEMO`/`STAGING`/`PRODUCCION`, resuelto en `App.tsx` via `VITE_APP_AMBIENTE`. `PRODUCCION` esta bloqueada por defecto (`VITE_PRODUCCION_HABILITADA` debe ser explicito) — ver PROD-001 en `docs/control/01_PENDIENTES_PROYECTO.md`, sigue bloqueante: no cargar datos reales.

## Decisiones clave

Ver `docs/control/05_DECISIONES_PROYECTO.md`, en particular DEC-036 (AuthContext), DEC-037 (utilidades compartidas), DEC-038 (RLS), DEC-039 (testing).
