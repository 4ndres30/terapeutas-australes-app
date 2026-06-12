# Integracion backend / estructura

Responsable: Integracion Backend/Estructura  
Estado del documento: En análisis
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

**Estado:** Aprobada con observaciones  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/be-001-inventario-backend`  
**Dependencias:** PEND-001  

### Descripcion
Revisar la estructura tecnica existente para identificar migraciones, tablas esperadas, tipos, servicios, hooks y consultas relevantes. Esta tarea es de auditoria documental y no debe ejecutar cambios.

### Archivos relacionados
- `supabase/migrations/`
- `src/`
- `package.json`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`

### Resumen ejecutivo
- BE-001 queda documentada como inventario backend y Supabase local.
- Se detectaron tablas clinicas base, tablas de revisiones, hallazgos, trabajos, finanzas y usuarios internos.
- Se detecto la vista `vista_cobros_estado`.
- Se detectaron triggers de `updated_at`, validacion de relaciones y actualizacion de estado financiero.
- Se detecto RLS activo para tablas clinicas, financieras y usuarios internos.
- React consume Supabase desde paginas clinicas, paneles de caso, finanzas y reportes.
- Hay formularios operativos para pacientes, consultas, evaluaciones, casos, elementos, revisiones y aspectos.
- No se detecto formulario operativo para hallazgos, trabajos, cobros ni pagos.
- Agenda no tiene tabla backend dedicada.
- La auditoria detecto desalineaciones React/Supabase que requieren tareas posteriores.
- Las observaciones tecnicas quedan registradas en el informe detallado.

### Informe detallado
- [`BE-001_INVENTARIO_BACKEND_SUPABASE.md`](auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md)

### Criterios de aceptacion
- Listar migraciones existentes sin modificarlas.
- Listar servicios, hooks y tipos detectados.
- Identificar posibles desalineaciones con el flujo clinico.
- No ejecutar SQL.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`.

### Observaciones
No se corrigieron errores ni se modifico logica. Las desalineaciones detectadas deben transformarse en tareas posteriores y pasar por Control de Desarrollo antes de implementarse.

## BE-002 - Comparar backend con flujo clinico aprobado

**Estado:** Aprobada con observaciones  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/be-002-alineacion-backend-flujo-clinico`  
**Dependencias:** RFC-001, BE-001, DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012  

### Descripcion
Comparar la estructura tecnica existente con las responsabilidades clinicas aprobadas para detectar campos, relaciones o servicios que requieran ajuste futuro.

### Archivos relacionados
- `supabase/migrations/`
- `src/`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`

### Resumen ejecutivo
- BE-002 valida que el backend esta alineado con el flujo clinico aprobado.
- `revision_aspectos` soporta el registro de lo medido u observado.
- `revision_hallazgos` esta bien trazado hacia caso, revision, elemento y aspecto.
- Hallazgos debe operar dentro del detalle de revision, no como modulo principal.
- `trabajos`, `trabajo_sesiones` y `trabajo_acciones` estan correctamente separados.
- Falta flujo operativo completo para hallazgos, trabajos, sesiones y acciones.
- Agenda no tiene backend dedicado y debe diseñarse como modulo mixto tipificado.
- Cobros/pagos requieren reforzar la regla de unidad cobrable para evitar duplicidad.
- RLS existe, pero debe validarse runtime por roles.
- Reportes requieren evolucionar hacia vistas o separacion por rol.

### Informe detallado
- [`BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`](auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md)

### Criterios de aceptacion
- Separar hallazgos de estructura, datos y logica.
- No proponer cambios visuales.
- No modificar migraciones.
- No ejecutar cambios de base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`.

### Observaciones
BE-002 no implementa cambios. Habilita planificar tareas tecnicas posteriores desde BE-010 en adelante, previa revision de Control de Desarrollo.

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
