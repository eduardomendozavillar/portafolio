/**
 * Section heading: display title + optional description.
 * Eyebrow/index only when they add information (not a repeat of the title).
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
  const label = index ?? eyebrow;
  const showLabel =
    Boolean(label) &&
    label!.trim().toLocaleLowerCase("es") !== title.trim().toLocaleLowerCase("es");

  return (
    <header className="mb-8 md:mb-10">
      {showLabel ? (
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {label}
        </p>
      ) : null}
      <h2
        className={`font-display text-3xl font-semibold text-ink md:text-4xl ${
          showLabel ? "mt-3" : ""
        }`}
      >
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
