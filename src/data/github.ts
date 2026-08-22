import type { Project } from "@/types/project";

export const githubActivity = {
  title: "Actividad pública reciente",
  profileUrl: "https://github.com/eduardomendozavillar",
  login: "eduardomendozavillar",
  publicRepos: 22,
  since: "2019",
  items: [
    "22 repositorios públicos en GitHub.",
    "Perfil activo desde 2019.",
    "Este portafolio se mantiene como proyecto público en TypeScript.",
  ],
};

export const featuredGitHubProjects: Project[] = [
  {
    id: "github-portafolio",
    title: "Portafolio personal",
    slug: "portafolio-personal",
    summary:
      "Portafolio personal orientado a reclutadores, construido con Next.js, TypeScript, Tailwind, Firebase/Firestore y desplegado en Vercel.",
    description:
      "Proyecto actual en mejora continua para presentar experiencia, habilidades, proyectos y canales de contacto con una base técnica clara y mantenible.",
    technologies: ["Next.js", "TypeScript", "Tailwind", "Firebase", "Vercel"],
    links: {
      demo: "https://portafolio-psi-five-95.vercel.app",
      repo: "https://github.com/eduardomendozavillar/portafolio",
    },
    featured: true,
    sortOrder: -100,
    createdAt: "2026-08-13T00:00:00.000Z",
    updatedAt: "2026-08-13T00:00:00.000Z",
  },
  {
    id: "github-taller-by",
    title: "taller.by",
    slug: "taller-by",
    summary:
      "Aplicación de productividad personal y composición musical avanzada, con backend Express, base de datos PostgreSQL y capa de IA con Gemini.",
    description:
      "Proyecto full-stack en desarrollo con futuras mejoras. Frontend en React/Vite con Tailwind, backend Express con rutas API, persistencia en PostgreSQL con fallback a localStorage y funciones de IA generativa de Gemini.",
    technologies: ["React", "Vite", "Express", "PostgreSQL", "Firebase", "Gemini"],
    links: {
      demo: "https://taller-by.vercel.app",
      repo: "https://github.com/eduardomendozavillar/taller.by",
    },
    featured: true,
    sortOrder: -90,
    createdAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "github-fitbox-elite",
    title: "FitBox Elite",
    slug: "fitbox-elite",
    summary:
      "App de gestión de gimnasio: dashboard de socios, clases, membresías, WOD del día y comunidad, con autenticación y datos en Firestore.",
    description:
      "Proyecto en desarrollo con futuras mejoras. Panel de administración de gimnasio con registro de asistencia, planes de membresía, clases, entrenamiento del día (WOD) y vistas de comunidad, sobre React/Vite con Firebase.",
    technologies: ["React", "Vite", "Firebase", "Firestore", "Tailwind"],
    featured: true,
    sortOrder: -80,
    createdAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
  },
];
