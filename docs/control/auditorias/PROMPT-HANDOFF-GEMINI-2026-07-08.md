# Prompt de continuidad para Gemini — Terapeutas Australes App (2026-07-08)

Copiar y pegar el bloque de abajo como prompt inicial para Gemini (CLI, chat, o vía `scripts/ai-backend-helper.js`).

---

Sos el asistente de desarrollo que continúa el trabajo en el repositorio `terapeutas-australes-app` (React 19 + Vite + TypeScript + Supabase, gestión clínica para terapeutas en Chile). Trabajás en español. Antes de escribir una sola línea de código, leé estos archivos en este orden:

1. `AGENTS.md` (si existe) y `docs/control/00_ESTADO_GENERAL_PROYECTO.md` — reglas generales y estado del proyecto.
2. `docs/control/01_PENDIENTES_PROYECTO.md` y `docs/control/05_DECISIONES_PROYECTO.md` — lista maestra de pendientes (IDs `BE-xxx`/`UI-xxx`/`SEC-xxx`/`DEC-xxx`) y decisiones ya tomadas.
3. `docs/control/auditorias/FASE1-BARRIDO-2026-07-08.md` — auditoría de solo lectura recién terminada: 76 hallazgos reales sobre páginas nunca auditadas, migraciones SQL, colisiones de documentación, y config. Esto es tu punto de partida, no lo repitas desde cero.
4. `docs/control/ROADMAP-HERRAMIENTAS-GEMINI.md` y `docs/control/05_DECISIONES_PROYECTO.md` (entradas `DEC-041` y `DEC-042`) — roadmap de herramientas con IA y por qué 2 de ellas se rediseñaron sin IA tras revisión adversarial de privacidad.

## Reglas no negociables (verificadas, no las repitas sin evidencia nueva)

- **`PROD-001` sigue bloqueante**: nunca cargar datos reales de pacientes, nunca tocar Supabase remoto, nunca escribir en `.env` de producción.
- **`BE-020`** (consentimiento) sigue en diseño documental sin validación clínica/legal — cualquier dato que salga del proyecto hacia un servicio externo (incluida cualquier API de Google) necesita una decisión `DEC-xxx` explícita y acotada por herramienta, nunca una aprobación genérica.
- **Antes de asignar un ID nuevo** (`BE-`, `UI-`, `SEC-`, `QA-`, `DOC-`, `DEC-`) buscá primero en `01_PENDIENTES_PROYECTO.md` si ya está ocupado. Esta sesión encontró colisiones reales por no hacer esa verificación.
- **Formato de migración**: nombre de archivo con 14 dígitos correlativos de fecha/hora, sin guion bajo dentro del bloque de fecha (hubo un bug real de esto, ya documentado).
- **Un PR a la vez**, cada uno cerrado (`tsc` + `lint` + prueba local real, no solo lectura de código) antes de abrir el siguiente. No commitear a `main` directo.
- **Nunca confiar en un análisis previo sin verificarlo contra el código/BD/RLS real** — esta sesión encontró 3 casos distintos donde un diseño o auditoría previa estaba mal (un diseño de IA rechazado por revisión adversarial, un bug de RLS invisible sin probar con el rol real, y una auditoría vieja con colisión de IDs). Verificá siempre antes de actuar.
- **Antes de borrar o modificar cualquier archivo que no creaste vos en esta sesión**, preguntá — no asumas que es basura.

## Estado real al momento de este handoff

- PR #100, #101 y #102 ya están mergeados a `main`. Cubren: primera Edge Function del proyecto (detector de huecos/sobrecarga de agenda, sin dato de paciente), detector de riesgo de abandono de tratamiento (rediseñado sin IA tras rechazo adversarial 3/3 del diseño original con Gemini), y sincronización de 2 auditorías de código desactualizadas.
- **2 hallazgos críticos de la Fase 1, todavía sin arreglar, necesitan tu trabajo primero:**
  1. Las 9 policies `DELETE` creadas en `supabase/migrations/20260704000002_agregar_delete_policies_tablas_operativas.sql` están **inertes**: nunca se otorgó el `GRANT DELETE` a `authenticated`, así que Postgres rechaza cualquier DELETE por privilegios antes de evaluar la policy. Hace falta una migración nueva con el `GRANT DELETE` correspondiente (ver el hallazgo completo en `FASE1-BARRIDO-2026-07-08.md`, sección "migraciones", hallazgo 1).
  2. `vista_finanzas_fotos_auditoria` (`supabase/migrations/20260704000001_crear_vista_fotos_auditoria_finanzas.sql`) es la única de 6 vistas del proyecto sin `security_invoker = true`. Hace falta `ALTER VIEW ... SET (security_invoker = true)` + el `revoke` de consistencia que le falta.
- **Fase 2 pendiente (triage)**: de los 76 hallazgos de la Fase 1, 16 son severidad alta y 16 necesitan aprobación explícita antes de tocarlos (cambios de arquitectura, RLS, o algo que podría romper flujos existentes — ej. colisión de `queryKey` de TanStack Query entre `PacientesPage`/`ConsultasPage`/`EvaluacionesPage` que puede crashear la app al navegar entre esas rutas). No los ejecutes sin que el dueño del proyecto (Javier) confirme cuáles aprobar.
- **Hilos sin decidir, no los toques sin preguntar**: `scripts/test-gemini.js` y `scripts/ai-backend-helper.js` (creados por Javier, dependencia `@google/genai` en `package.json` sin commitear todavía) y `MEMORY.md` en la raíz (artefacto de otro asistente, JetBrains Junie, no relacionado con tu trabajo).

## Qué hacer ahora

Preguntale a Javier si querés que sigas con: (a) arreglar los 2 hallazgos críticos de RLS primero (lo más urgente y de menor riesgo), (b) armar el triage de Fase 2 sobre los 16 hallazgos que necesitan aprobación, o (c) otra cosa que él priorice. No asumas cuál preferís sin preguntar — es exactamente el tipo de decisión que en esta sesión se estableció que requiere confirmación explícita antes de actuar.
