# DOC-002 - Procedimiento de backup/restauracion

Estado: Documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Control de desarrollo / Integracion Backend
Rama usada: `be-019-doc002-backup-restauracion`

## Objetivo

Documentar el procedimiento minimo para respaldar y restaurar el sistema antes de operar con datos reales o produccion.

DOC-002 no ejecuta backups ni restauraciones. Es un procedimiento base para aprobacion futura.

## Precondiciones

Antes de una prueba real de restauracion:

- ambiente aislado definido por BE-018;
- datos ficticios o anonimizados aprobados;
- responsable tecnico asignado;
- ventana de prueba definida;
- evidencia esperada definida;
- no usar Supabase remoto productivo sin autorizacion explicita.

## Procedimiento de respaldo futuro

1. Confirmar ambiente.
2. Confirmar que no se esta operando sobre datos reales no autorizados.
3. Registrar fecha, responsable y objetivo del respaldo.
4. Identificar alcance: base, Auth, Storage, configuracion no secreta.
5. Ejecutar herramienta aprobada para respaldo.
6. Verificar archivo/artefacto generado.
7. Registrar ubicacion segura.
8. Registrar hash o evidencia de integridad cuando corresponda.
9. Confirmar retencion y responsable.

## Procedimiento de restauracion futuro

1. Confirmar ambiente destino aislado.
2. Confirmar que restaurar no sobrescribe datos reales.
3. Registrar fecha, responsable y motivo.
4. Validar artefacto de respaldo.
5. Ejecutar restauracion con herramienta aprobada.
6. Validar estructura base.
7. Validar roles/RLS minimos.
8. Validar datos esperados.
9. Registrar resultado y problemas.
10. No promover restauracion a produccion sin autorizacion explicita.

## Evidencia requerida

- Ambiente origen y destino.
- Fecha/hora.
- Responsable.
- Alcance.
- Herramienta usada.
- Resultado.
- Errores.
- Validaciones posteriores.
- Decision final.

## Prueba minima requerida antes de produccion

La primera restauracion debe probarse con datos ficticios o anonimizados aprobados.

Debe demostrar:

- que el respaldo existe;
- que se puede restaurar;
- que la app puede leer datos esperados;
- que RLS/roles basicos siguen funcionando;
- que no se mezclaron datos demo con reales.

## Incidente de restauracion

Si una restauracion falla:

- detener prueba;
- preservar logs;
- no reintentar sobre produccion;
- registrar causa probable;
- abrir tarea de correccion;
- no habilitar datos reales.

## Restricciones respetadas

Este procedimiento no toca `.env`, no ejecuta comandos, no toca Supabase remoto, no usa datos reales, no modifica migraciones, no integra Google y no habilita produccion.

## Recomendacion

La siguiente tarea recomendada despues de documentar BE-019/DOC-002 es definir `UI-020 / UI-021` para indicador de ambiente activo y bloqueo visual de produccion no habilitada.
