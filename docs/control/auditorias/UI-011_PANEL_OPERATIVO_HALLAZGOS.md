# UI-011 — Diseño del panel operativo de hallazgos

## Estado

Aprobado con observaciones

## Fecha

2026-06-13

## Rama auditada

`main`

## Fuente del informe

Este documento consolida el informe UI-011 entregado por UI / UX / Pulido visual. La tarea fue ejecutada como diseño de experiencia visual y operativa para el panel de hallazgos dentro del detalle de revisión, sin implementar código, estilos, migraciones ni cambios de base de datos.

## Resumen ejecutivo

UI-011 define la experiencia visual y operativa mínima para trabajar hallazgos dentro del detalle de revisión.

La recomendación central es que los hallazgos vivan dentro de `DetalleRevisionesPanel`, naciendo desde una tarjeta de aspecto revisado mediante una acción contextual: **Crear hallazgo** o **Marcar como hallazgo**.

No se recomienda crear un módulo principal de hallazgos, una ruta independiente ni una creación global desde el caso. El hallazgo debe conservar el contexto inmediato:

- caso;
- revisión;
- elemento del caso;
- elemento de revisión;
- aspecto revisado;
- resultado que lo origina.

La experiencia debe distinguir claramente tres niveles:

1. **Aspecto revisado:** lo que se revisó, midió, observó o canalizó.
2. **Hallazgo:** aquello clínicamente relevante que merece seguimiento, prioridad o posible derivación.
3. **Trabajo futuro:** intervención formal que puede nacer de un hallazgo, pero no automáticamente.

La solución visual recomendada es:

- botón contextual en cada tarjeta de aspecto;
- indicador visible cuando el aspecto ya tiene hallazgo;
- panel compacto de **Hallazgos de esta revisión** dentro de `DetalleRevisionesPanel`;
- formulario en modal o panel lateral compacto;
- botón futuro **Evaluar trabajo** visible solo como estado preparatorio o deshabilitado, no operativo todavía.

## Documentos revisados

- `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`
- `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`
- `docs/control/05_DECISIONES_PROYECTO.md`

## Archivos revisados

- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/RevisionesCasoPanel.tsx`
- `src/pages/casos/ElementosCasoPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`

## Diagnóstico UI actual

La ficha del caso ya integra correctamente los paneles internos:

- elementos del caso;
- revisiones;
- detalle de revisiones;
- trabajos/intervenciones;
- pagos;
- seguimiento.

`DetalleRevisionesPanel` actualmente carga revisiones, elementos, vínculos `revision_elementos` y aspectos revisados. También permite crear aspectos revisados con campos de área, estado, aspecto, método, tipo de medición, métrica, porcentaje, presencia, resultado, seguimiento, pendiente, información canalizada, observaciones y notas internas.

El listado actual de aspectos revisados es simple:

- título del aspecto;
- elemento asociado;
- número de revisión;
- estado;
- resultado o información canalizada;
- área;
- medición;
- valor.

La brecha UI es clara: el aspecto revisado no tiene ninguna acción contextual para marcarlo como hallazgo relevante. Tampoco existe un panel de hallazgos, ni indicador de hallazgo ya creado, ni prevención visual de duplicados.

El formulario actual de detalle ya es extenso. Por eso no conviene añadir otro formulario permanente en la misma columna, porque aumentaría la carga visual y reforzaría la confusión entre aspecto, hallazgo y trabajo.

## Ubicación recomendada del panel de hallazgos

El panel de hallazgos debe vivir dentro de `DetalleRevisionesPanel`, en la misma sección `#detalle-revisiones`.

Ubicación recomendada:

1. Mantener el listado principal de **Aspectos revisados**.
2. Dentro de cada tarjeta de aspecto, agregar una franja o bloque contextual de hallazgo.
3. Bajo el listado de aspectos, agregar un panel compacto: **Hallazgos de esta revisión**.
4. El formulario de creación debe abrirse desde el aspecto seleccionado, no mostrarse siempre.

Estructura visual sugerida dentro de `DetalleRevisionesPanel`:

