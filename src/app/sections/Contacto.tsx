"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { socials } from "@/data/socials";
import { useT } from "@/i18n/LanguageProvider";

/** Contacto: client section wrapping the contact form. */
export function Contacto() {
  const t = useT();
  const github = socials.find((s) => s.platform === "github");

  return (
    <section id="contacto" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading
          title={t.sections.contact.title}
          description={t.sections.contact.description}
        />
        {github ? (
          <p className="mb-6 text-sm text-ink-muted">
            {t.sections.contact.alsoOn}{" "}
            <a
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              GitHub
            </a>
            .
          </p>
        ) : null}
        <p className="mb-6 text-sm text-ink-muted">
          {t.sections.contact.cvPreface}{" "}
          <a
            href="/CV_Eduardo_Mendoza_Ingeniero_IA.pdf"
            download="CV_Eduardo_Mendoza_Ingeniero_IA.pdf"
            className="font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {t.sections.contact.downloadCv}
          </a>
          .
        </p>
        <ContactForm />
      </Container>
    </section>
  );
}
