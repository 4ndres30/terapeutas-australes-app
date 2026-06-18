# UI-010 — Ampliacion resumen detalle de caso

## Estado

Activada para diseno UI/UX.

## Fecha

2026-06-18.

## Objetivo

Ampliar UI-010 para que el detalle de caso evolucione desde una lista vertical extensa hacia una vista resumen navegable, clara y operativa.

## Problema detectado

Al ingresar al detalle de un caso, el contenido se presenta principalmente como una lista vertical larga. Esto obliga al usuario a deslizar hacia abajo para revisar elementos, revisiones, detalle de revision, hallazgos, trabajos y pagos.

## Necesidad funcional

La pantalla principal del detalle del caso debe mostrar una vista acotada de las secciones principales del caso. Desde esa vista, el usuario debe poder abrir el detalle profundo de cada seccion.

## Propuesta a disenar

La propuesta UI/UX debe evaluar dos rutas:

1. Vista resumen general por secciones.
2. Vista organizada por elemento del caso.

## Resumen superior sugerido

- Paciente.
- Estado del caso.
- Motivo o foco principal.
- Ultima revision.
- Elementos del caso.
- Hallazgos relevantes.
- Trabajos abiertos.
- Estado de pagos o cobros si aplica.

## Secciones visibles sugeridas

- Elementos del caso.
- Revisiones.
- Detalle de revision.
- Hallazgos.
- Trabajos.
- Pagos.
- Seguimiento, si corresponde.

## Interaccion esperada

Cada seccion debe mostrarse como tarjeta, bloque o modulo resumido. Al presionar una seccion, debe abrirse el detalle profundo correspondiente. La pantalla principal no debe depender de una lista vertical extensa.

## Responsables

- Diseno principal: UI / UX / Pulido visual.
- Validacion clinica: Revision de flujo clinico.
- Implementacion posterior: Implementacion / Codex.
- Backend: solo si luego se requieren vistas agregadas, conteos o consultas optimizadas.

## Restricciones

- No se modifica codigo fuente.
- No se modifica CSS.
- No se modifican migraciones.
- No se toca `.env`.
- No se ejecuta Supabase.
- No se ejecuta `supabase db push`.
- No se toca Supabase remoto.
- No se modifican datos reales.

## Resultado esperado

UI-010 queda ampliada formalmente para disenar una vista resumen navegable del detalle de caso antes de implementar cambios visuales o funcionales.
