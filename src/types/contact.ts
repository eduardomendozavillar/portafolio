/**
 * Payload accepted by POST /api/contact after validation.
 * Fields are already trimmed and the email lowercased (see zod schema).
 */
export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};