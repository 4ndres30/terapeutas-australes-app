# CODEX - Auditoria de pauta de trabajo y finalidad del proyecto

## 1. Resumen ejecutivo

La pauta general del proyecto sigue siendo adecuada para un sistema clinico/terapeutico interno con datos sensibles. El orden `documentar -> auditar -> decidir -> disenar -> implementar -> validar -> revisar -> corregir -> integrar -> registrar` ha evitado mezclar agenda, consulta clinica, paciente, API publica, Google y produccion.

El estado observado ya cambio respecto de la primera version de esta auditoria: PR #45 fue fusionado a `main`. Por lo tanto, Agenda interna ya cuenta con lectura, alta y edicion controlada integrada en la rama estable.

PR #45 ya esta integrado. La prioridad inmediata pasa a ser preparar y ejecutar una validacion funcional completa de Agenda interna mediante `QA-008`. Esa validacion debe confirmar el flujo real de crear, editar, cancelar, reagendar y completar eventos, sin crear efectos colaterales clinicos ni avanzar a API publica o Google.

Veredicto de pauta: **Pauta aprobada con ajustes menores.**

## 2. Finalidad del proyecto entendida por Codex

El proyecto no es solamente una agenda ni una ficha simple de pacientes. Es una plataforma interna para ordenar el proceso clinico/terapeutico completo:

- paciente;
- consulta;
- evaluacion;
- caso;
- elemento del caso;
- revision;
- detalle de revision;
- hallazgo;
- trabajo terapeutico;
- agenda operativa;
- finanzas basicas;
- reportes;
- roles internos.

La finalidad real exige trazabilidad, separacion conceptual, control de permisos y capacidad de operar sin mezclar entidades. La agenda debe coordinar operaciones, pero no convertirse en fuente automatica de pacientes, consultas o tratamientos.

## 3. Estado actual observado

Estado local/GitHub revisado:

- `main` actualizado y limpio.
- PR #43: estrategia Google Cloud integrada en `main`.
- PR #44: UI-025A integrada en `main`.
- PR #45: UI-025B fusionado a `main`.
- PR #46: abierto, no draft, apuntando a `main` desde `ctrl-auditoria-pauta-trabajo`.
- `PROD-001` sigue correctamente bloqueante.

Estado tecnico observado:

- Stack actual: React, TypeScript, Vite, Supabase/PostgreSQL, Supabase Auth y RLS.
- No hay API publica real ni backend propio operativo.
- No hay integracion funcional con Google Calendar, Gmail, Workspace o Google Cloud.
- Agenda DB existe como `solicitudes_agenda`, `agenda_eventos` y `vista_agenda_operativa`.
- Agenda interna ya permite lectura desde la vista operativa y gestion manual minima de `agenda_eventos`.

## 4. Evaluacion de la pauta de trabajo

La pauta es correcta para el nivel de riesgo del dominio. Primero documentar y auditar antes de implementar ha permitido detectar conceptos criticos: Agenda no es Consulta, Solicitud no es Paciente, Evento no es Produccion, API publica no es frontend directo a Supabase.

Lo que esta bien:

- Las decisiones importantes quedan trazadas antes de tocar codigo.
- Las migraciones se tratan como cambios controlados.
- Las validaciones locales se separan de produccion.
- Los PRs tienen alcance acotado.
- Se evita mezclar integraciones Google, API publica y UI interna.

Lo sobredimensionado:

- Algunos informes repiten las mismas restricciones con mucho detalle.
- La bitacora, pendientes e informes puntuales a veces registran la misma decision tres veces.
- El costo de mantener sincronizados documentos maestros puede crecer mas rapido que el producto.

Lo que falta:

- Una regla explicita de documentacion minima suficiente por tipo de tarea.
- Una matriz corta que diga que documentos se actualizan obligatoriamente para cada tipo de cambio.
- Un cierre periodico de pendientes obsoletos o absorbidos por tareas posteriores.

## 5. Evaluacion de la separacion por focos/chats

La separacion por focos es util y recomendable:

- Control de Desarrollo mantiene trazabilidad y prioridades.
- Revision de Flujo Clinico protege la coherencia del modelo terapeutico.
- Integracion Backend/Estructura reduce cambios impulsivos en DB, RLS y migraciones.
- UI/UX/Pulido visual evita que la interfaz decida reglas clinicas por accidente.

El riesgo no es la separacion, sino convertirla en burocracia. La separacion debe seguir siendo una herramienta de control, no un requisito para escribir informes largos por cada ajuste visual menor.

Ajuste recomendado: mantener los focos, pero clasificar tareas en tres niveles:

- Nivel 1: ajuste visual, microcopy, CSS o texto.
- Nivel 2: cambio funcional interno acotado.
- Nivel 3: cambio de arquitectura, seguridad, datos, RLS, API, Google o produccion.

## 6. Evaluacion de arquitectura tecnica

Mantener Supabase/PostgreSQL como base actual tiene sentido. El proyecto ya depende de esquema relacional, RLS, Auth, vistas, migraciones versionadas y validacion local/demo.

