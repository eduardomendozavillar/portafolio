"use client";

import { useEffect, useId, useRef, useState } from "react";
import { socials } from "@/data/socials";
import { featuredGitHubProjects } from "@/data/github";

/**
 * Email copied by the "Copiar email" action. The profile data module has no
 * email field, so it is pinned here (same address as the repository author).
 */
const PROFILE_EMAIL = "eduardomendozavillar@gmail.com";

type PaletteAction = {
  id: string;
  title: string;
  /** Lowercase extra terms matched together with the title. */
  keywords: string[];
  group: "Navegación" | "Proyectos" | "Contacto";
  hint?: string;
  run: () => void;
};

/** Section anchors — the same ids the header nav links to. */
const SECTIONS = [
  { label: "Sobre mí", id: "sobre-mi", keywords: ["about"] },
  { label: "Proyectos", id: "proyectos", keywords: ["projects"] },
  { label: "Habilidades", id: "habilidades", keywords: ["skills"] },
  { label: "Experiencia", id: "experiencia", keywords: ["work"] },
  { label: "Educación", id: "educacion", keywords: ["education"] },
  { label: "Contacto", id: "contacto", keywords: ["contact"] },
] as const;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Smooth-scrolls to an anchor id (auto instead of smooth under reduced motion). */
function scrollToId(id: string) {
  const target = document.getElementById(id);
  target?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

/**
 * Opens an external profile URL via a temporary anchor with target="_blank",
 * matching the header/footer external-link pattern (https + trusted host
 * validated before navigation).
 */
const TRUSTED_PROFILE_HOSTS = new Set(["github.com", "www.linkedin.com"]);

function openExternal(url: string) {
  const parsed = new URL(url, window.location.href);
  if (parsed.protocol !== "https:" || !TRUSTED_PROFILE_HOSTS.has(parsed.hostname)) {
    return;
  }
  const anchor = document.createElement("a");
  anchor.href = parsed.href;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/**
 * Recruiter-facing command palette (Circuit Night refinement): quiet hairline
 * dialog opened with Ctrl+K / ⌘K or the header trigger. Fully keyboard
 * operable — search filter, ↑/↓ to move, Enter/click to execute, Esc to close
 * with focus returned to the trigger, focus trapped while open, body scroll
 * locked, no animation under prefers-reduced-motion. Controlled by the header
 * (single source of truth for the open state).
 */
export function CommandPalette({
  open,
  onOpen,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [reducedMotion, setReducedMotion] = useState(() => prefersReducedMotion());
  const [entered, setEntered] = useState(false);
  const titleId = useId();
  const wasOpen = useRef(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener?.("change", onChange);
    return () => mediaQuery.removeEventListener?.("change", onChange);
  }, []);

  /** Global shortcut: Ctrl+K / ⌘K opens the palette. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpen();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpen]);

  /** Restore focus to the trigger after a real open→close cycle (not on mount). */
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      if (!reducedMotion) {
        // Async so the fade/scale transition has a starting frame to run from.
        const raf = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(raf);
      }
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
    const raf = requestAnimationFrame(() => setEntered(false));
    return () => cancelAnimationFrame(raf);
  }, [open, reducedMotion, triggerRef]);

  /** Body scroll lock while the palette is open. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /** Close on Escape; focus restoration happens in the open/close effect. */
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  const overlayClasses = reducedMotion
    ? "fixed inset-0 z-[60] bg-paper/80 backdrop-blur-sm"
    : `fixed inset-0 z-[60] bg-paper/80 backdrop-blur-sm transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`;
  const dialogClasses = reducedMotion
    ? "fixed left-1/2 top-24 z-[61] w-[min(92vw,34rem)] -translate-x-1/2 rounded-md border border-line bg-paper-raised shadow-2xl"
    : `fixed left-1/2 top-24 z-[61] w-[min(92vw,34rem)] -translate-x-1/2 rounded-md border border-line bg-paper-raised shadow-2xl transition-[opacity,transform] duration-200 ${
        entered ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
      }`;

  return (
    <div
      className={overlayClasses}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <PaletteDialog
        titleId={titleId}
        className={dialogClasses}
      />
    </div>
  );
}

/**
 * Dialog body — remounted on every open so query, active option and copy
 * feedback reset naturally without effect-driven state resets.
 */
