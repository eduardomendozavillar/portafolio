import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD, isHoneypotFilled } from "./honeypot";

describe("isHoneypotFilled", () => {
  it("returns false when the field is absent", () => {
    expect(isHoneypotFilled({ name: "Ana" })).toBe(false);
  });

  it("returns false when the field is an empty string", () => {
    expect(isHoneypotFilled({ [HONEYPOT_FIELD]: "" })).toBe(false);
  });

  it("returns false when the field is whitespace only", () => {
    expect(isHoneypotFilled({ [HONEYPOT_FIELD]: "   " })).toBe(false);
  });

  it("returns true when the field holds a real value", () => {
    expect(isHoneypotFilled({ [HONEYPOT_FIELD]: "http://spam.example" })).toBe(true);
  });

  it("returns true for non-string values like true", () => {
    expect(isHoneypotFilled({ [HONEYPOT_FIELD]: true })).toBe(true);
  });

  it("returns false when the body is empty", () => {
    expect(isHoneypotFilled({})).toBe(false);
  });
});