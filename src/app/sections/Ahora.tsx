"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useT } from "@/i18n/LanguageProvider";

/**
 * "Ahora" (portfolio-rebrand 06, Marco-style section): what Eduardo is
 * building right now and where he is. Content derived from the CV v2 and
 * current context — no invented claims.
 */
export function Ahora() {
  const t = useT();
  return (
    <section id="ahora" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading
          title={t.sections.now.title}
          description={t.sections.now.description}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div data-fx-reveal className="rounded-xl border border-line border-l-4 border-l-accent bg-paper-raised px-5 py-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
              {t.sections.now.building.title}
            </h3>
            <p className="mt-3 text-[14.5px] leading-7 text-ink-muted">
              {t.sections.now.building.body}
            </p>
          </div>
          <div data-fx-reveal className="rounded-xl border border-line border-l-4 border-l-accent bg-paper-raised px-5 py-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-accent">
              {t.sections.now.where.title}
            </h3>
            <p className="mt-3 text-[14.5px] leading-7 text-ink-muted">
              {t.sections.now.where.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
