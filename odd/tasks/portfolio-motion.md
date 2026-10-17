# Feature: portfolio-motion

Preview de proyectos con imágenes (idea del usuario) + scroll progress + timeline draw-in + parallax hero. Base estética: Circuit Night editorial (paper/ink/line/accent, Outfit + Source Sans 3), a11y floor existente (`prefers-reduced-motion`, focus-visible, keyboard).

## Specs

- S1: User: "yo tengo una en mente como una vista previa de los proyectos con imagenes" — hover preview flotante en desktop + lightbox con imagen, resumen, stack y links.
- S2: User: "Deje las imagenes dentro de la carpeta /img recuerda que debemos optimizarla a .webp" — convertir PNG de `/img` a `.webp` optimizado.
- S3: Decisión (elección del usuario en options): "Combo completo: Preview + scroll progress + timeline draw-in + parallax hero (más grande, en slices)".
- S4: Todo respeta `prefers-reduced-motion` (consistencia con el floor existente).
- S5: Cards de proyectos sin imágenes quedan como hoy (graceful degradation).

## Tasks

- T1 (S2): convertir `/img/<PROYECTO>/*.png` → `public/images/projects/<slug>/<n>.webp` con sharp (max 1200px, q~78). Commit: `145a52b`.
- T2 (S1): `images?: ProjectImage[]` en `types/project.ts` + mapear rutas webp en `github.ts` (sin images para portafolio-personal). Commit: `504007b`.
- T3 (S1,S4,S5): hover preview flotante en ProjectCard (solo hover + fine pointer; gate matchMedia, position via CSS vars). Commit: `f97b8f5`.
- T4 (S1,S4): lightbox modal con galería prev/next, Esc/flechas, overlay click, focus trap + focus return, scroll lock, reduced-motion sin animación. Commit: `f97b8f5`.
- T5 (S3): scroll progress 2px accent bajo el header sticky. Commit: `39aac97`.
- T6 (S3): timeline draw-in en Experiencia (línea accent scaleY por scroll + Reveal por item). Commit: `c4c9741`.
- T7 (S3): parallax sutil en Hero (capas grid/fondo/texto, ≤10px, transform-only). Commit: `7fbe599`.
- T8 (S1-S5): tests RED→GREEN por regla (17 nuevos), suite 95 pass/4 skip, tsc 0, lint 0 errores, build OK, smoke SSR marcadores + assets webp 200. Pendiente: revisión visual del usuario antes de push.

## Log

- L1: User: "busca lo teniamos anterior mente hazme un resumen proponme mejoras de animacion yo tengo una en mente como una vista previa de los proyectos con imagenes  y con esta dos skill https://github.com/elayadesign/ai-design-skills - https://github.com/oso95/scroll-world pero antes dame tus propuestas sin hacer nada"
- L2: Usuario eligió opción "Combo completo (value: combo)".
- L3: User: "Deje las imagenes dentro de la carpeta /img recuerda que debemos optimizarla a .webp" (arranque autorizado; imágenes: FITBOX×6, SGDI×4, TALLER.BY×5, PNG).
- L4: Decisión: portafolio-personal no tiene capturas → sin preview (S5); usuario puede sumarla después.
- L5: Verificación end-to-end del branch feat/portfolio-motion: 6 commits work-unit (145a52b assets, 504007b data, f97b8f5 preview, 39aac97 progress, c4c9741 timeline, 7fbe599 parallax). RAW PNG de /img quedan sin trackear (los webp optimizados son los assets del repo).
