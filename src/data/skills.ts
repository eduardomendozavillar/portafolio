/** Technology skill rendered in the Habilidades section. */
export type Skill = {
  name: string;
  category: string;
};

/** Real skill set, grouped by category for the Habilidades section. */
export const skills: Skill[] = [
  { name: "Java", category: "Lenguajes" },
  { name: "Python", category: "Lenguajes" },
  { name: "TypeScript", category: "Lenguajes" },
  { name: "JavaScript", category: "Lenguajes" },
  { name: "Angular", category: "Frontend" },
  { name: "React.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "FastAPI", category: "Backend" },
  { name: "Spring Framework", category: "Backend" },
  { name: "Node.js", category: "Backend" },
  { name: "RAG", category: "Inteligencia artificial" },
  { name: "LLMs locales", category: "Inteligencia artificial" },
  { name: "Orquestación de agentes", category: "Inteligencia artificial" },
  { name: "n8n", category: "Inteligencia artificial" },
  { name: "SQL", category: "Datos" },
  { name: "Docker", category: "Herramientas" },
  { name: "GitHub", category: "Herramientas" },
  { name: "Spec-Driven Development", category: "Herramientas" },
  { name: "Vibe Coding", category: "Herramientas" },
];
