import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

/*
 * Placeholder page for work unit 1: proves the design tokens and the typed
 * static data compile and render. The full section composition (header, hero,
 * Sobre mí, Habilidades, Proyectos, Experiencia, Educación, Contacto, footer)
 * lands in Phase 3.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
          {profile.role}
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-ink">
          {profile.name}
        </h1>
        <p className="mt-4 text-lg leading-8 text-ink-muted">{profile.tagline}</p>
        <ul className="mt-10 flex gap-6 text-sm font-medium text-ink">
          {socials.map((social) => (
            <li key={social.platform}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-teal decoration-2 underline-offset-4 hover:text-teal"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}