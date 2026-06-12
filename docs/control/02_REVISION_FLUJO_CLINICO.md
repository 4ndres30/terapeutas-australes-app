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

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/revision-flujo-clinico`  
**Dependencias:** PEND-001  

### Descripcion
Revisar el flujo completo desde paciente hasta detalle de revision para confirmar responsabilidades de cada entidad y detectar inconsistencias conceptuales.

### Archivos relacionados
- `src/`
- `supabase/migrations/`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`

### Criterios de aceptacion
- Listar entidades revisadas.
- Identificar duplicidades o campos mal ubicados.
- Separar hallazgos clinicos de hallazgos tecnicos.
- No modificar codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
La salida esperada es una lista de hallazgos y recomendaciones, no una implementacion.

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
