# RFC-001 — Revisión de flujo clínico

## Estado

Aprobado con observaciones.

## Fecha

2026-06-12.

## Rama auditada

`main`.

## Fuente del informe

Este documento consolida el informe RFC-001 entregado por Revision de flujo clinico. La revision fue ejecutada en modo clinico/funcional, sin modificar codigo, migraciones, configuracion ni Supabase.

## Objetivo

Validar si el flujo clinico/terapeutico actual del sistema esta correctamente representado y si las entidades cumplen una responsabilidad clara, sin duplicidades ni campos mal ubicados.

Flujo esperado de referencia:

```text
Paciente
-> Consulta
-> Evaluacion
-> Caso
-> Elementos del caso
-> Revisiones
-> Detalle de revision
-> Hallazgos
-> Trabajos / Intervenciones
-> Cobros / Pagos
-> Seguimiento / Agenda
```

## Restricciones respetadas

- No se modifico codigo fuente.
- No se modificaron migraciones.
- No se toco `.env`.
- No se ejecuto Supabase.
- No se ejecuto `supabase db push`.
- No se toco Supabase remoto.
- No se hizo merge a `main`.
- No se abrio PR listo para merge durante la revision.
- La revision se limito a analisis clinico/funcional e informe.

## Resumen ejecutivo

El modelo clinico general es correcto y queda aprobado con observaciones.

El sistema debe girar alrededor de:

```text
Paciente -> Caso -> Revision -> Detalle -> Hallazgo -> Trabajo
```

`pacientes`, `consultas`, `evaluaciones`, `casos`, `elementos_caso`, `revisiones` y `revision_aspectos` tienen responsabilidades clinicas razonablemente claras.

La mayor zona pendiente es `revision_hallazgos`: existe en backend, pero requiere decision clinica final sobre su uso operativo.

`trabajos`, `trabajo_elementos`, `trabajo_sesiones` y `trabajo_acciones` estan bien separados conceptualmente, pero requieren definir cuando un hallazgo se transforma en intervencion.

Agenda no debe avanzar como modulo operativo hasta definir si representa citas, consultas, sesiones de trabajo, seguimientos, recordatorios o eventos mixtos.

Cobros/pagos pueden asociarse a varias entidades, pero se necesita una regla operativa para evitar cobros duplicados o mal atribuidos.

## Flujo clínico validado

Flujo recomendado:

```text
Paciente
-> Consulta
-> Evaluacion
-> Caso
-> Elementos del caso
-> Revision
-> Detalle de revision / Aspectos revisados
-> Hallazgos
-> Trabajos / Intervenciones
-> Sesiones de trabajo
-> Acciones de trabajo
-> Cobros / Pagos
-> Seguimiento / Agenda
```

El caso funciona como contenedor central. La revision vive dentro del caso. El detalle de revision depende de una revision y de elementos reales del caso.

## Rutas alternativas permitidas

### Paciente -> Caso

Debe permitirse abrir un caso directamente desde paciente cuando no exista consulta/evaluacion previa, pero el sistema debe marcar ese origen como caso abierto sin evaluacion formal previa.

### Caso -> Revision

Una revision puede nacer directamente desde el caso si el terapeuta decide revisar sin evaluacion previa registrada.

### Hallazgo -> Trabajo

No todo hallazgo debe convertirse en trabajo. Solo deben convertirse aquellos que requieran intervencion, seguimiento o cierre operativo.

### Trabajo -> Revision posterior

Un trabajo puede requerir revision previa y revision posterior para validar resultado.

## Entidades revisadas

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
- `agenda`

## Responsabilidad por entidad

### `pacientes`

Registro maestro de identidad y contacto.

Debe contener solo datos estables del paciente: nombres, apellidos, fecha de nacimiento, sexo, telefono, email, comuna, region y estado.

No debe repetir motivos de consulta, antecedentes clinicos, hallazgos ni resultados.

### `consultas`

Registra una atencion, contacto, cita o sesion de entrada.

Pertenece aqui: fecha, horario, tipo de consulta, modalidad, estado, motivo, resumen y observaciones internas.

No debe absorber evaluacion profunda, hallazgos energeticos ni acciones de trabajo.

