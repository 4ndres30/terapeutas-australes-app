# QA-007 - Checklist pre-migracion cloud

## Estado

Pendiente / checklist documental inicial.

## Fecha

2026-07-01

## Origen

DEC-035 / BE-030 / SEC-010 / DOC-005 / PROD-001.

## Objetivo

Definir una lista minima de validacion antes de implementar o desplegar componentes reales del proyecto en Google Cloud.

## Principio rector

Ningun despliegue cloud debe interpretarse como autorizacion para datos reales o produccion mientras PROD-001 siga abierto.

## Checklist documental minimo

- [ ] DEC-035 aprobada por Javier.
- [ ] BE-030 aprobado.
- [ ] SEC-010 aprobado.
- [ ] DOC-005 aprobado.
- [ ] DOC-001 manual de ambientes aprobado.
- [ ] DOC-003 politica de carga de datos reales aprobada.
- [ ] DOC-004 flujo pagina publica -> API -> sistema interno -> Google aprobado.
- [ ] BE-026 contrato API publica aprobado.
- [ ] BE-027 integracion Calendar/Gmail aprobada.
- [ ] SEC-009 seguridad API publica aprobada.

## Checklist tecnico minimo antes de entorno cloud no productivo

- [ ] Ambiente objetivo definido: DEMO o STAGING.
- [ ] Datos reales prohibidos en la prueba inicial.
- [ ] Variables de entorno documentadas solo con nombres, no con valores.
- [ ] Configuracion sensible excluida del repositorio.
- [ ] Runtime candidato definido: Cloud Run, Firebase App Hosting u otro.
- [ ] Estrategia de rollback definida.
- [ ] Responsable tecnico definido.
- [ ] Costo esperado documentado.
- [ ] Region objetivo definida si aplica.
- [ ] Estrategia de logs sin informacion sensible definida.

## Checklist seguridad

- [ ] Configuracion sensible fuera del frontend.
- [ ] Configuracion sensible fuera del repositorio.
- [ ] Permisos cloud con minimo privilegio.
- [ ] Identidades tecnicas separadas por responsabilidad.
- [ ] Credenciales separadas por ambiente.
- [ ] Callbacks separados por ambiente.
- [ ] No usar permisos administrativos amplios para ejecucion normal.
- [ ] Logs sin informacion sensible ni identificadores tecnicos innecesarios.
- [ ] Auditoria sensible coordinada con SEC-005.

## Checklist API publica

- [ ] CORS estricto definido.
- [ ] Rate limit definido.
- [ ] Anti-spam definido si aplica.
- [ ] Idempotencia definida.
- [ ] Esquemas de validacion definidos.
- [ ] Errores neutros definidos.
- [ ] No se expone estructura interna de Supabase.
- [ ] La pagina publica no escribe directo en tablas clinicas.
- [ ] La pagina publica no consulta agenda interna completa.

## Checklist Google Calendar/Gmail

- [ ] Calendar usa titulos neutros.
- [ ] Calendar no contiene motivos clinicos o energeticos sensibles.
- [ ] Gmail usa plantillas neutras.
- [ ] Gmail no envia detalles clinicos sensibles.
- [ ] La sincronizacion ocurre desde backend seguro.
- [ ] La sincronizacion no ocurre al recibir una solicitud publica cruda.
- [ ] Existe auditoria de intento, exito y fallo de sincronizacion.

## Checklist Supabase actual

- [ ] No se toca Supabase remoto sin instruccion expresa.
- [ ] No se ejecuta `supabase db push` sin instruccion expresa.
- [ ] No se modifica `.env` desde tarea documental.
- [ ] RLS sigue vigente.
- [ ] Roles siguen validados.
- [ ] Se mantiene separacion admin/terapeuta/finanzas.
- [ ] No se mezclan datos demo y reales.

## Checklist produccion futura

Produccion solo puede evaluarse si:

- [ ] PROD-001 esta cerrado.
- [ ] BE-018 ambientes cerrado.
- [ ] BE-019 backup/restauracion cerrado.
- [ ] BE-020 consentimiento cerrado.
- [ ] BE-021 anulacion logica cerrado.
- [ ] SEC-005 auditoria sensible cerrado.
- [ ] SEC-009 seguridad API cerrado.
- [ ] SEC-010 secretos/IAM/OAuth cerrado.
- [ ] QA-006 pruebas por rol cerrado.
- [ ] QA-007 checklist cloud cerrado.
- [ ] Javier aprueba expresamente uso real.

## Resultado esperado

QA-007 debe evitar que el proyecto avance a infraestructura cloud sin control de seguridad, costos, configuracion sensible, ambientes y datos protegidos.

## Restricciones

QA-007 no ejecuta pruebas reales, no despliega, no modifica codigo, no crea credenciales, no toca `.env`, no toca Supabase remoto y no habilita produccion.
