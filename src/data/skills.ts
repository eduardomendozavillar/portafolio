/** Technology skill rendered in the Habilidades section. */
export type Skill = {
  name: string;
  category: string;
  /** English variant (S11): category names only; tech names stay as-is. */
  en?: Partial<Pick<Skill, "category">>;
};

/**
 * Real CV v2 skill set (2026-10-21, source of truth), grouped for the
 * Habilidades section. Mirrors the CV's HABILIDADES block exactly — no
 * invented technologies, no "Vibe Coding" (the CV says Spec-Driven
 * Development).
 */
export const skills: Skill[] = [
  { name: "TypeScript", category: "Lenguajes", en: { category: "Languages" } },
  { name: "JavaScript", category: "Lenguajes", en: { category: "Languages" } },
  { name: "Python", category: "Lenguajes", en: { category: "Languages" } },
  { name: "Java", category: "Lenguajes", en: { category: "Languages" } },
  { name: "SQL", category: "Lenguajes", en: { category: "Languages" } },
  { name: "HTML/CSS", category: "Frontend", en: { category: "Frontend" } },
  { name: "Next.js", category: "Frontend", en: { category: "Frontend" } },
  { name: "React.js", category: "Frontend", en: { category: "Frontend" } },
  { name: "Angular", category: "Frontend", en: { category: "Frontend" } },
  { name: "Tailwind CSS", category: "Frontend", en: { category: "Frontend" } },
  { name: "Node.js", category: "Backend", en: { category: "Backend" } },
  { name: "Express", category: "Backend", en: { category: "Backend" } },
  { name: "FastAPI", category: "Backend", en: { category: "Backend" } },
  { name: "Fastify", category: "Backend", en: { category: "Backend" } },
  { name: "APIs REST", category: "Backend", en: { category: "Backend" } },
  { name: "LLMs locales y en la nube", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "RAG", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "Orquestación de agentes", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "MCP (Model Context Protocol)", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "Skills", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "n8n", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "PostgreSQL", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "SQLite", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "Firebase/Firestore", category: "IA / Datos", en: { category: "AI / Data" } },
  { name: "Docker", category: "Herramientas y métodos", en: { category: "Tools and methods" } },
  { name: "GitHub", category: "Herramientas y métodos", en: { category: "Tools and methods" } },
  { name: "Vercel", category: "Herramientas y métodos", en: { category: "Tools and methods" } },
  { name: "CLI", category: "Herramientas y métodos", en: { category: "Tools and methods" } },
  { name: "Spec-Driven Development", category: "Herramientas y métodos", en: { category: "Tools and methods" } },
  { name: "Vitest", category: "Pruebas", en: { category: "Testing" } },
  { name: "Pruebas E2E", category: "Pruebas", en: { category: "Testing" } },
  { name: "Git", category: "Otras", en: { category: "Other" } },
  { name: "VS Code", category: "Otras", en: { category: "Other" } },
  { name: "Windows/Linux", category: "Otras", en: { category: "Other" } },
];
