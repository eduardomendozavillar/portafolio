// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Certificaciones } from "./Certificaciones";
import { certificates } from "@/data/certificates";

/**
 * Certifications section (portfolio-rebrand S6): the CV's 4 certifications
 * featured on top, the rest behind a native <details> expander (no JS).
 * Every provided link renders as a "Verificar" anchor; items without a
 * public link render without one (like the private projects).
 */

describe("Certificaciones", () => {
  it("features the four CV certifications with their links", () => {
    render(<Certificaciones />);

    expect(screen.getByText("AI Engineer for Developers Associate (AIED)")).toBeTruthy();
    expect(screen.getByText("Google Associate Cloud Engineer")).toBeTruthy();
    expect(screen.getByText("AI+ Foundation")).toBeTruthy();
    expect(screen.getByText("SQL Fundamentals")).toBeTruthy();

    const verify = screen.getAllByRole("link", { name: "Verificar" });
    expect(verify.some((a) => (a.getAttribute("href") ?? "").includes("AIEDA0012651489251"))).toBe(true);
    expect(verify.some((a) => (a.getAttribute("href") ?? "").includes("26acbb4e"))).toBe(true);
  });

  it("hides the remaining certifications behind the Ver todas expander", () => {
    const { container } = render(<Certificaciones />);

    const details = container.querySelector("details");
    expect(details).toBeTruthy();
    expect(screen.getByText(/Ver todas/).textContent).toContain(
      `(+${certificates.length - 4} certificaciones más)`,
    );

    // The expanded list holds every non-featured certificate.
    const expanded = details?.querySelectorAll("li");
    expect(expanded?.length).toBe(certificates.length - 4);
    expect(details?.textContent).toContain("GitHub Foundations");
    expect(details?.textContent).toContain("Aprende SQL");
  });

  it("marks every item with its issuer", () => {
    const { container } = render(<Certificaciones />);

    expect(container.textContent).toContain("DataCamp");
    expect(container.textContent).toContain("Certificados IT");
    expect(container.textContent).toContain("Google · Coursera");
  });
});
