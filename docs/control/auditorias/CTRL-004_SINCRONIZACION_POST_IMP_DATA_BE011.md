# CTRL-004 - Sincronizacion documental post IMP-001 / DATA-001 / BE-011

## Estado

Aprobado con observaciones.

## Fecha

2026-06-17.

## Rama de trabajo

`docs/ctrl-004-sync-post-imp-data-be011`.

## Resumen ejecutivo

CTRL-004 sincroniza la documentacion de control despues de integrar tres bloques relevantes:

- IMP-001: hallazgos operativos en `DetalleRevisionesPanel`.
- DATA-001: seed local de caso demo integral.
- BE-011: trazabilidad documental hallazgo a trabajo.

El proyecto queda con hallazgos operativos visibles y parcialmente validados con el caso demo. La estructura de trabajo futuro queda definida: primero cerrar QA-002, luego disenar UI-012 y despues implementar funcionalmente hallazgo a trabajo sin automatismos.

## Documentos actualizados

- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

## Estado registrado

- PR #16 integrado: IMP-001.
- PR #17 integrado: DATA-001.
- PR #18 integrado: BE-011.
- Seed local DATA-001 ejecutado correctamente en Supabase local por el usuario.
- Caso demo `DATA-001 - Caso Demo Integral` visible en la app.
- Hallazgo precargado visible correctamente.
- Modal `Ver hallazgo` funcional.
- Modal `Crear hallazgo desde aspecto revisado` abre correctamente.
- El modal de creacion hereda revision, elemento, area y aspecto.

## Cambios integrados registrados

### IMP-001

Implementacion funcional minima de hallazgos operativos dentro de `DetalleRevisionesPanel`.

Incluye:

- lectura de hallazgos;
- indicador `Hallazgo registrado`;
- modal `Ver hallazgo`;
- accion `Crear hallazgo` desde aspecto revisado;
- prevencion visual de duplicados.

### DATA-001

Seed local demo integral para probar el flujo principal de Casos.

Incluye:

- paciente demo;
- consulta;
- evaluacion;
- caso;
- elementos del caso;
- revisiones;
- aspectos;
- hallazgo precargado;
- trabajo base;
- cobro y pago parcial.

### BE-011

Informe tecnico de trazabilidad hallazgo a trabajo.

Conclusiones registradas:

- no se requiere migracion inicial;
- la primera version usara `trabajos.revision_hallazgo_origen_id`;
- `trabajo_hallazgos` queda como alternativa futura;
- crear trabajo no crea cobro, sesiones ni acciones automaticamente.

## Pendientes inmediatos

- QA-002 - Validacion funcional de hallazgos operativos con caso demo.

QA-002 debe validar guardado real de un hallazgo nuevo desde la UI, persistencia, recarga visible y ausencia de duplicidad no deseada.

## Pendientes posteriores

- UI-012 - Diseno visual del flujo `Evaluar trabajo`.

UI-012 debe definir la experiencia antes de implementar hallazgo a trabajo.

## Decisiones confirmadas

- La primera version hallazgo a trabajo usara `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal.
- No se crea tabla puente `trabajo_hallazgos` en esta etapa.
- Crear trabajo no crea cobro, sesiones ni acciones automaticamente.
- No se debe crear trabajo automaticamente desde un hallazgo.

## Riesgos abiertos

- Falta validar guardado real de un hallazgo nuevo desde la UI.
- Puede existir riesgo de duplicidad si la futura implementacion hallazgo a trabajo no advierte trabajos ya asociados al mismo hallazgo.
- La decision financiera de cobrar un trabajo derivado de hallazgo sigue pendiente de BE-013/BE-016.
- UI-012 debe evitar que el texto o flujo sugiera automatismo clinico.

## Recomendacion final

Cerrar CTRL-004 como sincronizacion documental aprobada con observaciones y ejecutar QA-002 como siguiente tarea inmediata.

No iniciar implementacion funcional hallazgo a trabajo antes de cerrar QA-002 y UI-012.

## Checklist

- [x] Registrar IMP-001 como integrado.
- [x] Registrar DATA-001 como integrado.
- [x] Registrar BE-011 como integrado documentalmente.
- [x] Registrar seed local ejecutado correctamente.
- [x] Registrar validacion visual parcial de hallazgos.
- [x] Registrar QA-002 como pendiente inmediato.
- [x] Registrar UI-012 como pendiente posterior.
- [x] Registrar implementacion funcional hallazgo a trabajo como pendiente futuro.
- [x] Confirmar decision `trabajos.revision_hallazgo_origen_id`.
- [x] Confirmar que no se crea `trabajo_hallazgos` ahora.
- [x] Confirmar que crear trabajo no crea cobro, sesiones ni acciones automaticamente.
- [x] No modificar codigo fuente.
- [x] No modificar migraciones.
- [x] No crear migraciones.
- [x] No tocar `.env`.
- [x] No ejecutar `supabase db push`.
- [x] No tocar Supabase remoto.
- [x] No modificar datos reales.
- [x] No hacer merge a `main`.

## Conclusion

La documentacion de control queda sincronizada con el estado real post IMP-001, DATA-001 y BE-011.

El proyecto queda listo para ejecutar QA-002 como cierre funcional del flujo actual de hallazgos operativos con caso demo.

La evolucion hallazgo a trabajo queda ordenada para una etapa posterior: UI-012 primero, implementacion funcional despues, usando `trabajos.revision_hallazgo_origen_id` y sin crear derivados automaticos.
