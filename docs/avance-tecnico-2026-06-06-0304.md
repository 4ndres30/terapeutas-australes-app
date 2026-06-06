# Avance tecnico del proyecto - 2026-06-06 03:04 hora chilena

Proyecto: **Terapeutas Australes App**  
Repositorio: `JaRviS3892/terapeutas-australes-app`  
Fecha de corte: **6 de junio de 2026, 03:04 hora chilena**  
Entorno principal de trabajo: **WebStorm + Supabase/PostgreSQL**

---

## 1. Objetivo general del proyecto

El proyecto corresponde al desarrollo de un software de gestion para **Terapeutas Australes**, orientado a ordenar el flujo de trabajo con pacientes, consultas, evaluaciones, casos, elementos del caso, revisiones y detalle de revisiones.

El sistema se esta construyendo de forma progresiva, tabla por tabla, cuidando que cada tabla tenga una responsabilidad clara y que no exista duplicacion innecesaria de informacion.

La idea central del modelo es:

```text
Paciente
 ├── Consultas
 ├── Evaluaciones
 └── Casos
      ├── Elementos del caso
      └── Revisiones
           └── Detalle de revisiones
```

Principio validado durante el desarrollo:

```text
Casos no guarda todo.
Casos conecta todo.
```

---

## 2. Stack tecnico utilizado

Hasta esta fecha, el proyecto utiliza:

- **IDE principal:** WebStorm.
- **Base de datos/backend:** Supabase/PostgreSQL.
- **Conexion local utilizada:** `postgres@127.0.0.1`.
- **Schema de trabajo:** `public`.
- **Frontend base:** React + TypeScript + Vite.
- **Cliente Supabase:** `@supabase/supabase-js`.
- **Formularios:** React Hook Form.
- **Validaciones frontend previstas:** Zod.
- **Tablas UI previstas:** TanStack React Table.
- **Rutas:** React Router.
- **Control de versiones:** Git + GitHub.

---

## 3. Reglas de trabajo establecidas

### 3.1 Rama oficial

La rama oficial y estable del proyecto es:

```text
main
```

`main` representa la version validada del sistema. No se debe trabajar directamente sobre `main` para cambios nuevos.

### 3.2 Ramas de trabajo

Cada avance importante se trabaja en una rama separada:

```text
docs/ajuste-readme
chore/preparacion-repositorio
feature/tabla-evaluaciones
feature/tabla-casos
```

Regla acordada:

```text
Una tarea = una rama
```

### 3.3 Flujo de integracion

El flujo de trabajo definido es:

1. Crear o usar una rama de trabajo.
2. Diseñar la tabla o cambio.
3. Validar conceptualmente con Javier.
4. Crear migracion SQL.
5. Ejecutar migracion en la base local.
6. Validar estructura, relaciones, checks e indices.
7. Confirmar que `git status` este limpio.
8. Fusionar a `main` solo cuando este validado.
9. Subir `main` a GitHub.

---

## 4. Configuracion y seguridad del repositorio

### 4.1 Repositorio GitHub

Repositorio configurado:

```text
JaRviS3892/terapeutas-australes-app
```

Se configuro correctamente el remoto:

```text
origin -> https://github.com/JaRviS3892/terapeutas-australes-app.git
```

### 4.2 Archivo `.gitignore`

Se verifico que el repositorio ignore archivos sensibles y carpetas generadas, entre ellas:

```text
node_modules
dist
dist-ssr
*.local
.idea
```

Esto protege especialmente archivos como:

```text
.env.local
```

### 4.3 Archivo `.env.example`

Se agrego un archivo seguro de ejemplo:

```text
.env.example
```

Contenido:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Este archivo permite documentar las variables necesarias sin exponer claves reales.

### 4.4 Claves que no deben subirse

No se deben subir al repositorio:

```text
.env
.env.local
service_role_key
contraseñas
claves privadas
credenciales reales de Supabase
```

---

## 5. Correccion de seguridad Git: dubious ownership

Durante el trabajo, Git mostro el error:

```text
fatal: detected dubious ownership in repository
```

Esto ocurrio porque Windows/Git detecto que la carpeta del proyecto pertenecia a `BUILTIN/Administradores`, mientras WebStorm se estaba ejecutando con el usuario normal.

