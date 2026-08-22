import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";

/** Phrase in the thesis line rendered in accent (hero signature). */
const EMPHASIS_PHRASE = "inteligencia artificial";

/**
 * Hero-as-thesis (Circuit Night): role eyebrow, full name, cyan emphasis,
 * and a soft signal glow behind the headline — restrained, not neon overload.
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
      {/* Ambient signal — decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(34,211,238,0.12),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(30,41,59,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.45)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_85%)]"
      />

      <Container className="relative py-28 md:py-40">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {profile.role}
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold tracking-tight leading-[1.05] text-ink md:text-7xl">
          {profile.name}
        </h1>
        <div className="mt-8 md:border-l-2 md:border-accent md:pl-8">
          <p className="max-w-2xl text-lg leading-8 text-ink-muted md:text-xl">
            {before}
            {emphasisIndex >= 0 ? (
              <em className="font-display not-italic font-medium text-accent">
                {EMPHASIS_PHRASE}
              </em>
            ) : null}
            {after}
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#proyectos">Ver proyectos</Button>
          <Button href="#contacto" variant="outline">
            Contáctame
          </Button>
        </div>
      </Container>
    </section>
  );
}
