# BE-010 — Plan técnico de hallazgos operativos

## Estado

Aprobado con observaciones.

## Fecha

2026-06-13.

## Rama auditada

`main`.

## Fuente del informe

Este documento consolida el informe BE-010 entregado por Integración estructura / backend. La tarea se ejecutó como plan técnico para definir el soporte operativo mínimo de `revision_hallazgos` dentro del detalle de revisión, sin implementar cambios de código, migraciones ni base de datos.

## Resumen ejecutivo

BE-010 revisa el soporte técnico mínimo para operar `revision_hallazgos` dentro del detalle de revisión, respetando que los hallazgos nacen desde aspectos revisados y viven dentro del caso.

La conclusión principal es que la tabla `revision_hallazgos` ya cuenta con la trazabilidad crítica para operar hallazgos asociados a paciente, caso, revisión, elemento de revisión, elemento del caso y aspecto revisado. Por lo tanto, para el soporte mínimo operativo no se requiere crear una nueva migración en esta etapa.

La brecha principal no está en la base de datos, sino en el flujo operativo frontend/servicio: actualmente el detalle de revisión permite registrar aspectos revisados, pero no existe una acción clara para marcar un aspecto como hallazgo clínicamente relevante ni para crear/listar hallazgos dentro de `DetalleRevisionesPanel`.

BE-010 recomienda implementar posteriormente un flujo guiado en el detalle de revisión: desde cada aspecto revisado, el terapeuta debería poder crear un hallazgo, revisar hallazgos ya registrados, evitar duplicados visibles y dejar preparado el camino para BE-011, donde se analizará la conversión hallazgo a trabajo.

## Documentos revisados

- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`
- `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`
- `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`
- `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

## Archivos revisados

### Migraciones relacionadas

- `supabase/migrations/20260606041000_crear_tabla_revision_elementos.sql`
- `supabase/migrations/20260606042000_crear_tabla_revision_aspectos.sql`
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`
- `supabase/migrations/20260606050000_ampliar_revision_cuerpos_sutiles_y_traumas.sql`
- `supabase/migrations/20260606055000_activar_rls_y_policies.sql`

### Componentes React relacionados

- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/RevisionesCasoPanel.tsx`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- Paneles relacionados a elementos, revisiones, trabajos y pagos del caso.

### Documentación técnica relacionada

- BE-001.
- BE-002.
- BE-003.
- DEC-006 a DEC-012.
- UI-011 como coordinación necesaria para diseño visual del panel de hallazgos.

## Estado actual de `revision_hallazgos`

`revision_hallazgos` ya existe como tabla backend y está orientada correctamente a registrar hallazgos clínicamente relevantes derivados de aspectos revisados.

Campos críticos confirmados como parte de la trazabilidad:

- `paciente_id`
- `caso_id`
- `revision_id`
- `revision_elemento_id`
- `revision_aspecto_id`
- `elemento_caso_id`

La tabla exige relación con `revision_aspectos`, por lo que el hallazgo no nace aislado, sino conectado al detalle técnico de lo revisado. Esto respeta DEC-007 y DEC-008.

El modelo actual permite responder:

- Qué paciente tiene el hallazgo.
- En qué caso vive.
- En qué revisión se detectó.
- Sobre qué elemento del caso se detectó.
- En qué elemento de revisión se registró.
- Desde qué aspecto revisado nace.

El problema vigente es que esta tabla no tiene operación visual ni flujo de creación desde la UI actual.

## Relaciones existentes

La relación central esperada es:

`casos`  
→ `revisiones`  
→ `revision_elementos`  
→ `revision_aspectos`  
→ `revision_hallazgos`

Relaciones funcionales:

- Un caso contiene revisiones.
- Una revisión contiene elementos revisados.
- Un elemento revisado apunta a un elemento real del caso.
- Un aspecto revisado registra lo medido, observado o canalizado.
- Un hallazgo registra solo aquello que se vuelve clínicamente relevante.
- Un hallazgo puede preparar una decisión futura, pero no genera trabajo automáticamente.

Relaciones confirmadas para hallazgos:

- Hallazgo a paciente.
- Hallazgo a caso.
- Hallazgo a revisión.
- Hallazgo a elemento del caso.
- Hallazgo a elemento de revisión.
- Hallazgo a aspecto revisado.

