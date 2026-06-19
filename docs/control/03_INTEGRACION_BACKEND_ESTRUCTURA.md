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

## Estado post BE-011

BE-011 queda integrada documentalmente por PR #18.

La decision tecnica registrada es que la primera version de trazabilidad hallazgo a trabajo usara `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal. No se requiere migracion inicial para ese alcance.

La tabla puente `trabajo_hallazgos` no se crea en esta etapa. Queda como alternativa futura solo si se confirma una necesidad real muchos-a-muchos que no pueda resolverse con `revision_hallazgo_origen_id`, `trabajo_elementos.revision_hallazgo_id` o `trabajo_acciones.revision_hallazgo_id`.

La implementacion funcional hallazgo a trabajo queda pendiente para una tarea futura, posterior a QA-002 y UI-012.

## BE-001 - Inventariar estructura backend y Supabase local

**Estado:** Integrada
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

## BE-010 - Ajustar soporte operativo de hallazgos derivados de aspectos

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** BE-002 / Control de desarrollo
**Fecha creacion:** 2026-06-12
**Fecha documentacion:** 2026-06-13
**Rama sugerida:** `docs/be-010-plan-hallazgos-operativos`
**Dependencias:** DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, BE-002, BE-003, UI-011

### Descripcion
Definir el soporte tecnico minimo para operar `revision_hallazgos` dentro del detalle de revision, respetando que los hallazgos nacen desde aspectos revisados y viven dentro del caso.

### Archivos relacionados
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`
- `supabase/migrations/20260606042000_crear_tabla_revision_aspectos.sql`
- `supabase/migrations/20260606041000_crear_tabla_revision_elementos.sql`
- `supabase/migrations/20260606055000_activar_rls_y_policies.sql`
- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/RevisionesCasoPanel.tsx`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`

### Resumen ejecutivo
- BE-010 queda documentada como plan tecnico para hallazgos operativos.
- `revision_hallazgos` parece suficiente para iniciar soporte operativo minimo sin migracion inicial.
- La tabla mantiene trazabilidad hacia paciente, caso, revision, elemento de revision, elemento del caso y aspecto revisado.
- La brecha principal esta en frontend, servicio/hook y tipos TypeScript.
- La accion de crear hallazgo debe vivir dentro de `DetalleRevisionesPanel`.
- No debe crearse modulo principal independiente de hallazgos.
- No deben crearse trabajos automaticamente desde hallazgos.
- BE-011 queda fuera de alcance y debera tratar la trazabilidad hallazgo a trabajo.
- Debe coordinarse con UI-011 antes de la implementacion visual.

### Informe detallado
- [`BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`](auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md)

### Criterios de aceptacion
- Confirmar estado tecnico de `revision_hallazgos`.
- Confirmar si requiere migracion inicial.
- Definir flujo tecnico recomendado.
- Definir flujo esperado desde UI.
- Definir cambios futuros en frontend, servicio/hook y tipos TypeScript.
- Mantener hallazgos dentro del detalle de revision.
- No crear modulo principal independiente de hallazgos.
- No crear trabajos automaticamente.
- No modificar codigo fuente.
- No modificar migraciones.
- No crear migraciones.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`.

### Observaciones
BE-010 no implementa cambios. No requiere migracion inicial para el soporte operativo minimo. Requiere implementacion posterior en frontend, servicio/hook y tipos TypeScript. Debe coordinarse con UI-011. BE-011 queda fuera de alcance.

## BE-011 - Trazabilidad hallazgo → trabajo

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** Integracion Backend/Estructura
**Origen:** Control de desarrollo / BE-010
**Fecha creacion:** 2026-06-16
**Fecha documentacion:** 2026-06-16
**Rama sugerida:** `docs/be-011-trazabilidad-hallazgo-trabajo`
**Dependencias:** BE-010, UI-011, DEC-007, DEC-008, DEC-009, DEC-010, DEC-012

### Descripcion
Diseñar la trazabilidad tecnica entre `revision_hallazgos` y `trabajos`, sin implementar cambios, migraciones ni codigo.

### Archivos relacionados
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`
- `supabase/migrations/20260606051000_crear_modulo_trabajos.sql`
- `src/hooks/useRevisionHallazgos.ts`
- `src/types/revisionHallazgos.ts`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `docs/control/auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`

