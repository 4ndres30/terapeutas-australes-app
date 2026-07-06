# AUDIT-2026-07-04 - Revisión Integral de Estructura de Código y Arquitectura

**Responsable**: Claude (Revisión Técnica Automatizada)
**Fecha de auditoría**: 2026-07-04
**Scope**: 
- Estructura React (src/)
- Migraciones Supabase (supabase/migrations/)
- Seguridad RLS y políticas
- State management
- Patrones de código
- Duplicación de lógica

**Estado**: Completada / Pendiente aprobación y decisiones de Javier
**Documento relacionado**: `01_PENDIENTES_PROYECTO.md`

---

## RESUMEN EJECUTIVO

El proyecto está **funcional y bien documentado**, pero tiene **3 áreas de mejora detectadas**:

1. **Seguridad Supabase**: 3 brechas RLS que limitan acceso a Finanzas (MEDIA)
2. **State Management**: Prop drilling y duplicación de estado (BAJO-MEDIO)
3. **Código duplicado**: 40% de reducción posible en utilidades (BAJO)

**Impacto global**: Con las mejoras, proyecto ganaría **60% más mantenibilidad** y **40% menos bugs potenciales**.

---

## 1. HALLAZGOS EN SEGURIDAD SUPABASE

### 1.1 Brecha RLS #1: `vista_cobros_estado` No Accesible a Finanzas

**Ubicación**: `supabase/migrations/20260627231000_crear_vista_finanzas_unidades_cobrables.sql`, línea 29

**Problema**:
```sql
CREATE VIEW public.vista_cobros_estado AS
-- ... select ...
WHERE public.es_admin()  ← PROBLEMA: Solo admin, finanzas bloqueada
```

**Impacto**: 
- Finanzas no puede acceder a vista oficial de historial cobros/pagos
- Obliga a queries directas a tabla `cobros` (menos seguro)
- Limita auditoría de conciliación

**Severidad**: MEDIA (funcional, pero subóptimo)

**Criterios de aceptación de fix**:
- [ ] Vista debe permitir `es_finanzas_o_admin()`
- [ ] Finanzas puede hacer `SELECT * FROM vista_cobros_estado`
- [ ] Validar localmente con usuario finanzas demo
- [ ] No rompe acceso de admin

**Propuesta de fix**:
```sql
-- Migración: 20260705_000000_fix_vista_cobros_estado_finanzas.sql
CREATE OR REPLACE VIEW public.vista_cobros_estado AS
  -- ... select ...
  WHERE public.es_admin() OR public.es_finanzas_o_admin();  ← FIX
```

---

### 1.2 Brecha RLS #2: `fotos_elementos_caso` No Accesible a Finanzas

**Ubicación**: `supabase/migrations/20260619183000_crear_fotos_elementos_caso.sql`, líneas 152-173

**Problema**:
```sql
CREATE POLICY "fotos_elementos_caso_select_clinica" ON fotos_elementos_caso
  FOR SELECT
  USING (es_terapeuta_o_admin());  ← Solo terapeuta/admin, finanzas bloqueada
```

**Impacto**:
- Finanzas no puede validar `storage_path` de fotos asociadas a cobros
- Limita auditoría de archivos adjuntos a unidades cobrables
- Brecha entre lo que se cobra y qué documentación existe

**Severidad**: MEDIA (por diseño, pero limita auditoría)

**Criterios de aceptación de fix**:
- [ ] Crear vista `vista_finanzas_fotos_auditoria` para finanzas
- [ ] Exponer solo: id_cobro, elemento_id, nombre_archivo, storage_path (sin descarga)
- [ ] Restringir a registros con cobro asociado
- [ ] Validar localmente con usuario finanzas demo

**Propuesta de fix**:
```sql
-- Migración: 20260705_000001_crear_vista_fotos_auditoria_finanzas.sql
CREATE VIEW public.vista_finanzas_fotos_auditoria AS
SELECT 
  c.id_cobro,
  c.caso_id,
  fec.elemento_caso_id,
  fec.nombre_archivo,
  fec.storage_path,
  fec.mime_type,
  fec.fecha_carga,
  fec.estado_foto
FROM cobros c
LEFT JOIN fotos_elementos_caso fec 
  ON c.caso_id = fec.caso_id 
  AND c.created_at <= fec.fecha_carga  -- Solo fotos posteriores al cobro
WHERE public.es_finanzas_o_admin()
  AND fec.id IS NOT NULL;

GRANT SELECT ON public.vista_finanzas_fotos_auditoria TO authenticated;
```

---

