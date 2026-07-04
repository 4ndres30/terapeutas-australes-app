# SEC-011 - Diseno de hardening tecnico de fotos y Storage

## Estado

Diseno documental / pendiente implementacion tecnica futura.

## Fecha

2026-07-04

## Rama

`sec-011-diseno-hardening-fotos-storage`

## Origen

- SEC-001.
- SEC-005.
- SEC-006.
- QA-003.
- QA-006F.
- BE-021.
- BE-022.
- UI-022.
- PROD-001.

## Objetivo

Definir la tarea tecnica futura para endurecer grants, auditoria, anulacion logica y control de objetos huerfanos de fotos de elementos del caso.

Esta tarea no implementa cambios. Sirve como contrato tecnico previo para una futura rama con migracion local, pruebas runtime y PR separado.

## Alcance futuro propuesto

- `public.fotos_elementos_caso`.
- Bucket privado `elementos-caso`.
- Policies de `storage.objects` asociadas a fotos clinicas.
- Auditoria de acciones sensibles sobre fotos.
- Estados logicos de foto.
- Deteccion y resolucion controlada de objetos huerfanos.

## Fuera de alcance actual

- No se crean migraciones.
- No se modifica RLS.
- No se modifica Auth.
- No se modifica Storage local ni remoto.
- No se toca Supabase remoto.
- No se ejecuta `supabase db push`.
- No se modifican `src/` ni UI.
- No se modifican `.env` ni secretos.
- No se usan fotos reales.
- No se habilita produccion.

## Problema a resolver

SEC-001 y QA-006F confirman que RLS/Storage bloquean a `finanzas` y permiten acceso clinico esperado en local/demo. Sin embargo, antes de datos reales queda pendiente endurecer gobierno tecnico:

- revisar grants efectivos de `public.fotos_elementos_caso`;
- revisar defaults de grants para nuevas tablas;
- evitar delete fisico operativo;
- auditar cambios sensibles sobre fotos;
- controlar objetos huerfanos entre Storage y metadatos;
- revalidar por rol despues de cualquier cambio.

## Fases tecnicas recomendadas

### Fase 1 - Inventario local no destructivo

Ejecutar solo contra Supabase local:

- `information_schema.role_table_grants` para `public.fotos_elementos_caso`;
- `pg_policies` para `public.fotos_elementos_caso`;
- `pg_policies` para `storage.objects` filtrando bucket `elementos-caso`;
- inventario de triggers y constraints;
- conteo de objetos Storage sin metadato y metadatos sin objeto.

Resultado esperado: reporte previo antes de cualquier migracion.

### Fase 2 - Hardening de grants

Si el inventario confirma permisos amplios, preparar migracion local para:

- revocar grants innecesarios a `public` y `anon`;
- mantener solo permisos necesarios para `authenticated`;
- conservar RLS como frontera principal por rol;
- evitar grants de `delete` operativo sobre metadatos de fotos;
- revisar defaults para que futuras tablas no hereden grants amplios.

La migracion debe ser local, reversible mediante nueva migracion y validada por rol.

### Fase 3 - Anulacion logica

Alinear fotos con BE-021:

- mantener delete fisico fuera del flujo operativo normal;
- usar estado logico para `Activa`, `Archivada` y `Descartada` o los estados que Control apruebe;
- exigir motivo no clinico breve al anular/descartar;
- no borrar objeto Storage sin aprobacion excepcional y auditoria.

### Fase 4 - Auditoria sensible

Implementar en tarea futura lo definido por SEC-005 para fotos:

- registrar actor, rol, entidad, accion, fecha y motivo minimo;
- auditar alta de metadato, cambio de estado, cambio de principalidad, cambio de descripcion y resolucion de huerfanos;
- no guardar imagenes, signed URLs, rutas completas ni textos clinicos extensos en auditoria.

### Fase 5 - Objetos huerfanos

Crear procedimiento local/controlado para detectar:

- objetos Storage sin fila en `fotos_elementos_caso`;
- filas cuyo objeto Storage no existe;
- filas asociadas a caso/elemento inconsistente;
- cargas parciales.

La resolucion debe iniciar como reporte, no limpieza automatica. La eliminacion fisica solo debe ser excepcional, aprobada y auditada.

### Fase 6 - QA posterior obligatoria

Despues de cualquier migracion tecnica:

- ejecutar matriz RLS/Storage `admin`, `terapeuta`, `finanzas`;
- validar carga con imagen ficticia local;
- validar UI admin/terapeuta;
- validar que Finanzas no ve fotos, miniaturas, rutas ni Storage;
- ejecutar `git diff --check`, `npm run lint`, `npm run build`;
- documentar resultado en informe QA separado.

## Criterios de no avance

No avanzar a implementacion tecnica si:

- no hay Supabase local disponible;
- se requiere Supabase remoto;
- se requiere modificar `.env`;
- la migracion afecta datos reales;
- no hay plan de rollback por migracion posterior;
- no se puede ejecutar QA por rol.

## Validaciones ejecutadas

| Validacion | Resultado |
| --- | --- |
| `git diff --check` | OK. Solo avisos LF/CRLF esperados en Windows. |
| `npm run lint` | OK. |
| `npm run build` | OK. Vite mantiene warning conocido de chunk mayor a 500 kB. |
| `git status --short --branch` | OK. Solo cambios documentales esperados. |

## Recomendacion de Control

La siguiente tarea tecnica debe ser una rama separada, por ejemplo `sec-012-hardening-fotos-storage-local`, con migracion local y QA runtime. Esa tarea requiere aprobacion explicita porque tocaria grants, RLS/policies o migraciones.

PROD-001 sigue bloqueante.
