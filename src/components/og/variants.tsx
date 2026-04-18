import SamLogoMark from "./SamLogoMark";

const AQUA_BG =
  "linear-gradient(180deg, oklch(0.55 0.12 240) 0%, oklch(0.42 0.11 235) 50%, oklch(0.3 0.09 230) 100%)";

const WINDOW_SHADOW =
  "0 1px 0 oklch(1 0 0 / 0.6) inset, 0 0 0 1px oklch(0.4 0 0 / 0.6), 0 30px 60px oklch(0 0 0 / 0.5), 0 10px 24px oklch(0 0 0 / 0.35)";

const TITLEBAR_BG =
  "linear-gradient(180deg, oklch(0.96 0 0) 0%, oklch(0.85 0 0) 50%, oklch(0.78 0 0) 100%)";

function Menubar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        height: 32,
        padding: "0 18px",
        background: "linear-gradient(180deg, oklch(0.98 0 0) 0%, oklch(0.82 0 0) 100%)",
        borderBottom: "1px solid oklch(0.55 0 0)",
        boxShadow: "0 1px 0 oklch(1 0 0 / 0.8) inset, 0 2px 4px oklch(0 0 0 / 0.15)",
        color: "oklch(0.12 0 0)",
        fontFamily: "var(--font-pixelify), system-ui",
        fontWeight: 500,
        fontSize: 15,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <SamLogoMark size={15} color="oklch(0.12 0 0)" />
      </div>
      <span style={{ fontWeight: 700 }}>Finder</span>
      <span>File</span>
      <span>Edit</span>
      <span>View</span>
      <span>Special</span>
      <span>Help</span>
      <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono), monospace", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.7 }}>
        sammerk.io
      </span>
    </div>
  );
}

function TrafficLights() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, oklch(0.85 0.18 25), oklch(0.55 0.2 25))", border: "1px solid oklch(0.3 0.1 30 / 0.4)" }} />
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, oklch(0.9 0.18 80), oklch(0.7 0.19 75))", border: "1px solid oklch(0.3 0.1 30 / 0.4)" }} />
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, oklch(0.85 0.22 140), oklch(0.6 0.2 145))", border: "1px solid oklch(0.3 0.1 30 / 0.4)" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Variant A: "Desktop snapshot" — the site in miniature
   ══════════════════════════════════════════════════════════ */
export function VariantA() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: AQUA_BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-pixelify), system-ui",
      }}
    >
      <Menubar />

      {/* desktop area */}
      <div style={{ flex: 1, position: "relative", padding: "60px 100px" }}>
        {/* desktop icons on right */}
        <div style={{ position: "absolute", top: 56, right: 48, display: "flex", flexDirection: "column", gap: 30 }}>
          {[
            { label: "About Me" },
            { label: "Work" },
            { label: "Writings" },
            { label: "Contact" },
          ].map((i) => (
            <div key={i.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 44, height: 44, background: "oklch(0.9 0.08 80)", border: "1.5px solid oklch(0.12 0 0)", borderRadius: 4 }} />
              <div style={{ color: "oklch(1 0 0)", fontSize: 13, fontWeight: 600, textShadow: "0 1px 2px oklch(0 0 0 / 0.6)" }}>{i.label}</div>
            </div>
          ))}
        </div>

        {/* main window */}
        <div
          style={{
            width: 760,
            height: 420,
            background: "oklch(0.97 0 0)",
            borderRadius: 14,
            boxShadow: WINDOW_SHADOW,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginTop: 24,
          }}
        >
          <div
            style={{
              height: 42,
              background: TITLEBAR_BG,
              borderBottom: "1px solid oklch(0.55 0 0)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              position: "relative",
              boxShadow: "0 1px 0 oklch(1 0 0 / 0.5) inset",
            }}
          >
            <TrafficLights />
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: 16,
                fontWeight: 500,
                color: "oklch(0.2 0 0)",
                textShadow: "0 1px 0 oklch(1 0 0 / 0.8)",
              }}
            >
              About Sam
            </span>
          </div>
          <div style={{ padding: "44px 54px", display: "flex", flexDirection: "column", gap: 18, flex: 1, background: "oklch(0.96 0.005 240)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <SamLogoMark size={72} color="oklch(0.12 0 0)" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1, color: "oklch(0.12 0 0)" }}>
                  Sam Merkovitz
                </div>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 15, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.4 0 0)" }}>
                  sam_zeroth · sammerk.io
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 22,
                color: "oklch(0.28 0 0)",
                lineHeight: 1.45,
                marginTop: 6,
              }}
            >
              Building AI agent infrastructure at Zeroth. Writing about minds,
              machines, and the places philosophy keeps showing up in code.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Variant B: "Document card" — centered big window, paper feel
   ══════════════════════════════════════════════════════════ */
