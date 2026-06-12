# BE-001 — Inventario backend y Supabase local

## Estado

Aprobado con observaciones.

## Fecha

2026-06-12.

## Rama auditada

`main`.

## Fuente del informe

Este documento consolida la auditoria BE-001 ya realizada por Integracion estructura / backend. La auditoria fuente fue ejecutada en modo inventario, sin modificar codigo, migraciones ni configuracion.

## Objetivo

Inventariar la estructura backend y Supabase local contra el frontend actual, incluyendo migraciones, tablas, vistas, checks SQL, relaciones, triggers, RLS/policies, componentes React que usan Supabase, formularios que insertan datos, selects usados por paneles y reportes, y posibles desalineaciones React/Supabase.

## Restricciones respetadas

- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.
- No se hizo merge a `main`.
- No se abrio PR durante la auditoria BE-001.
- La auditoria fue solo lectura e informe.

## Resumen ejecutivo

- La base contiene estructura clinica base, revisiones, hallazgos, trabajos/intervenciones, finanzas y usuarios internos.
- La estructura backend es relacional y usa foreign keys para sostener paciente, consulta, evaluacion, caso, elementos, revisiones, trabajos y finanzas.
- Se detectaron triggers para `updated_at`, validacion de relaciones y actualizacion de estado financiero.
- Se detecto RLS activo para tablas clinicas, financieras y usuarios internos.
- React consume Supabase desde paginas clinicas, paneles de caso, finanzas y reportes.
- Hay formularios operativos para pacientes, consultas, evaluaciones, casos, elementos, revisiones y aspectos de revision.
- No se detecto formulario operativo para `revision_hallazgos`, trabajos/intervenciones, cobros ni pagos.
- Agenda existe como pantalla placeholder, sin tabla backend dedicada.
- Los riesgos historicos inicialmente asociados a `revision_aspectos` y `vista_cobros_estado` aparecen cubiertos por migraciones posteriores.
- `revision_aspectos` fue ampliada para incluir cuerpos sutiles, trauma energetico y metricas relacionadas.
- `vista_cobros_estado` fue recreada incluyendo `evaluacion_id`, `revision_id` y `trabajo_id`.
- Persisten observaciones funcionales por modulos incompletos: hallazgos, trabajos, finanzas operativas, agenda, RLS runtime y politica de anulacion/delete.
- Reportes puede operar parcial por RLS si lo usa un rol financiero sin acceso clinico.
- BE-001 queda aprobada con observaciones y debe originar tareas posteriores antes de implementar cambios.

## Build / validacion tecnica

No se ejecuto build durante BE-001 porque la tarea fue definida como auditoria/informe y no como validacion de codigo.  
No se ejecuto SQL, no se levanto Supabase local y no se hizo validacion runtime.  
Contexto previo disponible: QA-001 ya habia registrado que el build paso correctamente antes de esta documentacion.

## Migraciones revisadas

Migraciones relevantes identificadas durante la auditoria:

- `supabase/migrations/20260605175342_crear_tabla_pacientes.sql`
- `supabase/migrations/20260605190001_normalizar_rut_pacientes.sql`
- `supabase/migrations/20260605190939_eliminar_rut_de_pacientes.sql`
- `supabase/migrations/20260605191154_limpiar_columnas_pacientes.sql`
- `supabase/migrations/20260605203000_crear_tabla_consultas.sql`
- `supabase/migrations/20260605211000_agregar_trigger_updated_at_pacientes.sql`
- `supabase/migrations/20260605213000_crear_tabla_evaluaciones.sql`
- `supabase/migrations/20260605215000_crear_tabla_casos.sql`
- `supabase/migrations/20260606032000_crear_tabla_elementos_caso.sql`
- `supabase/migrations/20260606040000_crear_tabla_revisiones.sql`
- `supabase/migrations/20260606041000_crear_tabla_revision_elementos.sql`
- `supabase/migrations/20260606042000_crear_tabla_revision_aspectos.sql`
- `supabase/migrations/20260606043000_crear_tabla_revision_hallazgos.sql`
- `supabase/migrations/20260606050000_ampliar_revision_cuerpos_sutiles_y_traumas.sql`
- `supabase/migrations/20260606051000_crear_modulo_trabajos.sql`
- `supabase/migrations/20260606052000_crear_modulo_pagos.sql`
- `supabase/migrations/20260606053000_ajustar_relaciones_cobros_evaluaciones_revisiones.sql`
- `supabase/migrations/20260606054000_crear_tabla_usuarios_internos.sql`
- `supabase/migrations/20260606055000_activar_rls_y_policies.sql`

## Tablas detectadas

### `pacientes`

- **Proposito:** Registro maestro de pacientes.
- **Campos criticos:** `id`, `nombres`, `apellidos`, `fecha_nacimiento`, `sexo`, `telefono`, `email`, `comuna`, `region`, `estado`, `created_at`, `updated_at`.
- **Relaciones principales:** Referenciada por consultas, evaluaciones, casos, elementos, revisiones, trabajos, cobros y pagos.
- **Checks o restricciones importantes:** `id` UUID primary key; `rut` fue eliminado en migraciones posteriores; tambien fueron eliminadas columnas no requeridas como direccion, ocupacion, contacto de emergencia, motivo y observaciones generales.
- **Uso desde React:** `PacientesPage`, `ConsultasPage`, `EvaluacionesPage`, `CasosPage`, `CasoDetallePage`, `FinanzasPage`, `ReportesPage`.

### `consultas`

