# UI-021 - Bloqueo visual de produccion no habilitada

## Estado

Implementada local / pendiente revision visual autenticada.

## Fecha

2026-07-02

## Rama

`ui-020-ui021-diseno-ambiente-produccion`

## Origen

- PROD-001.
- DEC-030.
- DEC-031.
- BE-018.
- DOC-001.
- DOC-003.
- UI-020.

## Objetivo

Definir el bloqueo visual que debe impedir el uso de la aplicacion como produccion mientras PROD-001 siga abierto o mientras el ambiente activo no este habilitado formalmente.

UI-021 no implementa codigo, no cambia configuracion, no toca `.env`, no habilita produccion y no reemplaza controles backend.

## Problema que resuelve

El proyecto todavia no esta listo para operar con datos reales. Aunque existan documentos de ambientes, backup, consentimiento, auditoria y politicas de datos, una instancia mal identificada podria usarse como produccion por error.

El bloqueo visual reduce ese riesgo al impedir que la UI interna continue cuando detecta produccion no autorizada o un estado de ambiente inseguro.

## Estados recomendados

| Estado detectado | Comportamiento visual | Resultado |
| --- | --- | --- |
| LOCAL | Indicador UI-020 y aviso discreto de datos ficticios | Permitir uso local/demo. |
| DEMO | Indicador UI-020 y aviso discreto de datos ficticios | Permitir QA/demo. |
| STAGING no autorizado | Advertencia fuerte o bloqueo configurable segun checklist | No permitir datos reales. |
| PRODUCCION con PROD-001 abierto | Bloqueo completo | No permitir uso interno. |
| PRODUCCION sin aprobacion explicita | Bloqueo completo | No permitir uso interno. |
| Ambiente desconocido | Bloqueo preventivo para rutas sensibles | No asumir que es seguro. |

## Superficie del bloqueo

La implementacion futura debe bloquear como minimo:

- Pacientes.
- Casos.
- Evaluaciones.
- Revisiones y detalle de revisiones.
- Hallazgos.
- Trabajos.
- Agenda interna.
- Finanzas.
- Reportes.
- Fotos y archivos clinicos.
- Configuracion interna o administracion de usuarios.

El bloqueo visual no debe ser el unico control para API publica, Supabase, Auth, RLS, Storage o integraciones Google futuras.

## Experiencia recomendada

Usar una pantalla de bloqueo completa dentro del shell o antes del shell autenticado, con mensaje claro:

```text
Produccion no habilitada
Este ambiente no esta autorizado para operar con datos reales.
PROD-001 sigue abierto. Deten el uso y contacta a Control de Desarrollo.
```

Acciones permitidas:

- Cerrar sesion.
- Volver a una ruta segura si aplica.
- Ver referencia documental interna si existe y no expone informacion sensible.

Acciones no permitidas:

- Continuar de todos modos.
- Ocultar permanentemente el bloqueo.
- Cargar pacientes, fotos, pagos o datos reales.
- Ejecutar acciones clinicas o financieras.

## Reglas visuales y de accesibilidad

- El mensaje debe ser breve, inequivoco y no tecnico.
- El bloqueo debe funcionar en desktop y mobile.
- Debe tener contraste suficiente y foco inicial accesible.
- No debe depender solo del color.
- No debe incluir secretos, URLs privadas, IDs de proyecto ni detalles de infraestructura.
- Debe evitar modales apilados; se recomienda pantalla de bloqueo completa.

## Fuente de verdad futura

El bloqueo debe depender de un estado seguro de ambiente y de una condicion explicita de habilitacion productiva.

Conceptualmente:

```text
ambiente = PRODUCCION
produccion_habilitada = false
resultado = bloquear
```

Esta tarea no define variables reales, no modifica `.env` y no crea infraestructura.

## Criterios de aceptacion de implementacion futura

- Produccion no habilitada no permite navegar ni operar rutas internas.
- Ambiente desconocido no se trata como seguro.
- LOCAL y DEMO siguen permitidos con datos ficticios.
- El bloqueo se ve correctamente en mobile y desktop.
- No existe boton de bypass operativo.
- No se exponen secretos ni detalles tecnicos.
- La implementacion se valida con `npm run lint`, `npm run build` y QA visual.
- La implementacion no toca Supabase remoto, migraciones, `.env`, Google, API publica ni produccion real.

## Fuera de alcance

- Implementar guardas backend.
- Modificar RLS o Auth.
- Crear ambiente de produccion.
- Crear variables reales de entorno.
- Crear endpoints.
- Ejecutar migraciones.
- Usar datos reales, fotos reales o pagos reales.

## Riesgos pendientes

- Un bloqueo visual no reemplaza controles server-side.
- Si la fuente de ambiente se configura mal, puede producir falsos positivos o falsos negativos.
- Produccion real requiere checklist, auditoria, backups, consentimiento, hardening Auth/RLS, separacion de ambientes y aprobacion explicita.

## Recomendacion

Implementar UI-021 junto con UI-020 como primera barrera visual antes de cualquier prueba de staging o produccion. Mantener el bloqueo sin bypass mientras PROD-001 siga abierto.

## Avance de implementacion local

La rama `ui-020-ui021-implementacion-ambiente-produccion` implementa una pantalla de bloqueo dentro de `DashboardShell` para `PRODUCCION` no habilitada o ambiente desconocido.

El bloqueo reemplaza el contenido interno y mantiene accion de cierre de sesion. No modifica Auth, RLS, Supabase, `.env`, migraciones ni configuracion real de ambientes.

Informe relacionado: `docs/control/auditorias/UI-020_UI-021_IMPLEMENTACION_AMBIENTE_PRODUCCION.md`.
