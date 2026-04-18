/** Shared OG image helpers — colors, fonts, and the SM logo mark.
 *  All colors are hex because Satori doesn't support oklch yet. */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  aquaTop: "#3486c7",
  aquaMid: "#276aa5",
  aquaBot: "#19487a",
  ink: "#1e1e1e",
  inkSoft: "#4c4c4c",
  inkMuted: "#616161",
  hairline: "#8a8a8a",
  titleBarTop: "#f6f6f6",
  titleBarMid: "#d6d6d6",
  titleBarBot: "#c3c3c3",
  windowBg: "#f6f6f6",
  windowBody: "#f2f4f6",
  rowSelected: "#1d6fd4",
  rowSelectedInk: "#ffffff",
  rowAlt: "#ffffff",
  rowRule: "#dedede",
  paperRule: "#c9c9c9",
  tlRed: "#e3503d",
  tlYellow: "#e1a734",
  tlGreen: "#2fab43",
  tlBorder: "#6b1a14",
} as const;

export const OG_AQUA_BG = `linear-gradient(180deg, ${OG_COLORS.aquaTop} 0%, ${OG_COLORS.aquaMid} 50%, ${OG_COLORS.aquaBot} 100%)`;

export const OG_TITLEBAR_BG = `linear-gradient(180deg, ${OG_COLORS.titleBarTop} 0%, ${OG_COLORS.titleBarMid} 55%, ${OG_COLORS.titleBarBot} 100%)`;

/* ──────────────────────────────────────────────────────────
   Fonts — resolved via Google Fonts CSS API, then fetched.
   Using a non-woff2 user agent forces TTF URLs (Satori needs TTF).
   ────────────────────────────────────────────────────────── */

const FONT_UA =
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";

async function fetchGoogleFont(family: string, weight: number) {
  const familyUrl = family.replace(/ /g, "+");
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyUrl}:wght@${weight}&display=swap`;
  const cssRes = await fetch(cssUrl, { headers: { "User-Agent": FONT_UA } });
  if (!cssRes.ok) throw new Error(`google-fonts css failed: ${family}`);
  const css = await cssRes.text();

  // Find the `latin` @font-face block and its src URL.
  const blocks = css.split("@font-face");
  let candidate: string | null = null;
  for (const b of blocks) {
    if (/\/\*\s*latin\s*\*\//i.test(css.slice(0, css.indexOf(b))) || /U\+0000-00FF/.test(b)) {
      const m = b.match(/url\(([^)]+)\)/);
      if (m) {
        candidate = m[1];
        break;
      }
    }
  }
  // Fallback: first url() in the file.
  if (!candidate) {
    const any = css.match(/url\(([^)]+)\)/);
    if (any) candidate = any[1];
  }
  if (!candidate) throw new Error(`no font url for ${family}`);
  const fontRes = await fetch(candidate);
  if (!fontRes.ok) throw new Error(`font fetch failed: ${candidate}`);
  return fontRes.arrayBuffer();
}

export async function loadOGFonts() {
  const [pixelify, mono, serif] = await Promise.all([
    fetchGoogleFont("Pixelify Sans", 700),
    fetchGoogleFont("JetBrains Mono", 500),
    fetchGoogleFont("Young Serif", 400),
  ]);
  return [
    { name: "Pixelify Sans", data: pixelify, style: "normal" as const, weight: 700 as const },
    { name: "JetBrains Mono", data: mono, style: "normal" as const, weight: 500 as const },
    { name: "Young Serif", data: serif, style: "normal" as const, weight: 400 as const },
  ];
}

/* ──────────────────────────────────────────────────────────
   SM logo mark as inline SVG
   ────────────────────────────────────────────────────────── */

interface LogoProps {
  size?: number;
  color?: string;
}

export function SamLogoMark({ size = 64, color = OG_COLORS.ink }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m210.8 9h-62.8l35.2 52.31 21.3-34.18c0.72-0.3 2.99-0.13 6.56-0.13 3.56 0 7.44 1.71 9.96 3.79l-37.82 60.12-44.42-68.83c-6.64-9.89-16.03-12.99-25.59-13.08h-66.94c-20.15 0-37.24 16.71-37.24 39.7v63.6l73.95 58.18v20.79h-18.66v-17.33l-17.97-14.23v49.75h55v-46.98l-73.95-58.57v-57.89c0-9.96 7.71-18.95 17.89-18.95h68.05c2.91 0 5.67 1.05 5.67 1.84v83.21l18.05 14.76v-73.36l46.07 70.76 45.98-70.67v156c0 10.49-9.27 18.75-18.73 18.35v-116.9l-0.63 0.09-18.05 27.41v89.36h-18.32v-89.54l-18.41-27.41-0.63 0.36v116.3h-5.48c-2.61 7.82-5.89 14.35-10.91 18.91h72.87c21.12 0 36.21-18.91 36.21-37.55v-163c0-19.91-16.06-37.02-36.21-37.02z" />
      <path d="m9.06 130.1v78.43c0 20.38 15.62 38.09 37.18 38.09h60.53c19.26 0 29.92-16.98 29.92-32.96v-68.38l-72.31-58.4v-23.05h18.57v19.09l18.37 14.75v-51.92h-55v49.52l72.49 57.83v59.36c0 9.5-5.1 15.42-12.39 15.42h-60.18c-10.18 0-18.96-8.9-18.96-18.16v-64.53l-18.22-15.09z" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   Traffic lights
   ────────────────────────────────────────────────────────── */

export function TrafficLights() {
  const dot = {
    width: 16,
    height: 16,
    borderRadius: 8,
    border: `1px solid ${OG_COLORS.tlBorder}`,
    display: "flex",
  };
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ ...dot, background: OG_COLORS.tlRed }} />
      <div style={{ ...dot, background: OG_COLORS.tlYellow }} />
      <div style={{ ...dot, background: OG_COLORS.tlGreen }} />
    </div>
  );
}
