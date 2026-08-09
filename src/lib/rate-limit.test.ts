import { describe, expect, it } from "vitest";
import {
  createRateLimiter,
  getClientIp,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  type Clock,
  type RateLimitStore,
} from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the max requests within the window", () => {
    let now = 0;
    const clock: Clock = () => now;
    const limiter = createRateLimiter({ now: clock });

    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      const verdict = limiter.check("ip-1");
      expect(verdict.allowed).toBe(true);
      expect(verdict.retryAfterSeconds).toBe(0);
      now += 1_000;
    }
  });

  it("blocks the burst request after the window is full", () => {
    let now = 0;
    const limiter = createRateLimiter({ now: () => now });

    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      limiter.check("ip-1");
      now += 1_000;
    }

    const verdict = limiter.check("ip-1");
    expect(verdict.allowed).toBe(false);
    expect(verdict.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("refills once the window elapses", () => {
    let now = 0;
    const limiter = createRateLimiter({ now: () => now });

    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      limiter.check("ip-1");
      now += 1_000;
    }
    expect(limiter.check("ip-1").allowed).toBe(false);

    now += RATE_LIMIT_WINDOW_MS;
    const verdict = limiter.check("ip-1");
    expect(verdict.allowed).toBe(true);
  });

  it("isolates keys: one key's burst does not throttle another", () => {
    let now = 0;
    const limiter = createRateLimiter({ now: () => now });

    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      limiter.check("ip-bad");
      now += 1_000;
    }
    expect(limiter.check("ip-bad").allowed).toBe(false);
    expect(limiter.check("ip-good").allowed).toBe(true);
  });

  it("honors an injected store and window/max options", () => {
    let now = 0;
    const hits = new Map<string, number[]>();
    const store: RateLimitStore = {
      get(key) {
        return hits.get(key);
      },
      set(key, newHits) {
        hits.set(key, newHits);
      },
    };
    const limiter = createRateLimiter({
      now: () => now,
      store,
      windowMs: 10_000,
      maxRequests: 1,
    });

    expect(limiter.check("ip-1").allowed).toBe(true);
    now += 1_000;
    expect(limiter.check("ip-1").allowed).toBe(false);
  });
});

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    const request = new Request("https://example.test/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18" },
    });
    expect(getClientIp(request)).toBe("203.0.113.5");
  });

  it("falls back to unknown when the header is missing", () => {
    const request = new Request("https://example.test/api/contact");
    expect(getClientIp(request)).toBe("unknown");
  });

  it("trims the first entry", () => {
    const request = new Request("https://example.test/api/contact", {
      headers: { "x-forwarded-for": " 203.0.113.5 " },
    });
    expect(getClientIp(request)).toBe("203.0.113.5");
  });
});