function PaletteDialog({
  titleId,
  className,
}: {
  titleId: string;
  className: string;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const actions: PaletteAction[] = [
    ...SECTIONS.map((section) => ({
      id: `seccion-${section.id}`,
      title: section.label,
      keywords: [...section.keywords, "sección", "ir a"],
      group: "Navegación" as const,
      hint: "Sección",
      run: () => scrollToId(section.id),
    })),
    ...featuredGitHubProjects
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((project) => ({
        id: `proyecto-${project.id}`,
        title: project.title,
        keywords: [...project.technologies, project.slug ?? "", "proyecto"],
        group: "Proyectos" as const,
        hint: "Proyecto destacado",
        run: () => {
          const section = document.getElementById("proyectos");
          const heading = section
            ? Array.from(section.querySelectorAll("h3")).find(
                (candidate) => candidate.textContent?.trim() === project.title,
              )
            : null;
          (heading?.closest("li") ?? section)?.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
          });
        },
      })),
    {
      id: "copiar-email",
      title: "Copiar email",
      keywords: ["copiar", "correo", "contacto", "email"],
      group: "Contacto",
      hint: PROFILE_EMAIL,
      run: () => {
        navigator.clipboard?.writeText(PROFILE_EMAIL).then(() => {
          setCopied(true);
          // The dialog remounts per open, so no timer cleanup is needed.
          window.setTimeout(() => setCopied(false), 2000);
        });
      },
    },
    ...socials.map((social) => ({
      id: `abrir-${social.platform}`,
      title: `Abrir ${social.label}`,
      keywords: [social.platform, social.label.toLowerCase(), "perfil"],
      group: "Contacto" as const,
      hint: social.href,
      run: () => openExternal(social.href),
    })),
  ];

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? actions.filter((action) =>
        `${action.title} ${action.keywords.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : actions;
  const activeOption = filtered[Math.min(activeIndex, Math.max(filtered.length - 1, 0))];

  /** Focus the search input when the dialog mounts (fresh open). */
  const autoFocusRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    autoFocusRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={className}
      onKeyDown={(event) => {
        const container = event.currentTarget;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          if (filtered.length === 0) return;
          const delta = event.key === "ArrowDown" ? 1 : -1;
          const next =
            (activeIndex + delta + filtered.length) % filtered.length;
          setActiveIndex(next);
          container
            .querySelector<HTMLButtonElement>(`[data-option-index="${next}"]`)
            ?.focus();
          return;
        }
        if (event.key === "Enter" && activeOption) {
          event.preventDefault();
          activeOption.run();
          return;
        }
        if (event.key === "Tab") {
          const focusables = container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }}
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
        <h2
          id={titleId}
          className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Navegación rápida
        </h2>
        <p className="text-xs text-ink-muted" aria-hidden="true">
          <kbd className="rounded border border-line px-1.5 py-0.5 font-sans text-[11px]">
            Esc
          </kbd>{" "}
          para cerrar
        </p>
      </div>

      <div className="border-b border-line px-5 py-3">
        <input
          ref={autoFocusRef}
          type="text"
          aria-label="Buscar sección o proyecto"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          placeholder="Buscar sección o proyecto…"
          className="w-full bg-transparent text-base text-ink placeholder:text-ink-muted focus:outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p role="status" className="px-5 py-6 text-sm text-ink-muted">
          Sin resultados para «{query.trim()}».
        </p>
      ) : (
        <ul
          aria-label="Acciones disponibles"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {filtered.map((action, index) => {
            const isActive = action.id === activeOption?.id;
            return (
              <li key={action.id}>
                {action.group !== filtered[index - 1]?.group ? (
                  <p
                    aria-hidden="true"
                    className="px-5 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted"
                  >
                    {action.group}
                  </p>
                ) : null}
                <button
                  data-option-index={index}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    action.run();
                  }}
                  className={`flex w-full items-center justify-between gap-4 px-5 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-accent-soft text-accent"
                      : "text-ink hover:bg-accent-soft hover:text-accent"
                  }`}
                >
                  <span className="truncate font-medium">{action.title}</span>
                  {copied && action.id === "copiar-email" ? (
                    <span className="shrink-0 text-xs font-medium text-accent">
                      Copiado ✓
                    </span>
                  ) : action.hint ? (
                    <span
                      aria-hidden="true"
                      className="shrink-0 truncate text-xs text-ink-muted"
                    >
                      {action.hint}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
