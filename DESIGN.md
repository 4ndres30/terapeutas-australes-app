---
version: alpha
name: Terapeutas Australes — Design System
---

## Overview

Sistema de diseño para la app clínica interna Terapeutas Australes (React + TypeScript + Supabase).
El proyecto usa múltiples hojas CSS por módulo; este documento fija los tokens base para
evitar deriva visual. Los valores son referenciales y deben confirmarse contra el CSS real.

## Colors

- `bg`: #f6f7f9 (fondo base claro)
- `surface`: #ffffff (tarjetas / paneles)
- `text`: #1b1f24 (texto principal, near-black con cast leve)
- `muted`: #6b7280 (texto secundario)
- `border`: #e3e6ea (bordes y divisores)
- `primary`: #2f6f6a (acento clínico / acción principal)
- `success`: #2e7d52
- `warning`: #b8860b
- `danger`: #b3261e

## Typography

- `font-sans`: system-ui, -apple-system, "Segoe UI", sans-serif
- `font-size-base`: 16px
- `h1`: 1.75rem / 700
- `h2`: 1.375rem / 600
- `body`: 1rem / 400
- `small`: 0.8125rem / 400

## Rounded

- `sm`: 6px
- `md`: 10px
- `lg`: 14px
- `pill`: 999px

## Spacing

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 40px

## Components

- `Card`: surface + border + rounded-md + shadow sutil
- `Button`: primary (filled) / secondary (outline) / ghost; focus-visible ring
- `Input`: border + rounded-sm + padding-md
- `Table`: filas con borde inferior, header muted
- `Badge`: pill, estados success/warning/danger
- `Modal/Drawer`: overlay scrim + surface elevado

## Accessibility

- Contraste AA en text/muted sobre bg.
- Focus visible en todos los controles interactivos.
- Roles por sesión (admin / terapeuta / finanzas) validados en AuthContext.
