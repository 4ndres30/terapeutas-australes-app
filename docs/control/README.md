# Control del proyecto

Proyecto: **Terapeutas Australes App**  
Repositorio oficial: `4ndres30/terapeutas-australes-app`  
Rama documental: `docs/control-proyecto`  
Fecha de inicio del control: `2026-06-11`

Este directorio es el sistema liviano de control del proyecto. Su objetivo es que Javier, ChatGPT y Codex puedan ubicarse rapido antes de tocar codigo, base de datos, interfaz o flujo clinico.

## Reglas no negociables

- Usar solo el repositorio oficial: `4ndres30/terapeutas-australes-app`.
- No usar el repositorio antiguo: `JaRviS3892/terapeutas-australes-app`.
- No tocar `.env`.
- No ejecutar `supabase db push`.
- No tocar Supabase remoto.
- No fusionar ni hacer merge a `main` sin instruccion expresa.
- No modificar codigo fuente desde este sistema documental.
- No modificar migraciones desde esta rama documental.
- No ejecutar cambios de base de datos desde esta rama documental.
- No abrir PR hasta que Javier lo indique.

## Documentos

| Archivo | Uso principal |
| --- | --- |
| `00_ESTADO_GENERAL_PROYECTO.md` | Foto rapida del estado aprobado, pendiente y bloqueado. |
| `01_PENDIENTES_PROYECTO.md` | Lista maestra de pendientes y tareas por chat. |
| `02_REVISION_FLUJO_CLINICO.md` | Control de revision clinica y funcional del flujo terapeutico. |
| `03_INTEGRACION_BACKEND_ESTRUCTURA.md` | Control de tareas tecnicas de Supabase, backend, tipos, servicios y hooks. |
| `04_UI_UX_PULIDO_VISUAL.md` | Control de tareas visuales, formularios, responsive y experiencia de usuario. |
| `05_DECISIONES_PROYECTO.md` | Registro de decisiones ya tomadas y su razon. |
| `06_BITACORA_CAMBIOS.md` | Historial breve de cambios de control del proyecto. |

## Chats del proyecto

| Chat | Rol | Puede hacer | No debe hacer |
| --- | --- | --- | --- |
| Control de desarrollo | Centro de mando. | Ordenar prioridades, documentos, decisiones, pendientes y bitacora. | Ejecutar codigo salvo instruccion expresa. |
| Revision de flujo clinico | Validacion clinica y funcional. | Revisar pacientes, consultas, evaluaciones, casos, revisiones y detalle de revision. | Modificar codigo o base de datos. |
| Integracion estructura / backend | Ejecucion tecnica aprobada. | Trabajar Supabase local, migraciones aprobadas, vistas SQL, servicios, tipos, hooks y logica funcional. | Decidir cambios clinicos o visuales mayores por cuenta propia. |
| UI / UX / Pulido visual | Experiencia y pulido visual. | Trabajar diseno, formularios, responsive, usabilidad y estetica premium. | Modificar base de datos o logica critica sin tarea aprobada. |

## Codigos

- `CTRL-001`: control de desarrollo.
- `PEND-001`: pendientes generales.
- `RFC-001`: revision de flujo clinico.
- `BE-001`: backend / estructura.
- `UI-001`: UI / UX.
- `DEC-001`: decisiones.
- `QA-001`: validaciones / auditorias.
- `LOG-001`: bitacora.

## Estados permitidos

- Pendiente.
- En analisis.
- En proceso.
- Bloqueada.
- Integrada.
- Validada.
- Descartada.
- Reabierta.

## Prioridades permitidas

- Crítica.
- Alta.
- Media.
- Baja.
- Posterior.

## Formato base de tarea

```md
## BE-001 - Titulo breve de la tarea

**Estado:** Pendiente  
**Prioridad:** Alta  
**Responsable:** Integracion Backend/Estructura  
**Origen:** Control de desarrollo  
**Fecha creacion:** AAAA-MM-DD  
**Rama sugerida:** feature/nombre-rama  
**Dependencias:** Ninguna  

### Descripcion
Explicar la tarea en lenguaje claro.

### Archivos relacionados
- `ruta/archivo.tsx`
- `supabase/migrations/`

### Criterios de aceptacion
- Criterio 1.
- Criterio 2.
- No tocar `.env`.
- No hacer `supabase db push`.
- No fusionar a `main`.

### Resultado
Pendiente.

### Observaciones
Pendiente.
```

## Flujo recomendado

1. Control de desarrollo registra o actualiza la tarea.
2. Javier confirma prioridad y alcance si hay dudas.
3. El chat responsable analiza su parte sin invadir otros dominios.
4. Si hay decisiones, se registran en `05_DECISIONES_PROYECTO.md`.
5. Si hay cambios ejecutados, se registran en `06_BITACORA_CAMBIOS.md`.
6. Una tarea solo pasa a `Validada` cuando Javier o el criterio definido la valida.

## Criterio de mantenimiento

- Mantener este control corto y accionable.
- No duplicar discusiones largas de chat.
- Registrar solo decisiones estables, pendientes accionables y resultados verificables.
- Si una tarea cambia de alcance, marcarla como `Reabierta` o crear una nueva.
