#!/usr/bin/env node
/**
 * One-off cleanup: delete the seed test projects from the Firestore
 * `projects` collection. Requires FIREBASE_SERVICE_ACCOUNT (JSON).
 *
 * Usage:
 *   node --env-file=.env.local scripts/delete-test-projects.mjs
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const TEST_TITLES = new Set(["Cartelera editorial", "Museo de la palabra"]);

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  console.error("FIREBASE_SERVICE_ACCOUNT is not set. Aborting.");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(raw);
} catch {
  console.error("FIREBASE_SERVICE_ACCOUNT is not valid JSON. Aborting.");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();
const col = db.collection("projects");

const snapshot = await col.get();
console.log(`Found ${snapshot.size} document(s) in "projects":`);

let deleted = 0;
for (const docSnap of snapshot.docs) {
  const title = docSnap.data()?.title ?? "(sin título)";
  const isTest = TEST_TITLES.has(title);
  console.log(`- ${docSnap.id} | "${title}"${isTest ? "  -> DELETE" : ""}`);
  if (isTest) {
    await col.doc(docSnap.id).delete();
    deleted += 1;
  }
}

console.log(`Done. Deleted ${deleted} test project(s).`);