- **Proposito:** Registrar atenciones o contactos clinicos iniciales y posteriores.
- **Campos criticos:** `id_consulta`, `paciente_id`, `fecha_consulta`, `hora_inicio`, `hora_termino`, `tipo_consulta`, `modalidad`, `estado_consulta`, `motivo_consulta`, `resumen_consulta`, `observaciones_internas`.
- **Relaciones principales:** FK a `pacientes(id)`. Es referenciada por `evaluaciones`, `casos`, `revisiones` y `cobros`.
- **Checks o restricciones importantes:** Checks para tipo, modalidad, estado y horario valido.
- **Uso desde React:** `ConsultasPage`, `EvaluacionesPage`, `CasosPage`, `CasoDetallePage`, `ReportesPage`.

### `evaluaciones`

- **Proposito:** Registrar evaluacion derivada de una consulta.
- **Campos criticos:** `id_evaluacion`, `paciente_id`, `consulta_id`, `fecha_evaluacion`, `hora_evaluacion`, `relato_antecedentes`, `sintomas_reportados`, `hechos_clave`, `personas_mencionadas`, `decision_revision`, `fundamento_decision`, `notas_internas`, `estado_evaluacion`.
- **Relaciones principales:** FK a `pacientes(id)` y `consultas(id_consulta)`. Es referenciada por `casos`, `revisiones` y `cobros`.
- **Checks o restricciones importantes:** Validacion de decisiones y estados por checks SQL.
- **Uso desde React:** `EvaluacionesPage`, `CasosPage`, `CasoDetallePage`, `ReportesPage`.

### `casos`

- **Proposito:** Contenedor operativo que conecta paciente, consulta, evaluacion, elementos, revisiones, trabajos y finanzas.
- **Campos criticos:** `id_caso`, `paciente_id`, `consulta_id`, `evaluacion_id`, `fecha_apertura`, `hora_apertura`, `nombre_caso`, `motivo_apertura`, `descripcion_general`, `objetivo_trabajo`, `tipo_caso`, `prioridad`, `estado_caso`, `requiere_seguimiento`, `notas_seguimiento`, `fecha_cierre`, `resultado_cierre`, `notas_internas`.
- **Relaciones principales:** FK a `pacientes(id)`, `consultas(id_consulta)` y `evaluaciones(id_evaluacion)`. Es referenciada por elementos, revisiones, trabajos y cobros.
- **Checks o restricciones importantes:** Tipo, prioridad, estado y fecha de cierre valida.
- **Uso desde React:** `CasosPage`, `CasoDetallePage`, `ElementosCasoPanel`, `RevisionesCasoPanel`, `DetalleRevisionesPanel`, `TrabajosCasoPanel`, `PagosCasoPanel`, `ReportesPage`.

### `elementos_caso`

- **Proposito:** Registrar personas, hogares, objetos, lugares u otros elementos que pertenecen a un caso.
- **Campos criticos:** `id_elemento_caso`, `paciente_id`, `caso_id`, `tipo_elemento`, `nombre_elemento`, `vinculo_con_paciente`, `rol_en_caso`, `prioridad_elemento`, `orden_elemento`, `fecha_nacimiento`, `descripcion_referencia`, `antecedentes_relevantes`, `motivo_inclusion`, `fuente_informacion`, `nivel_confirmacion`, `estado_elemento`, `notas_internas`.
- **Relaciones principales:** FK a `pacientes(id)` y `casos(id_caso)`. Es referenciada por `revision_elementos`, `revision_aspectos`, `revision_hallazgos`, `trabajo_elementos` y `trabajo_acciones`.
- **Checks o restricciones importantes:** Checks para tipo, rol, prioridad, fuente, nivel, estado, orden positivo y fecha de nacimiento no futura.
- **Uso desde React:** `ElementosCasoPanel`, `DetalleRevisionesPanel`, `ReportesPage`.

### `revisiones`

- **Proposito:** Registrar revisiones de un caso con numero correlativo por caso.
- **Campos criticos:** `id_revision`, `paciente_id`, `caso_id`, `consulta_id`, `evaluacion_id`, `fecha_revision`, `hora_inicio`, `hora_termino`, `numero_revision`, `tipo_revision`, `modalidad`, `metodo_revision`, `alcance_revision`, `objetivo_revision`, `resumen_general`, `resultado_general`, `requiere_seguimiento`, `proxima_accion`, `estado_revision`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, consultas y evaluaciones. Es referenciada por detalle de revision, hallazgos, trabajos y cobros.
- **Checks o restricciones importantes:** `numero_revision > 0`, horario valido y `unique(caso_id, numero_revision)`.
- **Uso desde React:** `RevisionesCasoPanel`, `DetalleRevisionesPanel`, `TrabajosCasoPanel`, `PagosCasoPanel`, `ReportesPage`.

### `revision_elementos`

- **Proposito:** Tabla puente entre una revision y un elemento del caso.
- **Campos criticos:** `id_revision_elemento`, `paciente_id`, `caso_id`, `revision_id`, `elemento_caso_id`, `orden_revision`, `prioridad_revision`, `estado_revision_elemento`, `requiere_seguimiento`, `motivo_pendiente`, `resumen_elemento`, `proxima_accion_elemento`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, revisiones y elementos del caso.
- **Checks o restricciones importantes:** Orden positivo y `unique(revision_id, elemento_caso_id)`.
- **Uso desde React:** `DetalleRevisionesPanel` crea automaticamente el vinculo si no existe.

### `revision_aspectos`

