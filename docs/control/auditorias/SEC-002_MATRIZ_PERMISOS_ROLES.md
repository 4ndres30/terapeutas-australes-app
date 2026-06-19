# SEC-002 — Matriz de permisos por tabla y rol

## Estado

Aprobado con observaciones como diseño documental.

## Objetivo

Definir permisos esperados por rol interno antes de ejecutar pruebas runtime de RLS en SEC-001.

## Contexto

La base ya cuenta con Supabase Auth, tabla `usuarios_internos`, roles internos, RLS y policies por rol. Sin embargo, antes de usar datos reales o probar runtime, debe existir una matriz explícita de permisos esperados por tabla, rol y operación.

## Roles considerados

- `admin`
- `terapeuta`
- `finanzas`

## Operaciones consideradas

- `select`: lectura.
- `insert`: creación.
- `update`: edición.
- `anular`: cierre, desactivación o cambio de estado; no borrado físico.
- `delete`: eliminación física.
- `—`: prohibido.
- `limitado`: permitido solo con campos mínimos o bajo vista filtrada.
- `pendiente`: requiere decisión de Control de Desarrollo, SEC-001 o SEC-004.

## Principios de control

- `admin` tiene acceso transversal, pero en producción debe preferirse anulación lógica antes que delete físico.
- `terapeuta` opera datos clínicos y trabajos, pero no debe administrar cobros ni pagos.
- `finanzas` opera cobros y pagos, pero solo debe ver datos mínimos administrativos del paciente o unidad cobrable.
- `finanzas` no debe acceder a evaluaciones, aspectos revisados, hallazgos, información canalizada, notas internas ni acciones clínicas.
- El delete físico debe quedar prohibido en producción para datos clínicos y financieros, salvo decisión técnica excepcional.
- La anulación lógica debe definirse por tabla.
- Reportes debe separarse por rol.
- Ninguna policy debe implementarse todavía en esta tarea; esta tarea es solo documental.

## Matriz propuesta de permisos

| Tabla / Vista | Admin | Terapeuta | Finanzas | Observaciones |
|---|---|---|---|---|
| `usuarios_internos` | select / insert / update / anular; delete físico solo si Control lo aprueba | select propio | select propio | Aunque la policy actual permite delete admin, para producción se recomienda desactivar con `activo=false`, no borrar. |
| `pacientes` | select / insert / update / anular | select / insert / update / anular limitada | select limitado o vista mínima | Finanzas no debería ver ficha clínica completa; necesita identificador, nombre visible para cobro o alias administrativo, sujeto a SEC-004. |
| `consultas` | select / insert / update / anular | select / insert / update / anular | — o select administrativo mínimo | Finanzas no debería leer motivo, resumen ni observaciones clínicas. |
| `evaluaciones` | select / insert / update / anular | select / insert / update / anular | — | Datos clínicos sensibles. Prohibido para finanzas salvo eventual indicador no clínico. |
| `casos` | select / insert / update / anular | select / insert / update / anular | select mínimo si está vinculado a cobro | Finanzas puede necesitar ID/nombre de caso o concepto cobrable, no motivo, descripción ni notas internas. |
| `elementos_caso` | select / insert / update / anular | select / insert / update / anular | — | Contiene vínculos, personas, lugares y antecedentes. Prohibido para finanzas. |
| `revisiones` | select / insert / update / anular | select / insert / update / anular | select mínimo solo si se cobra una revisión | Finanzas no debe leer resultado, resumen, método ni notas clínicas. |
| `revision_elementos` | select / insert / update / anular | select / insert / update / anular | — | Detalle clínico sensible. |
| `revision_aspectos` | select / insert / update / anular | select / insert / update / anular | — | Alta sensibilidad clínica/terapéutica. |
| `revision_hallazgos` | select / insert / update / anular | select / insert / update / anular | — | Hallazgos no deben exponerse a finanzas. |
| `trabajos` | select / insert / update / anular | select / insert / update / anular | select mínimo si es unidad cobrable | Finanzas puede ver trabajo como concepto cobrable, no plan terapéutico ni notas internas. |
| `trabajo_elementos` | select / insert / update / anular | select / insert / update / anular | — | Sensible; vincula intervención con elementos/hallazgos. |
| `trabajo_sesiones` | select / insert / update / anular | select / insert / update / anular | — | Sensible; contiene acciones/resultados de sesiones. |
| `trabajo_acciones` | select / insert / update / anular | select / insert / update / anular | — | Muy sensible; debe quedar fuera de finanzas. |
| `cobros` | select / insert / update / anular | select limitado solo dentro del caso, sin gestión financiera | select / insert / update / anular | Finanzas administra; terapeuta solo debería ver estado básico si Control lo aprueba. |
| `pagos` | select / insert / update / anular | select limitado solo estado de pago | select / insert / update / anular | Finanzas administra pagos. Terapeuta no debe editar pagos. |
| `vista_cobros_estado` | select | select limitado por caso/paciente si Control lo aprueba | select | Vista financiera principal. Debe validarse runtime con RLS. |
| Reportes agregados | select según rol | select clínico sin finanzas detalladas | select financiero sin clínica | Debe apoyarse en UI-016 o tarea equivalente de reportes por rol. |