Se soluciono autorizando la carpeta como segura:

```bash
git config --global --add safe.directory E:/Proyectos/terapeutas-australes-app
```

Despues de eso, `git status` volvio a funcionar correctamente.

---

## 6. Comprobacion de sincronizacion local/remota

Se establecio una forma clara para verificar si el repositorio local y remoto estan iguales.

Comandos usados:

```bash
git fetch origin
git status
git rev-list --left-right --count HEAD...origin/main
```

Resultado validado:

```text
0 0
```

Significado:

```text
Primer 0: no hay commits locales pendientes por subir.
Segundo 0: no hay commits remotos pendientes por bajar.
```

Con `working tree clean`, esto confirma sincronizacion completa.

---

## 7. Convencion de migraciones SQL

Todas las migraciones se guardan en:

```text
supabase/migrations/
```

Reglas acordadas:

1. Usar extension `.sql`.
2. Usar siempre schema explicito `public`.
3. Ejecutar las migraciones contra `postgres@127.0.0.1` y schema `public`.
4. Mantener el dialecto de WebStorm configurado como PostgreSQL.
5. Evitar ejecutar migraciones contra otros schemas como `extensions`.
6. Si WebStorm modifica el formato del archivo SQL y esa version es la version correcta reconocida como PostgreSQL, se puede conservar mediante commit.

Ejemplo de formato esperado:

