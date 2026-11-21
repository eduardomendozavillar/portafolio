"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

/** Phrase in the thesis line rendered in accent (hero signature). */
const EMPHASIS_PHRASE = "inteligencia artificial";

/**
 * Hero (portfolio-rebrand 06, Marco-style · red edition): split layout —
 * identity block on the left (status chip, two-line poster name, role rule,
 * thesis, CTAs, socials) and the photo dial + whoami terminal on the right.
 * Palette and structure come from design/rebrand/06-marco-red.html; the
 * information stays CV-verbatim.
 */
export function Hero() {
  const emphasisIndex = profile.tagline.indexOf(EMPHASIS_PHRASE);
  const [before, after] =
    emphasisIndex >= 0
      ? [
          profile.tagline.slice(0, emphasisIndex),
          profile.tagline.slice(emphasisIndex + EMPHASIS_PHRASE.length),
        ]
      : [profile.tagline, ""];
  const nameWords = profile.name.split(" ");
  const nameHead = nameWords.slice(0, -1).join(" ");
  const nameTail = nameWords.at(-1) ?? "";

  return (
    <section id="inicio" className="relative overflow-hidden border-b border-line">
      <Container className="relative py-20 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="order-2 lg:order-1">
            <p
              data-availability="true"
              data-status-chip="true"
              className="inline-flex items-center gap-2 border-2 border-accent px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-ink"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_3px_rgba(237,106,91,0.22)]"
              />
              Disponible para nuevas oportunidades
            </p>

            <h1 className="mt-6 font-display text-[clamp(56px,9vw,110px)] font-normal uppercase leading-[0.9] tracking-[0.01em]">
              <span className="block bg-gradient-to-b from-white via-ink to-ink/30 bg-clip-text text-transparent">
                {nameHead}{" "}
              </span>
              <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-ink)]">
                {nameTail}
              </span>
            </h1>

            <p className="mt-6 flex items-center gap-3 font-mono text-[12.5px] uppercase tracking-[0.16em] text-accent">
              <span aria-hidden="true" className="inline-block h-0.5 w-8 bg-accent" />
              {profile.role}
            </p>

            <p className="mt-5 max-w-[480px] text-lg font-extrabold leading-snug text-ink">
              {before}
              {emphasisIndex >= 0 ? (
                <em className="font-display font-normal not-italic text-accent">
                  {EMPHASIS_PHRASE}
                </em>
              ) : null}
              {after}
            </p>

            <p className="mt-4 max-w-[520px] text-[14.5px] leading-7 text-ink-muted">
              Experiencia construyendo y desplegando aplicaciones web full-stack,
              incluido un sistema de gestión documental institucional (SGDI)
              desarrollado de forma personal. Aplico Spec-Driven Development y
              pruebas automatizadas.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#proyectos">Ver proyectos</Button>
              <Button
                href="/CV_Eduardo_Mendoza_Ingeniero_IA.pdf"
                variant="outline"
                download="CV_Eduardo_Mendoza_Ingeniero_IA.pdf"
              >
                ⬇ Descargar CV
              </Button>
              <Button href="#contacto" variant="outline" className="bg-black">
                Contactarme
              </Button>
              <ul className="ml-2 flex items-center gap-4 text-sm font-medium text-ink-muted">
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
            </div>
          </div>

          <div className="order-1 flex flex-col items-center gap-7 lg:order-2">
            <div className="dial relative mx-auto aspect-square w-full max-w-[360px]">
              <span aria-hidden="true" className="dial-ring" />
              <span aria-hidden="true" className="dial-arc" />
              <span aria-hidden="true" className="dial-glow" />
              <Image
                src="/images/profile.webp"
                alt={`Foto de perfil de ${profile.name}`}
                width={360}
                height={360}
                sizes="(min-width: 1024px) 292px, 80vw"
                className="absolute inset-[34px] h-[calc(100%-68px)] w-[calc(100%-68px)] rounded-full object-cover [filter:saturate(0.88)_contrast(1.08)]"
              />
            </div>

            <div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-line bg-black/35">
              <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-line" />
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-line" />
                <span className="ml-2 font-mono text-xs text-ink-muted">
                  eduardo@portfolio:~
                </span>
              </div>
              <div className="px-5 py-4 font-mono text-[13.5px] leading-7">
                <p>
                  <span className="text-accent">$ whoami</span>
                </p>
                <p className="text-ink">
                  {profile.name} — Full-Stack · IA aplicada
                </p>
                <p className="mt-1.5 text-ink-muted">
                  <span className="text-accent">$</span>{" "}
                  <span className="type-caret" aria-hidden="true">
                    {" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
