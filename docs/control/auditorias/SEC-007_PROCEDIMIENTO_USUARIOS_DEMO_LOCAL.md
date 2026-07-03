# SEC-007 - Procedimiento de usuarios demo/local y prohibicion en produccion

## Estado

Procedimiento documental / pendiente ejecucion local autorizada.

## Fecha

2026-07-03

## Rama

`sec-007-procedimiento-usuarios-demo-local`

## Origen

- CTRL-008.
- DEC-029.
- DEC-032.
- SEC-003.
- SEC-008.
- QA-006B.
- PROD-001.

## Objetivo

Definir un procedimiento seguro para preparar usuarios demo/locales que permitan ejecutar QA multirol sin versionar secretos, sin improvisar cuentas Auth y sin tocar produccion.

Este documento no crea usuarios, no ejecuta scripts, no modifica Auth/RLS, no modifica `.env` y no toca Supabase remoto.

## Principio de control

Los usuarios demo/locales existen para validar comportamiento de roles en ambientes no productivos.

No son una via para operar datos reales ni una excepcion a PROD-001.

Las credenciales no deben quedar en Git, PRs, issues, chats, capturas, bitacoras, documentacion versionada ni archivos compartidos.

## Alcance permitido

Solo bajo aprobacion explicita y en tarea tecnica separada, se permite preparar usuarios de prueba para:

- `admin`;
- `terapeuta`;
- `finanzas`;
- usuario Auth sin perfil interno;
- usuario interno inactivo;
- estados Auth negativos que puedan validarse sin romper constraints existentes.

La ejecucion debe limitarse a LOCAL o DEMO y debe usar datos ficticios.

## Prohibiciones

Queda prohibido:

- ejecutar scripts manuales sobre `auth.users` en produccion;
- usar Supabase remoto sin autorizacion explicita;
- ejecutar `supabase db push`;
- versionar passwords, magic links, access tokens, refresh tokens, service role keys o secrets;
- registrar credenciales en bitacoras, PRs o capturas;
- modificar `.env`;
- usar datos reales, fotos reales o pagos reales;
- saltarse `usuarios_internos` como fuente de rol operativo;
- dejar usuarios huerfanos sin trazabilidad local/demo;
- convertir scripts manuales en practica normal de operacion productiva.

## Requisitos antes de ejecutar provisioning local/demo

Antes de crear, actualizar o desactivar usuarios demo/locales debe cumplirse:

| Requisito | Estado esperado |
| --- | --- |
| Rama propia | Una rama tecnica especifica, por ejemplo `sec-007b-provisioning-demo-local`. |
| Ambiente | Confirmado LOCAL o DEMO. |
| Workspace | `git status` limpio antes de iniciar. |
| Supabase remoto | No usado. |
| `.env` | No modificado. |
| Datos | Solo ficticios. |
| Aprobacion | Instruccion explicita de Javier para ejecutar provisioning local/demo. |
| Evidencia | Registrar resultado sin credenciales. |

## Identidades logicas requeridas

SEC-007 no define emails ni passwords. Define identidades logicas para QA:

| Identidad logica | Rol / estado | Uso |
| --- | --- | --- |
| `QA-DEMO-ADMIN` | `admin`, activo | Validar acceso completo autorizado. |
| `QA-DEMO-TERAPEUTA` | `terapeuta`, activo | Validar superficies clinicas y bloqueo de Finanzas. |
| `QA-DEMO-FINANZAS` | `finanzas`, activo | Validar Finanzas, Reportes financieros y bloqueo clinico. |
| `QA-DEMO-INACTIVO` | rol valido, `activo=false` | Validar bloqueo por usuario interno inactivo. |
| `QA-DEMO-SIN-PERFIL` | Auth sin `usuarios_internos` | Validar bloqueo por falta de perfil interno. |
| `QA-DEMO-ROL-INVALIDO` | Condicionado | Solo si el modelo tecnico permite simularlo sin violar constraints ni migraciones. |

Si un caso negativo no puede representarse por constraints vigentes, QA debe registrarlo como condicionado y no forzar cambios de esquema.

## Procedimiento recomendado

### 1. Preparacion

1. Confirmar que la tarea autorizada es local/demo.
2. Confirmar que no se usara Supabase remoto.
3. Confirmar que no se modificara `.env`.
4. Confirmar que no se versionaran credenciales.
5. Definir las identidades logicas que se necesitan para la prueba.

