# UI-012 — Diseño del flujo Evaluar trabajo

## Estado

Aprobado con observaciones

## Fecha

2026-06-17

## Rama revisada

`main`

## Resumen ejecutivo

UI-012 define el flujo visual `Evaluar trabajo` desde un hallazgo operativo registrado en el detalle de revisión.

La acción no debe crear un trabajo automáticamente. Su función es abrir una instancia de evaluación donde el terapeuta revise el hallazgo, vea su contexto clínico, confirme si amerita intervención y complete manualmente los datos mínimos del trabajo antes de crearlo.

La primera versión debe usar `trabajos.revision_hallazgo_origen_id` como trazabilidad de hallazgo origen principal. No se crea tabla puente `trabajo_hallazgos` en esta etapa. Tampoco se crean cobros, sesiones ni acciones automáticamente.

## Problema que resuelve

Después de IMP-001 y DATA-001, los hallazgos operativos ya pueden visualizarse y crearse dentro de `DetalleRevisionesPanel`. BE-011 confirmó que existe trazabilidad suficiente para vincular un trabajo a un hallazgo mediante `trabajos.revision_hallazgo_origen_id`.

La brecha visual es que el botón actual `Evaluar trabajo próximamente` está deshabilitado y aún no existe una experiencia clara para decidir si un hallazgo debe transformarse en intervención.

UI-012 resuelve esa brecha diseñando un flujo intermedio que evita tres errores:

1. crear trabajos automáticamente;
2. confundir hallazgo con trabajo;
3. crear cobros, sesiones o acciones por efecto secundario.

## Ubicación del flujo

La acción `Evaluar trabajo` debe ubicarse dentro del contexto del hallazgo operativo en `DetalleRevisionesPanel`.

Ubicaciones recomendadas:

1. Dentro del modal `Ver hallazgo`, como acción secundaria destacada.
2. Dentro de la tarjeta/resumen de hallazgo existente, si el diseño muestra hallazgos embebidos bajo el aspecto.
3. Nunca como acción global desde `TrabajosCasoPanel` ni desde una ruta independiente.

La ruta visual correcta es:

```text
Caso
→ Detalle de revisión
→ Aspecto revisado
→ Hallazgo registrado
→ Evaluar trabajo
→ Confirmación manual
→ Trabajo creado
```

## Estados visuales del hallazgo

### `Pendiente de trabajo`

Estado principal para habilitar la acción.

- Botón: `Evaluar trabajo`
- Estado: habilitado.
- Microcopy: `Este hallazgo fue marcado para evaluar intervención.`
- Acción recomendada: abrir modal de evaluación.

### `Activo`

Puede evaluarse, pero con advertencia.

- Botón: `Evaluar trabajo`
- Estado: habilitado con advertencia previa.
- Microcopy: `Este hallazgo está activo, pero aún no está marcado como pendiente de trabajo.`
- Acción recomendada: permitir evaluar, solicitando confirmación.

### `En observación`

Debe ser secundario o pedir confirmación fuerte.

- Botón: `Evaluar trabajo`
- Estado: secundario o deshabilitado según decisión clínica.
- Microcopy: `Este hallazgo está en observación. Evalúa si corresponde anticipar una intervención.`
- Acción recomendada: abrir evaluación solo con confirmación.

### `Cerrado`

No debe iniciar trabajo nuevo de forma normal.

- Botón: no visible o deshabilitado.
- Microcopy: `Hallazgo cerrado. No se recomienda crear trabajo desde este registro.`
- Acción recomendada: permitir solo ver historial.

### `Descartado`

No debe permitir crear trabajo.

- Botón: no visible o deshabilitado.
- Microcopy: `Hallazgo descartado. No corresponde generar intervención.`
- Acción recomendada: no abrir evaluación.

## Flujo principal

1. El terapeuta abre la ficha del caso.
2. Entra al detalle de revisión.
3. Abre un hallazgo mediante `Ver hallazgo`.
4. Presiona `Evaluar trabajo`.
5. El sistema abre un modal/panel de evaluación.
6. El modal muestra resumen clínico completo del hallazgo.
7. El sistema advierte que no todo hallazgo requiere trabajo.
8. Si no existe trabajo asociado, se muestra formulario de evaluación/preparación.
9. Si existe trabajo asociado, se muestra advertencia y opción `Ver trabajo existente`.
10. El terapeuta completa manualmente los campos requeridos.
11. Presiona `Crear trabajo`.
12. El sistema confirma creación del trabajo con `revision_hallazgo_origen_id`.
13. La UI ofrece ir al trabajo creado o volver al hallazgo.

