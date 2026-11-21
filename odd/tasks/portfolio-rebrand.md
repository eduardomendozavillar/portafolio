# Feature: portfolio-rebrand

Rebrand completo de la interfaz (decisión del usuario tras análisis de referencias): paleta, tipografía y estructura — sin tocar la información (CV v2 verbatim) ni las features (splash, showcase, lightbox, palette, scrollspy se conservan y solo cambian de piel).

## Specs

- S1: User: "quiero restructurar todo quiero un portafolio profecinal que tenga mi estilo con esto quiero desirte que vamos cambiar toda la interfas grafica todo aun que el inicio me gusta vamos a cambiar tipo de letra todo".
- S2: Paleta aprobada (captura barber): Charcoal Black `#1C1C1C`, Bone White `#EDE6E0`, Barber Red `#B32B1E` como accent único. Violeta `#8B5CF6` SOLO en el card heatmap (captura Andrea).
- S3: Tipografía aprobada: **Anton** (display) + **Manrope** (body).
- S4: Hero: "con nuevo accent" (composición/foto intactas, cyan → red).
- S5: Estructura inspirada en Marco Lagunes (eyebrows `//`, chips de estado) SIN copiar su contenido ni look genérico.
- S6: Nueva sección `// certificaciones`: 4 destacadas del CV + expandible "ver todas" (17 links proveídos por el usuario; DataCamp/certs365 con etiqueta genérica o título por confirmar).
- S7: Heatmap de actividad con datos GitHub reales (contributions públicas, parse del perfil sin auth; fallback graceful si GitHub no responde).
- S8: Nada de PII público (sin teléfono); ubicación ciudad OK.
- S9: Tests y Lighthouse ≥90 en cada slice; revisión visual del usuario antes de push.

## Decisions (ask_user)

- D1: Hero "con nuevo accent" (no intacto-cyan).
- D2: Tipografía "Anton + Manrope".
- D3: Heatmap "Sí, con datos GitHub".

## Tasks

- T1 (S2,S3): tokens globales en `globals.css` (mismos nombres semánticos → nuevos valores) + Anton/Manrope en `layout.tsx`; hero radial cyan → red. Commit: `8246733` (dirección 01) retokenizado a 02 en `fec9193`.
- T2 (S5): header/nav/brand + splash restyle (heredan tokens) + chip estado en hero. Commit: `8653dc5` (título gradiente violeta→cyan, nav pill activa, barras con gradiente).
- T3 (S5): secciones restyle + eyebrows `//` cyan mono (SectionHeading) + cards glass + lightbox/palette rounded-2xl blur. Commits: `e815778` + fix `cb671ad`.
- T4 (S6): `src/data/certificates.ts` (18 items: 4 featured del CV + 14 en expandible) + sección `// certificaciones` con `<details>` nativo, nav y palette actualizadas. Commit: `8e6779d`.
- T5 (S7): heatmap con datos REALES via `gh` CLI GraphQL (82 contribuciones, 19 días activos → src/data/contributions.ts generado por scripts/fetch-contributions.mjs; sin tokens en la app). Commit: `ddadfb3`.
- T6 (S9): gates por slice + Lighthouse móvil ≥90 + revisión visual del usuario + push (decisión del usuario).

## Log

- L1: User: "quiero restructurar todo... vamos a cambiar toda la interfas grafica todo aun que el inicio me gusta vamos a cambiar tipo de letra todo" + capturas (Andrea dashboard, paleta barber) + ref Marco Lagunes. "hablemos aun no hagas nada".
- L2: Propuesta y decisiones (ask_user): D1 hero con nuevo accent, D2 Anton+Manrope, D3 heatmap sí/datos GitHub.
- L3: User: links de 17 certificaciones; 8 resueltos por fetch (5 Certificados IT, 2 Coursera Google, 1 midudev SQL), 8 bloqueados por Cloudflare (DataCamp ×7, certs365 ×1) → etiquetas genéricas aprobadas implícitamente con "dale papu".
- L4: User: "dale papu" → arranque autorizado. Design system sync ejecutado (design/system.md desde globals.css, legacy Circuit Night); artboard dirección en design/rebrand/01-home.html.
- L5: User: "ojo papu tambien podemos usar gentle-dising para mejor el diseño" → flujo gentle-design: canvas abierto con el artboard para aprobación visual antes de los slices de código.
- L6: User rechazó la dirección 01 ("igual no me gustó") y el modo comentar del canvas falló en su navegador (bug del botón del tool; workaround verificado: tecla C + clic — probado en headless). Agregadas alternativas 02 (neon dashboard) y 03 (bone poster); usuario eligió 02.
- L7: Dirección final: near-black #0B0B0F, violeta #8B5CF6 (accent), cyan #22D3EE (eyebrows), rojo #B32B1E SOLO CTAs. T1b `fec9193`, T2 `8653dc5`, T3 `e815778`+`cb671ad`, T4 `8e6779d`, T5 `ddadfb3`.
- L8: Gates del rebrand: suite 122/4, tsc 0, build OK, Lighthouse móvil local 92/96/100/100, LCP 1164ms, CLS 0.000. Nota: a11y 100→96 por contraste del texto tenue (rgba .55) — pasa el gate ≥90; opcional subir contraste después.
