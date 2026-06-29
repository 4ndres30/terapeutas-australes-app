# CTRL-008 - Decisiones criticas post auditoria

## Estado

Propuesta documental / pendiente integracion.

## Fecha

2026-06-29

## Origen

Auditoria integral post PR #35.

## Objetivo

Registrar decisiones criticas antes de avanzar con seguridad, backend, UI o produccion.

El objetivo no es cerrar artificialmente decisiones que requieren aprobacion humana, sino separar lo que ya es estable de lo que debe quedar como propuesta, pregunta abierta, riesgo o tarea derivada.

## Alcance

Tarea documental y de control.

No incluye:

- cambios funcionales;
- cambios de codigo fuente;
- migraciones;
- modificaciones de migraciones existentes;
- cambios en `supabase/config.toml`;
- cambios en `.env`;
- operaciones sobre Supabase remoto;
- datos reales;
- fotos reales;
- pagos reales;
- merge a `main`.

## Fuentes revisadas

Documentacion:

- `README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/02_REVISION_FLUJO_CLINICO.md`
- `docs/control/03_INTEGRACION_BACKEND_ESTRUCTURA.md`
- `docs/control/04_UI_UX_PULIDO_VISUAL.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`
- `docs/control/auditorias/SEC-001_VALIDACION_RUNTIME_RLS_ROLES.md`
- `docs/control/auditorias/SEC-002_MATRIZ_PERMISOS_ROLES.md`
- `docs/control/auditorias/SEC-004_ALCANCE_ROL_FINANZAS.md`
- `docs/control/auditorias/BE-016_VISTA_FINANCIERA_MINIMA.md`
- `docs/control/auditorias/QA-004_VALIDACION_BE016_FINANZAS.md`
- `docs/control/auditorias/UI-016_REPORTES_POR_ROL.md`
- `docs/control/auditorias/QA-005_VALIDACION_UI016_REPORTES_POR_ROL.md`
- `supabase/dev-seeds/README.md`

Codigo y estructura revisados en modo lectura:

- `src/App.tsx`
- `src/pages/FinanzasPage.tsx`
- `src/pages/ReportesPage.tsx`
- `src/pages/casos/PagosCasoPanel.tsx`
- `src/pages/casos/DetalleRevisionesPanel.tsx`
- `src/pages/casos/TrabajosCasoPanel.tsx`
- `src/hooks/useRevisionHallazgos.ts`
- `supabase/config.toml`
- `supabase/migrations/`

## Decisiones registradas

### Decision 1 - Finanzas y `paciente_id`

**Estado de decision:** Decision propuesta pendiente de aprobacion.

#### Analisis

BE-016 redujo correctamente la superficie financiera para Finanzas. La vista `public.vista_finanzas_unidades_cobrables` no expone nombre completo, telefono, email, motivo de consulta, hallazgos, fotos ni `storage_path`.

Sin embargo, la migracion `supabase/migrations/20260627231000_crear_vista_finanzas_unidades_cobrables.sql` expone `c.paciente_id` y deriva `codigo_paciente` / `alias_administrativo_paciente` desde ese UUID. `src/pages/FinanzasPage.tsx` tambien incluye `paciente_id` dentro de `UNIDAD_COBRABLE_SELECT`, aunque la pantalla usa principalmente alias/codigo administrativos.

Esto no rompe la validacion local de BE-016, QA-004 ni QA-005, pero para datos reales el UUID real del paciente es un identificador estable correlacionable. Si Finanzas obtiene otro canal de lectura, logs, exportaciones o capturas, ese UUID puede servir para unir informacion financiera con informacion clinica.

#### Decision propuesta

Finanzas no debe ver ni consumir `paciente_id` real por defecto en superficies UI, reportes ni exportaciones.

Para datos reales, Finanzas debe operar con:

- `codigo_paciente_administrativo` persistente o alias administrativo;
- identificador financiero no clinico;
- datos de cobro/pago estrictamente necesarios.

