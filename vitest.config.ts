import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration (task 4.1).
 *
 * - The `@/*` alias mirrors tsconfig paths so component tests import exactly
 *   like the app (`@/components/...`, `@/lib/...`).
 * - Unit and integration suites keep the default node environment: they are
 *   pure or use Request/Response directly. The RTL component suites opt into
 *   jsdom via a `@vitest-environment jsdom` docblock pragma (vitest 4's
 *   per-file environment mechanism — `environmentMatchGlobs` was removed in
 *   v4).
 *   A GLOBAL jsdom environment would break the integration suite: the Admin
 *   singleton's server-only guard (`typeof window !== "undefined"`) throws in
 *   jsdom, and `api-routes.integration.test.ts` calls `hasFirestoreCredentials()`
 *   at module load.
 * - The integration suite is env-gated in code via `describe.skipIf` and stays
 *   node, so `npm test` is green without FIREBASE_SERVICE_ACCOUNT.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.integration.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
});