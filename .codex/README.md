# Configuracion local recomendada para Codex

Esta carpeta documenta como usar Codex dentro del proyecto **Terapeutas Australes App**.

## Proposito

- Centralizar comandos utiles.
- Evitar repetir instrucciones largas en cada thread.
- Mantener Codex alineado con `AGENTS.md` y `docs/control`.
- Separar configuracion operativa de instrucciones de comportamiento.

## Archivo principal

Las instrucciones que Codex debe cargar automaticamente estan en:

```text
AGENTS.md
```

Ese archivo contiene las reglas principales del repositorio.

## Acciones locales recomendadas

Configurar en Codex escritorio acciones equivalentes a:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Acciones de diagnostico recomendadas:

```bash
git status
git branch --show-current
git log --oneline -10
gh pr list --state open
```

## Uso recomendado

### Control de Desarrollo

Usar Codex escritorio para:

- revisar estado del repo;
- coordinar tareas;
- crear ramas;
- preparar PRs;
- registrar auditorias;
- generar prompts para WebStorm.

### Edicion fina

Usar Codex JetBrains/WebStorm para:

- cambios concretos en componentes;
- CSS;
- formularios;
- revision visual;
- ajustes TypeScript acotados.

## Precaucion

No almacenar credenciales, tokens, claves ni configuracion privada dentro de esta carpeta.

Este directorio debe contener solo documentacion o configuracion segura del flujo de trabajo.
