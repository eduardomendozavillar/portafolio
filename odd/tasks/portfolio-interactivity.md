# Feature: portfolio-interactivity — Recruiter-facing interactivity

**Created**: 2026-10-03 · **Branch**: master (repo convention: single-branch, auto-deploy on push)
**Goal**: Make the portfolio more interactive for recruiters without losing the Circuit Night
editorial tone or the quality floor (Lighthouse ≥90, WCAG, reduced-motion).

**Scope decided with user (2026-10-03)**:

1. Command palette (Ctrl+K / ⌘K) — signature piece. Keyboard + visible affordance.
2. Tech-chip filter in Proyectos — click a technology chip to filter featured projects.
3. Subtle cursor micro-interactions — magnetic hover on hero primary CTA + card lift.
   Explicitly NOT a custom cursor / cursor trails (cliché, gimmicky).

**Out of scope (PRODUCT.md/DESIGN.md guardrails)**: theme toggle, multi-page/blog,
rebrand of Circuit Night, CV PDF download (no asset exists), skill percentage bars.

## Tasks


### WU-A: Command palette
- [ ] `src/components/CommandPalette.tsx` (new, client component): dialog (role=dialog,
  aria-modal, focus trap, Esc closes, Ctrl+K/⌘K toggles), fuzzy-ish filter by typed text,
  keyboard ↑/↓ + Enter, mouse click.
  - Actions: jump to sections (Sobre mí, Proyectos, Habilidades, Experiencia, Educación,
    Contacto) via smooth scroll to existing anchors; jump to each featured project card;
    copy email to clipboard; open GitHub + LinkedIn profiles.
  - Data from existing modules: NAV links/anchors, `featuredGitHubProjects`, profile data.
- [ ] Visible affordance: subtle `Ctrl K` / `⌘K` hint button in Header (operable, aria-haspopup).
- [ ] Mount in page/layout.
- [ ] RTL tests: open/close via shortcut + button, filter list, navigate action, copy email
  (mocked clipboard), Esc + focus return. Respect `prefers-reduced-motion`.
- [ ] Gates: tsc, vitest focused, lint, build.

### WU-B: Tech-chip filter + WHOLE-PAGE micro-interactions

Scope clarified by user (2026-10-03): interactivity applies to the ENTIRE portfolio page.

- [ ] Proyectos: toggle chips from union of featured projects' technologies
  (aria-pressed, keyboard operable, "Todas" reset). Non-matching cards attenuate
  (dimmed, not hidden). Single-select toggle semantics.
- [ ] Whole-page scroll reveals: subtle fade/rise entrance per section block
  (IntersectionObserver-based client `Reveal` wrapper, ≤200ms, once-only), applied to
  Hero, Sobre mí, Habilidades, Experiencia, Educación, Proyectos, Contacto.
  Fully disabled under prefers-reduced-motion (content always visible; no layout shift,
  no CLS: reveal only animates opacity/transform after paint).
- [ ] Cursor micro-interactions: magnetic hover on hero primary CTA (max 2-3px
  translate, fine pointer + hover:hover only, no effect under reduced-motion);
  subtle lift on ProjectCard hover; quiet hover accents on skill chips and
  Experiencia/Educación timeline items (existing tokens only).
- [ ] RTL tests for filter behavior; globals.css additions under reduced-motion guard.
- [ ] Gates: tsc, vitest, lint, build.

### Close
- [ ] Local visual smoke (dev server) — user reviews before any push.
- [ ] Work-unit commits (Conventional Commits). Push to production only on user decision.
- [ ] Engram update + session summary.

## Evidence
- Commit `d375435` — WU-A: command palette (13/13 focused tests, gates green)
- Commit `1dce646` — WU-B: whole-page interactivity (26/26 focused tests, verifier PASS: tsc, 78 pass/4 skip, lint 0 errors, build OK)
- Verifier minors (accepted): misleading comment in Reveal.tsx (SSR emits reveal-hidden), threshold 0.15 unreachable on ultra-short viewports, palette search input outline-none (house style), page.tsx trailing newline (pre-existing).
