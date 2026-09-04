import { useMemo } from 'react';

// A lightweight, dependency-free starfield: ~90 stars with randomized position, size, and
// twinkle timing, plus two "shooting star" streaks on independent long-interval loops.
// Pure CSS animation (no canvas, no per-frame JS) so it stays cheap even with several
// instances mounted (top bar strip, hero, auth panel) at once.
export default function Starfield({ density = 90 }: { density?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.6,
        delay: Math.random() * 6,
        duration: Math.random() * 3 + 2,
      })),
    [density]
  );

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <span className="shooting-star shooting-star-a" />
      <span className="shooting-star shooting-star-b" />
    </div>
  );
}
