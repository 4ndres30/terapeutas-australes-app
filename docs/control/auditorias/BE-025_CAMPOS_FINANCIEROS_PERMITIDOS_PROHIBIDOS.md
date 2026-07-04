# BE-025 - Campos financieros permitidos/prohibidos para Finanzas

## Estado

Diseno documental / pendiente implementacion futura.

## Fecha

2026-07-03

## Rama

`be-025-contrato-campos-finanzas`

## Origen

- CTRL-008.
- DEC-027.
- SEC-004.
- SEC-001.
- BE-016.
- BE-023.
- UI-015.
- QA-006.
- PROD-001.

## Objetivo

Definir un contrato minimo de campos financieros visibles para Finanzas y prohibir contenido clinico en textos libres de cobros, pagos, reportes y futuras exportaciones.

Este documento no implementa migraciones, constraints, RLS, UI ni vistas SQL. Deja la regla para una tarea tecnica futura.

## Estado actual observado

El modelo actual de `cobros` y `pagos` incluye campos financieros estructurados y campos libres:

`cobros`:

- `concepto_cobro`;
- `tipo_cobro`;
- `descripcion_cobro`;
- `monto_cobro`;
- `monto_descuento`;
- `monto_total`;
- `moneda`;
- `estado_cobro`;
- `fecha_cobro`;
- `fecha_vencimiento`;
- `observaciones`;
- `notas_internas`.

`pagos`:

- `monto_pago`;
- `moneda`;
- `metodo_pago`;
- `estado_pago`;
- `referencia_pago`;
- `fecha_pago`;
- `observaciones`;
- `notas_internas`.

BE-016 ya protege la vista financiera minima:

- no expone `descripcion_cobro`;
- no expone `observaciones`;
- no expone `notas_internas`;
- expone un `concepto_cobro_administrativo` derivado;
- expone `referencia_pago` como referencia administrativa.

Riesgo pendiente:

- Las tablas base mantienen campos libres donde podria ingresarse informacion clinica si no hay microcopy, validacion o contrato.
- Una vista o pantalla futura podria exponer esos campos por error.
- `referencia_pago` debe mantenerse estrictamente administrativa y no convertirse en nota libre.

## Contrato permitido para Finanzas

### Identidad financiera visible

Permitido:

- `codigo_financiero_paciente` o equivalente definido por BE-023.
- `alias_administrativo_paciente`.
- identificador financiero no clinico si se requiere conciliacion.

No permitido por defecto:

- `paciente_id`.
- nombre completo.
- telefono.
- email.
- identificadores clinicos directos.

### Unidad cobrable

Permitido:

- `id_cobro` como identificador financiero.
- `id_pago` como identificador financiero.
- `tipo_unidad_cobrable`.
- `referencia_unidad_administrativa`.
- `concepto_cobro_administrativo`.
- `tipo_cobro`.

Condicionado:

- referencias a consulta/evaluacion/caso/revision/trabajo solo como texto administrativo neutro, sin UUID clinico visible y sin descripcion clinica.

### Montos, fechas y estados

Permitido:

- `fecha_cobro`;
- `fecha_vencimiento`;
- `fecha_pago`;
- `fecha_ultimo_pago`;
- `monto_cobro`;
- `monto_descuento`;
- `monto_total`;
- `monto_pago`;
- `monto_pagado`;
- `saldo_pendiente`;
- `moneda`;
- `estado_cobro`;
- `estado_pago`;
- `estado_calculado`;
- `metodo_pago`;
- `metodo_ultimo_pago`.

### Referencias administrativas

Permitido con restriccion:

- `referencia_pago`;
- folio, comprobante, numero de transferencia, referencia bancaria o nota administrativa breve.

Regla:

- Debe ser una referencia administrativa, no una descripcion clinica ni una nota terapeutica.
- No debe incluir diagnostico, motivo de consulta, antecedentes, nombres de terceros, fotos, datos de tarjetas ni datos personales innecesarios.

## Campos prohibidos para Finanzas

No deben exponerse en pantallas, reportes, exportaciones ni vistas financieras para rol Finanzas:

- `motivo_consulta`;
- `resumen_consulta`;
- `relato_antecedentes`;
- `sintomas_reportados`;
- `hechos_clave`;
- `personas_mencionadas`;
- `motivo_apertura`;
- `descripcion_general`;
- `objetivo_trabajo`;
- `resultado_general`;
- `informacion_canalizada`;
- `aspecto_revisado`;
- `descripcion_hallazgo`;
- `acciones_realizadas`;
- `resultado_sesion`;
- `resultado_accion`;
- `storage_path`;
- miniaturas, fotos o rutas Storage;
- nombres completos, telefono o email por defecto;
- `descripcion_cobro` si no esta convertida a texto administrativo controlado;
- `observaciones` de cobros o pagos;
- `notas_internas` de cobros o pagos;
- cualquier texto libre que contenga clinica, terapia, diagnostico, antecedentes o datos personales no necesarios.

## Politica para campos libres actuales

### `concepto_cobro`

Permitido solo si usa vocabulario administrativo controlado.

Ejemplos permitidos:

- `Consulta`;
- `Evaluacion`;
- `Revision`;
- `Trabajo`;
- `Paquete administrativo`;
- `Ajuste financiero`.

Ejemplos no permitidos:

- diagnosticos;
- motivo clinico;
- detalle terapeutico;
- nombres de elementos del caso si revelan clinica.

### `descripcion_cobro`

No debe exponerse a Finanzas por defecto.

Si se necesita descripcion visible, debe reemplazarse o derivarse hacia un campo administrativo controlado como `descripcion_financiera_administrativa`.

### `observaciones` y `notas_internas`

No deben exponerse a Finanzas por defecto mientras puedan contener texto clinico o sensible.

Si se requieren observaciones financieras, deben separarse en campos especificos:

- `observacion_financiera_administrativa`;
- `motivo_ajuste_financiero`;
- `nota_conciliacion_financiera`.

Estos campos tambien deben tener microcopy de prohibicion de clinica.

### `referencia_pago`

Permitida como referencia administrativa breve.

Debe usarse para:

- folio;
- comprobante;
- transferencia;
- referencia bancaria;
- identificador de conciliacion.

No debe usarse para:

- explicar clinica;
- registrar acuerdos terapeuticos;
- guardar datos de tarjetas;
- guardar datos personales innecesarios.

## Microcopy recomendado

Para formularios financieros futuros:

- Campo concepto: `Concepto administrativo`.
- Campo referencia: `Referencia administrativa o comprobante`.
- Campo nota financiera: `Nota financiera interna`.
- Ayuda visible: `No ingresar diagnosticos, motivos clinicos, nombres de terceros, fotos ni notas terapeuticas.`
- Estado vacio: `Sin referencia administrativa`.
- Busqueda: `Alias, codigo, referencia, tipo o estado`.

## Reglas de implementacion futura

La tarea tecnica futura deberia:

1. mantener `vista_finanzas_unidades_cobrables` como whitelist, no como espejo de tablas base;
2. no agregar campos libres a la vista financiera sin aprobacion;
3. derivar conceptos desde enums o tipos controlados cuando sea posible;
4. separar observaciones financieras de notas clinicas;
5. agregar microcopy preventivo en UI-015;
6. auditar cambios de montos, estados, anulaciones y correcciones mediante SEC-005 cuando se implemente;
7. validar con QA-006 que Finanzas no ve textos clinicos ni rutas Storage.

## Validaciones futuras recomendadas

- Revisar columnas expuestas por `vista_finanzas_unidades_cobrables`.
- Validar que Finanzas no reciba `descripcion_cobro`, `observaciones` ni `notas_internas`.
- Validar que busqueda de Finanzas no indexe textos clinicos.
- Validar que exportaciones futuras usen la misma whitelist.
- Validar que Admin/Terapeuta no reutilicen campos financieros para notas clinicas.
- Probar RLS/Storage local antes de datos reales.

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

- Revision documental de DEC-027: OK.
- Revision documental de SEC-004: OK.
- Revision documental de BE-016/BE-023: OK.
- Revision estatica de columnas financieras en migraciones y frontend: OK.
- `git diff --check`: OK.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia existente de chunk Vite mayor a 500 kB.

## Riesgos pendientes

- La regla requiere implementacion futura para microcopy UI, vistas, posibles campos administrativos y QA runtime.
- SEC-005 sigue pendiente para auditoria financiera sensible.
- BE-021 sigue pendiente para anulacion logica vs delete fisico.
- BE-023 sigue pendiente de implementacion tecnica.
- UI-015 sigue pendiente para mejorar experiencia financiera.
- PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

## Resultado

BE-025 deja definido que Finanzas debe operar con una whitelist administrativa: identidad financiera no clinica, unidad cobrable, montos, fechas, estados y referencias administrativas.

Los campos libres actuales no deben exponerse a Finanzas ni usarse con contenido clinico hasta que existan microcopy, separacion de campos y validacion runtime.
