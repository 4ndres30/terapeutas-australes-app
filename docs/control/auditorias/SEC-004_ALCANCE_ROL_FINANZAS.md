# SEC-004 — Alcance del rol Finanzas

## Estado

Aprobado con observaciones como diseño documental.

## Recomendación principal

Opción B — Finanzas ve alias administrativo, identificador interno y datos financieros mínimos.

## Decisión operativa recomendada

Finanzas no debe ver ficha completa del paciente ni datos clínicos sensibles. Finanzas debe operar cobros, pagos y reportes financieros usando datos administrativos mínimos.

## Identidad visible para Finanzas

### Permitido por defecto

- Alias administrativo del paciente.
- Código financiero del paciente.
- Identificador interno necesario para conciliación.
- Referencia administrativa de unidad cobrable.

### No permitido por defecto

- Nombre completo del paciente.
- Teléfono.
- Email.
- Contacto clínico.
- Datos personales no necesarios para operación financiera.

### Pendiente de aprobación expresa

Nombre completo, teléfono o email solo podrán exponerse si Control de Desarrollo lo aprueba expresamente y si BE-020 define consentimiento/autorización suficiente.

## Datos financieros permitidos

- Cobros.
- Pagos.
- Estado de cobro.
- Saldo.
- Fechas.
- Concepto cobrable administrativo.
- Tipo de unidad cobrable.
- Referencia mínima a consulta, evaluación, caso, revisión o trabajo.
- Método de pago.
- Comprobante o referencia de pago.

## Datos clínicos prohibidos para Finanzas

Finanzas no debe leer:

- Evaluaciones.
- Síntomas.
- Relato clínico.
- Hechos clave.
- Personas mencionadas.
- Motivo clínico del caso.
- Descripción clínica del caso.
- Elementos del caso.
- Aspectos revisados.
- Hallazgos.
- Información canalizada.
- Notas internas.
- Plan de trabajo clínico.
- Sesiones de trabajo.
- Acciones terapéuticas.
- Resultados clínicos o terapéuticos.
- Fotos de elementos del caso o archivos clínicos asociados.

## Matriz de acciones Finanzas

| Dato / Acción | Finanzas puede | Condición | Observación |
|---|---|---|---|
| Ver nombre completo paciente | No por defecto | Solo aprobación expresa | Requiere Control y consentimiento si aplica. |
| Ver alias administrativo | Sí | Por vista mínima | Identificador visible recomendado. |
| Ver código financiero paciente | Sí | Por vista mínima | Recomendado para operación diaria. |
| Ver teléfono/email | No por defecto | Solo si hay consentimiento y necesidad operativa | Relacionado con BE-020. |
| Ver motivo de consulta | No | Prohibido | Dato clínico sensible. |
| Ver evaluación | No | Prohibido | Dato clínico sensible. |
| Ver elementos del caso | No | Prohibido | Dato clínico sensible. |
| Ver fotos de elementos del caso | No | Prohibido | Archivo clínico sensible. |
| Ver hallazgos | No | Prohibido | Dato clínico sensible. |
| Ver trabajo como unidad cobrable | Sí, limitado | Solo concepto administrativo | No ver plan ni acciones terapéuticas. |
| Crear cobro | Sí | Con unidad cobrable clara | Sin automatización desde hallazgos. |
| Editar cobro | Sí | Solo campos financieros | Monto, estado, vencimiento, descuento. |
| Anular cobro | Sí | Anulación lógica | No delete físico. |
| Eliminar cobro | No | Prohibido en producción | Mantener trazabilidad. |
| Crear pago | Sí | Contra cobro existente | Validar saldo y referencia. |
| Editar pago | Sí, limitado | Corrección financiera | Con auditoría futura. |
| Anular/devolver pago | Sí | Anulación lógica | No delete físico. |
| Eliminar pago | No | Prohibido en producción | Mantener trazabilidad. |
| Ver reportes financieros | Sí | Sin clínica sensible | Relacionado con UI-016. |
| Ver reportes clínicos | No | Prohibido | Separación por rol. |

## Campos mínimos para vista financiera futura

BE-016 debe considerar una vista mínima, por ejemplo:

`vista_finanzas_unidades_cobrables`

Campos sugeridos:

- id_unidad_cobrable
- tipo_unidad_cobrable
- id_cobro
- id_pago opcional
- paciente_id
- alias_administrativo_paciente
- codigo_financiero_paciente
- referencia_unidad
- concepto_cobro_administrativo
- tipo_cobro
- fecha_cobro
- fecha_vencimiento
- monto_cobro
- monto_descuento
- monto_total
- monto_pagado
- saldo_pendiente
- moneda
- estado_cobro
- estado_calculado
- fecha_ultimo_pago
- metodo_ultimo_pago
- referencia_pago
- estado_pago
- origen_tabla
- origen_id

## Campos prohibidos en vista financiera

La vista financiera no debe incluir:

- motivo_consulta
- resumen_consulta
- relato_antecedentes
- sintomas_reportados
- hechos_clave
- personas_mencionadas
- motivo_apertura
- descripcion_general
- objetivo_trabajo clínico
- resultado_general clínico
- informacion_canalizada
- observaciones clínicas
- notas_internas clínicas
- aspecto_revisado
- descripcion_hallazgo
- acciones_realizadas
- resultado_sesion
- resultado_accion
- rutas de storage clínico
- fotos clínicas o miniaturas de elementos del caso

## Recomendaciones para SEC-001

SEC-001 debe probar runtime que Finanzas:

- Puede iniciar sesión.
- Puede acceder a finanzas.
- Puede leer cobros/pagos autorizados.
- No puede leer evaluaciones.
- No puede leer elementos del caso.
- No puede leer fotos de elementos del caso.
- No puede leer aspectos revisados.
- No puede leer hallazgos.
- No puede leer sesiones ni acciones terapéuticas.
- No puede crear pacientes.
- No puede crear casos.
- No puede crear revisiones.
- No puede crear hallazgos.
- No puede crear trabajos clínicos.
- No puede ejecutar delete físico.

## Recomendaciones para BE-016

BE-016 debe diseñar la vista financiera mínima sin exponer datos clínicos ni archivos clínicos.

## Recomendaciones para UI-016

UI-016 debe separar reportes en:

- admin: visión completa autorizada;
- terapeuta: vista clínica sin finanzas detalladas;
- finanzas: vista financiera sin clínica sensible.

## Recomendaciones para BE-020

Si se decide exponer teléfono, email o nombre completo para cobranza directa, BE-020 debe definir consentimiento/autorización específica.

## Recomendaciones para BE-021

Cobros y pagos deben usar anulación lógica. Delete físico financiero debe quedar prohibido en producción.

## Relación con futuro feature de fotos de elementos del caso

Las fotos de elementos del caso deben considerarse archivos clínicos sensibles. Finanzas no debe verlas ni acceder a rutas de Storage asociadas.

## Resultado

SEC-004 queda aprobada con observaciones como diseño documental. Esta definición debe usarse en SEC-001 runtime, BE-016, UI-016 y cualquier feature futuro que agregue archivos clínicos.
