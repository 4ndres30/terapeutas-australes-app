# UI-020 - Indicador visual de ambiente activo

## Estado

Diseno documental / pendiente implementacion futura.

## Fecha

2026-07-02

## Rama

`ui-020-ui021-diseno-ambiente-produccion`

## Origen

- PROD-001.
- DEC-030.
- BE-018.
- DOC-001.
- DOC-003.
- BE-019 / DOC-002.

## Objetivo

Definir el comportamiento visual minimo para que la aplicacion muestre siempre el ambiente activo y reduzca el riesgo de operar con datos reales en local, demo, staging no autorizado o produccion no habilitada.

UI-020 no implementa codigo, no modifica `.env`, no crea configuracion de ambientes y no habilita produccion.

## Problema que resuelve

Sin un indicador visible, una persona puede confundir una instancia local/demo con un ambiente real o creer que produccion esta autorizada antes de cerrar PROD-001.

El indicador debe funcionar como recordatorio operativo permanente, especialmente durante QA, demostraciones, capturas, validaciones visuales y futuras pruebas de ambientes.

## Ambientes soportados

| Ambiente | Texto recomendado | Uso permitido actual |
| --- | --- | --- |
| LOCAL | `LOCAL - datos ficticios` | Desarrollo y pruebas locales. |
| DEMO | `DEMO - datos ficticios` | Demostraciones y QA no productivo. |
| STAGING | `STAGING - validacion` | Futuro ambiente aislado, pendiente implementacion. |
| PRODUCCION | `PRODUCCION - habilitada` | Futuro ambiente oficial, bloqueado mientras PROD-001 siga abierto. |
| DESCONOCIDO | `AMBIENTE NO IDENTIFICADO - no usar datos reales` | Estado conservador si falta configuracion segura. |

## Ubicacion recomendada

- Dentro del shell principal autenticado, cerca del encabezado superior, usuario activo o navegacion.
- Visible en desktop y mobile sin depender de abrir el menu lateral.
- Persistente al navegar entre Pacientes, Casos, Agenda, Reportes, Finanzas y configuracion interna.
- Visible en capturas de QA.
- Sin cubrir formularios, modales, tablas, alertas clinicas ni acciones principales.

En mobile debe ocupar una linea compacta o un bloque pequeno dentro del encabezado, sin generar overflow horizontal.

## Reglas visuales

- No depender solo del color: incluir texto claro y, si se implementa, un icono o etiqueta accesible.
- Mantener alto contraste y tamano legible.
- Evitar estilo de alerta critica para LOCAL/DEMO; la advertencia fuerte corresponde a UI-021.
- Usar lenguaje operativo, no tecnico.
- No mostrar URL interna, project id, anon key, service role, nombre de bucket, host de base de datos ni otros datos sensibles.
- Si el ambiente es desconocido, usar estado conservador y visible.

## Fuente de verdad futura

La implementacion futura debe leer solo un enum seguro, por ejemplo:

```text
LOCAL
DEMO
STAGING
PRODUCCION
```

La fuente puede ser configuracion de frontend permitida o un endpoint interno seguro, pero no debe exponer secretos. Esta tarea no define valores reales ni modifica `.env`.

## Comportamiento esperado

- LOCAL y DEMO: mostrar indicador permanente y recordar que solo se permiten datos ficticios.
- STAGING: mostrar indicador permanente y advertir que el ambiente requiere autorizacion y datos anonimizados o ficticios aprobados.
- PRODUCCION habilitada: mostrar indicador permanente solo cuando PROD-001 este cerrado y exista aprobacion explicita.
- PRODUCCION no habilitada o ambiente desconocido: derivar al comportamiento de UI-021.

## Criterios de aceptacion de implementacion futura

- El indicador aparece en todas las rutas internas protegidas.
- El indicador aparece correctamente en desktop y mobile.
- El indicador no causa overflow horizontal.
- El indicador no tapa informacion clinica, financiera ni acciones primarias.
- El indicador usa texto ademas de color.
- El indicador no expone secretos ni identificadores tecnicos sensibles.
- LOCAL/DEMO dejan claro que no se deben usar datos reales.
- El estado desconocido se trata como riesgo, no como produccion habilitada.
- La implementacion se valida con `npm run lint`, `npm run build` y una pasada visual.

## Fuera de alcance

- Implementar codigo en `src/`.
- Modificar `.env`.
- Crear variables reales de ambiente.
- Crear endpoints.
- Cambiar Auth, RLS, Supabase, migraciones o Storage.
- Habilitar staging o produccion.
- Usar datos reales, fotos reales o pagos reales.

## Riesgos pendientes

- La UI por si sola no reemplaza separacion tecnica real de ambientes.
- Produccion requiere controles backend, Auth, RLS, backups, auditoria, consentimiento y aprobacion explicita.
- Si se implementa solo con una variable frontend, debe asumirse como ayuda visual, no como barrera de seguridad.

## Recomendacion

Implementar UI-020 junto con UI-021 en una rama funcional separada, despues de validar el origen seguro del estado de ambiente. Mantener PROD-001 bloqueante hasta que exista separacion tecnica real, pruebas y aprobacion formal.
