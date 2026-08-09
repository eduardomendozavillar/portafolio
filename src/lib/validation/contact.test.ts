import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";

describe("contactSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      message: "Hola, quería consultar por un proyecto.",
    });
    expect(result.success).toBe(true);
  });

  it("trims name and message and lowercases + trims email", () => {
    const result = contactSchema.safeParse({
      name: "  Ana  ",
      email: "  ANA@EXAMPLE.COM  ",
      message: "  Hola, quería consultar por un proyecto.  ",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.name).toBe("Ana");
    expect(result.data.email).toBe("ana@example.com");
    expect(result.data.message).toBe("Hola, quería consultar por un proyecto.");
  });

  it("rejects an empty name after trim", () => {
    const result = contactSchema.safeParse({
      name: "   ",
      email: "ana@example.com",
      message: "Hola, quería consultar por un proyecto.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 100 characters", () => {
    const result = contactSchema.safeParse({
      name: "a".repeat(101),
      email: "ana@example.com",
      message: "Hola, quería consultar por un proyecto.",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a name with exactly 100 characters", () => {
    const result = contactSchema.safeParse({
      name: "a".repeat(100),
      email: "ana@example.com",
      message: "Hola, quería consultar por un proyecto.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = contactSchema.safeParse({
      name: "Ana",
      email: "no-es-un-correo",
      message: "Hola, quería consultar por un proyecto.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an email longer than 254 characters", () => {
    const result = contactSchema.safeParse({
      name: "Ana",
      email: `${"a".repeat(250)}@example.com`,
      message: "Hola, quería consultar por un proyecto.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 10 characters after trim", () => {
    const result = contactSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      message: "Corto",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message longer than 4000 characters", () => {
    const result = contactSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      message: "a".repeat(4001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a message with exactly 10 characters", () => {
    const result = contactSchema.safeParse({
      name: "Ana",
      email: "ana@example.com",
      message: "a".repeat(10),
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing fields", () => {
    const result = contactSchema.safeParse({ email: "ana@example.com" });
    expect(result.success).toBe(false);
  });
});