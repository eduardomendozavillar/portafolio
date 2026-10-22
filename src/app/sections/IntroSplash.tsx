"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

/** sessionStorage flag: the splash shows once per browsing session. */
export const INTRO_SEEN_KEY = "intro-splash-seen";

/** Visible hold before the fade-out starts. */
const HOLD_MS = 1000;
/** Fade-out duration (matches the CSS transition). */
const FADE_MS = 300;

const INTRO_STACK = ["Next.js", "RAG", "TypeScript", "Vercel"] as const;

function hasSeen(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    // Storage unavailable (private modes) → treat as seen: never trap users.
    return true;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Blocking intro splash (portfolio-recruiter): the load moment — avatar, name,
 * stack line and progress bar — shown ONCE per session for ~1.2s, skippable
 * with a click or Escape, and never a trap:
 * - no JS → the embedded <noscript> style hides it entirely;
 * - prefers-reduced-motion → globals.css hides it before first paint;
 * - revisits → the inline pre-paint script + mount check remove it instantly.
 * Decorative (aria-hidden): the real SSR page is always present behind it.
 */
export function IntroSplash() {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (hasSeen() || prefersReducedMotion()) {
      // Async defer (react-hooks rule: no sync setState in effect bodies).
      // A 0ms timer instead of rAF: also advanceable under fake timers.
      const defer = setTimeout(() => setDismissed(true), 0);
      return () => clearTimeout(defer);
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let dismissedTimer: ReturnType<typeof setTimeout> | undefined;
    let settled = false;

    function finish() {
      if (settled) return;
      settled = true;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      clearTimeout(holdTimer);
      setExiting(true);
      dismissedTimer = setTimeout(() => {
        try {
          sessionStorage.setItem(INTRO_SEEN_KEY, "1");
        } catch {
          /* non-fatal: splash repeats instead of trapping */
        }
        document.body.style.overflow = previous;
        // Async defer, same rule as above.
        const defer = setTimeout(() => setDismissed(true), 0);
        void defer;
      }, FADE_MS);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
    }
    function onPointerDown() {
      finish();
    }

    const holdTimer = setTimeout(finish, HOLD_MS);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      clearTimeout(holdTimer);
      clearTimeout(dismissedTimer);
      document.body.style.overflow = previous;
    };
  }, []);

  if (dismissed) return null;

  const overlayClasses = exiting
    ? "fixed inset-0 z-[80] flex items-center justify-center bg-background opacity-0 transition-opacity duration-300"
    : "fixed inset-0 z-[80] flex items-center justify-center bg-background transition-opacity duration-300";

  return (
    <div
      data-intro-splash="true"
      aria-hidden="true"
      className={overlayClasses}
    >
      <noscript>
        {/* No JS = no one to dismiss the splash: hide it outright. */}
        <style>{`[data-intro-splash]{display:none!important}`}</style>
      </noscript>
      {/* Pre-paint guard for revisits: runs while parsing, before first
          paint, so a returning visitor never sees the splash again. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")==="1"){var s=document.querySelector("[data-intro-splash]");s&&s.remove();}}catch(e){}`,
        }}
      />

      <div className="pointer-events-none flex flex-col items-center gap-5 px-6 text-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-accent/40 [animation:intro-rise_600ms_ease-out_both]">
          <Image
            src="/images/profile.webp"
            alt=""
            width={224}
            height={224}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <div className="[animation:intro-rise_600ms_ease-out_120ms_both]">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {profile.role}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {profile.name}
          </p>
        </div>
        <p className="text-sm text-ink-muted [animation:intro-rise_600ms_ease-out_240ms_both]">
          {INTRO_STACK.join("  •  ")}
        </p>
        <div
          className="mt-2 h-0.5 w-40 overflow-hidden rounded-full bg-line"
          role="presentation"
        >
          <div className="intro-bar h-full w-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </div>
  );
}
