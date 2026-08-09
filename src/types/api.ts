/**
 * Standard JSON envelope returned by the API route handlers.
 * Error messages are Spanish and user-facing.
 */
export type ApiResponse = {
  ok: boolean;
  /** Present when the write succeeded (201). */
  id?: string;
  /** Spanish error message (400 / 429 / 500). */
  error?: string;
};