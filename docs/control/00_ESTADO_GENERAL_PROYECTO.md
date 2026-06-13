# Estado general del proyecto

Fecha de corte: `2026-06-13`  
Responsable del documento: Control de desarrollo  
Estado general documental: En control activo

## Resumen

El proyecto cuenta con una estructura documental de control en `docs/control/`. Esta estructura ordena responsabilidades, pendientes, decisiones, bitacora, auditorias y flujo de trabajo sin modificar codigo, migraciones ni base de datos.

Al corte actual ya quedaron integradas las auditorias iniciales de control, backend, flujo clinico y UI/UX. Tambien quedaron registrados BE-003 y las decisiones clinicas/operativas clave que permiten iniciar planificacion tecnica real sin romper el flujo definido.

El proyecto se mantiene alineado con el metodo acordado: primero documentar, auditar y decidir; luego implementar por tareas aprobadas.

## Aprobado / integrado

- Repositorio oficial de trabajo: `4ndres30/terapeutas-australes-app`.
- Rama estable de referencia: `main`.
- Sistema de chats del proyecto:
  - Control de desarrollo.
  - Revision de flujo clinico.
  - Integracion estructura / backend.
  - UI / UX / Pulido visual.
- Sistema de codigos, estados y prioridades definido en `README.md`.
- Carpeta de control documental: `docs/control/`.
- QA-001: auditoria inicial del proyecto integrada.
- BE-001: inventario backend/Supabase integrado.
- RFC-001: revision de flujo clinico integrada.
- DEC-006: revisiones y detalle de revisiones viven dentro de la ficha del caso.
- DEC-007 a DEC-012: decisiones clinicas/operativas derivadas de BE-001 y RFC-001 integradas.
- BE-002: alineacion backend con flujo clinico aprobado integrada.
- UI-001 + UI-002: auditoria visual y revision de formularios del flujo clinico integradas.
- BE-003: criterios para futuras migraciones integrada.

## En revision / planificacion

- Siguiente bloque recomendado: BE-010 coordinado con UI-011 para soporte operativo de hallazgos dentro del detalle de revision.
- BE-010: siguiente prioridad tecnica recomendada para hallazgos derivados de aspectos.
- UI-010, UI-011, UI-012 y UI-015: prioridades de planificacion UI derivadas de UI-001 + UI-002.
- UI-013, UI-014, UI-016, UI-017, UI-018 y UI-019: pendientes UI derivados, aun sin activacion tecnica.
- BE-011 a BE-017: tareas backend sugeridas por BE-002 para trabajos, agenda, cobros, vistas, RLS y reportes.
- RFC-002: deteccion de duplicidades entre entidades clinicas.

## Pendiente operativo

- Planificar BE-010 coordinado con UI-011 como siguiente bloque operativo recomendado.
- Mantener BE-010, UI-010, UI-011, UI-012 y UI-015 como prioridades de planificacion.
- Sincronizar periodicamente `01_PENDIENTES_PROYECTO.md` cuando una tarea cambie de estado.
- Mantener `06_BITACORA_CAMBIOS.md` actualizado despues de cada bloque documental o tecnico relevante.
- Validar runtime local de RLS por roles antes de avanzar a reportes mixtos o vistas sensibles.

## No debe tocarse sin instruccion expresa

- `.env`.
- Supabase remoto.
- Migraciones existentes.
- Codigo fuente de la aplicacion.
- Base de datos local o remota.
- Rama `main` sin PR aprobado por Javier.

## Lectura inicial recomendada

1. `README.md`.
2. `00_ESTADO_GENERAL_PROYECTO.md`.
3. `01_PENDIENTES_PROYECTO.md`.
4. Documento del chat responsable segun la tarea.
5. `05_DECISIONES_PROYECTO.md`.
6. `06_BITACORA_CAMBIOS.md`.

## CTRL-001 - Mantener centro de mando documental

