# BE-011 — Trazabilidad hallazgo a trabajo

## Estado

Aprobado con observaciones.

## Fecha

2026-06-16.

## Rama revisada

`main`.

## Resumen ejecutivo

BE-011 analiza la trazabilidad técnica entre `revision_hallazgos` y `trabajos`, sin implementar cambios.

La estructura actual ya permite vincular un trabajo a un hallazgo mediante `trabajos.revision_hallazgo_origen_id`. Esa columna es suficiente para una primera versión donde un trabajo nace desde un hallazgo principal.

Además, `trabajo_elementos.revision_hallazgo_id` y `trabajo_acciones.revision_hallazgo_id` permiten conservar trazabilidad más granular cuando una intervención afecta elementos o acciones concretas relacionadas con hallazgos específicos.

No se requiere migración inmediata para una primera implementación controlada. La migración de una tabla puente futura solo debería evaluarse si se confirma la necesidad real de modelar muchos hallazgos originando un mismo trabajo o muchos trabajos derivados de un mismo conjunto de hallazgos de forma formal, auditable y no ambigua.

La implementación futura debe evitar creación automática de trabajos. El terapeuta debe evaluar el hallazgo, decidir si amerita intervención, completar manualmente el plan de trabajo y confirmar la creación.

## Documentos revisados

- `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`
- `docs/control/auditorias/UI-011_PANEL_OPERATIVO_HALLAZGOS.md`
- `docs/control/05_DECISIONES_PROYECTO.md`

## Archivos revisados

- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`
- `supabase/migrations/20260606051000_crear_modulo_trabajos.sql`
- `src/hooks/useRevisionHallazgos.ts`
- `src/types/revisionHallazgos.ts`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`
- `docs/control/auditorias/UI-011_PANEL_OPERATIVO_HALLAZGOS.md`
- `docs/control/05_DECISIONES_PROYECTO.md`

## Estado actual de revision_hallazgos

`revision_hallazgos` existe y registra hallazgos clínicamente relevantes derivados de aspectos revisados.

Campos principales actuales:

- `id_revision_hallazgo`
- `paciente_id`
- `caso_id`
- `revision_id`
- `revision_elemento_id`
- `revision_aspecto_id`
- `elemento_caso_id`
- `categoria_hallazgo`
- `tipo_hallazgo`
- `subtipo_hallazgo`
- `descripcion_hallazgo`
- `intensidad_hallazgo_porcentaje`
- `nivel_bloqueo_porcentaje`
- `origen_sugerido`
- `fuente_deteccion`
- `nivel_confirmacion`
- `requiere_seguimiento`
- `prioridad_hallazgo`
- `estado_hallazgo`
- `informacion_canalizada`
- `observaciones`
- `notas_internas`
- `created_at`
- `updated_at`

La tabla ya valida consistencia relacional contra `revision_aspectos`, asegurando que paciente, caso, revisión, elemento de revisión y elemento del caso coincidan con el aspecto origen.

Estados disponibles del hallazgo:

- `Activo`
- `En observación`
- `Pendiente de trabajo`
- `Cerrado`
- `Descartado`

Para BE-011, el estado más relevante es `Pendiente de trabajo`, porque expresa intención clínica de evaluar intervención sin crearla automáticamente.

## Estado actual de trabajos

`trabajos` ya existe como tabla de intervención/proceso.

Campos relevantes para trazabilidad:

- `id_trabajo`
- `paciente_id`
- `caso_id`
- `revision_inicial_id`
- `revision_cierre_id`
- `revision_hallazgo_origen_id`
- `fecha_inicio`
- `numero_trabajo`
- `nombre_trabajo`
- `tipo_trabajo`
- `ambito_trabajo`
- `modalidad_ejecucion`
- `fase_actual`
- `alcance_trabajo`
- `metodo_principal`
- `objetivo_trabajo`
- `descripcion_plan`
- `frecuencia_planificada`
- `prioridad_trabajo`
- `requiere_revision_previa`
- `requiere_revision_posterior`
- `requiere_seguimiento`
- `estado_trabajo`

La columna clave es:

`revision_hallazgo_origen_id`