- **Proposito:** Registrar el detalle de aspectos revisados para una revision y elemento.
- **Campos criticos:** `id_revision_aspecto`, `paciente_id`, `caso_id`, `revision_id`, `revision_elemento_id`, `elemento_caso_id`, `orden_aspecto`, `area_revision`, `aspecto_revisado`, `metodo_revision`, `tipo_medicion`, `metrica_revision`, `valor_porcentaje`, `presencia_detectada`, `tipo_detectado`, `estado_revision_aspecto`, `resultado_aspecto`, `requiere_seguimiento`, `pendiente_revision`, `motivo_pendiente`, `informacion_canalizada`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, revisiones, `revision_elementos` y `elementos_caso`.
- **Checks o restricciones importantes:** Area, metodo, tipo de medicion, metrica, estado y porcentaje 0-100. La migracion `20260606050000_ampliar_revision_cuerpos_sutiles_y_traumas.sql` amplia `area_revision` y `metrica_revision` para incluir cuerpos sutiles, trauma energetico y metricas asociadas.
- **Uso desde React:** `DetalleRevisionesPanel`.

### `revision_hallazgos`

- **Proposito:** Registrar hallazgos detectados desde un aspecto de revision.
- **Campos criticos:** `id_revision_hallazgo`, `paciente_id`, `caso_id`, `revision_id`, `revision_elemento_id`, `revision_aspecto_id`, `elemento_caso_id`, `categoria_hallazgo`, `tipo_hallazgo`, `subtipo_hallazgo`, `descripcion_hallazgo`, `intensidad_hallazgo_porcentaje`, `nivel_bloqueo_porcentaje`, `origen_sugerido`, `fuente_deteccion`, `nivel_confirmacion`, `requiere_seguimiento`, `prioridad_hallazgo`, `estado_hallazgo`, `informacion_canalizada`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, revisiones, `revision_elementos`, `revision_aspectos` y `elementos_caso`.
- **Checks o restricciones importantes:** Categoria, fuente, confirmacion, prioridad, estado y porcentajes 0-100. La migracion de cuerpos sutiles tambien amplia categorias de hallazgos asociadas a cuerpos sutiles y trauma localizado.
- **Uso desde React:** No se detecto formulario operativo ni panel especifico de gestion.

### `trabajos`

- **Proposito:** Registrar trabajos o intervenciones asociadas a un caso.
- **Campos criticos:** `id_trabajo`, `paciente_id`, `caso_id`, `revision_inicial_id`, `revision_cierre_id`, `revision_hallazgo_origen_id`, `fecha_inicio`, `fecha_estimada_cierre`, `fecha_cierre`, `numero_trabajo`, `nombre_trabajo`, `tipo_trabajo`, `ambito_trabajo`, `modalidad_ejecucion`, `fase_actual`, `alcance_trabajo`, `metodo_principal`, `objetivo_trabajo`, `descripcion_plan`, `frecuencia_planificada`, `dias_planificados`, `duracion_estimada_semanas`, `prioridad_trabajo`, `porcentaje_avance_general`, `requiere_revision_previa`, `requiere_revision_posterior`, `requiere_seguimiento`, `proxima_accion`, `resultado_general`, `estado_trabajo`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, revisiones y hallazgos.
- **Checks o restricciones importantes:** `unique(caso_id, numero_trabajo)`, porcentaje 0-100, fechas validas y duracion positiva.
- **Uso desde React:** `TrabajosCasoPanel` solo lectura.

### `trabajo_elementos`

- **Proposito:** Asociar trabajos con elementos del caso y hallazgos.
- **Campos criticos:** `id_trabajo_elemento`, `paciente_id`, `caso_id`, `trabajo_id`, `elemento_caso_id`, `revision_hallazgo_id`, `orden_trabajo`, `rol_en_trabajo`, `prioridad_elemento_trabajo`, `objetivo_elemento`, `tipo_intervencion_prevista`, `estado_inicial_resumen`, `estado_final_resumen`, `porcentaje_avance_elemento`, `requiere_seguimiento`, `estado_trabajo_elemento`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, trabajos, elementos y hallazgos.
- **Checks o restricciones importantes:** Orden positivo, porcentaje 0-100 y `unique(trabajo_id, elemento_caso_id)`.
- **Uso desde React:** No se detecto UI operativa.

### `trabajo_sesiones`

- **Proposito:** Registrar sesiones asociadas a un trabajo.
- **Campos criticos:** `id_trabajo_sesion`, `paciente_id`, `caso_id`, `trabajo_id`, `revision_previa_id`, `revision_posterior_id`, `fecha_sesion`, `hora_inicio`, `hora_termino`, `numero_semana`, `numero_sesion`, `fase_sesion`, `tipo_sesion`, `objetivo_sesion`, `estado_previo_resumen`, `acciones_realizadas`, `estado_posterior_resumen`, `resultado_sesion`, `porcentaje_avance_sesion`, `requiere_revision_posterior`, `requiere_continuidad`, `proxima_fecha_sugerida`, `estado_sesion`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, trabajos y revisiones.
- **Checks o restricciones importantes:** Numero de sesion positivo, semana positiva, porcentaje 0-100, horario valido y `unique(trabajo_id, numero_sesion)`.
- **Uso desde React:** No se detecto UI operativa.

### `trabajo_acciones`

- **Proposito:** Registrar acciones realizadas dentro de una sesion de trabajo.
- **Campos criticos:** `id_trabajo_accion`, `paciente_id`, `caso_id`, `trabajo_id`, `trabajo_sesion_id`, `trabajo_elemento_id`, `elemento_caso_id`, `revision_hallazgo_id`, `orden_accion`, `accion_realizada`, `tipo_intervencion`, `tipo_sello`, `metodo_accion`, `estado_previo_elemento`, `estado_posterior_elemento`, `porcentaje_avance_accion`, `resultado_accion`, `requiere_seguimiento`, `informacion_canalizada`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, casos, trabajos, sesiones, elementos de trabajo, elementos del caso y hallazgos.
- **Checks o restricciones importantes:** Orden positivo, porcentaje 0-100 y `unique(trabajo_sesion_id, trabajo_elemento_id, orden_accion)`.
- **Uso desde React:** No se detecto UI operativa.

