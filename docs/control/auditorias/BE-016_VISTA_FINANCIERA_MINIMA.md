# BE-016 - Vista financiera minima por unidad cobrable

## Estado

**Integrada por PR #31 y validada funcionalmente por QA-004 en PR #32.**

BE-016 crea una superficie financiera minima para el rol `finanzas`, sin exponer nombres completos, telefono, email, contenido clinico, fotos, miniaturas ni `storage_path`.

El resultado no habilita datos reales. PROD-001 sigue bloqueante hasta cerrar auditoria, anulacion logica, ambientes, backups y gobierno de datos.

## Alcance

- Supabase local.
- Migracion nueva.
- Ajuste de `FinanzasPage`.
- Datos ficticios dentro de transaccion revertida con `ROLLBACK`.
- Sin datos reales.
- Sin imagenes reales.
- Sin tocar `.env`.
- Sin `supabase db push`.
- Sin tocar Supabase remoto.
- Sin modificar migraciones existentes.

## Decision tecnica

Se complementa, no se elimina, `vista_cobros_estado`.

- `vista_finanzas_unidades_cobrables` queda como vista autorizada para Finanzas.
- `vista_cobros_estado` se mantiene para compatibilidad de usos internos/admin existentes, pero deja de devolver filas a Finanzas.
- `ReportesPage` no se modifico en esta tarea. UI-016 se integro posteriormente por PR #33 para separar reportes por rol.

## Migracion creada

`supabase/migrations/20260627231000_crear_vista_finanzas_unidades_cobrables.sql`

La migracion:

- recrea `public.vista_cobros_estado` con filtro `public.es_admin()`;
- mantiene `security_invoker = true` en `public.vista_cobros_estado`;
- crea `public.vista_finanzas_unidades_cobrables`;
- define `security_invoker = true` en la nueva vista;
- revoca privilegios generales sobre la nueva vista;
- concede solo `select` sobre la nueva vista a `authenticated`.

## Vista creada

`public.vista_finanzas_unidades_cobrables`

### Campos expuestos

| Campo | Origen / criterio |
|---|---|
| `id_cobro` | Identificador financiero del cobro. |
| `id_pago` | Ultimo pago asociado, si existe. |
| `paciente_id` | Identificador interno minimo para conciliacion. |
| `codigo_paciente` | Codigo administrativo derivado de `paciente_id`; no usa nombre. |
| `alias_administrativo_paciente` | Alias administrativo derivado de `paciente_id`; no usa nombre. |
| `tipo_unidad_cobrable` | `trabajo`, `revision`, `caso`, `evaluacion`, `consulta` o `cobro`. |
| `referencia_unidad_administrativa` | Referencia administrativa derivada y acortada; no expone IDs clinicos directos. |
| `concepto_cobro_administrativo` | Concepto derivado desde `tipo_cobro`, sin usar texto libre clinico. |
| `tipo_cobro` | Clasificacion financiera del cobro. |
| `fecha_cobro` | Fecha financiera. |
| `fecha_vencimiento` | Fecha financiera. |
| `monto_cobro` | Monto financiero. |
| `monto_descuento` | Monto financiero. |
| `monto_total` | Monto financiero. |
| `monto_pagado` | Suma de pagos registrados/confirmados. |
| `saldo_pendiente` | Saldo financiero calculado. |
| `moneda` | Moneda del cobro. |
| `estado_cobro` | Estado financiero del cobro. |
| `estado_pago` | Estado del ultimo pago. |
| `fecha_ultimo_pago` | Fecha del ultimo pago. |
| `metodo_ultimo_pago` | Metodo del ultimo pago. |
| `referencia_pago` | Referencia administrativa del pago. |

## Campos prohibidos confirmados

La vista nueva no expone:

- nombre completo;
- telefono;
- email;
- `consulta_id`, `evaluacion_id`, `caso_id`, `revision_id`, `trabajo_id`;
- `motivo_consulta`;
- `resumen_consulta`;
- `relato_antecedentes`;
- `sintomas_reportados`;
- `hechos_clave`;
- `personas_mencionadas`;
- `motivo_apertura`;
- `descripcion_general`;
- elementos del caso;
- aspectos revisados;
- hallazgos;
- informacion canalizada;
- notas internas clinicas;
- objetivo o plan clinico de trabajo;
- acciones terapeuticas;
- resultado de sesion o accion;
- fotos;
- miniaturas;
- `storage_path`.

## Frontend

