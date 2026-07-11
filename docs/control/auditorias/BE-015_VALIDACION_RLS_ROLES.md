# BE-015 - Validacion RLS runtime por rol (admin/terapeuta/finanzas)

**Fecha:** 2026-07-11
**Rama:** `docs/be-015-validacion-rls-roles`
**Responsable:** Control de desarrollo (Claude) — 5 agentes de verificacion en paralelo, uno
por area, coordinados via Workflow
**Origen:** BE-015 (`01_PENDIENTES_PROYECTO.md`), pendiente desde 2026-06-12
**Alcance:** hallazgos, trabajos, agenda, cobros/pagos, reportes — perfiles `admin`,
`terapeuta` (activo e inactivo) y `finanzas`, mas `anon` como caso negativo universal.

## Metodologia

Regla del proyecto (documentada en el skill `verificar-rls`, originada por 2 bugs reales:
ver DEC-042 y FASE1-BARRIDO-2026-07-08): **leer el SQL no alcanza; el service role bypasea
RLS**. Cada verificacion se hizo simulando el rol real:

```sql
begin;
set local request.jwt.claims = '{"sub":"<uuid-usuario-demo>","role":"authenticated"}';
set local role authenticated; -- o "set local role anon;" sin claims
-- SELECT/INSERT/UPDATE/DELETE bajo prueba
rollback; -- siempre rollback, nunca se dejo una fila de prueba
```

Usuarios demo SEC-007B ya provisionados (UUID reales usados en las pruebas):

| Rol | UUID | Activo |
|---|---|---|
| admin | `6875c866-2a25-4a99-9e90-33928873dec4` | si |
| finanzas | `6b088bfe-49da-4559-b361-f4495fe0a588` | si |
| terapeuta | `9a3eaf6c-69eb-4864-b75e-dcc804728114` | si |
| terapeuta (inactivo) | `63c29341-5e01-4139-a389-e69b76a556d9` | no |

Para cada tabla/vista del area se probaron, cuando aplicaba: chequeos estructurales
(`relrowsecurity`, `role_table_grants`, `pg_policy`, `security_invoker`), y runtime
SELECT/INSERT/UPDATE/DELETE con los 5 perfiles (positivo para el rol correcto, negativo para
el resto). Total: **210 verificaciones individuales** sobre 26 tablas/vistas.

## Resultado por area

- **hallazgos** (`revisiones`, `revision_hallazgos`, `revision_aspectos`,
  `revision_elementos`): sin hallazgos. admin/terapeuta leen y escriben todo (sin ownership
  por terapeuta individual — BE-031 sigue pendiente); finanzas, terapeuta inactivo y anon
  bloqueados en las 4 tablas para SELECT/INSERT/UPDATE. Las 3 tablas de detalle no tienen
  DELETE para ningun rol (anulacion logica via `estado_*`, diseno intencional).
- **trabajos** (`trabajos`, `trabajo_sesiones`, `trabajo_acciones`, `trabajo_elementos`): 1
  hallazgo de severidad baja (mensaje de error enganoso).
- **agenda** (`agenda_eventos`, `solicitudes_agenda`, `resumenes_agenda_semanal`): sin
  hallazgos. Confirma que el filtrado de UI-023 (finanzas sin Agenda) tambien esta blindado
  en el backend, no solo en el sidebar.
- **cobros-pagos** (`cobros`, `pagos`, `vista_cobros_estado`,
  `vista_finanzas_unidades_cobrables`, `pacientes_identidad_financiera`): **3 hallazgos**,
  incluido el unico critico de esta auditoria.
- **reportes** (`vista_actividad_clinica_reciente`, `vista_carga_trabajo_terapeutica`,
  `vista_riesgo_abandono_casos`, `vista_resumen_evolutivo_caso`,
  `vista_finanzas_fotos_auditoria`, `vista_objetos_storage_huerfanos`,
  `vista_fotos_metadatos_sin_objeto`): 4 hallazgos.

## Hallazgos (9), de mayor a menor severidad

### 1. CRITICA — `pacientes_identidad_financiera` tiene GRANT TRUNCATE para cualquier usuario autenticado