### `cobros`

- **Proposito:** Registrar cobros asociados a paciente, consulta, evaluacion, caso, revision o trabajo.
- **Campos criticos:** `id_cobro`, `paciente_id`, `consulta_id`, `evaluacion_id`, `caso_id`, `revision_id`, `trabajo_id`, `fecha_cobro`, `fecha_vencimiento`, `concepto_cobro`, `tipo_cobro`, `descripcion_cobro`, `monto_cobro`, `monto_descuento`, `monto_total`, `moneda`, `estado_cobro`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a pacientes, consultas, evaluaciones, casos, revisiones y trabajos. Es referenciada por pagos.
- **Checks o restricciones importantes:** Monto positivo, descuento no superior al monto, fecha vencimiento valida y `monto_total` generado. La migracion `20260606053000_ajustar_relaciones_cobros_evaluaciones_revisiones.sql` agrega `evaluacion_id` y `revision_id`, y valida consistencia relacional.
- **Uso desde React:** `FinanzasPage` y `PagosCasoPanel` consumen la vista financiera, no la tabla directa.

### `pagos`

- **Proposito:** Registrar pagos aplicados a cobros.
- **Campos criticos:** `id_pago`, `cobro_id`, `paciente_id`, `fecha_pago`, `hora_pago`, `monto_pago`, `moneda`, `metodo_pago`, `estado_pago`, `referencia_pago`, `comprobante_url`, `recibido_por`, `observaciones`, `notas_internas`.
- **Relaciones principales:** FK a `cobros(id_cobro)` y `pacientes(id)`.
- **Checks o restricciones importantes:** Monto positivo, moneda, metodo y estado controlados; trigger impide pagos que superen el saldo del cobro.
- **Uso desde React:** `FinanzasPage`, `PagosCasoPanel`, `ReportesPage`.

### `usuarios_internos`

- **Proposito:** Autorizar usuarios internos asociados a Supabase Auth.
- **Campos criticos:** `id`, `email`, `nombre_completo`, `rol`, `activo`, `created_at`, `updated_at`.
- **Relaciones principales:** `id` referencia `auth.users(id)`.
- **Checks o restricciones importantes:** Rol limitado a `admin`, `terapeuta`, `finanzas`.
- **Uso desde React:** `App.tsx` valida sesion y perfil interno.

## Vistas detectadas

### `vista_cobros_estado`

- **Proposito:** Calcular estado financiero de cobros usando pagos asociados.
- **Columnas criticas:** `id_cobro`, `paciente_id`, `consulta_id`, `evaluacion_id`, `caso_id`, `revision_id`, `trabajo_id`, `fecha_cobro`, `fecha_vencimiento`, `concepto_cobro`, `tipo_cobro`, `monto_cobro`, `monto_descuento`, `monto_total`, `moneda`, `estado_cobro`, `monto_pagado`, `saldo_pendiente`, `estado_calculado`.
- **Componentes que la consumen:** `FinanzasPage`, `PagosCasoPanel`, `ReportesPage`.
- **Observacion:** La vista fue configurada con `security_invoker = true` y recreada posteriormente para incluir `evaluacion_id`, `revision_id` y `trabajo_id`.

No se detectaron otras vistas operativas durante BE-001.

## Relaciones y foreign keys detectadas

- `pacientes.id` -> `consultas.paciente_id`.
- `pacientes.id` -> `evaluaciones.paciente_id`.
- `consultas.id_consulta` -> `evaluaciones.consulta_id`.
- `pacientes.id` -> `casos.paciente_id`.
- `consultas.id_consulta` -> `casos.consulta_id`.
- `evaluaciones.id_evaluacion` -> `casos.evaluacion_id`.
- `casos.id_caso` -> `elementos_caso.caso_id`.
- `pacientes.id` -> `elementos_caso.paciente_id`.
- `casos.id_caso` -> `revisiones.caso_id`.
- `consultas.id_consulta` -> `revisiones.consulta_id`.
- `evaluaciones.id_evaluacion` -> `revisiones.evaluacion_id`.
- `revisiones.id_revision` -> `revision_elementos.revision_id`.
- `elementos_caso.id_elemento_caso` -> `revision_elementos.elemento_caso_id`.
- `revision_elementos.id_revision_elemento` -> `revision_aspectos.revision_elemento_id`.
- `revision_aspectos.id_revision_aspecto` -> `revision_hallazgos.revision_aspecto_id`.
- `revision_hallazgos.id_revision_hallazgo` -> `trabajos.revision_hallazgo_origen_id`.
- `casos.id_caso` -> `trabajos.caso_id`.
- `trabajos.id_trabajo` -> `trabajo_elementos.trabajo_id`.
- `trabajos.id_trabajo` -> `trabajo_sesiones.trabajo_id`.
- `trabajo_sesiones.id_trabajo_sesion` -> `trabajo_acciones.trabajo_sesion_id`.
- `trabajo_elementos.id_trabajo_elemento` -> `trabajo_acciones.trabajo_elemento_id`.
- `pacientes.id` -> `cobros.paciente_id`.
- `consultas.id_consulta` -> `cobros.consulta_id`.
- `evaluaciones.id_evaluacion` -> `cobros.evaluacion_id`.
- `casos.id_caso` -> `cobros.caso_id`.
- `revisiones.id_revision` -> `cobros.revision_id`.
- `trabajos.id_trabajo` -> `cobros.trabajo_id`.
- `cobros.id_cobro` -> `pagos.cobro_id`.
- `pacientes.id` -> `pagos.paciente_id`.
- `auth.users.id` -> `usuarios_internos.id`.

