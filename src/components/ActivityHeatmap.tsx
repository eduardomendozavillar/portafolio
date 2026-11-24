"use client";

import { useMemo, useState } from "react";
import {
  contributionDays,
  contributionsActiveDays,
  contributionsTotal,
} from "@/data/contributions";
import { useLang, useT } from "@/i18n/LanguageProvider";

/**
 * Activity wheel (portfolio-rebrand S15 "plus del plus"): the contribution
 * year drawn as a radial clock — one sector per week, one annular ring per
 * weekday, colored by intensity with the barber palette. A square SVG scales
 * to any viewport (desktop and mobile read the same graphic; no horizontal
 * scroll, no lost days). Tap/hover a sector to read the day in an aria-live
 * chip; the center shows the active-day figure and the longest streak.
 * Reads the static generated module — the deployed site never calls GitHub.
 */
type Day = (typeof contributionDays)[number];
type Active = { date: string; count: number } | null;

const CX = 190;
const CY = 190;
const R0 = 72;
const R1 = 156;
const RING_H = (R1 - R0) / 7;

function sectorPath(weekIndex: number, dayIndex: number, weeks: number): string {
  const step = (Math.PI * 2) / weeks;
  const gapA = step * 0.18;
  const gapR = 2.6;
  const a0 = -Math.PI / 2 + weekIndex * step + gapA / 2;
  const a1 = a0 + step - gapA;
  const r0 = R0 + dayIndex * RING_H + gapR / 2;
  const r1 = r0 + RING_H - gapR;
  const x = (r: number, a: number) => CX + r * Math.cos(a);
  const y = (r: number, a: number) => CY + r * Math.sin(a);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x(r1, a0).toFixed(2)} ${y(r1, a0).toFixed(2)} A ${r1} ${r1} 0 ${large} 1 ${x(r1, a1).toFixed(2)} ${y(r1, a1).toFixed(2)} L ${x(r0, a1).toFixed(2)} ${y(r0, a1).toFixed(2)} A ${r0} ${r0} 0 ${large} 0 ${x(r0, a0).toFixed(2)} ${y(r0, a0).toFixed(2)} Z`;
}

export function ActivityHeatmap() {
  const t = useT();
  const { lang } = useLang();
  const [active, setActive] = useState<Active>(null);

  // Calendar layout: pad the first week so columns align to weekdays.
  const firstDate = new Date(contributionDays[0].date);
  const lead = firstDate.getDay(); // 0 = Sunday
  const columns: (Day | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...contributionDays,
  ];
  const weeks: (Day | null)[][] = [];
  for (let i = 0; i < columns.length; i += 7) {
    weeks.push(columns.slice(i, i + 7));
  }

  // Longest streak of consecutive active days (personal touch, center line).
  const streak = useMemo(() => {
    let best = 0;
    let run = 0;
    for (const day of contributionDays) {
      run = day.count > 0 ? run + 1 : 0;
      best = Math.max(best, run);
    }
    return best;
  }, []);

  // Month labels: the first week each month appears in, placed radially.
  const monthTicks = useMemo(() => {
    const seen = new Map<number, { week: number; angle: number }>();
    columns.forEach((day, index) => {
      if (!day) return;
      const month = new Date(day.date).getMonth();
      if (seen.has(month)) return;
      const week = Math.floor(index / 7);
      const angle = -Math.PI / 2 + (week + 0.5) * ((Math.PI * 2) / weeks.length);
      seen.set(month, { week, angle });
    });
    return Array.from(seen, ([month, { angle }]) => {
      const deg = (angle * 180) / Math.PI;
      const px = CX + 172 * Math.cos(angle);
      const py = CY + 172 * Math.sin(angle);
      const flip = deg > 0 && deg < 180;
      return { label: t.sections.projects.heatmap.months[month], transform: `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${deg + (flip ? 180 : 0)})` };
    });
  }, [t]);

  if (contributionDays.length === 0) return null;

  const chip = active
    ? t.sections.projects.heatmap.tooltip
        .replace("{count}", String(active.count))
        .replace("{date}", new Date(active.date).toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { day: "numeric", month: "short" }))
    : t.sections.projects.heatmap.hint;

  return (
    <div
      className="rounded-sm border border-line border-l-4 border-l-accent bg-paper-raised p-5 md:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-sm text-ink-muted">
          <b className="text-lg font-bold text-accent">{contributionsTotal}</b>{" "}
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
      <div className="relative mx-auto mt-2 w-full max-w-[430px]">
        <svg
          viewBox="0 0 380 380"
          role="img"
          aria-label={t.sections.projects.heatmap.imgAria.replace("{days}", String(contributionsActiveDays))}
          className="wheel-in block h-auto w-full"
          onPointerLeave={() => setActive(null)}
        >
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) =>
              day ? (
                <path
                  key={day.date}
                  d={sectorPath(weekIndex, dayIndex, weeks.length)}
                  className={`wheel-level-${day.level} cursor-pointer`}
                  onPointerEnter={() => setActive(day)}
                  onClick={() => setActive(day)}
                />
              ) : null,
            ),
          )}
          {monthTicks.map((tick) => (
            <text
              key={tick.label + tick.transform}
              transform={tick.transform}
              textAnchor="middle"
              className="fill-current font-mono text-[9px] uppercase tracking-[0.1em] text-ink-muted"
            >
              {tick.label}
            </text>
          ))}
        </svg>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <span className="font-display text-6xl leading-none text-ink">
            {contributionsActiveDays}
          </span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
            {t.sections.projects.heatmap.centerLabel}
          </span>
          <span className="mt-2 border border-line px-2 py-0.5 font-mono text-[10px] text-accent">
            {t.sections.projects.heatmap.streak} {streak}d
          </span>
        </div>
      </div>
      <p
        aria-live="polite"
        className="mt-3 min-h-5 text-center font-mono text-[11.5px] text-ink-muted"
      >
        {chip}
      </p>
      <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
        <span>{t.sections.projects.heatmap.less}</span>
        <span className="mx-2 h-1.5 flex-1 rounded-full bg-gradient-to-r from-[rgba(179,38,30,0.12)] via-accent-soft to-accent" />
        <span>{t.sections.projects.heatmap.more}</span>
      </div>
    </div>
  );
}
