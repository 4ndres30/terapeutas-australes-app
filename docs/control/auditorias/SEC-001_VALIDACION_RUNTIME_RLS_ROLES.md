# SEC-001 - Validacion runtime RLS / roles

## Estado general

**Aprobado con observaciones.**

La validacion runtime local confirma que RLS bloquea y permite acceso por rol segun la matriz funcional esperada para `admin`, `terapeuta` y `finanzas`, incluyendo `public.fotos_elementos_caso` y el bucket privado `elementos-caso`.

No obstante, antes de datos reales quedan observaciones de hardening, auditoria, vistas financieras minimas, reportes por rol y anulacion logica. Esta aprobacion no habilita uso productivo ni carga de datos reales.

## Alcance

- Supabase local.
- Datos ficticios insertados dentro de transacciones con `ROLLBACK`.
- Sin imagenes reales.
- Sin datos reales.
- Sin tocar `.env`.
- Sin `supabase db push`.
- Sin tocar Supabase remoto.
- Sin modificar codigo fuente.
- Sin modificar migraciones.

## Preparacion ejecutada

| Comando | Resultado |
|---|---|
| `git switch main` | OK, ya estaba en `main`. |
| `git pull origin main` | OK, `Already up to date`. |
| `git status --short --branch` | OK, `main...origin/main` limpio al inicio. |
| `npm run lint` | OK. |
| `npm run build` | OK, con warning de Vite por chunk mayor a 500 kB. |
| `npx supabase migration list --local` | OK. Migracion `20260619183000` aplicada localmente. |

No se ejecuto `supabase db push`.

## Migracion de fotos

Confirmada como aplicada en Supabase local:

`20260619183000_crear_fotos_elementos_caso.sql`

Esta migracion crea:

- bucket privado `elementos-caso`;
- tabla `public.fotos_elementos_caso`;
- RLS para `fotos_elementos_caso`;
- policies de `select`, `insert`, `update` sobre `fotos_elementos_caso`;
- policies de `select`, `insert`, `update` sobre `storage.objects` para bucket `elementos-caso`;
- sin policy de `delete`.

## Roles inventariados

La constraint actual de `public.usuarios_internos.rol` acepta:

- `admin`
- `terapeuta`
- `finanzas`

En Supabase local existen registros demo/locales para los tres roles. No se usaron datos reales.

## Helper functions revisadas

| Helper | Resultado |
|---|---|
| `rol_usuario_actual()` | Devuelve el rol activo desde `usuarios_internos` usando `auth.uid()`. |
| `usuario_interno_activo()` | Devuelve `true` solo si existe usuario interno activo. |
| `es_admin()` | `true` solo para `admin`. |
| `es_terapeuta_o_admin()` | `true` para `admin` y `terapeuta`. |
| `es_finanzas_o_admin()` | `true` para `admin` y `finanzas`. |

Runtime simulado con JWT local:

| Rol simulado | rol_usuario_actual | usuario activo | es_admin | es_terapeuta_o_admin | es_finanzas_o_admin |
|---|---|---:|---:|---:|---:|
| admin | admin | true | true | true | true |
| terapeuta | terapeuta | true | false | true | false |
| finanzas | finanzas | true | false | false | true |

## Matriz real de permisos observada

Leyenda:

- `R/U/I`: lectura, actualizacion e insercion representativa permitidas.
- `R/U`: lectura y actualizacion permitidas.
- `-`: bloqueado por RLS o trigger.
- `D-`: delete fisico no permitido.