## Modal de evaluación

Nombre recomendado:

`Evaluar trabajo desde hallazgo`

Estructura sugerida:

1. Encabezado.
2. Advertencia clínica breve.
3. Resumen del hallazgo.
4. Estado de duplicidad/trabajo existente.
5. Campos sugeridos y campos manuales.
6. Confirmación explícita.
7. Botones de acción.

Texto de cabecera:

> Evalúa si este hallazgo requiere una intervención formal. El sistema no creará un trabajo hasta que confirmes manualmente.

## Datos heredados desde hallazgo

El modal debe mostrar como resumen, no como campos editables iniciales:

- caso;
- revisión;
- elemento;
- área;
- aspecto;
- categoría;
- prioridad;
- estado;
- descripción;
- seguimiento.

Datos técnicos heredables para payload futuro:

- `paciente_id`;
- `caso_id`;
- `revision_inicial_id` desde `revision_id`;
- `revision_hallazgo_origen_id`;
- `elemento_caso_id` como contexto;
- `prioridad_trabajo` sugerida desde `prioridad_hallazgo`;
- `requiere_seguimiento` sugerido desde el hallazgo.

## Campos manuales requeridos

El terapeuta debe completar o confirmar manualmente:

- nombre del trabajo;
- tipo de trabajo;
- ámbito de trabajo;
- modalidad de ejecución;
- alcance del trabajo;
- método principal;
- objetivo del trabajo;
- descripción del plan;
- prioridad del trabajo;
- fase inicial;
- si requiere revisión previa;
- si requiere revisión posterior;
- si requiere seguimiento;
- próxima acción;
- observaciones;
- notas internas.

Campos sugeridos, pero no asumidos automáticamente:

- nombre del trabajo desde categoría/tipo del hallazgo;
- objetivo desde descripción del hallazgo;
- prioridad desde prioridad del hallazgo;
- observaciones desde observaciones o información canalizada.

## Advertencias clínicas

Advertencias obligatorias del flujo:

> No todo hallazgo requiere trabajo.

> Este hallazgo no crea un trabajo automáticamente.

> El terapeuta debe confirmar manualmente la intervención.

> Crear un trabajo no crea cobros, sesiones ni acciones automáticamente.

Cuando el hallazgo no esté en `Pendiente de trabajo`:

> Este hallazgo no está marcado como pendiente de trabajo. Puedes evaluarlo, pero confirma que realmente requiere intervención.

Cuando el hallazgo esté `En observación`:

> Este hallazgo está en observación. Crear un trabajo puede anticipar una intervención antes de completar seguimiento.

## Prevención de duplicados

Antes de permitir crear trabajo, el flujo debe consultar si existen trabajos con el mismo `revision_hallazgo_origen_id`.

Si ya existe trabajo asociado:

- mostrar bloque de advertencia;
- ocultar `Crear trabajo` como acción primaria;
- mostrar `Ver trabajo existente`;
- permitir crear otro trabajo solo si una regla futura lo habilita con confirmación fuerte.

Microcopy:

> Ya existe un trabajo asociado a este hallazgo. Revisa el trabajo existente antes de crear una nueva intervención.

Para primera versión, la recomendación UX es no promover varios trabajos desde el mismo hallazgo. Si se permite, debe quedar como acción avanzada y no como camino principal.

## Botones y acciones

### Cancelar

Cierra el modal sin cambios.

### Guardar evaluación

Opcional. Sirve si en la implementación futura se decide guardar una evaluación previa sin crear trabajo. Para primera versión puede quedar fuera si no existe soporte de persistencia.

### Crear trabajo

Acción final, no inicial. Solo aparece después de revisar advertencias y completar campos manuales.

### Ver trabajo existente

Se muestra cuando ya existe trabajo asociado al hallazgo.

### Volver al hallazgo

Cierra el flujo de evaluación y vuelve al modal/resumen del hallazgo.

## Mensajes del sistema

### Éxito

> Trabajo creado correctamente desde este hallazgo.

> El trabajo quedó asociado al hallazgo origen y aparecerá en Trabajos del caso.