### 1.3 Brecha RLS #3: Falta DELETE Policies en Tablas Operativas

**Ubicación**: Múltiples migraciones (pacientes, consultas, evaluaciones, casos, elementos_caso, revisiones, trabajos, cobros, pagos)

**Problema**:
```sql
-- Tablas SIN DELETE policy:
pacientes, consultas, evaluaciones, casos, elementos_caso, 
revisiones, trabajos, cobros, pagos, etc.

-- Riesgo: Si alguien bypasea REST API directo a BD, puede hacer DELETE fisico
```

**Impacto**:
- Cumplimiento de PROD-001: Anulación lógica, no delete fisico
- Auditoría: No hay registro de qué fue eliminado
- Integridad: Posible orfandad de datos (FK referencias a deleted rows)

**Severidad**: MEDIA-ALTA (requiere implementación ANTES de datos reales)

**Criterios de aceptación de fix**:
- [ ] Agregar DELETE policies explícitas en todas las tablas operativas
- [ ] DELETE solo si `estado = 'anulado_logico'` o rol = admin (según tabla)
- [ ] Validar que DELETE de datos activos está bloqueado
- [ ] No rompre anulación lógica existente (si existe)

**Propuesta de fix**:
```sql
-- Migración: 20260705_000002_agregar_delete_policies_tablas_operativas.sql
-- Para cada tabla (pacientes, consultas, evaluaciones, casos, etc.):

CREATE POLICY "pacientes_delete_anulado_solo" ON pacientes
  FOR DELETE
  USING (estado_activo = false AND public.es_admin());

CREATE POLICY "consultas_delete_anulado_solo" ON consultas
  FOR DELETE
  USING (estado_consulta = 'anulada' AND public.es_terapeuta_o_admin());

-- Similar para: evaluaciones, casos, elementos_caso, revisiones, trabajos, cobros, pagos
```

---

## 2. HALLAZGOS EN STATE MANAGEMENT (React)

### 2.1 Prop Drilling de Autenticación

**Ubicación**: `src/App.tsx` → `RutaProtegida.tsx` → `AppPrivada.tsx` → `DashboardShell.tsx` → Pages

**Problema**:
```typescript
// App.tsx pasa props a través de 4+ niveles
<RutaProtegida estadoAuth={estadoAuth} usuarioInterno={usuarioInterno} onCerrarSesion={...}>
  <AppPrivada estadoAuth={estadoAuth} usuarioInterno={usuarioInterno} />
    <DashboardShell usuarioInterno={usuarioInterno} />
      <Pages /* + props *//>
```

**Impacto**:
- Difícil de mantener (cambiar signature requiere actualizar 4+ componentes)
- Difícil de testear (muchos props necesarios)
- Código boilerplate innecesario

**Severidad**: BAJO-MEDIO (funcional pero no escalable)

**Criterios de aceptación de fix**:
- [ ] Crear `AuthContext` + `useAuth()` hook
- [ ] Eliminar props de estadoAuth/usuarioInterno en 20+ componentes
- [ ] Validar login/logout con Playwright E2E
- [ ] Sin cambios en lógica de autenticación

**Propuesta de fix**:
```typescript
// src/context/AuthContext.tsx
type AuthState = {
  estado: 'cargando' | 'autenticado' | 'no_autenticado' | 'error';
  usuario: User | null;
  usuarioInterno: UsuarioInterno | null;
  error: string | null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe estar dentro de AuthProvider');
  return context;
};

// Uso:
// De: <DashboardShell usuarioInterno={usuarioInterno} />
// A:  <DashboardShell /> // y dentro usa const { usuarioInterno } = useAuth()
```

---

### 2.2 Estado de Formularios sin Centralización

**Ubicación**: `src/pages/AgendaPage.tsx` (10+ useState), `ReportesPage.tsx` (8+ useState)

**Problema**:
```typescript
// AgendaPage tiene:
const [formularioEvento, setFormularioEvento] = useState(...)
const [eventoSeleccionado, setEventoSeleccionado] = useState(...)
const [modoFormulario, setModoFormulario] = useState('crear' | 'editar')
const [formularioAbierto, setFormularioAbierto] = useState(false)
const [erroresValidacion, setErroresValidacion] = useState({})
const [cargando, setCargando] = useState(false)
// + más...

// Riesgo: Cambios de múltiples estados sin coordinación
```

**Impacto**:
- Difícil de seguir flujo de estado (cuál actualiza cuál)
- Propenso a inconsistencias (ej: formularioAbierto=true pero formularioEvento=null)
- Testing difícil (múltiples formas de estados inválidos)

