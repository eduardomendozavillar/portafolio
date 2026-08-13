# Archive — portfolio-visual-content-v2 (2026-08-12)

Cambio SDD **cerrado**: evolución visual editorial + contenido CV real + links de
redes corregidos. Artefacto de cierre completo (con evidencia y linaje) en Engram:
`topic_key sdd/portfolio-visual-content-v2/archive-report` (observation #43).

## Resumen

- **WU1 — Verdad de contenido + metadata**: CV real en `src/data/{profile,experience,education,skills,socials}.ts`,
  metadata en `src/app/layout.tsx`, sin PII. Commits `9cc11f1` + `a534cf3`.
- **WU2 — Evolución visual**: tokens en `globals.css` (acento `#0b5f57`), hero-as-thesis,
  pulido de secciones y primitivas (Button, SectionHeading, ProjectCard, ContactForm,
  incl. fix de drift en ProjectList). Commits `d0c61a4` + `5277d8d`.
- 4/4 commits pusheados a `origin/master`; HEAD `5277d8d` == `origin/master` (sincronizado).

## Verificación (verify-report #42 — PASS WITH WARNINGS)

- Requisitos 5/5, escenarios 10/10.
- `npm test` exit 0 (55 passed / 4 skipped), `lint` 0, `typecheck` 0, `build` 0.
- Producción https://portafolio-psi-five-95.vercel.app sirve el HEAD verificado
  (re-corroborado en el cierre: HTTP 200, tagline v2, nombre real, categoría
  "Inteligencia artificial", URLs exactas de GitHub/LinkedIn).
- Integración GitHub–Vercel completa: `productionBranch=master`, auto-deploy verificado.

## Pendientes (follow-ups, no bloqueantes)

1. No hay tests DOM automatizados para socials/hero — considerar tests de componente
   que afirmen hrefs exactos, `target="_blank"` y tesis del hero.
2. Lighthouse móvil ≥90 (perf/a11y/SEO) sin re-medir para v2.
3. Archivo fantasma `opencode ` (con espacio final): untracked y **no** efectivamente
   ignorado (el patrón de `.gitignore` pierde el espacio final). Limpiar y ajustar el patrón.
4. Rama huérfana `main` sigue siendo default en GitHub (borrado bloqueado por permisos).
5. Rotar tokens expuestos en chat.

## Linaje de artefactos (Engram, proyecto `portafolio`)

explore #32 → proposal #34 → spec #35 → design #36 → tasks #37 → apply-progress #39
→ verify-report #42 → archive-report #43. Store: engram (sin carpeta OpenSpec para este cambio).
