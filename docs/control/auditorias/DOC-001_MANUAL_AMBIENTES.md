# DOC-001 - Manual de ambientes

Estado: Documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Control de desarrollo
Rama usada: `be-018-doc001-doc003-ambientes-datos-reales`

## Objetivo

Definir reglas operativas para uso y administracion de ambientes local, demo, staging y produccion.

DOC-001 no crea ni modifica ambientes. Es manual de operacion y control.

## Reglas por ambiente

### Local

- Uso: desarrollo y pruebas tecnicas.
- Datos: ficticios/demo.
- Prohibido: datos reales, fotos reales, pagos reales, credenciales productivas.

### Demo

- Uso: demostraciones y QA no productivo.
- Datos: ficticios/demo.
- Prohibido: operar como sistema oficial o cargar datos reales.

### Staging

- Uso: validacion previa aislada.
- Datos: ficticios o anonimizados aprobados.
- Requiere: separacion tecnica, responsable, checklist y autorizacion.

### Produccion

- Uso: operacion oficial futura.
- Estado actual: bloqueada por PROD-001.
- Requiere: cierre completo de seguridad, consentimiento, auditoria, ambientes, backups y aprobacion explicita.

## Responsabilidades

- Control de desarrollo: autoriza cambios de estado documental.
- Integracion Backend: define separacion tecnica y validaciones.
- Revision Clinica: valida uso de datos sensibles y consentimiento.
- Javier: aprueba carga real y habilitacion productiva.

## Reglas para datos

- No mezclar datos demo con datos reales.
- No ejecutar seeds demo en produccion.
- No copiar respaldos productivos a local/demo.
- No usar pacientes reales para pruebas visuales.
- No usar fotos reales mientras PROD-001 siga abierto.
- No usar pagos reales fuera de produccion habilitada.

## Reglas para configuracion

- No modificar `.env` sin autorizacion expresa.
- No versionar secretos.
- No compartir service role.
- Usar callbacks, CORS y URLs separados por ambiente.
- Mantener indicador de ambiente activo como requisito futuro.

## Incidentes de ambiente

Si se detecta mezcla de datos o configuracion:

1. detener uso del ambiente;
2. registrar evidencia;
3. avisar a Control;
4. no borrar evidencias sin autorizacion;
5. definir contencion y limpieza con auditoria.

## Restricciones respetadas

Este documento no toca codigo, migraciones, `.env`, Supabase remoto, Google, pagos, produccion ni datos reales.

## Recomendacion

DOC-001 debe revisarse junto con BE-018, DOC-003 y DOC-002 antes de cualquier habilitacion de staging o produccion.
