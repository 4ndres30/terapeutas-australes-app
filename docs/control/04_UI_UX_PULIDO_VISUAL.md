# UI / UX / Pulido visual

Responsable: UI / UX / Pulido visual
Estado del documento: En analisis
Fecha creacion: `2026-06-11`
Ultima actualizacion: `2026-07-10`

Este documento controla tareas de experiencia de usuario, formularios, responsive y pulido visual. El objetivo es que la aplicacion sea clara, sobria, profesional y facil de usar para el flujo terapeutico.

## Alcance

- Diseno de pantallas.
- Jerarquia visual.
- Formularios.
- Estados vacios, carga y error.
- Responsive.
- Accesibilidad basica.
- Consistencia de botones, tablas, modales y navegacion.
- Pulido visual premium sin afectar logica critica.

## Fuera de alcance

- Modificar base de datos.
- Modificar migraciones.
- Ejecutar SQL.
- Cambiar reglas clinicas.
- Cambiar servicios, hooks o logica critica sin tarea aprobada.

## Criterios visuales base

- Priorizar claridad sobre decoracion.
- Mantener interfaces densas pero legibles.
- Evitar duplicidad de acciones.
- Usar textos breves y utiles.
- Mantener consistencia entre formularios.
- Revisar mobile y desktop antes de validar.
- No ocultar informacion clinica importante por decisiones esteticas.

## Resumen auditoria UI-001 + UI-002

La auditoria UI-001 + UI-002 queda **aprobada con observaciones**. La interfaz actual sostiene bien el flujo clinico aprobado y respeta que el caso sea el contenedor central de elementos, revisiones, detalle, trabajos y pagos. La app ya se siente seria y funcional en Pacientes, Casos y ficha de caso, pero aun requiere diseno operativo para hallazgos, trabajos/sesiones/acciones, finanzas por unidad cobrable, agenda tipificada y reportes por rol.

Informe completo: [`auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`](auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md)

## Estado post IMP-001

UI-011 fue llevada a una implementacion funcional minima por IMP-001 dentro de `DetalleRevisionesPanel`.

Validado visualmente por el usuario:

- Hallazgo registrado visible.
- Modal `Ver hallazgo` funcional.
- Modal `Crear hallazgo desde aspecto revisado` abre correctamente.
- Herencia de revision, elemento, area y aspecto en el modal de creacion.

Pendiente:

- QA-002 debe validar el guardado real de un hallazgo nuevo desde la UI.
- UI-012 disena el flujo visual `Evaluar trabajo`; la implementacion funcional queda para una tarea posterior.

Regla vigente:

- No se debe crear trabajo automaticamente desde un hallazgo.
- No se deben crear cobros, sesiones ni acciones automaticamente desde el flujo de hallazgos.

## Estado post UI-034, UI-045 y UI-046

`PacientesPage` quedo integrada como panel de trabajo diario por PR #118, con registro
completo y alta bajo demanda. La edicion de pacientes queda integrada por PR #125 como
formulario plano segun DEC-044, sin pasos ni preview vivo. El wizard de alta queda integrado
por PR #126 con preview adaptativo segun DEC-045: panel lateral en desktop y confirmacion
fullscreen en tablet/mobile.

Siguiente paso recomendado: `QA-012 - Regresion visual y funcional de PacientesPage`, cubriendo
panel diario, registro completo, alta desktop, alta tablet/mobile, overlay de confirmacion,
edicion plana, guardar/cancelar, anulacion, reactivacion, consola limpia, sin pantalla blanca,
sin overflow horizontal y sin regresiones del wizard o del formulario plano.

Riesgo tecnico relacionado: `UI-047 - Normalizacion de queryKeys TanStack Query para pacientes
y selectores`, recomendado en tarea separada. No se implementa dentro de la sincronizacion
CTRL-015.

Hallazgo visual adicional registrado por Javier durante revision en navegador:
`UI-048 - Compactar fila de indicadores superiores de PacientesPage`. Implementada en rama
`ui-048-compactar-indicadores-pacientes`: cuatro tarjetas en una línea desktop, 72 px de alto,
iconos y tipografia reducidos, decoracion secundaria retirada y responsive 2x2 sin overflow
en tablet/mobile. Validada por `Quality gate` en PR #130 y pendiente de merge.

