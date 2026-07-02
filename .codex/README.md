# Configuracion local recomendada para Codex

## Proposito

La carpeta `.codex` documenta recomendaciones locales para usar Codex dentro de **Terapeutas Australes App** sin mezclar instrucciones operativas con codigo funcional.

Debe servir para:

- orientar el uso de Codex escritorio;
- orientar el uso de Codex JetBrains/WebStorm;
- registrar comandos de diagnostico utiles;
- recordar restricciones de seguridad;
- evitar repetir instrucciones largas en cada thread.

## Relacion con AGENTS.md

`AGENTS.md` es el contrato persistente principal del repositorio y debe tener prioridad sobre esta carpeta.

`.codex/README.md` solo explica convenciones locales recomendadas. Si hay contradiccion, Codex debe detenerse, revisar `docs/control` y pedir confirmacion antes de modificar archivos.

## Acciones locales recomendadas

Acciones utiles para tener configuradas en Codex escritorio o en el IDE:

```bash
npm install
npm run dev
npm run lint
npm run build
```

Para tareas documentales, priorizar:

```bash
git diff --check
git status
```

## Comandos de diagnostico

Comandos base antes de iniciar tareas:

```bash
git status
git branch --show-current
git log --oneline -10
gh pr list --state open
```

Comandos utiles para revisar ramas y PRs:

```bash
git fetch origin
git branch --all
gh pr list --state open --draft
```

## Uso recomendado de Codex escritorio

Usar Codex escritorio como Control de Desarrollo:

- revisar estado del repositorio;
- revisar PRs abiertos;
- leer `docs/control`;
- detectar bloqueos;
- proponer planes;
- crear ramas de trabajo;
- ejecutar cambios aprobados;
- validar;
- preparar commit y PR draft;
- dejar trazabilidad.

## Uso recomendado de Codex JetBrains/WebStorm

Usar Codex JetBrains/WebStorm para ejecucion tecnica fina:

- componentes concretos;
- CSS;
- formularios;
- TypeScript acotado;
- revision visual dentro del IDE;
- cambios quirurgicos indicados por Control.

El IDE no debe usarse para decidir prioridades globales, saltar validaciones ni abrir tareas criticas sin autorizacion.

## Precaucion sobre secretos

`.codex` no debe guardar claves, tokens, contrasenas, service accounts, datos privados, datos reales ni credenciales.

No versionar secretos. No copiar contenido de `.env`. No registrar informacion sensible de pacientes, pagos, fotos ni usuarios reales.
