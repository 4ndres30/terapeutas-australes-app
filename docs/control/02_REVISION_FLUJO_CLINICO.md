# Revision de flujo clinico

Responsable: Revision de flujo clinico  
Estado del documento: En análisis
Fecha creacion: `2026-06-11`

Este documento controla las revisiones clinicas y funcionales. Su foco es validar que la aplicacion represente bien el trabajo terapeutico, sin duplicar informacion ni ubicar campos en entidades incorrectas.

## Alcance

- Pacientes.
- Consultas.
- Evaluaciones.
- Casos.
- Elementos del caso.
- Revisiones.
- Detalle de revision.

## Fuera de alcance

- Modificar codigo.
- Modificar migraciones.
- Ejecutar SQL.
- Tocar Supabase local o remoto.
- Decidir cambios visuales mayores.

## Modelo de referencia

```text
Paciente
  -> Consultas
  -> Evaluaciones
  -> Casos
       -> Elementos del caso
       -> Revisiones
            -> Detalle de revision
```

Principio guia:

```text
Casos no guarda todo.
Casos conecta todo.
```

## Preguntas de revision

- Que dato pertenece al paciente y no a la consulta?
- Que dato pertenece a una evaluacion y no al caso?
- Que dato debe vivir en el caso como sintesis?
- Que dato debe vivir en revision o detalle de revision?
- Hay campos repetidos con nombres distintos?
- Hay campos clinicos mezclados con campos administrativos?
- La informacion permite reconstruir el proceso terapeutico sin duplicar registros?

## RFC-001 - Auditar flujo clinico completo

**Estado:** Aprobada con observaciones  
**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Fecha documentacion:** 2026-06-12  
**Rama sugerida:** `docs/rfc-001-revision-flujo-clinico`  
**Dependencias:** PEND-001, QA-001, BE-001, DEC-006  

### Descripcion

Revisar el flujo completo desde paciente hasta seguimiento/agenda para confirmar responsabilidades de cada entidad y detectar inconsistencias conceptuales.

### Resumen ejecutivo

RFC-001 valida el flujo clinico central como aprobado con observaciones. El caso queda confirmado como contenedor operativo que conecta el proceso, mientras que revisiones y detalle de revisiones deben vivir dentro de la ficha del caso. No se detectan hallazgos clinicos criticos, pero quedan observaciones medias sobre la responsabilidad de `revision_hallazgos`, la conversion de hallazgos en trabajos/intervenciones, el rol clinico de Agenda y la regla operativa de cobros/pagos.

### Informe detallado

- [`RFC-001_REVISION_FLUJO_CLINICO.md`](docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md)

### Archivos relacionados

- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`

### Criterios de aceptacion

- Listar entidades revisadas.
- Identificar duplicidades o campos mal ubicados.
- Separar hallazgos clinicos de hallazgos tecnicos.
- No modificar codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado

Aprobada con observaciones. Resultado registrado en `docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md`.

### Observaciones

Las decisiones sugeridas por RFC-001 no quedan validadas automaticamente. Deben ser revisadas posteriormente por Control de Desarrollo y, si corresponde, registradas en `05_DECISIONES_PROYECTO.md`.

## RFC-002 - Detectar duplicidades entre entidades clinicas

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Origen:** Revision de flujo clinico  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/duplicidades-flujo-clinico`  
**Dependencias:** RFC-001  

### Descripcion

Revisar si existen campos repetidos o responsabilidades solapadas entre consultas, evaluaciones, casos, revisiones y detalle de revision.

### Archivos relacionados

- `supabase/migrations/`
- `src/`

### Criterios de aceptacion

- Clasificar cada duplicidad como clinica, tecnica o visual.
- Proponer ubicacion correcta del dato.
- No ordenar cambios de base de datos sin decision registrada.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado

Pendiente.

### Observaciones

Toda recomendacion estructural debe transformarse en decision o tarea backend antes de implementarse.

## RFC-003 - Validar detalle de revision

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** Revision de flujo clinico  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/detalle-revision-clinica`  
**Dependencias:** RFC-001  

### Descripcion

Revisar que el detalle de revision registre solo lo que corresponde a cada revision y no absorba informacion que debe estar en caso, evaluacion o consulta.

### Archivos relacionados

- `src/`
- `supabase/migrations/`

### Criterios de aceptacion

- Definir responsabilidad del detalle de revision.
- Identificar campos que deben moverse o mantenerse.
- No ejecutar cambios tecnicos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado

Pendiente.

### Observaciones

Si se detectan cambios requeridos, deben pasar primero por `DEC-001` o una nueva decision.