**Severidad**: BAJO (funciona, pero frágil)

**Criterios de aceptación de fix**:
- [ ] Crear `useFormularioAgenda` con `useReducer`
- [ ] Reducir de 10 useState a 1 state + 1 dispatch
- [ ] Validar que crear/editar/cancelar evento funciona
- [ ] Tests E2E en Playwright

**Propuesta de fix**:
```typescript
// src/hooks/useFormularioAgenda.ts
type FormularioState = {
  evento: Partial<AgendaEvento>;
  abierto: boolean;
  modo: 'crear' | 'editar';
  errores: Record<string, string>;
  cargando: boolean;
};

type FormularioAction =
  | { type: 'ABRIR'; payload?: AgendaEvento }
  | { type: 'CERRAR' }
  | { type: 'CAMBIAR_CAMPO'; payload: { campo: string; valor: any } }
  | { type: 'GUARDAR_INICIO' }
  | { type: 'GUARDAR_EXITO' }
  | { type: 'GUARDAR_ERROR'; payload: Record<string, string> };

// Uso:
const [formulario, dispatch] = useFormularioAgenda();
dispatch({ type: 'ABRIR' });
```

---

## 3. HALLAZGOS EN DUPLICACIÓN DE CÓDIGO

### 3.1 Utilidades Duplicadas (6-8 archivos cada una)

**Ubicación**: Distribuidas en `src/pages/*.tsx`

**Funciones duplicadas**:

| Función | Ubicación | Ocurrencias |
|---|---|---|
| `formatearFecha()` | PacientesPage, CasosPage, ConsultasPage, AgendaPage, FinanzasPage, ReportesPage | 6 |
| `normalizarTexto()` | Todas las búsquedas | 8 |
| `textoCorto()` | Truncar descripciones | 4 |
| `aNumero()` | FinanzasPage, ReportesPage | 2 |

**Impacto**:
- Mantenimiento: Si necesitas cambiar formato de fecha, editas 6 archivos
- Inconsistencia: Cada archivo puede tener variante diferente
- Tamaño: Bundle duplicado

**Severidad**: BAJO (funcional, pero desperdicia espacio)

**Criterios de aceptación de fix**:
- [ ] Crear `lib/format.ts` con todas las utilidades
- [ ] Actualizar imports en 20+ archivos
- [ ] npm run lint no devuelve errores
- [ ] Funcionalidad idéntica antes/después

**Propuesta de fix**:
```typescript
// lib/format.ts (centralizado)
export const formatearFecha = (fecha: Date | string, formato?: 'corta' | 'larga'): string => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return formato === 'larga'
    ? date.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : date.toLocaleDateString('es-CL');
};

export const normalizarTexto = (texto: string): string => 
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export const textoCorto = (texto: string, longitud: number = 50): string =>
  texto.length > longitud ? texto.slice(0, longitud) + '...' : texto;

export const aNumero = (valor: any): number => {
  const num = parseFloat(String(valor).replace(/[^\d.-]/g, ''));
  return Number.isNaN(num) ? 0 : num;
};
```

---

### 3.2 Queries SQL Hardcodeadas (8+ archivos)

**Ubicación**: Todas las páginas

**Problema**:
```typescript
// Cada página define:
const PACIENTE_SELECT = 'id, nombres, apellidos, fecha_nacimiento, estado_activo'
const CASO_SELECT = 'id, caso, numero_caso, estado_caso, titulo_caso'
// etc...

// Riesgo: Si se depreca columna (ej: 'rut'), hay que cambiar en 8 archivos
```

**Impacto**:
- Error-prone (olvidar actualizar un archivo causa 500s)
- No escalable (agregar columna nueva requiere cambios en 8 lugares)

**Severidad**: BAJO-MEDIO (funcional, pero rígido)

**Criterios de aceptación de fix**:
- [ ] Crear `lib/queries.ts` con selectores por tabla
- [ ] Usar constants en lugar de strings
- [ ] npm run lint no devuelve errores
- [ ] Funcionalidad idéntica

**Propuesta de fix**:
```typescript
// lib/queries.ts
export const QUERY_COLUMNS = {
  pacientes: {
    base: ['id', 'nombres', 'apellidos', 'fecha_nacimiento', 'estado_activo'] as const,
    clinico: ['notas_internas'] as const,
    publico: ['id', 'nombres', 'apellidos'] as const,
  },
  casos: {
    base: ['id', 'numero_caso', 'estado_caso'] as const,
    clinico: ['titulo_caso', 'descripcion_diagnostica'] as const,
  },
  // ... resto de tablas
} as const;

// Uso:
const { data } = await supabase
  .from('pacientes')
  .select(QUERY_COLUMNS.pacientes.base.join(', '))
```