## Acciones solo admin

- Alta, baja o anulación de usuarios internos.
- Cambio de roles.
- Reactivar usuarios.
- Eventual eliminación física excepcional.
- Configuración de permisos.
- Acceso transversal completo.
- Validación o cierre de auditorías.
- Aprobación de carga real.
- Gestión de ambientes productivos.

## Acciones terapeuta

- Crear y editar pacientes.
- Registrar consultas.
- Registrar evaluaciones.
- Abrir y actualizar casos.
- Gestionar elementos del caso.
- Crear revisiones.
- Crear aspectos revisados.
- Crear hallazgos.
- Crear o actualizar trabajos clínicos cuando se implemente.
- Consultar estado financiero básico solo si Control de Desarrollo lo aprueba, sin editar cobros ni pagos.

## Acciones finanzas

- Leer cobros.
- Crear cobros si corresponde.
- Editar o anular cobros según política.
- Leer pagos.
- Crear pagos.
- Editar o anular pagos según política.
- Ver datos mínimos administrativos del paciente o unidad cobrable.
- No acceder a datos clínicos sensibles.

## Datos prohibidos para Finanzas

Finanzas no debe leer:

- Evaluaciones.
- Síntomas.
- Relato de antecedentes.
- Hechos clave.
- Personas mencionadas.
- Motivo clínico del caso.
- Descripción clínica del caso.
- Elementos del caso.
- Aspectos revisados.
- Hallazgos.
- Información canalizada.
- Notas internas.
- Acciones terapéuticas.
- Resultados de sesiones.

## Datos mínimos para Finanzas

Finanzas puede requerir:

- Identificador del paciente.
- Nombre administrativo del paciente o alias.
- Cobros.
- Pagos.
- Estado de cobro.
- Saldo.
- Fechas.
- Concepto cobrable.
- Tipo de unidad cobrable: consulta, evaluación, caso, revisión o trabajo.
- Referencia mínima a unidad cobrable.
- Método de pago.
- Comprobante o referencia si existe.

## Operaciones prohibidas en producción

- Delete físico de datos clínicos.
- Delete físico de cobros/pagos.
- Ejecución de seeds demo.
- Uso de `service_role` desde frontend.
- Uso de datos reales en ambiente demo/local.
- Mezcla de demo y producción.
- Cobros automáticos desde hallazgos/trabajos.
- Crear usuarios internos sin admin.
- Acceso financiero a notas clínicas.
- Acceso clínico a edición de pagos, salvo admin.

## Riesgos detectados

- Finanzas tiene ruta a reportes, pero reportes pueden intentar leer tablas clínicas.
- La base concede permisos SQL generales a `authenticated`, aunque RLS filtra; SEC-001 debe probar que las policies bloquean lo esperado.
- No hay anulación lógica transversal definida.
- No hay bitácora de auditoría de cambios sensibles.
- Finanzas necesita datos mínimos del paciente, pero no debe ver datos clínicos.
- Admin tiene amplitud funcional alta; se debe decidir si en producción se separa admin técnico, admin clínico y superadmin.
- Existe `usuarios_internos_delete_admin`; para producción conviene preferir desactivación.

## Recomendaciones para SEC-001

SEC-001 debe probar runtime con usuarios de prueba:

| Prueba | Admin | Terapeuta | Finanzas |
|---|---|---|---|
| Login y perfil interno | Sí | Sí | Sí |
| Leer pacientes | Sí | Sí | Limitado / verificar bloqueo actual |
| Crear paciente | Sí | Sí | No |
| Leer consultas/evaluaciones/casos | Sí | Sí | No o limitado |
| Leer hallazgos/aspectos | Sí | Sí | No |
| Leer trabajos | Sí | Sí | Solo referencia cobrable si existe vista |
| Leer cobros/pagos | Sí | No o limitado | Sí |
| Crear cobro/pago | Sí | No | Sí |
| Editar cobro/pago | Sí | No | Sí |
| Delete físico clínico/financiero | No | No | No |
| Reportes | Completo | Clínico | Financiero |

SEC-001 debe documentar si el backend bloquea y si la UI muestra mensajes claros cuando RLS impide leer.

## Recomendaciones para SEC-004

Finanzas debería tener una vista dedicada, no acceso amplio a tablas clínicas.

Vista futura sugerida:

`vista_finanzas_unidades_cobrables`

La vista debe exponer campos mínimos y validarse con `security_invoker` y RLS.

## Dependencias y tareas relacionadas

- SEC-001 debe usar esta matriz para pruebas runtime.
- SEC-004 debe definir alcance exacto del rol Finanzas.
- SEC-005 debe diseñar bitácora/auditoría de cambios sensibles.
- BE-021 debe definir política de anulación vs eliminación.
- UI-016 debe considerar reportes por rol.
- BE-016 debe considerar vista financiera mínima por unidad cobrable.
- PROD-001 se mantiene como bloqueo operativo antes de usar datos reales.

## Resultado

SEC-002 queda aprobada con observaciones como diseño documental. No se implementan policies ni migraciones en esta tarea.
