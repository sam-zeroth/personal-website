"use client";

/**
 * Pixel-art 1-bit + color icons, 64×64, with just enough color to feel alive
 * across all three chrome variants.
 */

export function FolderIcon({ variant }: { variant: "classic" | "aqua" | "hybrid" }) {
  const tab = variant === "aqua" ? "oklch(0.65 0.15 250)" : "oklch(0.65 0.12 85)";
  const body = variant === "aqua" ? "oklch(0.82 0.1 240)" : "oklch(0.85 0.1 85)";
  const shadow = variant === "aqua" ? "oklch(0.4 0.15 245)" : "oklch(0.35 0.1 75)";
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden>
      <rect x="4" y="12" width="22" height="6" fill={tab} stroke={shadow} strokeWidth="1" />
      <rect x="4" y="18" width="56" height="38" fill={body} stroke={shadow} strokeWidth="1.5" />
      <rect x="4" y="18" width="56" height="3" fill="oklch(1 0 0 / 0.3)" />
      <rect x="4" y="54" width="56" height="2" fill={shadow} opacity="0.3" />
      {/* crease details */}
      <line x1="10" y1="30" x2="54" y2="30" stroke={shadow} strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

export function PersonIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden>
      {/* page */}
      <rect x="8" y="6" width="40" height="52" fill="oklch(0.97 0.01 90)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
      <path d="M48 6 L48 14 L56 14 Z" fill="oklch(0.97 0.01 90)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
      <polyline points="48,6 48,14 56,14" fill="oklch(0.85 0 0)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />

      {/* portrait */}
      <circle cx="28" cy="24" r="6" fill="oklch(0.85 0.08 75)" stroke="oklch(0.12 0 0)" strokeWidth="1.2" />
      <path d="M18 40 Q18 32, 28 32 Q38 32, 38 40 L38 44 L18 44 Z" fill="oklch(0.55 0.14 265)" stroke="oklch(0.12 0 0)" strokeWidth="1.2" />

      {/* lines */}
      <line x1="14" y1="50" x2="42" y2="50" stroke="oklch(0.3 0 0)" strokeWidth="1" />
      <line x1="14" y1="54" x2="36" y2="54" stroke="oklch(0.3 0 0)" strokeWidth="1" />
    </svg>
  );
}

export function BriefcaseIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden>
      {/* handle */}
      <rect x="22" y="8" width="20" height="10" fill="none" stroke="oklch(0.12 0 0)" strokeWidth="2" rx="2" />

      {/* body */}
      <rect x="6" y="16" width="52" height="40" fill="oklch(0.52 0.1 55)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" rx="2" />
      <rect x="6" y="16" width="52" height="4" fill="oklch(0.72 0.1 65)" />

      {/* latch + sheen */}
      <rect x="28" y="30" width="8" height="6" fill="oklch(0.85 0.05 85)" stroke="oklch(0.12 0 0)" strokeWidth="1" />
      <line x1="6" y1="40" x2="58" y2="40" stroke="oklch(0.25 0.04 55)" strokeWidth="1.5" />

      {/* badge */}
      <rect x="42" y="44" width="12" height="8" fill="oklch(0.85 0.17 60)" stroke="oklch(0.12 0 0)" strokeWidth="1" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden>
      {/* envelope */}
      <rect x="6" y="14" width="52" height="36" fill="oklch(0.96 0.03 80)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" rx="1" />
      <polyline points="6,14 32,34 58,14" fill="oklch(0.9 0.03 80)" stroke="oklch(0.12 0 0)" strokeWidth="1.2" />
      <line x1="6" y1="50" x2="28" y2="32" stroke="oklch(0.12 0 0)" strokeWidth="1" opacity="0.5" />
      <line x1="58" y1="50" x2="36" y2="32" stroke="oklch(0.12 0 0)" strokeWidth="1" opacity="0.5" />
      {/* @-stamp */}
      <circle cx="48" cy="46" r="6" fill="oklch(0.78 0.17 25)" stroke="oklch(0.12 0 0)" strokeWidth="1" />
      <text
        x="48"
        y="49"
        textAnchor="middle"
        fontFamily="var(--font-pixelify), system-ui"
        fontWeight="700"
        fontSize="8"
        fill="oklch(0.97 0 0)"
      >
        @
      </text>
    </svg>
  );
}

export function DocumentIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden>
      <rect x="12" y="4" width="34" height="56" fill="oklch(0.97 0.01 90)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
      <path d="M46 4 L46 14 L56 14 L46 4" fill="oklch(0.85 0 0)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
      <rect x="46" y="4" width="10" height="56" fill="none" stroke="oklch(0.12 0 0)" strokeWidth="1.5" transform="translate(10 0)" />
      <line x1="46" y1="14" x2="56" y2="14" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
      {[20, 26, 32, 38, 44, 50].map((y) => (
        <line key={y} x1="18" y1={y} x2={y === 50 ? 32 : 40} y2={y} stroke="oklch(0.3 0 0)" strokeWidth="1" />
      ))}
    </svg>
  );
}

export function TrashIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden>
      <rect x="14" y="14" width="36" height="6" fill="oklch(0.78 0 0)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
      <rect x="18" y="20" width="28" height="38" fill="oklch(0.85 0 0)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
      {[26, 34, 42, 50].map((y) => (
        <line key={y} x1="24" y1={y} x2="40" y2={y} stroke="oklch(0.4 0 0)" strokeWidth="1" />
      ))}
      <rect x="26" y="10" width="12" height="4" fill="oklch(0.7 0 0)" stroke="oklch(0.12 0 0)" strokeWidth="1.5" />
    </svg>
  );
}
