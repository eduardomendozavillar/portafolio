/**
 * Inline brand icon SVGs (portfolio-rebrand 06): no external assets — each
 * mark is a simplified, recognizable vector of the technology's logo.
 */
export function BrandIcon({ tech }: { tech: string }) {
  switch (tech) {
    case "TypeScript":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="3" fill="#3178C6" />
          <path d="M6.7 10.2h2.1V17h1.9v-6.8h2.1V8.5H6.7v1.7zm9-1.9c-1.5 0-2.4.7-2.8 1.4l1.4.9c.3-.5.7-.8 1.3-.8.6 0 1 .3 1 .8 0 .6-.5.8-1.3 1.2-1 .4-2 .9-2 2.3 0 1.3 1 2.2 2.4 2.2.9 0 1.6-.4 2-1.1l-1.3-.8c-.2.4-.5.6-1 .6-.5 0-.8-.3-.8-.7 0-.6.6-.8 1.4-1.2 1-.4 2-.9 2-2.3 0-1.4-1.1-2.5-2.7-2.5z" fill="#fff" />
        </svg>
      );
    case "Next.js":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#000" stroke="rgba(255,255,255,0.25)" />
          <path d="M8.5 16V8h1.6l4.4 5.7V8h1.5v8h-1.5l-4.5-5.9V16z" fill="#fff" />
        </svg>
      );
    case "React.js":
    case "React":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.1" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.1" transform="rotate(-60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="#61DAFB" strokeWidth="1.1" />
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        </svg>
      );
    case "Node.js":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l9 5v10l-9 5-9-5V7z" fill="#539E43" />
          <path d="M9.4 15.5V9h1.4l3.8 5V9H16v6.5h-1.4l-3.9-5.2v5.2z" fill="#fff" />
        </svg>
      );
    case "Express":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#242938" />
          <text x="12" y="15.5" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#fff" fontStyle="italic">ex</text>
        </svg>
      );
    case "Fastify":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#0B7B5B" />
          <path d="M6 17V7h2v8h4v2z" fill="#fff" />
          <path d="M13 7h2.2l1.6 4.2L18.4 7h2.1l-2.6 7.2c-.3.8-.9 1.3-1.8 1.3h-.9v-1.4h.5l.3-.8z" fill="#fff" opacity="0.85" />
        </svg>
      );
    case "FastAPI":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#009688" />
          <path d="M6 16c1.2-4 3-6 4-6.5-.4 2.2.6 3.5 2 3.8 2 .5 3.5-1 5-1.3.5 1.6-1 4.5-3.5 5.5-2.7 1.1-6-.2-7.5-1.5z" fill="#fff" />
          <circle cx="9" cy="8.5" r="1.6" fill="#fff" />
        </svg>
      );
    case "PostgreSQL":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#336791" />
          <path d="M12 5.5c-3.2 0-5.5 1.7-5.5 3.9v5.2c0 2.2 2.3 3.9 5.5 3.9s5.5-1.7 5.5-3.9V9.4c0-2.2-2.3-3.9-5.5-3.9z" fill="none" stroke="#fff" strokeWidth="1.2" />
          <path d="M8 9.5c1.5-.8 3-.8 4 0s2.5.8 4 0" fill="none" stroke="#fff" strokeWidth="1" />
        </svg>
      );
    case "SQL":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#003B57" />
          <rect x="6.5" y="7" width="11" height="10" rx="1.2" fill="none" stroke="#fff" strokeWidth="1.1" />
          <path d="M10 17c1-3 .8-5.5-.4-7.5" fill="none" stroke="#fff" strokeWidth="1" />
        </svg>
      );
    case "Firebase/Firestore":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#1a1512" />
          <path d="M13.5 2.5l-6.7 11h4.6l-1.4 8 6.8-11.4h-4.6z" fill="#FFA000" />
          <path d="M16.5 3.5l-4.9 8.3h3.4l-1 5.9 5-8.6h-3.3z" fill="#FFC64D" opacity="0.75" />
        </svg>
      );
    case "MCP (Model Context Protocol)":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#1a1512" />
          <path d="M4 13c3-6 6-8 9-6 2.4 1.6 1.5 4.5 4 5.2 1.8.5 3-.6 3-2.2 2.2 2.9 1 6.8-2.4 8.6-4.6 2.4-11.2.8-13.6-5.6z" fill="url(#mcp-grad)" />
          <defs>
            <linearGradient id="mcp-grad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#B32B1E" />
              <stop offset="1" stopColor="#ED6A5B" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "Docker":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#1D63ED" />
          <path d="M13.4 3h-3.2v4.1H6v3.2h4.2v4.1h3.2v-4.1h4.1V7.1h-4.1z" fill="#fff" opacity="0.95" />
          <path d="M13.4 13.2h3.4v3.4a1.3 1.3 0 01-1.3 1.3h-2.1zM10.2 13.2H6.9v3.4a1.3 1.3 0 001.3 1.3h2z" fill="#fff" opacity="0.7" />
        </svg>
      );
    case "Vercel":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#000" stroke="rgba(255,255,255,0.2)" />
          <path d="M12 5l9 15.5H3z" fill="#fff" />
        </svg>
      );
    case "Angular":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14.2 2L4.5 13.5h6.2L9.8 22 19.5 10h-6.4z" fill="#DD0031" />
        </svg>
      );
    case "Tailwind CSS":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#0b1220" />
          <path d="M19.6 6.3c1.2 1.7 1.9 3.6 1.7 5.7-.2 3-2.1 5.4-5.1 6.2-2.9.8-5.8-.2-7.3-2 .8-.2 1.9-.4 2.9-.9 2.5-1.2 5.7-3.4 6.4-6.2.4-1.3.3-2.3.1-2.9z" fill="#38BDF8" opacity="0.9" />
        </svg>
      );
    case "Vitest":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#1a1512" />
          <path d="M18.6 3.5L9.9 12l-1.7-1.7-3.5 3.5 4.9 4.9 9-9z" fill="#729B1B" />
          <path d="M5.5 6l3.6 3.6-1.4 1.4L4.1 7.4z" fill="#BD34FE" />
        </svg>
      );
    case "LLMs locales y en la nube":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="4" fill="#1a1512" />
          <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" fill="#ED6A5B" />
        </svg>
      );
    default:
      return null;
  }
}
