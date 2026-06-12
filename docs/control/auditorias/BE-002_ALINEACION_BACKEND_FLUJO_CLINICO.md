# BE-002 — Alineación backend con flujo clínico aprobado

## Estado

Aprobado con observaciones.

## Fecha

2026-06-12.

## Rama auditada

`main`.

## Fuente del informe

Este documento consolida el informe BE-002 entregado por Integración estructura / backend. La auditoría técnica fue realizada sobre la estructura backend/Supabase y el frontend React actual, contrastando contra RFC-001 y las decisiones clínicas DEC-006 a DEC-012 ya registradas por Control de Desarrollo.

## Objetivo

Registrar oficialmente la auditoría técnica de alineación entre backend/Supabase y el flujo clínico aprobado, verificando si la estructura actual soporta correctamente las decisiones clínicas registradas y detectando brechas técnicas pendientes antes de implementar nuevos cambios.

## Restricciones respetadas

- No se modificó código fuente.
- No se modificaron migraciones.
- No se tocó `.env`.
- No se ejecutó Supabase.
- No se ejecutó `supabase db push`.
- No se tocó Supabase remoto.
- No se modificaron datos reales.
- No se hizo merge a `main`.
- No se implementó UI visual.
- No se modificaron estilos.
- No se cambiaron decisiones clínicas ya registradas.

## Resumen ejecutivo

BE-002 confirma que el backend está bien orientado al flujo `Paciente → Caso → Revisión → Detalle → Hallazgo → Trabajo`, respetando que las revisiones y su detalle viven dentro de la ficha del caso. El modelo de `revision_hallazgos` nace obligatoriamente desde `revision_aspectos`, lo que técnicamente protege DEC-007 y DEC-008, aunque falta UI operativa para crear hallazgos desde el detalle. `trabajos`, `trabajo_sesiones` y `trabajo_acciones` están correctamente separados, pero falta flujo operativo completo. Agenda no tiene backend dedicado y debe diseñarse como módulo mixto tipificado. Cobros/pagos soportan consulta, evaluación, caso, revisión y trabajo, pero aún falta reforzar la regla de unidad cobrable clara para evitar duplicidad. RLS existe, pero requiere validación runtime por perfiles.

## Documentos revisados

- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md`
- `docs/control/05_DECISIONES_PROYECTO.md`

## Decisiones consideradas

- **DEC-006:** Revisiones y detalle de revisiones viven dentro de la ficha del caso.
- **DEC-007:** `revision_hallazgos` registra solo hallazgos clínicamente relevantes derivados preferentemente de `revision_aspectos`.
- **DEC-008:** Hallazgos viven dentro del detalle de revisión; no tendrán módulo principal independiente de creación.
- **DEC-009:** Un hallazgo se convierte en trabajo solo cuando requiere intervención, seguimiento operativo, cierre terapéutico o acciones planificadas.
- **DEC-010:** `trabajos` define intervención, `trabajo_sesiones` registra sesiones y `trabajo_acciones` registra actos concretos.
- **DEC-011:** Agenda será módulo mixto de eventos programados con tipo obligatorio.
- **DEC-012:** Cada cobro debe representar una unidad cobrable clara para evitar duplicidad financiera.

## Alcance técnico

Se revisó la alineación técnica de:

- Estructura Supabase/migraciones.
- Relaciones y foreign keys.
- Checks y taxonomías técnicas.
- Triggers de validación relacional.
- RLS/policies por rol.
- Consumo actual desde frontend React.
- Estado de reportes y paneles read-only.
- Necesidad de vistas futuras.

No se implementó ninguna corrección. BE-002 se limita a auditoría técnica y documentación.

## Revisión por módulo

### `revision_aspectos`

`revision_aspectos` soporta el registro de todo lo medido u observado dentro de una revisión: área, aspecto revisado, método, tipo de medición, métrica, porcentaje, presencia detectada, resultado, seguimiento, pendientes, información canalizada, observaciones y notas internas.

La tabla exige relación con paciente, caso, revisión, `revision_elementos` y elemento del caso. Esto sostiene DEC-006 porque el detalle no existe aislado: depende de una revisión y de un elemento real dentro de la ficha del caso.

La taxonomía fue ampliada por migraciones posteriores para incluir cuerpos sutiles, trauma energético y métricas asociadas, por lo que el riesgo histórico de desalineación detectado en BE-001 aparece cubierto documentalmente. Debe validarse runtime local en QA posterior.

**Observación técnica:** la tabla está correctamente ubicada para registrar “se revisó X y dio Y”, pero UI/UX debe evitar que el usuario mezcle área, aspecto, métrica, hallazgo y acción en el mismo nivel.

### `revision_hallazgos`

`revision_hallazgos` está bien trazado: exige `paciente_id`, `caso_id`, `revision_id`, `revision_elemento_id`, `revision_aspecto_id` y `elemento_caso_id`.

La relación obligatoria con `revision_aspecto_id` protege DEC-007, porque el hallazgo nace desde un aspecto revisado. Además, el trigger de validación relacional confirma que paciente, caso, revisión, elemento de revisión y elemento del caso coincidan con el aspecto origen.

**Conclusión técnica:** con las decisiones actuales, conviene mantener `revision_hallazgos.revision_aspecto_id` obligatorio por ahora. Permitir excepciones debilitaría la trazabilidad y requeriría una decisión posterior de Control de Desarrollo.

**Brecha vigente:** no existe UI operativa para crear hallazgos dentro del detalle de revisión, a pesar de que DEC-008 establece que los hallazgos deben vivir ahí y no en un módulo principal independiente.

### `trabajos`

`trabajos` define la intervención. Su estructura permite asociar paciente, caso, revisión inicial, revisión de cierre y hallazgo origen opcional mediante `revision_hallazgo_origen_id`.

Esto respeta DEC-009: un trabajo puede responder a un hallazgo relevante, pero no todo hallazgo debe transformarse automáticamente en trabajo. La tabla incluye objetivo, plan, frecuencia, prioridad, avance, estado, seguimiento y resultado general.

**Brecha vigente:** `revision_hallazgo_origen_id` cubre un hallazgo origen principal, pero no representa de forma explícita un trabajo nacido desde múltiples hallazgos.

### `trabajo_elementos`

`trabajo_elementos` vincula trabajos con elementos del caso y permite asociar un `revision_hallazgo_id`. Esto puede resolver parte de la trazabilidad cuando un trabajo involucra varios elementos o hallazgos vinculados a elementos específicos.

El modelo protege que los elementos trabajados pertenezcan al mismo paciente y caso. También puede asociar un hallazgo con un elemento trabajado.

**Brecha vigente:** no reemplaza una posible tabla puente `trabajo_hallazgos` si se necesita declarar que un mismo trabajo responde a varios hallazgos origen sin depender de la relación por elemento.

### `trabajo_sesiones`

`trabajo_sesiones` registra la ejecución temporal del trabajo: fecha, horario, número de sesión, fase, tipo, objetivo de sesión, estado previo, acciones generales, estado posterior, resultado, avance y continuidad.

Esto respeta DEC-010 porque no mezcla la definición del trabajo con su ejecución temporal.

### `trabajo_acciones`

`trabajo_acciones` registra actos concretos dentro de una sesión: retiro, liberación, desarme, limpieza, ajuste, sellado, protección, integración, recuperación, alineación, seguimiento, cierre u otros.

Esto respeta DEC-010 porque separa la acción concreta de la sesión y del plan general del trabajo.

### `agenda`

Agenda no tiene backend dedicado. El frontend actual declara que no existe tabla pública de agenda, citas o eventos, y evita lógica de guardado sin esquema real.

**Propuesta técnica:** Agenda debería diseñarse como **tabla nueva + vistas derivadas**.

Tabla sugerida futura: `agenda_eventos`, con `tipo_evento` obligatorio y relaciones opcionales a:

- `paciente_id`
- `consulta_id`
- `evaluacion_id`
- `caso_id`
- `revision_id`
- `trabajo_id`
- `trabajo_sesion_id`

Esto permitiría cumplir DEC-011 sin mezclar consultas, evaluaciones, revisiones, sesiones de trabajo, seguimiento y recordatorios internos.

### `cobros`

`cobros` permite asociar una obligación de pago a paciente, consulta, evaluación, caso, revisión o trabajo. La validación relacional actual confirma consistencia entre estas entidades y puede completar relaciones derivadas según corresponda.

Esto respeta parcialmente DEC-012 porque el modelo puede representar unidades cobrables distintas.

**Brecha vigente:** la estructura valida consistencia, pero no impide por sí sola que una misma prestación sea cobrada dos veces desde niveles distintos si se crean dos cobros relacionalmente válidos. Se requiere una regla adicional de unidad cobrable, ya sea en SQL, aplicación o ambas.

### `pagos`

`pagos` está correctamente subordinado a `cobros`: cada pago exige `cobro_id`, paciente, monto, moneda, método y estado. La validación impide pagos con paciente o moneda distinta y evita superar el saldo del cobro.

Esto respeta DEC-012 porque el pago se aplica a un cobro, no directamente a caso, revisión o trabajo.

### `vista_cobros_estado`

`vista_cobros_estado` calcula estado financiero base: monto pagado, saldo pendiente y estado calculado. Tras migración posterior, expone `consulta_id`, `evaluacion_id`, `caso_id`, `revision_id` y `trabajo_id`.

**Brecha menor:** la vista es suficiente para estado financiero base, pero no para análisis avanzado por unidad cobrable. Podría requerirse una vista futura `vista_finanzas_por_unidad_cobrable`.

### RLS / policies

RLS está activado para tablas clínicas, trabajos, finanzas y usuarios internos. Las funciones de rol separan `admin`, `terapeuta` y `finanzas`.

Las tablas clínicas y de trabajos quedan disponibles para `terapeuta/admin`; cobros y pagos para `finanzas/admin`.

**Brecha vigente:** los reportes actuales combinan información clínica y financiera. Un rol `finanzas` puede no tener acceso a tablas clínicas, por lo que debe validarse runtime que los reportes parciales funcionen correctamente y no generen confusión.

### Reportes

Los reportes actuales calculan métricas desde frontend usando tablas y vistas directas. Sirven como reporte simple inicial, pero no sostendrán bien hallazgos, trabajos, agenda y unidad cobrable avanzada sin vistas SQL o separación por rol.

## Brechas técnicas críticas

Sin brechas técnicas críticas bloqueantes confirmadas.

## Brechas técnicas medias

1. `revision_hallazgos` está bien trazado, pero no tiene UI operativa dentro del detalle de revisión.
2. No existe tabla puente explícita `trabajo_hallazgos`.
3. Trabajos y subtablas están modelados, pero el frontend actual solo lee trabajos.
4. Agenda no tiene backend dedicado.
5. Cobros valida consistencia relacional, pero no impide completamente duplicidad por unidad cobrable.
6. Reportes se calculan en frontend y no incluyen hallazgos, trabajos, agenda ni unidad cobrable avanzada.
7. RLS debe validarse runtime para `admin`, `terapeuta` y `finanzas`.

## Brechas técnicas menores

1. `revision_aspectos` tiene checks útiles, pero cualquier nueva taxonomía clínica requerirá nueva migración posterior.
2. `revision_hallazgos.revision_aspecto_id` obligatorio es coherente con DEC-007, pero elimina excepciones clínicas futuras.
3. `vista_cobros_estado` es suficiente para saldos, pero no para análisis por unidad cobrable.
4. Agenda existe como ruta/pantalla, pero solo como placeholder técnico.
5. Reportes acepta lectura parcial por rol, pero falta validación de experiencia real.
6. Algunas vistas sugeridas por RFC-001 todavía no existen.

## Riesgos de implementación

- Crear hallazgos fuera del detalle de revisión podría romper DEC-008.
- Convertir hallazgo a trabajo sin trazabilidad múltiple puede dificultar auditoría futura.
- Permitir cobros desde varios niveles sin regla adicional puede duplicar prestaciones.
- Diseñar Agenda sin `tipo_evento` obligatorio rompería DEC-011.
- Mantener reportes complejos solo en frontend puede volver frágil la lectura por rol.
- RLS puede generar reportes parciales si no se diseña una estrategia por perfil.

## Propuestas técnicas

Solo propuestas, no implementación:

1. Mantener `revision_hallazgos.revision_aspecto_id` obligatorio por ahora.
2. Diseñar creación de hallazgos desde `DetalleRevisionesPanel`.
3. Evaluar tabla puente `trabajo_hallazgos`.
4. Crear vistas clínicas agregadas.
5. Diseñar `agenda_eventos` como tabla nueva con `tipo_evento` obligatorio.
6. Crear vistas de agenda operativa.
7. Crear regla de unidad cobrable para cobros.
8. Separar reportes por rol o mover agregados complejos a vistas SQL.

## Tareas backend sugeridas

### BE-010 — Ajustar soporte operativo de hallazgos derivados de aspectos

- **Prioridad:** Alta.
- **Motivo:** `revision_hallazgos` está bien modelado, pero no tiene flujo operativo desde el detalle de revisión.
- **Dependencias:** DEC-007, DEC-008, BE-002.
- **Resultado esperado:** Definir soporte técnico mínimo para crear, listar y consultar hallazgos desde el detalle de revisión.

### BE-011 — Diseñar trazabilidad hallazgo → trabajo

- **Prioridad:** Alta.
- **Motivo:** `trabajos.revision_hallazgo_origen_id` cubre un hallazgo principal, pero no múltiples hallazgos origen.
- **Dependencias:** DEC-009, BE-002.
- **Resultado esperado:** Decidir si basta `trabajo_elementos.revision_hallazgo_id` o si se requiere tabla puente `trabajo_hallazgos`.

### BE-012 — Diseñar backend de Agenda tipificada

- **Prioridad:** Alta.
- **Motivo:** Agenda no tiene backend dedicado.
- **Dependencias:** DEC-011, BE-002.
- **Resultado esperado:** Propuesta técnica de `agenda_eventos` con `tipo_evento` obligatorio y relaciones opcionales.

### BE-013 — Ajustar reglas de cobros por unidad cobrable

- **Prioridad:** Alta.
- **Motivo:** DEC-012 exige evitar duplicidad de prestaciones.
- **Dependencias:** DEC-012, BE-002.
- **Resultado esperado:** Regla SQL, regla de aplicación o estrategia mixta para impedir asociaciones contradictorias o cobros duplicados.

### BE-014 — Crear vistas clínicas agregadas

- **Prioridad:** Media-alta.
- **Motivo:** La ficha de caso y reportes crecerán en complejidad.
- **Dependencias:** BE-010, BE-011, BE-002.
- **Resultado esperado:** Evaluar vistas como `vista_caso_clinico_completo`, `vista_revisiones_con_hallazgos`, `vista_trabajos_con_origen`.

### BE-015 — Validar RLS por roles para módulos nuevos

- **Prioridad:** Alta.
- **Motivo:** RLS separa clínica y finanzas; reportes y vistas mixtas pueden requerir reglas especiales.
- **Dependencias:** BE-010 a BE-014.
- **Resultado esperado:** Matriz runtime validada para `admin`, `terapeuta` y `finanzas`.

### BE-016 — Diseñar vista financiera por unidad cobrable

- **Prioridad:** Media.
- **Motivo:** `vista_cobros_estado` calcula saldos, pero no clasifica claramente la unidad cobrable.
- **Dependencias:** BE-013.
- **Resultado esperado:** Propuesta de `vista_finanzas_por_unidad_cobrable`.

### BE-017 — Definir estrategia SQL de agenda operativa

- **Prioridad:** Media.
- **Motivo:** Agenda debe mezclar eventos manuales y derivados.
- **Dependencias:** BE-012.
- **Resultado esperado:** Decidir si `vista_agenda_operativa` combina `agenda_eventos`, consultas, evaluaciones, revisiones y sesiones de trabajo.

## Tareas sugeridas para UI / UX

- Crear UI para hallazgos dentro del detalle de revisión.
- Diseñar conversión hallazgo → trabajo.
- Diseñar flujo operativo de trabajos, sesiones y acciones.
- Diseñar agenda tipificada.
- Diseñar finanzas por unidad cobrable.
- Diseñar reportes por rol.

## Tareas sugeridas para Revisión de flujo clínico

No se detecta necesidad de cambiar decisiones clínicas ya registradas. Sí conviene validar posteriormente:

- Taxonomía clínica final.
- Criterios de múltiples hallazgos para un trabajo.
- Reglas de cobro por paquete/caso.

## Temas que requieren decisión de Control de Desarrollo

Las decisiones principales ya están registradas en DEC-007 a DEC-012. Podrían requerirse decisiones futuras sobre:

- Si se crea o no tabla puente `trabajo_hallazgos`.
- Si Agenda será tabla nueva + vistas derivadas.
- Si unidad cobrable se validará por SQL, aplicación o ambas.
- Si reportes mixtos clínico/financieros se separarán por rol.

## Conclusión

BE-002 queda **aprobada con observaciones** como auditoría técnica. La estructura actual respeta el flujo clínico aprobado y habilita la planificación de BE-010 en adelante, sin implementar todavía cambios de backend, migraciones ni frontend.