| Tabla / recurso | Admin | Terapeuta | Finanzas | Observacion |
|---|---|---|---|---|
| `pacientes` | R/U | R/U | - | Finanzas no ve ficha ni nombres de paciente por tabla directa. |
| `consultas` | R/U | R/U | - | Finanzas bloqueado. |
| `evaluaciones` | R/U | R/U | - | Finanzas bloqueado. |
| `casos` | R/U | R/U | - | Finanzas bloqueado en tabla clinica. |
| `elementos_caso` | R/U/I | R/U/I | - | Finanzas bloqueado. |
| `revisiones` | R/U | R/U | - | Finanzas bloqueado. |
| `revision_elementos` | R/U | R/U | - | Finanzas bloqueado. |
| `revision_aspectos` | R/U | R/U | - | Finanzas bloqueado. |
| `revision_hallazgos` | R/U | R/U | - | Finanzas bloqueado. |
| `trabajos` | R/U | R/U | - | Finanzas bloqueado en tabla clinica. |
| `trabajo_elementos` | R/U | R/U | - | Finanzas bloqueado. |
| `trabajo_sesiones` | R/U | R/U | - | Finanzas bloqueado. |
| `trabajo_acciones` | R/U | R/U | - | Finanzas bloqueado. |
| `fotos_elementos_caso` | R/U/I, D- | R/U/I, D- | -, D- | Finanzas no ve metadatos ni `storage_path`. |
| `cobros` | R/U/I | - | R/U/I | Terapeuta bloqueado. |
| `pagos` | R/U/I | - | R/U/I | Terapeuta bloqueado. |
| `vista_cobros_estado` | R | - | R | `security_invoker=true`; expone IDs de unidades clinicas vinculadas. |
| `storage.objects` bucket `elementos-caso` | R/U/I, D- | R/U/I, D- | -, D- | Delete directo bloqueado por `storage.protect_delete()`. |

## Diferencias esperado vs observado

No se detectaron diferencias funcionales de RLS para `select`, `update`, inserts representativos ni acceso a Storage dentro del alcance probado.

Observaciones no bloqueantes pero relevantes antes de datos reales:

| Area | Esperado | Observado | Evaluacion |
|---|---|---|---|
| Finanzas y tablas clinicas | Bloqueado | Bloqueado | Cumple. |
| Finanzas y fotos | Bloqueado | Bloqueado en tabla y Storage | Cumple. |
| Terapeuta y finanzas | Bloqueado | Bloqueado en `cobros`, `pagos` y vista financiera | Cumple. |
| Admin | Acceso transversal controlado | Accede a clinica, finanzas, fotos y Storage | Cumple. |
| Delete fisico fotos | No permitido | `fotos_elementos_caso` borra 0 filas; no hay policy delete | Cumple por RLS. |
| Delete fisico Storage | No permitido | `storage.protect_delete()` bloquea delete directo | Cumple. |
| Datos minimos Finanzas | Debe evitar clinica sensible | RLS bloquea clinica, pero `cobros` y `vista_cobros_estado` exponen IDs de origen clinico | Observacion para BE-016/SEC hardening. |
| Grants amplios | Controlados por RLS | `fotos_elementos_caso` conserva grants amplios a `anon` y `authenticated`; Storage tambien tiene grants amplios propios | Riesgo de hardening, no ruptura runtime por RLS. |

## Pruebas runtime realizadas

Se ejecuto una matriz local en PostgreSQL/Supabase con:

- usuarios ficticios `admin`, `terapeuta`, `finanzas`;
- registros ficticios en todas las tablas clinicas/financieras requeridas;
- metadato ficticio de foto en `public.fotos_elementos_caso`;
- objeto ficticio en `storage.objects`;
- `SET LOCAL ROLE authenticated`;
- claims locales por rol con `request.jwt.claims`;
- `ROLLBACK` final.

Operaciones validadas:

- `select` por tabla/recurso;
- `update` por tabla/recurso;
- `insert` representativo en `elementos_caso`, `fotos_elementos_caso`, `cobros`, `pagos`, `storage.objects`;
- `delete` fisico en `fotos_elementos_caso` y `storage.objects`;
- `vista_cobros_estado` con `security_invoker=true`.

## Tablas validadas

Clinicas:

