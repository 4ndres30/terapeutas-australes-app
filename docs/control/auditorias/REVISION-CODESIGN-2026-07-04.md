> **SUPERADA (2026-07-08).** Los IDs `BE-020`/`BE-021`/`UI-026`/`UI-027` que este documento propone ya estaban ocupados por decisiones reales distintas (ver `01_PENDIENTES_PROYECTO.md`) — colisión de numeración, no se usaron. El bloqueo crítico (DELETE policies) ya está integrado bajo su ID real `BE-021`. El hallazgo de "código muerto" en CSS (§4.4/D-02) es incorrecto: los 3 archivos sí están importados y en uso. Los hallazgos de UI que siguen vigentes quedaron re-registrados como `UI-028`/`UI-029`/`UI-030`/`UI-031` en `01_PENDIENTES_PROYECTO.md`. Se conserva este documento como historial, no como fuente de tareas activas.

# REVISION-CODESIGN-2026-07-04 — Revisión del Proyecto Terapeutas Australes App

**Responsable**: Revisión de Control (Codesign)
**Fecha**: 2026-07-04
**Alcance**:
- Estructura React/TypeScript (`src/`)
- Contexto de autenticación (`src/context/`)
- Página Agenda (`src/pages/AgendaPage.tsx`)
- Documentación de control y auditoría existente (`docs/control/`)
- Alineación con restricciones de `AGENTS.md` / `PROD-001`

**Estado**: Completada. Pendiente de lectura y aprobación de Javier.

---

## 1. RESUMEN EJECUTIVO

El proyecto se encuentra **funcional, coherente y excepcionalmente documentado**. La arquitectura React + TypeScript + Supabase/PostgreSQL es sólida y las decisiones de gobernanza (no ejecutar remoto, no usar datos reales, respetar `PROD-001`) se mantienen disciplinadas.

Verifiqué en código fuente que los bloques cerrados en documentación efectivamente existen: el `AuthContext` está implementado con calidad de producción y la Agenda operativa es real y tipada.

Persisten **3 áreas de mejora** ya señaladas en `AUDIT-2026-07-04` (seguridad RLS, state management, duplicación) y **1 observación de diseño/UI** nueva: la ausencia de un contrato único de design system/tokens pese a tener múltiples hojas CSS.

**Conclusión**: el proyecto está listo para seguir avanzando en funcionalidad interna, pero tiene **un bloqueo técnico pre-producción** (DELETE policies / anulación lógica) que debe cerrarse antes de cualquier dato real.

---

## 2. ESTADO VERIFICADO (EVIDENCIA DIRECTA)

| Ítem | Archivo revisado | Veredicto |
|---|---|---|
| Auth / roles | `src/context/AuthContext.tsx` | ✅ Implementado, validación de rol, cleanup de listener, estados de error claros |
| Tipos de auth | `src/context/authTypes.ts` | ✅ Tipado fuerte y explícito |
| Agenda operativa | `src/pages/AgendaPage.tsx` | ⚠️ Funcional y bien tipada, pero 1.304 líneas (candidato a refactoring) |
| Rutas / App | `src/App.tsx` | ✅ Estructura de rutas presente |
| Auditoría previa | `docs/control/auditorias/AUDIT-2026-07-04_*` | ✅ 3 hallazgos RLS + state mgmt + duplicación documentados |
| Estado general | `docs/control/00_ESTADO_GENERAL_PROYECTO.md` | ✅ BLOQUES 1–5 reportados como cerrados |
| Operación | `docs/control/10_OPERACION_CODEX.md` | ✅ Niveles de tarea y gobernanza claros |

**Nota de método**: no ejecuté `git`, `lint` ni `build` (fuera del alcance de esta revisión documental). La verificación es por lectura de fuente y documentación.

---

## 3. FORTALEZAS

1. **Separación de autenticación**: `AuthContext` aislado, con `useAuth()` tipado y manejo explícito de estados (`cargando`, `sin_sesion`, `sin_autorizacion`, `inactivo`, `error`, `autorizado`).
2. **Control de acceso por rol**: `admin` / `terapeuta` / `finanzas` validados en sesión, no solo en UI.
3. **Trazabilidad**: `docs/control/` es una memoria oficial completa (estado, pendientes, decisiones, bitácora, auditorías). Esto es un activo raro y valioso.
4. **Disciplina de seguridad**: se respetan `PROD-001`, ausencia de ejecución remota y sin datos reales. Coherente con `AGENTS.md`.
5. **Tipado fuerte**: páginas y tipos definidos localmente con modelos de datos claros (ver `AgendaOperativa`, `AgendaEventoForm`).

---

## 4. HALLAZGOS Y OBSERVACIONES (POR SEVERIDAD)

### 4.1 ALTO — RLS #3: falta DELETE policies (heredado de AUDIT-2026-07-04)

- **Riesgo**: sin políticas `DELETE` explícitas, la anulación lógica no está garantizada a nivel de base de datos.
- **Impacto en `PROD-001`**: el cierre de `PROD-001` exige anulación lógica y auditoría; este gap lo bloquea técnicamente.
- **Acción**: migración de DELETE policies por tabla operativa antes de cualquier dato real.

### 4.2 MEDIO — RLS #1 / #2: Finanzas sin acceso a vistas de auditoría

