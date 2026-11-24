"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certificates } from "@/data/certificates";
import { useLang, useT } from "@/i18n/LanguageProvider";
import { pickLocalized } from "@/i18n/localize";

/**
 * Certificaciones (portfolio-rebrand S6): the CV's four certifications
 * featured as cards, the rest behind a native <details> expander — zero JS,
 * keyboard operable by default. Items without a public verification link
 * render without one (mirrors the private-projects rule).
 */
export function Certificaciones() {
  const t = useT();
  const { lang } = useLang();
  const featured = certificates.filter((certificate) => certificate.featured);
  const rest = certificates.filter((certificate) => !certificate.featured);

  return (
    <section id="certificaciones" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <SectionHeading
          title={t.sections.certifications.title}
          description={t.sections.certifications.description}
        />
        <ul className="grid gap-4 md:grid-cols-2">
          {featured.map((certificate) => {
            const item = pickLocalized(certificate, lang);
            return (
            <li
              key={certificate.title}
              data-fx-spotlight data-fx-reveal className="flex items-center gap-4 rounded-xl border border-line border-l-4 border-l-accent bg-paper-raised/50 px-5 py-4 backdrop-blur-sm"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{item.title}</p>
                <p className="text-sm text-ink-muted">{item.issuer}</p>
              </div>
              {certificate.url ? (
                <a
                  href={certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto shrink-0 rounded-full border border-accent/50 px-3 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent-soft"
                >
                  {t.sections.certifications.verify}
                </a>
              ) : (
                <span
                  aria-hidden="true"
                  className="ml-auto shrink-0 rounded-full border border-line px-3 py-1 text-xs text-ink-muted"
                >
                  {certificate.issuer === "Certificación en curso de validación"
                    ? t.sections.certifications.linkPending
                    : t.sections.certifications.noPublicLink}
                </span>
              )}
            </li>
            );
          })}
        </ul>

        <details className="group mt-4">
          <summary className="cursor-pointer list-none text-sm text-ink-muted transition-colors hover:text-accent">
            <span className="mr-2 inline-block transition-transform group-open:rotate-90">
              ▸
            </span>
            {t.sections.certifications.viewAll} <span className="text-accent">(+{rest.length} {t.sections.certifications.viewAllSuffix})</span>
          </summary>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {rest.map((certificate, index) => {
              const item = pickLocalized(certificate, lang);
              return (
              <li
                key={`${certificate.url ?? certificate.title}-${index}`}
                data-fx-reveal className="flex items-center gap-4 rounded-xl border border-line px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-ink-muted">
                    {item.issuer}
                    {item.year ? ` · ${item.year}` : ""}
                  </p>
                </div>
                {certificate.url ? (
                  <a
                    href={certificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto shrink-0 text-xs font-medium text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {t.sections.certifications.verify}
                  </a>
                ) : null}
              </li>
              );
            })}
          </ul>
        </details>
      </Container>
    </section>
  );
}
