# Sistema de diseño — portafolio (Circuit Night, legacy)

> Fuente: sync automático de `src/app/globals.css` (2026-10-22). Estado LEGACY:
> el rebrand en curso (`feat/portfolio-rebrand`) reemplaza estos tokens por
> charcoal/bone/red + Anton/Manrope (decisión aprobada; ver
> `odd/tasks/portfolio-rebrand.md` y `design/rebrand/`).

## Colores (semánticos)

| Token | Valor | Uso |
|---|---|---|
| `--background` / `--color-paper` | `#0a0e17` | fondo base |
| `--color-paper-raised` | `#121826` | superficies elevadas |
| `--color-ink` / `--foreground` | `#e8eef7` | texto primario |
| `--color-ink-muted` | `#94a3b8` | texto secundario |
| `--color-line` | `#1e293b` | bordes/hairlines |
| `--color-accent` | `#22d3ee` | cyan eléctrico (links, CTA, focus) |
| `--color-accent-soft` | `#083344` | fondo suave del accent |
| `--color-accent-contrast` | `#0a0e17` | texto sobre accent |

Fuente: `src/app/globals.css` (`:root`).

## Tipografía

| Token | Valor | Uso |
|---|---|---|
| `--font-display` | `--font-outfit` (Outfit) | títulos, números, brand |
| `--font-sans` | `--font-source-sans` (Source Sans 3) | cuerpo |

Fuente: `src/app/globals.css` (`@theme inline`) + `src/app/layout.tsx` (next/font).

## Reglas de componentes

- `:focus-visible` = outline 2px accent, offset 2px.
- Body: `font-size 1.0625rem`, `line-height 1.65`.
- `scroll-padding-top: 4.5rem` (header sticky).
- `prefers-reduced-motion` neutraliza animaciones y scroll suave.
- Secciones: `border-b border-line`, `Container max-w-5xl px-6 md:px-8 py-16 md:py-20`.