Esto permite mantener trazabilidad clínica suficiente para operar el módulo desde la ficha del caso.

## Brechas detectadas

### Brechas críticas

No se detectan brechas críticas bloqueantes para iniciar diseño operativo mínimo de hallazgos.

### Brechas medias

1. No existe UI operativa para crear hallazgos desde `DetalleRevisionesPanel`.
2. No existe acción visible tipo “Marcar como hallazgo” o “Crear hallazgo desde este aspecto”.
3. No existe listado contextual de hallazgos bajo cada aspecto revisado.
4. No existe panel/resumen de hallazgos dentro del detalle de revisión.
5. No existe servicio/hook dedicado para crear, listar o validar hallazgos.
6. No está confirmado que exista validación de duplicado a nivel aplicación.
7. No debe implementarse todavía conversión hallazgo a trabajo, porque corresponde a BE-011.
8. No debe crearse módulo principal independiente de hallazgos.

### Brechas menores

1. Falta definir etiquetas UI comprensibles para diferenciar aspecto revisado, hallazgo y trabajo.
2. Falta decidir si el hallazgo se crea con formulario compacto o modal.
3. Falta definir si se permitirá editar hallazgos desde el mismo detalle.
4. Falta definir si se mostrará estado, prioridad o seguimiento como chip visual.
5. Falta validar runtime RLS por roles al crear hallazgos.

## Flujo técnico recomendado

Flujo recomendado:

1. El terapeuta entra a la ficha del caso.
2. Abre una revisión.
3. Selecciona o crea un elemento revisado.
4. Registra uno o más aspectos revisados.
5. Desde un aspecto revisado, decide si existe un hallazgo clínicamente relevante.
6. Si existe, crea un registro en `revision_hallazgos`.
7. El sistema completa o envía explícitamente las relaciones:
   - `paciente_id`
   - `caso_id`
   - `revision_id`
   - `revision_elemento_id`
   - `revision_aspecto_id`
   - `elemento_caso_id`
8. El hallazgo queda visible dentro del detalle de revisión.
9. El hallazgo puede quedar solo como registro, seguimiento o antecedente.
10. La conversión a trabajo queda fuera de BE-010 y se prepara para BE-011.

## Flujo esperado desde UI

La acción “crear hallazgo” debe vivir dentro de `DetalleRevisionesPanel`, no en un módulo principal global.

Ubicación recomendada:

- Dentro de cada tarjeta/fila de aspecto revisado.
- Botón: “Crear hallazgo” o “Marcar como hallazgo”.
- Si ya existe hallazgo asociado, mostrar:
  - “Hallazgo registrado”.
  - Resumen breve.
  - Estado/prioridad si existe.
  - Acción “Ver detalle” o “Editar”, si se permite.

Estructura visual sugerida:

1. Revisión seleccionada.
2. Elemento del caso revisado.
3. Aspectos revisados.
4. Por cada aspecto:
   - Resultado del aspecto.
   - Presencia detectada.
   - Métrica o porcentaje si corresponde.
   - Observación.
   - Acción “Crear hallazgo”.
5. Sección contextual:
   - “Hallazgos de esta revisión”.
   - Agrupados por elemento o por aspecto origen.

La UI no debe presentar “Hallazgos” como módulo principal independiente de creación.

## Campos requeridos para operar hallazgos

### Campos mínimos para crear un hallazgo

- `paciente_id`
- `caso_id`
- `revision_id`
- `revision_elemento_id`
- `revision_aspecto_id`
- `elemento_caso_id`
- Descripción o detalle del hallazgo.
- Categoría o tipo de hallazgo, si existe en la tabla.
- Prioridad o relevancia, si existe en la tabla.
- Estado, si existe en la tabla.
- Observaciones, si existe en la tabla.
- Requiere seguimiento, si existe en la tabla.
- Requiere trabajo/intervención, solo como orientación, no como creación automática.

### Campos confirmados como críticos de trazabilidad

- `paciente_id`
- `caso_id`
- `revision_id`
- `revision_elemento_id`
- `revision_aspecto_id`
- `elemento_caso_id`

### Campos funcionales que deben verificarse antes de implementar

Antes de implementar BE-010 se debe confirmar en la migración exacta si existen campos para:

