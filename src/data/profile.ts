/** Profile content rendered by the Hero and Sobre mí sections. */
export type Profile = {
  name: string;
  role: string;
  tagline: string;
  /** Paragraphs rendered in the Sobre mí section. */
  about: string[];
  /** English variant (S11): faithful mirror, same facts. */
  en?: Partial<Pick<Profile, "role" | "tagline" | "about">>;
};

export const profile: Profile = {
  name: "Eduardo Mendoza Villar",
  role: "Ingeniero de Sistemas · Especialización en Inteligencia Artificial (en curso)",
  tagline:
    "Conecto la ingeniería de sistemas con la inteligencia artificial aplicada —LLMs, agentes y RAG— para construir sistemas claros, seguros y escalables.",
  about: [
    "Ingeniero de Sistemas graduado (2026), enfocado en IA aplicada: integración de LLMs (locales y en la nube), arquitecturas RAG y orquestación de agentes. Experiencia construyendo y desplegando aplicaciones web full-stack, incluido un sistema de gestión documental institucional (SGDI) desarrollado de forma personal para el Hospital Universitario Julio Méndez Barreneche.",
    "Aplico metodologías de entrega acelerada y verificación de calidad como Spec-Driven Development y pruebas automatizadas. Me muevo con comodidad entre la infraestructura y el producto: del diagnóstico de hardware y redes a la construcción de aplicaciones web tipadas y mantenibles.",
    "Busco proyectos donde la ingeniería de sistemas y la inteligencia artificial se encuentren para crear soluciones claras, seguras y escalables.",
  ],
  en: {
    role: "Systems Engineer · Specialization in Artificial Intelligence (in progress)",
    about: [
      "Systems Engineer, graduated 2026, focused on applied AI: integration of LLMs (local and cloud), RAG architectures and agent orchestration. Experience building and deploying full-stack web applications, including an institutional document management system (SGDI) developed independently for the Hospital Universitario Julio Méndez Barreneche.",
      "I apply accelerated delivery and quality-verification methodologies such as Spec-Driven Development and automated testing. I move comfortably between infrastructure and product: from hardware and network diagnostics to building typed, maintainable web applications.",
      "I look for projects where systems engineering and artificial intelligence meet to create clear, secure and scalable solutions.",
    ],
  },
};
