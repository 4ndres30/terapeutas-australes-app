# UI-016 - Reportes separados por rol

## Estado

Integrada por PR #33.

## Fecha

2026-06-28

## Rama

`ui-016-reportes-por-rol`

## Integracion

UI-016 quedo integrada en `main` mediante PR #33. Este informe conserva la preparacion y validacion tecnica de la rama original, pero el estado vigente ya no es `pendiente PR`.

## Objetivo

Separar visual y funcionalmente `ReportesPage` para que cada rol vea solo los reportes permitidos:

- Admin: resumen general, indicadores clinicos, indicadores financieros autorizados y panel operativo amplio.
- Terapeuta: reportes clinicos de casos, revisiones, hallazgos, trabajos y seguimiento.
- Finanzas: reportes financieros sin clinica sensible, usando la vista minima autorizada.

## Alcance

- Se mantiene la ruta `/reportes`.
- Se modifica `src/pages/ReportesPage.tsx`.
- No se modifica `FinanzasPage`.
- No se modifica `App.tsx`.
- No se crean migraciones.
- No se modifica Supabase remoto.
- No se ejecuta `supabase db push`.
- No se tocan `.env`, `package.json`, `package-lock.json` ni `public/`.
- No se usan datos reales ni imagenes reales.

## Preparacion ejecutada

| Comando | Resultado |
|---|---|
| `git switch main` | OK. Rama `main` activa y alineada al remoto. |
| `git pull origin main` | OK. Fast-forward hasta `52fdb7d`, incluyendo QA-004. |
| `git status` | OK. Working tree limpio antes de crear rama. |
| `npm run lint` | OK. Warning conocido de npm por `min-release-age`. |
| `npm run build` | OK. Warning conocido de Vite por chunk mayor a 500 kB. |
| `npx supabase migration list --local` | No conecto a Postgres local en `127.0.0.1:54322`. No se toco Supabase remoto. |
| `git switch -c ui-016-reportes-por-rol` | OK. |

## Implementacion

`ReportesPage` ahora detecta el rol activo antes de cargar datos y renderiza una superficie separada:

- `ReportesAdmin`
- `ReportesTerapeuta`
- `ReportesFinanzas`

La deteccion del rol usa la sesion actual y lee solo `rol, activo` desde `usuarios_internos`. No cambia la logica de autenticacion ni las rutas protegidas.

## Consultas por rol

### Admin

Admin carga indicadores clinicos agregados y resumen financiero autorizado.

Consultas clinicas:

- `pacientes`
- `consultas`
- `evaluaciones`
- `casos`
- `elementos_caso`
- `revisiones`
- `revision_hallazgos`
- `trabajos`

Consulta financiera:

- `vista_finanzas_unidades_cobrables`

### Terapeuta

Terapeuta carga solo reportes clinicos.

Consultas:

- `pacientes`
- `consultas`
- `evaluaciones`
- `casos`
- `elementos_caso`
- `revisiones`
- `revision_hallazgos`
- `trabajos`

No carga cobros, pagos, `vista_cobros_estado` ni `vista_finanzas_unidades_cobrables`.

### Finanzas

Finanzas carga solo reportes financieros.

Consulta:

- `vista_finanzas_unidades_cobrables`

La rama de carga de Finanzas no llama a la carga clinica y no consulta:

- `pacientes`
- `consultas`
- `evaluaciones`
- `casos`
- `elementos_caso`
- `revisiones`
- `revision_elementos`
- `revision_aspectos`
- `revision_hallazgos`
- `trabajos`
- `trabajo_elementos`
- `trabajo_sesiones`
- `trabajo_acciones`
- `fotos_elementos_caso`
- `storage.objects`
- `pagos`
- `vista_cobros_estado`

## Contenido visible por rol

### Admin

Admin ve:

- resumen general;
- metricas clinicas;
- indicadores clinicos;
- alertas operativas;
- actividad terapeutica reciente;
- resumen financiero;
- cobros por estado;
- ultimos pagos visibles;
- unidades cobrables recientes.

### Terapeuta

Terapeuta ve:

- reportes clinicos;
- casos activos;
- revisiones con seguimiento;
- hallazgos operativos agregados;
- trabajos abiertos o con seguimiento;
- actividad terapeutica reciente.

Terapeuta no ve panel financiero, pagos, saldos completos ni gestion de cobros desde Reportes.

### Finanzas

Finanzas ve:

- total emitido;
- total pagado;
- saldo pendiente;
- cantidad de cobros;
- cobros por estado;
- ultimos pagos visibles;
- referencias administrativas;
- alias/codigo administrativo;
- fechas, montos, estados, metodos y referencias de pago.

Finanzas no ve secciones clinicas vacias, parciales ni bloqueadas.

## Datos prohibidos para Finanzas

`ReportesPage` no muestra a Finanzas:

- nombre completo;
- telefono;
- email;
- motivo de consulta;
- resumen de consulta;
- evaluaciones;
- casos clinicos;
- elementos del caso;
- aspectos revisados;
- hallazgos;
- notas clinicas;
- informacion canalizada;
- trabajos clinicos sensibles;
- sesiones terapeuticas;
- acciones terapeuticas;
- resultados clinicos;
- fotos;
- miniaturas;
- rutas de Storage;
- `storage_path`.

## Resultado

UI-016 queda implementada localmente como separacion explicita de reportes por rol.

En el estado vigente de `main`, UI-016 queda integrada por PR #33.

La seguridad visual ya no depende de que RLS devuelva cero filas para Finanzas: la pantalla financiera se renderiza por una rama propia y solo carga la vista minima financiera.

## Validaciones tecnicas finales

| Comando | Resultado |
|---|---|
| `npm run lint` | OK. Warning conocido de npm por `min-release-age`. |
| `npm run build` | OK. Warning conocido de Vite por chunk mayor a 500 kB. |
| `git diff --check` | OK. Sin errores de whitespace; Git aviso normalizacion LF/CRLF en Windows. |
| `git diff --name-only` | OK. Cambios trackeados: `docs/control/01_PENDIENTES_PROYECTO.md`, `docs/control/04_UI_UX_PULIDO_VISUAL.md`, `docs/control/06_BITACORA_CAMBIOS.md`, `src/pages/ReportesPage.tsx`. Archivo nuevo visto en `git status`: `docs/control/auditorias/UI-016_REPORTES_POR_ROL.md`. |

## Observaciones

No se detecto necesidad critica de migracion. No se modifico `FinanzasPage` ni se revirtio BE-016.
