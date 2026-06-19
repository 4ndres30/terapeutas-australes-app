# PROD-001 — Preparación para uso real con datos sensibles

## Estado

Pendiente / Alta prioridad.

## Objetivo

Definir las condiciones mínimas antes de ingresar datos reales de pacientes al sistema.

## Decisión de control

La aplicación no debe usarse todavía como sistema oficial con datos reales de pacientes hasta completar una revisión de seguridad, permisos, respaldos y tratamiento de datos sensibles.

## Riesgos principales

- Mezclar datos demo con datos reales.
- Perder información por no tener respaldo probado.
- Permitir acceso indebido a información clínica.
- No contar con consentimiento informado o autorización de tratamiento de datos.
- No tener procedimiento de recuperación.
- No tener claridad entre ambiente local, demo, staging y producción.

## Checklist mínimo antes de uso real

- Separar ambientes: local, demo, staging y producción.
- Confirmar que datos demo no se mezclen con datos reales.
- Revisar RLS y policies tabla por tabla.
- Validar roles internos: admin, terapeuta y finanzas.
- Confirmar acceso limitado por usuario.
- Definir backup automático o procedimiento manual de respaldo.
- Probar restauración de respaldo.
- Definir consentimiento informado o autorización de tratamiento de datos.
- Definir política interna de privacidad y confidencialidad.
- Revisar campos sensibles innecesarios.
- Definir procedimiento de corrección, exportación o eliminación cuando corresponda.
- Auditar seguridad antes de producción.

## Responsables

- Control de desarrollo: coordina la preparación.
- Integración Backend/Estructura: revisa RLS, policies, roles y Supabase.
- Revisión de flujo clínico: valida consentimiento, ficha clínica y uso operativo.
- UI/UX: revisa mensajes, estados y advertencias.
- Codex/implementación: ejecuta ajustes solo después de definición aprobada.

## Resultado esperado

El proyecto queda advertido formalmente de que aún no debe cargarse información real de pacientes como uso oficial hasta cerrar PROD-001.
