# QA-001 - Auditoria inicial del proyecto

## Estado

En analisis

## Fecha

2026-06-11

## Rama auditada

`docs/control-proyecto`

## Commit documental previo

`c34e4daf7f176c6d5a0627da6936a30070304fe0`

## Objetivo

Auditar estado tecnico inicial sin modificar codigo, base de datos ni configuracion sensible.

## Restricciones respetadas

- No se toco `main`.
- No se hizo merge.
- No se abrio PR.
- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.
- No se instalaron dependencias.
- No se corrigieron errores.

## Resultado de ramas

### Rama actual

- `docs/control-proyecto`

### Ramas locales relevantes

- `main`
- `docs/control-proyecto`
- `feature/ajustar-relaciones-pagos-casos`
- `feature/ampliar-revisiones-cuerpos-traumas`
- `feature/casos-dashboard-base`
- `feature/casos-visual-polish`
- `feature/modulo-pagos`
- `feature/modulo-revisiones`
- `feature/modulo-trabajos`
- `feature/modulos-clinicos-base`
- `feature/pacientes-final-polish`
- `feature/tabla-casos`
- `feature/tabla-elementos-caso`
- `feature/tabla-evaluaciones`

### Ramas remotas relevantes

- `origin/main`
- `origin/feature/ajustar-relaciones-pagos-casos`
- `origin/feature/ampliar-revisiones-cuerpos-traumas`
- `origin/feature/casos-dashboard-base`
- `origin/feature/casos-visual-polish`
- `origin/feature/modulo-pagos`
- `origin/feature/modulo-revisiones`
- `origin/feature/modulo-trabajos`
- `origin/feature/modulos-clinicos-base`
- `origin/feature/pacientes-final-polish`
- `origin/feature/tabla-casos`
- `origin/feature/tabla-elementos-caso`
- `origin/feature/tabla-evaluaciones`
- `github-4ndres30/main`
- `github-4ndres30/feature/ajustar-relaciones-pagos-casos`
- `github-4ndres30/feature/ampliar-revisiones-cuerpos-traumas`
- `github-4ndres30/feature/casos-dashboard-base`
- `github-4ndres30/feature/casos-visual-polish`
- `github-4ndres30/feature/modulo-pagos`
- `github-4ndres30/feature/modulo-revisiones`
- `github-4ndres30/feature/modulo-trabajos`
- `github-4ndres30/feature/modulos-clinicos-base`
- `github-4ndres30/feature/pacientes-final-polish`
- `github-4ndres30/feature/tabla-casos`
- `github-4ndres30/feature/tabla-elementos-caso`
- `github-4ndres30/feature/tabla-evaluaciones`

### Rama `feature/pacientes-dashboard-premium`

- Existe local: no.
- Existe remoto `origin`: no.

## Resultado de build

- Comando ejecutado: `npm run build`.
- Resultado: pasa correctamente.
- Clasificacion: build exitoso.
- Errores TypeScript: no detectados.
- Errores por dependencias: no detectados.
- Errores por variables de entorno: no detectados.
- Otros errores: no detectados.
- Advertencia: Vite informa que algunos chunks superan 500 kB despues de minificacion.
- Archivos mencionados por errores: ninguno.

## Modulos revisados

- `src/pages/PacientesPage.tsx`
- `src/pages/ConsultasPage.tsx`
- `src/pages/EvaluacionesPage.tsx`
- `src/pages/CasosPage.tsx`
- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/ElementosCasoPanel.tsx`
- `src/pages/casos/RevisionesCasoPanel.tsx`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `src/pages/casos/PagosCasoPanel.tsx`
- `src/pages/FinanzasPage.tsx`
- `src/pages/AgendaPage.tsx`
- `src/pages/ReportesPage.tsx`
- `supabase/migrations/`

## Hallazgos criticos

Sin hallazgos criticos detectados en esta auditoria inicial.

## Hallazgos medios

- `AgendaPage` esta implementada como placeholder tecnico y declara que no existe tabla publica de agenda, citas o eventos. No es error de build, pero el modulo queda funcionalmente pendiente.
- `revision_hallazgos` existe en migraciones, pero no se detecto en los modulos React auditados una pantalla o flujo operativo para leer o registrar hallazgos. El detalle de revisiones opera principalmente con `revision_aspectos` y `revision_elementos`.
- `TrabajosCasoPanel` y `PagosCasoPanel` funcionan como lectura dentro del caso. La creacion operativa de trabajos, cobros y pagos no aparece en los paneles revisados.

## Hallazgos menores

- El build genera una advertencia de tamano de chunk superior a 500 kB. No bloquea la compilacion.
- Existe documentacion historica fuera de `docs/control/` que debe tratarse con cuidado porque puede contener contexto previo o referencias antiguas. No se modifico en esta auditoria.

## Riesgos de alineacion React / Supabase

- Los checks SQL revisados para `consultas`, `evaluaciones`, `casos`, `elementos_caso`, `revisiones`, `revision_elementos`, `revision_aspectos`, `trabajos`, `cobros` y `pagos` coinciden en general con las opciones usadas por los componentes auditados.
- `revision_aspectos` fue ampliada por la migracion `20260606050000_ampliar_revision_cuerpos_sutiles_y_traumas.sql`, lo que alinea el frontend con valores como `Cuerpos sutiles`, `Trauma energético`, `Separación`, `Retraimiento`, `Aislamiento`, `Secuestro`, `Integración`, `Alineación` y `Localización`.
- Las relaciones paciente/caso/revision/elemento estan reforzadas en frontend y en triggers SQL para `revisiones`, `revision_elementos` y `revision_aspectos`.
- Los formularios revisados entregan los campos obligatorios observados en migraciones para pacientes, consultas, evaluaciones, casos, elementos, revisiones y detalle de revision.
- Las tablas con RLS activado requieren validar el comportamiento en ejecucion con sesion y rol adecuados. Esta auditoria solo confirmo build y lectura estatica, no ejecuto pruebas contra Supabase.
- La vista `vista_cobros_estado` fue recreada en migracion posterior para incluir `evaluacion_id`, `revision_id` y `trabajo_id`. Los selects revisados usan columnas presentes en esa version final.

## Revision de regla arquitectonica

Regla revisada:

> Revisiones y detalle de revisiones viven dentro de la ficha del caso.

Resultado: se respeta en la revision estatica inicial.

Evidencia:

- `CasoDetallePage` monta `RevisionesCasoPanel` dentro de la ficha del caso y le entrega `casoId`, `pacienteId`, `consultaId` y `evaluacionId`.
- `CasoDetallePage` monta `DetalleRevisionesPanel` dentro de la ficha del caso y le entrega `casoId` y `pacienteId`.
- `RevisionesCasoPanel` consulta e inserta en `revisiones` filtrando/asignando `caso_id` y `paciente_id`.
- `DetalleRevisionesPanel` carga `revisiones`, `elementos_caso`, `revision_elementos` y `revision_aspectos` filtrando por `caso_id` y `paciente_id`.
- `DetalleRevisionesPanel` valida que la revision y el elemento pertenezcan al caso y paciente abiertos antes de insertar detalle.
- Las migraciones refuerzan esta regla con claves foraneas y triggers de validacion de relaciones.

## Tareas sugeridas posteriores

## BE-001 - Validar esquema consolidado Supabase local contra frontend

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** QA-001  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/qa-backend-esquema-consolidado`  
**Dependencias:** QA-001  

