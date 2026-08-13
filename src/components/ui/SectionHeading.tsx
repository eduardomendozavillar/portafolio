/**
 * Editorial section heading: accent eyebrow + display title + optional
 * Spanish description. Sequence sections (Proyectos, Experiencia,
 * Educación) pass a numeric `index`; the rest pass a text `eyebrow`.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  /** Editorial number for sequence sections, e.g. "03". */
  index?: string;
  /** Text eyebrow for non-sequence sections, e.g. "Sobre mí". */
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10 md:mb-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
        {index ?? eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
          {description}
        </p>
      ) : null}
    </header>
  );
}
