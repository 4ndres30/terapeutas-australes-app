# Terapeutas Australes App

Software de gestion para **Terapeutas Australes**, desarrollado como una aplicacion web para organizar pacientes, consultas, evaluaciones, casos terapeuticos, elementos involucrados, revisiones radiestesicas/canalizadas, aspectos revisados y hallazgos relevantes.

El proyecto se esta construyendo paso a paso, tabla por tabla y modulo por modulo, usando **WebStorm** como IDE principal y **Supabase/PostgreSQL** como base de datos y backend.

---

## Estado actual del proyecto

El proyecto se encuentra en etapa local/demo de saneamiento tecnico, seguridad y control documental. Ya cuenta con base de datos clinica principal, frontend funcional, Supabase Auth, RLS por roles, vista financiera minima para Finanzas y reportes separados por rol.

El sistema no esta habilitado para datos reales, fotos reales, pagos reales ni uso productivo. PROD-001 sigue bloqueante hasta cerrar separacion de ambientes, hardening Auth, auditoria sensible, anulacion logica, backups, consentimiento y checklist preproduccion.

Tablas trabajadas hasta ahora:

| Tabla | Estado | Descripcion |
|---|---|---|
| `pacientes` | Integrada | Registro principal de pacientes. |
| `consultas` | Integrada | Registro de consultas, sesiones o atenciones asociadas a pacientes. |
| `evaluaciones` | Integrada | Levantamiento de antecedentes que puede justificar una revision o apertura de caso. |
| `casos` | Integrada | Procesos terapeuticos abiertos para un paciente. Conecta paciente, consulta, evaluacion y trabajo posterior. |
| `elementos_caso` | Integrada | Personas, hogares, negocios, lugares, objetos u otros involucrados relevantes dentro de un caso. |
| `revisiones` | Integrada | Sesion general de revision del caso. |
| `revision_elementos` | Integrada | Elementos del caso incluidos en una revision especifica. |
| `revision_aspectos` | Integrada | Aspectos revisados por cada elemento, con medicion radiestesica, presencia, tipo detectado, observaciones y canalizacion. Incluye cuerpos sutiles, trauma energetico, separacion, retraimiento, aislamiento, secuestro, integracion, alineacion y localizacion. |
| `revision_hallazgos` | Integrada | Hallazgos relevantes detectados durante la revision de un aspecto. Incluye cuerpos sutiles alterados, separados, retraidos, aislados, secuestrados, trauma localizado y desalineacion energetica. |
| `trabajos` | Integrada base / UI lectura | Modulo separado para registrar acciones realizadas, avances, intervenciones y resultados. La creacion operativa desde hallazgos sigue pendiente y debe ser manual. |
| `cobros` / `pagos` | Integrada base | Modulo financiero con vista minima para Finanzas. No habilita pagos reales. |
| `fotos_elementos_caso` | Local/demo / pend. QA | Metadatos de fotos con Storage privado. No habilita fotos reales. |

---

## Stack tecnico

- **Frontend:** React + TypeScript + Vite
- **IDE principal:** WebStorm
- **Base de datos:** Supabase / PostgreSQL
- **Cliente Supabase:** `@supabase/supabase-js`
- **Formularios:** React Hook Form
- **Validaciones:** Zod
- **Tablas UI:** TanStack React Table
- **Rutas:** React Router
- **Iconos:** Lucide React
- **Control de versiones:** Git + GitHub

---

## Estructura general esperada

```text
terapeutas-australes-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   └── App.tsx
├── supabase/
│   └── migrations/
├── docs/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

La carpeta mas importante para el desarrollo de la base de datos es:

```text
supabase/migrations/
```

Ahi se guardan los cambios estructurales de la base de datos como migraciones SQL.

---

## Modelo relacional actual

La base de datos sigue esta logica:

```text
pacientes
├── consultas
├── evaluaciones
└── casos
     ├── elementos_caso
     └── revisiones
          └── revision_elementos
               └── revision_aspectos
                    └── revision_hallazgos
                         └── trabajos