El `paciente_id` puede conservarse internamente para joins, RLS, conciliacion tecnica y trazabilidad backend, pero no debe formar parte del contrato de datos visible/consumido por Finanzas salvo aprobacion expresa.

#### Riesgo

Riesgo medio-alto antes de datos reales: correlacion indirecta entre finanzas y clinica por identificador estable.

#### Tareas derivadas

- `BE-023`: definir alias/codigo administrativo persistente y evaluar reemplazo de `paciente_id` visible en `vista_finanzas_unidades_cobrables`.
- `QA-006`: agregar prueba por rol que confirme que Finanzas no recibe `paciente_id` en componentes/contratos visibles cuando se cierre BE-023.

#### Impacto

- BE-016 sigue valido para local/demo.
- `FinanzasPage` y `ReportesPage` no deben considerarse listos para datos reales mientras dependan del `paciente_id` dentro del tipo/selector financiero.
- No se crea migracion en CTRL-008.

### Decision 2 - Terapeuta y pagos dentro de ficha clinica

**Estado de decision:** Decision propuesta pendiente de aprobacion.

#### Analisis

`src/pages/casos/PagosCasoPanel.tsx` vive dentro de la ficha de caso y consulta:

- `vista_cobros_estado`;
- `pagos`;
- `paciente_id`;
- `caso_id`;
- montos, saldos, estados y movimientos.

Las rutas de caso estan permitidas para `admin` y `terapeuta` en `src/App.tsx`. Por lo tanto, el panel existe dentro del flujo clinico. Aunque RLS puede limitar lecturas segun rol, la experiencia actual mezcla superficie clinica con detalle financiero y puede mostrar errores operativos si el rol no puede leer.

SEC-002 ya habia dejado una separacion recomendada: Finanzas administra pagos; Terapeuta, como maximo, podria ver estado basico si Control lo aprueba.

#### Decision propuesta

Terapeuta no debe administrar cobros ni pagos dentro de ficha clinica.

Si Control aprueba visibilidad financiera para Terapeuta, debe ser un estado minimo, sin detalle financiero completo:

- `Sin cobros registrados`;
- `Pendiente administrativo`;
- `Pagado`;
- `Parcial`;
- `Revisar con Finanzas`.

No deberia ver:

- metodos de pago;
- referencias de pago;
- notas financieras;
- observaciones internas;
- gestion de cobros;
- gestion de pagos;
- historial financiero detallado.

Admin puede ver el panel completo mientras se mantenga como rol transversal. Finanzas debe operar el detalle desde `FinanzasPage`, no desde ficha clinica.

#### Riesgo

Riesgo medio: el terapeuta podria condicionar o contaminar el registro clinico con informacion financiera. Tambien hay riesgo de errores visibles si la UI intenta leer tablas que el rol no puede consultar.

#### Tareas derivadas

- `UI-023`: navegacion y superficies por rol; incluir revision de panel financiero en ficha clinica.
- `BE-025`: definir vista/contrato de estado financiero minimo si se aprueba visibilidad para Terapeuta.
- `QA-006`: validar por rol que Terapeuta no administra pagos desde Reportes ni desde ficha clinica.

### Decision 3 - Hallazgo por aspecto revisado

**Estado de decision:** Decision propuesta pendiente de aprobacion clinica.

#### Analisis

El flujo actual favorece un hallazgo por aspecto:

- QA-002 valido prevencion visual de duplicados.
- `src/hooks/useRevisionHallazgos.ts` consulta `revision_hallazgos` por `revision_aspecto_id` antes de insertar y bloquea la creacion si existe un registro.
- `src/pages/casos/DetalleRevisionesPanel.tsx` abre `Ver hallazgo` si el aspecto ya tiene hallazgo.

La base de datos no tiene un constraint unico equivalente sobre `revision_hallazgos.revision_aspecto_id`. La migracion `20260606043000_crear_tabla_revision_hallazgos.sql` tiene indice por `revision_aspecto_id`, pero no una restriccion `unique`.

#### Decision propuesta

Para la primera version operativa: un aspecto revisado debe tener maximo un hallazgo activo.

