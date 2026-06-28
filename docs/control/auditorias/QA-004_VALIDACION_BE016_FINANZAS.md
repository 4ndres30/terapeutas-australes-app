# QA-004 - Validacion funcional local BE-016 / Finanzas

## Estado

Aprobada localmente.

## Fecha

2026-06-27

## Responsable

Control de desarrollo / Javier

## Origen

BE-016 - Vista financiera minima por unidad cobrable.

## Contexto

Despues de integrar PR #31, se valido localmente el comportamiento funcional del rol `finanzas` sobre la pantalla `Finanzas / Pagos`.

BE-016 habia incorporado:

- vista `public.vista_finanzas_unidades_cobrables`;
- ajuste de `public.vista_cobros_estado` para que Finanzas no reciba filas;
- actualizacion de `FinanzasPage` para dejar de consultar `pacientes`, `pagos` directo y `vista_cobros_estado`;
- documentacion asociada a BE-016.

## Alcance de la validacion

Esta validacion fue manual y local. No modifica codigo, migraciones, Supabase remoto ni datos reales.

Se probo:

- acceso con usuario local de rol `finanzas`;
- visualizacion de `Finanzas / Pagos`;
- bloqueo de modulos clinicos;
- ausencia de datos clinicos sensibles en la pantalla financiera;
- coherencia visual minima de cobros, saldos y pagos.

## Usuario usado

Usuario local/demo:

`finanzas.rls.local@terapeutas.test`

No se documenta contrasena en el repositorio.

## Resultado observado

El usuario Finanzas pudo:

- iniciar sesion correctamente;
- acceder a `Finanzas / Pagos`;
- ver informacion financiera minima;
- ver alias/codigos administrativos de paciente;
- ver montos, saldos, estados, metodo de pago y referencia de pago.

El usuario Finanzas no pudo acceder a:

- Pacientes;
- Consultas;
- Evaluaciones;
- Casos;
- Elementos del caso;
- Revisiones;
- Hallazgos;
- Fotos de elementos;
- `storage_path`;
- datos clinicos sensibles.

## Datos sensibles no observados

Durante la validacion visual no se observaron:

- nombre completo del paciente;
- telefono;
- email;
- motivo de consulta;
- evaluacion;
- relato de antecedentes;
- elementos del caso;
- aspectos revisados;
- hallazgos;
- notas clinicas;
- informacion canalizada;
- trabajos clinicos sensibles;
- fotos;
- miniaturas;
- rutas internas de Storage;
- `storage_path`.

## Resultado sobre BE-016

BE-016 queda funcionalmente validada en ambiente local/demo.

La pantalla financiera queda alineada con SEC-004 y DEC-020: Finanzas opera sobre una superficie minima administrativa/financiera, sin entrar a ficha clinica ni archivos clinicos.

## Observaciones

- La validacion fue realizada en ambiente local.
- No habilita uso con datos reales.
- PROD-001 sigue bloqueante.
- UI-016 sigue pendiente para separar `ReportesPage` por rol.
- SEC-005 sigue pendiente para auditoria de accesos/cambios sensibles.
- BE-021 sigue pendiente para anulacion logica vs delete fisico.

## Siguiente accion recomendada

Iniciar UI-016 - Reportes separados por rol.

Objetivo: evitar que `ReportesPage` siga siendo una pantalla compartida que dependa solo de RLS para entregar vistas parciales por rol.
