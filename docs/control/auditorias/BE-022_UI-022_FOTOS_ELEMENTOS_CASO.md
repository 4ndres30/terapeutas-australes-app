# BE-022 / UI-022 — Fotos de elementos del caso

## Objetivo

Implementar soporte local/demo para asociar fotos a elementos registrados en `public.elementos_caso`, manteniendo el flujo dentro de la ficha del caso.

## Alcance

- Crear soporte backend con Supabase Storage privado.
- Crear tabla relacional de metadatos `public.fotos_elementos_caso`.
- Asociar cada foto a paciente, caso y elemento del caso.
- Integrar carga, listado y visualización básica en `ElementosCasoPanel`.
- Excluir al rol Finanzas del acceso a fotos y rutas de Storage.
- Mantener la funcionalidad orientada a pruebas locales/demo con datos ficticios.

## Decisión técnica

Las fotos de elementos del caso se gestionan mediante Supabase Storage privado y la tabla `public.fotos_elementos_caso`.

La columna antigua `elementos_caso.foto_url` queda deprecada para uso operativo principal y no debe usarse como solución de almacenamiento documental.

## Por qué no usar `elementos_caso.foto_url`

`foto_url` solo permite una referencia directa por elemento y no modela metadatos, estado, tipo de foto, descripción, principalidad ni futuras reglas de auditoría. Para fotos clínicas/operativas se requiere Storage privado, RLS y una tabla relacional que permita múltiples fotos por elemento.

## Migración creada

`supabase/migrations/20260619183000_crear_fotos_elementos_caso.sql`

## Bucket creado

`elementos-caso`

Configuración esperada:

- privado;
- límite de 5 MB;
- MIME permitidos: `image/jpeg`, `image/png`, `image/webp`.

## Tabla creada

`public.fotos_elementos_caso`

La tabla registra:

- paciente;
- caso;
- elemento del caso;
- bucket y ruta Storage;
- nombre, MIME y tamaño;
- descripción;
- tipo de foto;
- indicador principal;
- estado lógico;
- fechas de creación y actualización.

## RLS y policies

Se habilita RLS en `public.fotos_elementos_caso`.

Permisos previstos:

- `select` para usuarios `admin` o `terapeuta`.
- `insert` para usuarios `admin` o `terapeuta`.
- `update` para usuarios `admin` o `terapeuta`.
- Sin `delete` físico en esta etapa.

Storage `storage.objects` queda limitado al bucket `elementos-caso` con policies de lectura, carga y actualización para `admin` o `terapeuta`.

Finanzas no debe acceder a fotos de elementos del caso ni a rutas de Storage asociadas.

## Validación relacional

La función `public.validar_foto_elemento_caso()` valida que:

- el caso exista;
- el paciente coincida con el paciente del caso;
- el elemento pertenezca al mismo caso y paciente.

## Archivos frontend modificados

- `src/pages/casos/ElementosCasoPanel.tsx`

## Integración UI

El panel de elementos ahora permite:

- ver cuántas fotos tiene cada elemento;
- seleccionar un elemento existente;
- validar imagen JPG, PNG o WebP;
- validar tamaño máximo de 5 MB;
- subir a Storage privado;
- registrar metadatos en `public.fotos_elementos_caso`;
- listar fotos activas del caso;
- generar URLs temporales con `createSignedUrl`.
- no exponer rutas internas de Storage en pantalla.
- no mostrar fotos al rol Finanzas.

## Limitaciones de esta primera versión

- No hay edición de metadatos.
- No hay archivado visual de fotos.
- No hay eliminación física controlada.
- No hay auditoría de accesos a imágenes.
- No hay compresión automática.
- No hay carga múltiple.
- No hay clasificación avanzada de evidencia.
- No se integran fotos dentro de revisiones, hallazgos o trabajos.
- No queda validado para datos reales.

## Checklist de pruebas

- Abrir la app local.
- Abrir un caso existente.
- Ir a `Elementos del caso`.
- Confirmar que los elementos existentes cargan igual que antes.
- Registrar un elemento nuevo como `Perro`, `Casa` o `Consultante`.
- Subir una foto válida al elemento.
- Confirmar que aparece asociada al elemento correcto.
- Confirmar que no aparece en otros casos.
- Confirmar que no se rompen revisiones, detalle de revisiones, trabajos ni pagos.

## Riesgos pendientes para datos reales

- Falta validar runtime RLS de Storage y tabla por rol.
- Falta bitácora/auditoría de accesos o cambios sensibles.
- Falta validar runtime que Finanzas no acceda a fotos ni rutas de Storage.
- Falta política de archivado y eliminación física.
- Falta validación productiva de backups y restauración.
- Falta checklist pre-producción de Storage.

## Resultado de validación

- `npm run lint`: correcto.
- `npm run build`: correcto, con advertencia no bloqueante de Vite por tamaño de chunk.
- `npx supabase migration list --local`: correcto.
- `npx supabase migration up --local`: migración `20260619183000_crear_fotos_elementos_caso.sql` aplicada correctamente en base local.
- `npx supabase migration list --local`: confirma la migración local aplicada.

## Resultado

BE-022 y UI-022 quedan implementadas en primera versión local/demo. QA-003 queda pendiente para validación funcional local antes de considerar uso operativo real.