Hallazgos del shell global registrados en la misma revision:

- `UI-049 - Sidebar desktop como rail colapsable y accesible`: recuperar ancho util mostrando
  iconos por defecto y etiquetas al pasar el puntero o enfocar la navegacion, con opcion de
  fijado y sin reemplazar el drawer responsive de UI-027.
- `UI-050 - Barra superior como encabezado contextual compacto`: eliminar la franja vacia,
  reunir contexto del modulo, ambiente e identidad de usuario en una fila estable y acercar
  acciones primarias sin duplicar encabezados.

Ambas son propuestas Nivel 2 pendientes. Por compartir el shell global deben implementarse
en secuencia: primero UI-049 y, una vez validada, UI-050. No se implementan en CTRL-015.

## UI-049 - Sidebar desktop como rail colapsable y accesible

**Estado:** Validada, pendiente merge — ver LOG-113 en `06_BITACORA_CAMBIOS.md` (PR #134, draft)
**Prioridad:** Media-alta
**Nivel documental:** Nivel 2

La solucion recomendada mantiene el drawer actual en `<= 1080px` y usa un rail de iconos en
desktop. La expansion temporal responde a hover y foco de teclado sin desplazar el formulario;
un control de fijado permite reservar el ancho expandido cuando el usuario lo prefiera.

El modo colapsado debe conservar item activo, etiquetas accesibles/tooltips, navegacion por
teclado y filtrado por rol. Marca, mensaje institucional, estado/version y cierre de sesion
deben disponer de una variante compacta coherente, sin textos recortados ni acciones ocultas.

Validacion minima futura: rutas principales, roles admin/terapeuta/finanzas, desktop y
transicion al drawer responsive, sin overflow, solapamientos ni saltos del contenido.

Implementada en rama `ui-049-sidebar-rail-colapsable`: rail de 72px colapsado, 232px
expandido/fijado, patron visualmente-oculto para etiquetas y soporte `prefers-reduced-motion`.
Validacion e2e (`npx playwright test`) detecto una regresion real -- con 9 items de
navegacion, el pie de la sidebar (version, cierre de sesion) quedaba inalcanzable al expandir
por hover/foco o al fijar en pantallas de ~720-800px de alto, porque `position: fixed` sacaba
el contenido del flujo de scroll de la pagina sin scroll interno propio. Corregido agregando
scroll interno acotado en `.sidebar-nav` (marca y pie permanecen siempre visibles, sin scroll).
Validada por `npm run lint`/`build`/`test` (29/29) y la suite e2e completa (8/8, incluido el
test de logout que fallaba antes del fix). PR #134 (draft), pendiente de revision/merge.

## UI-050 - Barra superior como encabezado contextual compacto

**Estado:** Pendiente recomendado
**Prioridad:** Media-alta
**Nivel documental:** Nivel 2

La solucion recomendada reemplaza la banda superior desaprovechada por una fila de 56-72 px:
contexto real del modulo a la izquierda; ambiente, usuario y rol a la derecha; acciones
primarias cercanas al titulo cuando corresponda. Debe evitar duplicar el encabezado de cada
pagina y evitar que el track del grid se estire verticalmente.

`IndicadorAmbiente` y el bloqueo visual de produccion de UI-020/UI-021 son controles de
seguridad operativa y se conservan. En tablet/mobile tambien se mantiene el boton del drawer
de UI-027, con titulo y controles compactos sin recortes ni superposiciones.

UI-050 se implementa despues de UI-049 y en PR propio. No requiere DEC mientras conserve
rutas, permisos y comportamiento; cualquier cambio de esas reglas debe volver a Control.

## UI-001 - Auditar pantallas principales y pulido visual

**Estado:** Integrada
**Prioridad:** Media
**Responsable:** UI / UX / Pulido visual
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Fecha documentacion:** 2026-06-12
**Rama sugerida:** `docs/auditoria-ui-ux`
**Dependencias:** PEND-001

### Descripcion
Revisar pantallas principales de la aplicacion para detectar problemas de jerarquia, consistencia, responsive, formularios y experiencia de uso.

### Archivos relacionados
- `src/`
- `public/`
- `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`

### Criterios de aceptacion
- Listar pantallas revisadas.
- Clasificar hallazgos en criticos, importantes y posteriores.
- Separar problemas visuales de problemas de logica o datos.
- No modificar base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Informe oficial consolidado en `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`.

### Observaciones
La auditoria confirma que la estructura visual actual acompana el flujo clinico aprobado, pero recomienda redisenar navegacion del detalle de caso, hallazgos dentro del detalle de revision, flujo hallazgo a trabajo, finanzas por unidad cobrable y reportes por rol.

## UI-002 - Revisar formularios del flujo clinico

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** Control de desarrollo
**Fecha creacion:** 2026-06-11
**Fecha documentacion:** 2026-06-12
**Rama sugerida:** `docs/revision-formularios-clinicos`
**Dependencias:** RFC-001

### Descripcion
Revisar si los formularios respetan el flujo clinico y si los campos aparecen en el momento correcto, con etiquetas comprensibles y estados de validacion claros.

### Archivos relacionados
- `src/`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`

### Criterios de aceptacion
- Identificar formularios revisados.
- Detectar campos confusos, duplicados o mal ubicados visualmente.
- No cambiar reglas clinicas por criterio visual.
- No modificar base de datos.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Aprobada con observaciones. Informe oficial consolidado en `docs/control/auditorias/UI-001_UI-002_AUDITORIA_VISUAL_FORMULARIOS.md`.

### Observaciones
Los formularios principales respetan el flujo clinico base. Las mayores brechas son hallazgos sin panel operativo, trabajos/sesiones/acciones sin flujo guiado, formularios clinicos largos y finanzas sin experiencia clara por unidad cobrable.

## UI-003 - Definir checklist responsive y estados UI

**Estado:** Pendiente
**Prioridad:** Media
**Responsable:** UI / UX / Pulido visual
**Origen:** UI / UX / Pulido visual
**Fecha creacion:** 2026-06-11
**Rama sugerida:** `docs/checklist-responsive-ui`
**Dependencias:** UI-001

### Descripcion
Definir una pauta breve para validar pantallas en mobile y desktop, incluyendo estados de carga, vacios, errores y acciones principales.

### Archivos relacionados
- `src/`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`

### Criterios de aceptacion
- Incluir checklist mobile.
- Incluir checklist desktop.
- Incluir estados vacio, carga y error.
- No modificar codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Esta tarea es documental hasta que Javier apruebe cambios visuales concretos.

## UI-010 - Redisenar navegacion del detalle de caso

**Estado:** Aprobada con observaciones / pendiente implementacion
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002
**Fecha creacion:** 2026-06-13
**Fecha documentacion:** 2026-06-18
**Rama sugerida:** `docs/ui-010-diseno-resumen-detalle-caso`
**Dependencias:** UI-001, UI-002, RFC-001

### Descripcion
UI-010 ya cuenta con diseno detallado para transformar el detalle de caso desde una lista vertical extensa hacia una vista resumen general por secciones. La vista por elemento queda como modo secundario o fase posterior.

### Archivos relacionados
- `docs/control/auditorias/UI-010_AMPLIACION_RESUMEN_DETALLE_CASO.md`
- `docs/control/auditorias/UI-010_DISENO_RESUMEN_DETALLE_CASO.md`

### Criterios de aceptacion
- Usar como vista principal un resumen general por secciones.
- Mantener tarjetas o modulos para elementos, revisiones, detalle de revision, hallazgos, trabajos, pagos y seguimiento.
- Conservar trazabilidad entre caso, revision, elemento, aspecto, hallazgo y trabajo.
- No implementar codigo todavia.
- No modificar CSS.
- No modificar base de datos.
- Considerar las observaciones clinicas obligatorias antes de implementar.

### Validación clínica

Revisión de flujo clínico aprueba UI-010 con observaciones. Antes de implementar, deben considerarse como obligatorias las alertas clínicas visibles, la separación entre Detalle de revisión y Hallazgos, la visibilidad de trabajos transversales, la separación visual de Pagos y la trazabilidad completa entre paciente, caso, consulta/evaluación, elemento, revisión, aspecto, hallazgo, trabajo, pago y seguimiento.

### Resultado
Aprobada con observaciones como diseno UI/UX y validada clinicamente con observaciones. La implementacion futura queda pendiente de considerar alertas criticas, trabajos transversales, pagos separados y riesgos de ocultar informacion clinica.

### Observaciones
La recomendacion principal es una vista resumen general por secciones. La vista organizada por elemento del caso queda como exploracion secundaria o fase posterior.

## UI-011 - Disenar panel operativo de hallazgos dentro del detalle de revision

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002 / BE-010
**Fecha creacion:** 2026-06-13
**Fecha documentacion:** 2026-06-13
**Rama sugerida:** `docs/ui-011-panel-hallazgos`
**Dependencias:** DEC-006, DEC-007, DEC-008, DEC-009, DEC-010, BE-010

### Descripcion
Definir la experiencia visual y operativa del panel de hallazgos dentro del detalle de revision, respetando que los hallazgos nacen desde aspectos revisados y viven dentro del caso.

### Archivos relacionados
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/CasoDetallePage.tsx`
- `src/pages/casos/RevisionesCasoPanel.tsx`
- `src/pages/casos/ElementosCasoPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `docs/control/auditorias/UI-011_PANEL_OPERATIVO_HALLAZGOS.md`
- `docs/control/auditorias/BE-010_PLAN_TECNICO_HALLAZGOS_OPERATIVOS.md`

### Criterios de aceptacion
- Definir ubicacion visual del panel de hallazgos.
- Definir accion contextual para crear hallazgo desde aspecto revisado.
- Diferenciar visualmente aspecto revisado, hallazgo y trabajo futuro.
- Definir estados visuales y microcopy.
- Prevenir duplicados desde la experiencia visual.
- No implementar codigo.
- No modificar CSS.
- No modificar migraciones.
- No tocar `.env`.
- No ejecutar Supabase.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Integrada. Informe oficial consolidado en `docs/control/auditorias/UI-011_PANEL_OPERATIVO_HALLAZGOS.md`. IMP-001 llevo esta definicion a implementacion funcional minima dentro de `DetalleRevisionesPanel`.

### Observaciones
Los hallazgos deben vivir dentro de `DetalleRevisionesPanel`. La accion debe nacer desde cada aspecto revisado. No debe existir modulo principal independiente de hallazgos. No se deben crear trabajos automaticamente. BE-011 ya quedo integrada documentalmente y UI-012 queda como siguiente tarea UI para disenar `Evaluar trabajo`.

## UI-012 - Disenar flujo visual Evaluar trabajo

**Estado:** Aprobada con observaciones
**Prioridad:** Alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-011 + BE-011
**Fecha creacion:** 2026-06-17
**Fecha documentacion:** 2026-06-17
**Rama sugerida:** `docs/ui-012-evaluar-trabajo`
**Dependencias:** UI-011, BE-011, DEC-009, DEC-013, DEC-014, DEC-015

### Descripcion
Disenar el flujo visual para que un terapeuta evalue si un hallazgo amerita crear trabajo. La accion recomendada es `Evaluar trabajo`, no `Crear trabajo` directo.

### Archivos relacionados
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `docs/control/auditorias/UI-012_FLUJO_EVALUAR_TRABAJO.md`
- `docs/control/auditorias/BE-011_TRAZABILIDAD_HALLAZGO_TRABAJO.md`

### Criterios de aceptacion
- Diferenciar hallazgo, evaluacion de trabajo y trabajo creado.
- Mostrar resumen del hallazgo antes de preparar un trabajo.
- Mostrar advertencia de que no todo hallazgo requiere trabajo.
- Definir comportamiento si ya existe trabajo asociado al hallazgo.
- Definir microcopy para evitar automatismo clinico.
- No crear trabajo automaticamente.
- No crear cobros, sesiones ni acciones automaticamente.
- No modificar codigo fuente.
- No modificar base de datos.
- No tocar `.env`.

### Resultado
Aprobada con observaciones. Informe oficial consolidado en `docs/control/auditorias/UI-012_FLUJO_EVALUAR_TRABAJO.md`.

### Observaciones
El boton debe llamarse `Evaluar trabajo` y vivir junto al hallazgo operativo dentro de `DetalleRevisionesPanel`. La creacion futura debe requerir confirmacion manual del terapeuta, usar `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal y no crear cobros, sesiones ni acciones automaticamente.

## UI-016 - Mejorar reportes por rol

**Estado:** Integrada por PR #33
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** UI-001 + UI-002 / SEC-002
**Fecha implementacion local:** 2026-06-28
**Rama usada:** `ui-016-reportes-por-rol`

### Relación con SEC-002

SEC-002 define que los reportes deben separarse por rol:

- admin: visión completa según permisos aprobados;
- terapeuta: vista clínica sin finanzas detalladas;
- finanzas: vista financiera sin información clínica sensible.

UI-016 implementa estas restricciones en `ReportesPage` mediante superficies separadas por rol.

### Relación con SEC-004

SEC-004 define que Finanzas debe ver reportes financieros con alias administrativo, código financiero o identificador interno, no ficha completa del paciente.

Para Finanzas, UI-016 no debe mostrar por defecto:

- nombre completo;
- teléfono;
- email;
- motivo de consulta;
- evaluaciones;
- elementos del caso;
- hallazgos;
- notas clínicas;
- sesiones o acciones terapéuticas;
- fotos de elementos del caso;
- rutas o miniaturas de archivos clínicos.

Nombre completo, teléfono o email solo deben considerarse si Control de Desarrollo lo aprueba expresamente y BE-020 define consentimiento suficiente.

### Resultado integrado

`ReportesPage` queda separada en superficies por rol:

- Admin: panel general con indicadores clinicos, financieros y operativos autorizados.
- Terapeuta: panel clinico con casos, revisiones, hallazgos, trabajos y seguimiento, sin detalle financiero completo.
- Finanzas: panel financiero exclusivo desde `vista_finanzas_unidades_cobrables`, sin secciones clinicas vacias ni mensajes tecnicos.

Informe relacionado: `auditorias/UI-016_REPORTES_POR_ROL.md`

### Validacion funcional local

QA-005 registra validacion funcional local de `/reportes` con Admin, Terapeuta y Finanzas.

Resultado:

- Admin ve reportes generales, clinicos, financieros y operativos autorizados.
- Terapeuta ve reportes clinicos sin panel financiero completo.
- Finanzas ve solo reportes financieros desde `public.vista_finanzas_unidades_cobrables`.
- Finanzas no ve clinica sensible, fotos, miniaturas, rutas internas ni `storage_path`.
- La UI no muestra secciones clinicas vacias ni mensajes tecnicos de RLS para Finanzas.

Informe relacionado: `auditorias/QA-005_VALIDACION_UI016_REPORTES_POR_ROL.md`

Este avance no habilita datos reales, fotos reales, pagos reales ni produccion. PROD-001 sigue bloqueante.

## UI-025 - Integracion Agenda Operativa

**Estado:** Integrada lectura por PR #44
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** BE-028 / BE-029 / DEC-034
**Fecha integracion:** 2026-07-01
**Rama usada:** `ui-025-integracion-agenda-operativa`

### Resultado integrado

`AgendaPage` deja de ser placeholder y queda conectada a `public.vista_agenda_operativa` como vista interna de lectura.

La pantalla muestra:

- eventos operativos desde la vista validada;
- filtros por contexto y estado;
- busqueda por titulo, paciente/contacto, tipo, modalidad, estado u origen;
- separacion visual entre solicitudes vinculadas, eventos internos y consultas confirmadas;
- estados de carga, error y vacio.

### Decisiones UI

La primera fase se mantiene en modo lectura. La alta y edicion controlada queda separada como UI-025B.

La ruta `/agenda` sigue protegida para `admin` y `terapeuta`. Finanzas no tiene acceso visual ni funcional a Agenda.

### Restricciones

No se implementa API publica, endpoints, Google Calendar, Gmail, conversion automatica a pacientes/consultas, migraciones, Auth/RLS, Supabase remoto ni datos reales.

Informe relacionado: `auditorias/UI-025_INTEGRACION_AGENDA_OPERATIVA.md`

## UI-025B - Edicion controlada Agenda Operativa

**Estado:** Integrada por PR #45 / QA-008 cerrada local/demo
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** UI-025 / BE-028 / BE-029 / DEC-034
**Fecha integracion:** 2026-07-01
**Rama usada:** `ui-025b-agenda-operativa-edicion-controlada`

### Resultado integrado

`AgendaPage` permite gestion manual minima de `agenda_eventos` desde la agenda interna protegida. UI-025B ya fue integrada mediante PR #45.

La pantalla habilita:

- accion `Nuevo evento interno`;
- formulario de creacion con campos existentes del modelo;
- edicion de eventos internos existentes;
- reagendamiento limitado a fecha/hora y estado;
- cancelacion como cambio de estado a `cancelado`, sin borrado fisico;
- marcado de eventos como `completado`.

### Decisiones UI

La edicion opera solo sobre `agenda_eventos`. No se editan directamente pacientes, consultas, solicitudes, evaluaciones, casos, revisiones, trabajos, pagos, fotos ni Storage.

Los estados disponibles son los definidos por el modelo: `programado`, `confirmado`, `reagendado`, `cancelado`, `completado` y `no_asistio`.

La ruta `/agenda` sigue protegida para `admin` y `terapeuta`. Finanzas no tiene acceso visual ni funcional a Agenda.

### Restricciones

No se implementa API publica, endpoints, Google Calendar, Gmail, Workspace, conversion automatica a pacientes/consultas, migraciones, Auth/RLS, Supabase remoto, credenciales, datos reales ni produccion.

Informe relacionado: `auditorias/UI-025B_EDICION_CONTROLADA_AGENDA_OPERATIVA.md`

Resultado relacionado: `QA-008` valido operaciones locales de Agenda, permisos, no efectos colaterales y recorrido visual autenticado desktop/admin. La observacion responsive movil quedo corregida por UI-027 e integrada en `main`.

## UI-026 - Selector calendario/horario Agenda

**Estado:** Integrada por PR #48 / QA-008 cerrada local/demo
**Prioridad:** Alta
**Responsable:** UI / UX / Integracion Backend
**Origen:** QA-008 / UI-025B
**Fecha:** 2026-07-02

`AgendaPage` reemplaza el ingreso combinado de fecha/hora por selector de fecha, selector de hora en intervalos de 15 minutos, duracion controlada y fin calculado.

Correccion post revision visual: el campo Fecha incorpora accion visible `Elegir fecha`, con apertura de calendario nativo mediante `showPicker()` cuando el navegador lo permite y fallback seguro.

La duracion estandar de consulta queda en 60 minutos y se aplica un buffer operativo de 15 minutos para validar solapamientos cuando participa una consulta.

No se agregan librerias, API publica, Google Calendar/Gmail, migraciones ni cambios de Auth/RLS.

Informe relacionado: `auditorias/UI-026_SELECTOR_CALENDARIO_HORARIO_AGENDA.md`

Resultado relacionado: QA-008 confirmo alta, edicion, reagendamiento, completado, cancelacion y bloqueo de solapamiento desde UI autenticada en desktop. El overflow horizontal movil observado en 390x844 quedo corregido por UI-027 y validado post-merge.

## UI-020 - Indicador visual de ambiente activo

**Estado:** Validada local/demo en Agenda desktop/mobile
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** PROD-001 / DEC-030 / BE-018 / DOC-001
**Fecha:** 2026-07-02

### Resultado documental

UI-020 define e implementa localmente un indicador persistente para los ambientes `LOCAL`, `DEMO`, `STAGING`, `PRODUCCION` y `DESCONOCIDO`.

QA-009 valida el indicador en `/agenda` con sesion autenticada local `Administrador Local`: `LOCAL - datos ficticios` aparece en ancho mobile equivalente de 375 px y desktop de 1265 px, sin overflow horizontal observado.

El indicador debe estar visible dentro del shell autenticado en desktop y mobile, no debe generar overflow, no debe tapar informacion clinica y no debe exponer secretos, URLs privadas, project ids ni service role.

### Reglas clave

- LOCAL y DEMO deben indicar datos ficticios.
- STAGING debe indicar validacion y requerir autorizacion futura.
- PRODUCCION solo puede mostrarse como habilitada cuando PROD-001 este cerrado.
- Ambiente desconocido debe tratarse como estado de riesgo.
- El indicador no reemplaza controles tecnicos de ambientes.

Informe relacionado: `auditorias/UI-020_INDICADOR_AMBIENTE_ACTIVO.md`

Implementacion relacionada: `auditorias/UI-020_UI-021_IMPLEMENTACION_AMBIENTE_PRODUCCION.md`

QA relacionada: `auditorias/QA-009_VALIDACION_UI020_UI021_AMBIENTE.md`

## UI-021 - Bloqueo visual de produccion no habilitada

**Estado:** Validada local/demo
**Prioridad:** Alta
**Responsable:** UI / UX
**Origen:** PROD-001 / DEC-030 / DEC-031 / UI-020
**Fecha:** 2026-07-02

### Resultado documental

UI-021 define e implementa localmente una pantalla o barrera visual sin bypass para impedir uso interno cuando el ambiente sea produccion no habilitada, produccion sin aprobacion explicita o ambiente desconocido en rutas sensibles.

La barrera debe cubrir pacientes, casos, evaluaciones, revisiones, hallazgos, trabajos, agenda interna, finanzas, reportes, fotos y configuracion interna.

QA-009 cierra la validacion del bloqueo: la simulacion local con variables temporales de proceso en `5173` muestra `PRODUCCION NO HABILITADA`, reemplaza la superficie interna, presenta el mensaje de PROD-001 y permite `Cerrar sesion`, que redirige a `/login`. No se modifica `.env` ni se habilita produccion real.

### Reglas clave

- No permitir `Continuar de todos modos` mientras PROD-001 siga abierto.
- Permitir LOCAL/DEMO solo con datos ficticios y aviso visual.
- No mostrar detalles tecnicos, secretos ni identificadores internos.
- No sustituir controles backend, RLS, Auth, Storage ni separacion real de ambientes.

Informe relacionado: `auditorias/UI-021_BLOQUEO_PRODUCCION_NO_HABILITADA.md`

Implementacion relacionada: `auditorias/UI-020_UI-021_IMPLEMENTACION_AMBIENTE_PRODUCCION.md`

QA relacionada: `auditorias/QA-009_VALIDACION_UI020_UI021_AMBIENTE.md`

## UI-027 - Ajuste responsive de shell y Agenda interna

**Estado:** Integrada por PR #50 / validada post-merge
**Prioridad:** Media-alta
**Responsable:** UI / UX / Pulido visual
**Origen:** QA008-OBS-003
**Fecha:** 2026-07-02

### Descripcion
Corregir el overflow horizontal observado en `/agenda` con viewport movil `390x844`, reemplazando la sidebar movil por un boton superior y un drawer lateral que se despliega desde el costado izquierdo.

### Restricciones
No modificar DB, migraciones, Auth/RLS, Supabase remoto, API publica, Google Calendar/Gmail, produccion ni datos reales.

### Criterios preliminares
- `/agenda` debe renderizar sin overflow horizontal en viewport movil.
- La navegacion debe abrirse desde un icono superior y no debe recortar el contenido principal.
- El comportamiento desktop validado por QA-008 no debe degradarse.
- Debe verificarse con navegador integrado o captura visual equivalente.

### Resultado
Integrado por PR #50 desde la rama `ui-027-ajuste-responsive-shell-agenda`. El drawer movil abre/cierra por boton superior, boton interno, toque exterior y tecla `Escape`. Desktop mantiene sidebar fija. La pasada post-merge en `main` confirma que `/agenda` no presenta overflow horizontal en desktop `1280x720`, mobile `390x844` ni mobile `360x740`.

Informe relacionado: `auditorias/UI-027_AJUSTE_RESPONSIVE_SHELL_AGENDA.md`

## CTRL-008 - Decisiones UI derivadas post auditoria

**Estado:** Propuesta documental / pendiente integracion
**Origen:** CTRL-008 / Auditoria integral post PR #35
**Fecha:** 2026-06-29

CTRL-008 deja nuevas decisiones UI que deben resolverse antes de avanzar con produccion, finanzas, navegacion por rol o implementaciones clinicas sensibles.

### Decisiones UI relevantes

- Finanzas debe operar con superficies financieras minimas y no debe ver `paciente_id` real por defecto en UI o reportes cuando se cierre BE-023.
- Terapeuta no debe administrar pagos desde ficha clinica. Si se aprueba visibilidad, debe ser estado minimo, sin gestion ni detalle financiero completo.
- `PagosCasoPanel` debe revisarse como superficie sensible dentro de la ficha de caso.
- La navegacion debe filtrar modulos por rol. No basta con que la ruta bloquee; la UI no debe ofrecer entradas clinicas a Finanzas.
- UI debe mostrar ambiente activo y advertir que local/demo no autoriza datos reales mientras PROD-001 siga abierto.
- IMP-002 debe conservar el flujo manual `Evaluar trabajo` y no promover multiples trabajos desde el mismo hallazgo sin aprobacion clinica.

### Tareas UI derivadas

- `UI-023` - Navegacion y superficies filtradas por rol.
- `UI-020` - Indicador visual de ambiente activo.
- `UI-021` - Bloqueo visual de produccion no habilitada.
- `UI-015` - Finanzas por unidad cobrable con microcopy administrativa.

Nota de control: `UI-017` ya existe como checklist responsive de pantallas clinicas. La navegacion por rol se registra como `UI-023` para no reutilizar un codigo con otro alcance.

Informe relacionado: `auditorias/CTRL-008_DECISIONES_CRITICAS_POST_AUDITORIA.md`

## UI-023 - Navegacion y superficies filtradas por rol

**Estado:** Integrada por PR #74 / validada post-merge.

El shell interno filtra la navegacion visible por rol:

- Admin ve modulos transversales.
- Terapeuta ve superficies clinicas, Agenda y Reportes; no ve Finanzas.
- Finanzas ve Finanzas/Pagos y Reportes; no ve superficies clinicas ni Agenda.

El mismo filtro aplica a sidebar desktop y drawer movil. La proteccion por rutas se mantiene como barrera adicional.

QA-006C confirma post-merge que Admin, Terapeuta y Finanzas ven la navegacion esperada y que Finanzas mobile `390x844` abre drawer sin mostrar superficies clinicas ni Agenda.

Informe relacionado: `auditorias/UI-023_NAVEGACION_FILTRADA_ROLES.md`

Validacion relacionada: `auditorias/QA-006C_REVALIDACION_NAVEGACION_FILTRADA_ROLES_POSTMERGE.md`

## UI-022 - Fotos dentro de Elementos del caso

**Estado:** Implementada local / pendiente QA.

Se integra una primera experiencia visual dentro de `ElementosCasoPanel` para cargar, listar y visualizar fotos asociadas a elementos existentes del caso.

### Criterios visuales

- Mantener la funcionalidad dentro de la ficha del caso.
- No crear modulo principal independiente.
- Mostrar conteo de fotos por elemento.
- Mostrar miniaturas mediante URLs temporales firmadas.
- No exponer rutas internas de Storage en pantalla.
- No mostrar fotos ni rutas de Storage al rol Finanzas.
- Mantener clases visuales existentes del sistema clínico.

### Informe relacionado

`docs/control/auditorias/BE-022_UI-022_FOTOS_ELEMENTOS_CASO.md`

## UI-034 - PacientesPage como panel de trabajo diario (especificacion visual)

Aprobada por DEC-043 (2026-07-09). Layout de arriba a abajo:

1. **Metricas superiores** (patron `clinical-metric-card` ya usado en paneles de caso):
   pacientes activos totales, citas de hoy, atendidas hoy, pendientes de hoy.
2. **Barra de acciones** entre metricas y directorio, 4 botones: `Registro completo`
   (vista secundaria con todos los pacientes: el directorio actual), `Nuevo paciente`
   (abre el wizard existente bajo demanda, deja de estar fijo en pantalla), `Editar` y
   `Anular` (anulacion logica, BE-021; etiqueta "Anular", nunca "Borrar").
3. **Directorio del dia** (vista por defecto al entrar): tarjetas de pacientes con cita HOY
   segun `agenda_eventos`, mostrando hora y estado del evento. Una tarjeta por cita (un
   paciente con 2+ citas aparece 2+ veces). Empty state: "Sin pacientes agendados para hoy"
   con acceso directo al registro completo.

Detalle completo y criterios en la ficha UI-034 de `01_PENDIENTES_PROYECTO.md`.
