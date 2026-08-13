/** Work experience entry rendered in the Experiencia section. */
export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

/** Real CV entries (Spanish, truthful; most recent first). */
export const experience: ExperienceItem[] = [
  {
    role: "Apoyo administrativo",
    company: "Hospital Universitario Julio Méndez Barreneche",
    period: "2022 — Actualidad",
    description:
      "Soporte técnico y administrativo a los sistemas de información del hospital: gestión del archivo de gestión, elaboración de informes y acompañamiento a los procesos operativos del área.",
  },
  {
    role: "Mantenimiento de computadores",
    company: "Hospital Universitario Julio Méndez Barreneche",
    period: "2019 — 2021",
    description:
      "Soporte técnico a usuarios, instalación de sistemas operativos Windows y Linux, diagnóstico de hardware y configuración de redes básicas.",
  },
  {
    role: "Encuestador y digitador de información",
    company: "NATURAL SOAPS S.A.S",
    period: "2019 — 2020",
    description:
      "Presentaciones persuasivas y contenidos alineados con la marca, apoyando la comunicación comercial y el registro ordenado de información.",
  },
];