```text
Detalle de revisiones
├─ Métricas
│  ├─ Total aspectos
│  ├─ Pendientes
│  ├─ Seguimiento
│  ├─ Presencias
│  └─ Hallazgos
│
├─ Listado: Aspectos revisados
│  ├─ Tarjeta de aspecto
│  │  ├─ Datos del aspecto
│  │  ├─ Resultado / medición
│  │  ├─ Estado del aspecto
│  │  └─ Acción contextual de hallazgo
│  │
│  └─ Tarjeta de aspecto con hallazgo
│     ├─ Datos del aspecto
│     ├─ Indicador: Hallazgo registrado
│     └─ Resumen breve del hallazgo
│
├─ Panel: Hallazgos de esta revisión
│  ├─ Agrupación por revisión
│  ├─ Agrupación por elemento
│  └─ Agrupación por aspecto origen
│
└─ Formulario: Nuevo detalle de revisión
```

No se recomienda poner hallazgos dentro de `RevisionesCasoPanel`, porque ahí se trabaja la revisión general, no el detalle derivado por aspecto.

No se recomienda poner hallazgos dentro de `TrabajosCasoPanel`, porque eso adelantaría la conversión hallazgo → trabajo y mezclaría niveles.

## Diseño propuesto del flujo visual

Flujo ideal:

1. El terapeuta entra a la ficha del caso.
2. Baja a **Detalle de revisiones**.
3. Visualiza aspectos revisados.
4. Identifica un aspecto clínicamente relevante.
5. Presiona **Crear hallazgo** desde la tarjeta del aspecto.
6. Se abre modal o panel lateral compacto.
7. El formulario hereda automáticamente:
   - paciente;
   - caso;
   - revisión;
   - elemento del caso;
   - elemento de revisión;
   - aspecto revisado.
8. El terapeuta completa solo datos clínicos del hallazgo.
9. Guarda el hallazgo.
10. La tarjeta del aspecto cambia a estado **Hallazgo registrado**.
11. El hallazgo aparece también en el panel **Hallazgos de esta revisión**.
12. La opción futura **Evaluar trabajo** queda visible como acción deshabilitada o etiqueta informativa, pero no crea trabajo.

## Acción “Crear hallazgo”

### Ubicación

La acción debe estar dentro de cada tarjeta de aspecto revisado, idealmente al final de la tarjeta, después del resumen del resultado y antes del cierre visual.

Ejemplo:

```text
[Aspecto revisado]
Cuerpo energético bloqueado
Elemento: Javier · Rev. 2
Estado: Revisado

Resultado:
Se detecta bloqueo alto en zona de campo energético.

Área: Cuerpo energético
Medición: Porcentaje
Valor: 80%

[Crear hallazgo]
```

### Tipo de control recomendado

Primera opción: **botón secundario contextual**.

Texto recomendado:

- `Crear hallazgo`
- `Marcar como hallazgo`
- `Registrar hallazgo relevante`

Opción preferida: **Crear hallazgo**, porque es directa y consistente con la acción de registrar.

### Por qué no menú contextual

No se recomienda menú contextual como primera versión porque el flujo debe ser explícito y fácil para el terapeuta. El menú contextual oculta la acción y puede dificultar el aprendizaje.

### Por qué no formulario inline permanente

No se recomienda formulario inline permanente porque `DetalleRevisionesPanel` ya contiene un formulario largo. Un segundo formulario siempre visible sobrecargaría la sección.

### Por qué modal o panel lateral compacto

Modal o panel lateral permiten mantener limpio el listado de aspectos y enfocar al terapeuta solo en el hallazgo seleccionado.

Recomendación final:

- desktop: panel lateral o modal ancho compacto;
- mobile: modal de pantalla completa o panel inferior;
- primera implementación simple: modal compacto reutilizando estilos `clinical-form`, `clinical-panel`, `clinical-field`, `clinical-button`.

## Visualización de hallazgos existentes

Cuando un aspecto ya tiene hallazgo asociado, la tarjeta debe cambiar visualmente:

```text
[Aspecto revisado]
Cuerpo energético bloqueado
Elemento: Javier · Rev. 2
Estado: Revisado

[Hallazgo registrado]
Bloqueo energético de alta intensidad
Prioridad: Alta · Estado: Activo · Seguimiento: Sí

[Ver hallazgo]
[Editar hallazgo] opcional
[Evaluar trabajo] próximamente
```

Elementos visibles mínimos:

- chip o badge: `Hallazgo registrado`;
- categoría;
- prioridad;
- estado;
- requiere seguimiento;
- resumen corto;
- acción `Ver hallazgo`;
- acción futura `Evaluar trabajo` deshabilitada o marcada como **Próximamente**.

Si hay más de un hallazgo por aspecto, debe mostrarse:

```text
2 hallazgos registrados
[Ver hallazgos]
```

Para evitar duplicidad, la primera versión debería tender a un hallazgo principal por aspecto, salvo que Backend/Control de Desarrollo validen múltiples hallazgos por aspecto.

