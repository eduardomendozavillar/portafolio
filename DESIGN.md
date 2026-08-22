# DESIGN.md — Circuit Night (incumbent)

Scan-mode documentation of the **current** visual system. Authority is code (`src/app/globals.css`, sections, UI primitives), not this file alone.

## World

**Circuit Night** — dark systems / applied-AI portfolio. Quiet surfaces, electric cyan signal, display + body pairing. Glow is ambient punctuation, not neon wallpaper.

## Color tokens

| Token | Hex | Role |
|-------|-----|------|
| paper / background | `#0a0e17` | Base canvas |
| paper-raised | `#121826` | Raised surface (asides, form panels) |
| ink | `#e8eef7` | Primary text |
| ink-muted | `#94a3b8` | Secondary text (must stay readable on dark) |
| line | `#1e293b` | Borders / hairlines |
| accent | `#22d3ee` | Cyan signal (links, focus, emphasis) |
| accent-soft | `#083344` | Soft accent fill (selection, soft chips) |
| accent-contrast | `#0a0e17` | Text on solid accent controls |

Semantic utility names stay stable (`bg-paper`, `text-ink`, `border-line`, `text-accent`, …).

## Typography

| Role | Face | Notes |
|------|------|--------|
| Display | **Space Grotesk** (`font-display`) | Name, section titles, large numbers |
| Body | **Inter** (`font-sans` / body default) | Prose, nav, form |

**Waiver:** Inter body + Space Grotesk display is deliberate. Do not collapse to Inter-only “safe” pairing. Do not introduce a third display face without a redesign brief.

## Layout & depth

- Single-page sections separated by `border-b border-line`.
- One raised surface + `border-line` is enough — **no nested cards**.
- Body sections prefer denser vertical rhythm (`py-16 md:py-20`) over airy marketing padding.
- List rows use hairline separators; project cards keep a list index for order, not decorative section numbers.

## Signature & motion

- **Hero ambient:** soft cyan radial + faint grid fade (quieter when a photo is present).
- **Primary CTA glow** on the main button only.
- `focus-visible` accent ring; `prefers-reduced-motion` respected in `globals.css`.
- No gradient text. Emphasis via weight, size, or solid accent color (e.g. tagline phrase).

## Components (patterns)

- **SectionHeading:** title carries weight. Do not render a redundant eyebrow when it equals the title. Drop decorative `01/02/03` section indexes unless sequence carries real information.
- **Hero:** photo left on `md+`, content right; stack chips; CTAs + socials near the fold.
- **ProjectCard:** title → outcome → tech → Demo/Código + optional status badge (Spanish labels).
- **Header:** sticky, blur; desktop Contacto CTA to `#contacto`; mobile menu with full nav.

## Anti-patterns (do not introduce)

- Purple / rainbow gradients, gradient text
- Cards nested inside cards
- Bounce / playful easing on professional surfaces
- Inter-only without display pairing
- Neon overload (glow on every card, chip, and border)
- Decorative section kickers that repeat the heading
- Light theme without an explicit product decision

## Assets

- Profile web assets live under `public/images/` (`profile.webp`, `profile.jpg`, `profile-400.webp`).
- Large source media stays under `/media/` (gitignored); do not commit multi‑MB originals into `public/`.
