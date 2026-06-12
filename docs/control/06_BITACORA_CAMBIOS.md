# Bitacora de cambios

Responsable del documento: Control de desarrollo  
Fecha creacion: `2026-06-11`

Esta bitacora registra cambios relevantes del control del proyecto. Debe ser breve y verificable.

## Como registrar

Cada entrada debe indicar:

- Codigo `LOG-###`.
- Fecha.
- Rama.
- Responsable.
- Resumen.
- Archivos tocados.
- Restricciones respetadas.
- Resultado.

## LOG-001 - Creacion de estructura documental de control

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Descripcion
Se crea la carpeta `docs/control/` con documentos de estado, pendientes, revision clinica, backend, UI/UX, decisiones y bitacora.

### Archivos relacionados
- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Crear solo archivos Markdown.
- No modificar codigo fuente.
- No modificar migraciones.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No fusionar a `main`.
- No abrir PR.

### Resultado
Estructura documental inicial integrada en la rama `docs/control-proyecto`.

### Observaciones
Pendiente de revision y aprobacion por Javier.
