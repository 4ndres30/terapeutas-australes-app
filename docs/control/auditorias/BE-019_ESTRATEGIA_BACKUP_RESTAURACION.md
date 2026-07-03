# BE-019 - Estrategia de backup/restauracion

Estado: Diseno documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Integracion Backend / Produccion
Rama usada: `be-019-doc002-backup-restauracion`

## Objetivo

Definir la estrategia de respaldo y restauracion que debe existir antes de operar con datos reales, fotos reales, pagos reales o produccion.

BE-019 no ejecuta backups, no restaura bases, no toca Supabase remoto y no habilita produccion.

## Alcance

La estrategia debe cubrir:

- base de datos Supabase/PostgreSQL;
- Supabase Auth y usuarios internos cuando corresponda;
- Storage privado futuro para fotos/archivos;
- configuracion operativa no secreta;
- evidencia de respaldo;
- pruebas de restauracion;
- responsables y frecuencia.

## Ambientes

| Ambiente | Estrategia |
| --- | --- |
| Local | Sin respaldo formal; datos ficticios reconstruibles por seed/demo. |
| Demo | Respaldo opcional de estado demo si se necesita reproducibilidad. |
| Staging | Respaldo previo a pruebas destructivas o migraciones. |
| Produccion | Respaldo obligatorio, probado y monitoreado antes de datos reales. |

## Frecuencia futura minima

Frecuencia por definir antes de produccion:

- respaldo automatico diario para base productiva;
- respaldo previo a migraciones;
- respaldo previo a cargas reales iniciales;
- respaldo previo a cambios masivos;
- retencion minima documentada;
- restauracion probada periodicamente.

## Responsabilidades

- Control de desarrollo: aprueba estrategia y evidencia.
- Integracion Backend: define alcance tecnico y prueba restauracion.
- Responsable operativo futuro: verifica respaldo recurrente.
- Javier: autoriza habilitacion productiva y carga real.

## Reglas de seguridad

- No guardar backups con secretos expuestos.
- No copiar backups productivos a local/demo.
- No usar datos reales en ambientes no autorizados.
- Cifrar o proteger respaldos productivos.
- Registrar acceso a respaldos sensibles.
- No borrar respaldos criticos sin autorizacion.

## Criterios antes de produccion

- DOC-002 aprobado.
- Restauracion probada en ambiente aislado.
- Tiempo objetivo de recuperacion definido.
- Punto objetivo de recuperacion definido.
- Procedimiento de incidente documentado.
- Responsable operativo asignado.
- Evidencia disponible para auditoria.

## Restricciones respetadas

No se ejecutan comandos de backup, no se restaura informacion, no se modifica `.env`, no se usa Supabase remoto, no se ejecuta `supabase db push`, no se toca Google, no se habilita produccion y no se usan datos reales.

## Recomendacion

Antes de implementar esta estrategia, cerrar DOC-002 con procedimiento detallado y definir una prueba de restauracion local/demo con datos ficticios.
