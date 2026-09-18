"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/api";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

type Status = "idle" | "submitting" | "success" | "error";

type FormValues = {
  name: string;
  email: string;
  message: string;
  [HONEYPOT_FIELD]: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  message: "",
  [HONEYPOT_FIELD]: "",
};

const fieldClasses =
  "w-full rounded-md border border-line bg-paper-raised px-4 py-2.5 text-ink " +
  "placeholder:text-ink-muted/60 focus:border-accent focus:outline-none";

/**
 * Contact form (task 3.5): idle / submitting / success / error states.
 * Values are kept on failure so the visitor can retry; a visually hidden
 * honeypot field (aria-hidden, tabIndex -1) catches bots server-side.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const feedbackRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const response = await submitContact({
        name: values.name,
        email: values.email,
        message: values.message,
        // The honeypot value must reach the API or the server-side check
        // (isHoneypotFilled) can never see bot-filled submissions.
        [HONEYPOT_FIELD]: values[HONEYPOT_FIELD],
      });

      if (response.ok) {
        setStatus("success");
        // Only clear on success — failed submissions keep their values.
        setValues(initialValues);
        // Scroll the success message into view so the user sees it.
        setTimeout(() => {
          feedbackRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        }, 0);
        return;
      }

      setStatus("error");
      setError(
        response.error ?? "No se pudo enviar el mensaje. Inténtalo de nuevo.",
      );
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      }, 0);
    } catch {
      setStatus("error");
      setError(
        "No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.",
      );
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      }, 0);
    }
  }

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear success state when the user starts typing again so the form
    // becomes editable and the button re-enables.
    if (status === "success" && field !== HONEYPOT_FIELD) {
      setStatus("idle");
    }
  }

  const submitting = status === "submitting";
  const sent = status === "success";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl"
      aria-label="Formulario de contacto"
    >
      <div ref={feedbackRef}>
        {status === "success" ? (
          <p
            role="status"
            className="mb-6 rounded-md border border-accent/30 bg-accent-soft px-4 py-3 text-accent"
          >
            ¡Gracias! Tu mensaje se envió correctamente. Te responderé a la
            brevedad.
          </p>
        ) : null}

        {status === "error" && error ? (
          <p
            role="alert"
            className="mb-6 rounded-md border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-300"
          >
            {error}
          </p>
        ) : null}
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-ink">
            Nombre
          </label>
          <input
            id="nombre"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            className={fieldClasses}
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="mb-2 block text-sm font-medium text-ink">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="message"
            required
            maxLength={4000}
            rows={6}
            value={values.message}
            onChange={(event) => updateField("message", event.target.value)}
            className={fieldClasses}
          />
        </div>

        {/* Honeypot: hidden from humans and assistive tech, off the tab order. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor={HONEYPOT_FIELD}>No rellenar este campo</label>
          <input
            id={HONEYPOT_FIELD}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values[HONEYPOT_FIELD]}
            onChange={(event) => updateField(HONEYPOT_FIELD, event.target.value)}
          />
        </div>

        <Button type="submit" disabled={submitting || sent}>
          {submitting ? "Enviando…" : sent ? "Mensaje enviado ✓" : "Enviar mensaje"}
        </Button>
      </div>
    </form>
  );
}