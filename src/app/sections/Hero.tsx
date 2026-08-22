import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

/** Phrase in the thesis line rendered in accent (hero signature). */
const EMPHASIS_PHRASE = "inteligencia artificial";

const HERO_STACK = ["Next.js", "RAG", "TypeScript", "Vercel"] as const;

/**
 * Hero-as-thesis (Circuit Night): photo + role, name, cyan emphasis,
 * CTAs, socials, and stack chips — recruiter-scannable in one viewport.
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

  return (
    <section id="inicio" className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_15%_-5%,rgba(34,211,238,0.08),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(30,41,59,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.4)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_80%)]"
      />

      <Container className="relative py-16 md:py-24 lg:py-28">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">
          <div className="shrink-0">
            <div className="relative h-36 w-36 overflow-hidden rounded-full ring-2 ring-accent/30 sm:h-44 sm:w-44 md:h-52 md:w-52 lg:h-56 lg:w-56">
              <Image
                src="/images/profile.webp"
                alt={`Foto de perfil de ${profile.name}`}
                width={800}
                height={800}
                priority
                sizes="(max-width: 768px) 176px, 224px"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
              {profile.role}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight leading-[1.08] text-ink sm:text-5xl md:text-6xl lg:text-7xl">
              {profile.name}
            </h1>
            <div className="mt-6 md:border-l-2 md:border-accent md:pl-6">
              <p className="mx-auto max-w-2xl text-base leading-7 text-ink-muted md:mx-0 md:text-lg md:leading-8">
                {before}
                {emphasisIndex >= 0 ? (
                  <em className="font-display not-italic font-medium text-accent">
                    {EMPHASIS_PHRASE}
                  </em>
                ) : null}
                {after}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button href="#proyectos">Ver proyectos</Button>
              <Button href="#contacto" variant="outline">
                Contáctame
              </Button>
              <ul className="flex items-center gap-4 text-sm font-medium text-ink-muted sm:ml-2">
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

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              {HERO_STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