Mover la base, Auth o modelo a Google Cloud ahora seria prematuro y agregaria complejidad sin resolver los bloqueos reales: consentimiento, auditoria, ambientes, hardening, backup, QA y `PROD-001`.

Google Cloud como plataforma futura tambien es coherente para API segura, integracion Google Workspace, workers o automatizaciones, despliegue por ambientes y manejo de secretos.

La decision correcta es mantener Google Cloud como futuro y no tratarlo como backend actual.

La decision de no integrar Gmail/Calendar antes de estabilizar Agenda interna es correcta. Calendar/Gmail agregan riesgos de privacidad, duplicacion, secretos, reintentos, eventos neutros, correos erroneos y sincronizacion parcial.

La decision de no crear API publica antes de validar Agenda interna tambien es correcta. La API debe operar sobre un modelo aprobado, no inventar entidades ni escribir en `consultas` por conveniencia.

## 7. Evaluacion del flujo clinico-operativo

La separacion entre paciente, consulta, evaluacion, caso, revision, hallazgo, trabajo y agenda esta bien planteada.

Fortalezas:

- `casos` opera como contenedor/conector, no como deposito universal.
- Hallazgos nacen dentro de revision/aspecto y no crean trabajos automaticamente.
- Trabajos, sesiones y acciones estan separados.
- Finanzas se mantiene como superficie propia y restringida.
- Agenda se separa entre `solicitudes_agenda`, `agenda_eventos` y `consultas`.

Tension conceptual relevante:

- En el README aun aparece que `consultas` registra "atenciones, sesiones, contactos o agendamientos". Esa frase puede ser historica y podria confundir si no se matiza: despues de DEC-034, un agendamiento operativo debe vivir en Agenda, no en Consulta, salvo que sea una consulta clinica confirmada.

Riesgo futuro:

- Si Agenda se usa para vincular eventos a consultas sin una politica clara, puede reaparecer duplicacion entre evento de agenda y consulta clinica. No es bloqueante hoy, pero debe cubrirse en `QA-008`.

## 8. Evaluacion de seguridad y produccion

`PROD-001` esta correctamente mantenido como bloqueo. La documentacion insiste de forma consistente en que no hay autorizacion para datos reales, fotos reales, pagos reales ni produccion.

Las restricciones son suficientes como politica inicial, pero faltan piezas antes de cualquier paso productivo:

- politica de ambientes local/demo/staging/produccion;
- hardening final de Auth y provisioning;
- MFA o criterio equivalente por rol;
- auditoria sensible transversal (`SEC-005`);
- anulacion logica vs delete fisico (`BE-021`);
- backup/restauracion probado;
- consentimiento informado y tratamiento de datos (`BE-020`);
- indicadores visuales de ambiente (`UI-020`, `UI-021`);
- politica de carga de datos reales (`DOC-003`);
- QA funcional por rol para flujos criticos.

Antes de API publica deben resolverse, al menos:

- `SEC-009` seguridad API publica;
- rate limit, CORS, anti-spam, idempotencia y errores neutros;
- consentimiento;
- auditoria minima;
- separacion de ambientes;
- no exposicion de disponibilidad real completa.

Antes de Google Calendar/Gmail deben resolverse:

- backend seguro y manejo de secretos;
- eventos y correos neutros;
- auditoria de sincronizacion/envio;
- estrategia de reintentos y estados;
- rollback operativo;
- limites de datos enviados a Google.

## 9. Evaluacion de Agenda operativa

La estrategia UI-025A -> UI-025B fue correcta.

Primero leer antes de escribir fue prudente porque permitio validar la vista `vista_agenda_operativa`, la separacion visual entre solicitudes/eventos/consultas, los estados reales del modelo y las restricciones de rol antes de editar datos.

Con PR #45 integrado, UI-025B ya permite gestion manual minima de `agenda_eventos`: crear evento interno, editar, cambiar estado, cancelar sin delete fisico, reagendar y marcar como completado.

Esto no habilita produccion ni uso real. Tampoco habilita API publica, Google Calendar, Gmail, creacion automatica de pacientes o conversion automatica de solicitudes en consultas.

Riesgos tecnicos del modelo actual:

- No hay historial detallado de cambios de agenda; solo `updated_at`/`updated_by`.
- No hay auditoria especifica para cancelacion, reagendamiento, conversion o sincronizacion futura.
- La vista operativa expone datos personales operativos a roles clinicos; esto es razonable para demo/local, pero no para datos reales sin `PROD-001` cerrado.
- Solicitudes sin evento vinculado pueden quedar fuera de la vista basada en `agenda_eventos`; debe validarse en QA si esto coincide con la operacion esperada.
- El modelo prepara campos Google, pero no debe interpretarse como integracion implementada.

Conviene ejecutar `QA-008` antes de API publica, Google o nuevos cambios funcionales de Agenda.

## 10. Riesgos detectados

Riesgos si se sigue igual sin ajustes:

- Sobredocumentacion y fatiga de mantenimiento.
- Estados de documentos maestros quedando atras respecto de PRs recien integrados.
- Repeticion de restricciones en demasiados informes, con riesgo de inconsistencias menores.
- Implementar API o Google antes de cerrar QA funcional, consentimiento y ambientes.
- Usar Agenda interna como sustituto de un flujo clinico completo.

Riesgos si se cambia demasiado rapido:

- Perder trazabilidad de decisiones.
- Mezclar agenda, consulta y paciente por velocidad.
- Introducir integraciones externas sin frontera API segura.
- Habilitar datos reales antes de cerrar `PROD-001`.
- Romper la separacion entre roles clinicos y Finanzas.

## 11. Contradicciones o tensiones encontradas

No se detecta contradiccion mayor que invalide la pauta.

Tensiones menores:

1. `README.md` aun usa una frase amplia sobre `consultas` y "agendamientos". Conviene matizarla en una tarea futura para evitar conflicto con DEC-034.
2. La documentacion debe distinguir mejor entre "estado integrado en main" y "pauta o QA pendiente de ejecutar".
3. API-001 lista una secuencia amplia de dependencias; es correcta, pero puede ser dificil decidir el siguiente paso operativo sin una priorizacion mas corta.
4. La bitacora es util, pero esta creciendo como repeticion de informes. Debe mantenerse con entradas mas sinteticas.

## 12. Ajustes recomendados a la pauta de trabajo

1. Aplicar niveles de documentacion:
   - Nivel 1: cambios visuales, microcopy, fixes CSS o texto.
   - Nivel 2: funcionalidad interna acotada.
   - Nivel 3: DB, RLS, Auth, API, datos reales, Google o produccion.

2. Definir una matriz de sincronizacion documental:
   - que archivos maestros se tocan por tipo de tarea;
   - cuando basta un informe de auditoria;
   - cuando se debe actualizar bitacora y decisiones.

3. Separar "estado en main" de "estado en PR abierto" en informes de auditoria.

4. Exigir QA funcional antes de avanzar desde Agenda interna hacia API publica.

5. Mantener `PROD-001` como bloqueo visible, pero evitar repetir la lista completa de restricciones en cada documento menor.

## 13. Optimizaciones sugeridas

- Crear una tabla breve de bloqueos transversales vigentes referenciada desde informes, en vez de repetirla completa.
- Consolidar duplicidades entre bitacora, pendientes e informes cuando una tarea ya esta cerrada.
- Mantener informes largos solo para arquitectura, seguridad, migraciones y flujo clinico.
- Usar checklists mas cortos para fixes visuales.
- Crear un mapa de flujo operativo actualizado despues de `QA-008` y antes de `BE-026`.
- Priorizar QA funcional de Agenda interna sobre nuevas capas externas.

## 14. Proximos pasos recomendados

Recomendacion principal: **preparar y ejecutar QA-008 - Validacion funcional completa de Agenda interna**.

Justificacion:

- UI-025B ya esta integrada en `main`.
- Agenda paso de lectura a escritura interna controlada.
- Antes de API publica o Google, hay que validar el flujo real de crear, editar, cancelar, reagendar y completar.
- Debe probarse por rol: admin, terapeuta, finanzas y anonimo.
- Deben verificarse errores RLS, estados invalidos, rangos de fecha, responsive y ausencia de efectos colaterales sobre pacientes/consultas.

Secuencia recomendada:

1. Actualizar y cerrar PR #46, o reemplazarlo por un PR nuevo si la rama quedo incomoda.
2. Crear `QA-008` como pauta de validacion funcional completa de Agenda interna.
3. Ejecutar `QA-008` en una tarea posterior sobre `main` actualizado.
4. Corregir hallazgos de `QA-008` si aparecen.
5. Recien despues evaluar `BE-026` API publica.
6. Mantener `BE-027` Google Calendar/Gmail en espera.

No recomiendo avanzar directamente a `BE-027`.

Tampoco recomiendo produccion, datos reales ni Google Calendar/Gmail en esta etapa.

## 15. Conclusion final

La pauta de trabajo esta alineada con la finalidad real del proyecto. El proyecto ha avanzado con una arquitectura prudente: primero flujo clinico, luego separacion de agenda, despues modelo DB, validacion local, UI lectura y edicion interna controlada.

El cambio clave es que PR #45 ya fue integrado. Por eso el foco inmediato no es cerrar esa rama, sino validar funcionalmente Agenda interna mediante `QA-008` antes de abrir nuevas capas.

La decision de mantener Supabase/PostgreSQL como base actual y Google Cloud como futuro es tecnicamente sana. La decision de no implementar API publica ni Google Calendar/Gmail antes de estabilizar Agenda interna tambien es correcta.

El principal ajuste no es tecnico sino operativo: reducir repeticion documental, formalizar niveles de documentacion y priorizar QA funcional antes de API publica o integraciones Google.

## 16. Veredicto

**Pauta aprobada con ajustes menores.**

La pauta es recomendable y debe mantenerse, pero con optimizaciones para evitar sobredocumentacion, mejorar priorizacion y cerrar `QA-008` antes de API publica o integraciones Google.
