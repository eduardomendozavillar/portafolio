import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin singleton (design D3).
 *
 * SERVER-ONLY by construction:
 * - The `server-only` package is NOT resolvable in this Next 16 install
 *   (verified: node_modules/server-only absent), so the import is dropped
 *   and the boundary is enforced in code instead:
 *     1. This module is imported only from Route Handlers and the seed
 *        script — never from client components.
 *     2. A runtime guard throws if it ever evaluates on the client.
 * - Credentials come exclusively from `FIREBASE_SERVICE_ACCOUNT` (JSON).
 *   Never prefix the variable with `NEXT_PUBLIC_`.
 * - Lazy init on first request; the app/firestore instances are cached.
 */

let cachedFirestore: Firestore | null = null;

function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "src/lib/firebase/admin.ts can only run on the server. " +
        "Never import it from a client component.",
    );
  }
}

/**
 * Returns the cached Firestore instance, initializing the Admin app lazily
 * from FIREBASE_SERVICE_ACCOUNT on first call.
 */
export function getAdminFirestore(): Firestore {
  assertServerOnly();

  if (cachedFirestore !== null) {
    return cachedFirestore;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is not set. Configure it in the server environment " +
        "(never with a NEXT_PUBLIC_ prefix).",
    );
  }

  let serviceAccount: ServiceAccount;
  try {
    serviceAccount = JSON.parse(raw) as ServiceAccount;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT must be a valid JSON service account object.");
  }

  const app =
    getApps().length === 0
      ? initializeApp({ credential: cert(serviceAccount) })
      : getApps()[0]!;

  cachedFirestore = getFirestore(app);
  return cachedFirestore;
}

/** True when server credentials are present; used to gate integration tests. */
export function hasFirestoreCredentials(): boolean {
  assertServerOnly();
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}