Si en el futuro se necesita registrar mas de un hallazgo para el mismo aspecto, la forma preferente debe ser:

- crear una nueva revision/aspecto en otra fecha o sesion; o
- definir una regla explicita de multiples hallazgos historicos por aspecto con anulacion logica.

No se debe permitir multiplicidad silenciosa solo por falta de constraint.

#### Riesgo

Riesgo medio: la UI bloquea duplicados, pero otro cliente, script o cambio futuro podria insertar multiples hallazgos por aspecto porque DB no lo impide.

#### Tareas derivadas

- `BE-024`: definir regla final "un hallazgo activo por aspecto" y proponer constraint parcial o validacion SQL compatible con anulacion logica.
- `QA-006`: probar intento de duplicado por UI y, si se implementa DB, por insercion directa local.

### Decision 4 - Relacion hallazgo -> trabajo

**Estado de decision:** Decision estable para primera version / pregunta abierta para evolucion avanzada.

#### Analisis

Ya existen decisiones estables:

- DEC-013: usar `trabajos.revision_hallazgo_origen_id` como hallazgo origen principal.
- DEC-014: no crear tabla puente `trabajo_hallazgos` en esta etapa.
- DEC-015: crear trabajo no crea derivados automaticos.

La migracion `20260606051000_crear_modulo_trabajos.sql` permite `trabajos.revision_hallazgo_origen_id` y valida que el hallazgo pertenezca al mismo paciente/caso. No hay constraint unico que impida varios trabajos con el mismo hallazgo origen.

UI-012 recomienda no promover varios trabajos desde el mismo hallazgo como camino principal, pero deja abierta una accion avanzada futura con confirmacion fuerte.

#### Decision propuesta

IMP-002 debe mantener esta regla:

Hallazgo -> decision manual del terapeuta -> Evaluar trabajo -> Crear trabajo.

Para la primera version:

- no automatizar trabajos desde hallazgos;
- no crear cobros, sesiones ni acciones automaticamente;
- usar `trabajos.revision_hallazgo_origen_id`;
- consultar si ya existe trabajo con el mismo `revision_hallazgo_origen_id`;
- no promover multiples trabajos desde un mismo hallazgo como camino normal.

#### Pregunta abierta

El equipo clinico debe confirmar si un hallazgo puede originar mas de un trabajo formal en escenarios reales.

Mientras no exista esa aprobacion, la UI debe tratar un segundo trabajo desde el mismo hallazgo como caso excepcional, no como flujo principal.

#### Tareas derivadas

- Actualizar `IMP-002` para depender de CTRL-008 y validar duplicidad de trabajo por hallazgo.
- Crear una tarea backend futura solo si se aprueba una relacion muchos-a-muchos o multiples trabajos recurrentes por hallazgo.

### Decision 5 - Delete fisico vs anulacion logica

**Estado de decision:** Decision propuesta pendiente de aprobacion formal / bloqueante para datos reales.

#### Analisis

SEC-002 y SEC-004 recomiendan anular antes que borrar. SEC-001 confirma que fotos/Storage no permiten delete fisico en el runtime probado, pero tambien detecta que no existe politica transversal de anulacion logica.

La migracion `20260606055000_activar_rls_y_policies.sql` mantiene grants amplios con `delete` y una policy `usuarios_internos_delete_admin`. Varias FK usan `on delete cascade` en tablas dependientes. Esto puede ser aceptable para demo/local, pero no para datos clinicos reales sin una politica explicita.

#### Decision propuesta

Para produccion y datos reales:

- no permitir delete fisico operativo en tablas clinicas;
- no permitir delete fisico operativo en tablas financieras;
- no permitir delete fisico operativo en fotos/Storage;
- no borrar usuarios internos como practica normal; desactivar con `activo=false`;
- implementar anulacion logica con campos de estado, motivo, usuario, fecha y auditoria;
- reservar delete fisico solo para mantenimiento tecnico excepcional, documentado y aprobado.

#### Tablas afectadas

