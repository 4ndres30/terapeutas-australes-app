# Roadmap: herramientas de IA (Gemini) para gestión clínica

Fecha: 2026-07-06
Base: evaluación de 10 candidatos (ver JSON de evaluación) bajo BE-020 y ausencia de backend propio.

Estado real verificado del proyecto: **no existe ninguna Edge Function hoy** (`supabase/functions` no existe). El único código Gemini es `scripts/test-gemini.js`, un script local de desarrollador con la API key en variable de entorno de shell — no productivo. BE-020 está en estado "diseño documental / pendiente de validación clínica y legal". Esto significa que **toda** la lista de candidatos depende de construir infraestructura que hoy no existe, y de cerrar una aprobación de gobernanza que hoy no está cerrada. El roadmap refleja eso: Fase 0 no es opcional ni paralela, es bloqueante para todo lo demás.

---

## Descartados (mención breve)

Cinco candidatos se descartan porque usan Gemini para tareas que un template determinista o una query SQL resuelven mejor, más barato y sin superficie de riesgo BE-020, o porque dependen de infraestructura de identidad financiera que no existe (BE-023):

- **Redactor de recordatorios/confirmaciones**: plantilla de texto trivial; no requiere LLM; expone nombre+cita a Google sin necesidad.
- **Detector de riesgo de mora (scoring cartera)**: es un `GROUP BY` con umbral; cero valor incremental de un LLM sobre cifras monetarias.
- **Detector de anomalías en condonaciones**: depende de BE-023 (identidad financiera desacoplada), que no existe; el alias actual es un hash reversible del UUID, no anonimización real.
- **Asistente de redacción de comunicaciones administrativas**: mismo problema que recordatorios, plantillas resuelven el 100% del caso.
- **Detector de inconsistencias en fichas administrativas**: es validación SQL + panel; Gemini solo "narra" una lista ya estructurada, valor marginal.

---

## Fase 0 — Infraestructura mínima obligatoria (bloqueante, antes de cualquier herramienta)

Nada de lo que sigue puede construirse antes de cerrar esto. No es una fase paralela, es prerrequisito literal.

1. **Cierre de aprobación BE-020 para uso de Gemini con datos derivados de casos reales.**
   Hoy BE-020 es diseño documental sin validar. Se necesita una decisión explícita de Control que autorice, como ampliación acotada y documentada, el envío de **agregados administrativos no clínicos** a Gemini — no una interpretación implícita de que "si no hay nombre, ya está permitido". Cada herramienta de Fase 1+ debe listarse explícitamente en esa aprobación.

2. **Primera Edge Function del proyecto (Supabase, Deno) como plantilla reutilizable.**
   Incluye: manejo de `GEMINI_API_KEY` vía Supabase Secrets (nunca en el bundle ni en `.env` de frontend), estructura de invocación a Gemini, manejo de errores/timeouts/rate limit, logging que no filtre payloads. Se construye una sola vez y las herramientas siguientes la reutilizan.

3. **Mecanismo de ejecución programada** (pg_cron o Supabase Scheduled Functions) — hoy no confirmado como habilitado. Varias herramientas de Fase 1 lo requieren.

4. **Capa de anonimización real, no declarada.** Definir como estándar de proyecto, no por herramienta:
   - Alias de paciente = mapping aleatorio generado y almacenado server-side en tabla interna de acceso restringido (service role), **nunca** un hash determinístico del UUID (el caso de `codigo_paciente` en finanzas ya demuestra ese error).
   - Umbral mínimo de agregación (k-anonimato): no enviar a Gemini ninguna celda/bucket con n bajo (ej. menos de 3-5 casos), porque en una clínica pequeña un agregado con n=1 es un registro individual disfrazado.
   - Allowlist explícito de columnas en cada Edge Function (nunca `SELECT *` sobre vistas que incluyan `paciente_id`, `titulo_evento`, `motivo_consulta`, campos clínicos narrativos).
   - Auditoría del dominio real de valores de campos "administrativos" (`tipo_caso`, `prioridad`, `tipo_evento`) para descartar que codifiquen taxonomía clínica encubierta.

**Complejidad de Fase 0**: alta (no por dificultad técnica de cada pieza individual, sino porque es la primera vez que el proyecto construye backend server-side, gobernanza de secretos y gobernanza de datos hacia un tercero, todo a la vez).

---

## Fase 1 — Primeras herramientas a construir sobre la infraestructura de Fase 0

Prioridad alta/media, riesgo ya acotable con las salvaguardas de Fase 0.

### 1. Detector de riesgo de abandono de tratamiento
- **Qué hace**: analiza inasistencias, reprogramaciones, días sin consulta y estado de cobro por caso; Gemini redacta explicación y recomendación de acción administrativa (contactar, evaluar cierre) para revisión humana del terapeuta/coordinador. Nunca decide de forma automática.
- **Qué dato toca**: conteos agregados (inasistencias 60d, días desde última consulta, reprogramaciones, cobros vencidos bool, `tipo_caso`, `prioridad`) — requiere anonimización (alias aleatorio no reversible + auditar que `tipo_caso`/`prioridad` no codifiquen diagnóstico).
- **Complejidad**: media (sobre Fase 0 ya construida).

