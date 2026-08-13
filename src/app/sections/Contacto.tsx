"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

/** Contacto: client section wrapping the contact form. */
export function Contacto() {
  return (
    <section id="contacto" className="border-b border-line">
      <Container className="py-20 md:py-28">
        <SectionHeading
          eyebrow="Contacto"
          title="Contacto"
          description="¿Tiene un proyecto en mente o quiere conversar? Escríbame y responderé a la brevedad."
        />
        <ContactForm />
      </Container>
    </section>
  );
}