- `pacientes`
- `consultas`
- `evaluaciones`
- `casos`
- `elementos_caso`
- `revisiones`
- `revision_elementos`
- `revision_aspectos`
- `revision_hallazgos`
- `trabajos`
- `trabajo_elementos`
- `trabajo_sesiones`
- `trabajo_acciones`
- `cobros`
- `pagos`
- `fotos_elementos_caso`
- `usuarios_internos`
- objetos de Storage del bucket `elementos-caso`

#### Riesgo

Riesgo alto antes de produccion: perdida de trazabilidad clinica/financiera, imposibilidad de auditoria, cascadas accidentales y conflictos legales/operativos.

#### Tareas derivadas

- `BE-021`: disenar e implementar por fases anulacion logica transversal.
- `SEC-005`: auditar cambios sensibles y anulaciones.
- `QA-006`: probar que roles no puedan ejecutar delete fisico operativo en local.

### Decision 6 - Campos financieros con texto visible para Finanzas

**Estado de decision:** Decision propuesta pendiente de aprobacion.

#### Analisis

SEC-001 detecto que `cobros` queda accesible completo para Finanzas y que campos libres pueden filtrar clinica si se usan mal.

La tabla `cobros` contiene `concepto_cobro`, `descripcion_cobro`, `observaciones` y `notas_internas`. La tabla `pagos` contiene `observaciones` y `notas_internas`. La vista financiera minima expone un `concepto_cobro_administrativo` calculado, lo cual reduce riesgo, pero no elimina el riesgo si Finanzas accede a tablas base o si futuras pantallas usan campos libres.

#### Decision propuesta

Campos permitidos para Finanzas:

- codigo/alias administrativo de paciente;
- tipo de unidad cobrable;
- referencia administrativa no clinica;
- concepto administrativo controlado;
- fechas de cobro/vencimiento/pago;
- moneda;
- montos;
- saldos;
- estado de cobro;
- estado de pago;
- metodo de pago;
- referencia de pago no clinica.

Campos que no deben contener ni mostrar contenido clinico a Finanzas:

- `cobros.concepto_cobro`, si se permite texto libre;
- `cobros.descripcion_cobro`;
- `cobros.observaciones`;
- `cobros.notas_internas`;
- `pagos.observaciones`;
- `pagos.notas_internas`;
- `pagos.referencia_pago`, si se usa para escribir detalles clinicos.

La regla operativa debe ser: Finanzas ve conceptos administrativos, no resumen clinico.

#### Riesgo

Riesgo alto si se usan textos libres para describir motivos, hallazgos, trabajos energeticos, notas internas o contexto clinico dentro de campos financieros.

#### Tareas derivadas

- `BE-025`: definir contrato de campos financieros permitidos/prohibidos y evaluar checks, vistas o separacion de campos.
- `UI-015`: ajustar microcopy de formularios financieros para prohibir contenido clinico.
- `QA-006`: incluir prueba manual/automatizada de no exposicion de textos clinicos en Finanzas.

### Decision 7 - Politica minima de fotos

**Estado de decision:** Decision propuesta pendiente de aprobacion / bloqueo para fotos reales.

#### Analisis

DEC-018 define Storage privado y tabla `public.fotos_elementos_caso`. SEC-001 valido runtime local: Admin/Terapeuta pueden operar fotos, Finanzas queda bloqueado y no ve `storage_path`. Aun asi, quedan observaciones de hardening, auditoria, retencion y objetos huerfanos.

`fotos_elementos_caso` guarda `storage_path`, `estado_foto` y metadatos. La UI usa URLs firmadas temporales, pero el uso con fotos reales sigue bloqueado por PROD-001.

#### Decision propuesta

Politica minima antes de fotos reales:

- solo Admin y Terapeuta pueden subir/ver fotos clinicas;
- Finanzas no ve fotos, miniaturas, rutas ni `storage_path`;
- toda foto debe pertenecer a paciente, caso y elemento validos;
- no se debe exponer `storage_path` en UI;
- anular/archivar foto debe ser logico, no delete fisico operativo;
- debe existir auditoria de subida, cambio de estado y acceso sensible cuando aplique;
- debe existir procedimiento para detectar objetos huerfanos entre Storage y `fotos_elementos_caso`;
- debe definirse retencion y eliminacion excepcional;
- no usar fotos reales hasta cerrar QA-003, SEC-005, BE-021 y PROD-001.

#### Riesgo

Riesgo alto: las fotos son archivos clinicos sensibles. Un error de Storage, signed URLs, grants o logs puede filtrar informacion personal o clinica.

#### Tareas derivadas

- `SEC-006`: politica de fotos, retencion y objetos huerfanos.
- `QA-003`: validacion funcional local de fotos con imagen ficticia.
- `SEC-005`: auditoria sensible para fotos.
- `BE-021`: anulacion logica de fotos.

### Decision 8 - Scripts manuales tipo `console.sql`

**Estado de decision:** Decision propuesta pendiente de aprobacion.

#### Analisis

El proyecto usa Supabase Auth y `usuarios_internos`. Para demo/local pueden existir scripts manuales de usuarios, pero normalizar manipulacion directa de `auth.users` es riesgoso, especialmente si se replica en staging/produccion.

`supabase/dev-seeds/README.md` recalca uso local/demo y no uso con datos reales. SEC-003 sigue pendiente para hardening Auth.

#### Decision propuesta

Scripts manuales sobre `auth.users` o usuarios demo:

- permitidos solo en local/demo;
- prohibidos en produccion;
- prohibidos como procedimiento normal de alta/baja/cambio de rol;
- deben ser idempotentes, documentados y sin secretos;
- deben preferir Supabase Auth Admin/API o procedimiento aprobado cuando exista;
- no deben copiarse desde consolas personales a practicas operativas sin revision.

#### Riesgo

Riesgo medio-alto: inconsistencias entre Auth y `usuarios_internos`, errores de rol, cuentas huerfanas, saltos de confirmacion de email/MFA y filtracion de credenciales demo.

#### Tareas derivadas

- `SEC-007`: procedimiento controlado para usuarios demo/local y prohibicion de scripts manuales en produccion.
- `SEC-003`: hardening Auth debe cubrir signup, confirmacion, MFA, usuarios invitados y alta/baja/cambio de rol.

### Decision 9 - Ambientes

**Estado de decision:** Decision propuesta pendiente de aprobacion.

#### Analisis

El proyecto sigue local/demo/preproduccion. README y estado general mantienen PROD-001 como bloqueante. `supabase/config.toml` usa `site_url = "http://127.0.0.1:3000"` y `enable_signup = true` para el entorno local, lo cual requiere hardening antes de cualquier entorno real.

UI-020 y UI-021 ya existen como pendientes, pero falta manual de ambientes y separacion tecnica.

#### Decision propuesta

El proyecto debe reconocer formalmente cuatro ambientes:

- `LOCAL`: desarrollo individual, datos ficticios, Supabase local.
- `DEMO`: demostracion controlada, datos ficticios, sin pacientes reales.
- `STAGING`: preproduccion con configuracion cercana a produccion, sin datos reales salvo aprobacion especifica.
- `PRODUCCION`: uso real, solo despues de cerrar PROD-001 y checklist aprobado.

Mientras PROD-001 siga abierto, UI debe mostrar claramente que el sistema no esta habilitado para datos reales.

#### Riesgo

Riesgo alto: confundir demo/staging/produccion puede provocar carga accidental de pacientes, fotos o pagos reales en un ambiente no gobernado.

#### Tareas derivadas

- `BE-018`: separacion tecnica de ambientes.
- `DOC-001`: manual de ambientes.
- `UI-020`: indicador visual de ambiente activo.
- `UI-021`: bloqueo visual de produccion no habilitada.
- `SEC-003`: hardening Auth por ambiente.

### Decision 10 - Aprobacion de carga real

**Estado de decision:** Pregunta abierta bloqueante / decision propuesta de control.