El grant a `authenticated` es un `GRANT ALL` (incluye `TRUNCATE`, `REFERENCES`, `TRIGGER`),
no el patron granular (`SELECT`/`INSERT`/`UPDATE`/`DELETE`) usado en `cobros`/`pagos`.
**`TRUNCATE` no esta cubierto por RLS** — confirmado en runtime: un **terapeuta activo**
(que ni siquiera tiene policy `SELECT` sobre esta tabla, solo `es_admin()`) ejecuto
`TRUNCATE TABLE pacientes_identidad_financiera` con exito dentro de una transaccion
(verificado con `count(*)=0` antes del `rollback`, y `count(*)=2` despues, confirmando que no
se perdio nada real). Contraste de control: el mismo terapeuta recibe
`permission denied for table cobros` al intentar lo mismo sobre `cobros`, porque ese grant
si es granular — confirma que el problema es especifico de esta tabla.

**Impacto:** cualquier usuario autenticado (cualquier rol, incluido uno recien creado y sin
actividad) puede destruir de forma irreversible toda la identidad financiera de pacientes.
En local es solo perdida de datos ficticios; en produccion seria una perdida de datos
sensibles irreversible sin necesidad de bypassear ninguna policy.

**Accion propuesta:** `SEC-012` (nueva, Nivel 3 — requiere DEC antes de tocar el grant).

### 2. ALTA — `finanzas` no puede crear cobros vinculados a un origen clinico

`cobros` tiene una policy `INSERT` valida para `finanzas` (`cobros_insert_finanzas`), pero el
trigger `validar_cobro_relaciones()` (que corre `SECURITY INVOKER`, no `SECURITY DEFINER`)
hace `SELECT` sobre `casos`/`consultas`/`evaluaciones`/`revisiones`/`trabajos` para validar el
FK de origen — y esas 5 tablas restringen `SELECT` a `es_terapeuta_o_admin()`, que excluye a
`finanzas`. Como `chk_cobro_origen_valido` exige que el cobro apunte a una de esas entidades,
**todo INSERT de finanzas con un origen clinico falla** con un mensaje enganoso
("El caso indicado no existe") cuando el caso existe y es visible para el terapeuta/admin que
lo creo. Confirmado con `caso_id` y `consulta_id`; por simetria del trigger aplica igual a
`evaluacion_id`/`revision_id`/`trabajo_id`.

**Impacto:** rompe la funcion central del modulo Finanzas para su usuario principal. Este
bug **bloquearia UI-040** ("Finanzas: flujo de creacion de cobros y registro de pagos desde
UI") en el momento en que se implemente esa UI, si no se corrige antes.

**Accion propuesta:** `BE-032` (nueva, Nivel 3 — el trigger de validacion necesita una
funcion `security definer` acotada, patron ya usado en `caso_tiene_cobro_vencido`).

### 3. ALTA — `vista_finanzas_fotos_auditoria` nunca devuelve filas para `finanzas`

Esta vista existe explicitamente para que Finanzas audite fotos asociadas a cobros (segun el
comentario de su propia migracion). Al corregirse un bypass de RLS agregandole
`security_invoker = true` (migracion `20260709000000`), el `LEFT JOIN` interno a
`fotos_elementos_caso` quedo sujeto a la RLS de esa tabla, cuya unica policy `SELECT` es
`es_terapeuta_o_admin()` — sin incluir a `finanzas`. Postgres filtra en silencio el lado del
join para ese rol: **0 filas**, aunque existan fotos reales asociadas a cobros. Se corrigio
un bug de seguridad introduciendo uno funcional.

**Accion propuesta:** agrupada en `BE-033` (nueva, Nivel 3).

### 4. MEDIA — `pacientes_identidad_financiera` no tiene policy para `finanzas`

La unica policy es `es_admin()`. Efecto concreto: en `vista_finanzas_unidades_cobrables`
(que si tiene `security_invoker=true` correcto), `finanzas` ve el cobro pero
`codigo_paciente`/`alias_administrativo_paciente` llegan en blanco — mientras `admin` ve los
valores reales para la misma fila. No es fuga de datos (es sub-restriccion), pero rompe la
utilidad del propio insumo de `FinanzasPage` para su usuario principal.

**Accion propuesta:** agrupada en `BE-033`.

### 5. MEDIA — `vista_resumen_evolutivo_caso` muestra `total_cobros=0` a terapeuta cuando el caso SI tiene cobros

La vista (`security_invoker=true`, sin filtro propio) hace `LEFT JOIN` directo a `cobros`,
cuya unica policy `SELECT` es `es_finanzas_o_admin()` — terapeuta no cumple. El resultado no
es "oculto"/`NULL` sino **0**, indistinguible de "este caso no tiene cobros". Un
terapeuta/admin usando este reporte podria concluir erroneamente que un caso no tiene cargos
asociados. `vista_riesgo_abandono_casos` ya resuelve el mismo problema con una funcion
`security definer` acotada (`caso_tiene_cobro_vencido`); esta vista no aplica ese patron para
`total_cobros`.

**Accion propuesta:** agrupada en `BE-033`.

### 6. BAJA — `vista_cobros_estado` no lleva `security_invoker = true`

A diferencia de `vista_finanzas_unidades_cobrables`, corre como el owner (`postgres`) y
depende de un filtro manual `WHERE es_finanzas_o_admin()` escrito en la vista. Hoy el
resultado en runtime es correcto, pero diverge de la convencion explicita del proyecto para
vistas nuevas y quedaria desincronizada si la policy real de `cobros`/`pagos` cambia sin
actualizar el filtro manual.

**Accion propuesta:** agrupada en `BE-033`.

### 7. BAJA — mensajes de error enganosos en triggers de validacion cruzada (trabajos y familia)

Al intentar INSERT en `trabajos`/`trabajo_sesiones`/`trabajo_acciones`/`trabajo_elementos`
desde un rol sin acceso clinico (finanzas, terapeuta inactivo), el bloqueo es correcto pero
el mensaje es "El caso indicado no existe" en vez de reflejar que la causa real es RLS (el
trigger `validar_trabajo_relaciones()` no es `security definer` y hereda la RLS de `casos`).
Mismo mecanismo que el hallazgo #2, pero aqui el bloqueo SI es el comportamiento deseado (no
rompe funcionalidad legitima) — solo puede confundir debugging futuro.