Esta columna permite que un trabajo tenga un hallazgo origen principal.

Además, `trabajo_elementos` contiene:

`revision_hallazgo_id`

Y `trabajo_acciones` también contiene:

`revision_hallazgo_id`

Esto permite trazabilidad adicional por elemento trabajado y por acción concreta, sin necesidad inmediata de crear una tabla puente.

## Relación técnica existente

Relación principal actual:

`revision_hallazgos.id_revision_hallazgo`  
→ `trabajos.revision_hallazgo_origen_id`

Relaciones secundarias existentes:

`revision_hallazgos.id_revision_hallazgo`  
→ `trabajo_elementos.revision_hallazgo_id`

`revision_hallazgos.id_revision_hallazgo`  
→ `trabajo_acciones.revision_hallazgo_id`

Validaciones existentes:

- El trabajo debe pertenecer al mismo paciente y caso que el caso asociado.
- Si el trabajo tiene `revision_hallazgo_origen_id`, el hallazgo debe existir.
- El hallazgo origen debe pertenecer al mismo paciente y caso del trabajo.
- Si un `trabajo_elemento` referencia un hallazgo, ese hallazgo debe pertenecer al mismo paciente, caso y elemento.
- Si una `trabajo_accion` referencia un hallazgo, ese hallazgo debe pertenecer al mismo paciente, caso y elemento de la acción.

## ¿Existe trazabilidad directa?

Sí.

Existe trazabilidad directa mediante:

`trabajos.revision_hallazgo_origen_id`

Esta columna es suficiente para una primera versión donde el terapeuta crea un trabajo desde un hallazgo principal.

No cubre formalmente una relación muchos-a-muchos entre trabajos y hallazgos. Para eso, una versión futura podría requerir una tabla puente.

## Escenarios de relación

### Un hallazgo → un trabajo

Este es el escenario recomendado para primera versión.

Un hallazgo relevante se evalúa, el terapeuta decide crear un trabajo, y el trabajo guarda:

`revision_hallazgo_origen_id = id_revision_hallazgo`

Ventajas:

- Simple.
- Ya soportado por la estructura actual.
- No requiere migración.
- Respeta DEC-009.
- Permite trazabilidad clara.
- Evita sobrediseñar el flujo inicial.

### Un hallazgo → varios trabajos

Técnicamente es posible porque no hay una restricción única que impida que varios trabajos apunten al mismo `revision_hallazgo_origen_id`.

Clínicamente debe usarse con cautela.

Ejemplos donde podría tener sentido:

- Un hallazgo detecta daño energético general y se decide separar intervención personal y de hogar.
- Un hallazgo revela varios frentes de trabajo, pero se decide abrir procesos separados.
- Un primer trabajo queda incompleto y se abre un segundo trabajo posterior.

Riesgo:

- Duplicar intervenciones.
- Duplicar cobros.
- Fragmentar el seguimiento.
- Confundir qué trabajo resolvió el hallazgo.

Para primera versión, debe permitirse solo con advertencia o revisión explícita, no como flujo automático.

### Varios hallazgos → un trabajo

La estructura actual no tiene una tabla puente formal para representar muchos hallazgos como origen conjunto de un trabajo.

Puede resolverse parcialmente con:

- `trabajos.revision_hallazgo_origen_id` como hallazgo principal.
- `trabajo_elementos.revision_hallazgo_id` para hallazgos asociados por elemento.
- `trabajo_acciones.revision_hallazgo_id` para trazabilidad en acciones específicas.

Esto puede ser suficiente para primera versión si se define que todo trabajo tiene un hallazgo origen principal y, opcionalmente, hallazgos asociados a elementos/acciones.

Si el flujo clínico exige declarar varios hallazgos como origen equivalente de un mismo trabajo, se requerirá tabla puente futura.

## Modelo recomendado para primera versión

Modelo recomendado:

1. Un trabajo puede nacer desde un hallazgo principal.
2. El trabajo guarda ese origen en `trabajos.revision_hallazgo_origen_id`.
3. El terapeuta debe completar manualmente los campos del trabajo.
4. El sistema puede precargar datos desde el hallazgo, pero no debe crear el trabajo automáticamente.
5. El hallazgo puede cambiar visualmente a estado `Pendiente de trabajo` antes de crear el trabajo.
6. La creación del trabajo debe requerir confirmación explícita.
7. Si ya existen trabajos asociados al mismo hallazgo, la UI debe advertirlo.
8. No crear tabla puente en esta primera versión.

