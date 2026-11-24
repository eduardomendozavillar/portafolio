/**
 * UI dictionary (portfolio-rebrand, S11): ES/EN copies for every translatable
 * string in the site. The `es` variant is the source of truth (CV v2 verbatim);
 * `en` mirrors it faithfully — proper nouns, tech names and links stay as-is.
 * Sections consume it through `useT()`; data-driven entries carry their own
 * `en` field (see src/data/*).
 */
export type Lang = "es" | "en";

const es = {
  nav: {
    principal: "Navegación principal",
    inicio: "Inicio",
    sobreMi: "Sobre mí",
    experiencia: "Experiencia",
    proyectos: "Proyectos",
    educacion: "Educación",
    ahora: "Ahora",
    certificaciones: "Certificaciones",
    habilidades: "Habilidades",
    contacto: "Contacto",
  },
  header: {
    hireMe: "Contratame",
    quickNav: "Abrir navegación rápida (Ctrl+K)",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    langLabel: "ES",
    langAria: "Cambiar idioma a inglés",
  },
  hero: {
    chip: "Disponible para nuevas oportunidades",
    tagline:
      "Conecto la ingeniería de sistemas con la inteligencia artificial aplicada —LLMs, agentes y RAG— para construir sistemas claros, seguros y escalables.",
    emphasis: "inteligencia artificial",
    subline:
      "Experiencia construyendo y desplegando aplicaciones web full-stack, incluido un sistema de gestión documental institucional (SGDI) desarrollado de forma personal. Aplico Spec-Driven Development y pruebas automatizadas.",
    viewProjects: "Ver proyectos",
    downloadCv: "⬇ Descargar CV",
    contactMe: "Contactarme",
    photoAltPrefix: "Foto de perfil de",
    whoamiPrompt: "$ whoami",
    whoamiRole: "Full-Stack · IA aplicada",
  },
};

const en: typeof es = {
  nav: {
    principal: "Main navigation",
    inicio: "Home",
    sobreMi: "About me",
    experiencia: "Experience",
    proyectos: "Projects",
    educacion: "Education",
    ahora: "Now",
    certificaciones: "Certifications",
    habilidades: "Skills",
    contacto: "Contact",
  },
  header: {
    hireMe: "Hire me",
    quickNav: "Open quick navigation (Ctrl+K)",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    langLabel: "EN",
    langAria: "Switch language to Spanish",
    },
  hero: {
    chip: "Available for new opportunities",
    tagline:
      "I connect systems engineering with applied artificial intelligence —LLMs, agents and RAG— to build clear, secure and scalable systems.",
    emphasis: "artificial intelligence",
    subline:
      "Experience building and deploying full-stack web applications, including an institutional document management system (SGDI) developed independently. I apply Spec-Driven Development and automated testing.",
    viewProjects: "View projects",
    downloadCv: "⬇ Download CV",
    contactMe: "Contact me",
    photoAltPrefix: "Profile photo of",
    whoamiPrompt: "$ whoami",
    whoamiRole: "Full-Stack · Applied AI",
  },
};

export type Dictionary = typeof es;

export const dictionary: Record<Lang, Dictionary> = { es, en };
