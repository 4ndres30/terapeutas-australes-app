# UI / UX / Pulido visual

Responsable: UI / UX / Pulido visual  
Estado del documento: En análisis
Fecha creacion: `2026-06-11`

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

## UI-001 - Auditar pantallas principales y pulido visual

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** UI / UX / Pulido visual  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/auditoria-ui-ux`  
**Dependencias:** PEND-001  

### Descripcion
Revisar pantallas principales de la aplicacion para detectar problemas de jerarquia, consistencia, responsive, formularios y experiencia de uso.

### Archivos relacionados
- `src/`
- `public/`

### Criterios de aceptacion
- Listar pantallas revisadas.
- Clasificar hallazgos en criticos, importantes y posteriores.
- Separar problemas visuales de problemas de logica o datos.
- No modificar base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
La salida esperada es una auditoria con propuestas, no cambios de codigo desde esta rama documental.

## UI-002 - Revisar formularios del flujo clinico

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** UI / UX / Pulido visual  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/revision-formularios-clinicos`  
**Dependencias:** RFC-001  

### Descripcion
Revisar si los formularios respetan el flujo clinico y si los campos aparecen en el momento correcto, con etiquetas comprensibles y estados de validacion claros.

### Archivos relacionados
- `src/`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`

### Criterios de aceptacion
- Identificar formularios revisados.
- Detectar campos confusos, duplicados o mal ubicados visualmente.
- No cambiar reglas clinicas por criterio visual.
- No modificar base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Si un campo parece mal ubicado, debe volver a Revision de flujo clinico antes de pedir cambios backend.

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
