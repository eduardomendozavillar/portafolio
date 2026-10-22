# Feature: portfolio-recruiter (boseto)

Boseto de prueba: adoptar lo bueno del portfolio de Ali (análisis obs + capturas) + ejecutar el plan `inf_portafolio` (obs #150). Base: Circuit Night intacto, sin naranja ni 13k-px, sin form estático.

## Specs

- S1: User: "hagamos un boseto de prueba busca la nueva infromacion en engram  inf_portafolio - deje el pdf en la carpeta img claro tomando lo bueno desechando lo malo segun lo que ya tenemos mira que el momento en el que carga la pagina ... se ve genial entonces miremos que podemos hacer"
- S2: Decisión (choice): "Splash de carga bloqueante" — overlay con avatar+nombre+barra ~1s, primera visita, skipeable.
- S3: Decisión (choice): FitBox "Quitarlo (espejar el CV)".
- S4: Plan inf_portafolio (obs #150): ficha Optimizador de Excel — id `github-optimizador`, status development, sin links (repo privado), technologies ["Node.js","Fastify","better-sqlite3","React","Vite","Tailwind CSS"], summary/description del plan verbatim.
- S5: Salvaguardas: splash oculto sin JS (noscript) y bajo `prefers-reduced-motion`; primera visita (sessionStorage); nunca bloquea el SSR real.
- S6: CV en PDF: `img/CV_Eduardo_Mendoza_Ingeniero_IA.pdf` → descargable desde hero, contacto y palette.
- S7: Sin PII institucional ni credenciales en textos (plan #150). Sin teléfono/PII público (floor v2).
- S8: User: "recuerda que debe concondar con el cv" — todo el contenido del sitio debe espejar el CV v2 (img/CV_Eduardo_Mendoza_Ingeniero_IA.pdf): skills, about, experience, education.
- S9: User: "recuerda tambien nada de vibe coding" — el chip "Vibe Coding" se elimina del sitio.

## Tasks

- T1 (S3,S4): `github.ts`: quitar FitBox, agregar Optimizador (sortOrder -60, sin images → S5 portfolio-motion: sin preview). Actualizar tests dependientes (union de chips). Commit: pendiente.
- T2 (S2,S5): `IntroSplash` SSR + inline-script anti-flash + sessionStorage + reduced-motion/noscript; portal no requerido (nivel page). Commit: pendiente.
- T3 (S6): copiar PDF a `public/` + botón "Descargar CV" (hero + contacto + acción palette con `<a download>`). Commit: pendiente.
- T4: header scrollspy (nav activa en accent) + CTA "Contratame" → #contacto + indicador disponibilidad en hero (punto verde pulsante). Commit: `9d8ecad`.
- T6 (S8,S9): alinear src/data/{skills,profile,experience,education}.ts con el CV v2 leído: quitar "Spring Framework" (no está en el CV), quitar "Vibe Coding", quitar fila "Mantenimiento 2019—2021" (no está en el CV), quitar secundaria; agregar SQL/Next.js/HTML-CSS/Express/Fastify/APIs REST/MCP/Skills/Vercel/CLI/Vitest/E2E; role "Especialización en IA (en curso)"; about con perfil verbatim del CV. Commit: pendiente.
- T5 (S1-S7): RED→GREEN tests, suite+tsc+lint+build, Lighthouse móvil re-medido (gate ≥90), revisión visual del usuario.

## Log

- L1: User: "recomiendas que usememos esto para mejorar el portafolio no hagamos nada solo mieremos que podemos el alcance que podemos tener ? https://www.npmjs.com/package/framer-motion - https://github.com/nextlevelbuilder/ui-ux-pro-max-skill - https://icons8.com/mcp/#how-to-use" → veredicto: nada de las tres por ahora (framer-motion solo si hay gesto/layout; simple-icons/lucide en vez de Icons8).
- L2: User: "puedes analisar esta pagina como me tal me gusta la mia pero puedes revisar y darme algunas suerencias https://ali-portfolio-nine.vercel.app/" → análisis con peek-site.mjs: adoptables CV download, Hire Me, certificados, disponibilidad, iconos; no copiables: 13k px, form estático, Inter genérico.
- L3: User: "hagamos un boseto de prueba ... deje el pdf en la carpeta img ... el momento en el que carga la pagina se ve genial" → feature creada; decisiones: quitar FitBox + splash bloqueante.
- L4: User: "recuerda que debe concondar con el cv - recuerda tambien nada de vibe coding" → CV leído con pdftotext; S8/S9/T6 agregados; hallazgo: skills.ts tenía "Spring Framework" y "Vibe Coding" inventados; experience.ts tenía una fila sin soporte en el CV.
