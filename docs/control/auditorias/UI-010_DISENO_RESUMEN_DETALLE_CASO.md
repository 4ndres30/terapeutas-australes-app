# UI-010 — Diseño resumen detalle de caso

## Estado

Aprobada con observaciones para revisión de flujo clínico.

## Fecha

2026-06-18.

## Objetivo

Integrar el diseño detallado de UI-010 para transformar el detalle de caso desde una lista vertical extensa hacia una vista resumen navegable, clara y operativa.

## Diagnóstico

La ficha de caso actual funciona como una página acumulativa. El usuario debe recorrer elementos del caso, revisiones, detalle de revisión, hallazgos, trabajos, pagos y seguimiento en una lista vertical larga.

La pantalla inicial del caso debe funcionar como centro de control resumido, no como una ficha extendida con todos los paneles desplegados al mismo tiempo.

## Alternativas evaluadas

### Alternativa 1 — Vista resumen general por secciones

Cada sección aparece como tarjeta resumida con datos mínimos, estado, alertas y acción para entrar al detalle profundo.

Secciones sugeridas:

- Elementos del caso.
- Revisiones.
- Detalle de revisión.
- Hallazgos.
- Trabajos.
- Pagos.
- Seguimiento.

Ventajas:

- Entrega visión global inmediata.
- Reduce scroll inicial.
- Funciona mejor para pagos, trabajos transversales y seguimiento.
- Es más simple de implementar sobre la estructura actual.

Riesgo:

Puede separar visualmente datos clínicos relacionados si no se muestran vínculos entre revisión, elemento, aspecto, hallazgo y trabajo.

Mitigación:

Cada tarjeta debe mostrar origen o relación cuando corresponda.

### Alternativa 2 — Vista organizada por elemento del caso

Cada elemento del caso se convierte en bloque principal y muestra sus revisiones, aspectos revisados, hallazgos y trabajos relacionados.

Ventajas:

- Mayor trazabilidad clínica por elemento.
- Útil para casos con varios vínculos, personas, espacios o entidades.

Riesgos:

- Puede ocultar la visión global del caso.
- Pagos, trabajos y revisiones pueden ser transversales.
- Puede requerir consultas o agregaciones más complejas.

## Recomendación final

Adoptar como pantalla principal la vista resumen general por secciones.

La vista por elemento debe quedar como modo secundario o fase posterior bajo la idea de línea clínica del elemento.

Arquitectura recomendada:

```text
Vista principal:
Resumen general por secciones

Vista secundaria:
Explorar por elemento del caso
```

## Datos mínimos en la vista principal

- Nombre del caso.
- Paciente.
- Estado.
- Prioridad.
- Motivo o foco.
- Elementos totales.
- Última revisión.
- Hallazgos activos.
- Hallazgos pendientes de trabajo.
- Trabajos abiertos.
- Pagos pendientes.
- Seguimiento requerido.

## Datos para detalle profundo

- Formularios completos.
- Notas internas extensas.
- Historial completo de revisiones.
- Aspectos revisados completos.
- Hallazgos completos.
- Creación y edición.
- Pagos detallados.
- Trabajos con sesiones o acciones futuras.
- Historial completo.

## Estados vacíos sugeridos

### Elementos del caso

Aún no hay elementos registrados para este caso. Agrega personas, vínculos, espacios u otros elementos relevantes.

### Revisiones

Este caso aún no tiene revisiones. Crea una revisión para comenzar el seguimiento clínico.

### Detalle de revisión

Aún no hay aspectos revisados. Primero selecciona una revisión y registra el detalle observado.

### Hallazgos

No hay hallazgos registrados. Los hallazgos nacen desde aspectos revisados clínicamente relevantes.

### Trabajos

No hay trabajos abiertos. Un trabajo debe nacer de una decisión manual del terapeuta.

### Pagos

No hay pagos o cobros asociados a este caso.

### Seguimiento

Este caso no tiene seguimiento activo registrado.

## Estados con muchos datos

Cuando hay muchos datos, la vista principal no debe mostrar todo. Debe usar:

- Conteos.
- Máximo tres destacados por tarjeta.
- Última actualización.
- Acción `Ver todo`.
- Alertas clínicas visibles.

Alertas prioritarias:

- Hallazgo pendiente de trabajo.
- Trabajo abierto.
- Pago pendiente.
- Seguimiento requerido.
- Hallazgo de alta prioridad.

## Microcopy recomendado

Para pantalla principal:

> Vista resumen del caso. Revisa el estado general y entra al detalle de cada sección cuando necesites trabajar en profundidad.

Para evitar ocultamiento clínico:

> Esta vista resume la información principal. Revisa el detalle completo antes de tomar decisiones clínicas.

Para vista por elemento:

> Línea clínica del elemento: revisiones, aspectos, hallazgos y trabajos asociados a este elemento del caso.

## Riesgos de ocultar información clínica

- Que el terapeuta vea solo el resumen y no revise detalles críticos.
- Que un hallazgo relevante quede escondido dentro de una tarjeta.
- Que trabajos transversales se pierdan si la navegación se organiza solo por elemento.
- Que pagos o seguimiento queden fuera del flujo operativo.
- Que se interprete “sin datos destacados” como “sin datos registrados”.

Mitigaciones:

- Badges claros.
- Alertas por prioridad.
- Contador por sección.
- Botón `Ver detalle completo`.
- Estados vacíos explícitos.
- Trazabilidad visible entre caso, revisión, elemento, aspecto, hallazgo y trabajo.

## Criterios de aceptación para implementación futura

- La pantalla principal del caso no debe desplegar todos los paneles completos por defecto.
- Debe existir resumen superior con estado, prioridad, paciente y motivo.
- Deben existir tarjetas para elementos, revisiones, detalle de revisión, hallazgos, trabajos, pagos y seguimiento.
- Cada tarjeta debe tener título, conteo o estado, resumen mínimo, alerta si corresponde y acción para ver detalle.
- Debe existir navegación desktop clara.
- Debe existir navegación mobile sin scroll excesivo.
- Las secciones con muchos datos deben mostrar conteos y máximo tres destacados.
- La información crítica no debe quedar oculta sin indicador.
- Debe conservarse trazabilidad entre caso, revisión, elemento, aspecto, hallazgo y trabajo.
- La vista por elemento queda como modo secundario o fase posterior.
- No se modifican reglas clínicas ni base de datos en esta tarea.

## Observaciones para revisión de flujo clínico

Revisión de flujo clínico debe validar:

- Qué alertas son obligatorias en la vista principal.
- Si detalle de revisión y hallazgos deben ser tarjetas separadas o combinadas.
- Qué datos nunca deben quedar solo en detalle profundo.
- Cómo mostrar trabajos transversales.
- Si pagos debe mantenerse separado del flujo clínico.

## Resultado

UI-010 queda con recomendación aprobada con observaciones. La implementación futura debe iniciar con la vista resumen general por secciones y dejar la línea por elemento como exploración secundaria.
