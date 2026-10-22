/** Technology skill rendered in the Habilidades section. */
export type Skill = {
  name: string;
  category: string;
};

/**
 * Real CV v2 skill set (2026-10-21, source of truth), grouped for the
 * Habilidades section. Mirrors the CV's HABILIDADES block exactly — no
 * invented technologies, no "Vibe Coding" (the CV says Spec-Driven
 * Development).
 */
export const skills: Skill[] = [
  { name: "TypeScript", category: "Lenguajes" },
  { name: "JavaScript", category: "Lenguajes" },
  { name: "Python", category: "Lenguajes" },
  { name: "Java", category: "Lenguajes" },
  { name: "SQL", category: "Lenguajes" },
  { name: "HTML/CSS", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "React.js", category: "Frontend" },
  { name: "Angular", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "FastAPI", category: "Backend" },
  { name: "Fastify", category: "Backend" },
  { name: "APIs REST", category: "Backend" },
  { name: "LLMs locales y en la nube", category: "IA / Datos" },
  { name: "RAG", category: "IA / Datos" },
  { name: "Orquestación de agentes", category: "IA / Datos" },
  { name: "MCP (Model Context Protocol)", category: "IA / Datos" },
  { name: "Skills", category: "IA / Datos" },
  { name: "n8n", category: "IA / Datos" },
  { name: "PostgreSQL", category: "IA / Datos" },
  { name: "SQLite", category: "IA / Datos" },
  { name: "Firebase/Firestore", category: "IA / Datos" },
  { name: "Docker", category: "Herramientas y métodos" },
  { name: "GitHub", category: "Herramientas y métodos" },
  { name: "Vercel", category: "Herramientas y métodos" },
  { name: "CLI", category: "Herramientas y métodos" },
  { name: "Spec-Driven Development", category: "Herramientas y métodos" },
  { name: "Vitest", category: "Pruebas" },
  { name: "Pruebas E2E", category: "Pruebas" },
  { name: "Git", category: "Otras" },
  { name: "VS Code", category: "Otras" },
  { name: "Windows/Linux", category: "Otras" },
];