## Triggers detectados

- `set_*_updated_at`: actualiza `updated_at` antes de updates en tablas principales.
- `validar_elementos_caso_paciente`: valida que el paciente del elemento coincida con el paciente del caso.
- `validar_revision_relaciones`: valida que paciente, caso, consulta y evaluacion de una revision pertenezcan al mismo contexto.
- `validar_revision_elemento_relaciones`: valida consistencia entre revision, elemento, paciente y caso.
- `validar_revision_aspecto_relaciones`: valida consistencia entre aspecto, revision, elemento y caso.
- `validar_revision_hallazgo_relaciones`: valida consistencia del hallazgo contra el aspecto revisado.
- `validar_trabajo_relaciones`: valida trabajo contra caso, revisiones y hallazgo origen.
- `validar_trabajo_elemento_relaciones`: valida elemento de trabajo contra trabajo, elemento del caso y hallazgo.
- `validar_trabajo_sesion_relaciones`: valida sesion contra trabajo y revisiones.
- `validar_trabajo_accion_relaciones`: valida accion contra trabajo, sesion, elemento de trabajo, elemento del caso y hallazgo.
- `validar_cobro_relaciones`: valida cobros contra consulta, evaluacion, caso, revision y trabajo; puede completar relaciones derivadas segun corresponda.
- `validar_pago_relaciones`: valida paciente, moneda y saldo disponible antes de registrar o actualizar pagos.
- `actualizar_cobros_estado_desde_pagos`: actualiza estado de cobro despues de cambios en pagos.

## RLS / Policies detectadas

### Tablas con RLS habilitado

- `pacientes`
- `consultas`
- `evaluaciones`
- `casos`
- `elementos_caso`
- `revisiones`
- `revision_elementos`
- `revision_aspectos`
- `revision_hallazgos`
- `trabajos`
- `trabajo_elementos`
- `trabajo_sesiones`
- `trabajo_acciones`
- `cobros`
- `pagos`
- `usuarios_internos`

### Funciones de rol detectadas

- `rol_usuario_actual()`
- `usuario_interno_activo()`
- `es_admin()`
- `es_terapeuta_o_admin()`
- `es_finanzas_o_admin()`

### Policies detectadas

- `usuarios_internos_select_self`
- `usuarios_internos_select_admin`
- `usuarios_internos_insert_admin`
- `usuarios_internos_update_admin`
- `usuarios_internos_delete_admin`
- `*_select_clinica`, `*_insert_clinica`, `*_update_clinica` para tablas clinicas.
- `cobros_select_finanzas`, `cobros_insert_finanzas`, `cobros_update_finanzas`.
- `pagos_select_finanzas`, `pagos_insert_finanzas`, `pagos_update_finanzas`.

### Riesgos o puntos pendientes de validacion runtime

- Confirmar en entorno local que usuarios `terapeuta`, `finanzas` y `admin` ven exactamente lo esperado.
- Confirmar que `ReportesPage` no genera una mala experiencia por lecturas parciales segun rol.
- Confirmar que `vista_cobros_estado` con `security_invoker` respeta las policies esperadas.
- Confirmar si la falta de delete en tablas clinicas y financieras es decision intencional.
- Confirmar en QA-002 que las migraciones posteriores aplican correctamente en runtime local.

## Componentes React revisados

- `PacientesPage`: consume e inserta en `pacientes`.
- `ConsultasPage`: consume `pacientes`, `consultas`; inserta en `consultas`.
- `EvaluacionesPage`: consume `pacientes`, `consultas`, `evaluaciones`; inserta en `evaluaciones`.
- `CasosPage`: consume `pacientes`, `consultas`, `evaluaciones`, `casos`; inserta en `casos`.
- `CasoDetallePage`: consume `casos`, `pacientes`, `consultas`, `evaluaciones`; monta paneles internos.
- `ElementosCasoPanel`: consume e inserta en `elementos_caso`.
- `RevisionesCasoPanel`: consume e inserta en `revisiones`.
- `DetalleRevisionesPanel`: consume `revisiones`, `elementos_caso`, `revision_elementos`, `revision_aspectos`; inserta en `revision_elementos` y `revision_aspectos`.
- `TrabajosCasoPanel`: consume `trabajos`; solo lectura.
- `PagosCasoPanel`: consume `vista_cobros_estado` y `pagos`; solo lectura.
- `FinanzasPage`: consume `pacientes`, `vista_cobros_estado`, `pagos`; solo lectura.
- `AgendaPage`: placeholder sin backend.
- `ReportesPage`: consume multiples tablas y vista financiera; solo lectura.

## Formularios que insertan datos

### `PacientesPage`

- **Tabla destino:** `pacientes`.
- **Campos enviados:** nombres, apellidos, fecha nacimiento, sexo, telefono, email, comuna, region, estado.
- **Campos obligatorios cubiertos:** nombres, apellidos y estado segun flujo frontend.
- **Riesgos:** Validar que los campos requeridos por UI sigan alineados con migraciones posteriores.

### `ConsultasPage`

- **Tabla destino:** `consultas`.
- **Campos enviados:** paciente, fecha, horas, tipo, modalidad, estado, motivo, resumen, observaciones.
- **Campos obligatorios cubiertos:** paciente, fecha, tipo, modalidad, estado, motivo.
- **Riesgos:** Horario se valida en frontend y en SQL.

### `EvaluacionesPage`

- **Tabla destino:** `evaluaciones`.
- **Campos enviados:** paciente, consulta, fecha, relato, sintomas, hechos, personas, decision, fundamento, notas, estado.
- **Campos obligatorios cubiertos:** consulta/paciente, fecha y relato.
- **Riesgos:** Debe mantenerse la consistencia consulta-paciente.

