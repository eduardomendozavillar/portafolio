import { Resend } from "resend";

/**
 * Send a notification email when a new contact message is received.
 *
 * This is best-effort: if the email fails, the contact is still saved.
 * Requires RESEND_API_KEY and NOTIFICATION_EMAIL env vars.
 */
export async function sendContactNotification(payload: {
  name: string;
  email: string;
  message: string;
  id: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set; skipping notification.");
    return;
  }
  if (!to) {
    console.warn("[email] NOTIFICATION_EMAIL not set; skipping notification.");
    return;
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: "Portafolio <onboarding@resend.dev>",
      to: [to],
      subject: `Nuevo mensaje de contacto — ${payload.name}`,
      html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nuevo mensaje de contacto</title>
</head>
<body style="font-family:system-ui,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#0a0e17;border-bottom:2px solid #22d3ee;padding-bottom:8px;">Nuevo mensaje de contacto</h2>
  <table style="width:100%;border-collapse:collapse;margin-top:16px;">
    <tr>
      <td style="padding:8px 0;font-weight:600;width:100px;">Nombre:</td>
      <td style="padding:8px 0;">${escapeHtml(payload.name)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:600;">Email:</td>
      <td style="padding:8px 0;"><a href="mailto:${encodeURIComponent(payload.email)}">${escapeHtml(payload.email)}</a></td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:600;vertical-align:top;">Mensaje:</td>
      <td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(payload.message)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:600;">ID:</td>
      <td style="padding:8px 0;font-family:monospace;font-size:12px;color:#666;">${payload.id}</td>
    </tr>
  </table>
  <p style="margin-top:24px;font-size:12px;color:#888;">
    Enviado desde el formulario de contacto de tu portafolio.
  </p>
</body>
</html>`,
      text: `Nuevo mensaje de contacto\n\nNombre: ${payload.name}\nEmail: ${payload.email}\n\nMensaje:\n${payload.message}\n\nID: ${payload.id}`,
    });

    if (error) {
      console.error("[email] Resend error:", error.message);
    } else {
      console.log("[email] Notification sent to", to);
    }
  } catch (err) {
    console.error("[email] Failed to send notification:", err);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
