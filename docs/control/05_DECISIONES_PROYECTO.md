# Decisiones del proyecto

Responsable del documento: Control de desarrollo  
Fecha creacion: `2026-06-11`

Este documento registra decisiones estables. No reemplaza la conversacion, pero evita perder acuerdos importantes entre chats.

## Reglas

- Registrar solo decisiones tomadas, no ideas.
- Si una decision cambia, crear una nueva entrada y marcar la anterior como reemplazada en observaciones.
- Toda decision que implique cambios tecnicos debe generar una tarea relacionada.
- Toda decision clinica debe poder ser entendida por Revision de flujo clinico.

## Vista rapida

| Codigo | Decision | Estado | Fecha |
| --- | --- | --- | --- |
| DEC-001 | Repositorio oficial del proyecto. | Validada | 2026-06-11 |
| DEC-002 | Sistema de chats y responsabilidades. | Validada | 2026-06-11 |
| DEC-003 | Sistema de codigos, estados y prioridades. | Validada | 2026-06-11 |
| DEC-004 | Restricciones de seguridad operativa. | Validada | 2026-06-11 |
| DEC-005 | `docs/control/` como centro documental. | Integrada | 2026-06-11 |
| DEC-006 | Revisiones y detalle de revisiones viven dentro de la ficha del caso. | Validada | 2026-06-12 |

## DEC-001 - Repositorio oficial del proyecto

**Estado:** Validada  
**Prioridad:** Crítica  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
El repositorio oficial del proyecto es `4ndres30/terapeutas-australes-app`.

### Razon
Evitar trabajar sobre el repositorio antiguo o mezclar historiales.

### Impacto
Todo trabajo futuro debe verificar remoto antes de editar, commitear, empujar o abrir PR.

### Observaciones
El repositorio antiguo no oficial no debe usarse.

## DEC-002 - Sistema de chats y responsabilidades

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
El proyecto se ordena en cuatro chats: Control de desarrollo, Revision de flujo clinico, Integracion estructura / backend y UI / UX / Pulido visual.

### Razon
Separar decisiones, revision clinica, ejecucion tecnica y pulido visual para evitar mezclas de responsabilidad.

### Impacto
Cada tarea debe indicar responsable y no invadir dominios ajenos.

### Observaciones
Control de desarrollo coordina; no ejecuta codigo salvo instruccion expresa.

## DEC-003 - Sistema de codigos, estados y prioridades

**Estado:** Validada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
Se usaran codigos por tipo de trabajo, estados permitidos y prioridades permitidas definidos en `README.md`.

### Razon
Facilitar trazabilidad sin crear burocracia pesada.

### Impacto
Todo pendiente nuevo debe usar codigo, estado, prioridad y responsable.

### Observaciones
No crear estados o prioridades nuevas sin actualizar esta decision.

## DEC-004 - Restricciones de seguridad operativa

**Estado:** Validada  
**Prioridad:** Crítica  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Decision
Queda prohibido tocar `.env`, ejecutar `supabase db push`, tocar Supabase remoto, fusionar a `main`, modificar codigo fuente, modificar migraciones, ejecutar cambios de base de datos o abrir PR desde esta tarea documental.

### Razon
Proteger datos, configuracion sensible, estabilidad de `main` y flujo de desarrollo.

### Impacto
Cualquier tarea futura que requiera romper una restriccion necesita instruccion expresa de Javier.

### Observaciones
Estas restricciones aplican especialmente a Codex y ChatGPT cuando trabajan con autonomia.

## DEC-005 - docs/control como centro documental

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** DEC-001, DEC-002, DEC-003, DEC-004  

### Decision
La carpeta `docs/control/` sera el centro documental practico del proyecto.

### Razon
Centralizar estado, pendientes, decisiones y bitacora para que Javier, ChatGPT y Codex compartan contexto.

### Impacto
Los chats deben revisar este directorio antes de proponer o ejecutar tareas relevantes.

### Observaciones
La estructura queda pendiente de validacion final por Javier antes de abrir PR.

## DEC-006 - Revisiones y detalle de revisiones viven dentro de la ficha del caso

**Estado:** Validada
**Prioridad:** Crítica
**Responsable:** Control de desarrollo
**Origen:** Javier / Control de desarrollo
**Fecha creación:** 2026-06-12
**Rama sugerida:** `docs/control-proyecto`
**Dependencias:** DEC-002, QA-001

### Decisión
Las revisiones y el detalle de revisiones no serán módulos principales independientes. Deben vivir dentro de la ficha del caso.

### Razón
Una revisión pertenece a un caso. El detalle de revisión depende de una revisión existente y de elementos reales del caso.

### Impacto
- `/revisiones` debe redirigir o depender de `/casos`.
- `/detalle-revisiones` debe redirigir o depender de `/casos`.
- La creación de revisiones debe realizarse desde la ficha del caso.
- La creación de detalles debe exigir revisión y elemento del caso existentes.

### Observaciones
Esta decisión protege el flujo clínico central y evita duplicidades funcionales.
