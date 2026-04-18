"use client";

import { ReactNode } from "react";

/* ────────────────────────────────────────────────────────────
   App-view mockups — four design palettes for the fullscreen
   views that open when a home-screen app icon is tapped.

   Content is fixed (About page) across all four so the
   design decision is isolated. Same honesty as before: we
   DON'T redraw the real iOS status bar / Dynamic Island /
   Safari URL bar / home indicator — those are device chrome.
   ──────────────────────────────────────────────────────────── */

const SF = '-apple-system, "SF Pro Display", "Helvetica Neue", system-ui';
const SF_TEXT = '-apple-system, "SF Pro Text", "Helvetica Neue", system-ui';
const SF_MONO = '"SF Mono", ui-monospace, "JetBrains Mono", monospace';
const SERIF = 'Georgia, "Young Serif", serif';

/* ── Content: Sam's About page ── */
const INTRO = [
  "Northeastern grad — BS in Computer Science and Philosophy. Deeply interested in the intersections of mind, computation, and logic. Currently building AI agent infrastructure at Zeroth Technology. Always reading, always learning.",
  "I grew up curious about how things think — brains, machines, languages, and lately the systems we build that seem to do a bit of both.",
];
const TIMELINE = [
  { period: "Now", title: "Zeroth Technology", desc: "Building Pyrana — an Enterprise Agent Orchestration Platform. Working on the frontier of AI systems and multi-agent coordination." },
  { period: "Previously", title: "Kenvue (J&J spin-off)", desc: "AdTech — built novel algorithms to improve advertising targeting and spend optimization." },
  { period: "Previously", title: "Johnson & Johnson", desc: "Corporate Technology & MedTech — engineering across enterprise systems and medical technology platforms." },
  { period: "Previously", title: "Genentech", desc: "Data Management — working with biotech data systems at one of the world's leading biotechnology companies." },
];

/* ── Device chrome simulation (muted grey, like before) ── */

function StatusBarSim({ chrome }: { chrome: "light" | "dark" }) {
  const ink = chrome === "light" ? "oklch(0.15 0 0 / 0.55)" : "oklch(0.99 0 0 / 0.65)";
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
    <div aria-hidden style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 100, height: 30, background: "oklch(0 0 0)", borderRadius: 999, zIndex: 45, pointerEvents: "none" }} />
  );
}

function SafariBarSim({ chrome }: { chrome: "light" | "dark" }) {
  const bg = chrome === "light" ? "oklch(0.12 0 0 / 0.22)" : "oklch(0.28 0 0 / 0.55)";
  const border = chrome === "light" ? "oklch(0 0 0 / 0.08)" : "oklch(1 0 0 / 0.12)";
  const fg = chrome === "light" ? "oklch(0.2 0 0 / 0.55)" : "oklch(0.99 0 0 / 0.55)";
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 22,
        height: 40,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 13,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: fg,
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

function HomeIndicatorSim({ chrome }: { chrome: "light" | "dark" }) {
  const bg = chrome === "light" ? "oklch(0.15 0 0 / 0.75)" : "oklch(0.99 0 0 / 0.85)";
  return (
    <div aria-hidden style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 130, height: 5, borderRadius: 2.5, background: bg, zIndex: 45, pointerEvents: "none" }} />
  );
}

/* ── Variants ── */

interface VariantProps {
  id: string;
  name: string;
  notes: string;
  chrome: "light" | "dark";
  render: () => ReactNode;
}

