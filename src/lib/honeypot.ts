/**
 * Honeypot helper (design D2).
 *
 * The ContactForm renders a visually hidden field named HONEYPOT_FIELD
 * (aria-hidden, tabIndex -1). Human visitors never fill it; bots often do.
 * The API drops submissions where the field is non-empty and silently returns
 * success so bots are never educated about the trap.
 */
export const HONEYPOT_FIELD = "website";

/**
 * Returns true when the honeypot field holds a non-empty value.
 * An empty string, a whitespace-only string, or a missing field is "clean".
 */
export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null && value !== "";
}