- `pacientes`
- `consultas`
- `evaluaciones`
- `casos`
- `elementos_caso`
- `revisiones`
- `revision_elementos`
- `revision_aspectos`
- `revision_hallazgos`
- `trabajos`
- `trabajo_elementos`
- `trabajo_sesiones`
- `trabajo_acciones`
- `fotos_elementos_caso`

Financieras:

- `cobros`
- `pagos`
- `vista_cobros_estado`

Control de usuarios:

- `usuarios_internos`

Storage:

- `storage.buckets`
- `storage.objects`
- bucket `elementos-caso`

## Storage validado

Bucket `elementos-caso`:

- `public = false`
- `file_size_limit = 5242880`
- `allowed_mime_types = image/jpeg, image/png, image/webp`

Policies sobre `storage.objects`:

- `storage_elementos_caso_select_clinica`: `admin` y `terapeuta`.
- `storage_elementos_caso_insert_clinica`: `admin` y `terapeuta`.
- `storage_elementos_caso_update_clinica`: `admin` y `terapeuta`.
- No existe policy de `delete`.

Runtime:

- Admin puede leer, insertar y actualizar objeto del bucket.
- Terapeuta puede leer, insertar y actualizar objeto del bucket.
- Finanzas no puede leer, insertar ni actualizar objeto del bucket.
- Delete directo queda bloqueado por `storage.protect_delete()`.

## Resultado de `fotos_elementos_caso`

`public.fotos_elementos_caso` funciona correctamente por RLS:

- Admin: lee, inserta y actualiza.
- Terapeuta: lee, inserta y actualiza.
- Finanzas: no lee, no inserta, no actualiza.
- Delete fisico: no permitido en runtime por ausencia de policy delete.

Observacion: la ACL efectiva de la tabla mantiene grants amplios a `anon` y `authenticated` (`arwdDxtm`). RLS evita acceso anon/finanzas, pero conviene endurecer grants antes de datos reales.

## Resultado del bucket `elementos-caso`

El bucket es privado y las policies de `storage.objects` se limitan a `admin` y `terapeuta`.

Finanzas no accede a:

- `storage.objects`;
- rutas internas;
- objetos del bucket;
- carga de archivos;
- actualizacion de objetos;
- delete fisico.

## Resultado especifico del rol Finanzas

Finanzas:

- Puede leer, insertar y actualizar `cobros`.
- Puede leer, insertar y actualizar `pagos`.
- Puede leer `vista_cobros_estado`.
- No puede leer ni actualizar tablas clinicas.
- No puede leer `pacientes`.
- No puede leer `elementos_caso`.
- No puede leer `revision_hallazgos`.
- No puede leer `trabajos`, `trabajo_sesiones` ni `trabajo_acciones`.
- No puede leer `fotos_elementos_caso`.
- No puede leer ni crear objetos en bucket `elementos-caso`.
- No ve `storage_path` por RLS.

Observacion: Finanzas puede leer columnas completas de `cobros` y la vista financiera actual expone IDs de `consulta`, `evaluacion`, `caso`, `revision` y `trabajo`. No expone contenido clinico, pero si referencias tecnicas a unidades clinicas. BE-016 debe reemplazar esto por una vista financiera minima.

## Frontend validado

Validacion estatica mediante revision de codigo y build:

- `App.tsx` bloquea rutas clinicas para Finanzas:
  - `/pacientes`
  - `/consultas`
  - `/evaluaciones`
  - `/casos`
  - `/casos/:id`
  - `/elementos-caso`
  - `/revisiones`
  - `/detalle-revisiones`
  - `/agenda`
- `/finanzas` permite `admin` y `finanzas`.
- `/reportes` permite `admin`, `terapeuta` y `finanzas`.
- `ElementosCasoPanel` se renderiza dentro de `CasoDetallePage`, ruta bloqueada a Finanzas.
- `ElementosCasoPanel` consulta `fotos_elementos_caso` y firma URLs con `createSignedUrl`, pero Finanzas no llega a esa ruta y RLS bloquea tabla/Storage.
- La UI de fotos muestra miniaturas firmadas para roles clinicos; no muestra `storage_path` como texto visible.
- `FinanzasPage` no consulta fotos ni Storage.
- `ReportesPage` no consulta fotos ni `storage_path`.

