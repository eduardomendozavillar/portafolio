import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * Shared Vitest setup (task 4.1).
 *
 * @testing-library/react only auto-cleans up when a global `afterEach` is
 * available (vitest `globals: true`). This project keeps explicit imports, so
 * cleanup is registered manually. It is a no-op in files that never rendered
 * anything (unit/integration suites loaded this setup too).
 */
afterEach(() => {
  cleanup();
});