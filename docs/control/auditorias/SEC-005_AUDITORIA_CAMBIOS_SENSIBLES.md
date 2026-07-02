# SEC-005 - Auditoria de cambios sensibles

Estado: Diseno documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Integracion Backend / Seguridad
Rama usada: `sec-005-auditoria-cambios-sensibles`

## Objetivo

Definir el modelo minimo de auditoria para cambios sensibles antes de usar datos reales, fotos reales, pagos reales, API publica real o produccion.

SEC-005 no implementa tablas, triggers, policies ni codigo. Define que debe auditarse, con que datos minimos y bajo que restricciones.

## Fuera de alcance

- Migraciones.
- SQL.
- Triggers.
- Policies RLS.
- Codigo fuente.
- Endpoints.
- `.env`.
- Supabase remoto.
- `supabase db push`.
- Google Calendar/Gmail funcional.
- Produccion.
- Datos reales, fotos reales o pagos reales.

## Principios

- Auditar cambios sensibles sin convertir la auditoria en una segunda ficha clinica.
- Registrar quien hizo que, cuando, sobre que entidad y desde que contexto.
- Minimizar datos personales y clinicos dentro del log.
- Preferir IDs, metadatos, resumen neutro y hashes antes que contenido sensible completo.
- No permitir borrado fisico normal de auditoria.
- Separar auditoria operativa de reportes funcionales.
- Mantener acceso a auditoria restringido a roles autorizados.

## Eventos sensibles minimos

| Area | Eventos a auditar |
| --- | --- |
| Auth y usuarios internos | alta, baja logica, cambio de rol, activacion, desactivacion, recuperacion critica, intentos bloqueados |
| Pacientes | creacion, correccion, cambio de datos identificatorios, anulacion, fusion futura |
| Consultas | creacion, edicion, cambio de estado, anulacion, asociacion/desasociacion de paciente |
| Evaluaciones y casos | creacion, edicion sensible, cierre, reapertura, anulacion |
| Elementos del caso | creacion, edicion, anulacion, cambio de estado o clasificacion |
| Revisiones y hallazgos | creacion, edicion, cierre, anulacion, cambio de severidad o estado |
| Trabajos | creacion desde hallazgo, cambio de estado, anulacion, cierre |
| Finanzas | cobro, pago, anulacion, correccion, conciliacion, cambio de monto o estado |
| Fotos y archivos | subida, visualizacion sensible futura, anulacion, reemplazo, descarte, intento no autorizado |
| Agenda | solicitud publica, revision interna, cambio de estado, conversion a evento, reagendamiento, cancelacion |
| Consentimientos | aceptacion, rechazo, revocacion, reemplazo, cambio de version |
| API publica | solicitud rechazada, rate limit, duplicado, origen no autorizado, error interno |
| Google futuro | intento de sincronizacion, exito, fallo, reintento, cancelacion |

## Datos minimos por evento

Cada evento debe considerar:

- identificador de evento;
- fecha/hora;
- actor interno o identidad tecnica;
- rol del actor al momento del evento;
- entidad afectada;
- identificador interno de entidad;
- tipo de accion;
- resultado: exito, rechazo, error o intento bloqueado;
- motivo o justificacion cuando corresponda;
- origen: UI interna, API publica, tarea de servicio, migracion autorizada, soporte;
- ambiente;
- correlation id o request id;
- resumen neutro del cambio;
- referencia a antes/despues minimizada cuando sea necesario;
- IP/user agent solo si la politica de privacidad y seguridad lo permite.

## Datos que no deben guardarse en auditoria

La auditoria no debe almacenar por defecto:

- diagnosticos completos;
- notas clinicas extensas;
- fotos;
- documentos adjuntos;
- textos libres clinicos completos;
- secretos;
- tokens;
- contrasenas;
- datos de tarjetas o medios de pago sensibles;
- contenido completo de correos;
- payloads publicos completos con datos personales.

## Antes y despues

Cuando se requiera comparar cambios:

- usar campos permitidos y minimizados;
- registrar nombres de campos modificados;
- evitar contenido completo cuando sea clinico o sensible;
- usar hash o resumen neutro si basta para trazabilidad;
- documentar excepciones antes de implementarlas.

## Roles y acceso a auditoria

Acceso conceptual:

- `admin`: acceso restringido a auditoria operacional completa segun necesidad.
- `terapeuta`: acceso limitado a auditoria vinculada a su flujo clinico si se aprueba.
- `finanzas`: sin acceso a auditoria clinica; solo eventos financieros minimizados si se aprueba.
- identidad tecnica: escritura controlada, no lectura general.

La implementacion futura debe definir RLS especifica. Esta tarea no crea policies.

## Retencion e inmutabilidad

Criterios futuros:

- no delete fisico normal;
- anulacion logica o marca de correccion;
- retencion minima por definir antes de produccion;
- exportacion controlada solo con autorizacion;
- proteccion contra edicion retroactiva;
- revision periodica de volumen y contenido sensible.

## Relacion con anulacion

BE-021 define la politica documental transversal de anulacion vs eliminacion, pendiente implementacion futura.

SEC-005 exige que anulaciones de datos clinicos, financieros, agenda, fotos y consentimientos queden auditadas con motivo, actor, fecha y entidad afectada.

## Relacion con API publica

Para API publica futura se debe auditar:

- solicitud recibida o rechazada;
- rate limit;
- CAPTCHA/anti-spam fallido;
- duplicado;
- error interno;
- conversion de solicitud a evento interno;
- sincronizacion Google futura.

No se deben guardar payloads publicos completos si contienen datos personales o clinicos.

## Relacion con consentimiento

BE-020 define estados conceptuales de consentimiento.

SEC-005 exige trazabilidad para aceptacion, rechazo, revocacion, reemplazo y cambios de version, sin guardar textos sensibles innecesarios dentro del log.

## Criterios de aceptacion de SEC-005

- Identifica eventos sensibles a auditar.
- Define datos minimos por evento.
- Define datos prohibidos en auditoria.
- Define criterio de antes/despues minimizado.
- Define acceso conceptual por rol.
- Define relacion con BE-020, BE-021, SEC-009, DOC-004 y PROD-001.
- Mantiene fuera de alcance migraciones, SQL, codigo, `.env`, Supabase remoto, Google y produccion.

## Riesgos pendientes

- Falta disenar tabla, indices, RLS y triggers futuros.
- Falta definir retencion exacta.
- Falta implementar politica de anulacion BE-021.
- Falta definir visualizacion UI de auditoria.
- Falta probar auditoria runtime.
- PROD-001 sigue bloqueante.

## Recomendacion

El siguiente bloque recomendado es `BE-018 / DOC-001 / DOC-003`, porque la implementacion tecnica de auditoria y anulacion requiere ambientes separados y politica de carga de datos reales.
