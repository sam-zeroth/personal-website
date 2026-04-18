"use client";

import { ReactNode } from "react";

/* ────────────────────────────────────────────────────────────
   Phone mockups — black wallpaper, real iPhone proportions.

   Same honesty as before: the site renders inside Safari on a
   real device, so we don't redraw the iOS status bar, Dynamic
   Island, Safari URL pill, or home indicator. Those are sim'd
   in muted grey here for preview.

   Variants differ ONLY by widget style. Everything else is
   identical so the widget decision is isolated.
   ──────────────────────────────────────────────────────────── */

const SF = '-apple-system, "SF Pro Display", "Helvetica Neue", system-ui';
const SF_TEXT = '-apple-system, "SF Pro Text", "Helvetica Neue", system-ui';
const SF_MONO = '"SF Mono", ui-monospace, "JetBrains Mono", monospace';

/* ── Default iPhone dock apps (decorative — not interactive) ── */
const DOCK_APPS = [
  {
    label: "Phone",
    bg: "linear-gradient(180deg, oklch(0.82 0.2 145) 0%, oklch(0.5 0.22 150) 100%)",
    glyph: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="oklch(0.99 0 0)" aria-hidden>
        <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.1 15.1 0 0 1-6.59-6.59l2.2-2.2a1 1 0 0 0 .25-1.02A11.4 11.4 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" />
      </svg>
    ),
  },
  {
    label: "Safari",
    bg: "radial-gradient(circle at 50% 50%, oklch(0.92 0.07 235) 0%, oklch(0.65 0.15 240) 55%, oklch(0.38 0.17 245) 100%)",
    glyph: (
      <svg width="52" height="52" viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="16.5" fill="oklch(0.96 0.005 230)" />
        <g stroke="oklch(0.4 0 0)" strokeWidth="0.7" strokeLinecap="round">
          <line x1="20" y1="6" x2="20" y2="8" />
          <line x1="20" y1="32" x2="20" y2="34" />
          <line x1="6" y1="20" x2="8" y2="20" />
          <line x1="32" y1="20" x2="34" y2="20" />
        </g>
        <g transform="rotate(45 20 20)">
          <path d="M20 7.5 L22.6 20 L17.4 20 Z" fill="oklch(0.55 0.22 25)" />
          <path d="M20 32.5 L22.6 20 L17.4 20 Z" fill="oklch(0.98 0 0)" stroke="oklch(0.45 0 0)" strokeWidth="0.25" />
        </g>
        <circle cx="20" cy="20" r="1.3" fill="oklch(0.15 0 0)" />
      </svg>
    ),
  },
  {
    label: "Messages",
    bg: "linear-gradient(180deg, oklch(0.82 0.2 145) 0%, oklch(0.55 0.22 150) 100%)",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="oklch(0.99 0 0)" aria-hidden>
        <path d="M12 3C6.48 3 2 6.58 2 11c0 2.4 1.32 4.55 3.42 6.02-.18 1.2-.82 2.35-1.64 3.2-.18.2-.02.51.25.48 2.04-.24 3.94-1.06 5.22-2.32.88.26 1.8.4 2.75.4 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    bg: "linear-gradient(180deg, oklch(0.8 0 0) 0%, oklch(0.45 0 0) 100%)",
    glyph: (
      <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="oklch(0.98 0 0)"
          d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54A.49.49 0 0 0 13.9 2h-3.84a.49.49 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.59.22L2.69 8.48a.5.5 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94 0 .32.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.49.38 1.03.7 1.62.94l.36 2.54a.49.49 0 0 0 .49.42h3.84a.49.49 0 0 0 .49-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96a.5.5 0 0 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"
        />
      </svg>
    ),
  },
];

