import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * "Ahora" (portfolio-rebrand 06, Marco-style section): what Eduardo is
 * building right now and where he is. Content derived from the CV v2 and
 * current context — no invented claims.
 */
export function Ahora() {
  return (
    <section id="ahora" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading
          title="Ahora"
          description="En qué estoy y dónde me encontrás."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div data-fx-reveal className="rounded-xl border border-line border-l-4 border-l-accent bg-paper-raised px-5 py-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
              Qué estoy construyendo
            </h3>
            <p className="mt-3 text-[14.5px] leading-7 text-ink-muted">
              La Especialización en Inteligencia Artificial y las mejoras
              continuas del SGDI institucional, junto con la Optimización de
              Excel en su ronda anual.
            </p>
          </div>
          <div data-fx-reveal className="rounded-xl border border-line border-l-4 border-l-accent bg-paper-raised px-5 py-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
              Dónde estoy
            </h3>
            <p className="mt-3 text-[14.5px] leading-7 text-ink-muted">
              Santa Marta, Colombia — abierto a oportunidades remotas e
              híbridas. Respondo en menos de 24 horas.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
