// Hand-drawn line icons, one per policy category, each carrying its own nebula-accent color
// (defined in index.css as --cat-auto / --cat-home / --cat-life / --cat-health).

export function AutoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M8 30 L11 20 Q12 17 16 17 H32 Q36 17 37 20 L40 30" stroke="var(--cat-auto)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="30" width="36" height="9" rx="2.5" stroke="var(--cat-auto)" strokeWidth="2.2" />
      <circle cx="14" cy="39" r="3.2" fill="var(--space-bg-3)" stroke="var(--cat-auto)" strokeWidth="2.2" />
      <circle cx="34" cy="39" r="3.2" fill="var(--space-bg-3)" stroke="var(--cat-auto)" strokeWidth="2.2" />
      <path d="M16 24 H32" stroke="var(--cat-auto)" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export function HomeIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M8 22 L24 9 L40 22" stroke="var(--cat-home)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 19 V38 H36 V19" stroke="var(--cat-home)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="20" y="27" width="8" height="11" stroke="var(--cat-home)" strokeWidth="2" />
      <path d="M31 15 V10 H35 V18.5" stroke="var(--cat-home)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function LifeIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 38 C10 29 6 21 10 15 C13.5 10 20 10.5 24 17 C28 10.5 34.5 10 38 15 C42 21 38 29 24 38 Z" stroke="var(--cat-life)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M15 22 H21 L23 18 L27 27 L29 22 H33" stroke="var(--cat-life)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    </svg>
  );
}

export function HealthIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 8 L38 14 V23 C38 33 32 39 24 42 C16 39 10 33 10 23 V14 Z" stroke="var(--cat-health)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M24 18 V30 M18 24 H30" stroke="var(--cat-health)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function categoryIcon(policyType: string, size = 40) {
  switch (policyType?.toUpperCase()) {
    case 'AUTO': return <AutoIcon size={size} />;
    case 'HOME': return <HomeIcon size={size} />;
    case 'LIFE': return <LifeIcon size={size} />;
    case 'HEALTH': return <HealthIcon size={size} />;
    default: return <ShieldIcon size={size} />;
  }
}

export function ShieldIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 6 L40 12 V22 C40 33 33 40 24 43 C15 40 8 33 8 22 V12 Z" stroke="var(--nebula-cyan)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M17 23 L22 28 L32 17" stroke="var(--nebula-cyan)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
