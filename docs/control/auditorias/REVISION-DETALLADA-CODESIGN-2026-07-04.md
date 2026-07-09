> **SUPERADA (2026-07-08).** Los IDs `BE-020`/`UI-026`/`UI-027` que este documento propone (tabla §7) colisionan con decisiones reales ya existentes bajo esos mismos numeros (ver `01_PENDIENTES_PROYECTO.md`) — no se usaron tal cual. D-03 (DELETE policies) ya esta integrado bajo su ID real `BE-021`. D-01 (AuthContext) ya estaba resuelto, como el propio documento reconoce. D-02 (CSS "muerto") es incorrecto: los 3 archivos citados si estan importados y en uso. D-05/D-06/D-07/D-09 siguen vigentes y verificados de nuevo el 2026-07-08 — re-registrados como `UI-031`/`UI-028`/`UI-030`/`UI-029` respectivamente en `01_PENDIENTES_PROYECTO.md`. Se conserva este documento como historial, no como fuente de tareas activas.

# Revisión Detallada — Terapeutas Australes (2026-07-04)

Revisión profunda de código y arquitectura del repositorio `4ndres30/terapeutas-australes-app`
(rama `main`, estado local/demo). Complementa y **reconcilia** la auditoría previa
`AUDIT-2026-07-04_REVISION_ESTRUCTURA_CODIGO.md`, que describe un estado anterior del
código y, en varios puntos, ya está resuelto.

> Restricción respetada: no se ejecutó backend, no se tocaron datos reales, Supabase remoto,
> `.env`, Auth/RLS ni migraciones. La revisión es estática sobre el código fuente actual.

---

## 0. Alcance y método

**Revisado en esta pasada:**
- `src/main.tsx`, `src/App.tsx` (routing + shell)
- `src/context/AuthContext.tsx`, `src/context/authTypes.ts`
- `src/lib/supabase.ts`, `src/lib/queries.ts`, `src/lib/format.ts`
- `src/pages/AgendaPage.tsx`, `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/*` (Revisiones, Trabajos, Pagos, Elementos, DetalleRevisiones)
- `DESIGN.md`, `AGENTS.md`, `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/auditorias/AUDIT-2026-07-04_REVISION_ESTRUCTURA_CODIGO.md`

**No revisado a fondo (pendiente de pasada posterior):** `CasosPage.tsx`, `PacientesPage.tsx`,
`ConsultasPage.tsx`, `EvaluacionesPage.tsx`, `FinanzasPage.tsx`, `ReportesPage.tsx`,
`LoginPage.tsx`, `scripts/`, tests E2E y SQL de migraciones RLS.

---

## 1. Estado general

- Proyecto **funcional en local/demo**, con arquitectura coherente y documentación de control
  excepcionalmente rica (24 documentos de control, bitácora, decisiones, auditorías).
- 186 archivos en workspace; 10 hojas CSS; sin tests de componentes (solo `format.test.ts`,
  `queries.test.ts` y E2E de auth).
- El código de los paneles clínicos es **uniforme y legible**, con validación de formularios
  seria. Esto es un punto fuerte real, no cosmético.

---

## 2. Arquitectura y estructura

**Puntos fuertes (confirmados en código actual):**
- `App.tsx` usa `BrowserRouter` con `RutaProtegidaLayout` y protección por rol
  (`admin` / `terapeuta` / `finanzas`) leyendo `useAuth()`. Limpio y centralizado.
- `DashboardShell` implementa sidebar responsive, menú móvil con `aria-expanded`, cierre con
  `Escape` y `role="dialog"`-style scrim. Buena accesibilidad de base.
- `BloqueoAmbiente` / `IndicadorAmbiente` impiden escribir datos reales por accidente en demo.
  Patrón correcto para respetar `PROD-001`.

