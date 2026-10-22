/** Work experience entry rendered in the Experiencia section. */
export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
};

/**
 * Real CV v2 entries (2026-10-21, source of truth; most recent first).
 * Only the two jobs the CV declares — the old "Mantenimiento de
 * computadores 2019—2021" row does not exist in the CV and was removed.
 */
export const experience: ExperienceItem[] = [
  {
    role: "Apoyo administrativo",
    company: "E.S.E Hospital Universitario Julio Méndez Barreneche",
    period: "2022 — Actualidad",
    description:
      "Soporte técnico y mantenimiento de hardware y software, contribuyendo a la continuidad operativa y a la gestión de incidentes del hospital. Lideré proyectos de optimización de equipos, priorizando tareas y recursos para cumplir plazos con calidad. De forma personal, desarrollé durante ~6 meses el sistema de gestión documental SGDI (detalle en Proyectos).",
  },
  {
    role: "Encuestador y digitador de información",
    company: "Natural Soaps S.A.S",
    period: "2019 — 2020",
    description:
      "Colaboré con equipos multidisciplinarios en la definición y documentación de requisitos técnicos, alineados a estándares de calidad. Apoyé la gestión y actualización de sistemas de información, cuidando la precisión de datos, la documentación y el control de versiones.",
  },
];