`FinanzasPage` ahora consume solo `public.vista_finanzas_unidades_cobrables`.

Se elimina de esta pagina:

- lectura directa de `pacientes`;
- lectura directa de `pagos`;
- uso de nombres y apellidos;
- uso de `vista_cobros_estado`.

La pantalla muestra alias/codigo administrativo, referencia administrativa de unidad cobrable, saldos y ultimo pago visible.

## Validacion runtime local

Se ejecuto una transaccion local con datos ficticios:

- usuario `admin` demo;
- usuario `terapeuta` demo;
- usuario `finanzas` demo;
- paciente ficticio;
- consulta/evaluacion/caso/elemento/foto ficticios;
- cobro y pago ficticios;
- `ROLLBACK` final.

### Resultado por rol

| Prueba | Admin | Terapeuta | Finanzas |
|---|---:|---:|---:|
| Leer `vista_finanzas_unidades_cobrables` | Permitido | Bloqueado / 0 filas | Permitido |
| Leer `vista_cobros_estado` | Permitido | Bloqueado / 0 filas | Bloqueado / 0 filas |
| Leer `cobros` | Permitido | Bloqueado / 0 filas | Permitido por RLS existente |
| Leer `pagos` | Permitido | Bloqueado / 0 filas | Permitido por RLS existente |
| Leer `pacientes` | Permitido | Permitido | Bloqueado / 0 filas |
| Leer `consultas` | Permitido | Permitido | Bloqueado / 0 filas |
| Leer `evaluaciones` | Permitido | Permitido | Bloqueado / 0 filas |
| Leer `casos` | Permitido | Permitido | Bloqueado / 0 filas |
| Leer `elementos_caso` | Permitido | Permitido | Bloqueado / 0 filas |
| Leer `fotos_elementos_caso` | Permitido | Permitido | Bloqueado / 0 filas |

### Checks ejecutados

Todos los checks devolvieron `ok = true`:

- `admin_lee_vista_cobros_estado`;
- `admin_lee_vista_minima`;
- `columnas_vista_minima_sin_prohibidas`;
- `finanzas_lee_vista_minima`;
- `finanzas_no_lee_vista_cobros_estado`;
- `finanzas_no_lee_pacientes`;
- `finanzas_no_lee_consultas`;
- `finanzas_no_lee_evaluaciones`;
- `finanzas_no_lee_casos`;
- `finanzas_no_lee_elementos_caso`;
- `finanzas_no_lee_fotos`;
- `grant_minimo_vista_finanzas`;
- `terapeuta_no_lee_vista_minima`;
- `terapeuta_no_lee_cobros`;
- `terapeuta_no_lee_pagos`.

Grant observado:

`select=true, insert=false, update=false, delete=false`

## Validaciones de preparacion

Ejecutadas antes de implementar:

- `git switch main`
- `git pull origin main`
- `git status --short --branch`
- `npm run lint`
- `npm run build`
- `npx supabase migration list --local`

Resultado:

- lint OK;
- build OK con warning conocido de Vite por chunk mayor a 500 kB;
- migraciones locales listadas correctamente;
- no se ejecuto `supabase db push`.

## Riesgos pendientes

- `cobros` y `pagos` siguen siendo tablas administrables por Finanzas segun RLS actual; se debe evitar texto clinico en campos financieros libres.
- BE-021 sigue pendiente para anulacion logica vs delete fisico financiero.
- SEC-005 sigue pendiente para auditoria de accesos/cambios sensibles.
- UI-016 ya separo `ReportesPage` por rol; QA-005 queda pendiente para registrar su validacion funcional local.
- Si se requiere alias/codigo financiero persistente, debe agregarse una decision y migracion futura sobre `pacientes` o una tabla administrativa separada.

## Resultado

BE-016 queda integrada y validada en runtime local. QA-004 valida funcionalmente el flujo de Finanzas sobre la vista minima.

No se tocaron migraciones existentes, `.env`, Supabase remoto, `package.json`, `package-lock.json`, `public/`, datos reales ni imagenes reales.

## Estado post PR #33

Despues de UI-016, `ReportesPage` tambien consume la superficie financiera minima para el rol Finanzas. Finanzas no consulta reportes clinicos ni ve pacientes clinicos, consultas, casos, hallazgos, trabajos clinicos sensibles, fotos, miniaturas ni `storage_path`.

Este resultado no habilita datos reales, fotos reales, pagos reales ni produccion. PROD-001 sigue bloqueante.