```sql
create table if not exists public.nombre_tabla (
  id uuid primary key default gen_random_uuid(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 8. Tabla `pacientes`

### 8.1 Objetivo

La tabla `pacientes` identifica a la persona y contiene solo datos base de registro y contacto.

No debe contener informacion terapeutica profunda ni antecedentes extensos del proceso.

### 8.2 Cambios realizados

Se trabajo inicialmente la tabla `pacientes` y luego se normalizo su estructura.

Cambios aplicados:

- Se creo la tabla `pacientes`.
- Se elimino el uso de `rut`.
- Se eliminaron columnas que no correspondian al registro base.
- Se definieron campos obligatorios.
- Se agregaron validaciones `check` para `estado` y `sexo`.
- Se agrego trigger para actualizar `updated_at` automaticamente.

### 8.3 Migraciones relacionadas

Migraciones trabajadas:

```text
20260605175342_crear_tabla_pacientes.sql
20260605190001_normalizar_rut_pacientes.sql
20260605190939_eliminar_rut_de_pacientes.sql
20260605191154_limpiar_columnas_pacientes.sql
20260605191957_definir_campos_requeridos_pacientes.sql
20260605211000_agregar_trigger_updated_at_pacientes.sql
```

### 8.4 Estado actual

Estado actual validado:

```text
public.pacientes
columns: 12
keys: 1
indexes: 3
checks: 2
triggers: 1
```

---

## 9. Tabla `consultas`

### 9.1 Objetivo

La tabla `consultas` registra cada atencion, sesion, cita o contacto con un paciente.

No debe contener el detalle profundo del proceso energetico ni reemplazar a casos o revisiones.

### 9.2 Relacion principal

```text
pacientes.id -> consultas.paciente_id
```

### 9.3 Campos definidos

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

### 9.4 Validaciones definidas

`tipo_consulta`:

```text
Primera consulta
Seguimiento
Evaluacion inicial
Revision energetica
Canalizacion
Tarot
Limpieza energetica
Control posterior
Urgencia
Otro
```

`modalidad`:

```text
Presencial
Online
WhatsApp
Llamada telefonica
Videollamada
```

`estado_consulta`:

```text
Agendada
Realizada
Pendiente
Cancelada
Reagendada
No asistio
```

### 9.5 Migracion relacionada

```text
20260605203000_crear_tabla_consultas.sql
```

### 9.6 Estado actual

Estado visual validado en WebStorm:

```text
public.consultas
columns: 13
keys: 1
foreign keys: 1
indexes: 3
checks: 3
triggers: 1
```

---

## 10. Tabla `evaluaciones`

### 10.1 Correccion conceptual importante

La primera propuesta de `evaluaciones` fue descartada porque mezclaba evaluacion con diagnostico, motivo de consulta y decision terapeutica profunda.

La definicion final validada fue:

```text
evaluaciones = levantamiento de antecedentes
```

La tabla no diagnostica, no interviene y no guarda hallazgos profundos. Su funcion es capturar antecedentes relevantes entregados por el paciente para decidir posteriormente si corresponde revision.

### 10.2 Relacion principal

```text
pacientes.id -> evaluaciones.paciente_id
consultas.id_consulta -> evaluaciones.consulta_id
```

### 10.3 Campos definidos

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

### 10.4 Criterio de simplificacion

Se fusionaron campos que podian generar confusion:

- `testimonio_paciente`
- `situacion_actual`
- `antecedentes_relevantes`
- `eventos_importantes`
- `observaciones_paciente`

Estos conceptos se agruparon principalmente en:

```text
relato_antecedentes
hechos_clave
sintomas_reportados
personas_mencionadas
notas_internas
```

### 10.5 Validaciones definidas

`decision_revision`:

```text
Pendiente
Si requiere revision
No requiere revision
```

`estado_evaluacion`:

```text
Abierta
Completada
Anulada
```

### 10.6 Migracion relacionada

```text
20260605213000_crear_tabla_evaluaciones.sql
```

### 10.7 Estado actual

Estado visual validado en WebStorm:

```text
public.evaluaciones
columns: 15
keys: 1
foreign keys: 2
indexes: 4
checks: 2
triggers: 1
```

La tabla fue ejecutada localmente y luego integrada a `main`.

---

## 11. Tabla `casos`

### 11.1 Definicion conceptual validada

La tabla `casos` representa un proceso abierto para un paciente.

La regla validada fue:

```text
Casos no guarda todo.
Casos conecta todo.
```

Esto significa que `casos` no debe contener todos los hallazgos, revisiones, elementos o intervenciones. Su funcion es conectar el proceso completo con paciente, consulta, evaluacion y futuras tablas relacionadas.

### 11.2 Relacion principal

```text
pacientes.id -> casos.paciente_id
consultas.id_consulta -> casos.consulta_id
evaluaciones.id_evaluacion -> casos.evaluacion_id
```

`consulta_id` y `evaluacion_id` pueden ser opcionales, porque puede existir un caso abierto manualmente.

`paciente_id` es obligatorio, porque todo caso pertenece a un paciente.

### 11.3 Campos definidos

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

### 11.4 Opciones definidas

`tipo_caso`:

```text
Personal
Familiar
Vinculo
Linaje
Casa/Espacio
Bloqueo
Entidad/Presencia
Proteccion
Seguimiento
Otro
```

`prioridad`:

```text
Baja
Media
Alta
Urgente
```

`estado_caso`:

```text
Abierto
En proceso
Pausado
Cerrado
Anulado
```

### 11.5 Validacion adicional

Se agrego una restriccion para evitar que `fecha_cierre` sea anterior a `fecha_apertura`:

```text
fecha_cierre is null or fecha_cierre >= fecha_apertura
```

### 11.6 Migracion relacionada

```text
20260605215000_crear_tabla_casos.sql
```

### 11.7 Estado actual al corte

Al momento de este documento, la tabla `casos` fue creada en la rama:

```text
feature/tabla-casos
```

Tambien fue ejecutada en la base local, donde se valido visualmente:

```text
public.casos
columns: 20
keys: 1
foreign keys: 3
indexes: 6
checks: 4
triggers: 1
```

Pendiente recomendado antes de cerrar completamente esta etapa:

1. Confirmar si el archivo SQL modificado localmente por WebStorm se conservara como nueva version valida.
2. Hacer commit del formato final si corresponde.
3. Subir `feature/tabla-casos`.
4. Fusionar a `main` cuando este validado.

---

## 12. Estado general de tablas al corte

Estado de avance:

| Tabla | Estado tecnico | Estado funcional |
|---|---|---|
| `pacientes` | Creada e integrada | Lista como registro base |
| `consultas` | Creada e integrada | Lista como registro de atenciones |
| `evaluaciones` | Creada e integrada | Lista como levantamiento de antecedentes |
| `casos` | Creada en feature y ejecutada localmente | En validacion final antes de integrar |
| `elementos_caso` | Pendiente | Proxima tabla critica |
| `revisiones` | Pendiente | Pendiente |
| `detalle_revisiones` | Pendiente | Pendiente |

---

## 13. Modelo relacional proyectado despues de `casos`

El modelo proyectado queda asi:

```text
pacientes
 ├── consultas
 ├── evaluaciones
 └── casos
      ├── elementos_caso
      └── revisiones
           └── detalle_revisiones
                └── elemento_caso
