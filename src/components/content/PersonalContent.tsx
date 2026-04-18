"use client";

const timeline = [
  {
    period: "Now",
    title: "Zeroth Technology",
    desc: "Building Pyrana — an Enterprise Agent Orchestration Platform. Working on the frontier of AI systems and multi-agent coordination.",
  },
  {
    period: "Previously",
    title: "Kenvue (J&J spin-off)",
    desc: "AdTech — built novel algorithms to improve advertising targeting and spend optimization.",
  },
  {
    period: "Previously",
    title: "Johnson & Johnson",
    desc: "Corporate Technology & MedTech — engineering across enterprise systems and medical technology platforms.",
  },
  {
    period: "Previously",
    title: "Genentech",
    desc: "Data Management — working with biotech data systems at one of the world's leading biotechnology companies.",
  },
];

export default function PersonalContent() {
  return (
    <article>
      <header style={{ marginBottom: 18 }}>
        <span className="small-caps" style={{ opacity: 0.65 }}>About.sam</span>
        <h1
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1,
            marginTop: 6,
            letterSpacing: "-0.01em",
          }}
        >
          hello, i&apos;m sam.
        </h1>
      </header>

      <p
        style={{
          fontSize: 16,
          lineHeight: 1.65,
          marginBottom: 14,
        }}
      >
        Northeastern grad — BS in Computer Science and Philosophy. Deeply interested in the
        intersections of mind, computation, and logic. Currently building AI agent
        infrastructure at Zeroth Technology. Always reading, always learning.
      </p>

      <p style={{ fontSize: 16, lineHeight: 1.65 }}>
        I grew up curious about how things think — brains, machines, languages, and lately
        the systems we build that seem to do a bit of both.
      </p>

      <hr className="rule-dotted" />

      <h2
        style={{
          fontFamily: "var(--font-pixelify), system-ui",
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 14,
          letterSpacing: "0.01em",
        }}
      >
        Résumé
      </h2>

      <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
        {timeline.map((item) => (
          <li
            key={item.title}
            style={{
              display: "grid",
              gridTemplateColumns: "90px 1fr",
              gap: 12,
              paddingBottom: 14,
              borderBottom: "1px dashed oklch(0.65 0.03 80)",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  border: "1.5px solid var(--win-ink)",
                  display: "inline-block",
                }}
              >
                {item.period}
              </span>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-pixelify), system-ui",
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: "oklch(0.3 0.02 80)" }}>
                {item.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <hr className="rule-dotted" />

      <a
        href="https://www.linkedin.com/in/sam-merkovitz/"
        target="_blank"
        rel="noopener noreferrer"
        className="small-caps"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          border: "1.5px solid var(--win-ink)",
          background: "var(--paper)",
          color: "var(--win-ink)",
          textDecoration: "none",
          boxShadow: "2px 2px 0 var(--win-ink)",
        }}
      >
        Connect on LinkedIn →
      </a>
    </article>
  );
}
