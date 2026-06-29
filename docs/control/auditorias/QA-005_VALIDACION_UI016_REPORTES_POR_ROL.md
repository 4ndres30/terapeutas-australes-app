# QA-005 - Validacion funcional local UI-016 / Reportes por rol

## Estado

Aprobada localmente / pendiente integracion.

## Fecha

2026-06-29

## Origen

UI-016 - Reportes separados por rol.

## Contexto

PR #33 integro `ReportesPage` separado por rol. PR #34 sincronizo la documentacion maestra post UI-016 y dejo QA-005 como validacion funcional local pendiente.

Esta validacion registra el comportamiento observado en `/reportes` para Admin, Terapeuta y Finanzas despues de integrar UI-016.

## Alcance

Validacion manual local de la ruta `/reportes`.

No incluye cambios funcionales, migraciones, datos reales, fotos reales, pagos reales ni Supabase remoto.

## Roles probados

- Admin.
- Terapeuta.
- Finanzas.

## Resultado por rol

### Admin

Resultado observado:

- Puede entrar a `/reportes`.
- Ve reportes generales.
- Ve indicadores clinicos autorizados.
- Ve indicadores financieros autorizados.
- Ve panel operativo general.
- No se observaron errores visibles.

Admin mantiene una superficie amplia de reporte, consistente con su rol transversal y con las restricciones de seguridad vigentes.

### Terapeuta

Resultado observado:

- Puede entrar a `/reportes`.
- Ve reportes clinicos.
- Ve informacion de casos, revisiones, hallazgos, trabajos y seguimiento.
- No ve panel financiero completo.
- No administra cobros ni pagos desde Reportes.
- No se observaron errores visibles.

La vista de Terapeuta queda enfocada en seguimiento clinico y operativo, sin exponer gestion financiera completa.

### Finanzas

Resultado observado:

- Puede entrar a `/reportes`.
- Ve solo reportes financieros.
- Usa datos desde `public.vista_finanzas_unidades_cobrables`.
- No se observaron errores visibles.

Finanzas no ve secciones clinicas vacias ni mensajes tecnicos derivados de RLS. La pantalla financiera se renderiza como superficie propia.

## Validacion especifica Finanzas

Finanzas no ve:

- reportes clinicos;
- pacientes clinicos;
- consultas;
- evaluaciones;
- casos clinicos;
- elementos del caso;
- revisiones;
- hallazgos;
- trabajos clinicos sensibles;
- fotos;
- miniaturas;
- rutas internas;
- `storage_path`;
- nombre completo;
- telefono;
- email;
- motivo de consulta.

Finanzas consume reportes financieros desde `public.vista_finanzas_unidades_cobrables` y no desde tablas clinicas.

## Seguridad visual

La UI validada cumple:

- no muestra secciones clinicas vacias para Finanzas;
- no muestra mensajes tecnicos tipo `RLS bloqueo datos`;
- no expone nombres de policies;
- no expone rutas de Storage;
- no expone detalles internos de Supabase;
- no expone `storage_path`;
- no muestra miniaturas ni fotos al rol Finanzas.

## Datos sensibles no observados

Durante la validacion de Finanzas no se observaron:

- nombre completo de paciente;
- telefono;
- email;
- motivo de consulta;
- evaluaciones;
- elementos del caso;
- revisiones;
- hallazgos;
- trabajos clinicos sensibles;
- notas clinicas;
- informacion canalizada;
- fotos;
- miniaturas;
- rutas internas de Storage;
- `storage_path`.

## Restricciones respetadas

- Sin datos reales.
- Sin fotos reales.
- Sin pagos reales.
- Sin modificar codigo fuente.
- Sin modificar migraciones.
- Sin tocar `.env`.
- Sin ejecutar `supabase db push`.
- Sin ejecutar `supabase db pull`.
- Sin tocar Supabase remoto.
- Sin abrir produccion.
- Sin hacer merge a `main`.

## Validaciones tecnicas de base

Preparacion ejecutada antes de documentar QA-005:

| Comando | Resultado |
|---|---|
| `git switch main` | OK. |
| `git pull origin main` | OK. `main` actualizado. |
| `git remote -v` | OK. Remoto oficial `4ndres30/terapeutas-australes-app`. |
| `git status` | OK. Working tree limpio antes de crear rama. |
| `npm run lint` | OK. Warning conocido de npm por `min-release-age`. |
| `npm run build` | OK. Warning conocido de Vite por chunk mayor a 500 kB. |
| `npx supabase status` | OK. Supabase local activo. |
| `npx supabase migration list --local` | OK. Migraciones locales listadas y alineadas. |

## Resultado

UI-016 queda validada funcionalmente en local para `/reportes` con Admin, Terapeuta y Finanzas.

La validacion confirma que Finanzas opera sobre reportes financieros desde `public.vista_finanzas_unidades_cobrables` y no ve clinica sensible ni archivos clinicos.

## Observaciones

Esta validacion no habilita datos reales, fotos reales, pagos reales ni produccion.

PROD-001 sigue bloqueante.

Proxima tarea sugerida: decisiones criticas post auditoria o SEC-003/SEC-005 segun planificacion de Control.