- Descripción del hallazgo.
- Tipo/categoría del hallazgo.
- Prioridad.
- Estado.
- Seguimiento.
- Observaciones.
- Notas internas.
- Marca de conversión futura a trabajo.
- Fechas de creación/actualización.

Si alguno no existe y resulta imprescindible para UI-011 o para operación clínica mínima, entonces Control de Desarrollo debe decidir si corresponde una migración posterior aplicando BE-003.

## Cambios necesarios en frontend

Cambios futuros recomendados, no implementados en BE-010:

1. Actualizar `DetalleRevisionesPanel`.
2. Agregar lectura de hallazgos asociados a la revisión o al aspecto.
3. Mostrar hallazgos dentro del detalle de revisión.
4. Agregar acción “Crear hallazgo” desde cada aspecto.
5. Crear formulario compacto o modal para registrar hallazgo.
6. Bloquear visualmente duplicados evidentes.
7. Mostrar estado del hallazgo.
8. Separar visualmente:
   - aspecto revisado;
   - hallazgo;
   - trabajo futuro.
9. Evitar navegación a un módulo principal de creación de hallazgos.
10. Preparar botón futuro “Convertir en trabajo” deshabilitado o no visible hasta BE-011.

## Cambios necesarios en servicios/hooks

Se recomienda crear un servicio/hook específico para hallazgos, en vez de dejar toda la lógica dentro del componente.

Nombre sugerido:

- `useRevisionHallazgos`
- o `revisionHallazgosService`

Operaciones mínimas sugeridas:

- `listarHallazgosPorRevision(revisionId)`
- `listarHallazgosPorAspecto(revisionAspectoId)`
- `crearHallazgoDesdeAspecto(payload)`
- `actualizarHallazgo(id, payload)`
- `validarHallazgoDuplicado(revisionAspectoId)`
- `obtenerHallazgoPorId(id)`

Responsabilidades del servicio/hook:

- Centralizar consultas Supabase.
- Evitar duplicación de lógica en UI.
- Asegurar payload consistente.
- Preparar validaciones antes de insertar.
- Facilitar pruebas posteriores.
- Mantener la UI más limpia.

## Cambios necesarios en tipos TypeScript

Sí se recomienda revisar/crear tipos TypeScript antes de implementación.

Tipos mínimos sugeridos:

```ts
type RevisionHallazgo = {
  id: string;
  paciente_id: string;
  caso_id: string;
  revision_id: string;
  revision_elemento_id: string;
  revision_aspecto_id: string;
  elemento_caso_id: string;
  descripcion?: string;
  tipo_hallazgo?: string;
  prioridad?: string;
  estado?: string;
  requiere_seguimiento?: boolean;
  observaciones?: string;
  notas_internas?: string;
  created_at?: string;
  updated_at?: string;
};
```

Payload sugerido:

```ts
type CrearRevisionHallazgoPayload = {
  paciente_id: string;
  caso_id: string;
  revision_id: string;
  revision_elemento_id: string;
  revision_aspecto_id: string;
  elemento_caso_id: string;
  descripcion: string;
  tipo_hallazgo?: string;
  prioridad?: string;
  estado?: string;
  requiere_seguimiento?: boolean;
  observaciones?: string;
  notas_internas?: string;
};
```

Estos tipos deben ajustarse a la estructura real de la tabla antes de implementar.

## ¿Requiere migración?

No para el soporte operativo mínimo de BE-010.

La tabla `revision_hallazgos` ya existe y cuenta con las relaciones críticas necesarias para operar hallazgos desde el detalle de revisión.

### Observación

Una migración posterior solo deberá evaluarse si falta un campo imprescindible, una constraint de duplicado, un índice, una vista o una policy RLS. En ese caso deberá aplicarse BE-003 antes de cualquier cambio.

Si Control de Desarrollo decide exigir validación SQL fuerte o campos adicionales, debe aplicarse BE-003 antes de crear cualquier migración.

### Si una migración posterior fuera necesaria

Debe justificarse por una de estas razones:

- Falta campo imprescindible para operar hallazgos.
- Falta constraint para evitar duplicado real.
- Falta índice necesario para listar por revisión/aspecto.
- Falta vista para lectura segura y simplificada.
- Falta policy específica para RLS.

No crearla todavía.

## Riesgos