#### Analisis

El proyecto no esta habilitado para datos reales, fotos reales, pagos reales ni produccion. PROD-001 sigue bloqueante en README, estado general, auditorias SEC/QA y documentos maestros.

Antes de invitar pacientes reales, el equipo debe tener aprobacion explicita, checklist y evidencia tecnica.

#### Decision propuesta

La carga real debe requerir aprobacion explicita de Javier / Control de Desarrollo, con checklist firmado o registrado en `docs/control/`.

Checklist preliminar:

- SEC-003 cerrado: Auth endurecido.
- SEC-005 cerrado: auditoria sensible definida y probada.
- BE-021 cerrado: anulacion logica transversal definida.
- BE-018 cerrado: ambientes separados.
- BE-019 cerrado: backup/restauracion documentado y probado.
- BE-020 cerrado: consentimiento informado y tratamiento de datos.
- QA-006 cerrado: pruebas minimas por rol.
- QA-003 cerrado si habra fotos reales.
- BE-023 cerrado si Finanzas no debe ver `paciente_id`.
- BE-025 cerrado si Finanzas operara campos de texto financiero.
- UI-020/UI-021 cerradas: indicador y bloqueo visual.
- Matriz de permisos vigente y validada local/staging.
- Procedimiento de carga real documentado.
- Procedimiento de respuesta ante incidente documentado.
- Prohibicion de seeds demo en produccion confirmada.

#### Preguntas abiertas bloqueantes

- Quien aprueba formalmente el primer uso con datos reales?
- Que evidencia minima debe adjuntarse antes de aprobar?
- Se permitira staging con datos reales anonimizados o siempre ficticios?
- Se permitiran fotos reales desde el primer uso real o en una fase posterior?
- Se permitiran pagos reales desde el primer uso real o en una fase posterior?

#### Riesgo

Riesgo critico: operar datos sensibles sin gobierno minimo puede generar exposicion clinica, perdida de trazabilidad, errores financieros y responsabilidad legal/privacidad.

#### Tareas derivadas

- `DOC-003`: politica de carga de datos reales.
- `PROD-001`: mantener bloqueante hasta cierre completo.
- `QA-006`: pruebas minimas por rol antes de produccion.

## Tabla resumen de decisiones

| Codigo | Tema | Estado | Decision propuesta | Bloquea | Tarea derivada |
| --- | --- | --- | --- | --- | --- |
| DEC-022 | Finanzas y `paciente_id` | Propuesta pendiente aprobacion | No exponer `paciente_id` real a Finanzas por defecto. | Datos reales / Finanzas | BE-023, QA-006 |
| DEC-023 | Terapeuta y pagos en ficha clinica | Propuesta pendiente aprobacion | Terapeuta no administra pagos; como maximo ve estado minimo aprobado. | UI de caso / permisos | UI-023, BE-025, QA-006 |
| DEC-024 | Hallazgo por aspecto | Propuesta pendiente aprobacion clinica | Primera version: maximo un hallazgo activo por aspecto. | IMP-002 / DB constraint | BE-024, QA-006 |
| DEC-025 | Hallazgo -> trabajo | Estable v1 / abierta evolucion | Usar `revision_hallazgo_origen_id`; no tabla puente inicial; no automatismos. | IMP-002 | IMP-002 |
| DEC-026 | Delete fisico vs anulacion | Propuesta bloqueante | Produccion debe usar anulacion logica, no delete fisico operativo. | PROD-001 | BE-021, SEC-005 |
| DEC-027 | Campos financieros visibles | Propuesta pendiente aprobacion | Finanzas ve textos administrativos, no contenido clinico en campos libres. | Datos reales / Finanzas | BE-025, UI-015, QA-006 |
| DEC-028 | Fotos | Propuesta bloqueante | Fotos reales bloqueadas hasta politica, QA, auditoria y anulacion. | Fotos reales / PROD-001 | SEC-006, QA-003, SEC-005, BE-021 |
| DEC-029 | Scripts manuales | Propuesta pendiente aprobacion | Solo local/demo; prohibidos en produccion; procedimiento idempotente. | SEC-003 / produccion | SEC-007, SEC-003 |
| DEC-030 | Ambientes | Propuesta pendiente aprobacion | Reconocer LOCAL, DEMO, STAGING y PRODUCCION. | PROD-001 | BE-018, DOC-001, UI-020, UI-021 |
| DEC-031 | Carga real | Pregunta abierta bloqueante | Carga real solo con aprobacion explicita y checklist. | PROD-001 | DOC-003, QA-006 |

