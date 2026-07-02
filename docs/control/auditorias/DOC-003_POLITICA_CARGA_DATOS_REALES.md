# DOC-003 - Politica de carga de datos reales

Estado: Documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Control de desarrollo
Rama usada: `be-018-doc001-doc003-ambientes-datos-reales`

## Objetivo

Definir la politica para autorizar, ejecutar y controlar la primera carga de datos reales.

DOC-003 no autoriza datos reales. Mantiene PROD-001 como bloqueo.

## Regla central

No se deben cargar datos reales, fotos reales ni pagos reales hasta que PROD-001 este cerrado y Javier apruebe explicitamente la carga.

## Condiciones previas

- BE-018 separacion tecnica de ambientes aprobada e implementada.
- DOC-001 manual de ambientes aprobado.
- DOC-002 backup/restauracion aprobado y probado.
- BE-020 validado clinica/legalmente.
- SEC-005 implementado para auditoria sensible.
- BE-021 implementado para anulacion logica.
- RLS/grants validados para roles.
- UI-020/UI-021 o mecanismo equivalente para identificar ambiente y bloqueo productivo.
- Checklist pre-produccion aprobado.

## Datos permitidos antes de produccion

- Datos ficticios.
- Datos demo.
- Datos anonimizados solo si existe aprobacion explicita y no permiten reidentificacion.

## Datos prohibidos antes de produccion

- Pacientes reales.
- Nombres, telefonos o correos reales.
- Fotos reales.
- Documentos clinicos reales.
- Pagos o cobros reales.
- Credenciales productivas.
- Backups productivos en local/demo.

## Flujo de autorizacion

1. Control solicita revision de checklist.
2. Integracion Backend confirma ambiente correcto.
3. Revision Clinica confirma consentimiento y alcance.
4. Se confirma backup/restauracion.
5. Javier aprueba explicitamente por escrito.
6. Se registra bitacora de autorizacion.
7. Se ejecuta carga controlada.
8. Se valida resultado y auditoria.

## Evidencia requerida

- Fecha y responsable.
- Ambiente utilizado.
- Tipo de datos cargados.
- Origen de datos.
- Confirmacion de consentimiento/base de autorizacion.
- Resultado de backup previo.
- Validacion posterior.
- Registro de incidencias.

## Reglas de emergencia

Si se cargan datos reales por error:

- detener uso;
- no seguir cargando datos;
- registrar evidencia;
- avisar a Control;
- evaluar contencion;
- no borrar sin politica BE-021 y auditoria SEC-005.

## Restricciones respetadas

DOC-003 no toca codigo, migraciones, `.env`, Supabase remoto, Google, pagos, produccion ni datos reales.

## Recomendacion

El siguiente bloque recomendado es DOC-002 / BE-019 para backup y restauracion, porque DOC-003 exige restauracion probada antes de cualquier carga real.