Modelo conceptual:

`revision_aspectos`  
→ `revision_hallazgos`  
→ evaluación terapéutica manual  
→ `trabajos`

## Modelo recomendado para versión futura

Para una versión futura, si se confirma necesidad clínica real, evaluar tabla puente:

`trabajo_hallazgos`

Campos sugeridos futuros:

- `id_trabajo_hallazgo`
- `trabajo_id`
- `revision_hallazgo_id`
- `paciente_id`
- `caso_id`
- `elemento_caso_id`
- `rol_hallazgo_en_trabajo`
- `prioridad_en_trabajo`
- `observaciones`
- `created_at`
- `updated_at`

Posibles valores de `rol_hallazgo_en_trabajo`:

- `Origen principal`
- `Origen secundario`
- `Hallazgo asociado`
- `Hallazgo abordado parcialmente`
- `Hallazgo de seguimiento`
- `Hallazgo descartado para este trabajo`

Esta tabla puente no debe crearse ahora. Debe evaluarse solo si BE-011 o una tarea posterior confirma que `revision_hallazgo_origen_id` + `trabajo_elementos.revision_hallazgo_id` no basta.

## ¿Requiere migración?

No para la primera versión.

La estructura actual basta para una primera versión basada en un hallazgo origen principal por trabajo mediante `trabajos.revision_hallazgo_origen_id`.

No se debe crear migración ahora.

Una migración futura solo debería evaluarse si se confirma que:

- Un trabajo debe tener varios hallazgos origen equivalentes.
- Se necesita auditar múltiples hallazgos por trabajo de forma explícita.
- Se requiere impedir duplicidad con constraint SQL.
- Se requiere vista agregada para mostrar trabajos con hallazgo origen.
- Se requiere policy RLS específica.
- Se requiere tabla puente `trabajo_hallazgos`.

Toda migración futura debe aplicar BE-003.

## Flujo técnico recomendado

Flujo recomendado para primera implementación futura:

1. Terapeuta revisa un hallazgo dentro de `DetalleRevisionesPanel`.
2. El hallazgo debe estar en estado válido para evaluación.
3. Terapeuta presiona “Evaluar trabajo”.
4. La UI abre un flujo de evaluación, no crea trabajo inmediatamente.
5. El sistema muestra resumen del hallazgo:
   - caso;
   - revisión;
   - elemento;
   - aspecto origen;
   - categoría;
   - descripción;
   - prioridad;
   - seguimiento;
   - estado.
6. El sistema consulta si ya existen trabajos asociados a ese hallazgo.
7. Si no existen, permite preparar formulario de trabajo.
8. Si existen, advierte al terapeuta y permite:
   - ver trabajo existente;
   - vincular revisión/hallazgo a trabajo existente en versión futura;
   - crear trabajo nuevo solo con confirmación.
9. El formulario precarga campos sugeridos.
10. El terapeuta completa manualmente campos obligatorios.
11. Al confirmar, se inserta en `trabajos` con `revision_hallazgo_origen_id`.
12. No se crean sesiones ni acciones automáticamente.
13. No se crean cobros automáticamente.
14. El trabajo queda visible en `TrabajosCasoPanel`.

## Flujo esperado desde UI

Primera versión UI recomendada:

En `DetalleRevisionesPanel`, para hallazgos elegibles:

- Mostrar botón habilitado: `Evaluar trabajo`.
- No usar “Crear trabajo” como primer texto si aún falta evaluación.
- Al presionar, abrir modal o panel:
  - “Evaluar creación de trabajo”
  - resumen del hallazgo;
  - advertencia: “No todo hallazgo requiere trabajo”;
  - campos sugeridos para crear intervención;
  - botón final: “Crear trabajo” o “Guardar trabajo”, solo después de completar formulario.

Estados visuales recomendados:

- Hallazgo `Activo`: puede mostrar `Evaluar trabajo`, pero con advertencia.
- Hallazgo `En observación`: idealmente mantener `Evaluar trabajo` deshabilitado o secundario.
- Hallazgo `Pendiente de trabajo`: habilitar `Evaluar trabajo`.
- Hallazgo `Cerrado`: no habilitar.
- Hallazgo `Descartado`: no habilitar.

Texto recomendado:

- `Evaluar trabajo`
- `Requiere evaluación antes de crear trabajo`
- `Este hallazgo no crea un trabajo automáticamente`
- `Ya existe un trabajo asociado a este hallazgo`

## Campos heredados desde hallazgo

Campos que pueden heredarse o precargarse desde el hallazgo:

- `paciente_id`
- `caso_id`
- `revision_inicial_id` desde `revision_id`
- `revision_hallazgo_origen_id`
- `nombre_trabajo`, sugerido a partir de `categoria_hallazgo` o `tipo_hallazgo`
- `objetivo_trabajo`, sugerido desde `descripcion_hallazgo`
- `prioridad_trabajo`, sugerida desde `prioridad_hallazgo`
- `requiere_seguimiento`, sugerido desde `requiere_seguimiento`
- `observaciones`, sugeridas desde `observaciones` o `informacion_canalizada`
- `alcance_trabajo`, sugerido desde el tipo de elemento o categoría.
- `ambito_trabajo`, sugerido desde `elemento_caso_id`, categoría o área del aspecto.

Campos que no deben heredarse automáticamente sin revisión:

- `tipo_trabajo`
- `modalidad_ejecucion`
- `fase_actual`
- `metodo_principal`
- `descripcion_plan`
- `frecuencia_planificada`
- `duracion_estimada_semanas`
- `estado_trabajo`
- `fecha_estimada_cierre`
- `fecha_cierre`
- `resultado_general`

## Campos que debe completar el terapeuta

El terapeuta debe completar manualmente:

- `nombre_trabajo`
- `tipo_trabajo`
- `ambito_trabajo`
- `modalidad_ejecucion`
- `alcance_trabajo`
- `metodo_principal`
- `objetivo_trabajo`
- `descripcion_plan`
- `prioridad_trabajo`
- `frecuencia_planificada`, si aplica.
- `dias_planificados`, si aplica.
- `duracion_estimada_semanas`, si aplica.
- `requiere_revision_previa`
- `requiere_revision_posterior`
- `requiere_seguimiento`
- `proxima_accion`
- `observaciones`
- `notas_internas`

El sistema puede sugerir valores, pero no debe asumir la decisión clínica final.

## Validaciones necesarias

### Frontend

Validaciones mínimas:

- El hallazgo debe existir.
- El hallazgo debe pertenecer al caso abierto.
- El hallazgo debe pertenecer al paciente abierto.
- El hallazgo debe tener `revision_id`.
- El hallazgo debe tener `elemento_caso_id`.
- El hallazgo debe tener `revision_aspecto_id`.
- El hallazgo no debe estar `Descartado`.
- El hallazgo no debe estar `Cerrado`.
- Si el hallazgo está `En observación`, pedir confirmación.
- Si el hallazgo no está `Pendiente de trabajo`, pedir confirmación.
- Validar si ya existen trabajos con el mismo `revision_hallazgo_origen_id`.
- No permitir creación sin campos obligatorios de `trabajos`.
- No crear sesiones automáticamente.
- No crear acciones automáticamente.
- No crear cobros automáticamente.

### Base de datos

La base ya valida:

- Trabajo pertenece al paciente/caso correcto.
- Revisión inicial/cierre pertenecen al mismo paciente/caso.
- Hallazgo origen existe.
- Hallazgo origen pertenece al mismo paciente/caso.
- Trabajo elemento pertenece al mismo trabajo/paciente/caso.
- Hallazgo asociado a trabajo elemento pertenece al mismo paciente/caso/elemento.
- Acción con hallazgo pertenece al mismo paciente/caso/elemento.

Validaciones futuras posibles:

