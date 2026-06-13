# UI / UX / Pulido visual

Responsable: UI / UX / Pulido visual  
Estado del documento: En analisis  
Fecha creacion: `2026-06-11`  
Ultima actualizacion: `2026-06-12`

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

## UI-001 - Auditar pantallas principales y pulido visual

**Estado:** Aprobada con observaciones  
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