1. Crear hallazgos fuera del detalle de revisión.
2. Convertir `revision_hallazgos` en un módulo principal independiente.
3. Crear hallazgos sin `revision_aspecto_id`.
4. Duplicar hallazgos para el mismo aspecto sin advertencia.
5. Mezclar hallazgo con trabajo/intervención.
6. Crear trabajos automáticamente desde hallazgos.
7. No validar RLS runtime por terapeuta/admin.
8. Sobrecargar `DetalleRevisionesPanel`.
9. Implementar UI antes de ajustar tipos.
10. Crear migración innecesaria sin aplicar BE-003.

## Recomendación técnica

Avanzar BE-010 como implementación frontend/servicio/tipos, sin migración inicial.

Orden recomendado:

1. Confirmar columnas exactas de `revision_hallazgos`.
2. Definir tipo TypeScript final.
3. Crear hook/servicio para hallazgos.
4. Leer hallazgos por revisión y por aspecto.
5. Agregar acción “Crear hallazgo” en `DetalleRevisionesPanel`.
6. Mostrar hallazgos en el detalle de revisión.
7. Validar duplicado a nivel UI/servicio.
8. Dejar preparado el objeto para BE-011, sin crear trabajos todavía.
9. Ejecutar build.
10. Abrir PR draft para revisión.

## Checklist para futura implementación

Antes de implementar:

- Confirmar rama de trabajo.
- Confirmar que no es `main`.
- Confirmar `.env` intacto.
- Confirmar que no se tocará Supabase remoto.
- Confirmar que no se ejecutará `supabase db push`.
- Confirmar columnas reales de `revision_hallazgos`.
- Confirmar tipos esperados.
- Confirmar RLS esperado.
- Confirmar que no se requiere migración inicial.
- Confirmar diseño con UI-011.
- Confirmar criterio con Control de Desarrollo.

Durante implementación:

- Crear hook/servicio.
- Leer hallazgos existentes.
- Crear hallazgo desde aspecto.
- Evitar duplicado visible.
- Mostrar hallazgo dentro del detalle.
- No crear módulo principal.
- No crear trabajo.
- No modificar migraciones.

Después de implementación:

- Probar creación local.
- Probar lectura por revisión.
- Probar lectura por aspecto.
- Probar caso sin hallazgos.
- Probar aspecto con hallazgo ya creado.
- Ejecutar `npm run build`.
- Abrir PR draft.
- Documentar restricciones respetadas.

## Coordinación necesaria con UI-011

UI-011 debe definir la experiencia visual específica de hallazgos dentro del detalle de revisión.

Puntos a coordinar:

- Ubicación exacta del botón “Crear hallazgo”.
- Si se usará modal, formulario inline o panel lateral.
- Cómo diferenciar aspecto revisado vs hallazgo.
- Cómo indicar que ya existe hallazgo para un aspecto.
- Cómo mostrar prioridad/estado.
- Cómo evitar sobrecargar visualmente el detalle.
- Cómo preparar una acción futura de “crear trabajo” sin activarla aún.
- Cómo mantener coherencia visual con la ficha del caso.

UI-011 no debe cambiar reglas clínicas ni crear nuevos campos sin validación de backend/control.

## Coordinación futura con BE-011

BE-011 debe analizar la trazabilidad hallazgo a trabajo.

BE-010 solo debe dejar preparado:

- Hallazgo visible.
- Hallazgo con ID disponible.
- Hallazgo vinculado a aspecto.
- Hallazgo vinculado a revisión/caso/elemento.
- Estado o prioridad consultable.
- Posible bandera visual de “requiere trabajo”, si ya existe en tabla.

BE-010 no debe:

- Crear trabajos.
- Crear tabla puente.
- Convertir hallazgos automáticamente.
- Decidir si un hallazgo puede originar múltiples trabajos.
- Resolver múltiples hallazgos por trabajo.

## Conclusión

BE-010 queda aprobado con observaciones como plan técnico.

`revision_hallazgos` parece suficiente para iniciar soporte operativo mínimo sin migración, porque ya mantiene trazabilidad hacia paciente, caso, revisión, elemento de revisión, elemento del caso y aspecto revisado.

La implementación futura debe concentrarse en `DetalleRevisionesPanel`, servicio/hook y tipos TypeScript.

No se debe crear módulo principal de hallazgos.

No se deben crear trabajos automáticamente.

BE-011 queda fuera de BE-010.

Antes de cualquier migración posterior, debe aplicarse BE-003.