- Constraint opcional para impedir más de un trabajo activo por hallazgo.
- Vista `vista_trabajos_con_hallazgo_origen`.
- Tabla puente `trabajo_hallazgos`.
- Trigger que impida usar hallazgos `Descartado` o `Cerrado` como origen de trabajo.

No implementar estas validaciones ahora.

## Riesgos clínicos

1. Crear trabajo para todo hallazgo sin evaluación.
2. Convertir hallazgos observacionales en intervenciones innecesarias.
3. Duplicar trabajos para un mismo hallazgo.
4. Mezclar hallazgo, trabajo, sesión y acción.
5. Confundir “pendiente de trabajo” con “trabajo creado”.
6. Abrir intervenciones sin plan claro.
7. Perder la trazabilidad con el aspecto revisado.
8. Cerrar un hallazgo clínico sin revisar su trabajo asociado.
9. Crear trabajo desde hallazgo descartado.
10. Crear trabajo desde hallazgo en observación sin confirmación.

## Riesgos técnicos

1. `TrabajosCasoPanel` actualmente es solo lectura.
2. El tipo `Trabajo` actual del panel no incluye `revision_hallazgo_origen_id`.
3. No existe hook/servicio específico para crear trabajos desde hallazgos.
4. No existe validación frontend de trabajos ya existentes por hallazgo.
5. No existe tabla puente para muchos-a-muchos.
6. No existe vista agregada para mostrar trabajos con hallazgo origen.
7. La base permite más de un trabajo con el mismo hallazgo origen si la UI no lo controla.
8. Crear tabla puente prematuramente puede sobrediseñar el modelo.
9. Crear trabajo desde hallazgo sin cargar contexto completo puede romper la experiencia clínica.
10. El botón “Evaluar trabajo” debe seguir deshabilitado hasta que BE-011 se implemente formalmente.

## Riesgos financieros/cobros

1. Un trabajo creado desde hallazgo puede transformarse en unidad cobrable.
2. Si el caso, revisión o consulta ya fue cobrada como paquete, crear cobro adicional por trabajo podría duplicar prestación.
3. DEC-012 exige que cada cobro represente una unidad cobrable clara.
4. No debe crearse cobro automáticamente al crear trabajo.
5. El formulario futuro de trabajo debe separar:
   - creación clínica del trabajo;
   - decisión financiera posterior.
6. Finanzas debe poder distinguir si el trabajo:
   - está incluido en un paquete/caso;
   - se cobra como intervención separada;
   - es seguimiento sin cobro;
   - es cierre o ajuste incluido.
7. BE-013/BE-016 deben revisar cómo impactan trabajos derivados de hallazgos en cobros y vistas financieras.

## Qué NO debe implementarse todavía

No implementar todavía:

- Código React.
- Migraciones.
- Tabla puente `trabajo_hallazgos`.
- Creación automática de trabajos.
- Creación automática de sesiones.
- Creación automática de acciones.
- Creación automática de cobros.
- Cambios en RLS.
- Cambios en Supabase remoto.
- Cambios en `.env`.
- Cambios en datos reales.
- Merge a `main`.
- PR listo para merge.

Tampoco debe implementarse todavía:

- Dashboard global de hallazgos.
- Conversión masiva de hallazgos.
- Wizard completo de trabajos.
- Validaciones financieras automáticas.
- Vista financiera por unidad cobrable.
- Vista agregada de trabajos con hallazgos.

## Coordinación con UI-012

UI-012 debe diseñar el flujo visual hallazgo → trabajo.

Puntos para UI-012:

- Botón recomendado: `Evaluar trabajo`.
- No partir con “Crear trabajo” directo.
- Mostrar resumen del hallazgo.
- Mostrar advertencia: “No todo hallazgo requiere trabajo”.
- Mostrar si ya existe trabajo asociado.
- Permitir revisar antes de crear.
- Mantener separación visual:
  - hallazgo;
  - evaluación;
  - trabajo.
- Diseñar formulario o wizard de creación de trabajo.
- No crear sesión/acción/cobro desde el mismo paso.
- Definir estado visual cuando un hallazgo ya tiene trabajo asociado.
- Definir microcopy para evitar automatismo clínico.

## Coordinación con finanzas/cobros

Coordinar con BE-013 y BE-016 antes de crear cobros derivados de trabajos.