### Resumen ejecutivo
- BE-011 queda documentada como informe tecnico de trazabilidad hallazgo a trabajo.
- La estructura actual permite vincular trabajos con hallazgos mediante `trabajos.revision_hallazgo_origen_id`.
- No se requiere migracion inicial para una primera version.
- La primera version debe usar un hallazgo origen principal por trabajo.
- La tabla puente `trabajo_hallazgos` queda como alternativa futura si se confirma necesidad muchos-a-muchos.
- No deben crearse trabajos automaticamente desde hallazgos.
- No deben crearse sesiones, acciones ni cobros automaticamente.
- Debe coordinarse con UI-012 para el flujo visual hallazgo a trabajo.
- Debe coordinarse con BE-013/BE-016 para evitar duplicidad financiera si el trabajo se cobra.

### Informe detallado
- [`BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`](auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md)

### Criterios de aceptacion
- Confirmar si `trabajos` permite vincularse a un hallazgo.
- Confirmar si `revision_hallazgo_origen_id` es suficiente para primera version.
- Definir si se requiere tabla puente futura.
- Definir escenarios uno a uno, uno a varios y varios a uno.
- Definir flujo tecnico recomendado.
- Definir validaciones frontend y base de datos.
- Definir riesgos clinicos, tecnicos y financieros.
- No modificar codigo fuente.
- No modificar migraciones.
- No crear migraciones.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.
- No fusionar a `main`.

### Resultado
Integrada documentalmente por PR #18. Resultado registrado en `docs/control/auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`.

### Observaciones
La estructura actual permite vincular trabajos con hallazgos mediante `trabajos.revision_hallazgo_origen_id`, por lo que no se requiere migracion inicial. La primera version debe usar un hallazgo origen principal por trabajo. La tabla puente `trabajo_hallazgos` queda como alternativa futura si se confirma necesidad muchos-a-muchos.

## SEC-002 - Matriz de permisos por tabla y rol

**Estado:** Aprobada con observaciones como diseño documental.

Se documenta la matriz esperada de permisos para `admin`, `terapeuta` y `finanzas`. Esta matriz debe usarse como referencia para SEC-001, donde se probará runtime que RLS y policies se comporten según lo esperado.

### Decisiones relevantes

- Finanzas debe operar cobros/pagos y solo datos mínimos administrativos.
- Finanzas no debe acceder a datos clínicos sensibles.
- Terapeuta opera flujo clínico y trabajos, pero no administra cobros/pagos.
- Admin mantiene acceso transversal, preferentemente con anulación lógica antes que delete físico.
- Delete físico debe prohibirse en producción para datos clínicos y financieros.
- Reportes debe separarse por rol.

### Informe relacionado

`docs/control/auditorias/SEC-002_MATRIZ_PERMISOS_ROLES.md`

## SEC-004 - Alcance del rol Finanzas

**Estado:** Aprobada con observaciones como diseño documental.

Se define que el rol Finanzas debe operar con alias administrativo, identificador interno y datos financieros mínimos. No debe acceder a ficha completa del paciente, datos clínicos sensibles, elementos del caso, hallazgos, sesiones, acciones terapéuticas, fotos ni archivos clínicos asociados.

### Decisiones relevantes

- Finanzas debe operar cobros, pagos y reportes financieros.
- Finanzas debe usar alias administrativo o código financiero por defecto.
- Nombre completo, teléfono y email quedan prohibidos por defecto o pendientes de aprobación expresa y consentimiento suficiente.
- BE-016 debe diseñar una vista financiera mínima por unidad cobrable.
- SEC-001 debe probar runtime que RLS bloquee acceso financiero a datos clínicos.
- BE-021 debe definir anulación lógica y prohibición de delete físico financiero en producción.

### Informe relacionado

`docs/control/auditorias/SEC-004_ALCANCE_ROL_FINANZAS.md`
