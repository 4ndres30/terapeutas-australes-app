# Terapeutas Australes App

Software de gestion para **Terapeutas Australes**, desarrollado como una aplicacion web para organizar pacientes, consultas, evaluaciones, casos terapeuticos, elementos involucrados, revisiones radiestesicas/canalizadas, aspectos revisados y hallazgos relevantes.

El proyecto se esta construyendo paso a paso, tabla por tabla y modulo por modulo, usando **WebStorm** como IDE principal y **Supabase/PostgreSQL** como base de datos y backend.

---

## Estado actual del proyecto

El proyecto se encuentra en etapa de construccion de base de datos y estructura tecnica. La estrategia actual es completar primero la base de datos, documentarla y validarla localmente antes de avanzar con formularios, pantallas y flujos visuales de la aplicacion.

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
| `revision_aspectos` | Integrada | Aspectos revisados por cada elemento, con medicion radiestesica, presencia, tipo detectado, observaciones y canalizacion. |
| `revision_hallazgos` | Integrada | Hallazgos relevantes detectados durante la revision de un aspecto. |
| `trabajos` | Pendiente | Modulo futuro separado para registrar acciones realizadas, avances, intervenciones y resultados. |

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
- `trabajos` sera un modulo separado para registrar lo que se hizo, avances, intervenciones y resultados.

Frases guia del modelo:

```text
casos no guarda todo; casos conecta todo.
revisiones registra la sesion.
revision_elementos registra a quien o que se reviso.
revision_aspectos registra que se midio o reviso.
revision_hallazgos registra lo relevante encontrado.
trabajos registrara lo que se hizo.
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
informacion canalizada
observaciones libres
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

---

## Modulo futuro `trabajos`

El modulo `trabajos` queda pendiente como una linea separada de revisiones.

Criterio definido:

```text
revisiones registra lo observado, medido o detectado.
trabajos registrara lo realizado, intervenido, avanzado o cerrado.
```

El futuro modulo `trabajos` deberia conectarse al menos con:

```text
paciente_id
caso_id
revision_id opcional
elemento_caso_id opcional
revision_hallazgo_id opcional
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

Antes de usar la aplicacion con datos reales de pacientes, se debe revisar e integrar:

```text
Supabase Auth
Row Level Security
politicas de acceso
control de usuarios
```

---

## Proxima etapa

La proxima etapa tecnica recomendada es seguir completando la base de datos antes de construir nuevos formularios.

Pendientes sugeridos:

```text
1. Actualizar documento tecnico de avance.
2. Definir modulo trabajos.
3. Definir vistas SQL para ficha completa del paciente.
4. Definir posibles plantillas de aspectos de revision.
5. Luego construir formularios y pantallas.
```

Orden recomendado:

```text
Base de datos completa
→ documentacion tecnica actualizada
→ vistas y consultas utiles
→ formularios
→ pantallas detalle
→ navegacion completa
→ seguridad/Auth/RLS antes de produccion
```