export function VariantB() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: AQUA_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-pixelify), system-ui",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 880,
          height: 500,
          background: "oklch(0.97 0 0)",
          borderRadius: 14,
          boxShadow: WINDOW_SHADOW,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 46,
            background: TITLEBAR_BG,
            borderBottom: "1px solid oklch(0.55 0 0)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            position: "relative",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.5) inset",
          }}
        >
          <TrafficLights />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 16,
              fontWeight: 500,
              color: "oklch(0.2 0 0)",
              textShadow: "0 1px 0 oklch(1 0 0 / 0.8)",
            }}
          >
            sammerk.io — README.txt
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "60px 72px",
            gap: 52,
            background: "oklch(0.96 0.005 240)",
          }}
        >
          <SamLogoMark size={200} color="oklch(0.12 0 0)" />
          <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
            <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 16, letterSpacing: "0.2em", textTransform: "uppercase", color: "oklch(0.4 0 0)" }}>
              ~/portfolio/README.txt
            </div>
            <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 0.95, color: "oklch(0.12 0 0)" }}>
              Sam Merkovitz.
            </div>
            <div
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: 22,
                color: "oklch(0.28 0 0)",
                lineHeight: 1.4,
                marginTop: 6,
              }}
            >
              Things I&apos;ve made and thought about — essays on AI, agency,
              and minds. Hosted on a tiny Mac OS desktop.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Variant C: "Finder icon" — huge SM logo as desktop icon
   ══════════════════════════════════════════════════════════ */
export function VariantC() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: AQUA_BG,
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-pixelify), system-ui",
      }}
    >
      <Menubar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          padding: "20px 60px",
        }}
      >
        <div
          style={{
            width: 240,
            height: 240,
            background: "oklch(0.97 0 0)",
            border: "2px solid oklch(0.12 0 0)",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px oklch(0 0 0 / 0.45), 0 8px 16px oklch(0 0 0 / 0.3), 0 1px 0 oklch(1 0 0 / 0.5) inset",
          }}
        >
          <SamLogoMark size={150} color="oklch(0.12 0 0)" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              color: "oklch(1 0 0)",
              textShadow: "0 2px 6px oklch(0 0 0 / 0.5)",
            }}
          >
            Sam Merkovitz
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 18,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "oklch(1 0 0 / 0.82)",
              textShadow: "0 1px 3px oklch(0 0 0 / 0.6)",
            }}
          >
            Personal Website · sammerk.io
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Article OG — document window showing an essay
   ══════════════════════════════════════════════════════════ */
