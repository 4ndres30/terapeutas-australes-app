# UI / UX / Pulido visual

Responsable: UI / UX / Pulido visual
Estado del documento: En analisis
Fecha creacion: `2026-06-11`
Ultima actualizacion: `2026-06-18`

Este documento controla tareas de experiencia de usuario, formularios, responsive y pulido visual. El objetivo es que la aplicacion sea clara, sobria, profesional y facil de usar para el flujo terapeutico.

## Alcance

- Diseno de pantallas.
- Jerarquia visual.
- Formularios.
- Estados vacios, carga y error.
- Responsive.
- Accesibilidad basica.
- Consistencia de botones, tablas, modales y navegacion.
- Pulido visual premium sin afectar logica critica.

## Fuera de alcance

- Modificar base de datos.
- Modificar migraciones.
- Ejecutar SQL.
- Cambiar reglas clinicas.
- Cambiar servicios, hooks o logica critica sin tarea aprobada.

## Criterios visuales base

- Priorizar claridad sobre decoracion.
- Mantener interfaces densas pero legibles.
- Evitar duplicidad de acciones.
- Usar textos breves y utiles.
- Mantener consistencia entre formularios.
- Revisar mobile y desktop antes de validar.
- No ocultar informacion clinica importante por decisiones esteticas.

## Resumen auditoria UI-001 + UI-002

La auditoria UI-001 + UI-002 queda **aprobada con observaciones**. La interfaz actual sostiene bien el flujo clinico aprobado y respeta que el caso sea el contenedor central de elementos, revisiones, detalle, trabajos y pagos. La app ya se siente seria y funcional en Pacientes, Casos y ficha de caso, pero aun requiere diseno operativo para hallazgos, trabajos/sesiones/acciones, finanzas por unidad cobrable, agenda tipificada y reportes por rol.

Informe completo: [`auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`](auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md)

## Estado post IMP-001

UI-011 fue llevada a una implementacion funcional minima por IMP-001 dentro de `DetalleRevisionesPanel`.

Validado visualmente por el usuario:

- Hallazgo registrado visible.
- Modal `Ver hallazgo` funcional.
- Modal `Crear hallazgo desde aspecto revisado` abre correctamente.
- Herencia de revision, elemento, area y aspecto en el modal de creacion.

Pendiente:

- QA-002 debe validar el guardado real de un hallazgo nuevo desde la UI.
- UI-012 disena el flujo visual `Evaluar trabajo`; la implementacion funcional queda para una tarea posterior.

Regla vigente:

- No se debe crear trabajo automaticamente desde un hallazgo.
- No se deben crear cobros, sesiones ni acciones automaticamente desde el flujo de hallazgos.

## UI-001 - Auditar pantallas principales y pulido visual

**Estado:** Integrada
**Prioridad:** Media
**Responsable:** UI / UX / Pulido visual
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Fecha documentacion:** 2026-06-12
**Rama sugerida:** `docs/auditoria-ui-ux`
**Dependencias:** PEND-001

### Descripcion
Revisar pantallas principales de la aplicacion para detectar problemas de jerarquia, consistencia, responsive, formularios y experiencia de uso.

### Archivos relacionados
- `src/`
- `public/`
- `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`

### Criterios de aceptacion
- Listar pantallas revisadas.
- Clasificar hallazgos en criticos, importantes y posteriores.
- Separar problemas visuales de problemas de logica o datos.
- No modificar base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Informe oficial consolidado en `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`.

### Observaciones
La auditoria confirma que la estructura visual actual acompana el flujo clinico aprobado, pero recomienda redisenar navegacion del detalle de caso, hallazgos dentro del detalle de revision, flujo hallazgo a trabajo, finanzas por unidad cobrable y reportes por rol.

## UI-002 - Revisar formularios del flujo clinico

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Fecha documentacion:** 2026-06-12
**Rama sugerida:** `docs/revision-formularios-clinicos`
**Dependencias:** RFC-001

### Descripcion
Revisar si los formularios respetan el flujo clinico y si los campos aparecen en el momento correcto, con etiquetas comprensibles y estados de validacion claros.

### Archivos relacionados
- `src/`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`

### Criterios de aceptacion
- Identificar formularios revisados.
- Detectar campos confusos, duplicados o mal ubicados visualmente.
- No cambiar reglas clinicas por criterio visual.
- No modificar base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Informe oficial consolidado en `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`.

### Observaciones
Los formularios principales respetan el flujo clinico base. Las mayores brechas son hallazgos sin panel operativo, trabajos/sesiones/acciones sin flujo guiado, formularios clinicos largos y finanzas sin experiencia clara por unidad cobrable.

## UI-003 - Definir checklist responsive y estados UI

**Estado:** Pendiente
**Prioridad:** Media
**Responsable:** UI / UX / Pulido visual
**Origen:** UI / UX / Pulido visual
**Fecha creacion:** 2026-06-11
**Rama sugerida:** `docs/checklist-responsive-ui`
**Dependencias:** UI-001

### Descripcion
Definir una pauta breve para validar pantallas en mobile y desktop, incluyendo estados de carga, vacios, errores y acciones principales.

### Archivos relacionados
- `src/`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`

### Criterios de aceptacion
- Incluir checklist mobile.
- Incluir checklist desktop.
- Incluir estados vacio, carga y error.
- No modificar codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Esta tarea es documental hasta que Javier apruebe cambios visuales concretos.

## UI-010 - Redisenar navegacion del detalle de caso

**Estado:** Aprobada con observaciones / pendiente implementacion
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002
**Fecha creacion:** 2026-06-13
**Fecha documentacion:** 2026-06-18
**Rama sugerida:** `docs/ui-010-diseno-resumen-detalle-caso`
**Dependencias:** UI-001, UI-002, RFC-001

