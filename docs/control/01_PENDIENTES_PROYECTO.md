# Pendientes del proyecto

Fecha de apertura: `2026-06-11`  
Responsable del documento: Control de desarrollo

Este documento es la lista maestra de pendientes. Cada pendiente debe tener un codigo, un responsable y un estado permitido. Los detalles tecnicos o clinicos pueden vivir en los documentos especializados, pero este archivo debe permitir ver rapidamente que falta.

## Reglas de uso

- No registrar ideas vagas sin siguiente accion.
- No mezclar decisiones con pendientes; las decisiones van en `05_DECISIONES_PROYECTO.md`.
- No marcar como `Validada` una tarea que Javier no haya validado o que no tenga criterio de validacion cumplido.
- Si una tarea cambia de responsable, actualizar tambien el documento especializado correspondiente.

## Vista rapida

| Codigo | Tarea | Estado | Prioridad | Responsable |
| --- | --- | --- | --- | --- |
| PEND-001 | Levantar inventario real del proyecto desde `main`. | Pendiente | Alta | Control de desarrollo |
| PEND-002 | Clasificar pendientes por chat responsable. | Pendiente | Alta | Control de desarrollo |
| RFC-001 | Auditar flujo clinico completo. | Pendiente | Alta | Revision de flujo clinico |
| BE-001 | Inventariar estructura backend y Supabase local. | Pendiente | Alta | Integracion Backend/Estructura |
| UI-001 | Auditar pantallas principales y pulido visual. | Pendiente | Media | UI / UX / Pulido visual |
| QA-001 | Auditoria inicial del proyecto. | Integrada | Alta | Control de desarrollo |

## PEND-001 - Levantar inventario real del proyecto desde main

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/inventario-proyecto`  
**Dependencias:** Ninguna  

### Descripcion
Revisar el repositorio desde `main` para identificar pantallas, rutas, entidades, hooks, servicios, tipos y documentos existentes. Esta tarea no debe modificar codigo.

### Archivos relacionados
- `src/`
- `supabase/`
- `docs/`

### Criterios de aceptacion
- Listar modulos principales.
- Listar entidades funcionales detectadas.
- Detectar documentos previos utiles o desactualizados.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Debe servir como base para crear tareas concretas por chat.

## PEND-002 - Clasificar pendientes por chat responsable

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/clasificacion-pendientes`  
**Dependencias:** PEND-001  

### Descripcion
Tomar el inventario real del proyecto y convertirlo en tareas separadas para Revision de flujo clinico, Integracion Backend/Estructura y UI / UX / Pulido visual.

### Archivos relacionados
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`

### Criterios de aceptacion
- Cada tarea tiene codigo, estado, prioridad y responsable.
- No hay tareas duplicadas entre chats.
- Las dependencias quedan claras.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Si una tarea cruza dominios, Control de desarrollo debe dividirla antes de ejecutarla.

## QA-001 - Auditoria inicial del proyecto

**Estado:** Integrada
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/auditoria-control-proyecto`  
**Dependencias:** CTRL-001  

### Descripcion
Auditar el estado tecnico inicial del proyecto sin modificar codigo, migraciones, base de datos ni configuracion sensible.

### Archivos relacionados
- `docs/control/`
- `docs/avance-tecnico-2026-06-06-0304.md`
- `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`

### Criterios de aceptacion
- Confirmar que el repositorio oficial usado es `4ndres30/terapeutas-australes-app`.
- Identificar contenido historico que mencione repositorios antiguos.
- No modificar documentos historicos sin instruccion de Javier.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`.

### Observaciones
QA-001 queda reservada como auditoria inicial, no como tarea pendiente reutilizable.
