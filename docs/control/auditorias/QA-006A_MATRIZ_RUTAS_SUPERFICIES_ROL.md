# QA-006A - Matriz de rutas y superficies por rol

## Estado

Matriz documental / pendiente validacion funcional por rol.

## Fecha

2026-07-03

## Rama

`qa-006a-matriz-rutas-roles`

## Origen

- QA-006.
- SEC-001.
- SEC-002.
- SEC-004.
- QA-004.
- QA-005.
- QA-009.
- UI-023.
- PROD-001.

## Objetivo

Inventariar las rutas internas actuales y mapear las superficies esperadas por rol antes de ejecutar pruebas visuales, funcionales o automatizadas de QA-006.

Este bloque no modifica codigo, no ejecuta pruebas con datos reales y no cambia permisos. Su funcion es dejar una base clara para las fases siguientes.

## Alcance revisado

Se reviso lectura estatica de:

- `src/App.tsx`
- `src/pages/ReportesPage.tsx`
- `src/pages/FinanzasPage.tsx`
- `src/pages/AgendaPage.tsx`
- `src/pages/PacientesPage.tsx`
- `src/pages/ConsultasPage.tsx`
- `src/pages/EvaluacionesPage.tsx`
- `src/pages/CasosPage.tsx`
- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/*`

No se modificaron archivos bajo `src/`.

## Roles actuales

La app reconoce estos roles internos:

| Rol | Uso esperado |
| --- | --- |
| `admin` | Operacion general: clinica, Agenda interna, Finanzas y Reportes. |
| `terapeuta` | Operacion clinica e interna: pacientes, consultas, evaluaciones, casos, Agenda y Reportes clinicos. |
| `finanzas` | Finanzas y Reportes financieros minimos, sin superficie clinica sensible. |

Los usuarios sin sesion, sin perfil interno, inactivos o con rol invalido no deben acceder al shell interno.

## Matriz de rutas protegidas

| Ruta | Componente / accion | Admin | Terapeuta | Finanzas | Sin sesion o sin perfil | Observacion QA |
| --- | --- | --- | --- | --- | --- | --- |
| `/login` | `LoginPage` | Redirige a ruta inicial si ya esta autorizado | Redirige a ruta inicial si ya esta autorizado | Redirige a `/finanzas` si ya esta autorizado | Visible | Validar mensajes no tecnicos para error, inactivo y sin autorizacion. |
| `/pacientes` | `PacientesPage` | Permitida | Permitida | Redirige a `/finanzas` | Redirige a `/login` | Superficie clinica sensible. |
| `/consultas` | `ConsultasPage` | Permitida | Permitida | Redirige a `/finanzas` | Redirige a `/login` | Superficie clinica sensible. |
| `/evaluaciones` | `EvaluacionesPage` | Permitida | Permitida | Redirige a `/finanzas` | Redirige a `/login` | Superficie clinica sensible. |
| `/casos` | `CasosPage` | Permitida | Permitida | Redirige a `/finanzas` | Redirige a `/login` | Superficie clinica sensible. |
| `/casos/:id` | `CasoDetallePage` | Permitida | Permitida | Redirige a `/finanzas` | Redirige a `/login` | Incluye paneles de elementos, revisiones, trabajos y pagos del caso. |
| `/elementos-caso` | Redireccion a `/casos` | Permitida como redireccion | Permitida como redireccion | Redirige a `/finanzas` | Redirige a `/login` | Ruta heredada/compatibilidad. |
| `/revisiones` | Redireccion a `/casos` | Permitida como redireccion | Permitida como redireccion | Redirige a `/finanzas` | Redirige a `/login` | Ruta heredada/compatibilidad. |
| `/detalle-revisiones` | Redireccion a `/casos` | Permitida como redireccion | Permitida como redireccion | Redirige a `/finanzas` | Redirige a `/login` | Ruta heredada/compatibilidad. |
| `/agenda` | `AgendaPage` | Permitida | Permitida | Redirige a `/finanzas` | Redirige a `/login` | Agenda interna no debe crear pacientes ni consultas automaticamente. |
| `/finanzas` | `FinanzasPage` | Permitida | Redirige a `/pacientes` | Permitida | Redirige a `/login` | Debe usar vista financiera minima. |
| `/reportes` | `ReportesPage` | Permitida | Permitida | Permitida | Redirige a `/login` | El panel interno debe separarse por rol. |
| `*` | Redireccion por defecto | `/pacientes` | `/pacientes` | `/finanzas` | `/login` | Validar ruta inicial por rol. |

## Matriz de superficies visibles

| Superficie | Admin | Terapeuta | Finanzas | Riesgo / prueba pendiente |
| --- | --- | --- | --- | --- |
| Shell interno | Visible | Visible | Visible | Debe bloquearse si ambiente es `PRODUCCION` no habilitada o desconocido. |
| Menu lateral | Muestra enlaces principales actuales | Muestra enlaces principales actuales | Muestra enlaces principales actuales | Brecha UI-023: los links no estan filtrados visualmente por rol; la proteccion existe en ruta, pero Finanzas ve nombres de modulos clinicos. |
| Pacientes | Permitida | Permitida | No permitida | Finanzas debe quedar fuera por ruta y por ausencia de datos clinicos. |
| Consultas | Permitida | Permitida | No permitida | Confirmar que Finanzas no accede por URL directa. |
| Evaluaciones | Permitida | Permitida | No permitida | Confirmar que Finanzas no accede por URL directa. |
| Casos | Permitida | Permitida | No permitida | Confirmar que Finanzas no accede a detalle por URL directa. |
| Elementos y fotos de caso | Permitida | Permitida | No permitida | Finanzas no debe ver fotos, miniaturas, signed URLs ni `storage_path`. |
| Revisiones y hallazgos | Permitida | Permitida | No permitida | Finanzas no debe ver hallazgos ni trabajos clinicos sensibles. |
| Pagos dentro de caso | Permitida dentro de ficha clinica | Permitida dentro de ficha clinica actual | No permitida | Riesgo residual: Terapeuta tiene superficie de pagos en ficha; debe revisarse contra BE-025/UI-015 antes de datos reales. |
| FinanzasPage | Permitida | No permitida | Permitida | Debe usar `vista_finanzas_unidades_cobrables` y textos administrativos. |
| Agenda interna | Permitida | Permitida | No permitida | No debe crear pacientes, consultas, solicitudes publicas ni objetos Storage automaticamente. |
| Reportes admin | Clinico + financiero | No aplica | No aplica | Admin carga datos clinicos y financieros. |
| Reportes terapeuta | No aplica | Clinico | No aplica | Terapeuta no debe cargar datos financieros desde Reportes. |
| Reportes finanzas | No aplica | No aplica | Financiero | Finanzas debe cargar solo `vista_finanzas_unidades_cobrables`. |

## Fuentes de datos sensibles por superficie

| Superficie | Fuente observada | Sensibilidad | Control esperado |
| --- | --- | --- | --- |
| Pacientes | `pacientes` | Clinica/personales | Solo `admin` y `terapeuta`. |
| Consultas | `consultas`, `pacientes` | Clinica | Solo `admin` y `terapeuta`. |
| Evaluaciones | `evaluaciones`, `consultas`, `pacientes` | Clinica | Solo `admin` y `terapeuta`. |
| Casos | `casos`, `pacientes`, `consultas`, `evaluaciones` | Clinica | Solo `admin` y `terapeuta`. |
| Detalle de caso | `casos`, `pacientes`, `consultas`, `evaluaciones` | Clinica | Solo `admin` y `terapeuta`. |
| Elementos/fotos | `elementos_caso`, `fotos_elementos_caso`, Storage privado | Clinica/fotos | Solo `admin` y `terapeuta`, sin fotos reales. |
| Revisiones/detalle | `revisiones`, `revision_elementos`, `revision_aspectos` | Clinica | Solo `admin` y `terapeuta`. |
| Trabajos | `trabajos` | Clinica/operativa | Solo `admin` y `terapeuta`. |
| Pagos en caso | `vista_cobros_estado`, `pagos` | Financiera vinculada a clinica | Riesgo a revisar para terapeuta y ficha clinica. |
| Finanzas | `vista_finanzas_unidades_cobrables` | Financiera minima | `admin` y `finanzas`; sin clinica sensible visible. |
| Agenda | `vista_agenda_operativa`, `agenda_eventos` | Operativa interna | `admin` y `terapeuta`; sin automatismos clinicos. |
| Reportes | Datos clinicos o financieros segun rol | Mixta | Separacion estricta por rol. |

## Hallazgos QA-006A

| Codigo | Hallazgo | Severidad | Estado recomendado |
| --- | --- | --- | --- |
| QA006A-OBS-001 | La proteccion de rutas esta centralizada en `RutaProtegida` y redirige segun rol. | Media | Validar funcionalmente con usuarios demo. |
| QA006A-OBS-002 | El menu lateral no filtra enlaces por rol; Finanzas puede ver links de modulos clinicos aunque la ruta lo redirige. | Media-alta | Activar UI-023 o una fase QA-006B antes de datos reales. |
| QA006A-OBS-003 | `ReportesPage` separa paneles por rol y evita carga clinica para Finanzas segun lectura estatica. | Media | Validar en navegador autenticado por rol. |
| QA006A-OBS-004 | `FinanzasPage` usa `vista_finanzas_unidades_cobrables`, consistente con BE-016/QA-004. | Media | Revalidar no exposicion de nombres, telefono, email, fotos y `storage_path`. |
| QA006A-OBS-005 | La ficha de caso mantiene un panel de pagos dentro de una superficie clinica disponible para admin/terapeuta. | Alta para uso real | Revisar con BE-025/UI-015 antes de produccion o datos reales. |
| QA006A-OBS-006 | Agenda interna queda restringida a admin/terapeuta y no debe crear entidades clinicas automaticamente. | Media | Revalidar en QA-006/QA-008 regresiva si cambia Agenda. |

## Casos recomendados para la siguiente fase

| Caso | Rol | Ruta | Resultado esperado |
| --- | --- | --- | --- |
| QA006B-001 | Sin sesion | `/pacientes` | Redireccion a `/login`. |
| QA006B-002 | Finanzas | `/pacientes` | Redireccion a `/finanzas`. |
| QA006B-003 | Finanzas | `/casos/:id` | Redireccion a `/finanzas`; sin render clinico previo visible. |
| QA006B-004 | Terapeuta | `/finanzas` | Redireccion a `/pacientes`. |
| QA006B-005 | Finanzas | `/reportes` | Panel financiero sin secciones clinicas. |
| QA006B-006 | Terapeuta | `/reportes` | Panel clinico sin resumen financiero. |
| QA006B-007 | Admin | `/reportes` | Panel clinico y financiero autorizado. |
| QA006B-008 | Admin/Terapeuta | `/agenda` | Agenda interna visible sin crear pacientes/consultas automaticamente. |
| QA006B-009 | Finanzas | Menu lateral | Verificar si los links clinicos siguen visibles; registrar como brecha UI-023 si ocurre. |
| QA006B-010 | Usuario inactivo/sin perfil | `/login` y ruta interna | Mensaje controlado y sin shell interno. |

## Dependencias

- `UI-023`: navegacion y superficies filtradas por rol.
- `BE-023`: alias/codigo administrativo persistente para Finanzas.
- `BE-025`: campos financieros permitidos/prohibidos para Finanzas.
- `UI-015`: experiencia de Finanzas por unidad cobrable.
- `UI-024`: recuperacion de cuenta, MFA y estados Auth no tecnicos.
- `SEC-005`: auditoria de cambios sensibles.
- `SEC-008B`: signup cerrado y provisioning controlado.
- `PROD-001`: preparacion para datos sensibles y produccion.

## Restricciones respetadas

- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se modifico `.env`.
- No se tocaron credenciales.
- No se ejecuto SQL.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth/RLS.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Resultado

QA-006A deja definida la matriz base de rutas y superficies por rol.

La siguiente tarea recomendada es `QA-006B - Validacion visual autenticada de navegacion por rol`, usando usuarios demo/locales y evidencia de navegador, sin datos reales y sin tocar Supabase remoto.

PROD-001 sigue bloqueante.
