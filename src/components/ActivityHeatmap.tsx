"use client";

import {
  contributionDays,
  contributionsActiveDays,
} from "@/data/contributions";
import { useT } from "@/i18n/LanguageProvider";

/**
 * GitHub activity heatmap (portfolio-rebrand S7, dirección 02 style): one
 * column per week, seven rows (Sun→Sat), violet intensity levels. Reads the
 * static generated module — the deployed site never calls GitHub. If the
 * dataset is empty (generator never ran), renders nothing gracefully.
 */
export function ActivityHeatmap() {
  const t = useT();
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
      className="rounded-sm border border-line border-l-4 border-l-accent bg-paper-raised p-5 md:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-ink-muted">
          <b className="text-lg font-bold text-accent">{contributionsActiveDays}</b>{" "}
          {t.sections.projects.heatmap.legend}
        </p>
        <a
          href="https://github.com/eduardomendozavillar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-accent underline decoration-accent/40 decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
        >
          {t.sections.projects.heatmap.viewProfile}
        </a>
      </div>
      <div
        className="heatmap-scroll -mx-2 mt-4 overflow-x-auto px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
      <div
        className="grid w-max auto-cols-min grid-flow-col grid-rows-7 gap-[3px]"
        role="img"
        aria-label={t.sections.projects.heatmap.imgAria.replace("{days}", String(contributionsActiveDays))}
      >
        {weeks.flatMap((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <span
              key={`${weekIndex}-${dayIndex}`}
              className={`h-3 w-3 rounded-[3px] ${day ? levelClass[day.level] : "opacity-0"}`}
              title={day && day.count > 0 ? t.sections.projects.heatmap.tooltip.replace("{count}", String(day.count)).replace("{date}", day.date) : undefined}
            />
          )),
        )}
      </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted">
        <span>{t.sections.projects.heatmap.less}</span>
        <span className="mx-2 h-1.5 flex-1 rounded-full bg-gradient-to-r from-[rgba(179,43,30,0.12)] via-accent-soft to-accent" />
        <span>{t.sections.projects.heatmap.more}</span>
      </div>
    </div>
  );
}
