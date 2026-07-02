# BE-018 - Separacion tecnica de ambientes

Estado: Diseno documental / pendiente implementacion futura.
Fecha: 2026-07-02
Responsable: Integracion Backend / Seguridad
Rama usada: `be-018-doc001-doc003-ambientes-datos-reales`

## Objetivo

Definir la separacion tecnica minima entre ambientes local, demo, staging y produccion para evitar mezcla de configuraciones, datos demo y datos reales.

BE-018 no crea ambientes, no modifica `.env`, no toca Supabase remoto y no habilita produccion.

## Ambientes definidos

| Ambiente | Proposito | Datos permitidos |
| --- | --- | --- |
| Local | Desarrollo y pruebas tecnicas en equipo individual | Ficticios/demo |
| Demo | Demostracion controlada y QA funcional no productivo | Ficticios/demo |
| Staging | Validacion previa aislada antes de produccion | Ficticios o anonimizados aprobados |
| Produccion | Operacion oficial futura | Reales solo tras cerrar PROD-001 |

## Reglas minimas

- Cada ambiente debe tener URL, Supabase project/configuracion, claves y datos separados.
- Ningun secreto debe vivir en frontend versionado.
- `.env` no debe modificarse ni versionarse con credenciales reales.
- Seeds demo quedan prohibidos en produccion.
- Produccion no debe existir como ambiente operativo hasta cerrar PROD-001.
- Staging no puede usar datos reales sin aprobacion explicita y politica DOC-003.
- API publica, Google Calendar/Gmail y pagos reales deben usar credenciales separadas por ambiente.

## Barreras requeridas

- Indicador visible de ambiente activo.
- Bloqueo visual de produccion no habilitada mientras PROD-001 siga abierto.
- Checklist previo antes de habilitar staging o produccion.
- Separacion de callbacks/Auth/redirects por ambiente.
- Separacion de CORS por dominio.
- Separacion de backups por ambiente.
- Procedimiento documentado para carga de datos reales.

## Variables de entorno

BE-018 solo define reglas:

- usar variables distintas por ambiente;
- no copiar valores productivos a local/demo;
- no exponer service role en frontend;
- no commitear `.env`;
- registrar nombres esperados sin valores secretos;
- rotar secretos si existe sospecha de mezcla.

## Criterios para habilitar staging

- Manual DOC-001 aprobado.
- Politica DOC-003 aprobada.
- SEC-005 documentada e implementacion planificada.
- BE-020 validado clinica/legalmente si se usan datos no ficticios.
- CORS/Auth/URLs separados.
- Sin datos reales salvo autorizacion explicita.

## Criterios para habilitar produccion

Produccion requiere cierre previo de PROD-001.

Minimos:

- ambientes separados;
- backups y restauracion definidos;
- consentimiento validado;
- auditoria implementada;
- anulacion logica implementada;
- RLS/grants validados;
- politica de carga real aprobada;
- aprobacion explicita de Javier.

## Restricciones respetadas

No se crean proyectos, credenciales, secretos, `.env`, endpoints, migraciones, SQL, Supabase remoto, Google, pagos, produccion ni datos reales.

## Recomendacion

Antes de cualquier implementacion tecnica de ambientes, cerrar DOC-001, DOC-003 y DOC-002, y mantener PROD-001 bloqueante.