### Descripcion
Confirmar, sin tocar Supabase remoto, que el esquema local resultante de migraciones coincide con los selects, inserts y vistas usadas por React.

### Archivos relacionados
- `src/pages/`
- `src/pages/casos/`
- `supabase/migrations/`

### Criterios de aceptacion
- Verificar columnas finales por tabla.
- Verificar vista `vista_cobros_estado`.
- Verificar RLS y policies para lectura/escritura esperada.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Debe ser una validacion local o documental; cualquier cambio requiere tarea posterior aprobada.

## RFC-001 - Revisar responsabilidad clinica de revisiones, detalle y hallazgos

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Origen:** QA-001  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/rfc-revisiones-detalle-hallazgos`  
**Dependencias:** QA-001  

### Descripcion
Confirmar si `revision_aspectos`, `revision_elementos` y `revision_hallazgos` tienen responsabilidades clinicas bien separadas y si falta pantalla para hallazgos.

### Archivos relacionados
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `supabase/migrations/20260606041000_crear_tabla_revision_elementos.sql`
- `supabase/migrations/20260606042000_crear_tabla_revision_aspectos.sql`
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`

### Criterios de aceptacion
- Definir que registra cada nivel.
- Confirmar si hallazgos necesita UI propia.
- No modificar codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
No implementar hasta que Javier valide el flujo clinico.

## UI-001 - Auditar modulos pendientes y lectura operacional

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** UI / UX / Pulido visual  
**Origen:** QA-001  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/ui-modulos-pendientes`  
**Dependencias:** QA-001  

### Descripcion
Revisar experiencia de uso en `AgendaPage`, `TrabajosCasoPanel`, `PagosCasoPanel`, `FinanzasPage` y `ReportesPage`, diferenciando placeholders, pantallas de lectura y flujos pendientes.

### Archivos relacionados
- `src/pages/AgendaPage.tsx`
- `src/pages/FinanzasPage.tsx`
- `src/pages/ReportesPage.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `src/pages/casos/PagosCasoPanel.tsx`

### Criterios de aceptacion
- Identificar pantallas solo lectura.
- Identificar placeholders.
- Separar deuda visual de deuda funcional.
- No modificar codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
No convertir placeholders en formularios sin decision backend y clinica previa.

## QA-002 - Ejecutar auditoria runtime local controlada

**Estado:** Pendiente  
**Prioridad:** Media  
**Responsable:** Control de desarrollo  
**Origen:** QA-001  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/qa-runtime-local`  
**Dependencias:** BE-001  

### Descripcion
Ejecutar una auditoria de runtime en entorno local, con Supabase local y sesion adecuada, para confirmar que RLS, vistas y formularios funcionan como se espera.

### Archivos relacionados
- `src/`
- `supabase/migrations/`
- `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`

### Criterios de aceptacion
- No tocar Supabase remoto.
- No ejecutar `supabase db push`.
- Registrar errores sin corregirlos.
- No modificar codigo salvo tarea posterior aprobada.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Esta tarea requiere confirmar previamente el entorno local autorizado.

## Conclusion

El proyecto queda **aprobado con observaciones** para la siguiente auditoria.

No hay bloqueo de build ni hallazgos criticos en esta revision inicial. Las observaciones principales son funcionales/documentales: agenda pendiente, hallazgos de revision sin flujo UI detectado en los modulos auditados, y paneles de trabajos/pagos principalmente en modo lectura.
