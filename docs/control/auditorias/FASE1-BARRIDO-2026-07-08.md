# FASE 1 — Barrido completo de solo lectura (2026-07-08)

Generado por workflow `fase1-barrido-completo-proyecto` (11 agentes en paralelo, solo lectura). Ver [[sesion-2026-07-08-roadmap-gemini-y-auditoria]] en memoria para el contexto completo.

## Indice

- [src/pages/CasosPage.tsx](#src-pages-casospage-tsx)
- [src/pages/PacientesPage.tsx](#src-pages-pacientespage-tsx)
- [src/pages/ConsultasPage.tsx](#src-pages-consultaspage-tsx)
- [src/pages/EvaluacionesPage.tsx](#src-pages-evaluacionespage-tsx)
- [src/pages/FinanzasPage.tsx](#src-pages-finanzaspage-tsx)
- [src/pages/ReportesPage.tsx](#src-pages-reportespage-tsx)
- [src/pages/LoginPage.tsx](#src-pages-loginpage-tsx)
- [migraciones](#migraciones)
- [docs-control-colisiones](#docs-control-colisiones)
- [git-status-triage](#git-status-triage)
- [config-coherencia](#config-coherencia)

---

## src/pages/CasosPage.tsx

**Resumen:** CasosPage.tsx (E:\Proyectos\terapeutas-australes-app\src\pages\CasosPage.tsx, 951 líneas) NO fue migrada a TanStack Query -- sigue con fetch manual secuencial via useEffect+setTimeout(0), a diferencia de Pacientes/Consultas/Evaluaciones/Finanzas ya migradas. El hallazgo más grave es un bug real de manejo de errores: si falla solo la última de 4 consultas encadenadas, TODO el estado (incluidos datos que sí se cargaron bien) se descarta silenciosamente por cómo están diferidos los `set*`. Selects son explícitos (no `select *`) y RLS está correctamente delegada al backend; no hay TODO/FIXME/console.log sospechosos en el archivo.

**7 hallazgos.**

### 1. Manejo de errores y estados de carga — severidad alta

src/pages/CasosPage.tsx:433-483 (`cargarBaseCasos`): las 4 consultas a Supabase (pacientes, consultas, evaluaciones, casos) se ejecutan secuencialmente y los `setPacientes/setConsultas/setEvaluaciones/setCasos` SOLO se llaman al final (líneas 478-482), si las 4 tuvieron éxito. Si únicamente la última consulta (`casos`, línea 467-476) falla, ninguno de los 3 `set` anteriores se ejecuta aunque esas 3 consultas sí hayan traído datos reales del backend — el estado queda en los arrays vacíos iniciales. Esto deja el select de 'Paciente' vacío y el botón 'Guardar caso' deshabilitado (línea 907: `disabled={guardando || pacientes.length === 0}`), mostrando solo 'Error al cargar casos: ...' sin indicar que los pacientes sí existen. Contraste: EvaluacionesPage.tsx usa 3 `useQuery` independientes (líneas 183-204) donde el fallo de una consulta no borra el resultado de las otras.

**Recomendacion:** Migrar a TanStack Query con queries independientes por recurso (como EvaluacionesPage/ConsultasPage), o como mínimo, en el fetch manual, hacer `setPacientes/setConsultas/setEvaluaciones` inmediatamente después de cada `await` exitoso en lugar de diferir todos los `set` al final de la función.

### 2. TanStack Query / patrón de datos — severidad media — NECESITA APROBACION

CasosPage.tsx NO fue migrada a TanStack Query, a diferencia de PacientesPage.tsx (línea 3: `useQuery`), ConsultasPage.tsx (línea 3) y EvaluacionesPage.tsx (línea 3), ya migradas. Sigue con fetch manual en `useEffect` envuelto en `window.setTimeout(..., 0)` (líneas 791-797) — el mismo anti-patrón pre-migración que solo comparten CasoDetallePage.tsx (línea 235), AgendaPage.tsx (línea 869) y ReportesPage.tsx (línea 811), las 4 páginas que quedan pendientes de migrar. Además, tras guardar un caso nuevo (línea 527) actualiza el array local con `setCasos` en vez de invalidar/refetchear vía queryClient, como sí hacen las páginas migradas (ej. EvaluacionesPage.tsx línea 308: `queryClient.invalidateQueries`).

**Recomendacion:** Migrar CasosPage.tsx (y CasoDetallePage.tsx) a TanStack Query siguiendo el mismo patrón ya aplicado en Pacientes/Consultas/Evaluaciones/Finanzas: queries independientes por recurso + `invalidateQueries` tras insert.

### 3. Duplicados sin respaldo en base de datos (condición de carrera) — severidad media — NECESITA APROBACION

La única validación contra dos casos abiertos con el mismo nombre para el mismo paciente es client-side, en `validarFormularioCaso` (CasosPage.tsx líneas 302-311), comparando contra el array `casos` cargado una sola vez al montar el componente. La tabla `public.casos` (supabase/migrations/20260605215000_crear_tabla_casos.sql) no tiene ninguna constraint UNIQUE equivalente, y la policy RLS `casos_select_clinica`/`casos_insert_clinica` (supabase/migrations/20260606055000_activar_rls_y_policies.sql líneas 236-246) es compartida entre todos los usuarios con `es_terapeuta_o_admin()` — es decir, es una tabla clínica compartida entre múltiples terapeutas concurrentes. Dos usuarios guardando casi al mismo tiempo un caso con el mismo nombre para el mismo paciente no serían detectados por ninguno de los dos clientes (cada uno valida solo contra su copia en memoria, no recargada).

**Recomendacion:** Agregar una constraint UNIQUE parcial en BD (ej. sobre `paciente_id, lower(nombre_caso)` filtrando `estado_caso not in ('Cerrado','Anulado')`) para que la regla de negocio no dependa únicamente de una validación de cliente con datos potencialmente obsoletos.

### 4. Comportamiento inconsistente en manejo de tecla Enter — severidad media

CasosPage.tsx líneas 539-543 (`manejarEnterFormulario`): `if (elemento.tagName === 'TEXTAREA') { return }` — es decir, Enter dispara avance de paso o `requestSubmit()` para CUALQUIER elemento que no sea un textarea, incluyendo los `<select>` (paciente, consulta, evaluación, tipo_caso, prioridad, estado_caso) y el checkbox `requiere_seguimiento` (línea 730-738). En cambio PacientesPage.tsx líneas 447-451 usa la regla opuesta y más restrictiva: `if (elemento.tagName !== 'INPUT') { return }`, o sea solo dispara el avance/submit para inputs de texto reales. En CasosPage, presionar Enter mientras el foco está en el checkbox de seguimiento (último paso) puede disparar un submit accidental del formulario completo si `formularioCompleto()` ya es true.

**Recomendacion:** Alinear la condición con el patrón de PacientesPage (restringir a `tagName === 'INPUT'`) o documentar explícitamente por qué CasosPage necesita el comportamiento inverso.

### 5. Seguridad de tipos (as unknown as) — severidad baja

CasosPage.tsx línea 481: `setCasos((casosData || []) as unknown as Caso[])` y línea 527: `setCasos((actuales) => [data as unknown as Caso, ...actuales])`. El cast doble bypasea el chequeo de tipos de la respuesta de Supabase; si el valor real de `tipo_caso`/`prioridad`/`estado_caso` no coincide con los union types declarados (líneas 36-49), o si cambia una columna, TypeScript no lo detecta en compile-time — recién fallaría en runtime al renderizar. El mismo patrón existe también en EvaluacionesPage.tsx línea 134, es decir es sistémico del proyecto (no exclusivo de este archivo), pero nunca se había señalado para CasosPage.

**Recomendacion:** Si se mantiene el patrón, documentarlo como convención aceptada del proyecto (select con string dinámico rompe la inferencia de tipos de supabase-js); si se quiere mejorar, tipar `CASO_SELECT` con `as const` y usar el tipo inferido en vez de castear a `unknown`.

### 6. Columnas seleccionadas pero nunca usadas (sobre-fetching) — severidad baja

CasosPage.tsx línea 436: `.select('id, nombres, apellidos, telefono, email')` trae `telefono` y `email` de pacientes, pero ningún punto del archivo lee `paciente.telefono` ni `paciente.email` (verificado con grep, cero coincidencias). Igual con línea 447: `estado_consulta` de consultas (tipo declarado línea 22) nunca se lee, y línea 458: `decision_revision` de evaluaciones (tipo línea 31) tampoco se lee. No es un `select *`, pero trae más columnas de las que realmente se usan.

**Recomendacion:** Recortar el select a las columnas efectivamente usadas: `id, nombres, apellidos` para pacientes; quitar `estado_consulta` y `decision_revision` de los selects de consultas/evaluaciones en esta página.

### 7. Accesibilidad: foco perdido en avance automático de pasos — severidad baja

CasosPage.tsx líneas 388-394 (`avanzarAlSiguientePasoSiCorresponde`) y 404-431 (`actualizarPaciente`/`actualizarEvaluacion`) cambian `pasoActivo` vía `window.setTimeout(...,180)` tras completar un paso. Esto desmonta el `<section>` activo con sus inputs/selects y lo reemplaza por un `<button>` resumen en el mismo `key` (líneas 753-789: `renderPasoFormulario`). No existe ningún `ref` ni llamada a `.focus()` en todo el archivo (verificado con grep) que reubique el foco en el primer campo del paso siguiente — un usuario de teclado o lector de pantalla pierde el foco justo después de seleccionar el paciente (ya que `fecha_apertura` viene pre-rellenada con la fecha de hoy desde `crearFormularioInicial()`, línea 161, el paso 'origen' se completa con solo elegir paciente). El mismo defecto existe en PacientesPage.tsx líneas 383-401, no es exclusivo de CasosPage pero nunca se había señalado aquí.

**Recomendacion:** Al avanzar de paso, mover el foco explícitamente al primer campo focuseable de la nueva sección activa (por ejemplo con un `ref` sobre el contenedor y `querySelector('input, select, textarea')?.focus()`).

---

## src/pages/PacientesPage.tsx

**Resumen:** PacientesPage.tsx ya migró a TanStack Query (useQuery/useQueryClient, sin fetch manual) y no tiene 'as any'/'as unknown as'/TODOs, pero comparte literalmente el queryKey ['pacientes'] con ConsultasPage y EvaluacionesPage usando shapes de datos distintas (select('*') vs select('id, nombres, apellidos')), lo que puede crashear la página o el guardado justo después de navegar entre esas rutas. También usa select('*') en vez del patrón *_SELECT explícito de sus páginas hermanas, tiene problemas reales de accesibilidad (pérdida de foco al avanzar de paso, aria-hidden sobre botones enfocables, botón de filtros muerto) y su chequeo anti-duplicados vive sólo en el cliente sin respaldo de constraint en BD.

**7 hallazgos.**

### 1. TanStack Query - colisión de queryKey entre páginas — severidad alta — NECESITA APROBACION

PacientesPage.tsx:348 usa queryKey: ['pacientes'] con obtenerPacientes() (línea 137-146) que hace select('*'), trayendo todas las columnas. ConsultasPage.tsx:178 y EvaluacionesPage.tsx:184 usan EXACTAMENTE el mismo queryKey ['pacientes'] pero con su propio obtenerPacientes() que hace select('id, nombres, apellidos') (ConsultasPage.tsx:110, EvaluacionesPage.tsx:100). El QueryClient es único y global (src/main.tsx:7-14) y las 3 páginas viven bajo el mismo <QueryClientProvider>/rutas (src/App.tsx:436-446), así que TanStack Query cachea por clave sin importar qué queryFn la creó.

**Escenario de falla:** Un usuario navega de /consultas o /evaluaciones a /pacientes. React Query muestra de inmediato el dato cacheado bajo la clave ['pacientes'] (shape parcial {id,nombres,apellidos}) porque isLoading es false cuando ya hay datos en caché, mientras dispara el refetch correcto en segundo plano. En ese primer render, pacientes-cards mapea paciente.telefono/paciente.email (undefined en el shape parcial) a mostrarDato() (PacientesPage.tsx:165-167, invocada en líneas 768 y 770), que hace valor.trim() y lanza TypeError, rompiendo el render. Si además el usuario alcanza a pulsar 'Guardar paciente' antes de que el refetch corrija el caché, guardarPaciente (línea 416) llama construirClavePaciente(paciente) sobre esos objetos parciales, y esa función (líneas 183-195, vía normalizarClave línea 149-151) hace .trim() sobre fecha_nacimiento/sexo/telefono/email/comuna/region/estado inexistentes, crasheando el flujo de guardado.

**Recomendacion:** Namespacing de queryKey por página/columnas (p.ej. ['pacientes','completo'] vs ['pacientes','resumen']) o extraer un único hook/queryFn compartido con un shape consistente reutilizado por las 3 páginas.

### 2. Supabase - select('*') en vez de columnas explícitas — severidad alta

obtenerPacientes() en PacientesPage.tsx:137-139 usa .select('*'), mientras que ConsultasPage.tsx (CONSULTA_SELECT, líneas 57-70, usado en :123 y :265), EvaluacionesPage.tsx (EVALUACION_SELECT, usado en :126 y :299) y FinanzasPage.tsx (UNIDAD_COBRABLE_SELECT, :61) definen listas de columnas explícitas como constante, siguiendo la convención documentada del proyecto ('cada página define sus propios *_SELECT'). Como consecuencia, select('*') trae también updated_at (confirmado en src/lib/database.types.ts:708 dentro de Row de pacientes) que ni siquiera existe en el tipo local Paciente (PacientesPage.tsx:8-20).

**Recomendacion:** Definir PACIENTE_SELECT con las columnas realmente usadas por la UI (o agregar updated_at al tipo si se necesita) para alinear con el patrón de las páginas hermanas y evitar sobre-fetch.

### 3. Accesibilidad - pérdida de foco al avanzar de paso — severidad media

avanzarAlSiguientePasoSiCorresponde (PacientesPage.tsx:383-389) cambia pasoActivo automáticamente 180ms después de completar un paso. renderPasoFormulario (líneas 635-671) renderiza el mismo paso como <button className='form-section--summary'> (línea 640-655, inactivo) o <section> (línea 659-670, activo), ambos con key={paso.clave} pero con tipo de elemento distinto, por lo que React desmonta y remonta el nodo al cambiar de tipo aunque la key sea igual, destruyendo el <input> que tenía el foco.

**Escenario de falla:** Un usuario de teclado o lector de pantalla completa el campo 'Fecha de nacimiento' con el foco en ese input; al avanzar automáticamente al paso 'Contacto', el input se desmonta y el foco cae a <body> sin aviso, obligando a recorrer con Tab desde el inicio del documento para llegar al nuevo paso activo.

**Recomendacion:** Al cambiar pasoActivo, mover el foco programáticamente (ref + .focus()) al primer campo del nuevo paso activo.

### 4. Accesibilidad - controles no funcionales y aria-hidden sobre elementos enfocables — severidad media

El botón de filtros (PacientesPage.tsx:717-719) tiene aria-label='Abrir filtros avanzados' pero no tiene onClick ni existe ningún panel de filtros avanzados en el archivo: es una afordancia engañosa que no hace nada. La paginación (líneas 788-795) envuelve dos <button> en un <div aria-hidden='true'> (línea 790); aria-hidden en un contenedor con elementos enfocables es una violación conocida (WCAG 4.1.2 / regla axe 'aria-hidden-focus'), y esos botones tampoco tienen onClick: cantidadVisible y totalPacientes siempre reflejan la lista completa filtrada (no hay lógica de paginación real en el archivo), por lo que la paginación es puramente decorativa pero sigue siendo tabulable con teclado.

**Recomendacion:** Quitar el botón de filtros hasta implementarlo (o cablearlo), y quitar aria-hidden de contenedores con controles enfocables o sacar del tab order los botones de paginación mientras no exista paginación real.

### 5. Manejo de errores - estado de error indistinguible de 'sin datos' — severidad media

Cuando useQuery falla, errorCarga es truthy pero cargando (isLoading) es false y pacientes queda en su default [] (PacientesPage.tsx:344-346). El panel de listado (líneas 736-750) sólo distingue cargando / pacientes.length===0 / pacientesFiltrados.length===0, cayendo en la rama 'Aún no hay pacientes registrados... Completa la ficha de ingreso para crear el primer registro' (línea 742-745) cuando en realidad la carga falló. El mensaje de error real sólo aparece muy por debajo, en el panel del formulario (líneas 379-380, 879-883), fácil de no ver. El mismo patrón (sin rama explícita de error en el listado) se repite en ConsultasPage.tsx:324-325 y EvaluacionesPage.tsx:358-359.

**Recomendacion:** Agregar una rama explícita para errorCarga en el panel de listado con mensaje claro y, si aplica, botón de reintentar (refetch de TanStack Query).

### 6. Seguridad de tipos - sexo/estado tipados como string genérico — severidad baja

Paciente.sexo y Paciente.estado (PacientesPage.tsx:13,18) y FormularioPaciente.sexo/estado (líneas 30,35) están tipados como string plano, a pesar de que sólo existen 4 valores válidos de sexo y 2 de estado (opcionesSexo línea 70-75, opcionesEstado línea 77-80, reforzados por CHECK constraints en supabase/migrations/20260605191957_definir_campos_requeridos_pacientes.sql). Esto contrasta con el patrón ya usado en la página hermana ConsultasPage.tsx:14-27, que sí define uniones estrictas (TipoConsulta, ModalidadConsulta, EstadoConsulta).

**Escenario de falla:** Un valor de string arbitrario (typo, dato migrado mal) compila sin error en cualquier campo tipado como estado/sexo, y sólo el CHECK constraint de la BD lo detiene en producción en vez de en tiempo de compilación.

**Recomendacion:** Definir tipos unión (p.ej. type Sexo = 'femenino'|'masculino'|'otro'|'prefiere_no_decir', type EstadoPaciente='activo'|'inactivo') igual que en ConsultasPage.

### 7. Chequeo de duplicados sólo en memoria (sin constraint en BD) — severidad media — NECESITA APROBACION

guardarPaciente (PacientesPage.tsx:414-422) previene duplicados comparando construirClavePaciente() contra el arreglo pacientes ya cargado en el cliente (dato potencialmente stale, ver hallazgo de colisión de queryKey). La columna rut (que tenía unique constraint) fue eliminada por supabase/migrations/20260605190939_eliminar_rut_de_pacientes.sql y no se agregó ninguna otra constraint de unicidad a nivel de base de datos sobre pacientes.

**Escenario de falla:** Dos inserciones concurrentes (dos pestañas o dos usuarios admin/terapeuta) con los mismos datos exactos pasan ambas el chequeo existeDuplicado (basado en el estado local de cada cliente en ese instante) y ambas se insertan sin que la BD las rechace, generando fichas clínicas duplicadas.

**Recomendacion:** Agregar un índice único parcial o constraint en BD (p.ej. sobre nombres+apellidos+fecha_nacimiento normalizado) si de verdad se quiere garantizar no-duplicación, ya que el chequeo de cliente es sólo una ayuda de UX, no una garantía.

---

## src/pages/ConsultasPage.tsx

**Resumen:** ConsultasPage.tsx ya usa TanStack Query para las dos lecturas (pacientes y consultas), tiene selects con columnas explícitas (nunca `select('*')`) y RLS correctamente configurado en las migraciones para la tabla `consultas`. Sin embargo, el archivo comparte `queryKey` de caché ('pacientes' y 'consultas') con EvaluacionesPage.tsx y PacientesPage.tsx usando shapes de datos distintas para la misma key, lo que genera un bug real y reproducible de "cache pollution" que puede crashear PacientesPage al navegar entre módulos (no hay ErrorBoundary en la app). También arrastra los mismos anti-patrones que sus páginas hermanas: casts "as unknown as" que anulan el cliente Supabase tipado, funciones duplicadas byte-a-byte (`fechaHoy`, `obtenerPacientes`, `nombrePaciente`), el insert sin try/catch/finally, y feedback de guardado sin aria-live. La migración a TanStack Query está a medias: las lecturas sí migraron, pero el guardado sigue con estado manual (`guardando`/`mensajeGuardado`) en vez de `useMutation`, igual que Pacientes y Evaluaciones.

**6 hallazgos.**

### 1. Cache TanStack Query / correctness — severidad alta — NECESITA APROBACION

ConsultasPage.tsx:178 usa `queryKey: ['pacientes']` con `obtenerPacientes()` (líneas 107-118) que sólo trae `id, nombres, apellidos`. La MISMA key literal `['pacientes']` la usa PacientesPage.tsx:348 con un `obtenerPacientes()` distinto (PacientesPage.tsx:136-147, `select('*')`) que trae el registro completo (telefono, email, comuna, region, estado, fecha_nacimiento, created_at). EvaluacionesPage.tsx:97-108/184 repite exactamente la versión estrecha bajo la misma key. Como el QueryClient es único para toda la SPA (src/main.tsx:7-14, sin `staleTime` -> default 0 en TanStack Query v5) y las tres páginas viven bajo el mismo BrowserRouter (src/App.tsx:436-439), al navegar Pacientes -> Consultas -> Pacientes la refetch en background de ConsultasPage sobreescribe el cache 'pacientes' con objetos sin `telefono/email/...`. Al volver a /pacientes, React renderiza primero los datos cacheados (shape estrecha) antes de que resuelva el nuevo fetch, y `mostrarDato(paciente.telefono, 'Sin teléfono')` (PacientesPage.tsx:768 y :165-167) hace `valor.trim()` sobre `undefined`, lanzando un TypeError en render. No hay ErrorBoundary en el árbol (`src/App.tsx`, `src/main.tsx`), por lo que React desmonta toda la app dejando pantalla en blanco. El mismo patrón afecta la key `['consultas']`: ConsultasPage.tsx:187 cachea el objeto completo (12 columnas) y EvaluacionesPage.tsx:193 la misma key con sólo 6 columnas (EvaluacionesPage.tsx:110-121), causando que campos como `hora_inicio`/`resumen_consulta` se vean momentáneamente vacíos al volver a Consultas.

**Recomendacion:** Namespacear las queryKeys según el shape real de los datos (p.ej. `['pacientes','resumen']` vs `['pacientes','completo']`, o extraer un hook compartido `usePacientesResumen()`/`usePacientesCompleto()`), y ajustar los `invalidateQueries` correspondientes en las 3 páginas. Idealmente agregar un ErrorBoundary a nivel de ruta como red de seguridad.

### 2. Seguridad de tipos — severidad media

ConsultasPage.tsx:57-70 construye `CONSULTA_SELECT` con `.join(', ')`, generando un `string` no-literal. En la línea 123 se usa ese string en `.select(CONSULTA_SELECT)`; como el cliente Supabase está tipado (`createClient<Database>` en src/lib/supabase.ts:11), TypeScript no puede inferir columnas desde un string no-literal, y el código compensa en la línea 131 con `(data || []) as unknown as Consulta[]`, un doble cast que anula por completo el chequeo de tipos: un typo o columna renombrada en `CONSULTA_SELECT` seguiría compilando y retornaría `undefined` en runtime sin ninguna advertencia del compilador. En cambio, la línea 110 `.select('id, nombres, apellidos')` sí es un literal (supabase-js puede inferir el shape), pero igual se castea innecesariamente con `as Paciente[]` en la línea 117. El mismo patrón (`SELECT` armado con join + `as unknown as X[]`) se repite en EvaluacionesPage.tsx:57-72/126/134, FinanzasPage.tsx, CasosPage.tsx, CasoDetallePage.tsx, AgendaPage.tsx y ReportesPage.tsx, así que es una convención sistémica del proyecto, no exclusiva de esta página.

**Recomendacion:** Usar `.select(CONSULTA_SELECT).returns<Consulta[]>()` (API nativa de supabase-js v2) o definir `CONSULTA_SELECT` como plantilla literal para permitir inferencia real, eliminando el hop por `unknown`.

### 3. Manejo de errores y estados de carga — severidad media

En `guardarConsulta` (ConsultasPage.tsx:236-278), `setGuardando(true)` (línea 246) no tiene un `finally` que garantice `setGuardando(false)`. El `await supabase.from('consultas').insert(payload).select(CONSULTA_SELECT).single()` (líneas 262-266) no está envuelto en try/catch. Si la promesa rechaza en vez de resolver con `{error}` (p.ej. corte de red a mitad de request, fallo de parseo JSON en supabase-js), la función termina por excepción no capturada y `guardando` queda pegado en `true` para siempre: el botón de submit sigue deshabilitado (línea 508) y el mensaje 'Guardando...' nunca se limpia, sin forma de recuperarse salvo recargar la página completa.

**Recomendacion:** Envolver el insert en try/catch/finally, moviendo `setGuardando(false)` al bloque finally para garantizar que el formulario siempre vuelva a estado usable.

### 4. Duplicación de lógica — severidad baja

Tres funciones están duplicadas byte-a-byte entre ConsultasPage.tsx y EvaluacionesPage.tsx: `fechaHoy()` (ConsultasPage.tsx:88-90 == EvaluacionesPage.tsx:77-79), `obtenerPacientes()` (ConsultasPage.tsx:107-118 == EvaluacionesPage.tsx:97-108, mismo query, mismo mensaje de error, mismo cast) y `nombrePaciente()` (ConsultasPage.tsx:134-140 == EvaluacionesPage.tsx:137-143). `src/lib/format.ts` ya existe específicamente para extraer helpers repetidos entre páginas (ver su comentario de cabecera en format.ts:1-7), pero sólo se extrajeron los helpers de formato puro; este segundo grupo de duplicación (fetch de pacientes + resolución de nombre) reapareció sin consolidarse.

**Recomendacion:** Extraer `obtenerPacientesResumen()` y `nombrePaciente()` a un módulo compartido (p.ej. `src/lib/pacientes.ts`) reutilizado por Consultas y Evaluaciones; esto también resolvería de paso el problema de queryKey del hallazgo #1 si se centraliza en un hook único.

### 5. Accesibilidad — severidad media

El mensaje de resultado de guardado/error (ConsultasPage.tsx:517, `{mensaje && <p className={...}>{mensaje}</p>}`) no tiene `aria-live` ni `role="alert"`, por lo que un usuario de lector de pantalla no recibe ninguna notificación cuando falla la validación (línea 242), cuando falla el guardado (línea 269) o cuando se guarda con éxito (línea 276) — sólo los usuarios videntes ven el cambio de texto. Además, `validarFormulario` (líneas 142-168) sólo retorna un string genérico sin `aria-invalid`/`aria-describedby` ni mover el foco al campo específico que falló (a diferencia de PacientesPage.tsx:409, que al menos salta `pasoActivo` al paso con el error).

**Recomendacion:** Agregar `role="alert"` o `aria-live="polite"` al párrafo de mensaje, y considerar `aria-invalid`/foco automático en el primer campo inválido tras una validación fallida.

### 6. Migración TanStack Query — severidad baja

Las lecturas de esta página ya migraron: `pacientes` (líneas 173-180) y `consultas` (líneas 182-189) usan `useQuery`. Pero el guardado (`guardarConsulta`, líneas 236-278) sigue con `useState` manual (`guardando`, `mensajeGuardado`), llamada directa a `supabase.insert` y `queryClient.invalidateQueries` manual (línea 274) en vez de `useMutation`. Esto iguala exactamente el patrón de PacientesPage.tsx:403-440 y EvaluacionesPage.tsx:269-312 — es decir, ConsultasPage está a la par de sus páginas hermanas ya migradas, pero ninguna de las tres adoptó realmente `useMutation`/`isPending`/`onSuccess`/`onError` de React Query para las escrituras.

**Recomendacion:** Si se decide completar la migración, extraer un `useMutation` compartido para el patrón 'insert + invalidateQueries + mensaje' en las tres páginas clínicas a la vez, para no dejar esta página como la única con el patrón viejo.

---

## src/pages/EvaluacionesPage.tsx

**Resumen:** EvaluacionesPage.tsx ya migró a TanStack Query (commit fd10e87) con manejo de loading/error correcto vía useQuery, y su SELECT usa columnas explícitas (EVALUACION_SELECT) — no 'select *'. El archivo está bien encapsulado en accesibilidad básica (labels envuelven inputs, aria-label en secciones), pero repite verbatim funciones que ya existen en ConsultasPage.tsx (obtenerPacientes, nombrePaciente), usa un doble cast 'as unknown as' para forzar el tipo de la respuesta de Supabase, y la única validación que impide asociar una evaluación a un paciente distinto del de la consulta vive solo en el cliente (validarFormulario), sin trigger de BD equivalente al que sí protege a 'cobros' y 'revisiones' en el mismo esquema.

**6 hallazgos.**

### 1. seguridad-de-tipos — severidad media

src/pages/EvaluacionesPage.tsx:134 hace `return (data || []) as unknown as Evaluacion[]` — doble cast que evade por completo la verificación de tipos del compilador (el `as unknown as` fuerza cualquier forma a `Evaluacion[]`). Si la migración de esquema cambia una columna del SELECT (p.ej. renombran `hora_evaluacion` o cambian `decision_revision` a otro enum), TypeScript no detecta el desalineamiento y el error solo aparece en runtime al leer un campo inexistente. El mismo patrón está en ConsultasPage.tsx:131, FinanzasPage.tsx:68, CasosPage.tsx:481/527, AgendaPage.tsx:519/572, CasoDetallePage.tsx:178 y ReportesPage.tsx:312 — es una convención del proyecto (no hay tipos generados de Supabase), pero sigue siendo una brecha real de type-safety en este archivo.

**Recomendacion:** Generar tipos con `supabase gen types typescript` y tipar el cliente Supabase (`createClient<Database>`) para eliminar el cast forzado, o al menos extraer un validador runtime (zod) para el shape de Evaluacion antes de castear.

### 2. duplicacion-logica — severidad media

src/pages/EvaluacionesPage.tsx:97-108 (`obtenerPacientes`) y :137-143 (`nombrePaciente`) son copias byte-a-byte de ConsultasPage.tsx:107-118 y :134-140 respectivamente. El refactor DEC-037 (jul-2026, ver docs/control/01_PENDIENTES_PROYECTO.md:2295) centralizó formatearFecha/normalizarTexto/aNumero/formatearMoneda/textoCorto en src/lib/format.ts, pero explícitamente no tocó las funciones de fetching de datos como obtenerPacientes ni los helpers de presentación como nombrePaciente, que siguen duplicadas verbatim en al menos 2 páginas.

**Recomendacion:** Extraer `obtenerPacientes` y `nombrePaciente` a un módulo compartido (p.ej. src/lib/pacientes.ts) reutilizable desde ConsultasPage y EvaluacionesPage, análogo a lo hecho con los formatters.

### 3. seguridad-datos-rls — severidad media — NECESITA APROBACION

src/pages/EvaluacionesPage.tsx:150-163 (`validarFormulario`) es la ÚNICA barrera que impide guardar una evaluación cuya `consulta_id` pertenezca a un paciente distinto de `paciente_id` (línea 161: `if (!consulta || consulta.paciente_id !== formulario.paciente_id)`). A nivel de base de datos no existe un trigger equivalente para la tabla `evaluaciones`: comparé contra supabase/migrations/20260606053000_ajustar_relaciones_cobros_evaluaciones_revisiones.sql, que sí implementa `validar_cobro_relaciones()` (líneas 44-58) para que `cobros.paciente_id` coincida con el paciente de la evaluación/consulta referenciada, pero no hay trigger BEFORE INSERT/UPDATE similar en `evaluaciones`. La policy RLS `evaluaciones_insert_clinica` (supabase/migrations/20260606055000_activar_rls_y_policies.sql:219-223) solo exige el rol `terapeuta_o_admin`, sin validar la relación paciente-consulta. Cualquier llamada directa a la API REST de Supabase (con un JWT válido de un usuario terapeuta) puede insertar una evaluación con paciente_id/consulta_id inconsistentes, sin pasar por el formulario.

**Recomendacion:** Agregar un trigger BEFORE INSERT/UPDATE en `public.evaluaciones` (análogo a validar_cobro_relaciones) que verifique `new.paciente_id = (select paciente_id from consultas where id_consulta = new.consulta_id)`.

### 4. manejo-de-errores — severidad baja

src/pages/EvaluacionesPage.tsx:279-311 (`guardarEvaluacion`) no tiene try/catch ni finally alrededor del `await supabase.from('evaluaciones').insert(...)` (línea 296-300). Si esa llamada lanza una excepción no controlada (p.ej. abort de red, error de parseo JSON del cliente) en lugar de devolver `{error}`, el flujo nunca llega a `setGuardando(false)` (línea 311) y el botón 'Guardando evaluación...' queda deshabilitado indefinidamente sin mensaje de error visible. El mismo patrón está en ConsultasPage.tsx:236-278.

**Recomendacion:** Envolver el bloque en try/catch (o usar `.finally(() => setGuardando(false))`) para garantizar que el estado de carga se libere incluso ante excepciones no esperadas.

### 5. accesibilidad — severidad baja

src/pages/EvaluacionesPage.tsx:557 renderiza el mensaje de guardado/error (`<p className={...}>{mensaje}</p>`) sin `aria-live`, a diferencia de otras superficies del proyecto que sí usan `aria-live="polite"` para contenido dinámico (p.ej. PacientesPage.tsx:753). Un usuario de lector de pantalla que dispare 'Guardar evaluación' no será notificado de 'Guardando evaluación...', de un error de validación, ni de la confirmación 'Evaluación guardada correctamente', porque el cambio de texto ocurre fuera de cualquier región anunciada.

**Recomendacion:** Agregar `aria-live="polite"` (o `role="status"`) al contenedor del mensaje de guardado.

### 6. modelo-datos-formulario — severidad baja

supabase/migrations/20260605213000_crear_tabla_evaluaciones.sql:13 define `hora_evaluacion time not null default localtime` como columna obligatoria de la tabla, y el tipo `Evaluacion` en EvaluacionesPage.tsx:31 la declara como `string` no-nula (viene en el SELECT, EVALUACION_SELECT línea 62). Sin embargo, ni `FormularioEvaluacion` (líneas 43-55) ni el payload de inserción `guardarEvaluacion` (líneas 282-294) incluyen `hora_evaluacion`, y el campo tampoco se muestra en ningún punto de la UI de lectura (líneas 363-393). El registro siempre toma la hora del servidor al momento del INSERT en vez de reflejar la hora real reportada por el terapeuta, y el dato queda invisible para quien consulta el registro después.

**Recomendacion:** Si `hora_evaluacion` es clínicamente relevante, agregar un campo de hora al formulario (como ya existe `hora_inicio`/`hora_termino` en ConsultasPage) y mostrarlo en la tarjeta de evaluación; si no es relevante, considerar quitar el `not null` de la columna o documentarlo como dato puramente técnico.

---

## src/pages/FinanzasPage.tsx

**Resumen:** FinanzasPage.tsx ya está migrado a TanStack Query (de hecho fue la página piloto del rollout, commit 338a4f4) y hace selects explícitos (no `select *`), con RLS correctamente reforzada tanto en la vista (`security_invoker=true` + policies `es_finanzas_o_admin()` sobre `cobros`/`pagos`) como en la ruta cliente (App.tsx:447-448); no se encontraron TODO/FIXME/`as any`/console.log. El problema más serio real es que la consulta no pagina ni limita filas mientras PostgREST trunca en 1000 filas (config.toml), lo que puede dejar los totales financieros del dashboard silenciosamente incompletos; el resto de hallazgos son de UX de errores, accesibilidad y duplicación de lógica/tipos ya vista en otras páginas clínicas del proyecto (Consultas, Evaluaciones, Pacientes, Reportes).

**7 hallazgos.**

### 1. Integridad de datos / consultas Supabase — severidad alta

obtenerUnidadesCobrables() (src/pages/FinanzasPage.tsx:58-69) hace `.select(UNIDAD_COBRABLE_SELECT).order(...)` sin `.range()` ni `.limit()`. supabase/config.toml:18 fija `max_rows = 1000` para PostgREST, que trunca el resultado en silencio (sin error) si hay más de 1000 filas en la vista. Los KPIs de la página (`totalCobrado`, `totalPagado`, `saldoPendiente` en líneas 113-115, y el conteo 'Cobros' en línea 118) se calculan 100% client-side sobre ese array potencialmente truncado, sin ningún indicador de que los datos están incompletos. Es la página de Finanzas: si la clínica supera 1000 unidades cobrables, el dashboard mostraría totales financieros incorrectos sin avisar a nadie.

**Recomendacion:** Agregar paginación real (`.range()`) o al menos usar `{ count: 'exact' }` y comparar con el total de filas devueltas para mostrar un aviso ('mostrando N de M') cuando se alcance el límite; idealmente mover las sumas agregadas a una consulta SQL/RPC en vez de sumarlas en el cliente sobre un dataset parcial.

### 2. Manejo de errores / estados de carga — severidad media

El mensaje de error de carga (`mensaje`, derivado de `errorConsulta`) solo se renderiza una vez, dentro de la sección 'Pagos reales' (línea 248). El panel principal 'Cobros reales' (líneas 144-201) nunca lo muestra: si la query falla, ese panel solo dice 'Sin cobros registrados' / 'No hay unidades visibles para este filtro' (líneas 168-170), indistinguible de un estado realmente vacío. Un usuario que solo mira la primera columna no se entera de que hubo un error de carga.

**Recomendacion:** Renderizar el mensaje de error a nivel de página (fuera de ambas secciones) o duplicarlo también en el panel de Cobros, y diferenciar explícitamente el estado 'error' del estado 'vacío' en el texto mostrado.

### 3. Duplicación de lógica entre páginas — severidad baja

La misma vista `vista_finanzas_unidades_cobrables` se consulta con un `UNIDAD_COBRABLE_SELECT`/tipo `UnidadCobrableFinanzas` definidos de forma completamente independiente en dos archivos: FinanzasPage.tsx:7-68 y ReportesPage.tsx:66-141. Ya hay drift real entre ambas copias: `paciente_id` (FinanzasPage.tsx:10,35) y `monto_descuento` (FinanzasPage.tsx:20,45) existen solo en la copia de Finanzas, no en la de ReportesPage.tsx:66-141. Si alguien cambia una columna de la vista y actualiza un solo archivo, la otra copia queda desincronizada sin que TypeScript lo detecte (ambas usan `as unknown as`).

**Recomendacion:** Extraer un módulo compartido (tipo + constante de columnas + función de consulta) para `vista_finanzas_unidades_cobrables`, similar a como ya se hizo con los formatters en src/lib/format.ts.

### 4. Accesibilidad — severidad baja

Las listas que se re-renderizan al escribir en el buscador (`clinical-list`, FinanzasPage.tsx:172 y 219) no tienen `aria-live`, a diferencia de listas equivalentes en PacientesPage.tsx:753 y CasosPage.tsx:848 que sí usan `aria-live="polite"`. Un usuario de lector de pantalla que filtra con el buscador (línea 157-163) no recibe ningún anuncio de que la cantidad de resultados cambió.

**Recomendacion:** Agregar `aria-live="polite"` a los contenedores `clinical-list` de ambos paneles, igual que en PacientesPage/CasosPage.

### 5. Datos no utilizados — severidad baja

`paciente_id` (líneas 10, 35) y `monto_descuento` (líneas 20, 45) se declaran en el tipo y se traen explícitamente en el SELECT, pero no se usan en ningún lugar del componente (ni JSX ni cálculos) — verificado por búsqueda sobre todo el archivo.

**Recomendacion:** Quitar esas dos columnas del SELECT y del tipo si de verdad no se usan, o documentar por qué se traen (ej. para un futuro drill-down por paciente) si es intencional.

### 6. Seguridad de tipos — severidad baja

Línea 68: `return (data || []) as unknown as UnidadCobrableFinanzas[]`. El doble cast anula cualquier verificación estructural entre lo que devuelve Supabase y el tipo declarado a mano; un rename/drop de columna en la vista compilaría igual y fallaría solo en runtime. El mismo patrón exacto aparece en ConsultasPage.tsx:131 y EvaluacionesPage.tsx:134, así que es una convención sistémica del proyecto, no un problema introducido por esta página, pero sigue siendo el hueco de tipos más relevante del archivo.

**Recomendacion:** Si se centraliza la consulta (ver hallazgo de duplicación), validar con un runtime check ligero (zod o manual) al menos en desarrollo, o derivar el tipo desde `UNIDAD_COBRABLE_SELECT` con una utilidad tipada en vez de escribirlo a mano en paralelo.

### 7. Duplicación de lógica de filtro — severidad baja

El `useMemo` de `unidadesFiltradas` (líneas 85-109: normalizarTexto + join de campos + includes) reimplementa el mismo patrón ya presente en ConsultasPage.tsx:204-223 (`consultasFiltradas`) y en PacientesPage.tsx:197-212 (`coincideConBusqueda`), campo por campo distinto pero misma estructura de código.

**Recomendacion:** Extraer un hook compartido tipo `useBusquedaTexto(items, extractorDeCampos, query)` para las tres páginas, en la misma línea del trabajo ya hecho para formatters en lib/format.ts.

---

## src/pages/ReportesPage.tsx

**Resumen:** ReportesPage.tsx nunca había sido auditado a fondo y muestra deuda real: no migró a TanStack Query (a diferencia de Finanzas/Consultas/Evaluaciones/Pacientes ya migradas), reimplementa por completo la resolución de rol que AuthContext ya provee (con 2 llamadas de red redundantes en cada carga), y tiene un bug concreto de estado de carga donde la pantalla de carga desaparece antes de que los datos reales lleguen, mostrando brevemente estados vacíos engañosos. También se detectó una inconsistencia de negocio real: la definición de 'trabajo abierto' en este archivo contradice la usada en TrabajosCasoPanel para el mismo campo, lo que puede mostrar métricas distintas para los mismos datos. Las columnas de Supabase sí se seleccionan explícitamente (sin 'select *') y no se hallaron TODOs/código comentado ni problemas de accesibilidad específicos de este archivo más allá de la línea base ya presente en el resto del proyecto."


**11 hallazgos.**

### 1. Manejo de errores y estados de carga — severidad alta

src/pages/ReportesPage.tsx:818 usa la guarda `if (cargando && !rolActivo) return <PantallaCargaReportes />`. Pero `setRolActivo(rol)` se ejecuta en la línea 778, ANTES de que se resuelvan `cargarDatosClinicos()`/`cargarDatosFinancieros()` (líneas 781, 788, 792) y de que `setDatosClinicos`/`setUnidadesFinancieras` reciban los datos reales (líneas 782-799). En cuanto React re-renderiza tras `setRolActivo`, `!rolActivo` pasa a false y la guarda deja de bloquear el render aunque `cargando` siga en true. Resultado: por un instante se renderiza ReportesAdmin/ReportesTerapeuta/ReportesFinanzas con `datosClinicos`/`unidadesFinancieras` todavía vacíos (estado inicial `crearDatosClinicosVacios()` / `[]`), mostrando mensajes engañosos como 'Sin actividad para mostrar' o 'Sin pagos registrados' antes de que lleguen los datos reales. Verificado con `grep "cargando &&" src/pages` que este patrón de guarda es único de este archivo, no existe en ninguna otra página.

**Recomendacion:** Cambiar la guarda a `if (cargando) return <PantallaCargaReportes />` (quitar `&& !rolActivo`), o mejor, migrar a TanStack Query donde `isLoading` refleja correctamente el estado combinado de todas las queries.

### 2. Duplicación de lógica / Auth — severidad alta — NECESITA APROBACION

src/pages/ReportesPage.tsx:118 (`rolesValidos`) y :156-158 (`esRolUsuario`) son copia byte a byte de src/context/AuthContext.tsx:17 y :26-28. Peor aún, `obtenerRolActivo()` (ReportesPage.tsx:224-248) vuelve a llamar `supabase.auth.getUser()` y a consultar `usuarios_internos` (`.select('rol, activo').eq('id', ...)`), repitiendo exactamente lo que AuthContext ya resolvió y expone vía `useAuth().usuarioInterno.rol`. Es estrictamente redundante: la ruta `/reportes` (src/App.tsx:450-452) ya está envuelta en `<RutaProtegidaLayout rolesPermitidos={rolesValidos}>`, que garantiza `estadoAuth === 'autorizado'` y un `usuarioInterno.rol` ya validado antes de montar ReportesPage. Esto genera 2 round-trips de red innecesarios en cada carga de /reportes, y probablemente explica el hack `setTimeout(..., 0)` en líneas 810-816 para diferir la carga inicial.

**Recomendacion:** Eliminar `obtenerRolActivo`, `esRolUsuario` y `rolesValidos` locales; leer `const { usuarioInterno } = useAuth()` y usar `usuarioInterno.rol` directamente como rol activo.

### 3. TanStack Query / migración pendiente — severidad media — NECESITA APROBACION

src/pages/ReportesPage.tsx:765-816 sigue con `useState`+`useEffect`+`useCallback`+`setTimeout(0)` para la carga inicial, mientras PacientesPage.tsx:343-350, FinanzasPage.tsx:74-81, ConsultasPage.tsx:173-189 y EvaluacionesPage.tsx ya migraron a `useQuery`/`useQueryClient` (confirmado en git log: PRs #97 'pilotar TanStack Query en FinanzasPage', #98 'migrar ConsultasPage y EvaluacionesPage', #99 'migrar PacientesPage'). ReportesPage es la única página de datos del módulo clínico que quedó fuera de esta migración. Consecuencia práctica: sin refetch automático al recuperar foco/reconexión, sin cache compartida, y sujeta al bug de estado de carga descrito arriba (que TanStack Query no tendría, dado que `isLoading` ya refleja el estado combinado).

**Recomendacion:** Migrar a `useQuery` (rol activo -- ver hallazgo de Auth, datos clínicos, datos financieros) siguiendo el mismo patrón que FinanzasPage/ConsultasPage.

### 4. Duplicación de lógica de negocio con inconsistencia real — severidad media — NECESITA APROBACION

`esTrabajoAbierto` en src/pages/ReportesPage.tsx:220-222 excluye `['Cerrado', 'Anulado', 'Completado']` como 'no abierto'. En cambio, src/pages/casos/TrabajosCasoPanel.tsx:97 cuenta como 'Activos' todo trabajo cuyo `estado_trabajo` no sea 'Cerrado' ni 'Anulado' (es decir, ahí 'Completado' SÍ cuenta como activo). Los valores válidos de `estado_trabajo` (constraint en supabase/migrations/20260606051000_crear_modulo_trabajos.sql:158-169) incluyen 'Completado' como estado real y distinto de 'Cerrado'/'Anulado'. Para el mismo conjunto de datos, la tarjeta 'Trabajos abiertos' del Reporte y la tarjeta 'Activos' del panel de Trabajos de un caso mostrarán números distintos y contradictorios apenas existan trabajos en estado 'Completado'.

**Recomendacion:** Unificar el criterio de 'trabajo abierto/activo' en una sola función/constante compartida (p.ej. en lib/) y reutilizarla en ambos archivos.

### 5. Seguridad de tipos — severidad media

src/pages/ReportesPage.tsx:241 hace `const usuario = data as { activo?: boolean; rol?: string }`. El cliente Supabase está tipado con el generic Database (src/lib/supabase.ts:11), y el tipo generado para usuarios_internos.Row (src/lib/database.types.ts:1908-1917) ya define `activo: boolean` y `rol: string` como NO opcionales. El cast reemplaza ese tipo ya correcto por uno más débil (ambos campos opcionales) sin motivo funcional, degradando la seguridad de tipos en vez de aumentarla.

**Recomendacion:** Eliminar el cast y usar directamente el tipo inferido por `.select('rol, activo').maybeSingle()`.

### 6. Seguridad de tipos — severidad media

Los tipos locales en src/pages/ReportesPage.tsx:14-33 (`Consulta.estado_consulta`, `Evaluacion.decision_revision`/`estado_evaluacion`, `Caso.estado_caso`/`prioridad`) se declaran como `string` genérico en vez de reutilizar los union types literales ya existentes para las mismas columnas: `EstadoConsulta` (ConsultasPage.tsx:27), `DecisionRevision`/`EstadoEvaluacion` (EvaluacionesPage.tsx:23), `EstadoCaso`/`PrioridadCaso` (CasosPage.tsx:48-49). Esto hace que comparaciones como `caso.estado_caso === 'Abierto' || caso.estado_caso === 'En proceso'` (línea 213) o `evaluacion.decision_revision === 'Sí requiere revisión'` (línea 439) no se verifiquen en tiempo de compilación contra el conjunto real de valores válidos: un typo o un rename futuro de un estado en CasosPage/EvaluacionesPage no rompería la compilación de ReportesPage, solo dejaría de contar silenciosamente esos registros.

**Recomendacion:** Extraer los union types compartidos a un módulo común y reutilizarlos en ReportesPage en vez de `string`.

### 7. Duplicación de lógica — severidad baja

`UNIDAD_COBRABLE_SELECT` y el tipo `UnidadCobrableFinanzas` (src/pages/ReportesPage.tsx:66-141) están duplicados casi campo por campo con FinanzasPage.tsx:7-55 (ReportesPage omite `paciente_id` y `monto_descuento`). `cargarDatosFinancieros` (ReportesPage.tsx:297-314) reimplementa la misma consulta y el mismo cast `as unknown as UnidadCobrableFinanzas[]` (línea 312, patrón idéntico en FinanzasPage.tsx:68) que `obtenerUnidadesCobrables` en FinanzasPage.tsx:58-69. Cualquier cambio futuro en la vista `vista_finanzas_unidades_cobrables` exige sincronizar manualmente ambos archivos.

**Recomendacion:** Extraer `UNIDAD_COBRABLE_SELECT`, el tipo y la función de carga a un módulo compartido (p.ej. lib/finanzas.ts) reutilizado por ambas páginas.

### 8. Manejo de estados de carga (rendimiento percibido) — severidad baja

Para `rol === 'admin'`, src/pages/ReportesPage.tsx:788-796 espera primero `await cargarDatosClinicos()` (línea 788, que internamente ya paraleliza 8 queries) y solo después lanza `await cargarDatosFinancieros()` (línea 792), en vez de lanzar ambas cargas en paralelo con `Promise.all`, pese a ser independientes entre sí. Esto duplica innecesariamente el tiempo de espera percibido para el rol admin.

**Recomendacion:** Usar `Promise.all([cargarDatosClinicos(), cargarDatosFinancieros()])` cuando `rol === 'admin'`.

### 9. Consistencia UI / mensajes de error — severidad baja

En src/pages/ReportesPage.tsx:718, 739 y 759, `mensaje` siempre se renderiza con `className="clinical-message"` sin condicional. Todas las demás páginas del módulo clínico (FinanzasPage.tsx:248, ConsultasPage.tsx:517, EvaluacionesPage.tsx:557, CasoDetallePage.tsx:306, AgendaPage.tsx:954-955 y los paneles de casos/*) usan `className={mensaje.startsWith('Error') ? 'clinical-message clinical-message--error' : 'clinical-message'}` para diferenciar visualmente errores de avisos. Además, los mensajes de error que lanza esta página (líneas 228, 238, 244 y el catch de línea 804) nunca llevan el prefijo 'Error:' que sí usan las demás páginas, así que ni siquiera aplicando la condición se detectarían como error sin ajustar también el texto.

**Recomendacion:** Prefijar los mensajes de error reales con 'Error:' y aplicar `clinical-message--error` condicionalmente, igual que en el resto del módulo.

### 10. Duplicación de lógica menor — severidad baja

`esPrioridadAlta` (src/pages/ReportesPage.tsx:216-218, filtro 'Alta' || 'Urgente') reimplementa el mismo filtro ya inline en src/pages/casos/ElementosCasoPanel.tsx:269. El cálculo de 'evaluaciones que requieren revisión' (ReportesPage.tsx:438-441, `decision_revision === 'Sí requiere revisión'`) duplica exactamente el mismo filtro ya usado en src/pages/EvaluacionesPage.tsx:248.

**Recomendacion:** Baja prioridad; considerar centralizar solo si se agrupan más reglas de negocio compartidas entre páginas.

### 11. Limpieza de tipos — severidad baja

`Metrica` (src/pages/ReportesPage.tsx:100-104) e `Indicador` (líneas 106-110) declaran exactamente la misma forma (`{ etiqueta: string; valor: string; detalle: string }`) con nombres distintos y sin diferencia semántica real; se usan de forma intercambiable en el archivo.

**Recomendacion:** Unificar ambos tipos en uno solo (p.ej. `TarjetaResumen`).

---

## src/pages/LoginPage.tsx

**Resumen:** LoginPage.tsx es un componente chico (93 líneas) sin selects propios, sin casts inseguros y sin TODOs, pero nunca había sido auditado y tiene brechas reales: no captura excepciones de signInWithPassword (que el propio SDK puede lanzar, confirmado en el código fuente de @supabase/auth-js), lo que puede dejar el botón de login bloqueado indefinidamente; muestra un mensaje de error genérico que descarta error.message/code, rompiendo el patrón que sí siguen CasosPage/ConsultasPage/EvaluacionesPage/PacientesPage; duplica literalmente el tipo EstadoAuth en vez de importarlo de authTypes.ts; y sus mensajes de estado carecen de aria-live pese a que el mismo repo ya tiene el patrón correcto en App.tsx. TanStack Query no aplica a esta página (no hay listas que leer, solo una mutación de auth manual, igual que el resto del proyecto).

**5 hallazgos.**

### 1. Manejo de errores / estados de carga — severidad alta

src/pages/LoginPage.tsx:29-32 llama `await supabase.auth.signInWithPassword(...)` sin try/catch. Verifiqué en node_modules/@supabase/auth-js/dist/main/GoTrueClient.js:851-903 que el método SÍ puede lanzar una excepción (no solo devolver {error}): captura internamente con try/catch pero en la línea 898-903 hace `if (isAuthError(error)) return {...}; throw error` — es decir, cualquier error que no sea un AuthError (fallo de red, fetch bloqueado, JSON inválido) se re-lanza. Como `iniciarSesion` no tiene try/catch/finally, ese throw ocurre después de `setEnviando(true)` (línea 26) y antes de `setEnviando(false)` (líneas 36/40), dejando el botón de submit deshabilitado permanentemente con el texto 'Validando...' (línea 83), sin ningún mensaje de error, y sin ninguna forma de recuperarse salvo recargar la página completa.

**Recomendacion:** Envolver el bloque en try/catch/finally: en el catch, mostrar un mensaje de error genérico de red y en el finally hacer setEnviando(false) para garantizar que el botón siempre se reactive.

### 2. Manejo de errores / consistencia con el resto del proyecto — severidad media

src/pages/LoginPage.tsx:34-35 siempre muestra el mismo mensaje estático `mensajeLoginFallido` (definido en línea 15-16) sin importar el `error.code`/`error.message` real devuelto por Supabase (credenciales inválidas, email no confirmado, rate-limit 429, etc.). Esto rompe el patrón usado en el resto del proyecto: CasosPage.tsx:522 (`Error al guardar caso: ${error.message}`), ConsultasPage.tsx:269, EvaluacionesPage.tsx:303 y PacientesPage.tsx:430 todos interpolan `error.message` en el mensaje visible al usuario. En Login, además, el error ni siquiera se loguea a consola para diagnóstico.

**Recomendacion:** Mostrar (o al menos loguear con console.error) error.code/error.message para poder diferenciar credenciales inválidas de rate-limit o caídas del servicio de auth, siguiendo el mismo patrón que ya usan las demás páginas.

### 3. Duplicación de tipos — severidad media

src/pages/LoginPage.tsx:6 redeclara literalmente el tipo `EstadoAuth` (`'cargando' | 'sin_sesion' | 'autorizado' | 'sin_autorizacion' | 'inactivo' | 'error'`) en vez de importarlo desde src/context/authTypes.ts:15, donde ya existe el mismo tipo exportado y usado por AuthContext.tsx. Son dos fuentes de verdad idénticas hoy, pero cualquier cambio futuro al enum en authTypes.ts (agregar/quitar un estado) rompe la compilación en el sitio de uso (App.tsx:433) en vez de fallar de forma clara en LoginPage.tsx.

**Recomendacion:** Eliminar la declaración local y hacer `import type { EstadoAuth } from '../context/authTypes'`.

### 4. Accesibilidad — severidad baja

src/pages/LoginPage.tsx:51-52 renderiza los mensajes de error/estado (`mensajeAuth`, `mensajeLogin`) en simples `<p>` sin `role="alert"` ni `aria-live`. El mismo repo ya tiene el patrón correcto para esto en src/App.tsx:217 (`<section ... role="alert" aria-live="assertive">` en BloqueoAmbiente). Sin esto, un usuario de lector de pantalla que falla el login, o cuyo estadoAuth cambia asíncronamente de 'cargando' a 'sin_autorizacion'/'error'/'inactivo' tras cargarSesionInicial, no recibe ningún anuncio de que apareció un mensaje nuevo.

**Recomendacion:** Agregar `role="alert" aria-live="assertive"` (o al menos `aria-live="polite"`) a los `<p>` de mensajeAuth y mensajeLogin, igual que en BloqueoAmbiente.

### 5. Consistencia de estilo (promesas) — severidad baja

Dentro del mismo archivo hay una inconsistencia: LoginPage.tsx:55 usa `onClick={() => void onCerrarSesion()}` (descarta la promesa explícitamente con `void`, señalando intención), pero LoginPage.tsx:59 pasa `onSubmit={iniciarSesion}` directo, sin envolver con `void`, siendo que es justamente esa promesa la que puede rechazar sin ser capturada (ver hallazgo de try/catch faltante).

**Recomendacion:** Si se agrega el try/catch del hallazgo 1, mantener consistencia usando `onSubmit={(event) => void iniciarSesion(event)}` como en el resto del archivo.

---

## migraciones

**Resumen:** Auditadas las 28 migraciones de supabase/migrations/ (2026-06-05 a 2026-07-06). El formato de nombre (14 dígitos correlativos, sin guion bajo en el bloque fecha) es correcto en las 28, sin repetir el bug histórico documentado. Se encontraron 2 problemas reales de RLS: la migración 20260704000002 crea 9 policies DELETE que quedan inertes porque nunca se otorgó el GRANT DELETE subyacente (solo usuarios_internos lo tiene), y vista_finanzas_fotos_auditoria (20260704000001) es la única de 6 vistas sin security_invoker=true; además 9 tablas (revision_*, trabajo_elementos/sesiones/acciones, fotos_elementos_caso, solicitudes_agenda, agenda_eventos) nunca recibieron ninguna policy DELETE. El historial de RUT y las 4 recreaciones de vista_cobros_estado son reversiones/duplicaciones ya documentadas en la memoria del proyecto (DEC-038) y su estado final es correcto.

**5 hallazgos.**

### 1. RLS - políticas DELETE inertes por falta de GRANT — severidad alta — NECESITA APROBACION

supabase/migrations/20260704000002_agregar_delete_policies_tablas_operativas.sql:14-65 crea 9 policies FOR DELETE (pacientes, consultas, evaluaciones, casos, elementos_caso, revisiones, trabajos, cobros, pagos) pero el único GRANT ... DELETE de toda la serie de 28 migraciones es para usuarios_internos (supabase/migrations/20260606055000_activar_rls_y_policies.sql:118-120). El proyecto revoca todo explícitamente (20260606055000:91-93 `revoke all privileges on all tables in schema public from authenticated`) y supabase/config.toml:19-24 confirma que no hay exposición implícita de tablas nuevas. Verificado con `grep -ni "grant.*delete" supabase/migrations/*.sql` -> 1 sola coincidencia (usuarios_internos). Sin GRANT DELETE, cualquier intento de DELETE de `authenticated` falla en la capa de privilegios ("permission denied for table X") antes de que Postgres evalúe la policy: las 9 policies nunca se ejecutan. Hoy no rompe nada visible porque no existe ningún `.delete()` en src/ ni en supabase/functions/ (verificado por grep), pero el propósito completo de esa migración ("Implementar anulación lógica... antes de permitir DELETE") es actualmente no-funcional.

**Recomendacion:** Nueva migración con `GRANT DELETE ON TABLE public.pacientes, public.consultas, public.evaluaciones, public.casos, public.elementos_caso, public.revisiones, public.trabajos, public.cobros, public.pagos TO authenticated;` (no modificar la migración ya aplicada). Verificar con un DELETE real de prueba tras aplicar.

### 2. RLS - vista sin security_invoker=true — severidad alta — NECESITA APROBACION

supabase/migrations/20260704000001_crear_vista_fotos_auditoria_finanzas.sql:17-35 crea `vista_finanzas_fotos_auditoria` con `CREATE VIEW` y nunca fija `security_invoker=true`. Es la única vista de las 6 del proyecto sin ese ajuste: vista_cobros_estado lo tiene en 20260606055000:89 y 20260627231000:32; vista_finanzas_unidades_cobrables en 20260627231000:96; vista_agenda_operativa en 20260701040000:349; vista_riesgo_abandono_casos en 20260706000001:88 (confirmado con `grep -n "create.*view\|security_invoker" supabase/migrations/*.sql`). Sin security_invoker=true, la vista corre con los privilegios del owner (rol de migración, normalmente con bypass de RLS), así que la única barrera real es el `WHERE public.es_finanzas_o_admin()` hardcodeado en la línea 32 -- funciona hoy, pero rompe el patrón de doble capa (RLS de tabla + security_invoker) que usa el resto del proyecto, y quedaría sin protección de RLS de tabla si alguien edita la vista sin tocar ese WHERE. Además, a diferencia de todas las demás migraciones de vistas, esta no hace `revoke all ... from public/anon/authenticated` antes del `GRANT SELECT` (línea 35) -- inconsistente aunque no explotable dado el default-deny confirmado en supabase/config.toml.

**Recomendacion:** Nueva migración: `ALTER VIEW public.vista_finanzas_fotos_auditoria SET (security_invoker = true);` y agregar el revoke explícito por consistencia con el resto de vistas.

### 3. RLS - cobertura DELETE incompleta (independiente del hallazgo de GRANT) — severidad media — NECESITA APROBACION

9 tablas tienen SELECT/INSERT/UPDATE pero jamás recibieron ninguna policy DELETE en ninguna migración: revision_elementos, revision_aspectos, revision_hallazgos, trabajo_elementos, trabajo_sesiones, trabajo_acciones (todas otorgadas solo hasta UPDATE en supabase/migrations/20260606055000_activar_rls_y_policies.sql:97-111), fotos_elementos_caso (policies solo SELECT/INSERT/UPDATE en supabase/migrations/20260619183000_crear_fotos_elementos_caso.sql:150-173), y solicitudes_agenda/agenda_eventos (policies solo SELECT/INSERT/UPDATE en supabase/migrations/20260701040000_crear_modelo_agenda_operativa.sql:366-414). La migración titulada "Agregar DELETE policies en tablas operativas" (20260704000002) cubrió solo 9 de las ~19 tablas no-usuarios_internos, dejando fuera justo las tablas hijas de revisiones/trabajos y las 2 tablas de agenda que ya existían cuando esa migración se escribió (20260701040000 es anterior a 20260704000002). resumenes_agenda_semanal es la excepción intencional y bien documentada (solo SELECT vía policy, escritura por service role desde Edge Function -- comentario en 20260706000000:38), por lo que no se cuenta como gap.

**Recomendacion:** Decidir explícitamente (y documentar en docs/control) si estas 9 tablas deben tener DELETE admin-gated igual que las otras 9, o si la ausencia es intencional (tablas de detalle/auditoría append-only). Si se decide agregarlo, incluir también el GRANT DELETE correspondiente para evitar repetir el hallazgo anterior.

### 4. Migraciones que revierten/duplican a otras (historial ya documentado, no es bug vivo) — severidad baja

(a) RUT: supabase/migrations/20260605190001_normalizar_rut_pacientes.sql agrega función+trigger de normalización de RUT; 9 minutos después supabase/migrations/20260605190939_eliminar_rut_de_pacientes.sql:1-14 revierte todo (drop trigger/function/constraint/index/column). Ya documentado en memoria del proyecto. (b) vista_cobros_estado fue creada/recreada 4 veces: 20260606052000_crear_modulo_pagos.sql:358 (creación, sin WHERE) -> 20260606053000_ajustar_relaciones_cobros_evaluaciones_revisiones.sql:175-205 (drop+recreate, agrega columnas evaluacion_id/revision_id) -> 20260627231000_crear_vista_finanzas_unidades_cobrables.sql:1-32 (recreate agregando `WHERE public.es_admin()`, restringía a Finanzas por error) -> 20260704000000_fix_vista_cobros_estado_finanzas.sql:22-51 (recreate cambiando WHERE a `es_finanzas_o_admin()`). Esto corresponde exactamente al historial DEC-038 ya registrado en la memoria del proyecto (PR #85); el estado final es correcto y security_invoker=true se preserva correctamente a través de la cadena de CREATE OR REPLACE VIEW (la lista de columnas nunca se redujo).

**Recomendacion:** Ninguna acción requerida; se deja constancia porque el prompt pidió identificar migraciones que dupliquen/reviertan.

### 5. Inventario completo y verificación de formato de nombre de archivo — severidad baja

Hay 28 migraciones en supabase/migrations/, rango 20260605175342 a 20260706000001 (2026-06-05 a 2026-07-06). Verificación de formato (14 dígitos correlativos antes del primer guion bajo, sin guion bajo dentro del bloque fecha/hora): las 28 pasan -- verificado extrayendo la longitud del prefijo antes del primer '_' en cada archivo, todas dan 14, orden estrictamente ascendente, sin duplicados. No se repite el bug real documentado en la memoria del proyecto (refactor-extract-utilities-jul-2026.md) donde 20260704_000000/1/2 con guion bajo colisionaban en versión '20260704' en `supabase db reset`. Lista completa: 20260605175342_crear_tabla_pacientes, 20260605190001_normalizar_rut_pacientes, 20260605190939_eliminar_rut_de_pacientes, 20260605191154_limpiar_columnas_pacientes, 20260605191957_definir_campos_requeridos_pacientes, 20260605203000_crear_tabla_consultas, 20260605211000_agregar_trigger_updated_at_pacientes, 20260605213000_crear_tabla_evaluaciones, 20260605215000_crear_tabla_casos, 20260606032000_crear_tabla_elementos_caso, 20260606040000_crear_tabla_revisiones, 20260606041000_crear_tabla_revision_elementos, 20260606042000_crear_tabla_revision_aspectos, 20260606043000_crear_tabla_revision_hallazgos, 20260606050000_ampliar_revision_cuerpos_sutiles_y_traumas, 20260606051000_crear_modulo_trabajos, 20260606052000_crear_modulo_pagos, 20260606053000_ajustar_relaciones_cobros_evaluaciones_revisiones, 20260606054000_crear_tabla_usuarios_internos, 20260606055000_activar_rls_y_policies, 20260619183000_crear_fotos_elementos_caso, 20260627231000_crear_vista_finanzas_unidades_cobrables, 20260701040000_crear_modelo_agenda_operativa, 20260704000000_fix_vista_cobros_estado_finanzas, 20260704000001_crear_vista_fotos_auditoria_finanzas, 20260704000002_agregar_delete_policies_tablas_operativas, 20260706000000_crear_tabla_resumenes_agenda_semanal, 20260706000001_crear_vista_riesgo_abandono_casos.

**Recomendacion:** Ninguna acción requerida sobre el formato; mantener la convención de 14 dígitos corridos al crear nuevas migraciones.

---

## docs-control-colisiones

**Resumen:** Mas alla de BE-020/BE-021/UI-026/UI-027 (ya corregidos), la revision encontro contradicciones reales y verificables: tres fichas de detalle en 01_PENDIENTES_PROYECTO.md (RFC-002, UI-024, SEC-008B) tienen texto de Estado copiado de otra tarea que contradice tanto la tabla del mismo archivo como el resto de la documentacion. Ademas, 05_DECISIONES_PROYECTO.md (DEC-036/037/038/039) y las fichas de detalle de BLOQUE-1/2/3-RLS/UTIL/AUTH en 01_PENDIENTES_PROYECTO.md nunca se actualizaron tras el merge real a main confirmado por LOG-081/git log, y existen dos pares de archivos de auditoria (CTRL-010 y CTRL-011) que reutilizan el mismo codigo para tareas distintas con estados distintos.

**11 hallazgos.**

### 1. 01_PENDIENTES_PROYECTO.md — RFC-002 — severidad alta

docs/control/01_PENDIENTES_PROYECTO.md:46 (tabla 'Vista rapida') marca RFC-002 como 'Pendiente', pero la ficha de detalle del mismo archivo en docs/control/01_PENDIENTES_PROYECTO.md:583 dice '**Estado:** Validada local/demo en Agenda desktop/mobile' — texto que no tiene nada que ver con RFC-002 (detectar duplicidades entre entidades clinicas) y parece copiado de UI-020/QA-009. docs/control/02_REVISION_FLUJO_CLINICO.md:156 y docs/control/00_ESTADO_GENERAL_PROYECTO.md:73 confirman que RFC-002 sigue sin ejecutarse ('Pendiente' / listada en 'En revision / planificacion').

**Recomendacion:** Corregir la linea 583 de 01_PENDIENTES_PROYECTO.md para que diga 'Pendiente' (o el estado real vigente), eliminando el texto copiado de otra tarea.

### 2. 01_PENDIENTES_PROYECTO.md — UI-024 — severidad alta

docs/control/01_PENDIENTES_PROYECTO.md:99 (tabla) marca UI-024 como 'Pendiente', pero la ficha de detalle en docs/control/01_PENDIENTES_PROYECTO.md:1628 dice '**Estado:** Ejecutada local/demo con observacion' (contenido que no corresponde a UI-024 — recuperacion de cuenta/MFA — sino a otra tarea). Contradice ademas docs/control/auditorias/QA-006E_VALIDACION_AUTH_LOCAL_DEMO.md:23,63,94 y docs/control/auditorias/QA-006_PLAN_BASE_PRUEBAS_ROLES.md:76,87, que tratan UI-024 como no implementada todavia.

**Recomendacion:** Corregir la linea 1628 para reflejar 'Pendiente', consistente con el resto de la documentacion y con que UI-024 (recuperacion/MFA) no se ha implementado.

### 3. 01_PENDIENTES_PROYECTO.md — SEC-008B — severidad alta

docs/control/01_PENDIENTES_PROYECTO.md:78 (tabla) marca SEC-008B como 'Pendiente', pero la ficha de detalle en docs/control/01_PENDIENTES_PROYECTO.md:955 dice '**Estado:** QA-006B autenticada local/demo / observaciones UI-023' — texto ajeno a SEC-008B (cierre de signup/provisioning). Contradice docs/control/auditorias/QA-006E_VALIDACION_AUTH_LOCAL_DEMO.md:22,62,93, docs/control/auditorias/QA-006_PLAN_BASE_PRUEBAS_ROLES.md:75,84 y docs/control/auditorias/CTRL-012_CIERRE_BLOQUE_QA_FINANZAS.md:59, que siguen listando SEC-008B como pendiente.

**Recomendacion:** Corregir la linea 955 para que diga 'Pendiente', igual que el resto del documento.

### 4. 05_DECISIONES_PROYECTO.md — DEC-036/037/038/039 vs realidad ya mergeada — severidad alta

docs/control/05_DECISIONES_PROYECTO.md:54-57 (tabla) y sus fichas de detalle en lineas 1108, 1139, 1169 y 1203 describen DEC-036/037/038/039 como 'POC en validacion tecnica', 'implementacion en curso', 'migraciones sin aplicar' y 'pendiente implementacion' respectivamente — como si los bloques del roadmap del 2026-07-04 siguieran sin fusionarse. Sin embargo docs/control/01_PENDIENTES_PROYECTO.md:113-116 (tabla actualizada el 2026-07-06 por el commit 5bb32a0) y docs/control/06_BITACORA_CAMBIOS.md:3628 (LOG-081, 'Bloques 1, 2 y 3 (DEC-036/037/038) mergeados a main (PR #85-#90)') confirman que ya estan mergeados a main, verificado tambien contra `git log` (PR #85-#91 existen en main). 05_DECISIONES_PROYECTO.md nunca fue actualizado tras el merge.

**Recomendacion:** Actualizar el Estado de DEC-036/037/038/039 en 05_DECISIONES_PROYECTO.md (tabla y fichas) para reflejar que ya estan mergeados a main via PR #85-#91, referenciando LOG-081/LOG-082.

### 5. 01_PENDIENTES_PROYECTO.md — BLOQUE-1-RLS/BLOQUE-2-UTIL/BLOQUE-3-AUTH (auto-contradiccion) — severidad alta

Dentro del mismo archivo docs/control/01_PENDIENTES_PROYECTO.md, la tabla (lineas 113-115) dice 'Mergeado a `main`' para los 3 bloques, pero las fichas de detalle mas abajo (lineas 2267, 2284, 2303) siguen diciendo 'pendiente PR' / 'pendiente revision final de Javier y PR' para los mismos codigos. El commit 5bb32a0 ('docs: registra LOG-081...') actualizo solo la fila de tabla y no las fichas de detalle correspondientes.

**Recomendacion:** Actualizar las fichas de detalle de BLOQUE-1-RLS/2-UTIL/3-AUTH (lineas ~2267, 2284, 2303) para reflejar el merge real a main (PR #85-#90), igual que ya dice la tabla.

### 6. 01_PENDIENTES_PROYECTO.md — QA-003 (auto-contradiccion) — severidad media

docs/control/01_PENDIENTES_PROYECTO.md:1803 encabeza la ficha de QA-003 con '**Estado:** Pendiente', pero la misma ficha incluye 'Fecha validacion: 2026-07-04' (linea 1809) y un Resultado completo (lineas 1826-1830) documentando que QA-003 ya se ejecuto local/demo con observacion. Esto contradice tambien la tabla del mismo archivo (linea 109: 'Ejecutada local/demo con observacion').

**Recomendacion:** Corregir el campo Estado de la ficha QA-003 (linea 1803) a 'Ejecutada local/demo con observacion' para que coincida con el resto de la propia ficha y con la tabla.

### 7. 01_PENDIENTES_PROYECTO.md / 03_INTEGRACION_BACKEND_ESTRUCTURA.md — BE-030 — severidad media

docs/control/01_PENDIENTES_PROYECTO.md:245 dice '**Estado:** Implementada local / pendiente revision visual autenticada' para BE-030, pero esto contradice: la tabla del mismo archivo (linea 94: 'Diseno documental / pendiente implementacion futura'), docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md:348 ('Diseno documental / pendiente implementacion futura') y el informe fuente docs/control/auditorias/BE-030_ARQUITECTURA_PLATAFORMA_GOOGLE_CLOUD.md:5 ('Diseno arquitectonico documental / pendiente implementacion futura'). BE-030 es solo diseno documental de Google Cloud, nada esta 'implementado'.

**Recomendacion:** Corregir la linea 245 de 01_PENDIENTES_PROYECTO.md para que diga 'Diseno documental / pendiente implementacion futura', igual que el resto de los documentos.

### 8. docs/control/auditorias — ID CTRL-010 reutilizado con dos significados distintos — severidad media

Existen dos archivos con el mismo codigo CTRL-010 y contenidos/estados distintos: docs/control/auditorias/CTRL-010_CIERRE_QA008_POST_MERGE.md:1-5 ('Cierre post-merge QA-008 Agenda interna', Estado: 'Documentado para integracion', fecha 2026-07-02) y docs/control/auditorias/CTRL-010_SETUP_CODEX_DESARROLLO.md:1-5 ('Setup operativo de Codex para desarrollo', Estado: 'Propuesta documental / pendiente revision de Javier', tambien 2026-07-02). Solo el primero esta referenciado en docs/control/06_BITACORA_CAMBIOS.md:1756-1758; el segundo (CTRL-010_SETUP_CODEX_DESARROLLO.md) queda huerfano y con el mismo ID, sin aparecer en 01_PENDIENTES ni 00_ESTADO_GENERAL.

**Recomendacion:** Renombrar uno de los dos archivos a un codigo CTRL libre (p.ej. mantener CTRL-010 para el cierre QA-008 ya referenciado en la bitacora, y reasignar 'Setup operativo de Codex' a un nuevo codigo CTRL-XXX), actualizando cualquier referencia cruzada.

### 9. docs/control/auditorias — ID CTRL-011 reutilizado con dos significados distintos — severidad media

Existen dos archivos con el mismo codigo CTRL-011: docs/control/auditorias/CTRL-011_OPTIMIZACION_OPERACION_CODEX.md:1-8 ('Optimizacion operativa Codex' / agrupar tareas simples, Estado: 'Documentado', 2026-07-03) y docs/control/auditorias/CTRL-011_MODO_CODEX_OPTIMIZADO.md:1-13 ('Modo Codex Optimizado' / reducir consumo de contexto, Estado: 'Propuesta documental / pendiente revision de Javier', tambien 2026-07-03). Ambos aparecen ademas como entradas separadas en docs/control/06_BITACORA_CAMBIOS.md: LOG-055 (linea 2376-2378, Estado 'Documentado') y LOG-065 (linea 2848-2850, Estado 'Propuesta documental / pendiente revision de Javier'), usando el mismo codigo CTRL-011 para dos tareas distintas con estados distintos.

**Recomendacion:** Reasignar uno de los dos temas a un codigo CTRL nuevo (por ejemplo dejar CTRL-011 para 'Optimizacion operativa Codex' del LOG-055, y mover 'Modo Codex Optimizado' del LOG-065 a CTRL-013 o similar), corrigiendo las referencias en 06_BITACORA_CAMBIOS.md y 10_OPERACION_CODEX.md.

### 10. 01_PENDIENTES_PROYECTO.md / 04_UI_UX_PULIDO_VISUAL.md / 03_INTEGRACION_BACKEND_ESTRUCTURA.md — BE-022/UI-022 (staleness menor) — severidad baja

El campo Estado de las fichas BE-022 (01_PENDIENTES_PROYECTO.md:1332) y UI-022 (01_PENDIENTES_PROYECTO.md:1563) sigue diciendo 'Implementada local / pendiente QA', aunque el propio 'Resultado' de esas mismas fichas (lineas 1357 y 1587) ya menciona que QA-003 se ejecuto. La tabla del mismo archivo (linea 86 y 97) ya dice 'QA-003 local/demo con observacion'. docs/control/04_UI_UX_PULIDO_VISUAL.md:572 y docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md:909 tambien quedaron con el texto viejo 'Implementada local / pendiente QA', sin mencionar que QA-003 ya se ejecuto.

**Recomendacion:** Actualizar el campo Estado de BE-022/UI-022 en los 3 documentos a algo como 'Implementada local / validada por QA-003 con observacion', consistente con la tabla de 01_PENDIENTES_PROYECTO.md.

### 11. 01_PENDIENTES_PROYECTO.md — QA-006 (staleness menor) — severidad baja

docs/control/01_PENDIENTES_PROYECTO.md:1836 encabeza la ficha de QA-006 con '**Estado:** Pendiente', pero el propio 'Resultado actual' de la misma ficha (lineas 1870-1874) documenta que las fases QA-006A a QA-006F ya se ejecutaron. La tabla del mismo archivo (linea 35) ya refleja el avance real: 'QA-006F RLS/Storage local OK / PROD-001 pendiente'.

**Recomendacion:** Cambiar el Estado de la ficha QA-006 (linea 1836) a algo como 'Fases A-F ejecutadas / cierre final pendiente de PROD-001', igual que ya dice la tabla.

---

## git-status-triage

**Resumen:** Los 5 cambios en git status forman dos hilos independientes y ninguno es peligroso por sí solo. El primero es una línea de experimentación con Gemini (dependencia en package.json/lock + dos scripts sueltos en scripts/) coherente con el roadmap de IA ya documentado en docs/control (ROADMAP-HERRAMIENTAS-GEMINI.md, DEC-041/042), pero con clasificación de dependencia cuestionable (debería ser devDependency) y un script (ai-backend-helper.js) sin ningún rastro documental. El segundo es MEMORY.md en la raíz, un artefacto autogenerado por el asistente Junie de JetBrains que quedó fuera de .gitignore por un vacío de configuración (a diferencia de .idea/, que sí está ignorado) y que ya está desactualizado respecto al HEAD actual. No se detectaron secretos hardcodeados ni cambios que toquen RLS/Auth/producción directamente.

**5 hallazgos.**

### 1. package.json — severidad media — NECESITA APROBACION

Diff real: una sola línea agregada en `dependencies`: `"@google/genai": "^2.10.0"` (verificado con `git diff package.json`). Se agregó el 6 jul ~16:55 (mtime del archivo), justo antes de crear `scripts/test-gemini.js` (17:02) y `scripts/ai-backend-helper.js` (17:24), es decir, existe para poder hacer `import { GoogleGenAI } from "@google/genai"` en esos dos scripts Node sueltos. Importante: la Edge Function ya desplegada y aprobada (`supabase/functions/agenda-resumen-semanal/index.ts:1`) NO depende de esta entrada — importa su propia copia vía `npm:@google/genai@^2.10.0` directamente en Deno, instalación totalmente independiente del `package.json` raíz. Confirmé además que ningún archivo en `src/` importa `@google/genai` (grep sin resultados), así que no hay riesgo de que la API key termine en el bundle del frontend. Colocación cuestionable: quedó en `dependencies` (se instala siempre, incluso en build de producción) cuando en realidad solo la usan dos scripts de desarrollador que ni siquiera están registrados en la sección `scripts` del propio `package.json` (a diferencia de `provision-demo-users.mjs`, que sí tiene su entrada `sec007b:provision-demo-users`).

**Recomendacion:** Preguntar al dueño: si los dos scripts de Gemini se van a conservar y commitear, mover `@google/genai` a `devDependencies` (no es código de producción) y opcionalmente registrar un script npm para ellos; si los scripts van a quedar solo locales o se descartan, revertir también esta línea de `package.json` (y su lockfile) para no dejar una dependencia de producción sin consumidores reales en el repo compartido.

### 2. package-lock.json — severidad baja

427 inserciones / 4 eliminaciones, verificadas como el árbol transitivo completo y exclusivo de `@google/genai` (google-auth-library, protobufjs, gaxios, gcp-metadata, ws, jwa/jws, https-proxy-agent, etc. — confirmado filtrando el diff, no aparece ninguna otra dependencia tocada). Es 100% consecuencia mecánica de correr `npm install @google/genai` para el hallazgo anterior; no representa una decisión independiente.

**Recomendacion:** Debe seguir la misma suerte que `package.json` (commitear juntos o descartar juntos) — nunca commitear uno sin el otro, para no dejar el lockfile desincronizado del manifest.

### 3. MEMORY.md (raíz del repo) — severidad media — NECESITA APROBACION

Archivo con front-matter `schemaVersion: 1 / scope: workspace / workspaceName: "terapeutas-australes-app" / updatedAt: 2026-07-06T20:25:34Z`, en inglés, con secciones tipo "memory bank" (Project Overview, Current State, Artifacts, Design Direction, Decisions, Open Questions, Next Steps, Recent History). No es un documento escrito a mano por el equipo: por su formato y por la presencia de `.junie/plans/` (carpeta vacía) en el repo, y la mención explícita a "Configúrala en WebStorm" dentro de `scripts/test-gemini.js:7`, todo apunta a que es el archivo de memoria autogenerado por el asistente de IA Junie de JetBrains, usado en paralelo por el dueño en WebStorm. El contenido ya está desactualizado: no menciona los PRs #100 (Edge Function agenda) ni #101 (detector de abandono), ambos posteriores al 6 de julio, lo que confirma que es una instantánea de herramienta, no documentación mantenida. Además, `.idea/` SÍ está en `.gitignore` (línea 23) pero `MEMORY.md` y `.junie/` no — es un vacío de configuración, no una decisión intencional de trackearlo.

**Recomendacion:** No commitear tal cual: es un artefacto de herramienta personal, en inglés, ya desactualizado, y duplica sin agregar valor lo que ya vive versionado y en español en `docs/control/`. Sugerido: agregar `MEMORY.md` y `.junie/` al `.gitignore` (así como está `.idea/`) y descartar este archivo puntual del working tree. Como implica tocar `.gitignore` (convención del repo) conviene confirmarlo con el dueño antes, aunque el archivo en sí no contiene secretos ni nada sensible.

### 4. scripts/ai-backend-helper.js — severidad media — NECESITA APROBACION

Script Node (creado 6 jul 17:24) que toma un prompt por `argv`, lo combina con un system prompt fijo ("Eres un arquitecto backend senior... Terapeutas Australes...", líneas 22-35) y lo envía a Gemini (`gemini-2.5-flash`) vía `GEMINI_API_KEY` de entorno, imprimiendo la respuesta. Es una herramienta de productividad personal del desarrollador (usar Gemini como sparring de arquitectura), no una feature clínica. A diferencia de `scripts/test-gemini.js`, este archivo NO está mencionado en ningún documento de control: ni en `docs/control/ROADMAP-HERRAMIENTAS-GEMINI.md` (que en su línea 6 dice textualmente que "el único código Gemini" existente era `scripts/test-gemini.js`), ni en `docs/control/05_DECISIONES_PROYECTO.md` (DEC-041/DEC-042), ni en `AGENTS.md`/`README.md`. Tampoco tiene entrada en `package.json > scripts`. No contiene secretos hardcodeados (la key sale de `process.env`), pero es un artefacto sin gobernanza ni rastro documental en un repo que trata con mucho cuidado cualquier código que toque Gemini/Google (BE-020).

**Recomendacion:** Preguntar al dueño si quiere conservar y documentar esta herramienta (y en tal caso registrarla en `AGENTS.md`/`docs/control` como tooling de desarrollador, no como feature) o si fue solo una prueba a descartar del working tree.

### 5. scripts/test-gemini.js — severidad baja

Script mínimo (creado 6 jul 17:02) que hace un único llamado a Gemini ("¿qué es Gemini API?") para verificar que el SDK y la `GEMINI_API_KEY` funcionan. A diferencia del anterior, este SÍ está referenciado por nombre y ruta exacta en un documento ya commiteado: `docs/control/ROADMAP-HERRAMIENTAS-GEMINI.md:6` lo describe explícitamente como "un script local de desarrollador con la API key en variable de entorno de shell — no productivo", y es el precedente que llevó a DEC-041 (aprobación acotada de Gemini para la Edge Function `agenda-resumen-semanal`). Es decir, su naturaleza de prueba local no destinada a producción ya fue documentada y aceptada por el propio dueño antes de esta sesión; que siga sin trackear en git es coherente con esa caracterización, no un descuido.

**Recomendacion:** Bajo riesgo en cualquier dirección: se puede dejar como está (sin trackear, uso personal, consistente con cómo ya lo describe el roadmap) o commitear ahora como artefacto histórico/precedente. Confirmar preferencia con el dueño solo para no dejar ambigüedad entre "documentado pero no subido" y "debería quedar en el repo", pero no es urgente.

---

## config-coherencia

**Resumen:** Revise package.json, tsconfig*.json, eslint.config.js y .github/workflows/ci.yml del proyecto, cruzandolos contra docs/control (05_DECISIONES_PROYECTO.md DEC-039, 01_PENDIENTES_PROYECTO.md, 06_BITACORA_CAMBIOS.md, docs/DEVELOPMENT.md). El CI y el eslint/tsconfig estan internamente coherentes y pasan limpio (`npm run lint`, `npm run build`, `npm run test:coverage` verificados en vivo). Los problemas reales estan en: una dependencia sin uso desde el commit inicial (`@tanstack/react-table`), un cambio en curso sin commitear que agrega Gemini fuera del alcance ya aprobado por DEC-041, y dos entradas de estado desactualizadas en docs/control que dicen "pendiente" algo que la propia bitacora ya registra como mergeado.

**6 hallazgos.**

### 1. package.json - dependencias vs uso real en src/ — severidad media

`@tanstack/react-table` esta declarado en `package.json:22` (dependencies) pero no se importa en ningun archivo de `src/`, `e2e/`, `scripts/` ni `supabase/functions/` (verificado con grep en todo el repo y con `git log -S "react-table" -- src/` sobre todo el historial: cero resultados). Fue agregado en el commit inicial `3f792cf` ("Crea modulo inicial de pacientes con Supabase") y nunca se uso. El propio proyecto ya tiene precedente de limpiar dependencias asi: commit `57dad4a` "chore: eliminar react-hook-form, @hookform/resolvers y zod sin uso".

**Recomendacion:** Eliminar `@tanstack/react-table` de dependencies (`npm uninstall @tanstack/react-table`) o, si hay intencion real de usarlo pronto (tabla de pacientes/casos), dejar constancia en 01_PENDIENTES_PROYECTO.md de por que sigue declarado sin uso.

### 2. package.json - cambio en curso no documentado (dependencia + scripts nuevos de IA) — severidad alta — NECESITA APROBACION

El diff sin commitear de `package.json` agrega `@google/genai` a `dependencies` (linea 19). En paralelo aparecen dos archivos nuevos sin trackear, `scripts/ai-backend-helper.js:1` y `scripts/test-gemini.js:1`, que importan `@google/genai` directamente para llamadas ad-hoc a Gemini (`gemini-2.5-flash`) usando `process.env.GEMINI_API_KEY`. Ninguno de los dos esta enlazado a un script de `package.json` (no aparecen en la seccion `scripts`) ni documentado en `docs/DEVELOPMENT.md` o `docs/control/06_BITACORA_CAMBIOS.md`. La unica aprobacion de Gemini que existe es DEC-041 (`docs/control/05_DECISIONES_PROYECTO.md:1235-1252`), y su propio texto dice explicitamente que es "acotada a esta herramienta puntual" (la Edge Function `supabase/functions/agenda-resumen-semanal`) y que "no habilita ninguna otra integracion con Gemini/Google". Agregar `@google/genai` como dependencia de la app (no de la Edge Function, que ya la trae via `npm:@google/genai@^2.10.0` en Deno, ver `supabase/functions/agenda-resumen-semanal/index.ts:1`) mas dos scripts nuevos de uso libre de Gemini cae fuera del alcance que DEC-041 aprobo.

**Recomendacion:** Antes de commitear: (1) decidir si estos scripts son necesarios y, si lo son, registrar una decision de Control (nueva DEC o ampliar DEC-041) que autorice explicitamente este uso adicional de Gemini fuera de la Edge Function; (2) si se mantienen, moverlos a devDependencies si son solo herramientas de desarrollo, y agregar un script `npm run` + entrada en DEVELOPMENT.md; (3) si no son necesarios, revertir el cambio de package.json y borrar los archivos sueltos.

### 3. docs/control - DEC-039 y BLOQUE-4-TEST desactualizados frente a la bitacora — severidad media

`docs/control/05_DECISIONES_PROYECTO.md:57` (tabla resumen) y `05_DECISIONES_PROYECTO.md:1203` (encabezado de la seccion DEC-039) marcan el estado como "Aprobada / pendiente implementacion". `docs/control/01_PENDIENTES_PROYECTO.md:116` (fila BLOQUE-4-TEST) dice "Mergeado a main (PR #91), 24 tests. Playwright E2E pendiente". Pero `docs/control/06_BITACORA_CAMBIOS.md` LOG-082 (linea 3666) y LOG-083 (linea 3685) documentan que Vitest+CI (PR #91), y luego Playwright E2E con `e2e/auth.spec.ts` (PR #93) mas `ARCHITECTURE.md`/`DEVELOPMENT.md` (PR #92) ya fueron mergeados a `main`. Es decir, el trabajo que 05 y 01 describen como pendiente ya esta hecho segun 06 (que es la fuente mas reciente).

**Recomendacion:** Actualizar el estado de DEC-039 en `05_DECISIONES_PROYECTO.md:57` y `:1203` a algo como "Aprobada / implementada (unit+E2E local; E2E aun no esta wireado en CI, ver LOG-083)", y corregir `01_PENDIENTES_PROYECTO.md:116` para reflejar que Playwright E2E ya se mergeo (PR #93), dejando como pendiente unicamente el wiring de E2E a CI.

### 4. .github/workflows/ci.yml vs DEC-039 - coherencia confirmada, con brecha documentada — severidad baja

`ci.yml:16-19` corre `npm ci`, `npm run lint`, `npm run build`, `npm test` (Vitest unit, sin `test:e2e`). Esto SI coincide con lo que pide DEC-039 en su texto de "Impacto" (linea 1209: "workflow de GitHub Actions que corra lint/build/test en cada PR"), y la ausencia deliberada del job E2E esta explicada tanto en LOG-083 (`06_BITACORA_CAMBIOS.md:3697`, "Deliberadamente NO se agrego job de E2E... requeriria un Supabase completo... en el runner") como en `docs/DEVELOPMENT.md:58`. No es una inconsistencia real, es una decision documentada dos veces de forma consistente entre si.

**Recomendacion:** Ninguna accion necesaria sobre el workflow. Solo alinear el texto de estado de DEC-039 (ver hallazgo anterior) para que dejar el E2E fuera de CI se lea como decision tomada y no como trabajo pendiente sin mas contexto.

### 5. package.json scripts vs docs/DEVELOPMENT.md — severidad baja

El script `gen:types` (`package.json:16`, agregado en commit `e164f60` "chore: agregar script npm run gen:types") no aparece mencionado en `docs/DEVELOPMENT.md` ni en ningun archivo de `docs/control` (busque "gen:types" en ambos, cero resultados). Es justamente el paso natural despues de crear una migracion (seccion "Crear una migracion" en DEVELOPMENT.md, lineas 37-45), pero no esta ahi.

**Recomendacion:** Agregar una linea en `docs/DEVELOPMENT.md` (seccion "Crear una migracion") indicando que tras `supabase db reset` corresponde correr `npm run gen:types` para regenerar `src/lib/database.types.ts`.

### 6. vite.config.ts - patron de test de Vitest — severidad baja

`vite.config.ts:10` limita Vitest a `include: ['src/**/*.test.ts']`, que no matchea archivos `*.test.tsx`. Hoy no hay ningun test `.tsx` (solo `src/lib/format.test.ts` y `src/lib/queries.test.ts`), asi que no rompe nada todavia, pero si en el futuro se agrega un test de componente React (`.test.tsx`), Vitest lo va a ignorar en silencio y `npm test`/CI van a seguir en verde sin correrlo.

**Recomendacion:** Cambiar el include a `src/**/*.test.{ts,tsx}` de forma preventiva, o dejar nota en DEVELOPMENT.md de que los tests de componentes deben nombrarse `.test.ts` (menos natural) hasta que se ajuste el config.

---

