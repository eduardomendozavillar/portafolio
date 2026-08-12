/** Education entry rendered in the Educación section. */
export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
};

/** Real CV entries (Spanish; most recent first). */
export const education: EducationItem[] = [
  {
    degree: "Especialización en Inteligencia Artificial",
    institution: "CUN",
    period: "(En curso) 2027",
  },
  {
    degree: "Ingeniería de Sistemas",
    institution: "CUN",
    period: "2026",
  },
  {
    degree: "Tecnólogo en Desarrollo de Software y Redes",
    institution: "CUN",
    period: "2025",
  },
  {
    degree: "Técnico Profesional en Mantenimiento de Computadores",
    institution: "CUN",
    period: "2024",
  },
  {
    degree: "Técnico en Desarrollo de Software",
    institution: "SENA",
    period: "2019",
  },
  {
    degree: "Educación Secundaria",
    institution: "I.E.D Líbano 2000",
    period: "2018",
  },
];
