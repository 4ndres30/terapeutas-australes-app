# QA-003 - Validacion funcional local de fotos de elementos del caso

## Estado

Ejecutada local/demo con observacion.

## Fecha

2026-07-04

## Rama

`qa-003-validacion-fotos-local`

## Origen

- BE-022.
- UI-022.
- SEC-001.
- SEC-004.
- SEC-006.
- QA-006F.
- PROD-001.

## Objetivo

Validar localmente que una imagen ficticia puede asociarse a un elemento del caso, registrarse en `public.fotos_elementos_caso`, guardarse en el bucket privado `elementos-caso` y mostrarse en la UI para rol clinico autorizado.

## Alcance

- Supabase local.
- App local Vite en `127.0.0.1:5173`.
- Usuario demo local `admin`.
- Verificacion negativa con usuario demo local `finanzas`.
- Imagen PNG ficticia de 1 pixel.

## Fuera de alcance

- Fotos reales.
- Datos reales.
- Produccion.
- Supabase remoto.
- `supabase db push`.
- Migraciones.
- Cambios en `src/`.
- Cambios en `.env`.
- Cambios de Auth/RLS.
- Google Calendar, Gmail o Workspace.

## Preparacion

| Paso | Resultado |
| --- | --- |
| Supabase API local `127.0.0.1:54321` | OK. |
| Supabase Postgres local `127.0.0.1:54322` | OK. |
| Vite local `127.0.0.1:5173` | Iniciado localmente con `npm run dev -- --host 127.0.0.1`. |
| Usuario demo admin | Login local OK. |
| Caso local demo | Caso DATA-001 abierto en UI. |

## Evidencia funcional

| Validacion | Resultado |
| --- | --- |
| Carga de imagen ficticia al bucket `elementos-caso` | OK, usando Supabase local con usuario demo admin. |
| Registro en `public.fotos_elementos_caso` | OK, asociado a paciente, caso y elemento local demo. |
| Creacion de signed URL | OK. |
| UI admin en detalle de caso | OK, muestra imagen ficticia y descripcion. |
| Exposicion de `storage_path` en UI admin | OK, no expone ruta Storage como texto visible. |
| Imagen renderizada | OK, `<img>` con signed URL, `complete=true`, dimensiones naturales `1x1`. |
| Finanzas sobre `fotos_elementos_caso` | OK, 0 filas visibles. |
| Finanzas sobre Storage `elementos-caso` | OK, 0 objetos visibles para prefijo QA-003. |

## Observacion

El runtime disponible del navegador integrado no expuso una accion directa para cargar archivos por el input `file`. Por eso la carga se ejecuto con el cliente Supabase local autenticado como usuario demo admin, usando el mismo bucket, tabla y constraints que usa la UI.

La visualizacion posterior si fue validada en la UI del detalle de caso: la imagen ficticia aparece con signed URL y sin mostrar `storage_path`.

## Resultado

QA-003 queda ejecutada local/demo con observacion. La funcionalidad base de fotos queda validada para imagen ficticia local:

- Storage privado recibe el objeto ficticio.
- `fotos_elementos_caso` registra metadatos.
- La UI admin muestra la foto asociada.
- Finanzas no ve fotos ni Storage.

Esta validacion no habilita fotos reales ni produccion.

## Riesgos pendientes

- Falta probar manualmente el flujo exacto del input de archivo en navegador si se requiere cierre QA sin observacion.
- Falta hardening tecnico de grants para `fotos_elementos_caso` y Storage antes de datos reales.
- Falta implementar auditoria tecnica de accesos/cambios sensibles.
- Falta implementar anulacion/archivado operativo de fotos.
- PROD-001 sigue bloqueante.

## Recomendacion de Control

Integrar QA-003 como evidencia local/demo con observacion y priorizar una tarea tecnica futura de hardening de grants/auditoria de fotos antes de cualquier foto real.

## Validaciones

| Validacion | Resultado |
| --- | --- |
| `git diff --check` | OK, solo advertencias habituales LF/CRLF del workspace. |
| `npm run lint` | OK. |
| `npm run build` | OK, con warning conocido de Vite por chunk mayor a 500 kB. |
| `git status --short --branch` | OK, solo cambios documentales esperados en la rama. |
