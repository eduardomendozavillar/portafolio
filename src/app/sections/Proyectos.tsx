import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectList } from "@/components/ProjectList";

/** Proyectos: client section consuming GET /api/projects (design D1). */
export function Proyectos() {
  return (
    <section id="proyectos" className="border-b border-line">
      <Container className="py-20 md:py-28">
        <SectionHeading
          index="03"
          title="Proyectos"
          description="Una selección de trabajos que muestran cómo resuelvo problemas reales con fundamentos sólidos."
        />
        <ProjectList />
      </Container>
    </section>
  );
}