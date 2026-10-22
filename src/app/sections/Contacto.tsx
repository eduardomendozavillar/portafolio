"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { socials } from "@/data/socials";

/** Contacto: client section wrapping the contact form. */
export function Contacto() {
  const github = socials.find((s) => s.platform === "github");

  return (
    <section id="contacto" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading
          title="Contacto"
          description="¿Tiene un proyecto en mente o quiere conversar? Escríbame y responderé a la brevedad."
        />
        {github ? (
          <p className="mb-6 text-sm text-ink-muted">
            También en{" "}
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
          Preferís el CV en un documento: {""}
          <a
            href="/CV_Eduardo_Mendoza_Ingeniero_IA.pdf"
            download="CV_Eduardo_Mendoza_Ingeniero_IA.pdf"
            className="font-medium text-ink underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            Descargar CV
          </a>
          .
        </p>
        <ContactForm />
      </Container>
    </section>
  );
}
