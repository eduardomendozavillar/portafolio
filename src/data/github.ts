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
];