### `CasosPage`

- **Tabla destino:** `casos`.
- **Campos enviados:** paciente, consulta, evaluacion, fecha, nombre, motivo, descripcion, objetivo, tipo, prioridad, estado, seguimiento.
- **Campos obligatorios cubiertos:** paciente, fecha, nombre y motivo.
- **Riesgos:** El frontend evita duplicados por nombre y paciente en casos activos, pero no se detecto unique SQL equivalente.

### `ElementosCasoPanel`

- **Tabla destino:** `elementos_caso`.
- **Campos enviados:** paciente, caso, tipo, nombre, vinculo, rol, prioridad, orden, fecha nacimiento, descripcion, antecedentes, motivo, fuente, confirmacion, estado, notas.
- **Campos obligatorios cubiertos:** caso, paciente y nombre.
- **Riesgos:** Validar si `foto_url` debe ser usado o eliminado del modelo funcional.

### `RevisionesCasoPanel`

- **Tabla destino:** `revisiones`.
- **Campos enviados:** paciente, caso, consulta, evaluacion, fecha, horas, numero, tipo, modalidad, metodo, alcance, objetivo, resumen, resultado, seguimiento, proxima accion, estado, notas.
- **Campos obligatorios cubiertos:** paciente, caso, numero, fecha, objetivo y campos de clasificacion.
- **Riesgos:** `unique(caso_id, numero_revision)` protege duplicados.

### `DetalleRevisionesPanel`

- **Tabla destino:** `revision_elementos` y `revision_aspectos`.
- **Campos enviados a `revision_elementos`:** paciente, caso, revision, elemento, prioridad, estado.
- **Campos enviados a `revision_aspectos`:** paciente, caso, revision, revision_elemento, elemento, orden, area, aspecto, metodo, tipo medicion, metrica, porcentaje, presencia, tipo detectado, estado, resultado, seguimiento, pendiente, motivo, informacion, observaciones, notas.
- **Campos obligatorios cubiertos:** revision, elemento y aspecto revisado.
- **Riesgos:** Riesgo historico de opciones no cubiertas por checks aparece resuelto por migracion posterior; validar runtime local en QA-002.

## Selects y vistas usadas por paneles

| Componente | Tabla/vista consultada | Filtros usados | Relaciones usadas |
| --- | --- | --- | --- |
| `PacientesPage` | `pacientes` | Orden por `created_at` | No aplica |
| `ConsultasPage` | `pacientes`, `consultas` | Orden por fecha y creacion | `consultas.paciente_id` |
| `EvaluacionesPage` | `pacientes`, `consultas`, `evaluaciones` | Filtro local por paciente | `evaluaciones.consulta_id`, `evaluaciones.paciente_id` |
| `CasosPage` | `pacientes`, `consultas`, `evaluaciones`, `casos` | Filtro local y orden por creacion | Caso conectado a paciente, consulta y evaluacion |
| `CasoDetallePage` | `casos`, `pacientes`, `consultas`, `evaluaciones` | `.eq()` por id de caso y origenes | Ficha de caso |
| `ElementosCasoPanel` | `elementos_caso` | `.eq(caso_id)`, `.eq(paciente_id)` | Caso y paciente |
| `RevisionesCasoPanel` | `revisiones` | `.eq(caso_id)`, `.eq(paciente_id)` | Caso y paciente |
| `DetalleRevisionesPanel` | `revisiones`, `elementos_caso`, `revision_elementos`, `revision_aspectos` | `.eq(caso_id)`, `.eq(paciente_id)` | Revision-elemento-aspecto |
| `TrabajosCasoPanel` | `trabajos` | `.eq(caso_id)`, `.eq(paciente_id)` | Caso y paciente |
| `PagosCasoPanel` | `vista_cobros_estado`, `pagos` | `.eq(caso_id)`, `.eq(paciente_id)`, `.in(cobro_id)` | Cobro -> pago; vista incluye revision/evaluacion/trabajo |
| `FinanzasPage` | `pacientes`, `vista_cobros_estado`, `pagos` | Orden por fechas | Paciente, cobro y pago |
| `ReportesPage` | multiples tablas + `vista_cobros_estado` | Sin filtros especificos | Agregados generales |

## Coincidencias React / Supabase

- `PacientesPage` coincide con la version limpia de `pacientes`.
- `ConsultasPage` coincide con checks principales de tipo, modalidad y estado.
- `EvaluacionesPage` respeta la asociacion consulta-paciente.
- `CasosPage` respeta paciente, consulta y evaluacion opcional.
- `ElementosCasoPanel` respeta los valores de tipo, rol, prioridad, fuente, confirmacion y estado detectados.
- `RevisionesCasoPanel` respeta tipo, modalidad, metodo, alcance y estado.
- `DetalleRevisionesPanel` respeta la necesidad de crear `revision_elementos` antes de `revision_aspectos`.
- La migracion `20260606050000_ampliar_revision_cuerpos_sutiles_y_traumas.sql` cubre valores ampliados usados en detalle de revisiones.
- `PagosCasoPanel` usa una vista que, tras migracion posterior, expone `evaluacion_id`, `revision_id` y `trabajo_id`.
- `TrabajosCasoPanel` usa `trabajos` en modo lectura compatible con la tabla.
- `FinanzasPage` usa `vista_cobros_estado` y `pagos` en modo lectura.
- `AgendaPage` evita inventar inserciones sin tabla backend.

## Posibles desalineaciones React / Supabase

