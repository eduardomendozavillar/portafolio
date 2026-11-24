"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { useLang, useT } from "@/i18n/LanguageProvider";

/** Sobre mí: short bio paragraphs from the typed profile data (ES/EN, S11). */
export function SobreMi() {
  const t = useT();
  const { lang } = useLang();
  const localized = profile.en && lang === "en" ? { ...profile, ...profile.en } : profile;
  return (
    <section id="sobre-mi" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading title={t.sections.aboutMe} />
        <div className="max-w-3xl space-y-4">
          {localized.about.map((paragraph, i) => (
            <p key={i} className="text-lg leading-8 text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
