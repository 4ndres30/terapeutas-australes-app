# BE-021 - Politica de anulacion vs eliminacion

Estado: Diseno documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Control de desarrollo / Backend
Rama usada: `be-021-politica-anulacion-eliminacion`

## Objetivo

Definir la politica transversal para corregir, anular o eliminar informacion clinica, financiera, administrativa, de agenda, consentimiento, fotos y usuarios internos.

BE-021 no implementa columnas, triggers, policies, migraciones ni cambios de codigo. Define criterios antes de una implementacion futura.

## Fuera de alcance

- Migraciones.
- SQL.
- Triggers.
- Policies RLS.
- Codigo fuente.
- Endpoints.
- Cambios en datos existentes.
- `.env`.
- Supabase remoto.
- `supabase db push`.
- Google Calendar/Gmail funcional.
- Produccion.
- Datos reales, fotos reales o pagos reales.

## Principios

- En produccion no debe existir delete fisico operativo para datos clinicos, financieros, fotos, consentimientos ni usuarios internos.
- La anulacion logica debe ser la via normal para invalidar registros.
- La correccion debe conservar trazabilidad cuando afecta datos sensibles.
- La eliminacion fisica debe quedar limitada a casos excepcionales, autorizados y auditados.
- Finanzas no debe poder eliminar datos financieros sensibles ni acceder a datos clinicos para justificar anulaciones.
- Fotos y archivos reales siguen bloqueados mientras PROD-001 este abierto.
- Toda anulacion relevante debe integrarse con SEC-005.

## Definiciones

| Concepto | Definicion |
| --- | --- |
| Correccion | Ajuste de un error manteniendo el registro activo y trazable. |
| Anulacion logica | Marcado del registro como no vigente, cancelado, anulado o descartado sin borrarlo fisicamente. |
| Eliminacion fisica | Borrado real del registro u objeto. Debe ser excepcional y no operativo. |
| Archivo/retencion | Conservacion controlada por obligacion operativa, clinica, legal o de auditoria. |
| Revocacion | Retiro de consentimiento o autorizacion para usos futuros, sin borrar automaticamente el historial. |

## Regla general por area

| Area | Regla |
| --- | --- |
| Pacientes | No delete fisico operativo. Correccion trazable o anulacion logica segun caso. |
| Consultas | No delete fisico operativo. Anular o corregir con motivo. |
| Evaluaciones/casos | No delete fisico operativo. Cierre, reapertura o anulacion con trazabilidad. |
| Elementos/revisiones/hallazgos | No delete fisico operativo. Anulacion o cambio de estado auditado. |
| Trabajos | No delete fisico operativo. Cierre, anulacion o cambio de estado. |
| Cobros/pagos | No delete fisico operativo. Anulacion financiera con motivo y auditoria. |
| Agenda | Cancelacion/anulacion logica; no borrar historico operativo. |
| Solicitudes publicas | Marcar duplicada, rechazada, cancelada o anulada; no borrar por flujo normal. |
| Consentimientos | Revocar o reemplazar; no borrar evidencia normal. |
| Usuarios internos | Desactivar; no borrar fisicamente por operacion normal. |
| Fotos/archivos | No delete operativo normal; anulacion/desvinculacion y manejo de retencion por politica futura. |
| Auditoria | No delete fisico normal. |

## Correccion permitida

Puede corresponder cuando:

- existe error de tipeo;
- existe dato administrativo incompleto;
- se corrige clasificacion o estado;
- no cambia el sentido clinico/financiero principal;
- queda trazabilidad suficiente segun SEC-005.

No debe usarse correccion silenciosa para ocultar cambios sensibles.

## Anulacion logica obligatoria

Debe usarse cuando:

- una consulta, pago, cobro, solicitud, evento o registro queda sin efecto;
- se detecta duplicado;
- se cancela una accion operativa;
- se revoca consentimiento;
- se descarta una foto o archivo;
- se desactiva un usuario interno;
- se requiere conservar historial por trazabilidad.

La anulacion debe registrar, como minimo:

- actor;
- fecha/hora;
- entidad;
- motivo;
- estado anterior y nuevo estado minimizado;
- relacion con auditoria SEC-005.

## Eliminacion fisica excepcional

Solo debe evaluarse cuando:

- existe obligacion legal o contractual especifica;
- se trata de dato cargado por error en ambiente incorrecto;
- se trata de objeto huerfano sin valor clinico ni financiero;
- existe autorizacion expresa de Control;
- existe respaldo, evidencia y auditoria del procedimiento.

La eliminacion fisica excepcional debe quedar fuera del flujo normal de UI y requiere tarea tecnica aprobada.

## Datos reales y produccion

Mientras PROD-001 siga abierto:

- no usar datos reales;
- no cargar fotos reales;
- no procesar pagos reales;
- no habilitar produccion;
- no probar eliminaciones sobre datos reales;
- no cambiar policies ni grants en Supabase remoto.

## Relacion con Finanzas

Cobros y pagos deben operar con anulacion logica.

Finanzas puede requerir motivos administrativos, pero no debe acceder a ficha clinica, fotos, hallazgos, revisiones ni antecedentes sensibles para justificar anulaciones.

## Relacion con fotos y Storage

Fotos reales siguen bloqueadas.

Para una implementacion futura:

- desvincular o anular metadatos antes que borrar objetos;
- definir retencion;
- detectar objetos huerfanos;
- auditar visualizacion, anulacion y eliminacion excepcional;
- no permitir delete fisico operativo desde UI normal.

## Relacion con consentimientos

Revocar consentimiento no debe borrar automaticamente la evidencia historica.

Debe conservarse trazabilidad de:

- version aceptada;
- fecha de aceptacion;
- fecha de revocacion;
- alcance de revocacion;
- actor u origen del cambio.

## Relacion con SEC-005

SEC-005 debe auditar:

- correcciones sensibles;
- anulaciones logicas;
- eliminaciones fisicas excepcionales;
- cambios de estado;
- revocaciones;
- intentos no autorizados de eliminacion.

BE-021 define el criterio funcional; SEC-005 define el evento de auditoria.

## Criterios de aceptacion de BE-021

- Separa correccion, anulacion logica y eliminacion fisica.
- Define regla por area funcional.
- Prohibe delete fisico operativo para datos sensibles en produccion.
- Define eliminacion fisica como excepcional, autorizada y auditada.
- Relaciona anulacion con SEC-005.
- Mantiene Finanzas fuera de datos clinicos.
- Mantiene PROD-001 bloqueante.
- No implementa migraciones, SQL, RLS, codigo, `.env`, Supabase remoto ni produccion.

## Riesgos pendientes

- Falta diseno tecnico de columnas/estados transversales.
- Falta definir RLS y grants sin delete fisico operativo.
- Falta revisar FKs con cascadas antes de produccion.
- Falta UI para motivos de anulacion.
- Falta QA runtime.
- PROD-001 sigue bloqueante.

## Recomendacion

El siguiente bloque recomendado es `BE-018 / DOC-001 / DOC-003` para separar ambientes, documentar operacion por ambiente y definir politica de carga de datos reales antes de cualquier implementacion tecnica.