## Tareas derivadas sugeridas

### Backend

- `BE-021`: anulacion logica transversal.
- `BE-023`: alias/codigo administrativo persistente y ocultamiento de `paciente_id` visible a Finanzas.
- `BE-024`: regla DB/UI para hallazgo unico o multiple por aspecto.
- `BE-025`: contrato de campos financieros permitidos/prohibidos.
- `BE-018`: separacion tecnica de ambientes.
- `BE-019`: backup/restauracion.
- `BE-020`: consentimiento informado y tratamiento de datos.

### Seguridad

- `SEC-003`: hardening Auth.
- `SEC-005`: auditoria sensible.
- `SEC-006`: politica de fotos, retencion y objetos huerfanos.
- `SEC-007`: procedimiento de scripts manuales locales/demo y prohibicion en produccion.

### UI/UX

- `UI-023`: navegacion filtrada por rol.
- `UI-020`: indicador visual de ambiente.
- `UI-021`: bloqueo visual de produccion no habilitada.
- `UI-015`: finanzas por unidad cobrable con microcopy administrativa.

Nota de control: `UI-017` ya existe en la documentacion como checklist responsive de pantallas clinicas. Para no reutilizar codigo con otro alcance, la navegacion filtrada por rol se registra como `UI-023`.

### QA

- `QA-003`: fotos de elementos con imagen ficticia local.
- `QA-006`: pruebas minimas por rol y no exposicion de datos sensibles.

### Produccion

- `PROD-001`: se mantiene bloqueante.
- `DOC-001`: manual de ambientes.
- `DOC-002`: procedimiento de backup/restauracion.
- `DOC-003`: politica de carga de datos reales.

### Control

- Mantener decisiones DEC-022 a DEC-031 como insumo obligatorio para SEC-003, SEC-005, BE-021, BE-023, BE-024, BE-025, UI-020, UI-021, UI-023 y QA-006.

## Riesgos si no se decide

1. Finanzas podria correlacionar datos financieros y clinicos por `paciente_id`.
2. Terapeuta podria ver o usar informacion financiera mas alla de lo necesario.
3. La UI podria bloquear duplicados de hallazgos mientras DB permite duplicados por otros canales.
4. IMP-002 podria implementar multiples trabajos desde hallazgos sin regla clinica aprobada.
5. Delete fisico podria destruir trazabilidad clinica/financiera.
6. Campos libres financieros podrian filtrar clinica sensible.
7. Fotos reales podrian exponerse por Storage, rutas, miniaturas, logs o retencion no definida.
8. Scripts manuales sobre Auth podrian normalizar practicas inseguras.
9. Ambientes podrian confundirse, habilitando carga real accidental.
10. Produccion podria abrirse sin checklist, auditoria ni aprobacion formal.

## Conclusion

CTRL-008 no habilita implementacion, migraciones, datos reales ni produccion.

El siguiente paso recomendado es revisar y aprobar estas decisiones. Despues, avanzar en PRs separados:

1. `SEC-003` hardening Auth.
2. `SEC-005` diseno de auditoria sensible.
3. `BE-021` diseno de anulacion logica.
4. `BE-023` revision de `paciente_id` visible para Finanzas.
5. `UI-023` navegacion filtrada por rol.
6. `QA-006` base minima de pruebas por rol.

No se recomienda avanzar a IMP-002, fotos reales, pagos reales o produccion hasta cerrar las decisiones y tareas bloqueantes anteriores.
