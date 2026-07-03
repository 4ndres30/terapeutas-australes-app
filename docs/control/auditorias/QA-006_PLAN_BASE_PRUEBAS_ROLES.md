# QA-006 - Plan base de pruebas por rol y no exposicion sensible

## Estado

Plan base documental / pendiente ejecucion progresiva.

## Fecha

2026-07-03

## Rama

`qa-006-plan-base-pruebas-roles`

## Origen

- CTRL-008.
- SEC-001.
- SEC-002.
- SEC-004.
- QA-004.
- QA-005.
- UI-020/UI-021 validadas local/demo por QA-009.
- PROD-001.

## Objetivo

Definir una base minima y progresiva de pruebas para roles, navegacion, reportes, finanzas y no exposicion de datos sensibles.

Este documento no ejecuta pruebas funcionales completas ni modifica codigo. Ordena el alcance para que QA-006 se pueda ejecutar por bloques pequenos, verificables y sin mezclar responsabilidades.

## Principio de ejecucion

QA-006 no debe intentar cubrir todo en un solo PR.

Debe ejecutarse por fases:

1. matriz de rutas y superficies por rol;
2. pruebas de navegacion visible por rol;
3. pruebas de reportes por rol;
4. pruebas de Finanzas y no exposicion sensible;
5. pruebas Auth minimas por estado de usuario;
6. pruebas locales de RLS/Storage cuando existan condiciones tecnicas suficientes.

Cada fase debe tener rama, evidencia y PR propio si modifica documentacion, tests o codigo.

## Roles minimos

| Rol | Superficie esperada | Riesgo principal |
| --- | --- | --- |
| Admin | Gestion general, clinica, finanzas autorizadas, reportes y configuracion interna. | Acceso amplio sin trazabilidad suficiente antes de produccion. |
| Terapeuta | Superficie clinica y operativa sin administracion financiera completa. | Ver o gestionar pagos/cobros mas alla de lo aprobado. |
| Finanzas | FinanzasPage y reportes financieros minimos. | Exposicion de clinica sensible, fotos, rutas Storage o identificadores clinicos reales. |
| Usuario sin perfil interno | Bloqueo controlado. | Acceso a shell interno sin rol valido. |
| Usuario inactivo | Bloqueo controlado. | Acceso posterior a desactivacion. |
| Rol invalido | Bloqueo controlado. | Escalamiento o ruta inesperada. |

## Matriz preliminar de pruebas

| Bloque | Validacion | Estado |
| --- | --- | --- |
| Rutas protegidas | Confirmar que rutas internas requieren sesion y rol valido. | Pendiente |
| Navegacion por rol | Confirmar menu/superficies visibles segun rol. | Pendiente |
| Reportes Admin | Confirmar reportes generales, clinicos, financieros y operativos autorizados. | Pendiente |
| Reportes Terapeuta | Confirmar reportes clinicos sin administracion financiera completa. | Pendiente |
| Reportes Finanzas | Confirmar reportes financieros sin clinica sensible. | Pendiente |
| FinanzasPage | Confirmar uso de superficie financiera minima. | Pendiente |
| No exposicion clinica | Confirmar que Finanzas no ve motivo, notas, hallazgos, revisiones, trabajos clinicos sensibles ni fotos. | Pendiente |
| No exposicion Storage | Confirmar que Finanzas no ve miniaturas, rutas ni `storage_path`. | Pendiente |
| Identificadores | Confirmar tratamiento de `paciente_id` segun BE-023/BE-025. | Pendiente condicionado |
| Auth sin perfil | Confirmar bloqueo no tecnico. | Pendiente |
| Auth inactivo | Confirmar bloqueo no tecnico. | Pendiente |
| Auth rol invalido | Confirmar bloqueo no tecnico. | Pendiente |
| Password policy | Validar cuando SEC-008 quede aplicable tras reinicio local. | Pendiente condicionado |
| Signup/provisioning | Validar cuando SEC-008B exista. | Pendiente condicionado |
| Recuperacion/MFA | Validar cuando UI-024 exista. | Pendiente condicionado |

## Dependencias condicionantes

QA-006 debe reconocer que algunas validaciones dependen de tareas aun pendientes o parciales:

- `SEC-005`: auditoria de cambios sensibles implementada para uso real.
- `SEC-008`: hardening Auth implementado parcialmente y pendiente de cierre.
- `SEC-008B`: cierre de signup y provisioning controlado.
- `BE-021`: anulacion logica vs eliminacion fisica implementada para uso real.
- `UI-023`: navegacion y superficies filtradas por rol.
- `UI-024`: recuperacion de cuenta, MFA y estados Auth no tecnicos.
- `BE-023`: alias/codigo administrativo persistente para Finanzas.
- `BE-025`: campos financieros permitidos/prohibidos para Finanzas.

Mientras estas tareas no esten cerradas, QA-006 solo puede documentar matriz, preparar criterios y ejecutar validaciones parciales locales/demo.

## Evidencia esperada por fase

Cada fase debe registrar:

- rama usada;
- usuario/rol de prueba;
- rutas revisadas;
- datos ficticios usados;
- resultado por caso;
- capturas o lectura DOM cuando aplique;
- errores encontrados;
- archivos tocados;
- restricciones respetadas;
- recomendacion de Control.

## Restricciones

QA-006 no debe:

- usar datos reales;
- usar fotos reales;
- usar pagos reales;
- tocar `.env`;
- exponer secretos;
- usar Supabase remoto;
- ejecutar `supabase db push`;
- modificar Auth/RLS sin tarea aprobada;
- crear API publica;
- integrar Google Calendar, Gmail ni Workspace;
- habilitar produccion;
- mezclar ejecucion funcional, hardening y documentacion en un solo PR.

## Bloque QA-006A

El primer bloque ejecutable despues de este plan queda documentado como:

```text
QA-006A - Matriz de rutas y superficies por rol
```

Informe:

```text
docs/control/auditorias/QA-006A_MATRIZ_RUTAS_SUPERFICIES_ROL.md
```

Alcance cubierto:

- inventariar rutas internas actuales;
- mapear rutas por rol esperado;
- identificar superficies que requieren prueba manual o automatizada;
- no modificar codigo;
- no ejecutar datos reales;
- dejar PR documental.

La siguiente fase recomendada es `QA-006B - Validacion visual autenticada de navegacion por rol`.

## Bloque QA-006B

El segundo bloque queda iniciado como:

```text
QA-006B - Validacion visual autenticada de navegacion por rol
```

Informe:

```text
docs/control/auditorias/QA-006B_VALIDACION_NAVEGACION_ROLES.md
```

Alcance cubierto:

- validar en navegador integrado que rutas internas sin sesion redirigen a `/login`;
- registrar bloqueo de cobertura autenticada multirol por falta de credenciales demo documentadas;
- no crear usuarios Auth;
- no modificar `usuarios_internos`;
- no leer ni exponer secretos;
- no tocar Supabase remoto.

La siguiente fase recomendada es desbloquear `SEC-007` para contar con procedimiento local/demo aprobado antes de reintentar la cobertura visual por `admin`, `terapeuta` y `finanzas`.

## Resultado

QA-006 queda iniciado como plan base documental. La ejecucion queda dividida en fases para evitar un PR demasiado grande o riesgoso.

PROD-001 sigue bloqueante.
