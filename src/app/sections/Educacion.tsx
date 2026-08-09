import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/data/education";

/** Educación: placeholder entries rendered from the typed data. */
export function Educacion() {
  return (
    <section id="educacion" className="border-b border-line">
      <Container className="py-20 md:py-28">
        <SectionHeading index="05" title="Educación" />
        <ol className="max-w-3xl">
          {education.map((item) => (
            <li
              key={`${item.institution}-${item.degree}`}
              className="border-t border-line py-8 first:border-t-0 md:py-10"
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {item.degree}
                </h3>
                <p className="text-sm text-ink-muted">{item.period}</p>
              </div>
              <p className="mt-1 text-sm font-medium text-teal">
                {item.institution}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}