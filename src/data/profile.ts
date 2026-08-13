/** Profile content rendered by the Hero and Sobre mí sections. */
export type Profile = {
  name: string;
  role: string;
  tagline: string;
  /** Paragraphs rendered in the Sobre mí section. */
  about: string[];
};

export const profile: Profile = {
  name: "Eduardo Mendoza Villar",
  role: "Ingeniero de Sistemas · Especialista en Inteligencia Artificial",
  tagline:
    "Conecto la ingeniería de sistemas con la inteligencia artificial aplicada —LLMs, agentes y RAG— para construir sistemas claros, seguros y escalables.",
  about: [
    "Soy ingeniero de sistemas con formación continua en inteligencia artificial y experiencia en soporte técnico, sistemas de información y desarrollo de software. Me muevo con comodidad entre la infraestructura y el producto: del diagnóstico de hardware y redes a la construcción de aplicaciones web tipadas y mantenibles.",
    "Mi foco actual es la IA aplicada: modelos de lenguaje, orquestación de agentes y sistemas RAG que resuelven problemas reales. Priorizo fundamentos sólidos —arquitectura limpia, pruebas, seguridad y atención al detalle— por encima de la inmediatez.",
    "Busco proyectos donde la ingeniería de sistemas y la inteligencia artificial se encuentren para crear soluciones claras, seguras y escalables.",
  ],
};
