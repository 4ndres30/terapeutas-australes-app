# SEC-008 - Implementación controlada Hardening Auth

## Estado

Implementada parcialmente / pendiente validacion PR.

SEC-008 aplica solo cambios tecnicos seguros para local/demo. No cierra Auth para staging ni produccion.

## Fecha

2026-06-30

## Origen

SEC-003, DEC-029, DEC-030, DEC-031 y DEC-032.

## Objetivo

Implementar hardening Auth seguro sin tocar Supabase remoto, sin romper el flujo local/demo y sin habilitar datos reales, fotos reales, pagos reales ni produccion.

## Revision previa obligatoria

Se revisaron:

- `docs/control/auditorias/SEC-003_HARDENING_AUTH.md`;
- `docs/control/auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`;
- `supabase/config.toml`;
- `src/lib/supabase.ts`;
- `src/App.tsx`;
- `src/pages/LoginPage.tsx`;
- `supabase/dev-seeds/README.md`;
- `supabase/seed.sql`, no existente;
- `supabase/migrations/20260606054000_crear_tabla_usuarios_internos.sql`;
- `supabase/migrations/20260606055000_activar_rls_y_policies.sql`;
- documentos maestros de control.

## Cambios aplicados

### Configuración

En `supabase/config.toml`:

- `minimum_password_length` pasa de `6` a `8`;
- `password_requirements` pasa de vacio a `lower_upper_letters_digits`;
- se habilita `[auth.sessions]`;
- `timebox = "24h"`;
- `inactivity_timeout = "8h"`.

Estos cambios estan soportados por la configuracion local existente y no requieren migraciones. Afectan altas, cambios de contrasena y sesiones futuras. Los usuarios demo/local ya existentes no se modifican por este PR.

La configuracion requiere reiniciar Supabase local para que Auth cargue los cambios. En esta tarea no se reinicio el servicio para evitar interrumpir el entorno local del usuario; se valido estado con `npx supabase status`.

### Frontend

En `src/pages/LoginPage.tsx`:

- se reemplaza el mensaje tecnico de `signInWithPassword` por microcopy generico;
- se evita revelar si un email existe, si la contrasena fue incorrecta o detalles internos del proveedor Auth;
- se normaliza el email con `trim()` antes de autenticar.

En `src/App.tsx`:

- se reemplazan errores tecnicos de validacion de sesion y `usuarios_internos` por mensajes genericos;
- se mantiene el bloqueo para usuario Auth sin perfil interno;
- se mantiene el bloqueo para usuario interno inactivo;
- se mantiene el bloqueo para rol no valido;
- se evita exponer mensajes de RLS, nombres de tabla o estructura interna.

### Documentación

Se crea este informe y se sincronizan documentos maestros para registrar:

- alcance tecnico aplicado;
- controles que no se aplicaron por riesgo;
- tareas derivadas;
- continuidad de PROD-001 como bloqueo.

### No aplicados por riesgo

No se aplicaron cambios que podrian romper local/demo o requieren diseno operativo pendiente:

- cierre de signup;
- confirmacion de email;
- MFA;
- recuperacion de contrasena;
- provisioning/invitaciones;
- cambios sobre `auth.users`;
- migraciones;
- cambios sobre Supabase remoto.

## Cambios no aplicados

### Signup cerrado

No se cerro `enable_signup` local ni `auth.email.enable_signup`.

Motivo: no existe `supabase/seed.sql`, el seed versionado no crea usuarios Auth y no hay provisioning local/demo suficiente en el repositorio. Cerrar signup sin alternativa podria bloquear la creacion de usuarios demo/local.

Derivada: `SEC-008B` debe implementar cierre de signup por ambiente junto a provisioning/invitacion administrada.

### Email confirm

No se habilito `auth.email.enable_confirmations`.

Motivo: aunque el entorno local tiene servidor de testing de emails, no hay flujo operativo de confirmacion/invitacion documentado para usuarios internos y podria bloquear cuentas demo existentes si no estan confirmadas.

Derivada: `SEC-008B`, `DOC-001` y `QA-006`.

### MFA

No se habilito MFA TOTP/phone.

Motivo: la UI actual no tiene enrolamiento, verificacion ni recuperacion MFA. Activarlo sin flujo podria bloquear acceso local/demo.

Derivada: `UI-024` y `SEC-008B`.

### Password policy productiva completa

Se aplico endurecimiento local seguro, pero no se declara como politica productiva final.

