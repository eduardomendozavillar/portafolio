// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  "#sobre-mi",
  "#habilidades",
  "#proyectos",
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

  it("renders a desktop Contacto CTA to the contact section", () => {
    render(<Header />);

    const contactLinks = screen.getAllByRole("link", { name: "Contacto" });
    expect(
      contactLinks.some((link) => link.getAttribute("href") === "#contacto"),
    ).toBe(true);
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
});
