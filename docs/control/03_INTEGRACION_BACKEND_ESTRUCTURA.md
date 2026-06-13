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

**Estado:** Aprobada con observaciones  
**Prioridad:** Media  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/be-003-criterios-migraciones`  
**Dependencias:** BE-001, BE-002  

### Descripcion
Definir criterios minimos para crear, revisar, probar y aprobar futuras migraciones de Supabase/PostgreSQL sin afectar `.env`, Supabase remoto ni `main`.

### Archivos relacionados
- `supabase/migrations/`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`

### Resumen ejecutivo
- BE-003 queda documentada como pauta tecnica para futuras migraciones.
- Define criterios previos antes de crear migraciones.
- Define estructura recomendada de migraciones y orden seguro de cambios.
- Registra checklist previo y posterior a ejecucion local.
- Refuerza reglas de seguridad: no tocar `.env`, no usar `supabase db push`, no tocar Supabase remoto y no modificar datos reales.
- Define criterios para PRs con migraciones y validacion por Control de Desarrollo.
- Define criterios por tipo de cambio: tablas, columnas, checks, FK, indices, triggers, vistas, RLS/policies y funciones SQL.
- Establece criterios especiales para BE-010 a BE-017.
- Sugiere tareas posteriores BE-018 a BE-021 como propuestas, no activas.

### Informe detallado
- [`BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`](auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md)

### Criterios de aceptacion
- Definir checklist previo a migracion.
- Definir checklist posterior a migracion local.
- Reforzar que `supabase db push` esta prohibido salvo instruccion expresa futura.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No crear migraciones todavia.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-003_CRITERIOS_FUTURAS_MIGRACIONES.md`.

### Observaciones
BE-003 no crea migraciones ni implementa cambios. Habilita planificar BE-010 a BE-017 bajo un marco seguro, revisable y alineado con el flujo clinico aprobado.
