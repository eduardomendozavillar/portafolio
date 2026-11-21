import { Container } from "@/components/ui/Container";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

/** Footer: social profile links (open in a new tab) + copyright. */
export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <p className="text-sm text-ink-muted">
          © {new Date().getFullYear()} {profile.name}. Todos los derechos
          reservados.
        </p>
        <ul className="flex gap-6 text-sm font-medium text-ink">
          {socials.map((social) => (
            <li key={social.platform}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-line decoration-2 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}