**Accion propuesta:** nota tecnica dentro de `BE-032` (mismo mecanismo raiz), sin urgencia de
fix propio.

### 8-9. BAJA — alcance amplio (documentado, a confirmar) en 2 vistas de auditoria de storage

`vista_objetos_storage_huerfanos` y `vista_fotos_metadatos_sin_objeto` permiten a cualquier
**terapeuta activo** ver `storage_path`/metadatos de fotos de **todos** los pacientes de la
clinica (no solo los propios casos) — documentado intencionalmente en el comentario de la
migracion `20260708000003`. No es un bug de codigo, pero contrasta con
`vista_carga_trabajo_terapeutica`, que si se restringio a `es_admin()` explicito tras notar
un riesgo similar. Vale la pena que Javier confirme si ese alcance amplio es el deseado para
vistas de diagnostico tecnico o si deberian acotarse a `admin` como las demas vistas de
auditoria sensible.

**Accion propuesta:** nota en `BE-033`, sin fix hasta confirmar con Javier.

## Sin hallazgos (confirmado explicitamente, no solo ausencia de prueba)

- `hallazgos` y `agenda`: 0 hallazgos en 210 verificaciones combinadas para esas 2 areas.
- El gate principal de `cobros`/`pagos` (quien puede leer/escribir) funciona: admin y
  finanzas ven/operan, terapeuta (activo e inactivo) y anon quedan bloqueados en todos los
  casos probados.
- El filtrado de Agenda por rol (UI-023: finanzas sin Agenda) esta blindado tambien en el
  backend, no solo en el frontend/sidebar.
- `rol_usuario_actual()` excluye correctamente a usuarios `activo=false` en todas las areas
  probadas (terapeuta inactivo se comporta igual que un rol sin permisos en absolutamente
  todos los casos).

## Restricciones respetadas

- Solo lectura/simulacion; todas las pruebas de escritura usaron `begin`/`rollback`, nunca
  `commit`. Conteos de filas verificados iguales antes/despues en cada tabla.
- Sin cambios de codigo, RLS, grants, triggers, ni datos.
- Sin Supabase remoto, sin produccion.
- No se creo ningun usuario nuevo: se reutilizaron los usuarios demo SEC-007B ya
  provisionados en esta sesion.

## Siguiente paso

Los 2 hallazgos de severidad alta/critica (`SEC-012`, `BE-032`) requieren decision `DEC-0xx`
antes de implementarse (Nivel 3: tocan RLS/grants/triggers de seguridad). Quedan registrados
como pendientes nuevos en `01_PENDIENTES_PROYECTO.md`, sin codigo escrito en este PR.
