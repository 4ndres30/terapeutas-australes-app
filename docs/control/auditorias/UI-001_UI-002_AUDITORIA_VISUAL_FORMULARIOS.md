# UI-001 + UI-002 — Auditoría visual y formularios del flujo clínico

## Estado

Aprobadas con observaciones

## Fecha

2026-06-12

## Rama auditada

`main`

## Fuente del informe

Este documento consolida el informe UI-001 + UI-002 entregado por UI / UX / Pulido visual. La auditoría revisó la experiencia visual, pantallas principales y formularios del flujo clínico actual del proyecto `terapeutas-australes-app`.

## Alcance de la revisión

Revisión estática/documental contra la rama `main`, sin ejecución local, sin ejecución de Supabase y sin cambios de archivos durante la auditoría original. Esta documentación registra oficialmente el resultado de la auditoría ya ejecutada.

## Restricciones respetadas

- No se modificó código fuente.
- No se modificaron estilos.
- No se modificaron migraciones.
- No se tocó `.env`.
- No se ejecutó Supabase.
- No se ejecutó `supabase db push`.
- No se tocó Supabase remoto.
- No se modificaron datos reales.
- No se hizo merge a `main`.
- No se modificaron decisiones clínicas.
- No se modificó backend.
- La documentación se limitó a Markdown dentro de `docs/control/`.

## Resumen ejecutivo

La UI actual sostiene correctamente el flujo clínico aprobado: Paciente -> Consulta -> Evaluación -> Caso -> Elementos del caso -> Revisiones del caso -> Detalle de revisión / aspectos revisados. La ficha del caso actúa como contenedor operativo central, lo que respeta que revisiones y detalles vivan dentro del caso.

La interfaz se percibe seria, clara y suficientemente profesional para la etapa actual, especialmente en Pacientes, Casos y Detalle de caso. Sin embargo, todavía no está lista como experiencia operativa completa para hallazgos, trabajos/intervenciones, sesiones, acciones, finanzas por unidad cobrable, agenda y reportes por rol.

El resultado general de UI-001 + UI-002 es **aprobadas con observaciones**.

## Documentos revisados

- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/RFC-001_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`
- `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`

## Pantallas revisadas

- Login.
- Dashboard / layout privado.
- Pacientes.
- Consultas.
- Evaluaciones.
- Casos.
- Detalle de caso.
- Elementos del caso.
- Revisiones del caso.
- Detalle de revisiones.
- Hallazgos dentro del detalle de revisión.
- Trabajos / intervenciones.
- Pagos dentro del caso.
- Finanzas.
- Agenda.
- Reportes.

## Flujo visual validado

Se valida visualmente el flujo base:

`Paciente -> Consulta -> Evaluación -> Caso -> Elementos del caso -> Revisiones del caso -> Detalle de revisión / aspectos revisados`

La ficha del caso concentra correctamente los módulos internos y evita que revisiones, detalle de revisiones y elementos del caso se comporten como módulos principales independientes. Esto acompaña el flujo clínico aprobado y respeta DEC-006.

## Hallazgos críticos

Sin hallazgos críticos bloqueantes para la etapa actual de auditoría.

## Hallazgos importantes

1. El detalle de caso puede volverse demasiado largo. Actualmente concentra resumen, origen clínico, elementos, revisiones, detalle, trabajos, pagos y seguimiento en una misma página con navegación por anclas. Es funcional, pero necesita una navegación más operativa.
2. Hallazgos no tiene panel operativo. `revision_hallazgos` existe en backend, pero la UI no permite crear ni gestionar hallazgos dentro del detalle de revisión.
3. Detalle de revisión mezcla muchos niveles de información. El formulario de aspectos revisados puede confundir área, aspecto, métrica, resultado, hallazgo, seguimiento y acción.
4. Trabajos/intervenciones están en modo lectura. El panel lista trabajos del caso, pero no permite crear trabajos, sesiones ni acciones.
5. Finanzas muestra cobros, pagos y saldos, pero aún no guía por unidad cobrable. Falta diferenciar claramente consulta, evaluación, revisión, trabajo o paquete/caso.
6. Agenda está correctamente bloqueada como placeholder. No debe pasar a modo operativo hasta que exista backend tipificado.
7. Reportes mezclan indicadores clínicos y financieros. Deben separarse por rol para evitar información parcial o confusa.
8. Hay textos técnicos visibles al usuario, como referencias a Supabase local, tablas reales, columnas reales o vistas calculadas.
9. Dashboard no existe como pantalla principal real. Existe shell privado, pero Inicio no opera como dashboard.
10. Notificaciones aparecen como affordance no validado. Hay botón/contador visible, pero no flujo funcional confirmado.

## Hallazgos menores

- Pacientes tiene una experiencia más pulida que otros módulos y puede servir como referencia visual.
- Casos usa formulario progresivo bien orientado al flujo clínico.
- Consultas y Evaluaciones son funcionales, pero tienen microcopy técnico.
- Elementos, Revisiones y Detalle de revisión necesitan patrón común para formularios largos.
- Algunos estados vacíos son claros, pero otros describen detalles técnicos internos.
- La navegación lateral es funcional, pero los íconos simbólicos deberían normalizarse en una etapa posterior.
- Algunos botones o affordances requieren validación funcional antes del pulido final.

## Revisión por pantalla

### Login

Pantalla simple y funcional para acceso interno. Presenta marca, título, campos email/contraseña y estado de validación. Requiere diferenciar mejor mensajes de error, advertencia, usuario sin autorización o usuario inactivo.

### Dashboard

Existe como layout privado con navegación lateral y topbar. No existe todavía una pantalla Dashboard/Inicio real con métricas operativas. Para terapeuta/admin la ruta inicial lleva a Pacientes; para finanzas lleva a Finanzas.

### Pacientes

Pantalla aprobada con observaciones menores. Tiene métricas, directorio, búsqueda, filtros, formulario progresivo y preview vivo. Es la referencia visual más sólida para otros módulos.

### Consultas

Pantalla funcional con listado, búsqueda, métricas y formulario base. Respeta que una consulta se asocia a paciente. Requiere reemplazar textos técnicos por lenguaje clínico/productivo.

### Evaluaciones

Correcta en flujo, porque nace desde consulta y valida relación consulta-paciente. El formulario es largo y debería dividirse visualmente en origen, relato, síntomas/hechos, decisión de revisión y notas internas.

### Casos

Pantalla bien alineada al flujo clínico. Usa formulario progresivo por paciente/origen, datos del caso y seguimiento. Después de guardar debería guiar con mayor claridad hacia abrir ficha, agregar elementos o crear revisión.

### Detalle de caso

Cumple su rol como ficha operativa central. Muestra resumen, origen clínico y paneles internos. Requiere rediseño de navegación para evitar una página demasiado extensa.

### Elementos del caso

Funciona como panel interno del caso. Lista y crea elementos asociados al caso/paciente abierto. Requiere dividir el formulario en bloques: identidad, rol/prioridad, fuente/confirmación, antecedentes y notas.

### Revisiones del caso

Correcta como panel interno. Permite crear revisiones asociadas al caso y hereda paciente, consulta y evaluación cuando existen. Requiere mejorar la agrupación visual del formulario.

### Detalle de revisión

Funcional y técnicamente alineado. Exige revisión y elemento reales del caso. Su principal problema UX es la sobrecarga de campos y la mezcla conceptual entre aspecto revisado, resultado, seguimiento y posible hallazgo.

### Hallazgos dentro del detalle de revisión

No existe panel operativo. Debe diseñarse dentro del detalle de revisión y no como módulo principal independiente. La acción sugerida es contextual: marcar un aspecto revisado como hallazgo relevante.

### Trabajos / intervenciones

Panel de lectura correcto para trabajos ya existentes. Falta flujo operativo para crear trabajos y administrar sesiones y acciones.

### Pagos dentro del caso

Vista correcta de lectura financiera filtrada por caso. Muestra cobros, pagos, total, pagado y saldo. Falta distinguir claramente la unidad cobrable.

### Finanzas

Módulo financiero de lectura. Muestra cobros, pagos y métricas generales. Requiere una experiencia operativa para crear cobros/pagos y evitar duplicidades por unidad cobrable.

### Agenda

Placeholder correcto. Declara que no existe tabla pública de agenda, citas o eventos y no habilita guardado. Debe esperar backend antes de diseño operativo.

### Reportes

Pantalla solo lectura con métricas clínicas y financieras. Requiere separación por rol y estrategia para evitar reportes parciales confusos cuando RLS limite lecturas.

## Revisión por formulario

### Paciente

Aprobado. Formulario progresivo, claro y con preview vivo. Mantener como patrón base.

### Consulta

Aprobado con observaciones. Campos en momento correcto. Requiere mejor microcopy y separación más clara entre motivo, resumen y observaciones internas.

### Evaluación

Aprobado con observaciones. Respeta consulta -> paciente. Falta guiar qué hacer después de guardar: crear caso, dejar pendiente o cerrar evaluación.

### Caso

Aprobado. Bien estructurado y alineado con el flujo. Permite origen clínico opcional sin romper la regla de caso como contenedor central.

### Elemento del caso

Requiere ajustes de UX. El formulario es correcto pero extenso. Debe dividirse en secciones para reducir carga cognitiva.

### Revisión

Aprobada con observaciones. Correctamente dentro del caso. Requiere agrupación visual por datos, método/alcance, resultado y seguimiento.

### Aspectos revisados

Requiere ajustes importantes. Es potente, pero mezcla muchas variables. Debe transformarse en una experiencia guiada.

### Hallazgos

Requiere diseño operativo. No debe existir como módulo principal de creación. Debe integrarse dentro del detalle de revisión.

### Trabajo

Requiere diseño operativo. Debe dividirse por niveles: trabajo, elementos/hallazgos asociados, sesiones y acciones.

### Cobros / pagos

Requiere diseño operativo. Debe distinguir cobro, pago, saldo, vencimiento, estado y unidad cobrable.

### Agenda

Bloqueada correctamente hasta que Backend defina la estructura tipificada.

## Problemas de jerarquía visual

- Detalle de caso necesita una navegación más fuerte y posiblemente tabs o secciones colapsables.
- Pacientes y Casos tienen mayor madurez visual que otros módulos.
- Los formularios largos no separan siempre campos obligatorios, opcionales, clínicos, administrativos y financieros.
- Hallazgos, trabajos y finanzas necesitan llamadas a la acción más contextuales.
- Los textos técnicos reducen la sensación de producto final.

## Problemas de usabilidad

- No siempre queda claro qué hacer después de guardar.
- Falta transición guiada desde evaluación hacia caso.
- Falta transición guiada desde aspecto revisado hacia hallazgo.
- Falta transición guiada desde hallazgo hacia trabajo.
- Falta flujo trabajo -> sesión -> acción.
- Finanzas no guía por unidad cobrable.
- Reportes debe explicar mejor la información parcial por rol.

## Problemas de flujo clínico detectados desde UI

No se detectan rupturas graves del flujo clínico aprobado. La UI respeta que el caso conecta todo y que revisiones/detalle viven dentro del caso.

Sí existe riesgo de confusión en Detalle de revisión: el usuario podría registrar como aspecto revisado algo que debería ser hallazgo, trabajo o acción. Este punto debe corregirse con diseño visual, no cambiando la decisión clínica.

## Problemas que deben volver a Revisión de flujo clínico

- Criterio final para convertir un aspecto revisado en hallazgo.
- Criterio para decidir si un hallazgo queda como registro, seguimiento o trabajo.
- Regla clínica para trabajos originados desde múltiples hallazgos.
- Nomenclatura final de seguimiento, resultado, próxima acción y cierre.
- Reglas clínicas para paquetes/casos cobrables.

## Problemas que deben volver a Backend

- Soporte operativo de hallazgos derivados de aspectos.
- Trazabilidad hallazgo -> trabajo, incluyendo posibles múltiples hallazgos.
- Backend de agenda tipificada.
- Reglas y/o vistas de finanzas por unidad cobrable.
- Vistas clínicas agregadas para ficha de caso y reportes.
- Validación RLS por roles para módulos nuevos y reportes.

## Recomendaciones UI/UX

- Rediseñar Detalle de caso como panel operativo clínico.
- Diseñar hallazgos como acción contextual dentro del detalle de revisión.
- Evitar formularios gigantes mediante pasos, secciones o acordeones.
- Reemplazar microcopy técnico por lenguaje clínico y operativo.
- Separar datos clínicos, administrativos, financieros y notas internas.
- Crear acciones de continuidad: crear caso, agregar elemento, crear revisión, registrar hallazgo y generar trabajo.
- Mantener Agenda como placeholder hasta backend.
- Separar Reportes por rol.
- Diseñar Finanzas desde unidad cobrable.
- Crear checklist responsive antes del pulido final.

## Tareas UI sugeridas

### UI-010 — Rediseñar navegación del detalle de caso

**Prioridad:** Alta.  
**Objetivo:** Convertir la ficha de caso en una experiencia operativa clara, con navegación interna más usable.

### UI-011 — Diseñar panel operativo de hallazgos dentro del detalle de revisión

**Prioridad:** Alta.  
**Objetivo:** Permitir registrar hallazgos relevantes desde aspectos revisados, sin crear módulo principal independiente.

### UI-012 — Diseñar flujo visual hallazgo → trabajo

**Prioridad:** Alta.  
**Objetivo:** Diseñar la decisión contextual para convertir hallazgo en trabajo solo cuando corresponda.

### UI-013 — Diseñar experiencia de trabajos, sesiones y acciones

**Prioridad:** Alta.  
**Objetivo:** Crear flujo guiado por niveles: trabajo -> sesión -> acción.

### UI-014 — Diseñar agenda tipificada

**Prioridad:** Media-alta.  
**Condición:** Esperar backend de agenda antes de pantalla operativa.  
**Objetivo:** Proponer UI para consulta, evaluación, revisión, sesión de trabajo, seguimiento y recordatorio interno.

### UI-015 — Mejorar experiencia de finanzas por unidad cobrable

**Prioridad:** Alta.  
**Objetivo:** Diseñar cobros/pagos con unidad cobrable clara y saldo visible.

### UI-016 — Mejorar reportes por rol

**Prioridad:** Media-alta.  
**Objetivo:** Separar reportes para terapeuta, finanzas y admin.

### UI-017 — Definir checklist responsive de pantallas clínicas

**Prioridad:** Media.  
**Objetivo:** Crear pauta desktop/tablet/mobile para pantallas clínicas.

### UI-018 — Normalizar microcopy clínica y retirar textos técnicos visibles

**Prioridad:** Media.  
**Objetivo:** Reemplazar referencias técnicas por lenguaje útil para uso interno real.

### UI-019 — Definir patrón común de formularios clínicos largos

**Prioridad:** Media-alta.  
**Objetivo:** Estandarizar formularios extensos con secciones reutilizables.

## Prioridad recomendada

Primer bloque sugerido:

1. UI-010
2. UI-011
3. UI-012
4. UI-015

## Conclusión

UI-001 + UI-002 quedan **aprobadas con observaciones**.

La interfaz sostiene bien el flujo clínico aprobado y respeta que el caso sea el contenedor central. Sin embargo, aún requiere diseño operativo para hallazgos, trabajos/intervenciones, sesiones, acciones, finanzas por unidad cobrable, agenda tipificada y reportes por rol.

No se recomienda modificar decisiones clínicas ni backend desde UI/UX. Las próximas tareas visuales deben depender de Control de Desarrollo y coordinarse con Revisión de flujo clínico e Integración Backend/Estructura cuando corresponda.
