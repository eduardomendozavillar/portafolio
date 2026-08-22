import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skills, type Skill } from "@/data/skills";

/** Skills grouped by category in first-appearance order. */
const skillGroups = skills.reduce<Array<{ category: string; items: Skill[] }>>(
  (groups, skill) => {
    const group = groups.find((g) => g.category === skill.category);
    if (group) {
      group.items.push(skill);
    } else {
      groups.push({ category: skill.category, items: [skill] });
    }
    return groups;
  },
  [],
);

/** Habilidades: technologies grouped by category. */
export function Habilidades() {
  return (
    <section id="habilidades" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading title="Habilidades" />
        <dl className="grid gap-8 md:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <dt className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
                {group.category}
              </dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <li
                      key={skill.name}
                      className="rounded-full border border-line px-3 py-1 text-sm text-ink"
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
