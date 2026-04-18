"use client";

const links = [
  {
    label: "Email",
    value: "hello@sammerk.io",
    href: "mailto:hello@sammerk.io",
    symbol: "✉",
  },
  {
    label: "GitHub",
    value: "github.com/sam-zeroth",
    href: "https://github.com/sam-zeroth",
    symbol: "⌘",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sam-merkovitz",
    href: "https://www.linkedin.com/in/sam-merkovitz/",
    symbol: "in",
  },
  {
    label: "Twitter / X",
    value: "@sam_zeroth",
    href: "https://x.com/sam_zeroth",
    symbol: "✦",
  },
];

export default function ContactContent() {
  return (
    <article>
      <header style={{ marginBottom: 18 }}>
        <span className="small-caps" style={{ opacity: 0.65 }}>Rolodex.dat</span>
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
          Get in touch.
        </h1>
      </header>

      <p style={{ fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
        Always open to interesting conversations, collaborations, and new opportunities.
        Pick your channel.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr auto",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              border: "1.5px solid var(--win-ink)",
              background: "var(--win-bg)",
              textDecoration: "none",
              color: "var(--win-ink)",
              boxShadow: "3px 3px 0 var(--win-ink)",
              transition: "transform 0.08s ease, box-shadow 0.08s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-1px, -1px)";
              e.currentTarget.style.boxShadow = "4px 4px 0 var(--win-ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "3px 3px 0 var(--win-ink)";
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: "1.5px solid var(--win-ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--paper)",
                fontFamily: "var(--font-pixelify), system-ui",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {link.symbol}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-pixelify), system-ui",
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {link.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  color: "oklch(0.4 0.02 80)",
                }}
              >
                {link.value}
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 18, opacity: 0.5 }}>↗</span>
          </a>
        ))}
      </div>

      <div
        style={{
          padding: 18,
          background: "var(--selection)",
          border: "1.5px solid var(--win-ink)",
          fontFamily: "var(--font-serif), Georgia, serif",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Let&apos;s build something together.
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.55 }}>
          Whether it&apos;s a project idea, a collaboration, or just a chat about technology —
          I&apos;d love to hear from you.
        </p>
      </div>
    </article>
  );
}
