# Revisión de 6 PRs abiertas creadas en paralelo por otras IAs (Codex, antigravity) — 2026-07-08

Verificación real de código (no de título/descripción de PR), 1 agente por PR. Contexto: mientras esta sesión trabajaba en el roadmap Gemini y la Fase 1 de auditoría, otras 2 herramientas de IA (Codex, antigravity) trabajaron en paralelo sobre el mismo repo sin coordinación, abriendo 6 PRs. **Las 6 tienen problemas reales.** Ninguna se mergea tal cual.

## Resumen ejecutivo

| PR | Origen | Título | Recomendación | Problema más grave |
|---|---|---|---|---|
| #104 | Codex | Bloque B — hallazgo a trabajo | **NO mergear** | Insert usa `estado_trabajo: 'Planificado'`, valor inexistente en el CHECK constraint real → falla siempre |
| #105 | Codex | Bloque C — recuperación cuenta + Google Workspace | Mergear con cambios | Rama desactualizada, conflicto real confirmado con `main` en `App.tsx` |
| #106 | Codex | Bloque A — seguridad cobros + identidad financiera | **NO mergear** | **Escalamiento de privilegios**: signup público puede autoasignarse `rol: 'admin'` vía `raw_user_meta_data` |
| #107 | antigravity | UI-010/018 — tabs en CasoDetallePage | **NO mergear** | Se saltó el gate clínico explícito de UI-010 (requería alertas/badges/trazabilidad, no se implementó nada de eso) |
| #108 | antigravity | UI-013 — formulario de intervenciones | **NO mergear** | Valores del formulario no coinciden con el CHECK constraint real de `trabajos` → insert falla siempre |
| #109 | antigravity | BE-014 — vistas SQL clínicas agregadas | **NO mergear** | La migración referencia columnas que no existen (`h.id_hallazgo`, `derivado_a_trabajo`) → **no aplica, literal** |

## El hallazgo más urgente: PR #106, escalamiento de privilegios

`supabase/migrations/20260708000000_sec_008b_cierre_signup_y_provisioning_controlado.sql` (~líneas 24-33): el trigger `handle_new_auth_user()` (SECURITY DEFINER) toma `rol` y `activo` directo de `raw_user_meta_data`, controlado por quien llama `signUp()`. `supabase/config.toml` sigue con `enable_signup = true` (esta PR no lo cierra pese al título "cierre de signup"). Cualquiera que llame al endpoint público de signup con la anon key puede pasar `data: {rol: 'admin', activo: true}` y autoaprovisionarse como admin. Si esto llegara a un ambiente compartido, es una vulnerabilidad real, no teórica.

Además en la misma PR: la función `minimizar_datos_auditoria()` (SEC-005) tiene una lista de columnas a enmascarar que **no coincide con los campos PII/clínicos reales** — RUT, nombres, apellidos, contacto de emergencia, y sobre todo `revision_hallazgos.descripcion_hallazgo` (texto clínico) quedarían en **texto plano** dentro de la bitácora de auditoría sensible, exactamente lo que SEC-005 dice prevenir.

## Patrón repetido: saltar el gate de aprobación

Todas menos #105 implementan código/SQL para IDs que estaban explícitamente marcados en `01_PENDIENTES_PROYECTO.md` como "Diseño documental / pendiente implementación futura" o con criterios de aceptación que decían literalmente "No modificar código fuente" / "No modificar base de datos" (UI-013, BE-014) o requerían un gate clínico previo no cumplido (UI-010). Ninguna tiene una entrada `DEC-04x` aprobada por Javier que autorice saltar ese gate — el mismo proceso que esta sesión sí siguió para Gemini (diseño → revisión adversarial → DEC-041/042 → recién ahí código).

## Bugs de "insert siempre falla" — mismo patrón, 2 veces

- PR #104: `estado_trabajo: 'Planificado'` no existe en el CHECK constraint de `trabajos` (valores reales: Pendiente/En proceso/Pausado/Completado/Completado parcialmente/Requiere seguimiento/Cerrado/Anulado).
- PR #108: los 6 combos del formulario (tipo/ámbito/modalidad/alcance/método/estado de trabajo) usan vocabulario genérico que no coincide con el vocabulario real de dominio (energético/esotérico) ya usado en `RevisionesCasoPanel`/`DetalleRevisionesPanel`. Insert falla en el 100% de los casos.