### `evaluaciones`

Levanta antecedentes y ayuda a decidir si corresponde revision o apertura de caso.

Pertenece aqui: relato, sintomas reportados, hechos clave, personas mencionadas, decision de revision, fundamento y estado.

No debe registrar trabajos realizados ni hallazgos detallados.

### `casos`

Contenedor operativo del proceso terapeutico.

Casos conecta paciente, consulta, evaluacion, elementos, revisiones, trabajos y finanzas.

Debe contener sintesis: nombre del caso, motivo de apertura, descripcion general, objetivo general, tipo, prioridad, estado, seguimiento y cierre.

No debe guardar todo el detalle de revision ni todo el trabajo realizado.

Principio clinico:

```text
Casos no guarda todo.
Casos conecta todo.
```

### `elementos_caso`

Define a quien o que se revisa/interviene dentro de un caso.

Ejemplos: consultante, hijo, pareja, expareja, casa, negocio, lugar, objeto, mascota, organizacion u otro.

No debe guardar mediciones especificas ni resultados de trabajo.

### `revisiones`

Cabecera de una sesion de revision.

Pertenece aqui: fecha, horas, numero de revision, tipo, modalidad, metodo, alcance, objetivo, resumen general, resultado general, seguimiento, proxima accion y estado.

No debe contener cada aspecto medido. Eso corresponde a `revision_aspectos`.

### `revision_elementos`

Tabla puente entre una revision y un elemento del caso.

Define que elementos fueron incluidos en una revision especifica. Es una union controlada que evita repetir un mismo elemento dentro de la misma revision.

### `revision_aspectos`

Detalle operativo de lo que se reviso.

Aqui deben vivir area, aspecto revisado, metodo, tipo de medicion, metrica, porcentaje, presencia detectada, tipo detectado, resultado del aspecto, pendiente, observacion e informacion canalizada.

Es el lugar correcto para registrar:

```text
Se reviso X y dio Y.
```

### `revision_hallazgos`

Registra un hallazgo clinicamente relevante derivado principalmente de un aspecto revisado.

Ruta preferente:

```text
revision_aspectos -> revision_hallazgos
```

Tambien puede mantener trazabilidad hacia revision, elemento y caso, pero su origen clinico principal debe ser el aspecto revisado.

No debe nacer directamente desde trabajo, porque el trabajo responde al hallazgo; no lo origina.

Tampoco debe ser una simple duplicacion de todos los aspectos revisados. Solo debe crearse cuando algo requiere destacarse, priorizarse, seguirse, derivarse o transformarse en trabajo.

### `trabajos`

Registra una intervencion o proceso activo de trabajo.

Un trabajo puede nacer desde:

```text
caso
caso + revision
caso + hallazgo
caso + elemento
decision clinica posterior
```

Ruta recomendada:

```text
hallazgo relevante -> decision clinica -> trabajo
```

### `trabajo_elementos`

Indica que elementos del caso seran trabajados dentro de un trabajo/intervencion.

No debe reemplazar `elementos_caso`; solo vincula elementos existentes al trabajo.

### `trabajo_sesiones`

Registra sesiones ejecutadas dentro de un trabajo.

Debe contener fecha, horario, fase, objetivo, estado previo, acciones generales, estado posterior, resultado y continuidad.

### `trabajo_acciones`

Registra acciones concretas realizadas dentro de una sesion de trabajo.

Ejemplos: retiro, limpieza, sello, integracion, recuperacion, liberacion, ajuste o cierre.

### `cobros`

Registra una obligacion de pago asociada a una prestacion o unidad cobrable.

Puede asociarse a consulta, evaluacion, caso, revision o trabajo, pero debe existir una regla para evitar que una misma prestacion se cobre dos veces desde niveles distintos.

### `pagos`

Registra dinero recibido y lo aplica a un cobro.

No deberia asociarse directamente a caso/revision/trabajo sin pasar por cobro, porque el cobro es la unidad financiera que calcula saldo.

### `agenda`

Debe ser un modulo mixto de eventos programados, con tipo de evento obligatorio.

Debe poder representar:

```text
consulta programada
evaluacion programada
revision programada
sesion de trabajo
seguimiento
recordatorio interno
```

No debe inventar estructura definitiva hasta que Control registre decision y Backend proponga estructura.

## Hallazgos clínicos críticos

Sin hallazgos clinicos criticos.

No hay bloqueo conceptual grave en el flujo principal. La base esta correctamente orientada a caso, revision, aspecto, hallazgo y trabajo.

## Hallazgos clínicos medios

1. `revision_hallazgos` existe, pero falta decision clinica de uso.
2. Falta regla para convertir hallazgo en trabajo.
3. Trabajos esta bien modelado, pero falta flujo clinico operativo.
4. Agenda aun no tiene definicion clinica final.
5. Cobros/pagos admiten multiples asociaciones, pero falta regla operativa.
6. La taxonomia de revision necesita normalizacion clinica.

## Hallazgos clínicos menores

1. `requiere_seguimiento` aparece en varias entidades. No es incorrecto, pero debe entenderse como seguimiento local de cada nivel.
2. `resultado_general` aparece en revision, trabajo y caso. Es valido si se entiende como resultado por nivel.
3. `objetivo_trabajo` en caso puede confundirse con `objetivo_trabajo` en trabajo.
4. `informacion_canalizada`, `observaciones` y `notas_internas` aparecen en varias entidades; requieren guia de uso.

## Duplicidades detectadas

No se detectan duplicidades bloqueantes, pero si duplicidades potenciales por falta de regla:

| Dato | Entidades donde aparece | Evaluacion clinica |
| --- | --- | --- |
| Seguimiento | casos, revisiones, aspectos, hallazgos, trabajos, sesiones, acciones | Valido si cada nivel tiene seguimiento propio. |
| Resultado | revision, aspecto, hallazgo, trabajo, sesion, accion, cierre de caso | Valido si se define granularidad. |
| Objetivo | caso, revision, trabajo, sesion, accion | Valido si se diferencia objetivo general, objetivo de revision, objetivo de intervencion y objetivo de sesion. |
| Observaciones / notas internas | multiples tablas | Valido, pero requiere guia de uso. |
| Presencia / bloqueo / trabajo | aspecto, hallazgo, trabajo | Riesgo medio si no se define cuando es medicion, hallazgo o intervencion. |

## Campos o responsabilidades que requieren decisión

1. `revision_hallazgos` como tabla derivada de aspecto.
2. `objetivo_trabajo` en `casos`, que deberia entenderse como objetivo terapeutico general del caso.
3. `foto_url` en `elementos_caso`, que puede ser util pero requiere decision de uso.
4. Agenda sin backend dedicado.
5. Criterio de cobro para evitar duplicidad entre consulta, evaluacion, revision, caso y trabajo.

## Recomendaciones clínicas

1. Mantener DEC-006 sin cambios: revisiones y detalle de revisiones deben vivir dentro de la ficha del caso.
2. Definir `revision_hallazgos` como hallazgo relevante derivado preferentemente de `revision_aspectos`.
3. Crear regla clinica:

```text
Aspecto revisado = todo lo medido u observado.
Hallazgo = aspecto relevante que requiere atencion, seguimiento, prioridad o posible intervencion.
Trabajo = intervencion decidida sobre uno o mas hallazgos, elementos o necesidades del caso.
Accion = acto concreto realizado dentro de una sesion de trabajo.
```

4. No crear pantalla principal global para `revision_hallazgos`.
5. Definir una taxonomia clinica base antes de nuevas UI.
6. No avanzar Agenda hasta decidir su rol.
7. Mantener flexibilidad de cobros/pagos, pero con regla de prioridad por unidad cobrable.

## Decisiones sugeridas para Control de Desarrollo

Estas decisiones son propuestas y no quedan validadas por este informe.

### Responsabilidad de `revision_hallazgos`

`revision_hallazgos` registra solo hallazgos relevantes derivados preferentemente de `revision_aspectos`.

### Hallazgos dentro del detalle de revisión

Los hallazgos no tendran modulo principal independiente de creacion. Se gestionan desde ficha del caso/detalle de revision.

