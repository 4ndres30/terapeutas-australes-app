# BE-003 — Criterios para futuras migraciones

## Estado

Aprobado con observaciones.

## Fecha

2026-06-12.

## Rama auditada

`main`.

## Fuente del informe

Este documento consolida el informe BE-003 entregado por Integración estructura / backend. La tarea se ejecutó como informe técnico/documental para definir criterios mínimos de creación, revisión, prueba y aprobación de futuras migraciones Supabase/PostgreSQL.

## Objetivo

Registrar oficialmente BE-003 como pauta técnica para futuras migraciones de Supabase/PostgreSQL, evitando afectar `.env`, Supabase remoto, datos reales o la rama `main`.

La pauta prepara el marco seguro para próximas tareas backend como hallazgos operativos, trazabilidad hallazgo a trabajo, agenda tipificada, cobros por unidad cobrable, vistas clínicas agregadas, vistas financieras y validaciones RLS.

## Restricciones respetadas

- No se modificó código fuente.
- No se modificaron migraciones.
- No se crearon migraciones.
- No se tocó `.env`.
- No se ejecutó Supabase.
- No se ejecutó `supabase db push`.
- No se tocó Supabase remoto.
- No se modificaron datos reales.
- No se hizo merge a `main`.
- No se modificaron decisiones clínicas.
- No se modificó UI.

## Resumen ejecutivo

BE-003 define la pauta mínima para crear, revisar, probar y aprobar futuras migraciones de Supabase/PostgreSQL en el proyecto `terapeutas-australes-app`, sin afectar `.env`, Supabase remoto ni la rama `main`.

La tarea no implementa migraciones. Su función es establecer un marco seguro para próximas tareas backend como hallazgos operativos, trazabilidad hallazgo a trabajo, agenda tipificada, cobros por unidad cobrable, vistas clínicas agregadas, vistas financieras y validaciones RLS.

La pauta queda alineada con el sistema documental del proyecto, con BE-001, BE-002, RFC-001 y las decisiones DEC-006 a DEC-012. Cualquier migración futura debe nacer desde una tarea aprobada, declarar su riesgo, respetar las decisiones clínicas vigentes y pasar por revisión antes de ejecutarse o proponerse para integración.

## Documentos revisados

- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/auditorias/BE-001_INVENTARIO_BACKEND_SUPABASE.md`
- `docs/control/auditorias/BE-002_ALINEACION_BACKEND_FLUJO_CLINICO.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

## Alcance

BE-003 cubre criterios para:

- Crear nuevas migraciones futuras.
- Revisar migraciones antes de ejecutarlas localmente.
- Probar migraciones en Supabase local cuando una tarea futura lo autorice.
- Revisar PRs que incluyan migraciones.
- Identificar riesgos de datos, compatibilidad, frontend y flujo clínico.
- Evitar cambios accidentales en `.env`, Supabase remoto y `main`.
- Preparar criterios especiales para BE-010 a BE-017.

Esta pauta aplica a migraciones que puedan afectar:

- Tablas.
- Columnas.
- Checks.
- Foreign keys.
- Índices.
- Triggers.
- Vistas SQL.
- RLS / policies.
- Funciones SQL.
- Relaciones entre backend, frontend y flujo clínico.

## Fuera de alcance

BE-003 no incluye:

- Crear migraciones.
- Modificar migraciones existentes.
- Ejecutar Supabase local.
- Ejecutar `supabase db push`.
- Tocar Supabase remoto.
- Modificar `.env`.
- Modificar código fuente.
- Modificar datos reales.
- Implementar lógica backend.
- Implementar UI visual.
- Cambiar decisiones clínicas.
- Hacer merge a `main`.

## Criterios previos a crear migraciones

Antes de crear cualquier migración futura, debe existir una justificación documental clara.

Toda migración debe nacer desde al menos uno de estos orígenes:

- Tarea backend aprobada.
- Decisión registrada en `docs/control/05_DECISIONES_PROYECTO.md`.
- Auditoría técnica integrada.
- Revisión de flujo clínico validada.
- Hallazgo aprobado por Control de Desarrollo.
- Requerimiento explícito de Javier.

La migración debe indicar:

- Código de tarea que la origina.
- Documento que la justifica.
- Módulo afectado.
- Tablas afectadas.
- Vistas afectadas.
- Triggers afectados.
- Policies afectadas.
- Funciones SQL afectadas.
- Relación con frontend actual.
- Relación con decisiones clínicas vigentes.
- Riesgos de datos.
- Riesgos de compatibilidad.
- Riesgos RLS.
- Riesgos para reportes.
- Plan de validación local.
- Plan de recuperación conceptual.

Ninguna migración debe crearse solo porque parece útil. Debe existir una razón trazable y aprobada.

Toda migración debe respetar especialmente:

- DEC-006: Revisiones y detalle viven dentro de la ficha del caso.
- DEC-007: `revision_hallazgos` registra hallazgos clínicamente relevantes derivados preferentemente de `revision_aspectos`.
- DEC-008: Hallazgos viven dentro del detalle de revisión.
- DEC-009: Un hallazgo se convierte en trabajo solo cuando corresponde.
- DEC-010: Separación entre trabajo, sesión y acción.
- DEC-011: Agenda como módulo mixto tipificado.
- DEC-012: Cobros por unidad cobrable.

## Estructura recomendada de migraciones

### Nombre de archivo sugerido

Formato recomendado:

```txt
YYYYMMDDHHMMSS_descripcion_clara_de_la_migracion.sql
```

Ejemplos futuros:

```txt
20260613090000_crear_tabla_agenda_eventos.sql
20260613091500_crear_vista_revisiones_con_hallazgos.sql
20260613093000_ajustar_reglas_cobros_unidad_cobrable.sql
20260613094500_crear_vista_finanzas_por_unidad_cobrable.sql
```

El nombre debe ser claro, específico, relacionado con una sola intención principal y sin abreviaturas ambiguas.

### Comentarios internos recomendados

Cada migración futura debería incluir comentarios breves al inicio:

```sql
-- Tarea origen: BE-012
-- Objetivo: Crear estructura base para agenda tipificada.
-- Decisiones relacionadas: DEC-011
-- Riesgos: nueva tabla operativa, requiere RLS y validación local.
-- Supabase remoto: prohibido usar db push salvo instrucción expresa.
```

No se requiere comentar cada línea, pero sí dejar claro el origen y el propósito.

### Orden seguro de cambios

Orden recomendado:

1. Crear extensiones si fueran necesarias y aprobadas.
2. Crear tablas nuevas.
3. Agregar columnas.
4. Crear checks simples.
5. Crear foreign keys.
6. Crear índices.
7. Crear funciones SQL auxiliares.
8. Crear triggers.
9. Crear vistas SQL.
10. Activar RLS.
11. Crear policies.
12. Agregar grants si corresponde.
13. Documentar validación esperada.

Cuando una vista depende de tablas nuevas, primero deben existir tablas y relaciones.

Cuando una policy depende de una función, primero debe existir la función.

Cuando un trigger depende de una función, primero debe existir la función.

### Uso de `create table if not exists`

Usar `create table if not exists` cuando se cree una tabla nueva y se quiera evitar fallo por existencia previa en entorno local.

Ejemplo:

```sql
create table if not exists public.agenda_eventos (
  id_agenda_evento uuid primary key default gen_random_uuid(),
  tipo_evento text not null,
  created_at timestamptz not null default now()
);
```

### Uso de `alter table`

Usar `alter table` para agregar columnas o constraints a tablas existentes.

Debe preferirse:

```sql
alter table public.cobros
  add column if not exists unidad_cobrable_tipo text;
```