/* -- A. Native iOS Light -- */
function VariantA() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "oklch(0.97 0.003 260)", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <div
        style={{
          paddingTop: 44,
          height: 92,
          background: "oklch(0.97 0.003 260 / 0.78)",
          backdropFilter: "blur(20px) saturate(1.6)",
          WebkitBackdropFilter: "blur(20px) saturate(1.6)",
          borderBottom: "0.5px solid oklch(0 0 0 / 0.12)",
          display: "flex",
          alignItems: "center",
          padding: "44px 14px 0",
          position: "relative",
        }}
      >
        <button style={backButtonStyle("oklch(0.55 0.18 255)")}>
          <ChevronLeft color="oklch(0.55 0.18 255)" />
          <span>Home</span>
        </button>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontFamily: SF, fontSize: 17, fontWeight: 600, color: "oklch(0.12 0 0)", letterSpacing: "-0.01em" }}>About</div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "hidden", padding: "20px 20px 90px", fontFamily: SF_TEXT, color: "oklch(0.12 0 0)" }}>
        {/* Large title */}
        <h1 style={{ fontFamily: SF, fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 6 }}>
          Sam Merkovitz
        </h1>
        <p style={{ fontFamily: SF_TEXT, fontSize: 14, fontWeight: 500, color: "oklch(0.55 0 0)", marginBottom: 20 }}>
          Builder · philosopher · essays
        </p>

        {/* Intro */}
        <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>{INTRO[0]}</p>

        {/* Grouped list — iOS Settings-style */}
        <div style={{ fontFamily: SF_TEXT, fontSize: 12, fontWeight: 500, color: "oklch(0.45 0 0)", letterSpacing: "-0.01em", textTransform: "uppercase", padding: "16px 0 6px 4px" }}>
          Experience
        </div>
        <div style={{ background: "oklch(1 0 0)", borderRadius: 12, overflow: "hidden", border: "0.5px solid oklch(0 0 0 / 0.08)" }}>
          {TIMELINE.slice(0, 3).map((t, i, arr) => (
            <div
              key={t.title}
              style={{
                padding: "10px 14px",
                borderBottom: i < arr.length - 1 ? "0.5px solid oklch(0 0 0 / 0.1)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "oklch(0.12 0 0)", letterSpacing: "-0.01em" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "oklch(0.5 0 0)", marginTop: 1 }}>{t.period}</div>
              </div>
              <ChevronRight color="oklch(0.65 0 0)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -- B. Native iOS Dark -- */
function VariantB() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "oklch(0 0 0)", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          paddingTop: 44,
          height: 92,
          background: "oklch(0.08 0 0 / 0.7)",
          backdropFilter: "blur(22px) saturate(1.6)",
          WebkitBackdropFilter: "blur(22px) saturate(1.6)",
          borderBottom: "0.5px solid oklch(1 0 0 / 0.08)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "44px 14px 0",
        }}
      >
        <button style={backButtonStyle("oklch(0.72 0.16 255)")}>
          <ChevronLeft color="oklch(0.72 0.16 255)" />
          <span>Home</span>
        </button>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontFamily: SF, fontSize: 17, fontWeight: 600, color: "oklch(0.99 0 0)", letterSpacing: "-0.01em" }}>About</div>
      </div>

      <div style={{ flex: 1, overflow: "hidden", padding: "20px 20px 90px", fontFamily: SF_TEXT, color: "oklch(0.95 0 0)" }}>
        <h1 style={{ fontFamily: SF, fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 6, color: "oklch(0.99 0 0)" }}>
          Sam Merkovitz
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: "oklch(0.62 0 0)", marginBottom: 20 }}>
          Builder · philosopher · essays
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 14, color: "oklch(0.9 0 0)" }}>{INTRO[0]}</p>

        <div style={{ fontSize: 12, fontWeight: 500, color: "oklch(0.55 0 0)", letterSpacing: "-0.01em", textTransform: "uppercase", padding: "16px 0 6px 4px" }}>
          Experience
        </div>
        <div style={{ background: "oklch(0.14 0 0)", borderRadius: 12, overflow: "hidden", border: "0.5px solid oklch(1 0 0 / 0.06)" }}>
          {TIMELINE.slice(0, 3).map((t, i, arr) => (
            <div
              key={t.title}
              style={{
                padding: "10px 14px",
                borderBottom: i < arr.length - 1 ? "0.5px solid oklch(1 0 0 / 0.08)" : "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "oklch(0.98 0 0)", letterSpacing: "-0.01em" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "oklch(0.55 0 0)", marginTop: 1 }}>{t.period}</div>
              </div>
              <ChevronRight color="oklch(0.55 0 0)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -- C. Reader / Editorial -- */
function VariantC() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "oklch(0.98 0.005 85)", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          paddingTop: 44,
          height: 92,
          background: "oklch(0.98 0.005 85 / 0.8)",
          backdropFilter: "blur(22px) saturate(1.5)",
          WebkitBackdropFilter: "blur(22px) saturate(1.5)",
          borderBottom: "0.5px solid oklch(0 0 0 / 0.1)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "44px 14px 0",
        }}
      >
        <button style={backButtonStyle("oklch(0.42 0.14 35)")}>
          <ChevronLeft color="oklch(0.42 0.14 35)" />
          <span>Home</span>
        </button>
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", fontFamily: SERIF, fontStyle: "italic", fontSize: 15, fontWeight: 400, color: "oklch(0.3 0.03 40)", letterSpacing: "0.02em" }}>About</div>
      </div>

      <div style={{ flex: 1, overflow: "hidden", padding: "24px 22px 90px", color: "oklch(0.15 0.02 40)" }}>
        {/* Editorial kicker */}
        <div style={{ fontFamily: SF_MONO, fontSize: 10, fontWeight: 500, color: "oklch(0.5 0.06 35)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>
          About
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 14 }}>
          hello, I&apos;m sam.
        </h1>
        <hr style={{ border: 0, height: 1, background: "oklch(0.65 0.06 40 / 0.25)", margin: "0 0 16px" }} />

        <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.55, marginBottom: 14 }}>{INTRO[0]}</p>
        <p style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.55, marginBottom: 18 }}>{INTRO[1]}</p>

        <div style={{ fontFamily: SF_MONO, fontSize: 10, fontWeight: 500, color: "oklch(0.5 0.06 35)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>
          Résumé
        </div>
        {TIMELINE.slice(0, 2).map((t, i) => (
          <div
            key={t.title}
            style={{
              paddingBottom: 12,
              marginBottom: 12,
              borderBottom: i < 1 ? "0.5px solid oklch(0.65 0.06 40 / 0.3)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 400 }}>{t.title}</div>
              <div style={{ fontFamily: SF_MONO, fontSize: 10, color: "oklch(0.45 0.06 35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.period}</div>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: 13, color: "oklch(0.3 0.03 40)", lineHeight: 1.5 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -- D. Sheet Card -- */
function VariantD() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "oklch(0 0 0)", display: "flex", flexDirection: "column" }}>
      {/* Dimmed home screen peeking at top */}
      <div
        style={{
          height: 54,
          background: "oklch(0 0 0)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* suggest a peek of wallpaper behind */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.4, background: "radial-gradient(ellipse 80% 60% at 50% 100%, oklch(0.3 0.1 260) 0%, transparent 70%)" }} />
      </div>

      {/* Sheet */}
      <div
        style={{
          flex: 1,
          background: "oklch(0.11 0 0)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -1px 0 oklch(1 0 0 / 0.06)",
          position: "relative",
        }}
      >
        {/* Sheet handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
          <div style={{ width: 36, height: 5, borderRadius: 3, background: "oklch(1 0 0 / 0.25)" }} />
        </div>

        {/* Sheet navbar */}
        <div style={{ display: "flex", alignItems: "center", padding: "6px 14px 10px", justifyContent: "space-between" }}>
          <div style={{ width: 50 }} />
          <div style={{ fontFamily: SF, fontSize: 16, fontWeight: 600, color: "oklch(0.99 0 0)", letterSpacing: "-0.01em" }}>About</div>
          <button
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "oklch(1 0 0 / 0.12)",
              border: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="oklch(0.95 0 0)" strokeWidth="1.6" strokeLinecap="round">
              <path d="M1 1 L9 9 M9 1 L1 9" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "hidden", padding: "10px 20px 90px", fontFamily: SF_TEXT, color: "oklch(0.95 0 0)" }}>
          {/* Identity card */}
          <div
            style={{
              background: "linear-gradient(180deg, oklch(0.9 0.14 290) 0%, oklch(0.58 0.18 295) 100%)",
              borderRadius: 18,
              padding: "18px 18px",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: "oklch(1 0 0 / 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "oklch(0.99 0 0)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20c1-4 4-6 7-6s6 2 7 6" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: SF, fontSize: 18, fontWeight: 700, color: "oklch(0.99 0 0)", letterSpacing: "-0.02em" }}>Sam Merkovitz</div>
              <div style={{ fontSize: 12, color: "oklch(0.99 0 0 / 0.85)", marginTop: 1 }}>Builder · philosopher · essays</div>
            </div>
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 14, color: "oklch(0.88 0 0)" }}>{INTRO[0]}</p>

          <div style={{ fontSize: 11, fontWeight: 500, color: "oklch(0.6 0 0)", letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: 8 }}>
            Experience
          </div>
          <div style={{ background: "oklch(0.16 0 0)", borderRadius: 14, overflow: "hidden" }}>
            {TIMELINE.slice(0, 3).map((t, i, arr) => (
              <div
                key={t.title}
                style={{
                  padding: "10px 14px",
                  borderBottom: i < arr.length - 1 ? "0.5px solid oklch(1 0 0 / 0.07)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "oklch(0.98 0 0)" }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: "oklch(0.58 0 0)", marginTop: 1 }}>{t.period}</div>
                </div>
                <ChevronRight color="oklch(0.55 0 0)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function backButtonStyle(color: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 2,
    background: "transparent",
    border: 0,
    padding: "6px 4px",
    fontFamily: SF_TEXT,
    fontSize: 17,
    fontWeight: 400,
    color,
    cursor: "pointer",
    letterSpacing: "-0.01em",
  };
}

function ChevronLeft({ color }: { color: string }) {
  return (
    <svg width="11" height="18" viewBox="0 0 10 16" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 1 L1 8 L9 15" />
    </svg>
  );
}

function ChevronRight({ color }: { color: string }) {
  return (
    <svg width="8" height="13" viewBox="0 0 10 16" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 1 L9 8 L1 15" />
    </svg>
  );
}

const VARIANTS: VariantProps[] = [
  {
    id: "A",
    name: "Native iOS · Light",
    notes: "Looks like a stock iPhone app — grey-white background, grouped list cards, SF Pro throughout. Safe, familiar, reads as 'Apple.'",
    chrome: "light",
    render: VariantA,
  },
  {
    id: "B",
    name: "Native iOS · Dark",
    notes: "Same iOS grammar but OLED black. Continuous with the home screen — tap an app, stay in the dark. Feels premium and intentional.",
    chrome: "dark",
    render: VariantB,
  },
  {
    id: "C",
    name: "Reader · Editorial",
    notes: "iOS Reader + Apple News. Warm off-white paper, Georgia body, SF Mono kickers. Keeps Sam's literate side — the 'essays' widget subtitle actually pays off here.",
    chrome: "light",
    render: VariantC,
  },
  {
    id: "D",
    name: "Sheet Card",
    notes: "Modal sheet over a dimmed home screen (iOS 17 convention). Identity card at the top uses the app's gradient. Most modern, most opinionated — also the most 'app-feel.'",
    chrome: "dark",
    render: VariantD,
  },
];

/* ── Phone shell ── */

function PhoneMockup({ v }: { v: VariantProps }) {
  const PHONE_W = 340;
  const PHONE_H = 720;

  return (
    <div style={{ width: PHONE_W, display: "flex", flexDirection: "column", gap: 16 }}>
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
        {/* site content */}
        {v.render()}

        {/* device chrome sim */}
        <StatusBarSim chrome={v.chrome} />
        <DynamicIslandSim />
        <SafariBarSim chrome={v.chrome} />
        <HomeIndicatorSim chrome={v.chrome} />
      </div>

      <div style={{ textAlign: "center", paddingTop: 4 }}>
        <div style={{ fontFamily: "var(--font-pixelify), system-ui", fontSize: 18, fontWeight: 700, color: "oklch(0.97 0 0)", marginBottom: 2 }}>
          {v.id} · {v.name}
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "oklch(0.72 0 0)", lineHeight: 1.45, maxWidth: 320, margin: "0 auto" }}>
          {v.notes}
        </div>
      </div>
    </div>
  );
}

export default function AppViewMockupsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "oklch(0.14 0.01 260)", color: "oklch(0.98 0 0)", padding: "48px 32px 80px", overflow: "auto", height: "100vh" }}>
      <header style={{ maxWidth: 1400, margin: "0 auto 24px" }}>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: "oklch(0.65 0.03 280)", marginBottom: 10 }}>
          sam.os / mockups / app-view
        </div>
        <h1 style={{ fontFamily: "var(--font-pixelify), system-ui", fontSize: 40, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 12 }}>
          App views — 4 palette directions
        </h1>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, lineHeight: 1.6, color: "oklch(0.8 0.01 260)", maxWidth: 760 }}>
          These are the fullscreen views that open when a home-screen app icon is
          tapped. The old Mac-doc chrome (Pixelify Sans headings, dashed rules,
          bordered chips) is out of place under the modern iPhone home. Same
          About-page content rendered four ways — pick one or mix.
        </p>
      </header>

      <div style={{ maxWidth: 1400, margin: "0 auto 40px", display: "flex", gap: 24, flexWrap: "wrap", padding: "14px 18px", border: "1px solid oklch(0.25 0.01 260)", borderRadius: 12, background: "oklch(0.18 0.01 260)", fontFamily: SF_TEXT, fontSize: 12, color: "oklch(0.78 0.01 260)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 4, background: "oklch(0.98 0.05 260)" }} />
          full colour = site content we render
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 4, background: "oklch(0.6 0 0 / 0.75)" }} />
          muted = real iOS / Safari chrome
        </div>
      </div>

      <div style={{ maxWidth: 1500, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 56, justifyItems: "center" }}>
        {VARIANTS.map((v) => (
          <PhoneMockup key={v.id} v={v} />
        ))}
      </div>

      <footer style={{ maxWidth: 760, margin: "80px auto 0", paddingTop: 32, borderTop: "1px solid oklch(0.25 0.01 260)", fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.6, color: "oklch(0.75 0.01 260)" }}>
        <p>
          Pick a direction (or mix — e.g. &ldquo;Dark from B with the identity
          card from D&rdquo;) and I&apos;ll wire it into{" "}
          <code style={{ fontFamily: "var(--font-mono), monospace", fontSize: 13 }}>PhoneHome.tsx</code>{" "}
          + the{" "}
          <code style={{ fontFamily: "var(--font-mono), monospace", fontSize: 13 }}>.ios-app-*</code>{" "}
          classes in{" "}
          <code style={{ fontFamily: "var(--font-mono), monospace", fontSize: 13 }}>globals.css</code>.
        </p>
      </footer>
    </div>
  );
}