### Criterio de conversion hallazgo -> trabajo

Un hallazgo se convierte en trabajo cuando requiere intervencion, seguimiento operativo, cierre terapeutico o acciones planificadas.

### Separacion trabajo / sesion / accion

`trabajos` define la intervencion.  
`trabajo_sesiones` registra jornadas o sesiones.  
`trabajo_acciones` registra actos concretos.

### Agenda como modulo mixto tipificado

Agenda debe manejar eventos con tipo obligatorio: consulta, evaluacion, revision, trabajo, seguimiento o recordatorio.

### Cobros por unidad cobrable

Cobros pueden asociarse a consulta, evaluacion, caso, revision o trabajo, pero cada cobro debe representar una unidad clara para evitar duplicidad financiera.

## Tareas RFC sugeridas

### RFC-005 — Definir taxonomía clínica de revisión

**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Dependencias:** RFC-001  

Objetivo: clasificar conceptos como area, aspecto, metrica, hallazgo, accion, estado o resultado.

### RFC-006 — Definir regla de hallazgo clínico relevante

**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Dependencias:** RFC-001  

Objetivo: determinar cuando un aspecto revisado debe convertirse en hallazgo.

### RFC-007 — Definir conversión de hallazgo a trabajo

**Prioridad:** Alta  
**Responsable:** Revision de flujo clinico  
**Dependencias:** RFC-006  

Objetivo: establecer criterios para abrir trabajo/intervencion desde hallazgo, revision, elemento o decision clinica.

### RFC-008 — Definir rol clínico de Agenda

**Prioridad:** Media-alta  
**Responsable:** Revision de flujo clinico  
**Dependencias:** RFC-001  

Objetivo: decidir si Agenda representa citas, consultas, revisiones, sesiones de trabajo, seguimientos, recordatorios o eventos mixtos.

### RFC-009 — Definir regla clínica-operativa de cobros

**Prioridad:** Media  
**Responsable:** Revision de flujo clinico / Control de desarrollo  
**Dependencias:** RFC-001  

Objetivo: determinar cuando cobrar por consulta, evaluacion, caso, revision, trabajo o paquete.

## Temas que deben volver a Integración Backend

1. Validar tecnicamente si `revision_hallazgos` debe requerir siempre `revision_aspecto_id` o permitir casos excepcionales.
2. Revisar si `trabajos.revision_hallazgo_origen_id` es suficiente para trazabilidad o si trabajos deben admitir multiples hallazgos origen mediante `trabajo_elementos`.
3. Revisar si Agenda requiere una nueva tabla o puede derivarse parcialmente de consultas/trabajos/seguimientos.
4. Revisar si cobros necesitan una regla SQL para impedir asociaciones contradictorias.
5. Validar si conviene crear vistas:
   - `vista_caso_clinico_completo`
   - `vista_revisiones_con_hallazgos`
   - `vista_trabajos_con_origen`
   - `vista_agenda_operativa`
6. Ejecutar BE-002 despues de registrar decisiones clinicas.

## Temas que deben pasar a UI / UX

1. Diseño de hallazgos dentro del detalle de revision sin sobrecargar el formulario.
2. Diferenciar visualmente aspecto revisado, hallazgo relevante, trabajo generado y seguimiento pendiente.
3. Crear experiencia para convertir hallazgo en trabajo sin duplicar datos.
4. Diseñar agenda por tipo de evento.
5. Diseñar finanzas operativas distinguiendo cobros, pagos, saldos y relaciones con caso/revision/trabajo.
6. Diseñar una vista resumen de caso con elementos, revisiones, hallazgos activos, trabajos abiertos, cobros/pagos y proximos seguimientos.

## Conclusión

El flujo clinico queda aprobado con observaciones.

La arquitectura base esta bien orientada: el caso funciona como contenedor central, revision vive dentro del caso y detalle depende de revision + elemento.

Antes de implementar nuevos formularios o pantallas, Control de Desarrollo deberia revisar y registrar decisiones sobre `revision_hallazgos`, conversion hallazgo -> trabajo, agenda y cobros/pagos.

Luego Integracion Backend puede ejecutar BE-002 con criterios clinicos claros.
