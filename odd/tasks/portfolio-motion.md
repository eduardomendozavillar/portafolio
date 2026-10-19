# Feature: portfolio-motion

Preview de proyectos con imágenes (idea del usuario) + scroll progress + timeline draw-in + parallax hero. Base estética: Circuit Night editorial (paper/ink/line/accent, Outfit + Source Sans 3), a11y floor existente (`prefers-reduced-motion`, focus-visible, keyboard).

## Specs

- S1: User: "yo tengo una en mente como una vista previa de los proyectos con imagenes" — hover preview flotante en desktop + lightbox con imagen, resumen, stack y links.
- S2: User: "Deje las imagenes dentro de la carpeta /img recuerda que debemos optimizarla a .webp" — convertir PNG de `/img` a `.webp` optimizado.
- S3: Decisión (elección del usuario en options): "Combo completo: Preview + scroll progress + timeline draw-in + parallax hero (más grande, en slices)".
- S4: Todo respeta `prefers-reduced-motion` (consistencia con el floor existente).
- S5: Cards de proyectos sin imágenes quedan como hoy (graceful degradation).
- S6: User: "sinceramente no me gusto nada lo de la imagen que podemos hacer porpuesta mas animadas/interactivas que tenga animacion cuando hacemos scroll - li idea de las imagen es que tenga una vista previa" — el hover flotante se descarta; las imágenes quedan como vista previa animada por scroll.
- S7: Decisión (choice del usuario): "A — Showcase sticky": panel sticky con la imagen del proyecto activo que cambia animado mientras se scrollea la lista; mobile inline.

## Tasks

- T1 (S2): convertir `/img/<PROYECTO>/*.png` → `public/images/projects/<slug>/<n>.webp` con sharp (max 1200px, q~78). Commit: `145a52b`.
- T2 (S1): `images?: ProjectImage[]` en `types/project.ts` + mapear rutas webp en `github.ts` (sin images para portafolio-personal). Commit: `504007b`.
- T3 (S1,S4,S5): hover preview flotante en ProjectCard (solo hover + fine pointer; gate matchMedia, position via CSS vars). Commit: `f97b8f5`.
- T4 (S1,S4): lightbox modal con galería prev/next, Esc/flechas, overlay click, focus trap + focus return, scroll lock, reduced-motion sin animación. Commit: `f97b8f5`.
- T5 (S3): scroll progress 2px accent bajo el header sticky. Commit: `39aac97`.
- T6 (S3): timeline draw-in en Experiencia (línea accent scaleY por scroll + Reveal por item). Commit: `c4c9741`.
- T7 (S3): parallax sutil en Hero (capas grid/fondo/texto, ≤10px, transform-only). Commit: `7fbe599`.
- T8 (S1-S5): tests RED→GREEN por regla (17 nuevos), suite 95 pass/4 skip, tsc 0, lint 0 errores, build OK, smoke SSR marcadores + assets webp 200. Pendiente: revisión visual del usuario antes de push.
- T9 (S7): ProjectShowcase sticky desktop (panel con imagen activa fade-in por cambio de proyecto activo vía scroll-centro) + botón que abre el lightbox existente. Commit: `324c282`.
- T10 (S6,S7): mobile inline: imagen de tapa por card con reveal on-scroll. Commit: `324c282`.
- T10b (S1): capturas del propio portafolio via `scripts/capture-portfolio-shots.mjs` (puppeteer-core + Chrome del sistema, server producción en 3050) para "Portafolio personal" + webp. Commit: `f2e8833`.
- T11 (S6): remover FloatingPreview + plumbing de pointer en ProjectCard/ProjectList y su test (descartado por S6). Commit: `324c282`.
- T12 (S6,S7,S4): RED→GREEN (showcase activo por stub de rects, panel a mobile, reduced-motion), suite 100 pass/4 skip, tsc 0, lint 0, build OK, smoke SSR (panel + hooks presentes, hover flotante ausente). Pendiente: revisión visual del usuario antes de merge/push.

## Log

- L1: User: "busca lo teniamos anterior mente hazme un resumen proponme mejoras de animacion yo tengo una en mente como una vista previa de los proyectos con imagenes  y con esta dos skill https://github.com/elayadesign/ai-design-skills - https://github.com/oso95/scroll-world pero antes dame tus propuestas sin hacer nada"
- L2: Usuario eligió opción "Combo completo (value: combo)".
- L3: User: "Deje las imagenes dentro de la carpeta /img recuerda que debemos optimizarla a .webp" (arranque autorizado; imágenes: FITBOX×6, SGDI×4, TALLER.BY×5, PNG).
- L4: Decisión: portafolio-personal no tiene capturas → sin preview (S5); usuario puede sumarla después.
- L5: Verificación end-to-end del branch feat/portfolio-motion: 6 commits work-unit (145a52b assets, 504007b data, f97b8f5 preview, 39aac97 progress, c4c9741 timeline, 7fbe599 parallax). RAW PNG de /img quedan sin trackear (los webp optimizados son los assets del repo).
- L6: User: "sinceramente no me gusto nada lo de la imagen que podemos hacer porpuesta mas animadas/interactivas que tenga animacion quando hacemos scroll - li idea de las imagen es que tenga una vista previa" → T3 (hover flotante) queda descartado; S6/S7/T9-T12 agregados.
- L7: Usuario eligió "A — Showcase sticky" de 4 propuestas (A sticky showcase, B cards expanden con view-timeline, C cinta horizontal, D focus-scroll suave).
- L8: Pruebas de integración ajustadas al showcase: lookups por hooks `data-project-id`/`data-project-card` (el chip del panel duplica títulos); panel previews `previewable[0]` = taller.by al no haber scroll en jsdom.
- L9: Los 4 featured ahora tienen capturas; previewable[0] pasa a Portafolio personal (sortOrder -100); tests de panel default y dedupe actualizados (contar por data-project-id, no por texto).
- L10: Aprobación del usuario: "bello me gusto mucho" (showcase sticky OK). Pidió: capturas del portafolio + optimizar .webp + montarlas, luego reporte y decidir deploy.
- L11: Fixes iterativos con feedback visual del usuario: lightbox fit (2a7c51e), scrollspy de lectura + retract (38a042d), hold mientras la lista visible (26616b5).
- L12: User: "vamos subelo a la version de diploy - lanza un subagente que valla actualizando la documentacion en github comitea - pull  y terminamos" — autorización de merge a master + push (deploy Vercel) + docs por subagente.
- L13: User reportó (captura producción): al abrir "Vista previa" el diálogo quedaba medio fuera de pantalla. Diagnóstico con repro headless (scripts/repro-lightbox.mjs): computed top:50% = 726px — el wrapper Reveal de la sección (ancestro con transform) captura los fixed descendants por spec CSS y el diálogo se centraba contra la SECCIÓN. Fix: portal a document.body (cdbb5be, top pasó a 450px real); verificado en producción.