Motivo: staging/produccion deben definir politica por ambiente, idealmente minimo mas alto, complejidad final, procedimiento de rotacion y validacion QA.

Derivada: `BE-018`, `DOC-001`, `QA-006` y configuracion de staging/produccion.

### Recovery

No se implemento recuperacion de contrasena.

Motivo: requiere email/SMTP o flujo local de testing, pantallas UI, microcopy y procedimiento administrativo. Implementarlo parcialmente podria promover recuperaciones inseguras.

Derivada: `UI-024`.

### Timeout UX

Se habilitaron timeouts en config local, pero no se implemento UI especifica de aviso por expiracion o inactividad.

Motivo: el cliente ya reacciona a cambios de sesion, pero no existe experiencia dedicada para explicar cierre por timebox/inactividad.

Derivada: `UI-024` o QA posterior si Control lo separa.

## Riesgos residuales

1. Signup sigue abierto en local/demo por falta de provisioning versionado.
2. Email confirm sigue deshabilitado en local/demo.
3. MFA sigue deshabilitado hasta tener UI/flujo operativo.
4. Usuarios existentes pueden conservar contrasenas debiles hasta rotacion futura.
5. La configuracion aplicada es local; staging/produccion deben configurarse por ambiente.
6. No hay recuperacion de cuenta documentada ni probada.
7. No hay auditoria sensible Auth implementada; SEC-005 sigue pendiente.
8. Scripts manuales Auth siguen permitidos solo local/demo como criterio temporal; SEC-007 debe cerrar procedimiento.
9. PROD-001 sigue bloqueante.

## Validación local

Preparacion y base:

- `git switch main`;
- `git pull origin main`;
- `git remote -v`;
- `git status`;
- `npm run lint`;
- `npm run build`;
- `npx supabase status`;
- `npx supabase migration list --local`.

Validacion final ejecutada en la rama:

- `git diff --check`: aprobado; solo aviso de normalizacion LF/CRLF del checkout Windows.
- `git diff --name-only`: lista cambios rastreados; el informe nuevo queda visible en `git status`.
- `npm run lint`: aprobado.
- `npm run build`: aprobado; Vite mantiene advertencia de chunk mayor a 500 kB.
- `npx supabase status`: Supabase local en ejecucion; servicios auxiliares `imgproxy`, `edge_runtime` y `pooler` detenidos igual que en la base observada.
- `npx supabase migration list --local`: aprobado, 22 migraciones listadas localmente.
- `git status`: cambios esperados en documentos, `src/App.tsx`, `src/pages/LoginPage.tsx`, `supabase/config.toml` e informe SEC-008 nuevo.

No se repiten claves, tokens ni secretos de Supabase en este documento.

## Impacto por ambiente

| Ambiente | Impacto SEC-008 |
| --- | --- |
| LOCAL | Password policy y timeouts aplican cuando Supabase local reinicie. Login mantiene flujo email/password y bloqueos por `usuarios_internos`. |
| DEMO | Si DEMO reutiliza esta configuracion local, aplica el mismo endurecimiento parcial. No autoriza datos reales. |
| STAGING | Sin cambios directos. Debe cerrar signup, exigir email confirm, MFA y redirects exactos antes de uso sensible. |
| PRODUCCION | Sin cambios directos. Sigue prohibida mientras PROD-001 este abierto. |

## Tareas derivadas

- `SEC-008B` - Cierre de signup y provisioning Auth controlado por ambiente.
- `SEC-005` - Auditoria sensible de eventos Auth, cambios de rol, recuperacion y MFA.
- `SEC-007` - Procedimiento de scripts manuales locales/demo y prohibicion productiva.
- `BE-018` - Separacion tecnica de ambientes, URLs, callbacks y configuracion Auth.
- `DOC-001` - Manual de ambientes con politica Auth por ambiente.
- `UI-024` - Recuperacion de cuenta, MFA y estados Auth no tecnicos.
- `QA-006` - Casos Auth minimos por rol, usuario inactivo, rol invalido, signup cerrado y microcopy.
- `PROD-001` - Sigue bloqueante antes de datos reales, fotos reales, pagos reales o produccion.

## Conclusión

SEC-008 implementa hardening Auth parcial y seguro para local/demo, mas microcopy seguro en el flujo de login.

SEC-008 no cierra Auth para produccion. Para habilitar staging o produccion faltan provisioning/invitacion, cierre de signup productivo, email confirm, MFA por rol, recuperacion controlada, auditoria Auth y QA-006.
