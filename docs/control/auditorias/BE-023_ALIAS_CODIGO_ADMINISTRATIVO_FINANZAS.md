# BE-023 - Alias/codigo administrativo persistente para Finanzas

## Estado

Diseno documental / pendiente implementacion futura.

## Fecha

2026-07-03

## Rama

`be-023-alias-codigo-finanzas`

## Origen

- CTRL-008.
- DEC-022.
- SEC-004.
- BE-016.
- QA-004.
- QA-006D.
- QA-006E.
- PROD-001.

## Objetivo

Definir una estrategia para que Finanzas opere con alias/codigo administrativo persistente, sin recibir `paciente_id` real por defecto en pantallas, reportes, contratos frontend o exportaciones.

Este documento no crea migraciones, no modifica vistas SQL, no modifica `src/` y no toca Supabase local/remoto.

## Estado actual observado

BE-016 redujo correctamente la superficie financiera:

- `FinanzasPage` consume `public.vista_finanzas_unidades_cobrables`.
- `ReportesPage` usa la misma vista para rol Finanzas.
- La UI muestra `alias_administrativo_paciente` o `codigo_paciente`.
- La vista no expone nombre completo, telefono, email, clinica sensible, fotos ni `storage_path`.

Riesgo pendiente:

- `public.vista_finanzas_unidades_cobrables` aun incluye `paciente_id`.
- `src/pages/FinanzasPage.tsx` y `src/pages/ReportesPage.tsx` aun tipan/seleccionan `paciente_id` desde la vista.
- `codigo_paciente` y `alias_administrativo_paciente` se derivan del UUID de `paciente_id`.

En local/demo esto es aceptable para validacion controlada. Para datos reales, el UUID estable puede facilitar correlacion con tablas clinicas si aparece otro canal de acceso.

## Alternativas evaluadas

### Opcion A - Mantener codigo derivado desde UUID

Ventaja:

- No requiere migracion.
- Mantiene compatibilidad inmediata.

Riesgo:

- El codigo sigue correlacionado con el identificador clinico real.
- No resuelve DEC-022 para datos reales.

Decision: no recomendada para produccion.

### Opcion B - Agregar campos financieros en `pacientes`

Ventaja:

- Implementacion relativamente directa.
- Mantiene una sola fila por paciente.

Riesgo:

- Mezcla identidad clinica y financiera en la misma tabla.
- Puede aumentar exposicion accidental si una vista futura consulta `pacientes`.

Decision: aceptable solo si se prioriza rapidez y se controla muy bien RLS/columnas.

### Opcion C - Tabla administrativa separada de identidad financiera

Ventaja:

- Separa identidad clinica de identidad financiera.
- Permite codigo persistente no derivado del UUID clinico.
- Facilita rotacion, auditoria y control de exposicion.

Riesgo:

- Requiere migracion futura, backfill local/demo y pruebas RLS.
- Debe validarse cuidadosamente con `security_invoker`, grants y policies para no romper la vista.

Decision: opcion recomendada.

## Recomendacion tecnica

Crear en tarea futura una tabla administrativa separada, por ejemplo:

```text
public.pacientes_identidad_financiera
```

Campos conceptuales:

| Campo | Criterio |
| --- | --- |
| `id` | UUID tecnico de la identidad financiera. |
| `paciente_id` | FK interna unica hacia `pacientes`, no expuesta a Finanzas por defecto. |
| `codigo_financiero` | Codigo estable no derivado del UUID clinico. |
| `alias_administrativo` | Alias visible para Finanzas, sin nombre real por defecto. |
| `estado` | Activo/inactivo/anulado segun politica futura. |
| `creado_en`, `actualizado_en` | Trazabilidad basica. |
| `creado_por`, `actualizado_por` | Pendiente de SEC-005 si se implementa auditoria sensible. |

La vista financiera futura deberia exponer:

- `codigo_financiero_paciente`;
- `alias_administrativo_paciente`;
- identificador financiero no clinico si es necesario;
- referencias administrativas de unidad cobrable;
- campos financieros permitidos por BE-025.

La vista financiera futura no deberia exponer:

- `paciente_id`;
- UUIDs clinicos directos de consulta/evaluacion/caso/revision/trabajo;
- nombre completo, telefono o email por defecto;
- datos clinicos, fotos, miniaturas ni rutas Storage.

## Impacto esperado en vistas

`public.vista_finanzas_unidades_cobrables` deberia evolucionar en una migracion futura para:

1. unir con la identidad financiera persistente;
2. reemplazar `codigo_paciente` derivado del UUID por `codigo_financiero`;
3. reemplazar `alias_administrativo_paciente` derivado del UUID por `alias_administrativo`;
4. retirar `paciente_id` del contrato de salida para consumo de Finanzas;
5. mantener el join interno por `paciente_id` solo dentro de SQL/backend autorizado.

Si Admin necesita conciliacion tecnica, se recomienda una superficie interna separada o permisos diferenciados, no ampliar el contrato de Finanzas.

## Impacto esperado en frontend

En una tarea futura de implementacion, `FinanzasPage` y `ReportesPage` deberian:

- dejar de seleccionar `paciente_id` desde la vista financiera;
- tipar solo campos financieros y administrativos permitidos;
- mantener busqueda por alias, codigo, referencia, tipo y estado;
- no renderizar ni conservar UUIDs clinicos en estado de UI de Finanzas si no son necesarios.

## Consideraciones RLS/grants

La implementacion futura debe probar localmente:

- que Finanzas puede leer la vista financiera sin ver `paciente_id`;
- que Finanzas no puede leer `pacientes`;
- que Finanzas no puede leer datos clinicos asociados;
- que la tabla de identidad financiera no expone `paciente_id` por consulta directa no autorizada;
- que `security_invoker`, column grants y policies no rompen la vista;
- que Admin conserva caminos de conciliacion autorizados.

Si los grants por columna no bastan con `security_invoker`, Control debe evaluar una vista/RPC dedicada y documentar el tradeoff antes de implementar.

## Secuencia recomendada

1. Cerrar BE-025 para definir campos financieros permitidos/prohibidos.
2. Preparar una tarea tecnica futura para migracion local de identidad financiera.
3. Actualizar `vista_finanzas_unidades_cobrables`.
4. Ajustar `FinanzasPage` y `ReportesPage` para retirar `paciente_id`.
5. Ejecutar QA-006F/QA-006G de Finanzas/RLS local.
6. Mantener PROD-001 bloqueante hasta cerrar auditoria, ambientes, anulacion y seguridad.

## Restricciones respetadas

- No se modifico codigo fuente funcional.
- No se modifico `src/`.
- No se modifico `.env`.
- No se modificaron migraciones.
- No se modifico Auth/RLS.
- No se crearon usuarios.
- No se modifico base de datos local ni remota.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Validaciones

- Revision documental de `SEC-004`: OK.
- Revision documental de `BE-016`: OK.
- Revision estatica de consumo `FinanzasPage`/`ReportesPage`: OK.
- `git diff --check`: OK.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia existente de chunk Vite mayor a 500 kB.

## Riesgos pendientes

- La implementacion real requiere migracion futura, RLS/grants y QA runtime local.
- BE-025 sigue pendiente para definir campos financieros permitidos/prohibidos.
- SEC-005 sigue pendiente para auditoria sensible.
- BE-021 sigue pendiente para anulacion logica vs delete fisico.
- PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

## Resultado

BE-023 deja recomendada la opcion de identidad financiera persistente separada, con contrato financiero sin `paciente_id` visible para Finanzas.

El estado actual local/demo puede seguir usandose para QA controlada, pero no debe considerarse suficiente para datos reales.