Observaciones frontend:

- `FinanzasPage` intenta consultar `pacientes(id, nombres, apellidos)`. Con RLS Finanzas recibe 0 filas, por lo que no hay fuga de nombres, pero la UI queda con `Paciente no encontrado`.
- `ReportesPage` es compartida entre roles y consulta tablas clinicas. Para Finanzas RLS devuelve 0 filas clinicas, pero el reporte queda parcial y puede ser confuso. UI-016 debe separar reportes por rol.

## Bugs o brechas detectadas

1. `public.fotos_elementos_caso` tiene ACL amplia para `anon` y `authenticated`. RLS bloquea, pero no es minimo privilegio.
2. `storage.objects` mantiene grants amplios propios de Storage para `anon` y `authenticated`; RLS y trigger protegen, pero el modelo depende de policies correctas.
3. `vista_cobros_estado` permite a Finanzas ver IDs de entidades clinicas vinculadas (`consulta_id`, `evaluacion_id`, `caso_id`, `revision_id`, `trabajo_id`).
4. `cobros` queda accesible completo a Finanzas; si `descripcion_cobro`, `observaciones` o `notas_internas` contienen informacion clinica, esa informacion queda expuesta al rol financiero.
5. No existe bitacora/auditoria de lectura o cambios sensibles.
6. No hay politica transversal de anulacion logica vs delete fisico cerrada.
7. Reportes siguen compartidos entre roles y dependen de RLS para quedar parciales.

## Riesgos antes de datos reales

- Grants amplios controlados por RLS: aceptable para demo/local, debe endurecerse antes de produccion.
- Reportes compartidos entre roles: puede generar vistas parciales o interpretaciones incorrectas.
- Acceso accidental a nombres completos: no observado para Finanzas por RLS, pero `FinanzasPage` intenta consultarlos.
- Acceso accidental a archivos clinicos: no observado; RLS y Storage bloquean.
- Falta de auditoria de accesos: pendiente.
- Falta de auditoria de cambios sensibles: pendiente.
- Falta de anulacion logica formal: pendiente.
- Delete fisico: no permitido para fotos/storage en runtime probado, pero faltan politicas transversales para todos los datos sensibles.

## Recomendaciones

1. Mantener PROD-001 como bloqueante.
2. No cargar datos reales todavia.
3. Crear hardening posterior de grants para `fotos_elementos_caso` y revisar defaults de nuevas tablas.
4. Disenar `vista_finanzas_unidades_cobrables` en BE-016 con alias/codigo financiero y sin IDs clinicos directos si no son estrictamente necesarios.
5. Separar `ReportesPage` por rol en UI-016.
6. Definir SEC-005 antes de datos reales para auditoria de lectura/cambios sensibles.
7. Cerrar BE-021 antes de datos reales para anulacion logica y prohibicion de delete fisico.
8. Mantener `elementos_caso.foto_url` deprecada y no usarla como fuente operativa.

## Tareas derivadas

- BE-016: reforzar alcance de vista financiera minima.
- UI-016: separar reportes por rol.
- SEC-005: disenar auditoria de accesos y cambios sensibles.
- BE-021: definir anulacion logica vs delete fisico.
- BE-022/SEC posterior: hardening de grants para `fotos_elementos_caso` y revision de grants de Storage.
- QA-003: validar funcionalmente carga/listado de fotos con imagen ficticia local.

## Resultado final

SEC-001 queda **aprobada con observaciones** en Supabase local.

No se tocaron codigo, migraciones, `.env`, Supabase remoto ni datos reales. Las pruebas usaron datos ficticios dentro de transacciones revertidas.
