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
  // Add real projects here. Seed test data was removed (2026-08).
];

const col = db.collection("projects");

for (const project of projects) {
  const now = FieldValue.serverTimestamp();
  await col.add({ ...project, createdAt: now, updatedAt: now });
  console.log(`Seeded project "${project.title}"`);
}

console.log(`Done. Seeded ${projects.length} projects.`);