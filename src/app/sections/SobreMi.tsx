import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";

/** Sobre mí: short bio paragraphs from the typed profile data. */
export function SobreMi() {
  return (
    <section id="sobre-mi" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading title="Sobre mí" />
        <div className="max-w-3xl space-y-4">
          {profile.about.map((paragraph, i) => (
            <p key={i} className="text-lg leading-8 text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
