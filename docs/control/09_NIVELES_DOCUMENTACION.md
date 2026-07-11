# 09 - Niveles de documentacion

## Objetivo

Reducir sobredocumentacion sin perder control.

Este documento define que nivel documental corresponde a cada tipo de cambio, para mantener trazabilidad proporcional al riesgo.

## Nivel 1 - Ajuste menor

Aplica a:

- microcopy;
- CSS;
- visual menor;
- texto;
- orden visual;
- ajustes responsive acotados;
- correcciones que no cambian flujo funcional.

Requiere:

- nota breve en el PR o bitacora minima si afecta documentos de control;
- validaciones basicas del cambio;
- sin informe extenso salvo que Javier lo pida.

No requiere:

- decision formal;
- actualizacion completa de documentos maestros;
- QA ampliado.

## Nivel 2 - Cambio funcional interno

Aplica a:

- formularios internos;
- edicion interna;
- flujos operativos internos;
- pantallas conectadas a datos;
- cambios UI con impacto funcional;
- validaciones por rol dentro del sistema interno.

Requiere:

- informe puntual;
- registro en pendientes si queda validacion o fase posterior;
- entrada de bitacora;
- sincronizacion minima de documentos maestros afectados;
- validacion local no destructiva.

No requiere por defecto:

- decision formal de arquitectura;
- actualizacion extensa de todos los documentos maestros;
- cambios de DB, RLS, Auth o API.

## Nivel 3 - Cambio critico

Aplica a:

- DB;
- migraciones SQL;
- RLS;
- Auth;
- API publica;
- Google Calendar, Gmail o Workspace;
- datos reales;
- produccion;
- seguridad;
- consentimiento;
- ambientes;
- credenciales;
- infraestructura cloud.

Requiere:

- decision formal;
- informe completo;
- QA ampliado;
- actualizacion de documentos maestros;
- validacion de seguridad;
- revision explicita de restricciones y bloqueos transversales.

No debe ejecutarse sin:

- alcance aprobado;
- rama aislada;
- plan de validacion;
- confirmacion de que `PROD-001` no se vulnera.

## Clasificacion vigente

| Codigo | Nivel | Motivo |
| --- | --- | --- |
| QA-008 | Nivel 2 | Validacion funcional completa de Agenda interna ya integrada. |
| QA-012 | Nivel 2 | Regresion visual y funcional de PacientesPage integrada con datos local/demo. |
| QA-013 | Nivel 2 | Diagnostico, correccion versionada y validacion remota exitosa del workflow CI, sin codigo funcional, secretos ni produccion. |
| UI-025B | Nivel 2 | Alta y edicion controlada de `agenda_eventos` dentro del sistema interno. |
| UI-047 | Nivel 2 | Normalizacion de queryKeys TanStack Query en superficies internas, sin DB/RLS/Auth. |
| UI-048 | Nivel 1 | Ajuste CSS/visual menor para compactar indicadores de PacientesPage sin cambiar flujo ni datos. |
| UI-049 | Nivel 2 | Cambio de interaccion y layout del shell global para una sidebar desktop colapsable y accesible. |
| UI-050 | Nivel 2 | Redistribucion contextual de la barra superior global, con validacion responsive y por ruta. |
| BE-026 | Nivel 3 | Contrato de API publica de agendamiento. |
| BE-027 | Nivel 3 | Integracion Google Calendar/Gmail/Workspace. |
| PROD-001 | Bloqueo transversal | Impide datos reales, produccion y uso oficial hasta cierre formal. |

## Regla operativa

La documentacion debe crecer con el riesgo del cambio.

Un ajuste menor no debe arrastrar informes largos. Un cambio critico no debe entrar solo con una nota breve.

Cuando haya duda entre dos niveles, usar el nivel superior solo si el cambio toca seguridad, datos reales, permisos, DB, API, Google o produccion.