- `vista_cobros_estado` y `fotos_elementos_caso` solo permiten admin/terapeuta.
- Limita la conciliación y auditoría de unidades cobrables. Es **por diseño**, pero reduce trazabilidad financiera.
- **Acción**: crear vistas de solo-lectura para `finanzas` (sin descarga de archivos).

### 4.3 MEDIO — `AgendaPage.tsx` es demasiado grande (1.304 líneas)

- Confirma el hallazgo de **state management** de `AUDIT-2026-07-04` (prop drilling / duplicación de estado).
- **Acción sugerida**: extraer `useAgenda` (fetch + estado) y subcomponentes de formulario/modal. Mejora mantenibilidad sin cambiar comportamiento.

### 4.4 MEDIO — Sin contrato único de Design System / tokens

- Existen múltiples CSS (`App.css`, `DashboardPremium.css`, `ClinicalModuleBase.css`, `TypographyElegant.css`, etc.) sin un `DESIGN.md` que fije colores, tipografía, radios y espaciado.
- Riesgo de **deriva visual** entre módulos (relacionado con `UI-009` en pendientes).
- **Acción sugerida**: documentar tokens base en un `DESIGN.md` y referenciarlos desde las hojas CSS.

### 4.5 BAJO — Duplicación de utilidades (~40%)

- `AUDIT-2026-07-04 §3` ya lo señala. Bajo impacto, pero acumula deuda.
- **Acción**: consolidar helpers comunes (`format`, `queries`, `constants`) en un módulo compartido.

### 4.6 BAJO — Posible desfase entre documentos de control

- `01_PENDIENTES_PROYECTO.md` (~123 KB) es ~4× más grande que `00_ESTADO_GENERAL_PROYECTO.md` (~31 KB).
- Riesgo de **drift** entre pendientes y estado real. Sugerir sincronización periódica o sección "fuente de verdad".

---

## 5. RIESGOS Y BLOQUEOS VIGENTES

| Riesgo | Estado | Notas |
|---|---|---|
| `PROD-001` | 🔴 Bloqueante | Uso real con datos sensibles sigue vetado |
| DELETE policies (RLS #3) | 🔴 Bloquea pre-producción | Debe cerrarse antes de datos reales |
| Google Workspace / API pública | ⚪ Fuera de alcance | Requiere aprobación y seguridad |
| Datos reales / Supabase remoto | ⚪ Vetado | Salvo instrucción explícita de Javier |
| Deriva visual entre CSS | 🟡 Observado | Mitigar con `DESIGN.md` |

---

## 6. RECOMENDACIONES PRIORIZADAS

1. **(Alta)** Cerrar RLS #3: migración de DELETE policies + anulación lógica. *Nivel 3 — requiere aprobación Javier.*
2. **(Media)** Crear vistas de auditoría para `finanzas` (RLS #1 / #2).
3. **(Media)** Refactor de `AgendaPage.tsx` → `useAgenda` + subcomponentes.
4. **(Media)** Crear `DESIGN.md` con tokens de UI (cerrar `UI-009`).
5. **(Baja)** Consolidar utilidades duplicadas.
6. **(Baja)** Sincronizar `docs/control` (pendientes vs estado).

---

## 7. TAREAS PROPUESTAS (BORRADOR — requieren aprobación)

| ID | Título | Nivel | Depende de |
|---|---|---|---|
| `BE-020` | DELETE policies tablas operativas | 3 | Aprobación Javier |
| `BE-021` | Vistas auditoría finanzas | 3 | Aprobación Javier |
| `UI-026` | Refactor AgendaPage + hook | 2 | — |
| `UI-009` | Design system DESIGN.md | 2 | — |

---

## 8. CRITERIO DE CIERRE DE ESTA REVISIÓN

1. **Resumen ejecutivo**: proyecto funcional y bien documentado; 1 bloqueo pre-producción (RLS #3).
2. **Alcance**: revisión documental de código fuente y `docs/control`.
3. **Archivos revisados**: `AuthContext.tsx`, `authTypes.ts`, `AgendaPage.tsx`, `App.tsx`, `AUDIT-2026-07-04`, `00_ESTADO`, `01_PENDIENTES`, `10_OPERACION_CODEX`.
4. **Archivos modificados**: ninguno (revisión solo lectura).
5. **Archivos creados**: `docs/control/auditorias/REVISION-CODESIGN-2026-07-04.md`.
6. **Archivos no tocados por restricción**: todo lo funcional, Supabase remoto, `.env`, migraciones, Auth/RLS (no ejecutadas).
7. **Validaciones ejecutadas**: lectura de fuente + cruce con documentación. No se corrió `lint`/`build` (fuera de alcance).
8. **Riesgos pendientes**: RLS #3 (alto), deriva visual (medio), drift documental (bajo).
9. **Recomendación final**: aprobar `BE-020` y `BE-021` como siguientes tareas Nivel 3; ejecutar `UI-026`/`UI-009` en paralelo como Nivel 2. No pasar a datos reales hasta cerrar RLS #3.
10. **PR creado/actualizado**: ninguno (revisión, no cambio de código).

---

*Revisión preparada para Control de Desarrollo. Siguiente paso: Javier aprueba prioridad y autoriza las tareas Nivel 3.*