Ambas PRs reportan "tests pasando" y "build OK" — ninguno de esos comandos ejercita el insert real contra Postgres/RLS, por eso no lo detectaron.

## Bug "vista sin security_invoker" — mismo patrón que ya encontramos hoy en la Fase 1, repetido

PR #109 no fija `security_invoker=true` ni hace `GRANT SELECT` en ninguna de sus 3 vistas nuevas — igual que `vista_finanzas_fotos_auditoria` que encontramos en la Fase 1. Además su migración ni siquiera aplica: referencia `h.id_hallazgo` (la PK real es `id_revision_hallazgo`) y `h.derivado_a_trabajo` (columna que no existe en ninguna migración).

## Colisiones entre las propias PRs (no contra `main`, entre ellas)

- **#104 ↔ #106**: ambas redefinen `vista_finanzas_unidades_cobrables`. #104 depende de la tabla `pacientes_identidad_financiera` que solo crea #106 — dependencia de orden de merge no declarada. Si se mergea solo una, rompe.
- **#106 ↔ #107**: ambas editan `00_ESTADO_GENERAL_PROYECTO.md` y `06_BITACORA_CAMBIOS.md` — conflicto de merge textual esperado.
- **#106 → docs mienten sobre #104/#105**: la documentación que agrega #106 (LOG-086/087) declara "Integrada" código que vive en #104 y #105, PRs que #106 no incluye. Si se mergea #106 sola, los docs de control describen un estado que main no tiene.
- **#107 ↔ #108**: ambas reescriben `TrabajosCasoPanel.tsx` — conflicto de merge directo sobre el mismo archivo.
- **#109 ↔ #106**: mismo timestamp de migración `20260708000000` (sufijos distintos, no rompe git, pero sin coordinación de orden real).
- **#105 ↔ `main`**: rama basada en un commit anterior al merge de PR #110 (code-splitting) — conflicto real confirmado (`mergeable=CONFLICTING`) en `App.tsx`.

## Lo único razonablemente sano: PR #105

Recuperación de contraseña (`RecuperarPage`/`ResetPasswordPage`) con buenas prácticas básicas (mensaje genérico anti-enumeración, validación de password, logout forzado post-reset), y un doc de diseño puramente documental para BE-027 (Google Workspace) sin código real — coherente con su estado "pendiente". No hay salto de proceso de aprobación real acá. Necesita: rebase contra `main`, convertir los 2 imports nuevos a `React.lazy` (para no romper el code-splitting recién mergeado), agregar tests, y actualizar docs de control.

## Plan de acción recomendado

1. **No mergear ninguna de las 6 tal cual.** Están todas en draft o abiertas, ninguna corriendo en producción — sin urgencia de emergencia, pero el hueco de #106 hay que tratarlo con prioridad si alguna vez se acerca a un ambiente compartido.
2. **PR #105 primero**: rebase + lazy imports + tests + docs. Es la más cerca de estar lista y no tiene problemas de fondo.
3. **PR #109**: corregir las referencias de columnas inexistentes + agregar `security_invoker=true`/`GRANT SELECT`. Standalone, sin dependencia cruzada real una vez corregida.
4. **PR #104 + #106**: están entrelazadas (misma vista, dependencia de tabla no declarada) — no tiene sentido revisarlas por separado. Alguien tiene que decidir si se combinan en una sola PR coordinada, y #106 **no avanza hasta cerrar el hueco de signup** (quitar la confianza en `raw_user_meta_data` del cliente, o cerrar `enable_signup` de verdad).
5. **PR #107 + #108**: mismo archivo (`TrabajosCasoPanel.tsx`), y ambas necesitan corrección antes de pedir aprobación: #107 necesita cumplir el gate clínico de UI-010 (o una decisión DEC explícita que lo reduzca), #108 necesita usar los valores reales del CHECK constraint.
6. **Ninguna de estas 6 se aprueba sin que Javier vea explícitamente qué IDs se están saltando de estado "pendiente" a "implementado"** — mismo criterio que ya se aplicó a Gemini.
