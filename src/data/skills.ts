/** Technology skill rendered in the Habilidades section. */
export type Skill = {
  name: string;
  category: string;
};

/** Editable list — grouped by category for the Habilidades section. */
export const skills: Skill[] = [
  { name: "TypeScript", category: "Lenguajes" },
  { name: "JavaScript", category: "Lenguajes" },
  { name: "Next.js", category: "Frameworks" },
  { name: "React", category: "Frameworks" },
  { name: "Node.js", category: "Backend" },
  { name: "Firebase / Firestore", category: "Backend" },
  { name: "Tailwind CSS", category: "Herramientas" },
  { name: "Vitest", category: "Herramientas" },
];