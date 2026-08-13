import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

/** Experiencia: real CV entries rendered from the typed data. */
export function Experiencia() {
  return (
    <section id="experiencia" className="border-b border-line">
      <Container className="py-20 md:py-28">
        <SectionHeading index="04" title="Experiencia" />
        <ol className="max-w-3xl">
          {experience.map((item) => (
            <li
              key={`${item.company}-${item.role}`}
              className="border-t border-line py-8 first:border-t-0 md:py-10"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {item.role}
                </h3>
                <p className="text-sm text-ink-muted">{item.period}</p>
              </div>
              <p className="mt-1 text-sm font-medium text-accent">{item.company}</p>
              <p className="mt-3 leading-7 text-ink-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}