Si se agrega una columna `not null`, se debe analizar si la tabla ya tiene datos. En tablas con datos, el orden seguro suele ser:

1. Agregar columna nullable.
2. Poblarla si corresponde.
3. Validar datos.
4. Convertir a `not null` solo si es seguro.

### Checks

Los checks deben usarse cuando la taxonomía esté suficientemente clara.

Si una lista clínica aún está en revisión, no conviene cerrar el check antes de validarla con Revisión de flujo clínico.

Checks recomendables:

- Estados controlados.
- Tipos de evento.
- Rangos porcentuales.
- Montos positivos.
- Fechas coherentes.
- Valores booleanos derivados no ambiguos.

Riesgo: checks demasiado rígidos pueden bloquear formularios si UI/UX no está sincronizado.

### Foreign keys

Toda foreign key debe revisar:

- Tabla origen.
- Tabla destino.
- Campo real.
- `on update`.
- `on delete`.
- Consistencia con flujo clínico.
- Riesgo de borrado accidental.
- Si corresponde `restrict`, `cascade` o `set null`.

Por defecto, para datos clínicos sensibles, preferir `on delete restrict` salvo que exista una razón documentada para cascade.

### Índices

Crear índices cuando:

- Una FK será consultada frecuentemente.
- Una vista necesita joins recurrentes.
- El frontend filtra por ese campo.
- Reportes usan ese campo.
- RLS o policies dependen de ese campo.

No crear índices innecesarios sin patrón de consulta claro.

### Triggers

Usar triggers para:

- `updated_at`.
- Validar consistencia relacional.
- Completar relaciones derivadas con cuidado.
- Evitar montos o pagos inválidos.
- Mantener estados calculados si no basta una vista.

Todo trigger debe tener:

- Función clara.
- Nombre claro.
- Evento específico.
- Campos específicos si corresponde.
- Error comprensible.

No usar triggers para esconder lógica clínica no aprobada.

### Policies

Toda policy debe declarar:

- Rol permitido.
- Operación permitida: select, insert, update, delete.
- Condición `using`.
- Condición `with check`.
- Impacto en frontend.
- Impacto en reportes.

No asumir que `admin`, `terapeuta` y `finanzas` necesitan ver lo mismo.

### Cuándo separar una migración grande

Separar migraciones cuando:

- Se crean varias tablas con responsabilidades distintas.
- Se mezclan tablas y vistas complejas.
- Se agregan RLS/policies extensas.
- Se cambian reglas clínicas.
- Se toca finanzas y clínica en el mismo archivo.
- Hay alto riesgo de rollback conceptual.
- Control de Desarrollo necesita revisar por etapas.

Ejemplo de separación recomendada para Agenda:

1. Crear tabla `agenda_eventos`.
2. Crear vista `vista_agenda_operativa`.
3. Agregar RLS/policies.
4. Conectar frontend en tarea posterior.

## Checklist previo a ejecución local

Antes de ejecutar una migración en local:

- Confirmar que la rama actual no es `main`.
- Confirmar que la rama corresponde a la tarea aprobada.
- Confirmar que `git status` no muestra cambios accidentales.
- Confirmar que `.env` no fue tocado.
- Confirmar que Supabase remoto no está involucrado.
- Confirmar que no se usará `supabase db push`.
- Confirmar que la migración es nueva y no modifica una histórica.
- Confirmar que el nombre de archivo es correcto.
- Confirmar que la migración tiene origen documental.
- Confirmar dependencias con migraciones anteriores.
- Confirmar que las decisiones clínicas relacionadas están registradas.
- Confirmar si UI/UX debe revisar formularios afectados.
- Confirmar si Revisión de flujo clínico debe validar taxonomía o flujo.
- Confirmar si Control de Desarrollo aprobó el alcance.
- Confirmar si se requiere respaldo o reset local.
- Confirmar que no hay datos reales involucrados.
- Confirmar que la migración no contiene credenciales ni URLs sensibles.
- Confirmar que no se agregaron archivos fuera de alcance.