## Prevención visual de duplicados

Prevención recomendada en capas:

### 1. Prevención visual

Si un aspecto ya tiene hallazgo:

- reemplazar botón `Crear hallazgo` por `Hallazgo registrado`;
- mostrar acción `Ver hallazgo`;
- mostrar acción `Editar` si se permite;
- ocultar o desactivar `Crear hallazgo`.

### 2. Advertencia contextual

Si se permite crear otro hallazgo desde el mismo aspecto:

> Este aspecto ya tiene un hallazgo registrado. Revisa el hallazgo existente antes de crear otro.

### 3. Confirmación explícita

Si se habilita **Crear otro hallazgo**, debe requerir confirmación:

> ¿Deseas registrar un segundo hallazgo desde el mismo aspecto? Úsalo solo si corresponde a una situación clínicamente distinta.

### 4. Validación futura desde servicio/hook

El hook/servicio sugerido por BE-010 debe validar duplicado por `revision_aspecto_id`.

Regla UI inicial recomendada:

- por defecto, un aspecto muestra un único hallazgo principal;
- múltiples hallazgos quedan como comportamiento avanzado posterior.

## Formulario visual sugerido

El formulario debe ser compacto y contextual. No debe pedir campos que la UI puede heredar automáticamente.

### Campos heredados, no editables

Mostrar como resumen, no como inputs:

- caso;
- revisión;
- elemento del caso;
- aspecto revisado;
- área;
- resultado del aspecto;
- medición/valor si existe.

Bloque superior sugerido:

```text
Crear hallazgo desde aspecto revisado

Origen:
Revisión 2 · Elemento: Javier
Aspecto: Cuerpo energético bloqueado
Área: Cuerpo energético
Resultado: Se detecta bloqueo alto...
```

### Campos editables mínimos

1. **Categoría del hallazgo**  
   Select obligatorio. Opciones actuales según tabla:
   - Cuerpo inestable
   - Bloqueo
   - Trabajo energético
   - Magia negra
   - Entidad/Presencia
   - Abundancia afectada
   - Protección debilitada
   - Vínculo afectado
   - Linaje afectado
   - Hogar/Espacio afectado
   - Información canalizada
   - Otro

2. **Descripción del hallazgo**  
   Textarea obligatorio. Debe explicar qué se detectó y por qué es relevante.

3. **Prioridad**  
   Select opcional:
   - Baja
   - Media
   - Alta
   - Urgente

4. **Estado**  
   Select obligatorio con valor inicial `Activo`:
   - Activo
   - En observación
   - Pendiente de trabajo
   - Cerrado
   - Descartado

5. **Requiere seguimiento**  
   Checkbox.

### Campos secundarios plegables

En acordeón **Más detalle**:

- tipo hallazgo;
- subtipo hallazgo;
- intensidad hallazgo %;
- nivel bloqueo %;
- origen sugerido;
- fuente detección;
- nivel confirmación;
- información canalizada;
- observaciones;
- notas internas.

### Campos que no deben aparecer como editables

No pedir manualmente:

- `paciente_id`;
- `caso_id`;
- `revision_id`;
- `revision_elemento_id`;
- `revision_aspecto_id`;
- `elemento_caso_id`.

Esos valores deben venir del aspecto seleccionado.

## Microcopy recomendado

### Diferencia entre aspecto revisado y hallazgo

Texto corto para cabecera del panel:

> Un aspecto revisado registra lo que fue observado o medido. Un hallazgo guarda solo aquello que necesita destacarse, seguirse o evaluarse para una posible intervención.

### En tarjeta sin hallazgo

> Si este resultado es clínicamente relevante, puedes registrarlo como hallazgo.

Botón:

> Crear hallazgo

### En tarjeta con hallazgo

> Este aspecto ya tiene un hallazgo registrado.

Botones:

> Ver hallazgo  
> Editar hallazgo

### Para trabajo futuro

> Un hallazgo no crea un trabajo automáticamente. Primero debe evaluarse si requiere intervención.

Botón futuro deshabilitado:

> Evaluar trabajo próximamente

### Estado vacío de hallazgos

> Aún no hay hallazgos registrados en esta revisión. Los hallazgos se crean desde un aspecto revisado cuando el resultado requiere seguimiento, prioridad o posible intervención.

### Advertencia de duplicado

> Ya existe un hallazgo asociado a este aspecto. Revisa el registro antes de crear uno nuevo.

### Ayuda en formulario