```

Regla principal del modelo:

- `pacientes` identifica a la persona registrada en el sistema.
- `consultas` registra atenciones, sesiones, contactos o agendamientos.
- `evaluaciones` recaba antecedentes y ayuda a decidir si corresponde abrir caso o realizar revision.
- `casos` agrupa procesos terapeuticos completos.
- `elementos_caso` registra personas, hogares, negocios, lugares, objetos u otros involucrados relevantes del caso.
- `revisiones` registra la sesion general de revision del caso.
- `revision_elementos` registra que elementos del caso fueron incluidos en una revision.
- `revision_aspectos` registra que aspectos fueron revisados en cada elemento y permite almacenar porcentajes, presencia detectada, tipo detectado, observaciones e informacion canalizada.
- `revision_hallazgos` registra hallazgos relevantes detectados durante la revision.
- `trabajos` registra lo que se hizo, avanzo, intervino o cerro. Un hallazgo puede originar un trabajo solo por decision manual del terapeuta.
- `cobros` y `pagos` registran informacion financiera. Finanzas debe operar sobre superficies minimas y no leer clinica sensible.

Frases guia del modelo:

```text
casos no guarda todo; casos conecta todo.
revisiones registra la sesion.
revision_elementos registra a quien o que se reviso.
revision_aspectos registra que se midio o reviso.
revision_hallazgos registra lo relevante encontrado.
trabajos registra lo que se hizo.
```

---

## Estrategia de desarrollo actual

La estrategia acordada es:

1. Completar primero la base de datos.
2. Validar cada tabla localmente en Supabase/PostgreSQL.
3. Integrar cada modulo mediante ramas Git.
4. Documentar el avance tecnico.
5. Luego construir formularios, pantallas, vistas y navegacion.
6. Antes de produccion, integrar seguridad con Supabase Auth y Row Level Security.

Esta estrategia permite evitar rehacer formularios por cambios estructurales de base de datos.

---

## Tabla `pacientes`

La tabla `pacientes` contiene los datos principales requeridos para identificar y contactar a una persona.

Estado actual:

- Se elimino el uso de RUT.
- Se integro `fecha_nacimiento` como campo requerido.
- Se eliminaron columnas no necesarias para el registro base del paciente.
- Se definieron campos requeridos para mantener registros completos.
- Se agregaron checks para `sexo` y `estado`.
- Se agrego trigger para actualizar `updated_at` automaticamente.

---

## Tabla `consultas`

La tabla `consultas` registra cada atencion, sesion, cita o contacto con un paciente.

Relacion principal:

```text
pacientes.id → consultas.paciente_id
```

Campos principales:

```text
id_consulta
paciente_id
fecha_consulta
hora_inicio
hora_termino
tipo_consulta
modalidad
estado_consulta
motivo_consulta
resumen_consulta
observaciones_internas
created_at
updated_at
```

La tabla incluye:

- Clave primaria UUID.
- Relacion con `pacientes` mediante `paciente_id`.
- Validaciones `check` para tipo de consulta, modalidad y estado.
- Indices para busqueda por paciente y fecha.
- Trigger para actualizar `updated_at` automaticamente.

---

## Tabla `evaluaciones`

La tabla `evaluaciones` registra el levantamiento de antecedentes relevantes antes de decidir si corresponde revision o apertura de caso.

Relaciones principales:

```text
pacientes.id → evaluaciones.paciente_id
consultas.id_consulta → evaluaciones.consulta_id
```

Campos principales:

```text
id_evaluacion
paciente_id
consulta_id
fecha_evaluacion
hora_evaluacion
relato_antecedentes
sintomas_reportados
hechos_clave
personas_mencionadas
decision_revision
fundamento_decision
notas_internas
estado_evaluacion
created_at
updated_at
```

Criterio conceptual:

```text
evaluaciones recaba antecedentes; no reemplaza a revisiones ni registra trabajos realizados.
```

---

## Tabla `casos`

La tabla `casos` agrupa un proceso terapeutico completo.

Relaciones principales:

```text
pacientes.id → casos.paciente_id
consultas.id_consulta → casos.consulta_id
evaluaciones.id_evaluacion → casos.evaluacion_id
```

Campos principales:

```text
id_caso
paciente_id
consulta_id
evaluacion_id
fecha_apertura
hora_apertura
nombre_caso
motivo_apertura
descripcion_general
objetivo_trabajo
tipo_caso
prioridad
estado_caso
requiere_seguimiento
notas_seguimiento
fecha_cierre
resultado_cierre
notas_internas
created_at
updated_at
```

Criterio conceptual:

```text
casos conecta el proceso; no debe guardar todo el detalle del trabajo ni de la revision.
```

---

## Tabla `elementos_caso`

La tabla `elementos_caso` registra los involucrados o elementos relevantes dentro de un caso.

Ejemplos:

```text
Consultante
Hijo
Pareja
Expareja
Casa familiar
Negocio
Lugar
Objeto
Mascota/Animal
Organizacion
Otro
```

Relaciones principales:

```text
pacientes.id → elementos_caso.paciente_id
casos.id_caso → elementos_caso.caso_id
```

Campos principales:

```text
id_elemento_caso
paciente_id
caso_id
tipo_elemento
nombre_elemento
vinculo_con_paciente
rol_en_caso
prioridad_elemento
orden_elemento
fecha_nacimiento
foto_url
descripcion_referencia
antecedentes_relevantes
motivo_inclusion
fuente_informacion
nivel_confirmacion
estado_elemento
notas_internas
created_at
updated_at
```

La tabla incluye una validacion para impedir que un elemento quede asociado a un paciente distinto al paciente del caso.

---

## Modulo de revisiones

El modulo de revisiones esta compuesto por cuatro tablas:

```text
revisiones
revision_elementos
revision_aspectos
revision_hallazgos
```

Este modulo permite registrar revisiones radiestesicas/canalizadas de forma flexible, sin mezclar observacion con trabajo realizado.

Tambien permite registrar estados asociados a cuerpos sutiles y traumas energeticos, por ejemplo:

```text
cuerpos sutiles separados
cuerpos sutiles retraidos
cuerpos sutiles aislados
cuerpos sutiles secuestrados
traumas energeticos localizados
desalineacion energetica
estado de integracion de cuerpos
estado de alineacion energetica
```

---

## Tabla `revisiones`

Registra la sesion general de revision.

Relaciones principales:

```text
pacientes.id → revisiones.paciente_id
casos.id_caso → revisiones.caso_id
consultas.id_consulta → revisiones.consulta_id
evaluaciones.id_evaluacion → revisiones.evaluacion_id
```

Campos principales:

```text
id_revision
paciente_id
caso_id
consulta_id
evaluacion_id
fecha_revision
hora_inicio
hora_termino
numero_revision
tipo_revision
modalidad
metodo_revision
alcance_revision
objetivo_revision
resumen_general
resultado_general
requiere_seguimiento
proxima_accion
estado_revision
notas_internas
created_at
updated_at
```

Incluye:

- Numero de revision unico por caso.
- Validacion de coherencia paciente/caso/consulta/evaluacion.
- Validacion de horario.
- Trigger `updated_at`.

---

## Tabla `revision_elementos`

Registra los elementos del caso incluidos dentro de una revision.

Relaciones principales:

```text
pacientes.id → revision_elementos.paciente_id
casos.id_caso → revision_elementos.caso_id
revisiones.id_revision → revision_elementos.revision_id
elementos_caso.id_elemento_caso → revision_elementos.elemento_caso_id
```

Campos principales:

```text
id_revision_elemento
paciente_id
caso_id
revision_id
elemento_caso_id
orden_revision
prioridad_revision
estado_revision_elemento
requiere_seguimiento
motivo_pendiente
resumen_elemento
proxima_accion_elemento
notas_internas
created_at
updated_at
```

Incluye restriccion:

```text
unique (revision_id, elemento_caso_id)
```

Esto evita repetir el mismo elemento dentro de una misma revision.

---

## Tabla `revision_aspectos`

Registra cada aspecto revisado dentro de cada elemento de una revision.

Esta tabla es el nucleo operativo para radiestesia, mediciones y canalizacion.

Relaciones principales:

```text
pacientes.id → revision_aspectos.paciente_id
casos.id_caso → revision_aspectos.caso_id
revisiones.id_revision → revision_aspectos.revision_id
revision_elementos.id_revision_elemento → revision_aspectos.revision_elemento_id
elementos_caso.id_elemento_caso → revision_aspectos.elemento_caso_id
```

Campos principales:

```text
id_revision_aspecto
paciente_id
caso_id
revision_id
revision_elemento_id
elemento_caso_id
orden_aspecto
area_revision
aspecto_revisado
metodo_revision
tipo_medicion
metrica_revision
valor_porcentaje
presencia_detectada
tipo_detectado
estado_revision_aspecto
resultado_aspecto
requiere_seguimiento
pendiente_revision
motivo_pendiente
informacion_canalizada
observaciones
notas_internas
created_at
updated_at
```

Permite registrar:

```text
porcentajes de estabilidad
porcentajes de bloqueo
presencia si/no
entidades o presencias detectadas
tipos de magia negra o trabajos
abundancia
proteccion
cuerpos sutiles separados, retraidos, aislados o secuestrados
traumas energeticos localizados
integracion y alineacion energetica
informacion canalizada
observaciones libres
```

Opciones ampliadas relevantes:

```text
area_revision:
- Cuerpos sutiles
- Trauma energetico