Comandos permitidos solo si la tarea futura lo autoriza explícitamente:

```bash
git status --short
git branch --show-current
npm run build
```

Comandos de Supabase local solo si la tarea futura lo autoriza explícitamente:

```bash
supabase db reset
supabase migration list
```

Comando prohibido salvo instrucción expresa futura de Javier:

```bash
supabase db push
```

## Checklist posterior a ejecución local

Después de ejecutar una migración en local, validar:

- La migración se aplicó sin errores.
- Las tablas esperadas existen.
- Las columnas esperadas existen.
- Los tipos de datos son correctos.
- Los defaults son correctos.
- Los checks existen y funcionan.
- Las foreign keys apuntan a las tablas correctas.
- Los índices fueron creados.
- Los triggers existen.
- Las funciones SQL existen.
- Las vistas SQL devuelven columnas esperadas.
- RLS está habilitado cuando corresponde.
- Las policies existen y aplican al rol correcto.
- Los grants son coherentes.
- Los inserts mínimos funcionan.
- Los selects mínimos funcionan.
- Los updates mínimos funcionan, si corresponde.
- Las operaciones no permitidas fallan correctamente.
- Las validaciones entregan errores comprensibles.
- El frontend no queda desalineado.
- Si hubo cambios de tipos o código futuro, ejecutar `npm run build`.
- Confirmar que `.env` sigue intacto.
- Confirmar que no se tocó Supabase remoto.
- Confirmar que no se usó `supabase db push`.
- Confirmar que no se modificaron datos reales.
- Confirmar `git diff` antes de commit.
- Registrar resultados en el informe o PR.

## Reglas de seguridad obligatorias

1. Prohibido tocar `.env`.
2. Prohibido ejecutar `supabase db push` salvo instrucción expresa futura de Javier.
3. Prohibido tocar Supabase remoto.
4. Prohibido modificar datos reales.
5. Prohibido hacer merge a `main` sin autorización expresa.
6. Prohibido modificar migraciones históricas salvo caso excepcional aprobado.
7. Prohibido crear migraciones sin tarea aprobada.
8. Prohibido implementar UI visual dentro de tareas de migración.
9. Prohibido cambiar decisiones clínicas desde backend.
10. Prohibido inventar decisiones clínicas.
11. Prohibido mezclar cambios no relacionados en una misma migración.
12. Prohibido abrir PR listo para merge; si se abre, debe quedar draft.
13. Toda migración debe tener plan de recuperación conceptual.
14. Toda migración debe poder ser revisada por Control de Desarrollo.
15. Si toca flujo clínico, debe pasar por Revisión de flujo clínico.
16. Si afecta formularios, debe coordinarse con UI/UX.
17. Si afecta finanzas, debe respetar DEC-012.
18. Si afecta agenda, debe respetar DEC-011.
19. Si afecta hallazgos, debe respetar DEC-007 y DEC-008.
20. Si afecta trabajos, debe respetar DEC-009 y DEC-010.

## Criterios para PRs con migraciones

Un PR con migraciones debe quedar en draft hasta revisión.

Debe incluir:

- Tarea origen.
- Decisión relacionada.
- Resumen de migraciones.
- Archivos modificados.
- Tablas afectadas.
- Vistas afectadas.
- Triggers afectados.
- Policies afectadas.
- Riesgos declarados.
- Validaciones locales realizadas.
- Confirmación de no tocar `.env`.
- Confirmación de no usar `supabase db push`.
- Confirmación de no tocar Supabase remoto.
- Confirmación de no modificar datos reales.
- Confirmación de no cambiar decisiones clínicas.
- Confirmación de no tocar `main`.

Archivos esperados en PR de migración:

- Nueva migración en `supabase/migrations/`.
- Documentación asociada en `docs/control/`, si corresponde.
- Código frontend/backend solo si la tarea lo autoriza expresamente.
- Tipos o servicios solo si la tarea lo autoriza expresamente.