/* ── Site content: app icons (smaller, matching real iOS ~17% icon/width) ── */
const APPS = [
  {
    key: "personal",
    label: "About",
    bg: "linear-gradient(180deg, oklch(0.9 0.14 290) 0%, oklch(0.58 0.18 295) 100%)",
    ink: "oklch(0.99 0 0)",
    glyph: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
      </svg>
    ),
  },
  {
    key: "work",
    label: "Work",
    bg: "linear-gradient(180deg, oklch(0.92 0.14 85) 0%, oklch(0.65 0.18 60) 100%)",
    ink: "oklch(0.2 0.06 70)",
    glyph: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <rect x="3" y="7" width="18" height="13" rx="1" />
        <path d="M3 11h18" />
      </svg>
    ),
  },
  {
    key: "writings",
    label: "Writings",
    bg: "linear-gradient(180deg, oklch(0.88 0.16 25) 0%, oklch(0.48 0.2 20) 100%)",
    ink: "oklch(0.99 0 0)",
    glyph: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h12l4 4v12H4z" />
        <path d="M8 10h8M8 14h8M8 18h5" />
      </svg>
    ),
  },
  {
    key: "contact",
    label: "Contact",
    bg: "linear-gradient(180deg, oklch(0.9 0.18 145) 0%, oklch(0.52 0.18 155) 100%)",
    ink: "oklch(0.16 0.05 145)",
    glyph: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

/* ── Device chrome sim (muted grey) ── */

function DeviceStatusBarSim() {
  const ink = "oklch(0.99 0 0 / 0.65)";
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 44,
        zIndex: 40,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: ink,
        fontFamily: SF,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        fontVariantNumeric: "tabular-nums",
        pointerEvents: "none",
      }}
    >
      <span>3:23</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill={ink} aria-hidden>
          <rect x="0" y="7" width="2.5" height="4" rx="0.6" />
          <rect x="4" y="4.5" width="2.5" height="6.5" rx="0.6" />
          <rect x="8" y="2" width="2.5" height="9" rx="0.6" />
          <rect x="12" y="0" width="2.5" height="11" rx="0.6" />
        </svg>
        <svg width="14" height="11" viewBox="0 0 16 12" fill={ink} aria-hidden>
          <path d="M8 1.5c2.8 0 5.3 1 7.3 2.8l-1.4 1.5A8.3 8.3 0 0 0 8 3.5 8.3 8.3 0 0 0 2.1 5.8L.7 4.3A10.7 10.7 0 0 1 8 1.5z" />
          <path d="M8 5c1.9 0 3.7.7 5 1.8l-1.4 1.5A5.6 5.6 0 0 0 8 7a5.6 5.6 0 0 0-3.6 1.3L3 6.8A7.8 7.8 0 0 1 8 5z" />
          <path d="M8 8.5c.9 0 1.8.3 2.5.9L8 12 5.5 9.4A4 4 0 0 1 8 8.5z" />
        </svg>
        <svg width="24" height="11" viewBox="0 0 26 12" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke={ink} strokeOpacity="0.5" />
          <rect x="2" y="2" width={(60 / 100) * 19} height="8" rx="1.5" fill={ink} />
          <rect x="23.5" y="4" width="1.5" height="4" rx="0.5" fill={ink} fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function DynamicIslandSim() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        width: 100,
        height: 30,
        background: "oklch(0 0 0)",
        borderRadius: 999,
        zIndex: 45,
        pointerEvents: "none",
      }}
    />
  );
}

function DeviceSafariBarSim() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 22,
        height: 40,
        background: "oklch(0.28 0 0 / 0.55)",
        border: "1px solid oklch(1 0 0 / 0.12)",
        borderRadius: 13,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "oklch(0.99 0 0 / 0.55)",
        fontFamily: SF_TEXT,
        fontSize: 13,
        fontWeight: 500,
        backdropFilter: "blur(16px) saturate(1.5)",
        WebkitBackdropFilter: "blur(16px) saturate(1.5)",
        pointerEvents: "none",
      }}
    >
      <span>sammerk.io</span>
    </div>
  );
}

function DeviceHomeIndicatorSim() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: 8,
        left: "50%",
        transform: "translateX(-50%)",
        width: 130,
        height: 5,
        borderRadius: 2.5,
        background: "oklch(0.99 0 0 / 0.85)",
        zIndex: 45,
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Widgets — real iOS large-widget-sized (4×2 cell equivalent) ── */

