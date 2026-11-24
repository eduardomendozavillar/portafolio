/**
 * Section heading: display title + optional description.
 * Rebrand 02: the `// title` eyebrow repeats the title on purpose (Marco-style
 * dev marker, cyan mono); the legacy index/eyebrow props are kept for API
 * compatibility but are not rendered.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  /** Sequence marker only when order itself carries meaning. */
  index?: string;
  /** Text label when it is not redundant with the title. */
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  void index;
  void eyebrow;

  return (
    <header className="mb-8 md:mb-10">
      <p className="font-display text-[15px] uppercase tracking-[0.14em] text-accent">// {title.toLowerCase()}</p>
      <h2 className="mt-2 font-display text-3xl font-normal uppercase tracking-[0.02em] text-ink md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-muted">
          {description}
        </p>
      ) : null}
    </header>
  );
}