1. `revision_hallazgos` existe, pero no tiene pantalla operativa detectada.
2. `trabajos` y subtablas existen, pero no tienen flujo de creacion/edicion completo detectado.
3. `FinanzasPage` y `PagosCasoPanel` son principalmente de lectura, aunque el backend ya permite insertar y actualizar cobros/pagos bajo RLS.
4. `ReportesPage` consulta tablas clinicas y financieras, lo que puede producir reportes parciales segun rol.
5. `AgendaPage` no tiene tabla real de agenda.
6. Riesgo historico ya cubierto: los valores ampliados de `revision_aspectos` aparecen incorporados por migracion posterior; validar runtime local en QA-002.
7. Riesgo historico ya cubierto: `vista_cobros_estado` aparece recreada con `evaluacion_id`, `revision_id` y `trabajo_id`; validar runtime local en QA-002.

## Hallazgos criticos

Sin hallazgos criticos confirmados en esta auditoria documental.

## Hallazgos medios

1. `revision_hallazgos` esta modelado, pero sin UI operativa.
2. `trabajos`, `trabajo_elementos`, `trabajo_sesiones` y `trabajo_acciones` existen, pero solo se detecto panel de lectura para trabajos.
3. `cobros` y `pagos` existen con triggers financieros, pero el frontend detectado opera principalmente en lectura.
4. `ReportesPage` puede mostrar informacion parcial o errores por RLS segun rol.
5. Agenda no tiene backend.
6. Falta validar runtime de RLS por perfiles `admin`, `terapeuta` y `finanzas`.
7. Falta decidir si las tablas clinicas y financieras deben permitir delete o mantener solo select/insert/update.

## Hallazgos menores

1. Riesgo historico ya cubierto por migracion posterior: `revision_aspectos` fue ampliada para valores de cuerpos sutiles, trauma energetico y metricas asociadas; validar runtime local en QA-002.
2. Riesgo historico ya cubierto por migracion posterior: `vista_cobros_estado` fue recreada con `evaluacion_id`, `revision_id` y `trabajo_id`; validar runtime local en QA-002.
3. El nombre de algunos valores clinicos usa acentos y variantes; esto exige cuidado para no romper checks.
4. Algunas validaciones existen en frontend y SQL; conviene documentar cual es fuente de verdad.
5. Algunos campos existen en backend pero no se usan aun en UI, por ejemplo `foto_url` en elementos o campos extendidos de trabajos.
6. Algunos paneles hacen agregados en frontend en vez de vistas SQL dedicadas.

## Riesgos tecnicos

- Riesgo de experiencia parcial por RLS en reportes.
- Riesgo de desalineacion futura si se agregan opciones en React sin migracion correspondiente.
- Riesgo de backend sobredimensionado si trabajos/hallazgos no reciben flujo funcional claro.
- Riesgo de datos financieros incompletos si no existe formulario operativo para cobros/pagos.
- Riesgo de validacion no confirmada en runtime local para migraciones posteriores ya detectadas.
- Riesgo de falta de politica formal para delete/anulacion de registros clinicos y financieros.

## Riesgos que deben pasar a Revision de flujo clinico

- Responsabilidad exacta de `revision_hallazgos`: si nace desde aspecto, desde revision completa o desde trabajo.
- Separacion conceptual entre detalle, aspecto, elemento y hallazgo.
- Ubicacion funcional de trabajos/intervenciones dentro del flujo clinico.
- Rol de agenda dentro del flujo clinico: cita, consulta programada, sesion de trabajo, seguimiento o recordatorio.
- Definir si `Cuerpos sutiles`, `Trauma energetico`, `Secuestro`, `Integracion` y conceptos similares son areas, metricas, hallazgos o acciones de trabajo.
- Definir si cobros pueden asociarse directamente a revisiones, evaluaciones, consultas, casos y trabajos segun flujo real.

## Riesgos que deben pasar a UI / UX

- Experiencia de usuario cuando una opcion visible en formulario falla por validacion backend futura.
- Visualizacion de reportes parciales segun rol.
- Diseño de pantalla para crear hallazgos sin sobrecargar detalle de revisiones.
- Diseño de flujo para crear trabajos, sesiones y acciones.
- Diseño de modulo Agenda cuando exista tabla real.
- Diferenciar visualmente lectura, creacion y gestion en Finanzas.

## Tareas backend sugeridas

### BE-004 — Crear flujo backend/frontend para `revision_hallazgos`

- **Prioridad:** Media-alta.
- **Motivo:** La tabla existe, pero no hay UI operativa detectada.
- **Dependencias:** RFC sobre responsabilidad clinica del hallazgo.
- **Resultado esperado:** Hallazgos pueden crearse, listarse y relacionarse sin duplicar aspectos.

### BE-005 — Crear modulo operativo de trabajos

- **Prioridad:** Media-alta.
- **Motivo:** Backend de trabajos existe, pero falta creacion/edicion de trabajos, elementos, sesiones y acciones.
- **Dependencias:** RFC sobre flujo de intervenciones.
- **Resultado esperado:** Flujo funcional completo para trabajos/intervenciones.

### BE-006 — Crear gestion de cobros y pagos

- **Prioridad:** Media-alta.
- **Motivo:** Backend financiero existe, pero frontend detectado es principalmente lectura.
- **Dependencias:** Decision funcional sobre gestion financiera operativa.
- **Resultado esperado:** Formularios de cobros/pagos alineados con triggers, RLS y vista.

### BE-007 — Diseñar backend de agenda

- **Prioridad:** Media.
- **Motivo:** `AgendaPage` no tiene tabla real.
- **Dependencias:** RFC sobre rol clinico de agenda.
- **Resultado esperado:** Tabla o modulo de agenda definido antes de implementar UI operativa.

### BE-008 — Validar RLS por roles en runtime local

