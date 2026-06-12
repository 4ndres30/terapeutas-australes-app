# Integracion backend / estructura

Responsable: Integracion Backend/Estructura  
Estado del documento: En analisis  
Fecha creacion: `2026-06-11`

Este documento controla tareas tecnicas relacionadas con estructura, Supabase, migraciones, vistas SQL, servicios, tipos, hooks y logica funcional. Las tareas tecnicas deben venir aprobadas por Control de desarrollo o por una decision registrada.

## Alcance futuro permitido con tarea aprobada

- Revisar estructura Supabase local.
- Revisar migraciones existentes.
- Proponer nuevas migraciones.
- Revisar vistas SQL.
- Revisar tipos TypeScript.
- Revisar servicios y hooks.
- Implementar logica funcional aprobada.

## Restricciones actuales

En esta rama documental:

- No modificar codigo fuente.
- No modificar migraciones.
- No ejecutar SQL.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No fusionar a `main`.

## Criterio de entrada para una tarea backend

Una tarea backend debe indicar:

- Decision o pendiente que la origina.
- Rama sugerida.
- Archivos o modulos relacionados.
- Si requiere migracion, vista, servicio, hook o tipo.
- Criterios de aceptacion verificables.
- Riesgos de datos o compatibilidad.

## BE-001 - Inventariar estructura backend y Supabase local

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/inventario-backend-estructura`  
**Dependencias:** PEND-001  

### Descripcion
Revisar la estructura tecnica existente para identificar migraciones, tablas esperadas, tipos, servicios, hooks y consultas relevantes. Esta tarea es de auditoria documental y no debe ejecutar cambios.

### Archivos relacionados
- `supabase/migrations/`
- `src/`
- `package.json`

### Criterios de aceptacion
- Listar migraciones existentes sin modificarlas.
- Listar servicios, hooks y tipos detectados.
- Identificar posibles desalineaciones con el flujo clinico.
- No ejecutar SQL.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
No decidir cambios clinicos durante esta tarea; esos hallazgos deben volver a Revision de flujo clinico.

## BE-002 - Comparar backend con flujo clinico aprobado

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/backend-vs-flujo-clinico`  
**Dependencias:** RFC-001, BE-001  

### Descripcion
Comparar la estructura tecnica existente con las responsabilidades clinicas aprobadas para detectar campos, relaciones o servicios que requieran ajuste futuro.

### Archivos relacionados
- `supabase/migrations/`
- `src/`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`

### Criterios de aceptacion
- Separar hallazgos de estructura, datos y logica.
- No proponer cambios visuales.
- No modificar migraciones.
- No ejecutar cambios de base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Todo cambio estructural debe transformarse en decision antes de implementarse.

## BE-003 - Preparar criterios para futuras migraciones

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/criterios-migraciones`  
**Dependencias:** BE-001  

### Descripcion
Definir criterios minimos para crear, revisar y validar futuras migraciones sin afectar Supabase remoto ni `main`.

### Archivos relacionados
- `supabase/migrations/`
- `docs/control/05_DECISIONES_PROYECTO.md`

### Criterios de aceptacion
- Definir checklist previo a migracion.
- Definir checklist posterior a migracion local.
- Reforzar que `supabase db push` esta prohibido salvo instruccion expresa futura.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Esta tarea solo documenta criterios; no crea migraciones.
