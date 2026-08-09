/** Work experience entry rendered in the Experiencia section. */
export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

/** Placeholder entries — editable before deploy. */
export const experience: ExperienceItem[] = [
  {
    role: "Desarrollador Full-Stack",
    company: "Empresa de ejemplo",
    period: "2024 — presente",
    description:
      "Responsable del desarrollo y mantenimiento de aplicaciones web end-to-end, con foco en calidad, rendimiento y accesibilidad.",
  },
  {
    role: "Desarrollador Frontend",
    company: "Estudio de ejemplo",
    period: "2022 — 2024",
    description:
      "Construcción de interfaces de producto con React y TypeScript, colaborando en el diseño de sistemas y patrones reutilizables.",
  },
];