Archivos sospechosos en PR de migración:

- `.env`
- Archivos de credenciales.
- Migraciones históricas modificadas.
- Cambios visuales no relacionados.
- Cambios masivos de formato.
- Cambios en `main`.
- Datos exportados.
- Dumps de base de datos.
- Archivos generados innecesarios.

Criterios de aprobación:

- La migración responde a una tarea aprobada.
- El alcance es claro.
- No hay cambios accidentales.
- Las restricciones fueron respetadas.
- El SQL es legible.
- La migración es coherente con BE-001 y BE-002.
- La migración respeta DEC-006 a DEC-012.
- La validación local está documentada.
- Control de Desarrollo revisó.
- Revisión de flujo clínico revisó si toca reglas clínicas.
- UI/UX revisó si afecta formularios o experiencia.
- No queda bloqueo conocido sin declarar.

## Criterios por tipo de cambio

### Tablas nuevas

Crear tabla nueva solo si:

- Existe tarea aprobada.
- La entidad no puede representarse correctamente con tablas existentes.
- La responsabilidad de la tabla es clara.
- Su relación con flujo clínico está definida.
- Tiene primary key.
- Tiene timestamps si corresponde.
- Tiene foreign keys necesarias.
- Tiene índices mínimos.
- Tiene RLS previsto.
- Tiene plan de UI o consumo futuro.
- Tiene documentación del motivo.

Evitar tablas nuevas para resolver dudas clínicas no definidas.

### Columnas nuevas

Agregar columna nueva solo si:

- El dato tiene dueño funcional claro.
- No duplica un campo existente.
- No mezcla responsabilidades.
- Tiene tipo correcto.
- Tiene default si corresponde.
- Tiene nullable/not null justificado.
- No rompe registros existentes.
- No rompe formularios actuales.
- No rompe vistas actuales.
- No rompe reportes actuales.
- Tiene validación si corresponde.

Si la columna representa una decisión clínica nueva, primero debe pasar por Control de Desarrollo y Revisión de flujo clínico.

### Checks

Usar checks cuando:

- La lista de valores está aprobada.
- El rango es estable.
- La validación protege integridad real.
- UI/UX puede mostrar opciones coherentes.
- El error será comprensible.

Evitar checks cuando:

- La taxonomía está en discusión.
- El valor depende de criterio clínico no validado.
- UI aún no está alineada.
- Puede bloquear captura de información legítima.

### Foreign keys

Toda FK debe validar:

- Relación real entre entidades.
- Flujo clínico correcto.
- Riesgo de borrar datos.
- Necesidad de `restrict`, `cascade` o `set null`.
- Consistencia con triggers existentes.
- Índice asociado si habrá consultas frecuentes.

Para datos clínicos, usar `restrict` como opción segura por defecto salvo justificación.

### Índices

Crear índices cuando:

- Hay filtros frecuentes.
- Hay joins en vistas.
- Hay foreign keys consultadas.
- Hay reportes que agrupan por campo.
- Hay policies que dependen del campo.

Evitar índices excesivos porque aumentan costo de escritura y mantenimiento.

### Triggers

Usar triggers para integridad que no pueda resolverse con FK/check simple.

Cada trigger debe:

- Tener nombre claro.
- Tener función clara.
- Ejecutarse en el momento correcto.
- Evitar efectos secundarios ocultos.
- Entregar errores comprensibles.
- Ser probado con insert/update mínimo.

No usar triggers para decisiones clínicas no aprobadas.

### Vistas SQL

Crear vistas cuando:

- Hay consultas repetidas complejas.
- Reportes necesitan agregados confiables.
- El frontend no debería reconstruir relaciones manualmente.
- Se requiere una lectura consolidada.
- RLS debe centralizar lectura segura.
- Se necesita trazabilidad clara.

Para vistas futuras considerar:

- `vista_caso_clinico_completo`
- `vista_revisiones_con_hallazgos`
- `vista_trabajos_con_origen`
- `vista_agenda_operativa`
- `vista_finanzas_por_unidad_cobrable`

Toda vista debe declarar columnas esperadas y rol de consumo.

### RLS / policies

Toda tabla nueva debe tener análisis RLS.

Roles actuales:

- `admin`
- `terapeuta`
- `finanzas`

Reglas iniciales:

- Clínica: `admin` y `terapeuta`.
- Finanzas: `admin` y `finanzas`.
- Reportes mixtos: requieren evaluación especial.
- Agenda: requiere definición según tipo de evento.
- Vistas: revisar `security_invoker` si corresponde.

No crear policies amplias sin validación.

No dar acceso financiero a terapeuta ni acceso clínico a finanzas salvo decisión explícita.

### Funciones SQL

Crear funciones SQL solo si:

- Reducen duplicación.
- Mejoran validación.
- Centralizan lógica de seguridad.
- Son necesarias para triggers o policies.
- Tienen propósito acotado.
- No esconden reglas clínicas no aprobadas.

Toda función debe revisar:

- `security definer` o `security invoker`.
- `search_path`.
- Grants.
- Riesgo de acceso indebido.
- Pruebas mínimas.

## Riesgos principales

1. Ejecutar `supabase db push` por error.
2. Tocar `.env`.
3. Afectar Supabase remoto.
4. Modificar migraciones históricas.
5. Crear migraciones sin decisión aprobada.
6. Crear tablas que dupliquen responsabilidades.
7. Agregar checks demasiado rígidos.
8. Romper formularios actuales.
9. Romper vistas existentes.
10. Generar reportes parciales por RLS.
11. Permitir cobros duplicados.
12. Crear hallazgos sin contexto clínico suficiente.
13. Crear trabajos sin trazabilidad a hallazgos o caso.
14. Diseñar agenda sin tipo obligatorio.
15. Mezclar reglas clínicas dentro de triggers sin aprobación.
16. Abrir PR listo para merge sin revisión.
17. Hacer merge a `main` sin autorización.
18. No documentar pruebas locales.
19. No validar roles.
20. Confundir datos locales con datos reales.

## Recomendaciones

1. Mantener BE-003 como pauta obligatoria antes de BE-010 a BE-017.
2. Crear migraciones pequeñas y revisables.
3. Separar diseño documental de implementación SQL.
4. No modificar migraciones históricas.
5. Usar PR draft para cualquier migración.
6. Mantener una sección de validación local en cada PR.
7. Pedir revisión de Control de Desarrollo antes de ejecutar cambios sensibles.
8. Pedir revisión clínica cuando el cambio toque taxonomía, hallazgos, trabajos, agenda o cobros por paquete.
9. Pedir revisión UI/UX cuando el cambio afecte formularios o experiencia.
10. Mantener `main` como rama estable.
11. No usar Supabase remoto durante desarrollo local.
12. No ejecutar `supabase db push` salvo instrucción expresa futura de Javier.
13. Registrar toda decisión nueva antes de implementarla.
14. Documentar toda brecha no resuelta.
15. Validar RLS antes de confiar en reportes mixtos.

## Criterios especiales para futuras tareas

### BE-010 — Hallazgos operativos

Cualquier migración futura debe:

- Mantener hallazgos dentro del detalle de revisión.
- Respetar que `revision_hallazgos` nace desde `revision_aspectos`.
- No crear módulo principal independiente de creación.
- Mantener trazabilidad hacia paciente, caso, revisión, elemento y aspecto.
- Revisar RLS para `admin` y `terapeuta`.
- Coordinar con UI/UX si se agregan formularios.

### BE-011 — Hallazgo → trabajo

Cualquier migración futura debe:

