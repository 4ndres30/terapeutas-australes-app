# UI-010 — Diseño resumen detalle de caso

## Estado

Aprobada con observaciones clínicas / pendiente implementación.

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

## Validación de revisión de flujo clínico

**Estado clínico:** Aprobado con observaciones.

Revisión de flujo clínico valida la vista resumen general por secciones como pantalla principal, siempre que no reemplace el detalle profundo y que mantenga alertas, conteos, último evento relevante y vínculo al detalle completo.

### Alertas obligatorias en la vista principal

La vista principal del caso debe mostrar, cuando corresponda:

- Hallazgo de alta prioridad o urgente.
- Hallazgo pendiente de trabajo.
- Hallazgo activo con seguimiento requerido.
- Trabajo abierto.
- Trabajo pendiente de validación o cierre.
- Revisión pendiente o caso sin revisión inicial.
- Aspectos revisados pendientes o incompletos.
- Seguimiento requerido.
- Pago pendiente, separado visualmente del flujo clínico.
- Caso sin elementos registrados.
- Caso sin trazabilidad de origen cuando corresponda.
- Advertencia de uso de datos reales no autorizado mientras PROD-001 siga pendiente.

### Detalle de revisión y hallazgos

`Detalle de revisión` y `Hallazgos` deben mantenerse como tarjetas separadas, pero conectadas visualmente.

Definición clínica:

- Detalle de revisión: lo observado, medido o revisado.
- Hallazgo: lo clínicamente relevante que requiere atención, prioridad, seguimiento o posible trabajo.

Cada hallazgo destacado debe mostrar origen mínimo:

```text
Revisión → Elemento → Aspecto revisado → Hallazgo
```

### Información que no debe quedar oculta solo en detalle profundo

No deben quedar escondidos exclusivamente dentro de “Ver detalle”:

- Hallazgos activos.
- Hallazgos urgentes o de alta prioridad.
- Hallazgos pendientes de trabajo.
- Trabajos abiertos.
- Seguimientos requeridos.
- Última revisión.
- Próxima acción clínica.
- Elementos con hallazgos activos.
- Aspectos pendientes.
- Estado y prioridad del caso.
- Resultado o cierre si el caso está cerrado.
- Advertencia de datos reales no autorizados mientras PROD-001 esté pendiente.

### Trabajos transversales

Los trabajos transversales deben mostrarse en la tarjeta `Trabajos` a nivel de caso, indicando:

- nombre del trabajo;
- estado;
- prioridad;
- origen;
- elementos afectados;
- si afecta al caso completo;
- próxima acción;
- si requiere revisión posterior.

En una futura vista por elemento, el trabajo transversal puede aparecer dentro de cada elemento afectado, pero siempre con etiqueta clara:

```text
Trabajo transversal vinculado a este elemento
```

### Pagos

`Pagos` debe existir como tarjeta o bloque visible, pero separado visualmente del flujo clínico.

Regla clínica:

```text
El estado financiero nunca debe condicionar visualmente una decisión terapéutica.
```

Ubicación recomendada:

```text
Bloque clínico:
Elementos → Revisiones → Detalle → Hallazgos → Trabajos → Seguimiento

Bloque administrativo:
Pagos / Cobros
```

### Vista por elemento

La vista por elemento queda como modo secundario opcional, pero recomendable para casos complejos con:

- múltiples personas;
- vínculos familiares;
- hogar o espacio;
- linaje;
- entidades o presencias;
- trabajos transversales;
- más de una revisión activa;
- varios hallazgos por elemento.

### Trazabilidad clínica completa

La implementación futura debe conservar trazabilidad mínima:

```text
Paciente
→ Caso
→ Consulta / Evaluación de origen
→ Elemento del caso
→ Revisión
→ Aspecto revisado
→ Hallazgo
→ Trabajo
→ Pago / Cobro
→ Seguimiento
```

Cada tarjeta debe responder:

```text
De dónde viene, qué afecta y qué acción sigue.
```

### Conclusión clínica

UI-010 puede integrarse documentalmente como aprobada con observaciones clínicas. No debe implementarse código hasta que estas observaciones queden consideradas como criterios de aceptación de la futura tarea de implementación.
