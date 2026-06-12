# Estado general del proyecto

Fecha de corte: `2026-06-11`  
Responsable del documento: Control de desarrollo  
Estado general documental: En análisis

## Resumen

El proyecto cuenta desde esta rama con una estructura documental de control en `docs/control/`. Esta estructura ordena responsabilidades, pendientes, decisiones y bitacora sin modificar codigo, migraciones ni base de datos.

Este documento no certifica el estado funcional del sistema. La revision clinica, backend y UI deben levantarse en tareas separadas.

## Aprobado

- Repositorio oficial de trabajo: `4ndres30/terapeutas-australes-app`.
- Rama estable de referencia: `main`.
- Rama documental de trabajo: `docs/control-proyecto`.
- Sistema de chats del proyecto:
  - Control de desarrollo.
  - Revision de flujo clinico.
  - Integracion estructura / backend.
  - UI / UX / Pulido visual.
- Sistema de codigos, estados y prioridades definido en `README.md`.
- Carpeta de control documental: `docs/control/`.

## En revision

- Estado real del flujo clinico en la aplicacion.
- Consistencia entre pacientes, consultas, evaluaciones, casos, revisiones y detalle de revision.
- Estado real de tipos, servicios, hooks y consultas a Supabase.
- Estado visual y responsive de pantallas principales.
- Pendientes tecnicos heredados de avances previos.

## Pendiente

- Levantar inventario real de pantallas, rutas, tablas y servicios desde `main`.
- Separar pendientes por chat responsable.
- Validar si existen duplicidades de campos o responsabilidades entre entidades clinicas.
- Revisar que toda decision importante quede registrada en `05_DECISIONES_PROYECTO.md`.
- Mantener bitacora de cambios documentales en `06_BITACORA_CAMBIOS.md`.

## No debe tocarse desde esta rama

- `.env`.
- Supabase remoto.
- Migraciones.
- Codigo fuente de la aplicacion.
- Base de datos local o remota.
- Rama `main`.

## Lectura inicial recomendada

1. `README.md`.
2. `00_ESTADO_GENERAL_PROYECTO.md`.
3. `01_PENDIENTES_PROYECTO.md`.
4. Documento del chat responsable segun la tarea.
5. `05_DECISIONES_PROYECTO.md`.
6. `06_BITACORA_CAMBIOS.md`.

## CTRL-001 - Mantener centro de mando documental

**Estado:** En proceso  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Descripcion
Mantener actualizado el estado general, los pendientes, las decisiones y la bitacora del proyecto para evitar duplicidades y perdida de contexto.

### Archivos relacionados
- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Los documentos existen y son faciles de leer.
- Las tareas usan codigos, estados y prioridades permitidas.
- Las restricciones criticas estan visibles.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Estructura documental inicial creada.

### Observaciones
Pendiente de validacion por Javier.

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
- `src/`
- `supabase/`
- `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`

### Criterios de aceptacion
- Identificar pantallas, rutas y modulos relevantes.
- Identificar servicios, tipos y hooks relevantes.
- No modificar archivos de codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`.

### Observaciones
QA-001 queda reservada como auditoria inicial, no como implementacion ni tarea pendiente reutilizable.
