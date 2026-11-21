import {
  contributionDays,
  contributionsActiveDays,
} from "@/data/contributions";

/**
 * GitHub activity heatmap (portfolio-rebrand S7, dirección 02 style): one
 * column per week, seven rows (Sun→Sat), violet intensity levels. Reads the
 * static generated module — the deployed site never calls GitHub. If the
 * dataset is empty (generator never ran), renders nothing gracefully.
 */
export function ActivityHeatmap() {
  if (contributionDays.length === 0) return null;

  // Calendar layout: pad the first week so columns align to weekdays.
  const firstDate = new Date(contributionDays[0].date);
  const lead = firstDate.getDay(); // 0 = Sunday
  const columns: (typeof contributionDays[number] | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...contributionDays,
  ];
  const weeks: (typeof columns)[] = [];
  for (let i = 0; i < columns.length; i += 7) {
    weeks.push(columns.slice(i, i + 7));
  }

  const levelClass = ["level-0", "level-1", "level-2", "level-3"];

  return (
    <div
      className="rounded-2xl border border-accent/30 bg-paper-raised/50 p-5 backdrop-blur-sm md:p-6"
      style={{
        boxShadow: "0 0 40px -18px var(--color-accent)",
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-ink-muted">
          <b className="text-lg font-bold text-accent">{contributionsActiveDays}</b>{" "}
          días con actividad de desarrollo en el último año
        </p>
        <a
          href="https://github.com/eduardomendozavillar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Ver perfil en GitHub
        </a>
      </div>
      <div
        className="mt-4 grid auto-cols-min grid-flow-col grid-rows-7 gap-[3px]"
        role="img"
        aria-label={`Mapa de calor de contribuciones GitHub: ${contributionsActiveDays} días activos`}
      >
        {weeks.flatMap((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <span
              key={`${weekIndex}-${dayIndex}`}
              className={`h-3 w-3 rounded-[3px] ${day ? levelClass[day.level] : "opacity-0"}`}
              title={day && day.count > 0 ? `${day.count} contribuciones el ${day.date}` : undefined}
            />
          )),
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted">
        <span>Menos</span>
        <span className="mx-2 h-1.5 flex-1 rounded-full bg-gradient-to-r from-[rgba(179,43,30,0.12)] via-accent-soft to-accent" />
        <span>Más</span>
      </div>
    </div>
  );
}