### Error de validación

> Completa los campos obligatorios antes de crear el trabajo.

> No se puede crear trabajo desde un hallazgo cerrado o descartado.

> Ya existe un trabajo asociado a este hallazgo. Revisa el trabajo existente antes de continuar.

### Error técnico

> No fue posible preparar la evaluación de trabajo. Intenta nuevamente.

> No fue posible crear el trabajo. Revisa la información y vuelve a intentar.

## Flujo posterior a creación de trabajo

Después de crear el trabajo, la pantalla debe mostrar:

1. confirmación de éxito;
2. nombre del trabajo creado;
3. estado inicial del trabajo;
4. vínculo al hallazgo origen;
5. botones:
   - `Ver trabajo`;
   - `Volver al hallazgo`;
   - `Cerrar`.

El trabajo debe aparecer luego en `TrabajosCasoPanel`.

No se deben crear automáticamente:

- cobros;
- sesiones;
- acciones;
- agenda;
- pagos.

## Casos límite

1. Hallazgo `Activo` sin marca de pendiente de trabajo.
2. Hallazgo `En observación` que el terapeuta decide evaluar anticipadamente.
3. Hallazgo `Cerrado`.
4. Hallazgo `Descartado`.
5. Hallazgo sin prioridad.
6. Hallazgo sin seguimiento.
7. Hallazgo con trabajo existente.
8. Hallazgo con datos incompletos de contexto visual.
9. Error al consultar trabajos asociados.
10. Usuario cierra modal a mitad del flujo.

## Riesgos UX

- Usar `Crear trabajo` como primera acción y provocar automatismo.
- No mostrar resumen suficiente del hallazgo antes de decidir.
- Ocultar que ya existe trabajo asociado.
- Mezclar creación de trabajo con creación de sesiones, acciones o cobros.
- Permitir intervención desde hallazgos cerrados o descartados.
- Mostrar demasiados campos técnicos sin guía visual.
- Hacer que el terapeuta complete IDs o relaciones técnicas manualmente.
- No diferenciar evaluación previa de trabajo creado.

## Qué queda fuera de alcance

Queda fuera de UI-012:

- implementación React;
- cambios CSS;
- migraciones;
- tabla puente `trabajo_hallazgos`;
- creación funcional de trabajos;
- creación de sesiones;
- creación de acciones;
- creación de cobros;
- cambios en RLS;
- cambios en `.env`;
- pruebas locales;
- merge a `main`.

## Recomendación final

UI-012 queda aprobado con observaciones como diseño visual.

La recomendación es implementar posteriormente un flujo de evaluación en dos tiempos:

1. `Evaluar trabajo`: revisar hallazgo, advertencias y duplicidad.
2. `Crear trabajo`: acción final, manual y confirmada por terapeuta.

El botón debe vivir junto al hallazgo operativo dentro de `DetalleRevisionesPanel`, preferentemente en el modal `Ver hallazgo` y/o en la tarjeta del hallazgo. La primera versión debe usar `trabajos.revision_hallazgo_origen_id` y no crear tabla puente.

## Checklist UI

- [ ] Botón `Evaluar trabajo` ubicado dentro del contexto del hallazgo.
- [ ] Estados visuales definidos para `Pendiente de trabajo`, `Activo`, `En observación`, `Cerrado` y `Descartado`.
- [ ] Modal de evaluación definido.
- [ ] Resumen del hallazgo visible antes de decidir.
- [ ] Advertencias clínicas visibles.
- [ ] Duplicado por trabajo existente considerado.
- [ ] Campos heredados separados de campos manuales.
- [ ] Botones definidos.
- [ ] Mensajes de éxito/error definidos.
- [ ] Flujo posterior a creación diseñado.
- [ ] Fuera de alcance explícito.

## Conclusión

UI-012 define el diseño del flujo `Evaluar trabajo`, no su implementación.

El flujo debe partir desde un hallazgo operativo dentro de `DetalleRevisionesPanel`. El botón debe llamarse `Evaluar trabajo`, no `Crear trabajo`, porque el terapeuta debe confirmar manualmente si el hallazgo amerita intervención.

La creación futura del trabajo debe usar `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal. No se crea tabla puente `trabajo_hallazgos` en esta etapa. Crear un trabajo no crea cobros, sesiones ni acciones automáticamente.
