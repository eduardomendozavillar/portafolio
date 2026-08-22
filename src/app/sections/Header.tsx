"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

/** Anchor links shared by the desktop nav and the mobile menu. */
const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Educación", href: "#educacion" },
  { label: "Contacto", href: "#contacto" },
] as const;

/**
 * Sticky header: brand + desktop anchor nav + Contacto CTA + accessible
 * mobile menu (Escape closes and returns focus; body scroll locks while open).
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 md:gap-6">
        <a
          href="#inicio"
          className="shrink-0 font-display text-lg font-semibold text-ink"
        >
          {profile.name}
          <span className="text-accent">.</span>
        </a>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-5 text-sm font-medium text-ink-muted lg:gap-6">
            {NAV_LINKS.filter((link) => link.href !== "#contacto").map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-4 md:flex">
          <ul className="hidden items-center gap-4 text-sm font-medium text-ink-muted lg:flex">
            {socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="#contacto" className="!px-4 !py-2 text-sm">
            Contacto
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="rounded-md p-2 text-ink md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
        >
          <span aria-hidden="true" className="block h-4 w-5">
            <span
              className={`block h-0.5 w-full bg-current transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`mt-[5px] block h-0.5 w-full bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`mt-[5px] block h-0.5 w-full bg-current transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </Container>

      {open ? (
        <nav
          id={menuId}
          aria-label="Navegación principal"
          className="border-t border-line bg-paper md:hidden"
        >
          <Container className="flex flex-col py-4">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base font-medium text-ink transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex gap-6 text-sm font-medium text-ink-muted">
              {socials.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="transition-colors hover:text-accent"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
