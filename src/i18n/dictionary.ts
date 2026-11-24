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
  sections: {
    aboutMe: "Sobre mí",
    experience: "Experiencia",
    education: "Educación",
    now: {
      title: "Ahora",
      description: "En qué estoy y dónde me encontrás.",
      building: {
        title: "Qué estoy construyendo",
        body:
          "La Especialización en Inteligencia Artificial y las mejoras continuas del SGDI institucional, junto con la Optimización de Excel en su ronda anual.",
      },
      where: {
        title: "Dónde estoy",
        body:
          "Santa Marta, Colombia — abierto a oportunidades remotas e híbridas. Respondo en menos de 24 horas.",
      },
    },
    projects: {
      title: "Proyectos",
      description:
        "Una selección de trabajos que muestran cómo resuelvo problemas reales con fundamentos sólidos.",
      activity: {
        title: "Actividad pública reciente",
        publicRepos: "Repos públicos",
        since: "Desde",
      },
      count: {
        projects: "proyectos",
        production: "en producción",
        development: "en desarrollo",
      },
      filterState: "Filtrar proyectos por estado",
      filterTech: "Filtrar proyectos por tecnología",
      all: "Todas",
      production: "En producción",
      development: "En desarrollo",
      personal: "Personal",
      previewOf: "Vista previa de",
      preview: "Vista previa",
      live: "Ver en vivo",
      activeLine: "activo:",
      states: {
        loading: "Cargando proyectos dinámicos…",
        error:
          "No se pudieron cargar los proyectos dinámicos. Mientras tanto, podés ver el proyecto destacado.",
      },
      heatmap: {
        legend: "días con actividad de desarrollo en el último año",
        viewProfile: "Ver perfil en GitHub",
        imgAria: "Mapa de calor de contribuciones GitHub: {days} días activos",
        tooltip: "{count} contribuciones el {date}",
        less: "Menos",
        more: "Más",
      },
      marquee: [
        "Next.js",
        "TypeScript",
        "RAG",
        "LLMs",
        "Agentes",
        "SQL",
        "FastAPI",
        "Docker",
        "Vercel",
      ],
    },
    certifications: {
      title: "Certificaciones",
      description:
        "Credenciales verificables de mi formación continua en IA, datos y cloud.",
      verify: "Verificar",
      viewAll: "Ver todas",
      viewAllSuffix: "certificaciones más",
      linkPending: "Link en camino",
      noPublicLink: "Sin link público",
    },
    skills: {
      title: "Habilidades",
    },
    contact: {
      title: "Contacto",
      description:
        "¿Tiene un proyecto en mente o quiere conversar? Escríbame y responderé a la brevedad.",
      alsoOn: "También en",
      cvPreface: "Preferís el CV en un documento:",
      downloadCv: "Descargar CV",
      formAria: "Formulario de contacto",
      fields: {
        name: "Nombre",
        email: "Correo electrónico",
        message: "Mensaje",
        honeypot: "No rellenar este campo",
      },
      submit: "Enviar mensaje",
      submitting: "Enviando…",
      sent: "Mensaje enviado ✓",
      success:
        "¡Gracias! Tu mensaje se envió correctamente. Te responderé a la brevedad.",
      errorFallback:
        "No se pudo enviar el mensaje. Inténtalo de nuevo.",
      errorConnection:
        "No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.",
    },
    footer: {
      rights: "Todos los derechos reservados.",
    },
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
  sections: {
    aboutMe: "About me",
    experience: "Experience",
    education: "Education",
    now: {
      title: "Now",
      description: "What I'm working on and where to find me.",
      building: {
        title: "What I'm building",
        body:
          "The Specialization in Artificial Intelligence and continuous improvements to the institutional SGDI, together with the Excel Optimizer in its annual round.",
      },
      where: {
        title: "Where I am",
        body:
          "Santa Marta, Colombia — open to remote and hybrid opportunities. I reply within 24 hours.",
      },
    },
    projects: {
      title: "Projects",
      description:
        "A selection of work showing how I solve real problems on solid foundations.",
      activity: {
        title: "Recent public activity",
        publicRepos: "Public repos",
        since: "Since",
      },
      count: {
        projects: "projects",
        production: "in production",
        development: "in development",
      },
      filterState: "Filter projects by status",
      filterTech: "Filter projects by technology",
      all: "All",
      production: "In production",
      development: "In development",
      personal: "Personal",
      previewOf: "Preview of",
      preview: "Preview",
      live: "View live",
      activeLine: "active:",
      states: {
        loading: "Loading dynamic projects…",
        error:
          "Dynamic projects could not be loaded. In the meantime, you can view the featured project.",
      },
      heatmap: {
        legend: "days with development activity in the last year",
        viewProfile: "View GitHub profile",
        imgAria: "GitHub contributions heatmap: {days} active days",
        tooltip: "{count} contributions on {date}",
        less: "Less",
        more: "More",
      },
      marquee: [
        "Next.js",
        "TypeScript",
        "RAG",
        "LLMs",
        "Agents",
        "SQL",
        "FastAPI",
        "Docker",
        "Vercel",
      ],
    },
    certifications: {
      title: "Certifications",
      description:
        "Verifiable credentials from my continuing training in AI, data and cloud.",
      verify: "Verify",
      viewAll: "View all",
      viewAllSuffix: "more certifications",
      linkPending: "Link on the way",
      noPublicLink: "No public link",
    },
    skills: {
      title: "Skills",
    },
    contact: {
      title: "Contact",
      description:
        "Do you have a project in mind or would like to talk? Write to me and I will reply as soon as possible.",
      alsoOn: "Also on",
      cvPreface: "Prefer the CV as a document:",
      downloadCv: "Download CV",
      formAria: "Contact form",
      fields: {
        name: "Name",
        email: "Email",
        message: "Message",
        honeypot: "Do not fill in this field",
      },
      submit: "Send message",
      submitting: "Sending…",
      sent: "Message sent ✓",
      success:
        "Thank you! Your message was sent successfully. I will reply as soon as possible.",
      errorFallback:
        "The message could not be sent. Please try again.",
      errorConnection:
        "The message could not be sent. Check your connection and try again.",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
};

export type Dictionary = typeof es;

export const dictionary: Record<Lang, Dictionary> = { es, en };