export function VariantArticle({
  title = "What Is It Like to Be Claude?",
  excerpt = "An exploratory analysis of machine experience, after Thomas Nagel (1974). I asked Claude to turn the hard problem of consciousness inward.",
  tag = "Essay",
  date = "March 13, 2026",
  readingTime = "12 min read",
}: {
  title?: string;
  excerpt?: string;
  tag?: string;
  date?: string;
  readingTime?: string;
} = {}) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: AQUA_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-pixelify), system-ui",
        padding: 40,
      }}
    >
      <div
        style={{
          width: 1060,
          height: 520,
          background: "oklch(0.97 0 0)",
          borderRadius: 14,
          boxShadow: WINDOW_SHADOW,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 46,
            background: TITLEBAR_BG,
            borderBottom: "1px solid oklch(0.55 0 0)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            position: "relative",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.5) inset",
          }}
        >
          <TrafficLights />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 16,
              fontWeight: 500,
              color: "oklch(0.2 0 0)",
              textShadow: "0 1px 0 oklch(1 0 0 / 0.8)",
            }}
          >
            {title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.doc
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "54px 72px 40px",
            background: "oklch(0.96 0.005 240)",
          }}
        >
          {/* meta row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, fontFamily: "var(--font-mono), monospace", fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.38 0 0)" }}>
            <span style={{ border: "1.5px solid oklch(0.12 0 0)", padding: "4px 10px", color: "oklch(0.12 0 0)" }}>
              {tag}
            </span>
            <span>·</span>
            <span>{date}</span>
            <span>·</span>
            <span>{readingTime}</span>
          </div>

          {/* title */}
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              color: "oklch(0.1 0 0)",
              marginBottom: 16,
            }}
          >
            {title}
          </div>

          {/* subtitle / excerpt */}
          <div
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: 24,
              color: "oklch(0.3 0 0)",
              lineHeight: 1.42,
              maxWidth: 880,
            }}
          >
            {excerpt.length > 190 ? excerpt.slice(0, 187) + "…" : excerpt}
          </div>

          {/* byline footer */}
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, paddingTop: 24, borderTop: "1px solid oklch(0.78 0 0)" }}>
            <SamLogoMark size={28} color="oklch(0.12 0 0)" />
            <span style={{ fontSize: 18, fontWeight: 700, color: "oklch(0.12 0 0)" }}>Sam Merkovitz</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono), monospace", fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.45 0 0)" }}>
              sammerk.io/writings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Writings index OG — Finder window listing essays
   ══════════════════════════════════════════════════════════ */