### 2. Provisioning

La implementacion tecnica futura debe ser idempotente.

Para cada identidad logica activa debe existir:

- un usuario Auth local/demo;
- un registro correspondiente en `public.usuarios_internos`;
- rol valido;
- `activo=true`, salvo usuario inactivo de prueba;
- nombre visible ficticio;
- email o identificador de prueba no sensible;
- contrasena gestionada fuera de Git.

Para usuario sin perfil interno, debe existir usuario Auth pero no registro en `public.usuarios_internos`.

Para usuario inactivo, debe existir usuario Auth y registro en `public.usuarios_internos` con `activo=false`.

### 3. Validacion

La validacion debe registrar:

- fecha;
- ambiente;
- rama;
- identidades logicas usadas;
- rutas revisadas;
- resultado por rol;
- errores observados;
- restricciones respetadas.

No debe registrar:

- emails reales;
- passwords;
- tokens;
- service role keys;
- URLs privadas;
- datos reales.

### 4. Cierre

Al cerrar la tarea tecnica:

- dejar usuarios demo/locales documentados por identidad logica, no por credencial;
- confirmar que no se tocaron `.env`, remoto ni produccion;
- confirmar si las cuentas quedan disponibles para QA posterior o deben desactivarse;
- actualizar QA-006B si se pudo completar la cobertura multirol.

## Reglas para scripts futuros

Si se decide crear scripts versionados en una tarea posterior, deben cumplir:

- no contener secretos;
- no contener passwords por defecto;
- no apuntar a proyectos remotos;
- fallar si el objetivo no es local/demo;
- ser idempotentes;
- dejar salida sin datos sensibles;
- requerir confirmacion explicita antes de crear o desactivar usuarios;
- documentar rollback o desactivacion;
- no usar `supabase db push`.

La ubicacion, nombre y tecnologia de esos scripts deben aprobarse en una tarea separada. Este documento no los crea.

## Relacion con QA-006B

QA-006B queda bloqueada para cobertura autenticada multirol hasta que exista provisioning local/demo aprobado.

SEC-007 desbloquea el criterio de procedimiento, pero no crea las cuentas. La siguiente tarea tecnica puede ser `SEC-007B - Provisioning local/demo de usuarios de prueba`, si Javier la autoriza explicitamente.

## Relacion con produccion

En produccion:

- no se permiten scripts manuales normales sobre Auth;
- no se permite signup publico como practica final;
- no se permite usar usuarios demo;
- no se permiten credenciales compartidas;
- no se permite bypass de `usuarios_internos`;
- no se permite operar mientras PROD-001 siga abierto.

Produccion debe usar provisioning/invitacion administrada, MFA segun rol, auditoria y separacion real de ambientes en tareas posteriores.

## Riesgos pendientes

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Falta de usuarios demo multirol | QA-006B no puede completarse visualmente. | Autorizar tarea tecnica SEC-007B local/demo. |
| Credenciales versionadas accidentalmente | Exposicion de acceso interno. | Prohibicion explicita y revision de diff antes de PR. |
| Uso de scripts contra remoto | Daño en datos o Auth real. | Reglas de ambiente y aprobacion explicita. |
| Usuarios huerfanos | Roles inconsistentes y resultados QA falsos. | Provisioning idempotente y cierre documentado. |
| Copiar practicas demo a produccion | Riesgo alto de seguridad. | PROD-001 bloqueante y prohibicion en este procedimiento. |

## Restricciones respetadas

- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se modifico `.env`.
- No se leyeron ni expusieron credenciales.
- No se crearon ni modificaron usuarios Auth.
- No se modifico `usuarios_internos`.
- No se ejecuto SQL.
- No se uso Supabase remoto.
- No se ejecuto `supabase db push`.
- No se modifico Auth/RLS.
- No se creo API publica.
- No se integro Google Calendar, Gmail ni Workspace.
- No se habilito produccion.
- No se usaron datos reales, fotos reales ni pagos reales.

## Resultado

SEC-007 queda documentado como procedimiento local/demo.

La siguiente tarea recomendada, si se desea completar QA-006B autenticada, es `SEC-007B - Provisioning local/demo de usuarios de prueba`, con aprobacion explicita antes de tocar Auth local.

PROD-001 sigue bloqueante.
