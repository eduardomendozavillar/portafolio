/**
 * Ambient background (portfolio-rebrand 06): floating dust particles plus
 * red/bone wireframe node-network figures drifting slowly behind the content.
 * Pure decoration — fixed, pointer-events-none, aria-hidden, and fully static
 * under prefers-reduced-motion.
 */
export function BackgroundFigures() {
  return (
    <>
      <div aria-hidden="true" className="bg-dust" />
      {/* Wordmark de fondo (rebrand: densidad del hero): un "EV." gigante
          en outline detrás del contenido y una tira vertical en el borde
          derecho. Solo fondo: nunca intercepta interacción. */}
      <div aria-hidden="true" className="bg-wordmark">EV.</div>
      <div aria-hidden="true" className="bg-wordmark-strip">
        {"EV. · EV. · EV. · EV. · EV. · EV. · EV. · EV."}
      </div>
      <svg
        aria-hidden="true"
        className="bg-figure bg-figure-1"
        viewBox="0 0 300 220"
        fill="none"
        stroke="rgba(179,43,30,0.55)"
        strokeWidth="1.4"
      >
        <path d="M20 180 L110 40 L200 150 L280 30 L200 150 L110 40 L20 180 L280 30" strokeLinejoin="round" />
        <circle cx="110" cy="40" r="4" fill="var(--color-accent)" />
        <circle cx="280" cy="30" r="3.5" fill="var(--color-ink)" />
        <circle cx="20" cy="180" r="3" fill="var(--color-cta)" />
        <circle cx="200" cy="150" r="4" fill="var(--color-accent)" />
      </svg>
      <svg
        aria-hidden="true"
        className="bg-figure bg-figure-2"
        viewBox="0 0 260 200"
        fill="none"
        stroke="rgba(237,230,224,0.22)"
        strokeWidth="1.3"
      >
        <path d="M130 10 L250 90 L170 190 L20 150 Z" />
        <path d="M130 10 L170 190 M250 90 L20 150" />
        <circle cx="130" cy="10" r="3" fill="var(--color-ink)" />
        <circle cx="170" cy="190" r="3" fill="var(--color-accent)" />
      </svg>
      <svg
        aria-hidden="true"
        className="bg-figure bg-figure-3"
        viewBox="0 0 240 180"
        fill="none"
        stroke="rgba(179,43,30,0.4)"
        strokeWidth="1.3"
      >
        <path d="M10 90 L90 10 L230 60 L160 170 Z" />
        <circle cx="90" cy="10" r="3" fill="var(--color-accent)" />
        <circle cx="230" cy="60" r="3" fill="var(--color-ink)" />
        <circle cx="160" cy="170" r="3" fill="var(--color-cta)" />
      </svg>
    </>
  );
}
