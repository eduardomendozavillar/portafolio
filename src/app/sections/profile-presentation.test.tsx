// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

vi.mock("next/image", () => ({
  default: function MockImage({
    alt,
    src,
    ...rest
  }: {
    alt: string;
    src: string;
    priority?: boolean;
    width?: number;
    height?: number;
    className?: string;
    sizes?: string;
  }) {
    const { priority, ...imgProps } = rest as {
      priority?: boolean;
      width?: number;
      height?: number;
      className?: string;
      sizes?: string;
    };
    void priority;
    // eslint-disable-next-line @next/next/no-img-element -- test double for next/image
    return <img alt={alt} src={src} {...imgProps} />;
  },
}));

/**
 * RTL suite for the profile-presentation surface:
 * Header brand/nav/socials, Footer socials, and the Hero-as-thesis
 * signature. Guards the exact real social URLs, the real identity, and
 * the emphasis phrase against drift.
 */

const NAV_LINKS = [
  "#inicio",
  "#proyectos",
  "#sobre-mi",
  "#habilidades",
  "#experiencia",
  "#educacion",
  "#contacto",
];

function expectNewTabAnchor(anchor: HTMLAnchorElement) {
  expect(anchor.target).toBe("_blank");
  expect(anchor.rel).toContain("noopener");
  expect(anchor.rel).toContain("noreferrer");
}

describe("Header", () => {
  it("hires: desktop CTA labelled Contratame linking to #contacto", () => {
    render(<Header />);

    const hire = screen.getByRole("link", { name: "Contratame" });
    expect(hire.getAttribute("href")).toBe("#contacto");
  });

  it("marks the section at the reading line as current while scrolling", async () => {
    const { container } = render(<Header />);

    // No scroll yet: no section is current.
    expect(document.querySelector('[aria-current="true"]')).toBeNull();

    // Isolated header test: install the section elements the scrollspy reads.
    for (const id of ["inicio", "sobre-mi", "habilidades", "proyectos"]) {
      const section = document.createElement("section");
      section.id = id;
      document.body.appendChild(section);
    }

    // Simulate scrolling into the second section (skills crossed the line).
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: Element) {
        const tops: Record<string, number> = {
          inicio: -400,
          "sobre-mi": -100,
          habilidades: 200,
          proyectos: 1200,
        };
        const id = this.id;
        return {
          top: tops[id] ?? 9999,
          height: 400,
          bottom: (tops[id] ?? 9999) + 400,
          width: 100,
          left: 0,
          right: 100,
          x: 0,
          y: tops[id] ?? 0,
          toJSON: () => undefined,
        } as unknown as DOMRect;
      },
    );
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });

    fireEvent.scroll(document);

    // The scrollspy defers its first setState (react-hooks rule); wait for it.
    await waitFor(() => {
      expect(document.querySelector('[aria-current="true"]')).toBeTruthy();
    });
    const current = document.querySelector('[aria-current="true"]') as HTMLElement;
    expect(current.textContent).toContain("Habilidades");
    expect(container).toBeTruthy();
  });

  it("renders the real name as the brand linking to the hero anchor", () => {
    render(<Header />);

    const brand = screen.getByRole("link", { name: new RegExp(profile.name) });
    expect(brand.getAttribute("href")).toBe("#inicio");
    expect(screen.getByRole("banner")).toBeTruthy();
  });

  it("renders every main anchor link", () => {
    render(<Header />);

    for (const href of NAV_LINKS) {
      expect(document.querySelector(`a[href="${href}"]`)).toBeTruthy();
    }
  });

  it("renders a desktop CTA to the contact section", () => {
    render(<Header />);

    const hire = screen.getAllByRole("link", { name: "Contratame" });
    expect(hire.some((link) => link.getAttribute("href") === "#contacto")).toBe(
      true,
    );
  });

  it("renders the exact social URLs in new-tab anchors", () => {
    render(<Header />);

    for (const social of socials) {
      const link = screen.getAllByRole("link", { name: social.label })[0];
      expect(link.getAttribute("href")).toBe(social.href);
      expectNewTabAnchor(link as HTMLAnchorElement);
    }
  });

  it("exposes an accessible mobile menu toggle", () => {
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Abrir menú" });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-controls")).toBeTruthy();
  });
});

describe("Footer", () => {
  it("renders the exact social URLs in new-tab anchors", () => {
    render(<Footer />);

    for (const social of socials) {
      const link = screen.getByRole("link", { name: social.label });
      expect(link.getAttribute("href")).toBe(social.href);
      expectNewTabAnchor(link as HTMLAnchorElement);
    }
  });

  it("renders the copyright with the real name", () => {
    render(<Footer />);

    expect(screen.getByText(new RegExp(profile.name))).toBeTruthy();
  });
});

describe("Hero", () => {
  it("shows the availability badge with a pulse dot", () => {
    render(<Hero />);

    const badge = document.querySelector("[data-availability]") as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.textContent).toContain("Disponible para nuevas oportunidades");
    expect(badge.querySelector("span")?.className).toContain("animate-pulse");
  });

  it("renders the role eyebrow, real name and call to actions", () => {
    render(<Hero />);

    expect(screen.getByText(profile.role)).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      profile.name,
    );
    expect(
      screen.getByRole("link", { name: "Ver proyectos" }).getAttribute("href"),
    ).toBe("#proyectos");
    expect(
      screen.getByRole("link", { name: "Contáctame" }).getAttribute("href"),
    ).toBe("#contacto");
  });

  it("renders the profile photo with Spanish alt text", () => {
    render(<Hero />);

    const photo = screen.getByRole("img", {
      name: `Foto de perfil de ${profile.name}`,
    });
    expect(photo.getAttribute("src")).toBe("/images/profile.webp");
  });

  it("renders social links near the CTAs as new-tab anchors", () => {
    render(<Hero />);

    for (const social of socials) {
      const link = screen.getByRole("link", { name: social.label });
      expect(link.getAttribute("href")).toBe(social.href);
      expectNewTabAnchor(link as HTMLAnchorElement);
    }
  });

  it("highlights the emphasis phrase from the tagline as italic accent", () => {
    render(<Hero />);

    const thesis = screen.getByText((content) =>
      content.includes("sistemas claros, seguros y escalables"),
    );
    expect(thesis).toBeTruthy();

    const emphasis = thesis.querySelector("em");
    expect(emphasis).toBeTruthy();
    expect(emphasis?.textContent).toBe("inteligencia artificial");

    expect(profile.tagline).toContain("inteligencia artificial");
  });

  it("offers the CV as a same-document download next to the CTAs", () => {
    render(<Hero />);

    const cv = screen.getByRole("link", { name: "Descargar CV" });
    expect(cv.getAttribute("href")).toBe("/CV_Eduardo_Mendoza_Ingeniero_IA.pdf");
    expect(cv.getAttribute("download")).not.toBeNull();
  });
});