### 2. Redactor de resumen de gestión semanal/mensual
- **Qué hace**: reporte administrativo interno (consultas realizadas, evaluaciones cerradas, cobros pendientes, ocupación de agenda, casos por prioridad) para revisión de terapeuta/admin antes de compartir.
- **Qué dato toca**: agregados numéricos de vistas existentes — requiere anonimización (umbral mínimo por celda, evitar cruces con n bajo tipo "comuna + estado"; **no** reutilizar `vista_agenda_operativa` cruda porque expone nombre real, hay que re-agregar server-side antes de enviar a Gemini).
- **Complejidad**: media-alta (primer consumidor real de Fase 0 con múltiples fuentes de datos).

### 3. Detector de huecos y sobrecarga semanal de agenda
- **Qué hace**: detecta bloques libres aprovechables y sobrecarga de un terapeuta en la semana; Gemini redacta el resumen ejecutivo en lenguaje natural.
- **Qué dato toca**: solo estructura temporal de bloques (día/hora/modalidad/tipo_evento genérico), cero paciente — requiere anonimización solo en el sentido de allowlist estricto (nunca `titulo_evento`/`titulo_publico`, auditar dominio de `tipo_evento`).
- **Complejidad**: media (lógica de negocio simple; el costo real es Fase 0).

---

## Fase 2 — Herramientas condicionadas a validar supuestos antes de construir

Utilidad razonable pero con un supuesto de negocio o de dato que debe confirmarse primero, o con un riesgo de privacidad más alto que exige diseño adicional específico.

### 4. Clasificador de tipo/prioridad de solicitudes de agenda entrantes
- **Qué hace**: sugiere prioridad y tipo de caso probable para solicitudes públicas entrantes, a partir de metadatos (canal, origen, nuevo/existente, franja horaria). Decisión final siempre humana.
- **Qué dato toca**: metadatos administrativos únicamente en v1 — **modificación obligatoria**: eliminar por completo la opción de enviar `motivo_categoria` derivado del texto libre (`mensaje_contacto`) hasta que exista un mecanismo de anonimización auditado con casos de prueba, no solo declarado. Requiere anonimización solo si se reintroduce esa opción a futuro.
- **Complejidad**: media-alta (depende también de que el flujo de ingreso público esté resuelto, hoy bloqueado por PROD-001/BE-026).
- **Por qué en Fase 2 y no Fase 1**: depende de infraestructura de ingreso público que aún no existe, y su versión de mayor valor (usar el motivo) es precisamente la que hay que recortar.

### 5. Predictor de riesgo de inasistencia (no-show)
- **Qué hace**: puntaje de riesgo de inasistencia por paciente/evento y recomendación de acción (llamar antes, confirmación reforzada, lista de espera).
- **Qué dato toca**: agregados por alias de paciente (reagendas históricas, confirmación, día/hora, antigüedad) — requiere anonimización con generalización adicional: usar franja horaria en vez de hora exacta y rango de antigüedad en vez de meses exactos, porque el vector combinado es cuasi-identificador en clínica pequeña; alias aleatorio por corrida, no determinístico.
- **Modificación obligatoria antes de construir**: el cálculo del score debe ser 100% determinístico (SQL/reglas), sin Gemini. Usar Gemini solo si se necesita variar la redacción de la recomendación es opcional y de bajo valor — evaluar si un texto de plantilla condicional ya es suficiente antes de sumar la dependencia externa.
- **Complejidad**: media el cálculo; el uso de Gemini específicamente es prescindible.

### 6. Proyección de ingresos mensual con narrativa ejecutiva
- **Qué hace**: proyección numérica (regresión/promedio móvil calculado en el propio backend) + narrativa de Gemini que explica la tendencia, sin inventar cifras.
- **Qué dato toca**: series agregadas mensuales por `tipo_cobro` (montos, tasa de cobrabilidad) — requiere anonimización en el sentido de whitelist de columnas validada en código (la vista fuente real, `vista_cobros_estado`, expone `paciente_id` y otros IDs por fila; la agregación mensual debe ser una garantía de código, no una promesa de diseño).
- **Complejidad**: alta (primera vez agregando series temporales + regresión en Edge Function, sobre una vista que hoy no es agregada).
- **Por qué en Fase 2**: mismo patrón de riesgo que el resumen de gestión, pero con una fuente de datos (`vista_cobros_estado`) que expone más columnas identificatorias por fila, así que la barrera de código debe ser más estricta antes de construir.

---

## Resumen de secuencia

```
Fase 0  → Aprobación BE-020 + primera Edge Function + cron + estándar de anonimización real
Fase 1  → Abandono de tratamiento · Resumen de gestión · Huecos/sobrecarga de agenda
Fase 2  → Clasificador de solicitudes (solo metadatos) · No-show (score sin LLM, texto opcional) · Proyección de ingresos
Descartado → Recordatorios/confirmaciones · Detector de mora · Anomalías en condonaciones · Comunicaciones administrativas · Inconsistencias en fichas
```

Ninguna herramienta de Fase 1 o 2 se activa en producción sin la aprobación expresa de Control exigida por BE-020, incluso después de construida: es aprobación por herramienta, no una autorización genérica de "usar Gemini".
