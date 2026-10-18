// Site-wide film grain. Inline SVG noise, so there's no image request.
const noise =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function FilmGrain() {
  return (
    <div
      aria-hidden
      className="film-grain pointer-events-none fixed -inset-[50%] z-[90] opacity-[0.07] mix-blend-overlay"
      style={{ backgroundImage: noise }}
    />
  );
}
