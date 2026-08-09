/**
 * Editorial section heading: teal index eyebrow (01, 02, …) + display title
 * + optional Spanish description. Used by every content section.
 */
export function SectionHeading({
  index,
  title,
  description,
}: {
  /** Editorial number, e.g. "01". */
  index: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10 md:mb-14">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
        {index}
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