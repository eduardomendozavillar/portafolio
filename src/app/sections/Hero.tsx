import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";

/** Phrase in the thesis line rendered in italic accent (hero signature). */
const EMPHASIS_PHRASE = "inteligencia artificial";

/**
 * Hero-as-thesis: role eyebrow, full name, and a thesis line with one
 * italic accent phrase over a vertical accent rule on md+.
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
    <section id="inicio" className="border-b border-line">
      <Container className="py-28 md:py-40">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {profile.role}
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-ink md:text-7xl">
          {profile.name}
        </h1>
        <div className="mt-8 md:border-l-2 md:border-accent md:pl-8">
          <p className="max-w-2xl text-lg leading-8 text-ink-muted md:text-xl">
            {before}
            {emphasisIndex >= 0 ? (
              <em className="font-display italic text-accent">
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
