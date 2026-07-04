# CTRL-012 - Cierre documental bloque QA/Finanzas

## Estado

Preparada / pendiente revision PR.

## Fecha

2026-07-03

## Rama

`ctrl-012-cierre-bloque-qa-finanzas`

## Origen

- QA-006D.
- QA-006E.
- BE-023.
- BE-025.
- SEC-004.
- PROD-001.

## Objetivo

Cerrar documentalmente el bloque reciente de QA/Finanzas y dejar una recomendacion unica para el siguiente paso operativo.

Este cierre agrupa solamente tareas ya integradas en `main`:

| PR | Codigo | Resultado |
| --- | --- | --- |
| #76 | QA-006D | Reportes/Finanzas por rol validados local/demo. |
| #77 | QA-006E | Estados Auth minimos validados local/demo con mensajes no tecnicos. |
| #78 | BE-023 | Diseno documental de alias/codigo financiero persistente. |
| #79 | BE-025 | Contrato documental de campos financieros permitidos/prohibidos. |

## Estado del bloque

El bloque QA/Finanzas queda ordenado documentalmente:

- Finanzas tiene separacion visual por rol validada en local/demo.
- Auth local/demo tiene casos minimos revisados sin exponer errores tecnicos.
- La identidad financiera futura queda definida como alias/codigo persistente no derivado del UUID clinico.
- Los campos financieros permitidos/prohibidos quedan definidos como whitelist administrativa.
- `paciente_id`, textos clinicos, fotos, rutas Storage, identificadores clinicos y campos libres sensibles siguen fuera de la superficie financiera futura por defecto.

## Lo que no queda cerrado

Este cierre no implementa cambios tecnicos.

Quedan pendientes:

- QA-006 RLS/Storage local en bloque separado.
- Implementacion futura de BE-023.
- Implementacion futura de BE-025.
- UI-015 para microcopy y experiencia financiera.
- SEC-005 auditoria sensible.
- BE-021 anulacion logica vs delete fisico.
- SEC-008B y UI-024 para cierre Auth productivo.
- PROD-001 antes de datos reales, fotos reales, pagos reales o produccion.

## Riesgos vigentes

- La vista financiera actual sigue siendo suficiente para local/demo, pero no para datos reales hasta implementar BE-023/BE-025.
- Las pruebas RLS/Storage deben separarse de los documentos financieros para no mezclar runtime sensible con definiciones de contrato.
- No debe ejecutarse Supabase remoto ni `supabase db push`.
- No debe usarse la sesion local/demo como habilitacion productiva.

## Recomendacion de Control

Siguiente paso recomendado:

```text
QA-006F - Validacion RLS/Storage local por rol
```

Alcance recomendado:

- entorno local/demo solamente;
- datos ficticios;
- sin Supabase remoto;
- sin `supabase db push`;
- sin modificar `.env`;
- sin crear ni modificar migraciones;
- sin tocar Auth productivo;
- validar lectura/bloqueo por rol en tablas clinicas, financieras y Storage;
- documentar observaciones sin corregir RLS en el mismo PR si aparece riesgo medio/alto.

## Restricciones respetadas

- No se modifico codigo fuente funcional.
- No se modifico `src/`.
- No se modifico `.env`.
- No se modificaron migraciones.
- No se modifico Auth/RLS.
- No se crearon usuarios.
- No se modifico base de datos local ni remota.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Validaciones

- Revision documental de PR #76, #77, #78 y #79: OK.
- `git diff --check`: OK.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia existente de chunk Vite mayor a 500 kB.

## Resultado

CTRL-012 deja cerrado el bloque documental QA/Finanzas y propone `QA-006F - Validacion RLS/Storage local por rol` como siguiente tarea.

La ejecucion de QA-006F debe ser una tarea separada, controlada y sin tocar remoto ni produccion.