> Describe solo lo clínicamente relevante. No repitas todo el detalle del aspecto si no aporta al seguimiento.

## Estados visuales necesarios

### Estados del panel

- Cargando hallazgos.
- Sin hallazgos.
- Hallazgos disponibles.
- Error al cargar hallazgos.
- Guardando hallazgo.
- Hallazgo guardado correctamente.
- Error al guardar hallazgo.

### Estados por aspecto revisado

- Sin hallazgo.
- Con hallazgo registrado.
- Con hallazgo pendiente de seguimiento.
- Con hallazgo pendiente de trabajo.
- Hallazgo cerrado.
- Hallazgo descartado.

### Estados del botón

- `Crear hallazgo`: activo.
- `Crear hallazgo`: deshabilitado si faltan relaciones.
- `Hallazgo registrado`: informativo.
- `Ver hallazgo`: activo.
- `Editar hallazgo`: opcional.
- `Evaluar trabajo`: deshabilitado/próximamente.

### Estados de formulario

- Inicial.
- Validación incompleta.
- Guardando.
- Error.
- Guardado.
- Duplicado detectado.

## Relación visual entre aspecto, hallazgo y trabajo

La UI debe mostrar una relación jerárquica clara:

```text
Aspecto revisado
↓
Hallazgo relevante
↓
Posible trabajo futuro
```

### Aspecto revisado

Debe verse como registro técnico/clínico de lo revisado.

Indicadores:

- área;
- método;
- medición;
- valor;
- presencia;
- resultado;
- estado.

Color/tono sugerido: neutro clínico.

### Hallazgo

Debe verse como alerta clínica o punto destacado.

Indicadores:

- categoría;
- descripción;
- prioridad;
- estado;
- seguimiento;
- origen desde aspecto.

Color/tono sugerido: énfasis suave, no alarmista. Puede usar badge más visible que el aspecto, pero sin convertir todo en alerta crítica.

### Trabajo futuro

Debe verse como decisión posterior, no como consecuencia automática.

Indicadores:

- acción deshabilitada;
- etiqueta **Próximamente**;
- mensaje: **Requiere evaluación antes de crear trabajo**.

Color/tono sugerido: secundario o muted.

## Diseño responsive recomendado

### Desktop

Recomendación:

- listado de aspectos a la izquierda;
- formulario de nuevo detalle a la derecha;
- panel de hallazgos debajo del listado o como sección intermedia;
- modal/panel lateral para crear hallazgo.

La tarjeta de aspecto puede mostrar acciones en línea.

### Tablet

Recomendación:

- mantener tarjetas de aspecto en una columna;
- botón `Crear hallazgo` visible bajo el resumen;
- panel de hallazgos debajo del listado;
- modal centrado o drawer.

### Mobile

Recomendación:

- evitar panel lateral fijo;
- usar modal de pantalla completa o bottom sheet;
- mostrar solo datos esenciales del aspecto antes del formulario;
- ocultar campos secundarios en acordeón;
- mantener botones grandes:
  - Cancelar;
  - Guardar hallazgo.

## Riesgos UI/UX

1. Sobrecargar `DetalleRevisionesPanel` con demasiadas secciones.
2. Confundir aspecto revisado con hallazgo.
3. Confundir hallazgo con trabajo.
4. Crear trabajos automáticamente desde hallazgos.
5. Crear hallazgos duplicados desde un mismo aspecto.
6. Mostrar demasiados campos técnicos en el formulario inicial.
7. Convertir hallazgos en módulo principal independiente.
8. Usar microcopy técnico como `revision_hallazgos`, `revision_aspecto_id` o `Supabase local` en la UI final.
9. Permitir creación de hallazgo sin aspecto asociado.
10. Mostrar el botón **Crear hallazgo** en revisiones generales en vez de aspectos específicos.

## Qué NO debe implementarse en UI-011

UI-011 es diseño, no implementación.

No debe implementarse todavía:

- código React;
- cambios CSS;
- servicios/hooks;
- tipos TypeScript;
- migraciones;
- creación real de hallazgos;
- edición real de hallazgos;
- borrado de hallazgos;
- módulo principal de hallazgos;
- ruta `/hallazgos`;
- dashboard global de hallazgos;
- conversión hallazgo → trabajo;
- creación automática de trabajos;
- cambios en `TrabajosCasoPanel`;
- cambios en backend;
- cambios en RLS;
- cambios en datos reales.

## Coordinación necesaria con BE-010

BE-010 ya concluyó que no se requiere migración inicial para soporte operativo mínimo.