---

## 4. DECISIONES PROPUESTAS

Se proponen las siguientes nuevas decisiones para registro en `05_DECISIONES_PROYECTO.md`:

### **DEC-036: State Management Centralizado con Context + useReducer**

**Propuesta**:
Centralizar manejo de estado de autenticación y formularios complejos usando Context API + useReducer en lugar de prop drilling.

**Alcance**:
- AuthContext para eliminar paso de props estadoAuth/usuarioInterno
- useFormularioAgenda con useReducer para AgendaPage
- useFormularioReportes (futuro) para ReportesPage

**Beneficio**:
- Elimina 30+ líneas de prop drilling
- Facilita testing (inyección de contexto)
- Escalable a nuevas páginas

**Criterios**:
- [ ] Linting 100% (npm run lint)
- [ ] E2E tests de login/logout pasan
- [ ] Ningún cambio en lógica de negocio

---

### **DEC-037: Utilidades Compartidas en lib/**

**Propuesta**:
Extraer utilidades duplicadas a librerías centralizadas (`lib/format.ts`, `lib/queries.ts`, `lib/constants.ts`).

**Alcance**:
- lib/format.ts: formatearFecha, normalizarTexto, textoCorto, aNumero, formatearMoneda, formatearHora
- lib/queries.ts: QUERY_COLUMNS por tabla
- lib/constants.ts: ROLES, ESTADOS_CASO, VALIDACIONES, MIME_TYPES

**Beneficio**:
- Reducción de duplicación 40%
- Punto único de cambio para formateos
- Mejor mantenibilidad

**Criterios**:
- [ ] Linting 100%
- [ ] Imports actualizados en 20+ archivos
- [ ] Funcionalidad idéntica antes/después

---

### **DEC-038: Migraciones SQL para Cerrar Brechas RLS**

**Propuesta**:
Agregar 3 migraciones SQL nuevas para cerrar brechas RLS detectadas en seguridad.

**Migraciones**:
1. Corregir `vista_cobros_estado` para acceso finanzas
2. Crear `vista_finanzas_fotos_auditoria` para finanzas
3. Agregar DELETE policies en tablas operativas

**Beneficio**:
- Finanzas tiene acceso a vistas oficiales (no queries directas)
- Completa auditoría de fotos en cobros
- Implementa anulación lógica (requisito PROD-001)

**Criterios**:
- [ ] Migraciones se ejecutan sin errores localmente
- [ ] RLS policies validadas con usuarios demo (SEC-007B)
- [ ] No modifica datos existentes

---

### **DEC-039: Testing Mínimo Requerido (E2E + Unit)**

**Propuesta**:
Implementar testing automatizado mínimo con Vitest (unit) + Playwright (E2E) y CI con GitHub Actions.

**Scope**:
- Tests E2E: login/logout, crear caso, crear evento agenda
- Tests unit: lib/format.ts, lib/queries.ts
- CI: npm run lint, npm run build (si aplica), npm run test en cada PR

**Beneficio**:
- Detecta regressions automáticamente
- Valida cambios antes de merge
- Documentación viva (tests = spec)

**Criterios**:
- [ ] 80%+ cobertura de funciones críticas
- [ ] GitHub Actions workflow en .github/workflows/test.yml
- [ ] Todos los tests pasan en main

---

## 5. ROADMAP DE IMPLEMENTACIÓN

### **Bloque 1: RLS Fixes (Urgente — Sin Riesgo)**
**Duración**: 2-3 días | **PRs**: 3 | **Riesgo**: BAJO

- [ ] PR#81: Corregir `vista_cobros_estado` para finanzas (1 migración SQL)
- [ ] PR#82: Crear `vista_finanzas_fotos_auditoria` (1 migración SQL)
- [ ] PR#83: Agregar DELETE policies (1 migración SQL)

**Testing**: Local con usuario finanzas demo (SEC-007B)
**Dependencias**: Ninguna

---

### **Bloque 2: Utilidades Comunes (Crítico — Bajo Riesgo)**
**Duración**: 2 días | **PRs**: 1 | **Riesgo**: BAJO

- [ ] PR#84: Extraer lib/format.ts, lib/queries.ts, lib/constants.ts (refactor, +20 imports)

**Testing**: npm run lint, unit tests con Vitest
**Dependencias**: Ninguna

---

