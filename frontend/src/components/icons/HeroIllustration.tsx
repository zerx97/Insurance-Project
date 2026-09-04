import { motion } from 'framer-motion';

// A custom-built layered illustration (not a stock image) - a stack of policy documents
// with a shield-and-checkmark seal, orbited by slow-drifting rings. Built entirely in SVG/CSS
// so it never depends on an external image URL that could break.
export default function HeroIllustration() {
  return (
    <div className="hero-illustration">
      <motion.div
        className="orbit-ring ring-a"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="orbit-ring ring-b"
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="doc-stack"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
          {/* back document */}
          <rect x="70" y="50" width="120" height="150" rx="4" fill="var(--parchment-dim)" stroke="var(--ink)" strokeWidth="1.5" transform="rotate(-8 130 125)" />
          {/* middle document */}
          <rect x="80" y="45" width="120" height="150" rx="4" fill="#fff" stroke="var(--ink)" strokeWidth="1.5" transform="rotate(4 140 120)" />
          <g transform="rotate(4 140 120)" opacity="0.5">
            <line x1="95" y1="70" x2="185" y2="70" stroke="var(--ink)" strokeWidth="2" />
            <line x1="95" y1="82" x2="175" y2="82" stroke="var(--ink)" strokeWidth="1.5" />
            <line x1="95" y1="94" x2="180" y2="94" stroke="var(--ink)" strokeWidth="1.5" />
            <line x1="95" y1="150" x2="150" y2="150" stroke="var(--brass)" strokeWidth="2" />
          </g>

          {/* seal / shield */}
          <g transform="translate(140 150)">
            <circle r="46" fill="var(--ink)" />
            <path
              d="M0 -30 L26 -20 V0 C26 18 14 30 0 36 C-14 30 -26 18 -26 0 V-20 Z"
              fill="none" stroke="var(--brass-bright)" strokeWidth="2.5" strokeLinejoin="round"
            />
            <path d="M-11 0 L-2 9 L14 -10" stroke="var(--brass-bright)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