UI-011 debe coordinarse con BE-010 en estos puntos:

1. Confirmar columnas reales de `revision_hallazgos`.
2. Definir tipo TypeScript final.
3. Crear hook/servicio futuro:
   - `useRevisionHallazgos`;
   - o `revisionHallazgosService`.
4. Listar hallazgos por revisión.
5. Listar hallazgos por aspecto.
6. Crear hallazgo desde aspecto.
7. Validar duplicado por `revision_aspecto_id`.
8. Mantener la UI limpia y evitar lógica Supabase dispersa dentro del componente.

La futura implementación debe evitar meter toda la lógica directamente en `DetalleRevisionesPanel`.

## Coordinación futura con BE-011

BE-011 debe encargarse de la trazabilidad hallazgo → trabajo.

UI-011 solo debe dejar preparado visualmente el camino, sin activar la conversión.

Puntos para BE-011:

- decidir si un trabajo puede nacer de uno o varios hallazgos;
- definir relación entre trabajo y hallazgo origen;
- definir si se requiere tabla intermedia;
- definir cuándo un hallazgo queda en estado `Pendiente de trabajo`;
- definir experiencia futura de conversión;
- definir si el botón será:
  - `Evaluar trabajo`;
  - `Crear trabajo desde hallazgo`;
  - `Vincular a trabajo existente`.

Hasta BE-011, la UI solo puede mostrar:

> Evaluar trabajo próximamente

O:

> Pendiente de trabajo

sin crear registros de trabajo.

## Recomendación final

UI-011 queda aprobado con observaciones como diseño operativo.

La recomendación final es implementar posteriormente un patrón de **hallazgo contextual por aspecto revisado**, con:

- acción visible en cada tarjeta de aspecto;
- modal/panel compacto para crear hallazgo;
- indicador de hallazgo registrado;
- panel resumen de hallazgos dentro de `DetalleRevisionesPanel`;
- prevención visual de duplicados;
- separación clara entre aspecto, hallazgo y trabajo;
- botón futuro de trabajo deshabilitado o no visible hasta BE-011.

No debe existir módulo principal independiente de hallazgos.  
No debe crearse trabajo automáticamente.  
No debe modificarse backend ni migraciones para la primera implementación mínima.  
La implementación futura debe coordinarse con el hook/servicio definido en BE-010.

## Checklist para futura implementación

### Antes de implementar

- Confirmar rama de trabajo.
- Confirmar que no se trabajará sobre `main`.
- Confirmar `.env` intacto.
- Confirmar que no se tocará Supabase remoto.
- Confirmar que no se ejecutará `supabase db push`.
- Confirmar columnas reales de `revision_hallazgos`.
- Confirmar tipos TypeScript.
- Confirmar diseño UI-011 aprobado por Control de Desarrollo.
- Confirmar si se permite uno o varios hallazgos por aspecto.
- Confirmar microcopy final.

### Durante implementación

- Crear `RevisionHallazgo` type.
- Crear `CrearRevisionHallazgoPayload`.
- Crear hook/servicio `useRevisionHallazgos` o `revisionHallazgosService`.
- Leer hallazgos por revisión.
- Leer hallazgos por aspecto.
- Mapear hallazgos por `revision_aspecto_id`.
- Mostrar badge `Hallazgo registrado`.
- Agregar botón `Crear hallazgo` en tarjeta de aspecto.
- Abrir modal/panel compacto.
- Heredar IDs desde el aspecto.
- Evitar duplicado visual.
- Guardar hallazgo.
- Refrescar listado.
- Mostrar estado vacío.
- Mostrar errores.
- No crear trabajos.
- No crear módulo principal.

### Después de implementar

- Probar caso sin hallazgos.
- Probar aspecto sin hallazgo.
- Probar aspecto con hallazgo.
- Probar intento duplicado.
- Probar revisión con varios hallazgos.
- Probar hallazgos agrupados por elemento.
- Probar responsive desktop/tablet/mobile.
- Ejecutar build.
- Abrir PR draft.
- Registrar restricciones respetadas.

## Conclusión

UI-011 define diseño, no implementación.

El panel debe vivir dentro de `DetalleRevisionesPanel`.  
La acción debe nacer desde cada aspecto revisado.  
No debe existir módulo principal independiente de hallazgos.  
No debe crear trabajos automáticamente.  
La conversión hallazgo → trabajo queda para BE-011.  
La futura implementación debe coordinarse con el hook/servicio sugerido en BE-010.
