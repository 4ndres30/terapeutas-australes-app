# Terapeutas Australes App

Software de gestion para **Terapeutas Australes**, desarrollado como una aplicacion web para organizar pacientes, consultas, evaluaciones, casos terapeuticos, revisiones y detalles del trabajo realizado.

El proyecto se esta construyendo paso a paso, tabla por tabla y modulo por modulo, usando **WebStorm** como IDE principal y **Supabase/PostgreSQL** como base de datos y backend.

---

## Estado actual del proyecto

El proyecto se encuentra en etapa inicial de desarrollo de base de datos y estructura tecnica.

Tablas trabajadas hasta ahora:

| Tabla | Estado | Descripcion |
|---|---|---|
| `pacientes` | Integrada | Registro principal de pacientes. |
| `consultas` | Integrada | Registro de consultas, sesiones o atenciones asociadas a pacientes. |
| `evaluaciones` | Pendiente | Evaluacion inicial o diagnostica del paciente. |
| `casos` | Pendiente | Procesos terapeuticos abiertos para un paciente. |
| `elementos_caso` | Pendiente | Personas, vinculos, espacios, cuerpos o elementos revisados dentro de un caso. |
| `revisiones` | Pendiente | Revisions o sesiones de trabajo sobre un caso. |
| `detalle_revisiones` | Pendiente | Hallazgos, estados, intervenciones y resultados especificos de cada revision. |

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

## Modelo relacional previsto

La base de datos seguira esta logica:

```text
pacientes
 ├── consultas
 ├── evaluaciones
 └── casos
      ├── elementos_caso
      └── revisiones
           └── detalle_revisiones
```

Regla principal del modelo:

- `pacientes` identifica a la persona.
- `consultas` registra atenciones o contactos.
- `evaluaciones` registra diagnosticos o evaluaciones iniciales.
- `casos` agrupa procesos terapeuticos completos.
- `elementos_caso` define que se esta revisando dentro del caso.
- `revisiones` registra cada sesion o revision del caso.
- `detalle_revisiones` guarda el detalle profundo de hallazgos, estados e intervenciones.

---

## Tabla `pacientes`

La tabla `pacientes` contiene los datos principales requeridos para identificar y contactar a una persona.

Estado actual:

- Se elimino el uso de RUT.
- Se integro `fecha_nacimiento` como campo requerido.
- Se eliminaron columnas no necesarias para el registro base del paciente.
- Se definieron campos requeridos para mantener registros completos.

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

## Flujo de trabajo con Git

El proyecto se trabajara usando ramas para mantener protegida la version base.

Flujo recomendado:

```text
main
└── rama-de-trabajo
```

Ejemplo:

```bash
git checkout -b docs/ajuste-readme
```

Cuando los cambios esten listos:

```bash
git add .
git commit -m "Actualiza documentacion inicial del proyecto"
git push origin docs/ajuste-readme
```

Luego se revisa el cambio mediante Pull Request antes de integrarlo a `main`.

---

## Flujo para nuevas tablas

Cada nueva tabla se trabajara con el siguiente orden:

1. Propuesta conceptual de la tabla.
2. Revision y validacion de campos.
3. Creacion del SQL.
4. Ejecucion en Supabase/PostgreSQL.
5. Guardado como migracion en `supabase/migrations`.
6. Commit y push a GitHub.
7. Revision antes de fusionar a `main`.

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

---

## Proxima etapa

La proxima tabla a trabajar sera:

```text
evaluaciones
```

Antes de integrarla al proyecto, se debe validar su estructura y confirmar que no duplique informacion que pertenezca a `consultas`, `casos`, `revisiones` o `detalle_revisiones`.
