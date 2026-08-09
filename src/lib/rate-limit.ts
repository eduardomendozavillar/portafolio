/**
 * In-memory, per-key rate limiter (design D2).
 *
 * Best-effort abuse control for a single-instance deployment (Vercel free
 * tier). State resets on cold start and is not shared across instances; a
 * Redis-backed store is documented as a future option but out of scope.
 *
 * The clock and store are injectable so the pure logic is unit-testable
 * without timers or globals.
 */

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 3;
export const RATE_LIMIT_UNKNOWN_IP = "unknown";

export type Clock = () => number;

export interface RateLimitStore {
  get(key: string): number[] | undefined;
  set(key: string, hits: number[]): void;
}

/** Map-backed store; entries with no hits within the window are pruned. */
export class InMemoryRateLimitStore implements RateLimitStore {
  private readonly hits = new Map<string, number[]>();

  get(key: string): number[] | undefined {
    return this.hits.get(key);
  }

  set(key: string, hits: number[]): void {
    if (hits.length === 0) {
      this.hits.delete(key);
      return;
    }
    this.hits.set(key, hits);
  }
}

export interface RateLimitVerdict {
  allowed: boolean;
  /** Seconds until the oldest hit leaves the window; 0 when allowed. */
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string): RateLimitVerdict;
}

export interface RateLimiterOptions {
  windowMs?: number;
  maxRequests?: number;
  store?: RateLimitStore;
  now?: Clock;
}

export function createRateLimiter(options: RateLimiterOptions = {}): RateLimiter {
  const windowMs = options.windowMs ?? RATE_LIMIT_WINDOW_MS;
  const maxRequests = options.maxRequests ?? RATE_LIMIT_MAX_REQUESTS;
  const store = options.store ?? new InMemoryRateLimitStore();
  const now = options.now ?? Date.now;

  return {
    check(key: string): RateLimitVerdict {
      const nowMs = now();
      const hits = (store.get(key) ?? []).filter((t) => t > nowMs - windowMs);

      if (hits.length >= maxRequests) {
        store.set(key, hits);
        const oldest = hits[0]!;
        const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - nowMs) / 1000));
        return { allowed: false, retryAfterSeconds };
      }

      hits.push(nowMs);
      store.set(key, hits);
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}

/**
 * Resolves the client key for a request: the first entry of the
 * `x-forwarded-for` header, falling back to RATE_LIMIT_UNKNOWN_IP.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || RATE_LIMIT_UNKNOWN_IP;
}
