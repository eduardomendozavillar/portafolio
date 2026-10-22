/** Education entry rendered in the Educación section. */
export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
};

/**
 * Real CV v2 entries (2026-10-21, source of truth; most recent first).
 * The especialización appears in the CV header as "(en curso)" — no year is
 * invented. Secundaria is not declared in the CV and was removed.
 */
export const education: EducationItem[] = [
  {
    degree: "Especialización en Inteligencia Artificial",
    institution: "Corporación Unificada Nacional de Educación Superior — CUN",
    period: "En curso",
  },
  {
    degree: "Profesional en Ingeniería de Sistemas",
    institution: "Corporación Unificada Nacional de Educación Superior — CUN",
    period: "2026",
  },
  {
    degree: "Tecnólogo en Desarrollo de Software y Redes",
    institution: "Corporación Unificada Nacional de Educación Superior — CUN",
    period: "2025",
  },
  {
    degree: "Técnico Profesional en Mantenimiento de Computadores",
    institution: "Corporación Unificada Nacional de Educación Superior — CUN",
    period: "2024",
  },
  {
    degree: "Técnico en Desarrollo de Software",
    institution: "Servicio Nacional de Aprendizaje — SENA",
    period: "2019",
  },
];