interface WidgetVariant {
  id: string;
  name: string;
  notes: string;
  render: () => ReactNode;
}

const WIDGET_BG = "oklch(0.14 0 0)";
const WIDGET_BORDER = "0.5px solid oklch(0.22 0 0)";
const WIDGET_SHADOW =
  "0 1px 0 oklch(1 0 0 / 0.04) inset, 0 10px 30px oklch(0 0 0 / 0.5)";

function WidgetShell({
  children,
  height = 152,
  background = WIDGET_BG,
  padding = "14px 18px",
}: {
  children: ReactNode;
  height?: number;
  background?: string;
  padding?: string;
}) {
  return (
    <div
      style={{
        height,
        background,
        border: WIDGET_BORDER,
        borderRadius: 22,
        padding,
        boxShadow: WIDGET_SHADOW,
        color: "oklch(0.99 0 0)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

const WIDGETS: WidgetVariant[] = [
  {
    id: "W1",
    name: "Big Clock",
    notes:
      "Apple Clock-widget style. Massive digital time dominates; day + date below. Strong, bold, functional.",
    render: () => (
      <WidgetShell>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "oklch(0.55 0.15 255)",
            fontFamily: SF_TEXT,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
            <circle cx="5" cy="5" r="4.5" />
          </svg>
          Clock
        </div>
        <div>
          <div
            style={{
              fontFamily: SF,
              fontWeight: 200,
              fontSize: 72,
              letterSpacing: "-0.04em",
              lineHeight: 0.92,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            3:23
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: SF_TEXT,
              fontSize: 13,
              fontWeight: 500,
              color: "oklch(0.65 0 0)",
              letterSpacing: "-0.01em",
            }}
          >
            Wednesday · April 18
          </div>
        </div>
      </WidgetShell>
    ),
  },
  {
    id: "W2",
    name: "Calendar",
    notes:
      "Apple Calendar-widget style. Oversized day number; up-next event line underneath. Date-forward.",
    render: () => (
      <WidgetShell padding="16px 18px">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: SF_TEXT,
              fontSize: 13,
              fontWeight: 700,
              color: "oklch(0.72 0.18 25)",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}
          >
            Wednesday
          </span>
          <span
            style={{
              fontFamily: SF_TEXT,
              fontSize: 11,
              fontWeight: 500,
              color: "oklch(0.55 0 0)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            April 2026
          </span>
        </div>
        <div
          style={{
            fontFamily: SF,
            fontWeight: 700,
            fontSize: 88,
            letterSpacing: "-0.05em",
            lineHeight: 0.88,
            color: "oklch(0.99 0 0)",
          }}
        >
          18
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingTop: 8,
            borderTop: "0.5px solid oklch(0.22 0 0)",
            fontFamily: SF_TEXT,
            fontSize: 12,
            fontWeight: 500,
            color: "oklch(0.7 0 0)",
          }}
        >
          <span
            style={{
              width: 3,
              height: 14,
              background: "oklch(0.72 0.18 25)",
              borderRadius: 1,
            }}
          />
          <span style={{ color: "oklch(0.95 0 0)" }}>No events today</span>
          <span style={{ marginLeft: "auto", color: "oklch(0.55 0 0)" }}>3:23 PM</span>
        </div>
      </WidgetShell>
    ),
  },
  {
    id: "W3",
    name: "Dual",
    notes:
      "Two small widgets side-by-side — calendar left, clock right. Dense information without feeling heavy.",
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, height: 152 }}>
        {/* Left: Calendar small widget */}
        <div
          style={{
            background: WIDGET_BG,
            border: WIDGET_BORDER,
            borderRadius: 22,
            padding: "14px 16px",
            boxShadow: WIDGET_SHADOW,
            color: "oklch(0.99 0 0)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: SF_TEXT,
              fontSize: 11,
              fontWeight: 700,
              color: "oklch(0.72 0.18 25)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            Wed
          </span>
          <div
            style={{
              fontFamily: SF,
              fontWeight: 700,
              fontSize: 60,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            18
          </div>
          <span
            style={{
              fontFamily: SF_TEXT,
              fontSize: 11,
              fontWeight: 500,
              color: "oklch(0.6 0 0)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            April
          </span>
        </div>
        {/* Right: Clock small widget */}
        <div
          style={{
            background: WIDGET_BG,
            border: WIDGET_BORDER,
            borderRadius: 22,
            padding: "14px 16px",
            boxShadow: WIDGET_SHADOW,
            color: "oklch(0.99 0 0)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: SF_TEXT,
              fontSize: 11,
              fontWeight: 600,
              color: "oklch(0.55 0.15 255)",
              letterSpacing: "0.03em",
              textTransform: "uppercase",
            }}
          >
            Time
          </span>
          <div
            style={{
              fontFamily: SF,
              fontWeight: 200,
              fontSize: 46,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            3:23
          </div>
          <span
            style={{
              fontFamily: SF_TEXT,
              fontSize: 11,
              fontWeight: 500,
              color: "oklch(0.6 0 0)",
              letterSpacing: "-0.01em",
            }}
          >
            New York · 3:23 PM
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "W4",
    name: "Minimal Mono",
    notes:
      "Medium-short SF Mono widget. Restrained. Feels like terminal typography — complements Sam's taste without shouting.",
    render: () => (
      <WidgetShell height={92} padding="18px 22px">
        <div
          style={{
            fontFamily: SF_MONO,
            fontSize: 11,
            fontWeight: 500,
            color: "oklch(0.55 0 0)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          sam.os / now
        </div>
        <div
          style={{
            fontFamily: SF_MONO,
            fontSize: 22,
            fontWeight: 500,
            color: "oklch(0.99 0 0)",
            letterSpacing: "-0.01em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Wed · 04.18 · 15:23
        </div>
      </WidgetShell>
    ),
  },
];

/* ── The phone screen itself ── */
function PhoneMockup({ w }: { w: WidgetVariant }) {
  const PHONE_W = 340;
  const PHONE_H = 720;

  // Real iPhone proportions:
  // side padding ≈ 20px, icon ≈ 58px, gap ≈ 20px horizontal / 22px vertical
  return (
    <div style={{ width: PHONE_W, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Screen (no heavy bezel — reads as a screenshot) */}
      <div
        style={{
          position: "relative",
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 44,
          overflow: "hidden",
          background: "oklch(0 0 0)",
          boxShadow:
            "0 0 0 1px oklch(0.22 0 0), 0 0 0 9px oklch(0.06 0 0), 0 40px 80px -30px oklch(0 0 0 / 0.7), 0 12px 30px -10px oklch(0 0 0 / 0.4)",
        }}
      >
        {/* ── SITE CONTENT ── */}

        {/* Pure black wallpaper — site owns full viewport under device chrome */}
        <div style={{ position: "absolute", inset: 0, background: "oklch(0 0 0)" }} />

        {/* Widget */}
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 64,
            zIndex: 10,
          }}
        >
          {w.render()}
        </div>

        {/* App grid — 4 columns, 1 row (Sam's 4 apps) */}
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 248,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "24px 10px",
            zIndex: 10,
          }}
        >
          {APPS.map((app) => (
            <div
              key={app.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 14,
                  background: app.bg,
                  color: app.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 14px oklch(0 0 0 / 0.4), 0 1px 2px oklch(0 0 0 / 0.2)",
                }}
              >
                {app.glyph}
              </div>
              <span
                style={{
                  fontFamily: SF_TEXT,
                  fontSize: 11,
                  fontWeight: 400,
                  color: "oklch(0.98 0 0)",
                  letterSpacing: "-0.01em",
                  textShadow: "0 1px 2px oklch(0 0 0 / 0.3)",
                }}
              >
                {app.label}
              </span>
            </div>
          ))}
        </div>

        {/* Dock — default iPhone apps, decorative only (not interactive) */}
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            bottom: 80,
            zIndex: 15,
            background: "oklch(0.22 0 0 / 0.28)",
            border: "0.5px solid oklch(1 0 0 / 0.06)",
            borderRadius: 30,
            backdropFilter: "blur(30px) saturate(1.6)",
            WebkitBackdropFilter: "blur(30px) saturate(1.6)",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {DOCK_APPS.map((d) => (
            <div
              key={d.label}
              style={{
                width: 58,
                height: 58,
                borderRadius: 14,
                background: d.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px oklch(0 0 0 / 0.3)",
              }}
            >
              {d.glyph}
            </div>
          ))}
        </div>

        {/* ── DEVICE CHROME SIMULATION (NOT site code) ── */}
        <DeviceStatusBarSim />
        <DynamicIslandSim />
        <DeviceSafariBarSim />
        <DeviceHomeIndicatorSim />
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", paddingTop: 4 }}>
        <div
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 18,
            fontWeight: 700,
            color: "oklch(0.97 0 0)",
            marginBottom: 2,
          }}
        >
          {w.id} · {w.name}
        </div>
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 13,
            color: "oklch(0.72 0 0)",
            lineHeight: 1.45,
            maxWidth: 320,
            margin: "0 auto",
          }}
        >
          {w.notes}
        </div>
      </div>
    </div>
  );
}

export default function PhoneMockupsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "oklch(0.14 0.01 260)",
        color: "oklch(0.98 0 0)",
        padding: "48px 32px 80px",
        overflow: "auto",
        height: "100vh",
      }}
    >
      <header style={{ maxWidth: 1400, margin: "0 auto 24px" }}>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "oklch(0.65 0.03 280)",
            marginBottom: 10,
          }}
        >
          sam.os / mockups / phone
        </div>
        <h1
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            marginBottom: 12,
          }}
        >
          Black canvas · 4 widget directions
        </h1>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 16,
            lineHeight: 1.6,
            color: "oklch(0.8 0.01 260)",
            maxWidth: 760,
          }}
        >
          Same premise across all four: pure black wallpaper, 4-column grid,
          real iPhone icon proportions (~17% of width), dock with same-size
          icons, and the device&apos;s real chrome bleeds through in grey.{" "}
          <strong>Only the widget changes.</strong> Pick the one that feels
          right — or mix elements (e.g. &ldquo;Minimal Mono widget but borrow
          Calendar&apos;s accent red&rdquo;).
        </p>
      </header>

      {/* Legend */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto 40px",
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          padding: "14px 18px",
          border: "1px solid oklch(0.25 0.01 260)",
          borderRadius: 12,
          background: "oklch(0.18 0.01 260)",
          fontFamily: SF_TEXT,
          fontSize: 12,
          color: "oklch(0.78 0.01 260)",
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "oklch(0.98 0.05 260)",
            }}
          />
          full colour = site content we render
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "oklch(0.6 0 0 / 0.75)",
            }}
          />
          muted = real iOS / Safari chrome (device renders this)
        </div>
      </div>

      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 56,
          justifyItems: "center",
        }}
      >
        {WIDGETS.map((w) => (
          <PhoneMockup key={w.id} w={w} />
        ))}
      </div>

      <footer
        style={{
          maxWidth: 760,
          margin: "80px auto 0",
          paddingTop: 32,
          borderTop: "1px solid oklch(0.25 0.01 260)",
          fontFamily: "Georgia, serif",
          fontSize: 14,
          lineHeight: 1.6,
          color: "oklch(0.75 0.01 260)",
        }}
      >
        <p style={{ marginBottom: 8 }}>
          <strong style={{ color: "oklch(0.95 0 0)" }}>
            Next: tell me which widget, and I&apos;ll wire in the real thing:
          </strong>
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Remove fake status bar, Dynamic Island, and home indicator from the actual site code.</li>
          <li>Swap wallpaper to pure black.</li>
          <li>Move to 4-col grid with real-size icons.</li>
          <li>Build the chosen widget, wired to the real local clock (not static &ldquo;3:23&rdquo;).</li>
          <li>Reserve bottom safe-area so the dock sits above Safari&apos;s URL pill.</li>
        </ul>
      </footer>
    </div>
  );
}