```

Relaciones futuras necesarias:

```text
casos.id_caso -> elementos_caso.caso_id
casos.id_caso -> revisiones.caso_id
revisiones.id_revision -> detalle_revisiones.revision_id
elementos_caso.id_elemento_caso -> detalle_revisiones.elemento_caso_id
```

Esto permitira que al abrir un caso se pueda acceder a:

- Datos generales del caso.
- Paciente asociado.
- Consulta o evaluacion de origen.
- Todos los elementos del caso.
- Todas las revisiones realizadas.
- Todos los detalles asociados a cada revision.
- Estado e historial del proceso.

---

## 14. Proxima etapa recomendada

La siguiente tabla recomendada es:

```text
elementos_caso
```

Motivo:

Despues de crear `casos`, necesitamos definir que elementos componen ese caso. Por ejemplo:

```text
Paciente principal
Casa o espacio
Vinculo con otra persona
Linaje familiar
Campo energetico familiar
Objeto
Entidad/presencia
Cuerpo fisico
Cuerpo energetico
Cuerpo emocional
Cuerpo mental
```

Esta tabla sera clave para que las futuras `revisiones` y `detalle_revisiones` puedan apuntar a elementos especificos dentro de un caso.

---

## 15. Comandos utiles acordados

### Ver rama actual

```bash
git branch --show-current
```

### Ver estado del proyecto

```bash
git status
```

### Traer informacion desde GitHub

```bash
git fetch origin
```

### Comparar local contra remoto

```bash
git rev-list --left-right --count HEAD...origin/main
```

Resultado ideal:

```text
0 0
```

### Subir rama actual

```bash
git push
```

### Fusionar rama validada a `main`

```bash
git checkout main
git pull origin main
git merge nombre-de-la-rama
git push origin main
git status
```

---

## 16. Criterios de diseno validados

Criterios importantes definidos durante el desarrollo:

1. `pacientes` identifica a la persona.
2. `consultas` registra atenciones o contactos.
3. `evaluaciones` recaba antecedentes.
4. `casos` abre y conecta un proceso.
5. `elementos_caso` definira que se revisa dentro del caso.
6. `revisiones` registrara cada revision o sesion del caso.
7. `detalle_revisiones` guardara hallazgos, estados, intervenciones y resultados especificos.
8. No duplicar informacion entre tablas.
9. Mantener campos narrativos simples y no redundantes.
10. Usar relaciones claras con claves foraneas.
11. Mantener `created_at` y `updated_at` en todas las tablas principales.
12. Agregar triggers para actualizar `updated_at` automaticamente.
13. Trabajar siempre sobre ramas y no directamente sobre `main`.
14. Ejecutar y validar localmente antes de fusionar a la version oficial.

---

## 17. Pendientes inmediatos

Pendientes recomendados al cierre de este corte:

1. Cerrar la validacion de `feature/tabla-casos`.
2. Conservar o descartar el formato local modificado del SQL de casos.
3. Subir la rama `feature/tabla-casos` si hay commit pendiente.
4. Fusionar `feature/tabla-casos` a `main` cuando este validada.
5. Crear nueva rama para `elementos_caso`.
6. Disenar `elementos_caso` cuidando que sea flexible y no redundante.
7. Documentar posteriormente `revisiones` y `detalle_revisiones` con el mismo nivel de claridad.

---

## 18. Estado resumido del proyecto al 2026-06-06 03:04

```text
Repositorio creado y conectado.
README actualizado.
.env.example agregado.
.gitignore revisado.
Git local/remoto sincronizado.
Pacientes creada y ajustada.
Consultas creada y relacionada con pacientes.
Evaluaciones creada como levantamiento de antecedentes.
Casos disenada como tabla conectora del proceso.
Base local contiene pacientes, consultas, evaluaciones y casos.
Siguiente etapa: elementos_caso.
```