metrica_revision:
- Separacion
- Retraimiento
- Aislamiento
- Secuestro
- Integracion
- Alineacion
- Localizacion
```

---

## Tabla `revision_hallazgos`

Registra hallazgos relevantes detectados durante la revision de un aspecto.

No todos los aspectos requieren hallazgo. La tabla se usa cuando aparece algo que debe destacarse, monitorearse o derivarse a trabajo posterior.

Relaciones principales:

```text
pacientes.id → revision_hallazgos.paciente_id
casos.id_caso → revision_hallazgos.caso_id
revisiones.id_revision → revision_hallazgos.revision_id
revision_elementos.id_revision_elemento → revision_hallazgos.revision_elemento_id
revision_aspectos.id_revision_aspecto → revision_hallazgos.revision_aspecto_id
elementos_caso.id_elemento_caso → revision_hallazgos.elemento_caso_id
```

Campos principales:

```text
id_revision_hallazgo
paciente_id
caso_id
revision_id
revision_elemento_id
revision_aspecto_id
elemento_caso_id
categoria_hallazgo
tipo_hallazgo
subtipo_hallazgo
descripcion_hallazgo
intensidad_hallazgo_porcentaje
nivel_bloqueo_porcentaje
origen_sugerido
fuente_deteccion
nivel_confirmacion
requiere_seguimiento
prioridad_hallazgo
estado_hallazgo
informacion_canalizada
observaciones
notas_internas
created_at
updated_at
```

Categorias ampliadas relevantes:

```text
Cuerpo sutil alterado
Cuerpo sutil separado
Cuerpo sutil retraido
Cuerpo sutil aislado
Cuerpo sutil secuestrado
Trauma localizado
Desalineacion energetica
```

---

## Modulo `trabajos`

El modulo `trabajos` ya existe como estructura base y se consulta desde la ficha del caso. La creacion operativa desde hallazgos sigue pendiente para IMP-002 y no debe automatizar cobros, sesiones ni acciones.

Criterio definido:

```text
revisiones registra lo observado, medido o detectado.
trabajos registrara lo realizado, intervenido, avanzado o cerrado.
```

El modulo `trabajos` se conecta al menos con:

```text
paciente_id
caso_id
revision_id opcional
elemento_caso_id opcional
revision_hallazgo_id opcional
```

Trabajos frecuentes que debe considerar el modulo:

```text
retiro de entidades
retiro de espiritus trascendidos
liberacion de trabajo energetico
desarme de trabajo energetico
limpieza energetica de persona
limpieza energetica de casa, hogar, habitacion o terreno
ajuste energetico posterior a limpieza
sello energetico de persona
sello energetico de lugar
sello de dano
sello de entidades
integracion de cuerpos sutiles
recuperacion de cuerpos sutiles
liberacion de cuerpos sutiles secuestrados
trabajo sobre trauma localizado
seguimiento de ajuste energetico por varias semanas
```

---

## Flujo de trabajo con Git

El proyecto se trabaja usando ramas para mantener protegida la version base.

Flujo recomendado:

```text
main
└── rama-de-trabajo
```

Ejemplo:

```bash
git checkout -b feature/nueva-tabla
```

Cuando los cambios esten listos:

```bash
git add .
git commit -m "Agrega nueva tabla"
git push origin feature/nueva-tabla
```

Luego se revisa, se prueba localmente y se integra a `main` cuando este validado.

---

## Flujo para nuevas tablas

Cada nueva tabla se trabajara con el siguiente orden:

1. Propuesta conceptual de la tabla.
2. Revision y validacion de campos.
3. Creacion del SQL.
4. Ejecucion en Supabase/PostgreSQL local.
5. Revision visual en WebStorm.
6. Commit y push a GitHub.
7. Fusion a `main` solo cuando este validada.

---

## Estrategia futura de API publica

El sistema interno no debe exponerse directamente a una pagina publica.

La futura pagina publica de agendamiento debe usar una API segura como frontera entre el sitio publico, el sistema interno, Supabase y Google Calendar/Gmail/Workspace.

Esa API debera validar solicitudes, registrar consentimiento, crear solicitudes o citas segun el modelo de Agenda aprobado, sincronizar Calendar con eventos neutros y enviar correos neutros mediante Gmail/Workspace.

La API esta planificada documentalmente en `docs/control/auditorias/API-001_DISENO_API_PUBLICA_GOOGLE_WORKSPACE.md`, pero no esta implementada. Su desarrollo queda condicionado a cerrar Agenda operativa, consentimiento, ambientes, auditoria sensible, seguridad de API y PROD-001.

La pagina publica no debe escribir directamente en tablas clinicas, financieras ni internas.

---

## Roadmap tecnico Google Cloud

Google Cloud queda incorporado solo como plataforma futura para API segura, integracion Google Workspace, despliegue futuro, automatizacion y operacion por ambientes.

Supabase/PostgreSQL sigue siendo la base actual del sistema interno. Supabase Auth y RLS siguen siendo el mecanismo actual de autenticacion y control de acceso.

En esta fase no se migra la base de datos, Auth, Storage ni produccion. Tampoco se crean proyectos Google Cloud, credenciales, endpoints, infraestructura ni despliegues cloud.

Google Calendar y Gmail deben integrarse solo desde un backend seguro futuro, con secretos fuera del frontend, eventos neutros y correos neutros.

La hoja de ruta queda documentada en `docs/control/07_ESTRATEGIA_GOOGLE_CLOUD.md`, `docs/control/08_SINCRONIZACION_MAESTROS_GOOGLE_CLOUD.md` y los informes `DEC-035`, `BE-030`, `SEC-010`, `DOC-005` y `QA-007`.

PROD-001 sigue bloqueante para datos reales, fotos reales, pagos reales y produccion.

---

## Diseno futuro de Agenda operativa

Agenda queda definida documentalmente como un flujo separado de la consulta clinica confirmada.

La arquitectura distingue `solicitudes_agenda` para solicitudes iniciales, `agenda_eventos` para eventos internos tipificados y `consultas` para atenciones o contactos confirmados con paciente real.

BE-028 deja implementado el modelo DB inicial versionado para Agenda operativa en `supabase/migrations/20260701040000_crear_modelo_agenda_operativa.sql`.

BE-029 valida localmente ese modelo en Supabase local/demo: roles, RLS, checks, FKs, triggers y vista operativa quedan comprobados sin usar datos reales ni tocar Supabase remoto.

UI-025 integra `/agenda` como lectura interna desde `public.vista_agenda_operativa`, con listado, filtros y separacion visual entre solicitudes vinculadas, eventos internos y consultas confirmadas.

UI-025B habilita alta y edicion manual minima de `agenda_eventos` para usuarios internos autorizados, incluyendo cambios de estado, cancelacion logica, reagendamiento y cierre como completado.

Agenda todavia no tiene API publica operativa, integracion Google Calendar/Gmail ni produccion habilitada. La UI interna no crea pacientes, consultas ni solicitudes automaticamente.

Antes de conectar una pagina publica real se debe cerrar Agenda operativa, consentimiento, ambientes, auditoria sensible, seguridad API y PROD-001.

---

## Seguridad

No se deben subir claves reales al repositorio.

Archivos que no deben versionarse:

```text
.env
.env.local
*.local
node_modules/
dist/
```

El repositorio puede incluir un archivo seguro de ejemplo:

```text
.env.example
```

Con variables vacias o de referencia:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Nunca subir la clave `service_role` de Supabase.

Antes de usar la aplicacion con datos reales de pacientes, fotos reales o pagos reales, se debe cerrar PROD-001 y revisar e integrar:

```text
Supabase Auth
Row Level Security
politicas de acceso
control de usuarios
separacion de ambientes
backup y restauracion
consentimiento informado
auditoria sensible
anulacion logica
```

---

## Proxima etapa

La proxima etapa recomendada es cerrar el saneamiento documental, seguridad operativa y QA antes de nuevas funcionalidades clinicas o migraciones grandes.

Pendientes sugeridos:

```text
1. Mantener CTRL-007 sincronizado con main.
2. Validar UI-016 con QA-005.
3. Registrar decisiones criticas post auditoria.
4. Cerrar hardening Auth, auditoria sensible, anulacion logica y ambientes.
5. Luego avanzar en trabajos, agenda, QA automatizado y refactor frontend.
```

Orden recomendado:

```text
Control documental actualizado
→ decisiones criticas
→ seguridad/Auth/RLS/auditoria
→ QA por rol y Storage
→ UI operativa por rol
→ funcionalidades clinicas nuevas
→ produccion solo despues de cerrar PROD-001
```
