# SEC-006 - Politica de fotos, retencion y objetos huerfanos

## Estado

Politica documental / pendiente implementacion tecnica futura.

## Fecha

2026-07-04

## Rama

`sec-006-politica-fotos-retencion`

## Origen

- CTRL-008.
- DEC-018.
- DEC-028.
- SEC-001.
- SEC-005.
- BE-021.
- BE-022.
- UI-022.
- QA-006F.
- PROD-001.

## Objetivo

Definir una politica operativa y tecnica para fotos de elementos del caso antes de cualquier uso con fotos reales.

Esta tarea no implementa cambios. Ordena criterios para retencion, anulacion, objetos huerfanos, roles, auditoria y restricciones.

## Alcance

- Fotos de elementos del caso asociadas a `public.fotos_elementos_caso`.
- Objetos del bucket privado `elementos-caso`.
- Uso local/demo con imagenes ficticias.
- Reglas futuras para operacion con datos reales, supeditadas a PROD-001.

## Fuera de alcance

- Fotos reales.
- Produccion.
- Supabase remoto.
- `supabase db push`.
- Migraciones.
- Cambios de RLS/Auth/Storage.
- Cambios en `src/`.
- Cambios en `.env`.
- Eliminacion fisica de objetos.
- API publica.
- Google Calendar, Gmail o Workspace.

## Principios

1. Las fotos son archivos clinicos sensibles.
2. `finanzas` no debe ver fotos, miniaturas, signed URLs, rutas ni `storage_path`.
3. Las fotos reales siguen prohibidas mientras `PROD-001` este abierto.
4. El acceso operativo a fotos corresponde solo a `admin` y `terapeuta`.
5. La anulacion logica debe ser el camino normal; la eliminacion fisica debe ser excepcional, autorizada y auditada.
6. Storage y tabla de metadatos deben mantenerse consistentes.
7. Los logs y auditorias no deben almacenar imagenes, rutas completas ni datos clinicos extensos.

## Roles permitidos

| Accion | Admin | Terapeuta | Finanzas |
| --- | --- | --- | --- |
| Ver miniatura o signed URL | Permitido | Permitido | Prohibido |
| Subir foto local/demo | Permitido | Permitido | Prohibido |
| Editar metadatos no sensibles | Permitido | Permitido | Prohibido |
| Marcar como archivada/anulada | Permitido | Permitido segun flujo | Prohibido |
| Eliminar fisicamente | Excepcional y auditado | Prohibido por defecto | Prohibido |
| Ver `storage_path` | Solo soporte tecnico controlado | Prohibido por defecto | Prohibido |

## Estados logicos recomendados

| Estado | Uso |
| --- | --- |
| `activa` | Foto visible para roles clinicos autorizados. |
| `archivada` | Foto conservada, no destacada en flujo normal. |
| `anulada` | Foto no utilizable por error, duplicidad, consentimiento revocado o criterio clinico/operativo. |
| `pendiente_revision` | Foto cargada pero pendiente de validacion interna. |

La primera version tecnica ya usa estado logico. Cualquier ampliacion debe realizarse en migracion futura separada y con QA.

## Retencion

- En local/demo, las imagenes ficticias pueden limpiarse con procedimiento manual controlado.
- En datos reales, la retencion debe alinearse con consentimiento, criterio clinico/legal y politica de backup/restauracion.
- No debe existir borrado automatico sin auditoria.
- La retencion debe distinguir metadatos, objeto Storage, backups y evidencias de auditoria.

## Objetos huerfanos

Se considera objeto huerfano cuando:

- existe en Storage pero no tiene fila valida en `public.fotos_elementos_caso`;
- tiene fila de metadatos pero el objeto Storage no existe;
- apunta a paciente/caso/elemento inconsistente;
- fue cargado parcialmente y quedo sin registro transaccional completo.

La politica futura debe incluir:

- reporte local/administrativo de huerfanos;
- cuarentena antes de eliminacion;
- auditoria de deteccion y resolucion;
- prohibicion de limpieza automatica en produccion sin aprobacion;
- pruebas con datos ficticios antes de cualquier rutina real.

## Auditoria minima

SEC-005 debe cubrir, para fotos:

- actor;
- rol;
- fecha/hora;
- accion;
- entidad afectada;
- motivo breve y no clinico;
- estado anterior/nuevo cuando aplique;
- identificador minimizado de objeto o metadato.

Queda prohibido registrar en auditoria:

- imagenes;
- rutas completas de Storage;
- signed URLs;
- textos clinicos extensos;
- datos personales no necesarios.

## Criterios antes de fotos reales

Antes de usar fotos reales deben estar cerrados o aprobados:

- `PROD-001`.
- `DOC-001` / `DOC-003` con ambientes reales separados.
- `BE-019` / `DOC-002` con backup/restauracion probado.
- `BE-020` con consentimiento validado clinica/legalmente.
- `SEC-005` implementado tecnicamente.
- `BE-021` implementado tecnicamente para anulacion logica.
- Hardening de grants de `fotos_elementos_caso` y Storage.
- `QA-003` con imagen ficticia local.
- QA runtime de RLS/Storage posterior a cualquier cambio tecnico.

## Resultado

SEC-006 queda documentada como politica base. No habilita fotos reales ni produccion.

La siguiente tarea recomendada es `QA-003 - Validacion funcional local de fotos de elementos del caso` con imagen ficticia, o una tarea tecnica posterior para hardening de grants si Control decide priorizar seguridad antes de UX.

PROD-001 sigue bloqueante.

## Validaciones

| Validacion | Resultado |
| --- | --- |
| `git diff --check` | OK, solo advertencias habituales LF/CRLF del workspace. |
| `npm run lint` | OK. |
| `npm run build` | OK, con warning conocido de Vite por chunk mayor a 500 kB. |
| `git status --short --branch` | OK, solo cambios documentales esperados en la rama. |
