import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BrandIcon } from "@/components/BrandIcon";
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

/** Highlighted technologies that get a branded icon tile. */
const HIGHLIGHT = [
  "TypeScript",
  "Next.js",
  "React.js",
  "Node.js",
  "Express",
  "Fastify",
  "FastAPI",
  "PostgreSQL",
  "SQL",
  "Firebase/Firestore",
  "MCP (Model Context Protocol)",
  "Docker",
  "Vercel",
  "Angular",
  "Tailwind CSS",
  "Vitest",
  "LLMs locales y en la nube",
];
const highlights = skills.filter((skill) => HIGHLIGHT.includes(skill.name));

const MARQUEE = [
  "Next.js",
  "TypeScript",
  "RAG",
  "LLMs",
  "Agentes",
  "SQL",
  "FastAPI",
  "Docker",
  "Vercel",
];

/**
 * Habilidades (portfolio-rebrand 06): branded icon tiles for the highlight
 * technologies, category cards with the full CV list, and a slow tech
 * marquee. Tilt/spotlight interactivity attaches via the FX delegation in
 * the app shell (data-fx attributes).
 */
export function Habilidades() {
  return (
    <section id="habilidades" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading title="Habilidades" />

        <ul
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
          data-fx-tilt
        >
          {highlights.map((skill) => (
            <li
              key={skill.name}
              data-fx-tilt-item
              className="tile flex flex-col items-center gap-2 rounded-xl border border-line bg-paper-raised px-2 py-4 text-center"
            >
              <span className="icon h-11 w-11 overflow-hidden rounded-xl grid place-items-center outline outline-1 outline-line">
                <span className="h-6 w-6">
                  <BrandIcon tech={skill.name} />
                </span>
              </span>
              <span className="font-mono text-[11.5px] leading-tight text-ink-muted">
                {skill.name}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-9 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              data-fx-spotlight
              data-fx-reveal className="relative overflow-hidden rounded-xl border border-line bg-paper-raised/50 px-5 py-4"
            >
              <dt className="text-sm font-bold text-ink">{group.category}</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-1.5 font-mono text-[12px]">
                  {group.items.map((skill) => (
                    <li
                      key={skill.name}
                      className="skill-chip rounded-md border border-line px-2.5 py-1 text-ink-muted"
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>

        <div
          aria-hidden="true"
          className="marquee mt-10 overflow-hidden border-y border-line py-2.5"
        >
          <div className="marquee-track flex w-max font-display text-lg uppercase tracking-[0.12em] text-ink-muted">
            {[0, 1].map((copy) => (
              <span key={copy} className="flex gap-10 pr-10">
                {MARQUEE.map((tech) => (
                  <span key={tech}>
                    {tech} <span className="text-accent">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