Reglas iniciales:

- Crear trabajo no implica crear cobro.
- Trabajo puede ser cobrable o no cobrable.
- Si se cobra, debe existir unidad cobrable clara.
- Si el caso ya fue cobrado como paquete, el trabajo podría estar incluido.
- Si el trabajo se cobra separado, debe asociarse a `trabajo_id`.
- Pago siempre debe aplicarse a `cobro`, no directamente al hallazgo ni al trabajo.
- No mezclar decisión clínica con cobro automático.

## Recomendación final

Para primera versión, usar la estructura actual:

`trabajos.revision_hallazgo_origen_id`

No crear tabla puente todavía.

Modelo recomendado:

- Un hallazgo principal puede originar un trabajo.
- Un trabajo puede tener un hallazgo origen principal.
- Hallazgos adicionales pueden tratarse inicialmente mediante `trabajo_elementos.revision_hallazgo_id` o `trabajo_acciones.revision_hallazgo_id`, si aplica.
- Si se confirma necesidad muchos-a-muchos real, diseñar tabla puente en una tarea posterior.

Estados recomendados para habilitar “Evaluar trabajo”:

- Habilitado:
  - `Pendiente de trabajo`
  - `Activo` con confirmación
- Permitido con advertencia:
  - `En observación`
- Bloqueado:
  - `Cerrado`
  - `Descartado`

## Checklist

Antes de implementar:

- Confirmar que BE-011 fue validada por Control de Desarrollo.
- Confirmar coordinación con UI-012.
- Confirmar que no se requiere migración inicial.
- Confirmar que `revision_hallazgo_origen_id` será usado como origen principal.
- Confirmar si se permitirá más de un trabajo por hallazgo.
- Confirmar comportamiento si ya existe trabajo asociado.
- Confirmar impacto financiero con BE-013/BE-016.
- Confirmar que no se crearán cobros automáticos.
- Confirmar que no se crearán sesiones ni acciones automáticas.
- Confirmar que no se tocará `.env`.
- Confirmar que no se usará `supabase db push`.

Durante implementación futura:

- Agregar `revision_hallazgo_origen_id` al tipo `Trabajo`.
- Agregar lectura de trabajos por hallazgo.
- Crear hook/servicio para trabajos desde hallazgo.
- Habilitar “Evaluar trabajo” solo según estado.
- Validar duplicados por hallazgo.
- Precargar campos sugeridos.
- Exigir confirmación del terapeuta.
- Insertar trabajo con `revision_hallazgo_origen_id`.
- No crear sesiones.
- No crear acciones.
- No crear cobros.

Después de implementación futura:

- Probar hallazgo sin trabajo.
- Probar hallazgo con trabajo existente.
- Probar hallazgo `Pendiente de trabajo`.
- Probar hallazgo `Activo`.
- Probar hallazgo `En observación`.
- Probar hallazgo `Cerrado`.
- Probar hallazgo `Descartado`.
- Probar que no se dupliquen trabajos sin advertencia.
- Probar que `TrabajosCasoPanel` muestre el trabajo creado.
- Ejecutar build.
- Abrir PR draft.

## Conclusión

BE-011 queda aprobado con observaciones como informe técnico.

La tabla `trabajos` ya permite vincular un trabajo a un hallazgo mediante `revision_hallazgo_origen_id`.

Esa columna es suficiente para una primera versión controlada.

No se requiere migración ahora.

No se recomienda crear tabla puente en esta etapa.

La tabla puente `trabajo_hallazgos` debe quedar como posibilidad futura si el flujo clínico exige relación muchos-a-muchos formal entre hallazgos y trabajos.

El flujo seguro inicial es:

`Hallazgo relevante`  
→ `Evaluar trabajo`  
→ `Confirmación manual del terapeuta`  
→ `Crear trabajo con revision_hallazgo_origen_id`

No debe existir creación automática de trabajos.

No deben crearse cobros, sesiones ni acciones automáticamente.

BE-011 debe coordinarse con UI-012 para diseñar la experiencia visual de evaluación y con BE-013/BE-016 para evitar duplicidad financiera cuando el trabajo sea cobrable.
