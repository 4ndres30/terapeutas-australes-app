# QA-002 — Validación funcional de hallazgos operativos con caso demo

## Estado

Aprobado.

## Fecha

2026-06-17.

## Rama revisada

`main`.

## Ambiente revisado

WebStorm + Supabase local.

## Datos usados

`DATA-001 - Caso Demo Integral`.

## Resumen ejecutivo

Se validó correctamente el flujo funcional de hallazgos operativos dentro del detalle de revisión usando el caso demo DATA-001.

La validación confirma que el hallazgo operativo vive dentro de `DetalleRevisionesPanel`, nace desde un aspecto revisado, hereda correctamente el contexto clínico y no crea trabajos automáticamente.

El seed `supabase/dev-seeds/caso_demo_integral.sql` fue ejecutado correctamente en Supabase local. El caso demo se visualiza, los campos del módulo Casos se cargan correctamente, el hallazgo precargado se muestra, y también fue posible crear y guardar manualmente un hallazgo nuevo desde un aspecto sin hallazgo previo.

QA-002 queda aprobada funcionalmente en ambiente local y habilita avanzar a UI-012 para diseñar el flujo `Evaluar trabajo`.

## Flujo validado

```text
Paciente
-> Caso
-> Detalle de revisiones
-> Aspecto revisado
-> Crear hallazgo
-> Guardar hallazgo
-> Ver hallazgo
-> Persistencia tras recarga
-> Prevención de duplicado visual
```

El flujo respeta el criterio clínico acordado: el hallazgo pertenece al detalle de una revisión y nace desde un aspecto revisado. No se crea trabajo automáticamente.

## Pruebas realizadas

- Visualización de caso demo.
- Visualización de hallazgo precargado.
- Apertura de modal `Ver hallazgo`.
- Apertura de modal `Crear hallazgo desde aspecto revisado`.
- Herencia automática de revisión, elemento, área y aspecto.
- Creación manual de nuevo hallazgo.
- Persistencia del hallazgo tras guardar.
- Persistencia tras refrescar la página.
- Visualización del nuevo hallazgo en la tarjeta del aspecto.
- Visualización del nuevo hallazgo en `Hallazgos de esta revisión`.
- Bloqueo visual de duplicidad desde el mismo aspecto.
- Confirmación de que `Evaluar trabajo próximamente` sigue deshabilitado.

## Resultado por prueba

Todas las pruebas pasaron correctamente en ambiente local.

| Prueba | Resultado |
| --- | --- |
| Caso demo visible | Aprobado |
| Campos del módulo Casos cargan correctamente | Aprobado |
| Hallazgo precargado visible | Aprobado |
| Modal `Ver hallazgo` funcional | Aprobado |
| Modal `Crear hallazgo desde aspecto revisado` funcional | Aprobado |
| Herencia de revisión, elemento, área y aspecto | Aprobado |
| Creación manual de nuevo hallazgo | Aprobado |
| Guardado del nuevo hallazgo | Aprobado |
| Nuevo hallazgo visible en tarjeta del aspecto | Aprobado |
| Nuevo hallazgo visible en `Hallazgos de esta revisión` | Aprobado |
| Persistencia tras refrescar página | Aprobado |
| Prevención visual de duplicado desde el mismo aspecto | Aprobado |
| `Evaluar trabajo próximamente` deshabilitado | Aprobado |

## Observaciones clínicas

El flujo respeta que un hallazgo pertenece al detalle de una revisión y nace desde un aspecto revisado.

La creación del hallazgo mantiene el contexto clínico necesario: revisión, elemento, área y aspecto. El terapeuta no necesita ingresar identificadores técnicos ni reconstruir manualmente la relación clínica.

No se crea trabajo automáticamente, lo que mantiene la decisión clínica manual del terapeuta antes de abrir una intervención.

## Observaciones UI/UX

El flujo actual permite operar hallazgos de forma mínima y comprensible.

El hallazgo precargado se visualiza correctamente. El modal `Ver hallazgo` permite revisar la información registrada. El modal `Crear hallazgo desde aspecto revisado` abre correctamente y muestra el origen clínico del hallazgo.

Después de guardar un nuevo hallazgo, el aspecto pasa a mostrar `Hallazgo registrado`, el botón `Ver hallazgo` queda disponible y el hallazgo aparece en `Hallazgos de esta revisión`.

El siguiente paso recomendado es UI-012 para diseñar el flujo `Evaluar trabajo` antes de implementar conversión hallazgo -> trabajo.

## Observaciones técnicas visibles

La persistencia local del hallazgo fue validada.

No se detectaron errores visibles durante la creación, guardado, recarga ni visualización del hallazgo.

No se crearon migraciones para QA-002. No se tocó Supabase remoto. No se modificaron datos reales sensibles.

## Riesgos detectados

- Aún falta diseñar el flujo `Evaluar trabajo`.
- Aún no existe implementación funcional hallazgo -> trabajo.
- Debe mantenerse bloqueado cualquier automatismo de creación de trabajo, cobro, sesión o acción.
- La futura implementación IMP-002 debe validar si ya existe trabajo asociado al hallazgo antes de crear uno nuevo.

## Ajustes recomendados

- Avanzar a UI-012 antes de implementar hallazgo -> trabajo.
- Mantener `Evaluar trabajo próximamente` deshabilitado hasta contar con diseño y validación.
- Preparar posteriormente IMP-002 para implementación funcional controlada.
- Mantener la regla clínica de que no todo hallazgo requiere trabajo.
- Mantener bloqueado cualquier automatismo que cree trabajos, cobros, sesiones o acciones sin decisión explícita del terapeuta.

## Qué queda fuera de alcance

- No se validó creación de trabajo desde hallazgo.
- No se validó creación de cobros desde trabajo.
- No se validó creación de sesiones ni acciones.
- No se validó Supabase remoto.
- No se modificaron datos reales.
- No se modificó código fuente.
- No se modificaron migraciones.
- No se tocó `.env`.
- No se ejecutó `supabase db push`.

## Recomendación final

Cerrar QA-002 como aprobada y avanzar a UI-012.

UI-012 debe diseñar el flujo visual `Evaluar trabajo` antes de activar cualquier implementación funcional hallazgo -> trabajo.

## Checklist

- [x] Caso demo visible.
- [x] Campos del módulo Casos cargan correctamente.
- [x] Hallazgo precargado visible.
- [x] Modal `Ver hallazgo` funcional.
- [x] Modal `Crear hallazgo` funcional.
- [x] Herencia de contexto correcta.
- [x] Nuevo hallazgo guardado correctamente.
- [x] Nuevo hallazgo persistente tras recarga.
- [x] Nuevo hallazgo visible en la revisión.
- [x] Aspecto muestra `Hallazgo registrado`.
- [x] Botón `Ver hallazgo` disponible tras guardar.
- [x] Hallazgo aparece en `Hallazgos de esta revisión`.
- [x] Duplicado visual prevenido.
- [x] `Evaluar trabajo próximamente` sigue deshabilitado.
- [x] Sin cambios de código.
- [x] Sin migraciones.
- [x] Sin `.env`.
- [x] Sin Supabase remoto.
- [x] Sin datos reales.

## Conclusión

QA-002 queda aprobada funcionalmente en ambiente local.

El flujo de hallazgos operativos está listo para pasar a diseño UI-012 del flujo `Evaluar trabajo`.

La implementación actual permite registrar hallazgos operativos mínimos dentro del detalle de revisión, validar persistencia local, prevenir duplicidad visual desde el mismo aspecto y mantener deshabilitada la conversión hallazgo -> trabajo hasta que exista diseño y validación posterior.