- **Prioridad:** Alta.
- **Motivo:** La auditoria fue estatica; falta confirmar comportamiento real.
- **Dependencias:** Usuarios locales de prueba.
- **Resultado esperado:** Matriz de permisos validada para `admin`, `terapeuta` y `finanzas`.

### BE-009 — Documentar politica de borrado/anulacion

- **Prioridad:** Media.
- **Motivo:** Las tablas clinicas y financieras no tienen delete policies detectadas, y el flujo podria requerir anulacion logica.
- **Dependencias:** Decision de Control de Desarrollo.
- **Resultado esperado:** Politica clara sobre eliminacion, anulacion y auditoria de registros.

## Tareas sugeridas para Revision de flujo clinico

### RFC-004 — Definir responsabilidad de hallazgos

- **Prioridad:** Alta.
- **Motivo:** Evitar duplicidad entre aspecto revisado y hallazgo.
- **Dependencias:** BE-001.
- **Resultado esperado:** Criterio claro para crear `revision_hallazgos`.

### RFC-005 — Validar taxonomia de areas, metricas y hallazgos de revision

- **Prioridad:** Alta.
- **Motivo:** Aunque las migraciones posteriores cubren valores ampliados, se requiere criterio clinico para confirmar ubicacion conceptual.
- **Dependencias:** BE-001.
- **Resultado esperado:** Lista clinicamente validada para `area_revision`, `aspecto_revisado`, `metrica_revision` y categorias de hallazgo.

### RFC-006 — Definir flujo clinico de trabajos/intervenciones

- **Prioridad:** Media-alta.
- **Motivo:** El backend de trabajos es amplio y necesita criterio funcional.
- **Dependencias:** BE-001.
- **Resultado esperado:** Ubicacion de trabajos, sesiones y acciones dentro del caso.

### RFC-007 — Definir rol clinico de agenda

- **Prioridad:** Media.
- **Motivo:** Agenda no tiene backend y debe responder al flujo real.
- **Dependencias:** BE-001.
- **Resultado esperado:** Decidir si agenda representa citas, sesiones, seguimientos o eventos mixtos.

## Tareas sugeridas para UI / UX

### UI-002 — Diseñar pantalla de hallazgos

- **Prioridad:** Media-alta.
- **Motivo:** Existe backend, pero falta flujo visual.
- **Dependencias:** RFC-004, BE-004.
- **Resultado esperado:** Panel claro para crear, listar y priorizar hallazgos.

### UI-003 — Diseñar flujo operativo de trabajos

- **Prioridad:** Media-alta.
- **Motivo:** Trabajos tiene estructura compleja y necesita UI guiada.
- **Dependencias:** RFC-006, BE-005.
- **Resultado esperado:** Pantallas o wizard para trabajos, elementos, sesiones y acciones.

### UI-004 — Diseñar reportes por rol

- **Prioridad:** Media.
- **Motivo:** RLS puede producir reportes parciales.
- **Dependencias:** BE-008.
- **Resultado esperado:** Reportes clinicos, financieros y admin diferenciados.

### UI-005 — Diseñar modulo Agenda

- **Prioridad:** Media.
- **Motivo:** Agenda es placeholder.
- **Dependencias:** RFC-007, BE-007.
- **Resultado esperado:** Prototipo UI alineado a tabla real.

### UI-006 — Diseñar gestion visual de Finanzas

- **Prioridad:** Media.
- **Motivo:** El frontend financiero detectado es principalmente lectura.
- **Dependencias:** BE-006.
- **Resultado esperado:** Flujo claro para registrar cobros, registrar pagos, ver saldos y estados.

## Conclusion

BE-001 queda **integrada y aprobada con observaciones** en la documentacion oficial del proyecto.  
No queda bloqueada y no mantiene hallazgos criticos confirmados tras la revision documental puntual.  
Las observaciones vigentes se concentran en modulos incompletos, validacion runtime, RLS, agenda y definiciones clinicas/operativas pendientes.  
Queda pendiente de revision por Control de Desarrollo para priorizar BE-004 en adelante.

## Anexo — Hallazgos completos

- Tablas detectadas: `pacientes`, `consultas`, `evaluaciones`, `casos`, `elementos_caso`, `revisiones`, `revision_elementos`, `revision_aspectos`, `revision_hallazgos`, `trabajos`, `trabajo_elementos`, `trabajo_sesiones`, `trabajo_acciones`, `cobros`, `pagos`, `usuarios_internos`.
- Vista detectada: `vista_cobros_estado`.
- RLS detectado en tablas clinicas, trabajos, finanzas y usuarios internos.
- Policies detectadas por rol interno: clinica para `admin/terapeuta`, finanzas para `admin/finanzas`, usuarios internos con self/admin.
- Triggers detectados: `updated_at`, validadores de relacion, validadores financieros y actualizador de estado de cobro.
- Formularios operativos detectados: pacientes, consultas, evaluaciones, casos, elementos del caso, revisiones y aspectos de revision.
- Formularios no detectados: hallazgos, trabajos completos, cobros, pagos y agenda.
- `AgendaPage` declara explicitamente ausencia de tabla publica dedicada.
- `TrabajosCasoPanel` declara que la creacion de trabajos queda pendiente para una pantalla operativa especifica.
- `FinanzasPage` y `PagosCasoPanel` usan `vista_cobros_estado`.
- `ReportesPage` hace agregados desde multiples tablas y puede sufrir diferencias por RLS.
- BE-001 no ejecuto build ni validacion runtime.
- No se modificaron archivos durante la auditoria fuente.
- Revision posterior de Control de Desarrollo confirmo que `revision_aspectos` fue ampliada por migracion posterior.
- Revision posterior de Control de Desarrollo confirmo que `vista_cobros_estado` fue recreada con `evaluacion_id`, `revision_id` y `trabajo_id`.