- Respetar DEC-009.
- No crear trabajo automáticamente por cada hallazgo.
- Distinguir hallazgo origen principal de hallazgos asociados.
- Evaluar si se requiere tabla puente `trabajo_hallazgos`.
- Mantener compatibilidad con `trabajos.revision_hallazgo_origen_id`.
- Validar si `trabajo_elementos.revision_hallazgo_id` es suficiente.

### BE-012 — Agenda tipificada

Cualquier migración futura debe:

- Respetar DEC-011.
- Incluir `tipo_evento` obligatorio.
- Permitir eventos manuales y/o derivados.
- Evaluar relaciones opcionales con paciente, consulta, evaluación, caso, revisión, trabajo y sesión.
- Definir RLS según tipo de evento.
- No implementar UI antes de definir backend.

### BE-013 — Cobros por unidad cobrable

Cualquier migración futura debe:

- Respetar DEC-012.
- Evitar duplicidad de prestación.
- Mantener pagos aplicados a cobros.
- Separar cobro por consulta, evaluación, revisión, trabajo o paquete de caso.
- Definir si la validación será SQL, aplicación o mixta.
- Coordinar con UI/UX si afecta formularios financieros.

### BE-014 — Vistas clínicas agregadas

Cualquier migración futura debe:

- No reemplazar tablas base.
- Usar vistas para lectura consolidada.
- Revisar impacto RLS.
- Declarar columnas esperadas.
- Evitar exponer datos financieros a roles clínicos si no corresponde.
- Mantener compatibilidad con reportes.

### BE-015 — RLS

Cualquier migración futura debe:

- Definir matriz por rol.
- Probar `admin`, `terapeuta` y `finanzas`.
- Revisar tablas clínicas, financieras y mixtas.
- Revisar vistas con `security_invoker` si corresponde.
- Evitar policies demasiado amplias.
- Documentar resultados runtime local.

### BE-016 — Vista financiera por unidad cobrable

Cualquier migración futura debe:

- No reemplazar `vista_cobros_estado` sin análisis.
- Clasificar unidad cobrable.
- Mantener `pagos` ligados a `cobros`.
- Mostrar consulta, evaluación, revisión, trabajo o caso según corresponda.
- Respetar RLS financiero.
- Evaluar reportes por rol.

### BE-017 — Agenda operativa

Cualquier migración futura debe:

- Depender de BE-012.
- Definir si `vista_agenda_operativa` mezcla eventos manuales y derivados.
- Mantener `tipo_evento` obligatorio.
- Separar origen manual de origen derivado.
- Evitar duplicidad entre eventos reales y vistas.
- Validar lectura por rol.

## Tareas sugeridas posteriores

Las siguientes tareas quedan solo como sugeridas; no se registran como activas todavía:

### BE-018 — Crear plantilla de PR para migraciones

- Definir checklist estándar para PRs con migraciones.
- Incluir restricciones, validación local, RLS, rollback conceptual y revisión por chat responsable.

### BE-019 — Crear matriz de validación local para migraciones

- Definir comandos permitidos.
- Definir pruebas mínimas por tipo de cambio.
- Definir evidencias que deben quedar en PR.

### BE-020 — Crear pauta de rollback conceptual

- Definir cómo documentar recuperación para tablas, columnas, vistas, triggers, policies y funciones.
- No implementar rollback automático sin decisión previa.

### BE-021 — Crear checklist RLS para tablas nuevas

- Definir permisos esperados por rol.
- Definir pruebas mínimas por `admin`, `terapeuta` y `finanzas`.

## Conclusión

BE-003 queda aprobada con observaciones como pauta técnica documental para futuras migraciones. No implementa cambios, no crea migraciones y no modifica código fuente.

La pauta protege el proyecto frente a errores críticos como tocar `.env`, usar `supabase db push`, afectar Supabase remoto, modificar migraciones históricas o romper `main`.

BE-003 habilita planificar BE-010 a BE-017 bajo un marco seguro, revisable y alineado con el flujo clínico aprobado.
