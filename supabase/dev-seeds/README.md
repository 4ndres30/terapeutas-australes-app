# Seeds locales de desarrollo

## caso_demo_integral.sql

`caso_demo_integral.sql` crea datos ficticios para validar de punta a punta el módulo `Casos` en Supabase local.

Seed listo para ejecución local manual.

## Advertencia de uso

- Usar solo en Supabase local o una base de desarrollo descartable.
- No ejecutar contra Supabase remoto.
- No ejecutar con datos reales.
- No usar `supabase db push` para cargar este seed.
- No hacer reset de base de datos salvo autorización explícita.

## Datos demo

El registro principal se identifica por:

- Paciente: `Paciente Demo Casos Integrales`
- Email ficticio: `demo.casos.integrales@example.test`
- Caso: `DATA-001 - Caso Demo Integral`

Todos los nombres, teléfonos, referencias y observaciones son ficticios.

## Tablas cubiertas

El seed inserta o reutiliza registros demo en:

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
- `cobros`
- `pagos`

El script deja:

- un aspecto con hallazgo asociado para validar `Hallazgo registrado`;
- varios aspectos sin hallazgo para validar `Crear hallazgo`;
- un panel de hallazgos con registros visibles;
- un trabajo mínimo asociado al caso;
- un cobro con pago parcial para validar el panel de pagos.

## Tablas no cubiertas

- `trabajo_elementos`: no se inserta porque el panel actual del caso consume solo `trabajos`.
- `trabajo_sesiones`: no se inserta porque no hay UI de detalle de sesiones en el flujo solicitado.
- `trabajo_acciones`: no se inserta porque no hay conversión hallazgo-trabajo ni gestión de acciones en el alcance.
- Tablas independientes de seguimiento: no se insertan porque el seguimiento del caso existe como campos en `casos`, `revisiones`, `revision_elementos`, `revision_aspectos`, `revision_hallazgos` y `trabajos`.

Notas de modelado:

- El vínculo demo se registra como `tipo_elemento = 'Persona'` y usa `vinculo_con_paciente`, porque `elementos_caso.tipo_elemento` no incluye `Vínculo`.
- El linaje demo se registra como `tipo_elemento = 'Otro'`, porque `elementos_caso.tipo_elemento` no incluye `Linaje`.
- Los aspectos sí usan las áreas reales `Vínculo` y `Linaje` de `revision_aspectos.area_revision`.

## Ejecución local sugerida

Desde la raíz del proyecto:

```bash
supabase start
supabase status
```

Luego ejecutar contra la base local. Ajusta puerto, usuario y base según `supabase status` si tu entorno difiere:

```bash
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" \
  -v ON_ERROR_STOP=1 \
  -f supabase/dev-seeds/caso_demo_integral.sql
```

PowerShell:

```powershell
$env:PGPASSWORD = 'postgres'
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -v ON_ERROR_STOP=1 -f supabase/dev-seeds/caso_demo_integral.sql
```

## Validación en la app

1. Abrir `Pacientes` y buscar `Paciente Demo Casos Integrales`.
2. Abrir `Casos` y buscar `DATA-001 - Caso Demo Integral`.
3. Entrar al detalle del caso.
4. Revisar elementos, revisiones, detalle de revisiones, hallazgos, trabajos y pagos.
5. En `Detalle de revisiones`, validar:
   - aspecto con badge `Hallazgo registrado`;
   - acción `Ver hallazgo`;
   - aspecto sin hallazgo con acción `Crear hallazgo`;
   - panel `Hallazgos de esta revisión`;
   - prevención visual de duplicados.

## Limpieza manual local

Solo limpiar en una base local. Antes de borrar, verificar el paciente demo:

```sql
select id, nombres, apellidos, email
from public.pacientes
where email = 'demo.casos.integrales@example.test';
```

Si es seguro limpiar, hacerlo en una transacción manual y borrar en este orden:

1. `pagos`
2. `cobros`
3. `trabajos`
4. `revision_hallazgos`
5. `revision_aspectos`
6. `revision_elementos`
7. `revisiones`
8. `elementos_caso`
9. `casos`
10. `evaluaciones`
11. `consultas`
12. `pacientes`

Usar siempre filtros por `pacientes.email = 'demo.casos.integrales@example.test'` o por nombres que comiencen con `DATA-001 -`.

## Restricciones respetadas por este seed

- No crea migraciones.
- No modifica migraciones.
- No crea tablas.
- No modifica estructura de base de datos.
- No crea constraints, policies, funciones ni triggers.
- No usa datos reales.
- No borra datos.
- No toca Supabase remoto.
- No ejecuta `supabase db push`.
- No toca `.env`.
