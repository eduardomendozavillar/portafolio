/** Education entry rendered in the Educación section. */
export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
};

/** Placeholder entries — editable before deploy. */
export const education: EducationItem[] = [
  {
    degree: "Grado en Ingeniería Informática",
    institution: "Universidad de ejemplo",
    period: "2018 — 2023",
  },
  {
    degree: "Certificación en Desarrollo Web Avanzado",
    institution: "Plataforma de ejemplo",
    period: "2023",
  },
];