export function VariantWritings({
  posts = [
    { title: "What Is It Like to Be Claude?", tag: "Essay", date: "Mar 13, 2026" },
    { title: "A Philosophy of Agents", tag: "Essay", date: "Feb 2, 2026" },
    { title: "Notes on Interpretability", tag: "Notes", date: "Jan 18, 2026" },
  ],
}: {
  posts?: { title: string; tag: string; date: string }[];
} = {}) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: AQUA_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-pixelify), system-ui",
        padding: 40,
      }}
    >
      <div
        style={{
          width: 1060,
          height: 520,
          background: "oklch(0.97 0 0)",
          borderRadius: 14,
          boxShadow: WINDOW_SHADOW,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Titlebar */}
        <div
          style={{
            height: 46,
            background: TITLEBAR_BG,
            borderBottom: "1px solid oklch(0.55 0 0)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            position: "relative",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.5) inset",
          }}
        >
          <TrafficLights />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 16,
              fontWeight: 500,
              color: "oklch(0.2 0 0)",
              textShadow: "0 1px 0 oklch(1 0 0 / 0.8)",
            }}
          >
            Writings
          </span>
        </div>

        {/* Finder toolbar */}
        <div
          style={{
            height: 44,
            background: "linear-gradient(180deg, oklch(0.92 0 0) 0%, oklch(0.82 0 0) 100%)",
            borderBottom: "1px solid oklch(0.5 0 0)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            color: "oklch(0.15 0 0)",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          <span>Writings</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono), monospace", fontSize: 14, color: "oklch(0.4 0 0)" }}>
            {posts.length} items
          </span>
        </div>

        {/* List header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "44px 1fr 140px 200px",
            alignItems: "center",
            gap: 14,
            padding: "10px 24px",
            background: "linear-gradient(180deg, oklch(0.88 0 0), oklch(0.8 0 0))",
            borderBottom: "1px solid oklch(0.5 0 0)",
            color: "oklch(0.12 0 0)",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span />
          <span>Name</span>
          <span style={{ textAlign: "right", fontFamily: "var(--font-mono), monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Tag
          </span>
          <span style={{ textAlign: "right", fontFamily: "var(--font-mono), monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Date
          </span>
        </div>

        {/* Rows */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {posts.slice(0, 4).map((p, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr 140px 200px",
                alignItems: "center",
                gap: 14,
                padding: "14px 24px",
                borderBottom: "1px solid oklch(0.86 0 0)",
                background: i === 0 ? "oklch(0.55 0.18 250 / 0.85)" : "oklch(0.97 0 0)",
                color: i === 0 ? "oklch(0.99 0 0)" : "oklch(0.12 0 0)",
                fontSize: 20,
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <svg width="30" height="30" viewBox="0 0 32 32">
                  <rect x="6" y="3" width="17" height="26" fill={i === 0 ? "oklch(0.97 0 0)" : "oklch(0.97 0.01 90)"} stroke={i === 0 ? "oklch(0.12 0 0)" : "oklch(0.12 0 0)"} strokeWidth="1.4" />
                  <path d="M23 3 L23 8 L28 8 L23 3" fill="oklch(0.85 0 0)" stroke="oklch(0.12 0 0)" strokeWidth="1.4" />
                  <line x1="9" y1="11" x2="20" y2="11" stroke="oklch(0.3 0 0)" strokeWidth="0.9" />
                  <line x1="9" y1="14" x2="20" y2="14" stroke="oklch(0.3 0 0)" strokeWidth="0.9" />
                  <line x1="9" y1="17" x2="20" y2="17" stroke="oklch(0.3 0 0)" strokeWidth="0.9" />
                  <line x1="9" y1="20" x2="17" y2="20" stroke="oklch(0.3 0 0)" strokeWidth="0.9" />
                </svg>
              </span>
              <span style={{ fontWeight: i === 0 ? 600 : 500 }}>{p.title}</span>
              <span style={{ textAlign: "right", fontFamily: "var(--font-mono), monospace", fontSize: 14, opacity: 0.8 }}>{p.tag}</span>
              <span style={{ textAlign: "right", fontFamily: "var(--font-mono), monospace", fontSize: 14, opacity: 0.8 }}>{p.date}</span>
            </div>
          ))}

          {/* branding footer */}
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 12, padding: "20px 24px", borderTop: "1px solid oklch(0.78 0 0)", background: "oklch(0.96 0.005 240)" }}>
            <SamLogoMark size={26} color="oklch(0.12 0 0)" />
            <span style={{ fontSize: 16, fontWeight: 700, color: "oklch(0.12 0 0)" }}>Sam Merkovitz</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono), monospace", fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "oklch(0.45 0 0)" }}>
              sammerk.io / writings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Variant D: "About This Mac" dialog style
   ══════════════════════════════════════════════════════════ */
export function VariantD() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: AQUA_BG,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-pixelify), system-ui",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 640,
          background: "linear-gradient(180deg, oklch(0.97 0.005 240) 0%, oklch(0.9 0.005 240) 100%)",
          borderRadius: 14,
          boxShadow: WINDOW_SHADOW,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 38,
            background: TITLEBAR_BG,
            borderBottom: "1px solid oklch(0.55 0 0)",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            position: "relative",
            boxShadow: "0 1px 0 oklch(1 0 0 / 0.5) inset",
          }}
        >
          <TrafficLights />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 14,
              fontWeight: 500,
              color: "oklch(0.2 0 0)",
              textShadow: "0 1px 0 oklch(1 0 0 / 0.8)",
            }}
          >
            About This Site
          </span>
        </div>
        <div style={{ padding: "44px 56px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <SamLogoMark size={120} color="oklch(0.12 0 0)" />
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1, color: "oklch(0.12 0 0)" }}>
            Sam Merkovitz
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 14,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(0.4 0 0)",
            }}
          >
            Version 1.0 · Aqua
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: 18,
              textAlign: "center",
              color: "oklch(0.3 0 0)",
              lineHeight: 1.45,
              maxWidth: 440,
              marginTop: 4,
            }}
          >
            Things I&apos;ve made and thought about — essays, projects, and a
            tiny Mac OS desktop you can poke at.
          </div>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid oklch(0.75 0 0)",
              marginTop: 14,
              paddingTop: 14,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(0.45 0 0)",
            }}
          >
            <span>sammerk.io</span>
            <span>@sam_zeroth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
