import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { profile } from "@/data/profile";

/** Hero: name, role eyebrow, tagline and calls to action. */
export function Hero() {
  return (
    <section id="inicio" className="border-b border-line">
      <Container className="py-24 md:py-36">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
          {profile.role}
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-ink md:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted md:text-xl">
          {profile.tagline}
        </p>
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