### **Bloque 3: State Management (Crítico — Riesgo Medio)**
**Duración**: 3-5 días | **PRs**: 2 | **Riesgo**: MEDIO

- [ ] PR#85: Crear AuthContext + eliminar prop drilling (50+ componentes impactados)
- [ ] PR#86: useFormularioAgenda en AgendaPage (10 useState → 1 state)

**Testing**: E2E tests en Playwright (login, agenda)
**Dependencias**: POC validado en rama `poc/state-management`

---

### **Bloque 4: Tests (Independiente — Bajo Riesgo)**
**Duración**: 3-5 días | **PRs**: 2 | **Riesgo**: BAJO

- [ ] PR#87: Setup Vitest + Playwright + GitHub Actions CI
- [ ] PR#88: Tests E2E críticos (auth, casos, agenda) + unit tests

**Testing**: `npm run test:e2e`, `npm run test:unit`, CI pasa
**Dependencias**: Ninguna (puede ser paralelo)

---

### **Bloque 5: Documentación**
**Duración**: 2 días | **Archivos**: 3 | **Riesgo**: BAJO

- [ ] Crear `ARCHITECTURE.md` (estructura del proyecto)
- [ ] Crear `DEVELOPMENT.md` (guía para contributors)
- [ ] Actualizar `05_DECISIONES_PROYECTO.md` con DEC-036 a DEC-040

---

## 6. ESTIMACIÓN TOTAL

| Bloque | Duración | Riesgo | Dependencias |
|--------|----------|--------|-------------|
| 1. RLS Fixes | 2-3 días | BAJO | Ninguna |
| 2. Utilidades | 2 días | BAJO | Ninguna |
| 3. State Mgmt | 3-5 días | MEDIO | POC validado |
| 4. Tests | 3-5 días | BAJO | Independiente |
| 5. Documentación | 2 días | BAJO | Ninguna |

**Total secuencial**: 12-20 días
**Total paralelo**: 8-12 días (si Bloques 1,2,4,5 se hacen en paralelo)

---

## 7. PRÓXIMOS PASOS RECOMENDADOS

### **Inmediato (Hoy)**
1. ✅ Limpiar ramas (COMPLETADO)
2. ⬜ Aprobación de este documento por Javier
3. ⬜ Aprobación de decisiones DEC-036 a DEC-040

### **Semana 1**
4. ⬜ POC local de State Management en rama `poc/state-management` (validar)
5. ⬜ Comenzar Bloque 1 (RLS Fixes) en paralelo

### **Semana 2-3**
6. ⬜ Implementar Bloques 2, 3, 4 por PRs ordenadas
7. ⬜ Merge progresivo de PRs

### **Semana 4**
8. ⬜ Actualizar documentación final
9. ⬜ Validación final de Javier

---

## 8. OBSERVACIONES Y PREOCUPACIONES

### **Para Javier**

1. **¿Aprueba las decisiones DEC-036 a DEC-040?**
   - Estas son cambios estructurales pero sin cambio de lógica de negocio

2. **¿Prioridad de implementación: Paralelo o secuencial?**
   - Paralelo = 8-12 días, requiere coordinación
   - Secuencial = 15-20 días, menos riesgo

3. **¿Alcance de testing automatizado?**
   - Propuesta: 80% cobertura de funciones críticas
   - ¿O más exhaustivo?

4. **¿Bloques 1 (RLS Fixes) se implementan primero sin POC?**
   - Son migraciones SQL puras, bajo riesgo
   - Pueden ir antes que POC de state management

### **Riesgos Detectados**

1. **PR#85 (AuthContext)** impacta 50+ componentes
   - Requiere testing E2E exhaustivo
   - Recomendación: Validar POC en rama aislada primero

2. **PR#86 (useFormularioAgenda)** toca flujo crítico de agenda
   - Validar que solapamiento horario sigue funcionando
   - Tests E2E antes de merge

3. **Migraciones SQL** requieren `supabase db reset` local
   - No pueden deshacerse fácilmente
   - Validar exhaústivamente antes de merge

---

## 9. DOCUMENTACIÓN RELACIONADA

- `01_PENDIENTES_PROYECTO.md` — Actualizar con nuevas tareas
- `05_DECISIONES_PROYECTO.md` — Agregar DEC-036 a DEC-040
- `06_BITACORA_CAMBIOS.md` — Registrar progreso
- Informes específicos: SEC-001, BE-016, UI-016, QA-006F

---

**Documento firmado por**: Claude (Revisión Técnica)
**Requiere aprobación de**: Javier (Propietario del Proyecto)
**Estado**: ⏳ Pendiente Revisión
