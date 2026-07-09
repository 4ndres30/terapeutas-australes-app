# BE-014 — Vistas clínicas agregadas para reportes evolutivos

**Código:** BE-014  
**Estado:** Implementada local/demo (migración lista, no aplicada en remoto)  
**Prioridad:** Media-alta  
**Responsable:** Integracion Backend/Estructura  
**Fecha creación:** 2026-07-08  
**Rama:** `feature/be-014-vistas-clinicas`  
**Migración:** `supabase/migrations/20260708000020_be014_vistas_clinicas_agregadas.sql`

---

## Objetivo

Crear vistas SQL de lectura que agreguen datos clínicos por caso, por revisión reciente y por paciente, sin exponer datos sensibles a roles no autorizados. Estas vistas sirven de base para reportes evolutivos y paneles operativos.

## Vistas creadas

### 1. `public.vista_resumen_evolutivo_caso`

Resumen consolidado por caso con conteos de:
- Revisiones (total, cerradas, última fecha)
- Hallazgos (total, activos, derivados a trabajo)
- Trabajos (total, activos, avance promedio)
- Elementos del caso (total)
- Cobros (total, monto pagado)

**Uso esperado:** Ficha de caso, reportes de terapeuta y admin.

### 2. `public.vista_actividad_clinica_reciente`

Revisiones de los últimos 90 días con conteo de hallazgos y datos básicos del caso vinculado.

**Uso esperado:** Panel de actividad clínica reciente. No disponible para finanzas.

### 3. `public.vista_carga_trabajo_terapeutica`

Métricas de carga activa por paciente:
- Casos activos
- Trabajos en curso y con seguimiento
- Revisiones del último mes
- Última revisión global
- Avance promedio global

**Uso esperado:** Panel de salud operativa para admin. No expone datos clínicos directos.

## Restricciones

- Solo lectura. No modifican datos ni disparan triggers.
- `CREATE OR REPLACE VIEW` — idempotente, seguro de re-ejecutar.
- No aplica `supabase db push`. Solo local.
- Las 3 vistas tienen `security_invoker = true` + `GRANT SELECT` solo a `authenticated` (patrón de `20260706000001_crear_vista_riesgo_abandono_casos.sql`). `vista_resumen_evolutivo_caso` y `vista_actividad_clinica_reciente` heredan la restricción a `es_terapeuta_o_admin()` de sus tablas base (casos/revisiones/revision_hallazgos/trabajos/elementos_caso). `vista_carga_trabajo_terapeutica` agrega un filtro explícito `public.es_admin()` porque sus tablas base solo exigen terapeuta-o-admin, no admin.
- No se exponen a Finanzas: las vistas referencian `casos`, `revisiones` y `trabajos` que ya tienen RLS por rol (`es_terapeuta_o_admin()`).

## Pendiente

- Aplicar la migración en Supabase local (`supabase db reset` o `migration up`) — requiere Docker activo.
- Integrar `vista_resumen_evolutivo_caso` en `CasoDetallePage` (tarea UI futura).
- Integrar `vista_actividad_clinica_reciente` en un panel de dashboard (tarea UI futura).
