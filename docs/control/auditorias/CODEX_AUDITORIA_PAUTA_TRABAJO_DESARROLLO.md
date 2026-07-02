# CODEX - Auditoria de pauta de trabajo y finalidad del proyecto

## 1. Resumen ejecutivo

La pauta general del proyecto es adecuada y ha evitado decisiones peligrosas: el sistema sigue separado entre flujo clinico, agenda, finanzas, seguridad, documentacion y futuras integraciones externas.

El orden `documentar -> auditar -> decidir -> disenar -> implementar -> validar -> revisar -> corregir -> integrar -> registrar` es correcto para un sistema clinico/terapeutico con datos sensibles, pero ya muestra riesgo de sobredocumentacion y duplicacion entre documentos maestros, bitacora e informes puntuales.

El avance reciente esta razonablemente ordenado:

- PR #39 a PR #44 estan integrados en `main`.
- PR #45 esta abierto, no draft y mergeable al momento de esta auditoria.
- `PROD-001` sigue correctamente bloqueante.
- Google Cloud, Gmail, Calendar y API publica siguen definidos como futuros, no implementados.

Veredicto de pauta: **Pauta aprobada con ajustes menores.**

## 2. Finalidad del proyecto entendida por Codex

El proyecto no es una agenda ni una ficha simple de pacientes. Es una plataforma interna para ordenar el proceso clinico/terapeutico completo:

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
- Historial reciente de `main` incluye:
  - PR #39: `API-001` integrado.
  - PR #40: `BE-012 / BE-017` integrado.
  - PR #41: `BE-028` integrado.
  - PR #42: `BE-029` integrado.
  - PR #43: estrategia Google Cloud integrada.
  - PR #44: UI-025A integrada.
- PR #45: abierto, no draft, `MERGEABLE`, rama `ui-025b-agenda-operativa-edicion-controlada`.

Estado tecnico observado:

- Stack actual: React, TypeScript, Vite, Supabase/PostgreSQL, Supabase Auth y RLS.
- No hay API publica real ni backend propio operativo.
- No hay integracion funcional con Google Calendar, Gmail, Workspace o Google Cloud.
- Agenda DB existe como `solicitudes_agenda`, `agenda_eventos` y `vista_agenda_operativa`.
- UI-025A esta en `main`; UI-025B esta en revision por PR #45.

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

- Una regla explicita de "documentacion minima suficiente" por tipo de tarea.
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

- Nivel 1: ajuste visual o microcopy, con nota breve y validaciones.
- Nivel 2: cambio funcional interno, con informe puntual y bitacora.
- Nivel 3: cambio de arquitectura, seguridad, datos, RLS, API o produccion, con decision formal, informe completo y validacion ampliada.

## 6. Evaluacion de arquitectura tecnica

Mantener Supabase/PostgreSQL como base actual tiene sentido. El proyecto ya depende de:

- esquema relacional;
- RLS;
- Auth;
- vistas;
- migraciones versionadas;
- validacion local/demo.

Mover la base, Auth o modelo a Google Cloud ahora seria prematuro y agregaria complejidad sin resolver los bloqueos reales: consentimiento, auditoria, ambientes, hardening, backup, QA y PROD-001.

Google Cloud como plataforma futura tambien es coherente, especialmente para:

- API segura;
- integracion Google Workspace;
- workers o automatizaciones;
- despliegue por ambientes;
- manejo de secretos.

La decision correcta es mantener Google Cloud como futuro y no tratarlo como backend actual.

La decision de no integrar Gmail/Calendar antes de estabilizar Agenda interna es correcta. Calendar/Gmail agregan riesgos de privacidad, duplicacion, secretos, reintentos, eventos neutros, correos erroneos y sincronizacion parcial. Sin Agenda interna estable y auditada, esa integracion seria fragil.

La decision de no crear API publica antes de cerrar Agenda interna tambien es correcta. La API debe operar sobre un modelo aprobado, no inventar entidades ni escribir en `consultas` por conveniencia.

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

- Si UI-025B se usa para crear eventos vinculados a consultas sin una politica clara, puede reaparecer duplicacion entre evento de agenda y consulta clinica. No es un problema bloqueante hoy, pero debe ser cubierto por QA funcional y auditoria de cambios.

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

Primero leer antes de escribir fue una decision prudente porque permitio validar:

- que la vista `vista_agenda_operativa` funciona como superficie segura;
- que el usuario entiende separacion entre solicitudes, eventos y consultas;
- que los estados reales del modelo aparecen en UI;
- que las restricciones visuales y de rol se sostienen antes de editar datos.

UI-025B es una evolucion razonable, siempre que se integre despues de revisar:

- responsive del modal y formularios;
- errores de RLS sin exponer detalles tecnicos;
- que no exista delete fisico;
- que no cree pacientes/consultas/solicitudes;
- que `notas_internas` no se use como deposito de informacion clinica sensible;
- que cambios de estado queden cubiertos por una futura auditoria.

Riesgos tecnicos del modelo actual:

- No hay historial detallado de cambios de agenda; solo `updated_at`/`updated_by`.
- No hay auditoria para cancelacion, reagendamiento, conversion o sincronizacion futura.
- La vista operativa expone datos personales operativos a roles clinicos; esto es razonable para demo/local, pero no para datos reales sin `PROD-001` cerrado.
- Solicitudes sin evento vinculado no aparecen en la vista basada en `agenda_eventos`; puede ser correcto como decision v1, pero debe estar claro para operacion.
- El modelo prepara campos Google, pero no debe interpretarse como integracion implementada.

Conviene pulir y validar Agenda interna antes de API publica.

## 10. Riesgos detectados

Riesgos si se sigue igual sin ajustes:

- Sobredocumentacion y fatiga de mantenimiento.
- Estados de documentos maestros quedando atras respecto de PRs abiertos o recien integrados.
- Repeticion de restricciones en demasiados informes, con riesgo de inconsistencias menores.
- Implementar API o Google antes de cerrar auditoria, consentimiento y ambientes.
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
2. La documentacion de `main` no incluye UI-025B porque PR #45 esta abierto. Esto es correcto, pero al revisar el proyecto completo debe distinguirse `main` de PR abierto.
3. API-001 lista una secuencia amplia de dependencias; es correcta, pero puede ser dificil decidir el siguiente paso operativo sin una priorizacion mas corta.
4. La bitacora es util, pero esta creciendo como repeticion de informes. Debe mantenerse, pero con entradas mas sinteticas.

## 12. Ajustes recomendados a la pauta de trabajo

1. Definir niveles de documentacion:
   - menor: cambios visuales, microcopy, fixes CSS;
   - medio: funcionalidad interna acotada;
   - mayor: DB, RLS, Auth, API, datos reales, Google, produccion.

2. Definir una matriz de sincronizacion documental:
   - que archivos maestros se tocan por tipo de tarea;
   - cuando basta un informe de auditoria;
   - cuando se debe actualizar bitacora y decisiones.

3. Separar "estado en main" de "estado en PR abierto" en informes de auditoria.

4. Exigir QA funcional antes de avanzar desde Agenda interna hacia API publica.

5. Mantener `PROD-001` como bloqueo visible, pero evitar repetir la lista completa de restricciones en cada documento menor.

## 13. Optimizaciones sugeridas

- Crear una tabla breve de "bloqueos transversales vigentes" referenciada desde informes, en vez de repetirla completa.
- Consolidar duplicidades entre bitacora, pendientes e informes cuando una tarea ya esta cerrada.
- Mantener informes largos solo para arquitectura, seguridad, migraciones y flujo clinico.
- Usar checklists mas cortos para fixes visuales.
- Crear un "mapa de flujo operativo" actualizado despues de UI-025B y antes de BE-026.
- Priorizar QA funcional de Agenda interna sobre nuevas capas externas.

## 14. Proximos pasos recomendados

Recomendacion principal despues de cerrar PR #45: **Opcion B - QA funcional completo de Agenda interna.**

Justificacion:

- UI-025B cambia Agenda desde lectura a escritura interna.
- Antes de API publica o Google, hay que validar el flujo real de crear, editar, cancelar, reagendar y completar.
- Debe probarse por rol: admin, terapeuta, finanzas y anonimo.
- Deben verificarse errores RLS, estados invalidos, rangos de fecha, responsive y ausencia de efectos colaterales sobre pacientes/consultas.

Secuencia recomendada:

1. Cerrar PR #45 solo si pasa revision visual/funcional.
2. Ejecutar QA funcional completo de Agenda interna.
3. Aplicar pulidos UI/UX derivados del QA si aparecen.
4. Reforzar seguridad/auditoria (`SEC-005`, `BE-021`) antes de API publica.
5. Avanzar a `BE-026` solo despues de que Agenda interna este estable.
6. Dejar `BE-027` para despues de API, seguridad, consentimiento, ambientes y auditoria.

No recomiendo avanzar directamente a `BE-027`.

Tampoco recomiendo produccion, datos reales ni Google Calendar/Gmail en esta etapa.

## 15. Conclusion final

La pauta de trabajo esta alineada con la finalidad real del proyecto. El proyecto ha avanzado con una arquitectura prudente: primero flujo clinico, luego separacion de agenda, despues modelo DB, validacion local, UI lectura y finalmente edicion interna controlada.

La decision de mantener Supabase/PostgreSQL como base actual y Google Cloud como futuro es tecnicamente sana. La decision de no implementar API publica ni Google Calendar/Gmail antes de estabilizar Agenda interna tambien es correcta.

El principal ajuste no es tecnico sino operativo: reducir repeticion documental, formalizar niveles de documentacion y priorizar QA funcional antes de nuevas capas.

## 16. Veredicto

**Pauta aprobada con ajustes menores.**

La pauta es recomendable y debe mantenerse, pero con optimizaciones para evitar sobredocumentacion, mejorar priorizacion y cerrar QA/seguridad antes de API publica o integraciones Google.