### Descripcion
UI-010 ya cuenta con diseno detallado para transformar el detalle de caso desde una lista vertical extensa hacia una vista resumen general por secciones. La vista por elemento queda como modo secundario o fase posterior.

### Archivos relacionados
- `docs/control/auditorias/UI-010_AMPLIACION_RESUMEN_DETALLE_CASO.md`
- `docs/control/auditorias/UI-010_DISENO_RESUMEN_DETALLE_CASO.md`

### Criterios de aceptacion
- Usar como vista principal un resumen general por secciones.
- Mantener tarjetas o modulos para elementos, revisiones, detalle de revision, hallazgos, trabajos, pagos y seguimiento.
- Conservar trazabilidad entre caso, revision, elemento, aspecto, hallazgo y trabajo.
- No implementar codigo todavia.
- No modificar CSS.
- No modificar base de datos.
- Considerar las observaciones clinicas obligatorias antes de implementar.

### Validación clínica

Revisión de flujo clínico aprueba UI-010 con observaciones. Antes de implementar, deben considerarse como obligatorias las alertas clínicas visibles, la separación entre Detalle de revisión y Hallazgos, la visibilidad de trabajos transversales, la separación visual de Pagos y la trazabilidad completa entre paciente, caso, consulta/evaluación, elemento, revisión, aspecto, hallazgo, trabajo, pago y seguimiento.

### Resultado
Aprobada con observaciones como diseno UI/UX y validada clinicamente con observaciones. La implementacion futura queda pendiente de considerar alertas criticas, trabajos transversales, pagos separados y riesgos de ocultar informacion clinica.

### Observaciones
La recomendacion principal es una vista resumen general por secciones. La vista organizada por elemento del caso queda como exploracion secundaria o fase posterior.

## UI-011 - Disenar panel operativo de hallazgos dentro del detalle de revision

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002 / BE-010
**Fecha creacion:** 2026-06-13
**Fecha documentacion:** 2026-06-13
**Rama sugerida:** `docs/ui-011-panel-hallazgos`
**Dependencias:** DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, BE-010

### Descripcion
Definir la experiencia visual y operativa del panel de hallazgos dentro del detalle de revision, respetando que los hallazgos nacen desde aspectos revisados y viven dentro del caso.

### Archivos relacionados
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/RevisionesCasoPanel.tsx`
- `src/pages/casos/ElementosCasoPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `docs/control/auditorias/UI-011_PANEL_OPERATIVO_HALLAZGOS.md`
- `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`

### Criterios de aceptacion
- Definir ubicacion visual del panel de hallazgos.
- Definir accion contextual para crear hallazgo desde aspecto revisado.
- Diferenciar visualmente aspecto revisado, hallazgo y trabajo futuro.
- Definir estados visuales y microcopy.
- Prevenir duplicados desde la experiencia visual.
- No implementar codigo.
- No modificar CSS.
- No modificar migraciones.
- No tocar `.env`.
- No ejecutar Supabase.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Integrada. Informe oficial consolidado en `docs/control/auditorias/UI-011_PANEL_OPERATIVO_HALLAZGOS.md`. IMP-001 llevo esta definicion a implementacion funcional minima dentro de `DetalleRevisionesPanel`.

### Observaciones
Los hallazgos deben vivir dentro de `DetalleRevisionesPanel`. La accion debe nacer desde cada aspecto revisado. No debe existir modulo principal independiente de hallazgos. No se deben crear trabajos automaticamente. BE-011 ya quedo integrada documentalmente y UI-012 queda como siguiente tarea UI para disenar `Evaluar trabajo`.

## UI-012 - Disenar flujo visual Evaluar trabajo

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-011 + BE-011
**Fecha creacion:** 2026-06-17
**Fecha documentacion:** 2026-06-17
**Rama sugerida:** `docs/ui-012-evaluar-trabajo`
**Dependencias:** UI-011, BE-011, DEC-009, DEC-013, DEC-014, DEC-015

### Descripcion
Disenar el flujo visual para que un terapeuta evalue si un hallazgo amerita crear trabajo. La accion recomendada es `Evaluar trabajo`, no `Crear trabajo` directo.

### Archivos relacionados
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `docs/control/auditorias/UI-012_FLUJO_EVALUAR_TRABAJO.md`
- `docs/control/auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`

### Criterios de aceptacion
- Diferenciar hallazgo, evaluacion de trabajo y trabajo creado.
- Mostrar resumen del hallazgo antes de preparar un trabajo.
- Mostrar advertencia de que no todo hallazgo requiere trabajo.
- Definir comportamiento si ya existe trabajo asociado al hallazgo.
- Definir microcopy para evitar automatismo clinico.
- No crear trabajo automaticamente.
- No crear cobros, sesiones ni acciones automaticamente.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### Resultado
Aprobada con observaciones. Informe oficial consolidado en `docs/control/auditorias/UI-012_FLUJO_EVALUAR_TRABAJO.md`.

### Observaciones
El boton debe llamarse `Evaluar trabajo` y vivir junto al hallazgo operativo dentro de `DetalleRevisionesPanel`. La creacion futura debe requerir confirmacion manual del terapeuta, usar `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal y no crear cobros, sesiones ni acciones automaticamente.

## UI-016 - Mejorar reportes por rol

**Estado:** Pendiente
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002 / SEC-002

### Relación con SEC-002

SEC-002 define que los reportes deben separarse por rol:

- admin: visión completa según permisos aprobados;
- terapeuta: vista clínica sin finanzas detalladas;
- finanzas: vista financiera sin información clínica sensible.

UI-016 debe considerar estas restricciones antes de diseñar reportes o dashboards compartidos.