**Hallazgo D-01 — Auditoría previa desactualizada en auth/estado.**
`AUDIT-2026-07-04` (secciones 2.1 y 2.4) recomienda "crear `AuthContext` + `useAuth()`" y
describe prop-drilling a través de `RutaProtegida.tsx` / `AppPrivada.tsx`. **Ya resuelto:**
`AuthContext.tsx` existe y los paneles consumen `useAuth()`. Esas secciones de la auditoría
prevía deben marcarse como `RESUELTO` para no inducir trabajo duplicado.

**Hallazgo D-02 — Acumulación de hojas CSS / posible código muerto visual.**
Hay 10 CSS: `index.css`, `App.css`, `ClinicalModuleBase.css`, `CasoDetallePage.css`,
`CasosPage.css`, `PacientesPage.css`, `DashboardPremium.css`, `ReferenceFinalPass.css`,
`ReferencePolish.css`, `TypographyElegant.css`. Los tres últimos (`Reference*`, `DashboardPremium`)
parecen pasadas de pulido experimental. Verificar importación; si no se usan, eliminarlos para
frenar la deriva visual que el propio `DESIGN.md` advierte.

---

## 3. Capa de datos / Supabase

**Hallazgo D-03 — (CRÍTICO, pre-prod) Falta de DELETE policies / anulación lógica.**
Los paneles admiten estados `Anulado` / `Anulada` (`TrabajosCasoPanel`, `RevisionesCasoPanel`)
pero no existe mecanismo de borrado ni anulación lógica con control de rol. Según
`AUDIT-2026-07-04` (RLS #3) y `01_PENDIENTES`, siguen sin confirmar `DELETE` policies.
Es el **bloqueo principal para `PROD-001`** (datos sensibles de pacientes). Recomendación:
definir anulación lógica (`activo=false` + columna `anulado_por`) y policies `DELETE` por rol,
antes de cualquier dato real. → Tarea `BE-020`.

**Hallazgo D-04 — Visibilidad de vistas sensibles (RLS #1 / #1.2).**
`PagosCasoPanel` lee `vista_cobros_estado` y `ElementosCasoPanel`/`fotos_elementos_caso`
implican datos financieros/imágenes de paciente. Su visibilidad depende de `SELECT` policies
explícitas por rol. Debe validarse contra el SQL de migración que `finanzas` vea cobros y
`terapeuta` NO vea importes ajenos. → Tarea `BE-021`.

**Hallazgo D-05 — `lib/queries.ts` es catálogo muerto, no centralización realizada.**
`src/lib/queries.ts` (442 líneas) existe y centraliza `QUERY_COLUMNS`, pero su propio header
dice: *"Las páginas listadas siguen usando sus propias constantes locales"*. En los paneles
revisados (`RevisionesCasoPanel.REVISION_SELECT`, `TrabajosCasoPanel.TRABAJO_SELECT`) se sigue
declarando el SELECT local. Dos caminos válidos: (a) completar la migración caso a caso
importando `QUERY_COLUMNS`; o (b) eliminar `queries.ts` si se prefiere mantener SELECT locales
documentados en cada página. Estado actual = código duplicado con riesgo de desincronización.

**Hallazgo D-06 — Casting `as unknown as` evade el sistema de tipos.**
En varios paneles: `setRevisiones((data || []) as unknown as Revision[])`. Esto bypasea la
seguridad de tipos de `database.types.ts`. Mejor: tipar el payload con los tipos generados de
Supabase o mapear explícitamente. Reduce la superficie de error silencioso. → `UI-028`.

---

## 4. Calidad de componentes / UI

**Hallazgo D-07 — Duplicación estructural de paneles (deuda media-alta).**
`RevisionesCasoPanel`, `TrabajosCasoPanel`, `PagosCasoPanel`, `ElementosCasoPanel` y
`DetalleRevisionesPanel` replican el mismo andamiaje: `useState` carga/búsqueda/mensaje,
`useMemo` filtro normalizado, métricas, lista vacía, y (en algunos) CRUD. Es copy-paste de
React. Extraer un hook `useClinicalList<T>()` + componentes `ClinicalMetrics`,
`ClinicalList`, `ClinicalEmpty` recortaría ~40% del código de paneles y frenaría bugs al
cambiar un patrón (p. ej. la normalización de búsqueda). → `UI-026`.

**Hallazgo D-08 — Validación de formularios: buen nivel.**
`RevisionesCasoPanel.guardarRevision` valida nº duplicado, horas (término ≥ inicio), campos
requeridos y asociación de caso/paciente antes de `insert`. Es el estándar a replicar en los
paneles que aún no tienen alta (p. ej. `TrabajosCasoPanel` es solo lectura hoy).

**Hallazgo D-09 — Campana de notificaciones placeholder.**
El topbar de `DashboardShell` muestra `3` hardcodeado y el botón no tiene handler. O se conecta
a datos reales o se retira para no prometer funcionalidad inexistente en demo.

---

## 5. Design System / UI-UX

- `DESIGN.md` presente con tokens (`primary #2f6f6a`, superficies, radios, tipografía). Bien.
- Los paneles clínicos comparten `ClinicalModuleBase.css` y clases `clinical-*`: buena
  consistencia visual de hecho, aunque no esté todo en un sistema único.
- **Hallazgo D-10 — Contraste/estados:** verificar que los badges de estado (`Anulado`,
  `Cerrado`, `Pendiente`) cumplan AA sobre `surface`, y que `select`/`textarea` tengan
  `focus-visible` visible. Mantener lo que `DESIGN.md` exige en Accessibility.

---

## 6. Conclusiones para revisión

**Positivo (mantener):**
1. Routing y protección por rol centralizados y limpios.
2. `AuthContext`/`useAuth` resuelto (desmiente la auditoría previa).
3. Gate de ambiente demo protege `PROD-001`.
4. Validación de formularios seria en paneles con alta.
5. Documentación de control de primer nivel.

**Crítico pendiente:**
- **D-03 / RLS #3**: sin DELETE policies ni anulación lógica → bloquea uso con datos reales.

**Deuda técnica recomendada priorizar:**
- D-05 / D-07: consolidar `queries.ts` (o borrarlo) y extraer hook/componentes de listas clínicas.
- D-02: limpiar CSS de pulido experimental.
- D-06: tipos generados en vez de `as unknown as`.
- D-09: notification bell placeholder.
- D-04 / D-01.2: validar RLS de vistas financieras/imágenes.

---

## 7. Tareas propuestas (para aprobación de Javier)

| ID | Título | Prioridad | Alcance | Riesgo |
|----|--------|-----------|---------|--------|
| BE-020 | DELETE policies + anulación lógica por rol | Crítica | SQL RLS + UI anular | Medio |
| BE-021 | RLS SELECT de `vista_cobros_estado` y `fotos_elementos_caso` | Alta | SQL RLS | Medio |
| UI-026 | Extraer `useClinicalList` + `Clinical*` compartidos | Media | `src/pages/casos/*` | Bajo |
| UI-027 | Migrar paneles a `QUERY_COLUMNS` o eliminar `queries.ts` | Media | `src/lib/queries.ts`, paneles | Bajo |
| UI-009 | Limpiar CSS de pulido experimental no usado | Baja | 3-4 archivos CSS | Bajo |
| UI-028 | Reemplazar `as unknown as` por tipos generados | Baja | paneles con crud | Bajo |
| UI-029 | Conectar o retirar campana de notificaciones | Baja | `DashboardShell` | Bajo |

**Recomendación de cierre de esta revisión:** El proyecto está en buen pie arquitectónico y
listo para ampliar funcionalidad. La única traba dura para producción es **BE-020** (y su
validación cruzada BE-021). Lo demás es deuda técnica que conviene atacar en bloque antes de
sumar más pantallas, para no duplicar el andamiaje en cada nueva.

---

*Revisión estática. No ejecutada contra Supabase. Validar RLS contra SQL de migración antes
de marcar BE-020/BE-021 como cerrados.*
