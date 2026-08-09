#!/usr/bin/env node
/**
 * Optional Admin SDK seed for the Firestore `projects` collection.
 * Requires FIREBASE_SERVICE_ACCOUNT (JSON) in the environment.
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT='{...}' node scripts/seed-projects.mjs
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  console.error("FIREBASE_SERVICE_ACCOUNT is not set. Aborting seed.");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(raw);
} catch {
  console.error("FIREBASE_SERVICE_ACCOUNT is not valid JSON. Aborting seed.");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

const projects = [
  {
    title: "Cartelera editorial",
    slug: "cartelera-editorial",
    summary:
      "Generador de carteleras tipográficas para editoriales independientes, con export a PDF.",
    description:
      "Proyecto de diseño y desarrollo full-stack.\n\nGenera composiciones editoriales a partir de plantillas, ajusta rejilla tipográfica en vivo y exporta listas para imprenta.",
    technologies: ["Next.js", "TypeScript", "Firestore", "Tailwind CSS"],
    links: { repo: "https://github.com/example/cartelera-editorial" },
    featured: true,
    sortOrder: 1,
  },
  {
    title: "Museo de la palabra",
    slug: "museo-de-la-palabra",
    summary:
      "Archivo digital de crónicas y relatos orales con búsqueda semántica.",
    description:
      "Plataforma de preservación cultural.\n\nCatalogación, transcripción y búsqueda por temas de más de mil relatos orales.",
    technologies: ["React", "Node.js", "Firestore", "OpenAI API"],
    links: { demo: "https://museo-de-la-palabra.example.com" },
    featured: false,
    sortOrder: 2,
  },
];

const col = db.collection("projects");

for (const project of projects) {
  const now = FieldValue.serverTimestamp();
  await col.add({ ...project, createdAt: now, updatedAt: now });
  console.log(`Seeded project "${project.title}"`);
}

console.log(`Done. Seeded ${projects.length} projects.`);