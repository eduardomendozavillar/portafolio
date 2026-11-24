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
- S10: User: "toquemos el fondo ... llenémoslo un poco más podemos poder el logo tira un diseño solo para el fondo" → watermark "EV." gigante en outline + tira vertical del wordmark en el borde derecho, solo capa de fondo (aria-hidden, pointer-events-none). COMMIT `0f0ec3d`.
- S11: User: "vamos activar la posibilidad de cambio de idioma de inglés a español" → toggle ES/EN de TODO el sitio (decisión de alcance del usuario: sitio completo), contenido fiel al CV v2, persistente (localStorage), `es` default. Marquee (S12 implícito del reporte "esto se movía?") COMMIT `910a83b`; scrollspy por posición + orden más-trabajado-primero COMMIT `3fa0e03` (S13 del reporte "revisa la parte del scroll... ordenar los proyos con el más trabajado"); sincronía fila-panel COMMIT `95686a3`; paleta oficial exacta COMMIT `3db83a1` (S14 del reporte de auditoría); capturas del Optimizador COMMIT `542a71b`; panel cap en flujo + última sostiene COMMIT `1cdea0e`.

## Decisions (ask_user) — rebrand 06 implementación

- D4: Dirección final elegida en canvas: **06 · Marco Style · Red Edition** (comentarios del usuario aplicados sobre el artboard: iconos SVG de marca, spotlight en certificaciones, figuras wireframe de fondo, dial giratorio horario/antihorario, tiles X-Y, MCP dedupe, punto rojo en chip, SDD fuera → stack IA ODD·RDD·MCP·Skills, preview sin nombres duplicados).
- D5: Implementación M1-M5 (commits 3d2fd13→e12eca2): tokens cálidos #161310/#1C1915, BackgroundFigures + partículas, Reveal bidireccional, header/footer mono con logo EV, hero split con dial (foto real, anillo giratorio, arco, glow) + terminal whoami, Habilidades con 18 tiles BrandIcon SVG + marquee animado + FX (tilt/spotlight por delegación, reduced-motion), pcards con mini-navegador y captura real, sección Ahora, orden de página y nav tipo Marco.
- D6: Gates rebrand 06: suite 122/4, tsc 0, build OK; a11y **100** (aria-label del logo corregido); Lighthouse móvil local con varianza ±20 por carga de máquina (60-95 mismas condiciones) — el gate definitivo se mide en producción tras el push (referencia estable actual: perf 94, LCP 2.3s).
- D7: Comentario de canvas p8upcn1x (imagen Gemini para el perfil) queda ABIERTO: el archivo `Gemini_Generated_Image_x1l4csx1l4csx1l4.jpg` no llegó ni existe en disco; el artboard y el sitio usan la foto real del perfil con tratamiento poster — el swap a la imagen de Gemini es un cambio de un solo token cuando el usuario la provea.

- D1: Hero "con nuevo accent" (no intacto-cyan).
- D2: Tipografía "Anton + Manrope".
- D3: Heatmap "Sí, con datos GitHub".

## Log

- L9 (User): "bello papu solo falta que el con el scrol con cuerde" → sincronía fila-panel.
- L10 (User): "papu revisa rdd la parte del scroll con los proyectos - posicion - ubicacion con el proyecto tambien vamos a ordenar los proyos con el mas trabajado con condardando con el scroll" → S13.
- L11 (User): "esto se movia ?" (captura marquee) → el CSS del marquee nunca se commiteó → S12 fix.
- L12 (User): "sigue pausado" → diagnóstico headless: la animación corre; reduced-motion del SO del usuario las congela (comportamiento por diseño).
- L13 (User): "toquemos el fondo ... llenémoslo un poco más ... el logo tira un diseño solo para el fondo" → S10.
- L14 (User): "vamos activar la posibilidad de cambio de idioma de inglés a español" → S11, alcance: sitio completo (ask_user).

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