**Estado:** En proceso  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Javier  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/control-proyecto`  
**Dependencias:** Ninguna  

### Descripcion
Mantener actualizado el estado general, los pendientes, las decisiones y la bitacora del proyecto para evitar duplicidades y perdida de contexto.

### Archivos relacionados
- `docs/control/README.md`
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/05_DECISIONES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Los documentos existen y son faciles de leer.
- Las tareas usan codigos, estados y prioridades permitidas.
- Las restricciones criticas estan visibles.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main` sin aprobacion.

### Resultado
Centro documental creado y en mantenimiento activo.

### Observaciones
Esta tarea es continua durante el desarrollo del proyecto.

## CTRL-002 - Sincronizar documentacion maestra tras BE-002

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-12  
**Rama sugerida:** `docs/control-sync-be002`  
**Dependencias:** QA-001, BE-001, RFC-001, DEC-007, DEC-008, DEC-009, DEC-010, DEC-011, DEC-012, BE-002  

### Descripcion
Actualizar estado general, pendientes y bitacora para reflejar que QA-001, BE-001, RFC-001, DEC-007 a DEC-012 y BE-002 ya fueron integradas.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Reflejar tareas integradas y pendientes reales.
- Mantener trazabilidad hacia informes y decisiones.
- No modificar codigo fuente.
- No modificar migraciones.
- No tocar `.env`.
- No hacer `supabase db push`.
- No tocar Supabase remoto.

### Resultado
Sincronizacion documental preparada para integracion mediante PR.

### Observaciones
Despues de esta sincronizacion, el siguiente bloque debe priorizar implementacion backend BE-010 en adelante o auditoria UI/UX segun definicion de Javier.

## CTRL-003 - Sincronizar documentacion maestra tras UI-001/UI-002 y BE-003

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-13  
**Rama sugerida:** `docs/ctrl-003-sincronizacion-final`  
**Dependencias:** UI-001, UI-002, BE-003  

### Descripcion
Actualizar estado general, pendientes y bitacora para reflejar que UI-001, UI-002 y BE-003 ya fueron integradas.

### Archivos relacionados
- `docs/control/00_ESTADO_GENERAL_PROYECTO.md`
- `docs/control/01_PENDIENTES_PROYECTO.md`
- `docs/control/06_BITACORA_CAMBIOS.md`

### Criterios de aceptacion
- Reflejar UI-001, UI-002 y BE-003 como integradas.
- Registrar UI-010 a UI-019 como pendientes derivados.
- Mantener BE-010 como siguiente prioridad tecnica recomendada.
- Mantener BE-018 a BE-021 solo como sugeridas/no activas.
- No modificar codigo fuente.
- No modificar migraciones.
- No tocar `.env`.
- No ejecutar Supabase.
- No ejecutar `supabase db push`.
- No tocar Supabase remoto.
- No modificar datos reales.
- No hacer merge a `main`.

### Resultado
Sincronizacion documental preparada para integracion mediante PR.

### Observaciones
El siguiente bloque recomendado queda como BE-010 coordinado con UI-011, manteniendo BE-010, UI-010, UI-011, UI-012 y UI-015 como prioridades de planificacion.

## QA-001 - Auditoria inicial del proyecto

**Estado:** Integrada  
**Prioridad:** Alta  
**Responsable:** Control de desarrollo  
**Origen:** Control de desarrollo  
**Fecha creacion:** 2026-06-11  
**Rama sugerida:** `docs/auditoria-control-proyecto`  
**Dependencias:** CTRL-001  

### Descripcion
Auditar el estado tecnico inicial del proyecto sin modificar codigo, migraciones, base de datos ni configuracion sensible.

### Archivos relacionados
- `docs/control/`
- `src/`
- `supabase/`
- `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`

### Criterios de aceptacion
- Identificar pantallas, rutas y modulos relevantes.
- Identificar servicios, tipos y hooks relevantes.
- No modificar archivos de codigo.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main` sin aprobacion.

### Resultado
Integrada. Resultado registrado en `docs/control/auditorias/QA-001_AUDITORIA_INICIAL.md`.

### Observaciones
QA-001 queda reservada como auditoria inicial, no como implementacion ni tarea pendiente reutilizable.
