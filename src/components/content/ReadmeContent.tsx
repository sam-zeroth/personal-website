"use client";

export default function ReadmeContent() {
  return (
    <article style={{ fontFamily: "var(--font-mono), monospace", color: "oklch(0.15 0 0)" }}>
      {/* ── File header, like a .txt from 2003 ── */}
      <header
        style={{
          borderBottom: "1px dashed oklch(0.6 0 0)",
          paddingBottom: 14,
          marginBottom: 24,
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "oklch(0.4 0 0)",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>README.txt</span>
          <span>Plain Text · 6 KB</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, opacity: 0.7 }}>
          <span>Modified: April 2026</span>
          <span>by Sam Merkovitz</span>
        </div>
      </header>

      <h1
        style={{
          fontFamily: "var(--font-pixelify), system-ui",
          fontSize: 32,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          marginBottom: 6,
        }}
      >
        Read Me First.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: 17,
          color: "oklch(0.35 0 0)",
          marginBottom: 22,
          fontStyle: "italic",
        }}
      >
        A short guide to this site, in case you&apos;re wondering what&apos;s going on.
      </p>

      <section style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 16, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 18 }}>
          Hi. You&apos;re looking at a desktop. It&apos;s styled after early-2000s Mac OS X — pinstripe
          title bars, a brushed-metal menu bar, traffic lights on every window. On a phone, it
          becomes an iOS 6 home screen. Same metaphor, different hardware.
        </p>

        <p style={{ marginBottom: 18 }}>
          The four icons on the right are the site: <em>About Me</em>, <em>Work</em>,{" "}
          <em>Writings</em>, <em>Contact</em>. Double-click anything. Windows drag from the
          title bar, resize from the bottom-right, maximize on the green light.
        </p>

        <p style={{ marginBottom: 28 }}>
          If you end up on a Writings article, that&apos;s a real document —{" "}
          <code style={{ fontFamily: "var(--font-mono), monospace", fontSize: 14, background: "oklch(0.94 0.005 240)", padding: "1px 6px", border: "1px solid oklch(0.82 0 0)" }}>
            MacWrite
          </code>
          {" "}on desktop, iOS Reader on mobile.
        </p>

        <h2
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 10,
            marginTop: 6,
          }}
        >
          Why a desktop?
        </h2>
        <p style={{ marginBottom: 18 }}>
          Most personal sites are a scroll. This one&apos;s a place — a tiny machine you can poke
          at. It rewards curiosity instead of patience. And a 2003 iMac is the last thing the
          internet was allowed to be weird about, so I figured we&apos;d revisit.
        </p>

        <h2
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 10,
            marginTop: 24,
          }}
        >
          Who made this
        </h2>
        <p style={{ marginBottom: 28 }}>
          I&apos;m Sam Merkovitz. I build AI agent infrastructure at Zeroth Technology and studied
          Computer Science + Philosophy at Northeastern. Most of what I care about lives at the
          intersection of minds, machines, and meaning. Click the <em>About Me</em> icon if you
          want the résumé version.
        </p>
      </section>

      <hr
        style={{
          border: 0,
          borderTop: "1px dashed oklch(0.6 0 0)",
          margin: "28px 0 22px",
        }}
      />

      {/* ── Colophon ── */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-pixelify), system-ui",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          Colophon
        </h2>
        <dl
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 13,
            lineHeight: 1.7,
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: "4px 14px",
          }}
        >
          <dt style={{ color: "oklch(0.45 0 0)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>
            Chrome
          </dt>
          <dd>Pixelify Sans</dd>
          <dt style={{ color: "oklch(0.45 0 0)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>
            Labels
          </dt>
          <dd>JetBrains Mono</dd>
          <dt style={{ color: "oklch(0.45 0 0)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>
            Body
          </dt>
          <dd>Young Serif · Georgia (mobile)</dd>
          <dt style={{ color: "oklch(0.45 0 0)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>
            Stack
          </dt>
          <dd>Next.js · React · Tailwind · MDX</dd>
          <dt style={{ color: "oklch(0.45 0 0)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>
            Source
          </dt>
          <dd>
            <a
              href="https://github.com/sam-zeroth"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "oklch(0.15 0 0)",
                background: "var(--selection)",
                boxShadow: "inset 0 -2px 0 var(--win-ink)",
                padding: "0 2px",
                textDecoration: "none",
              }}
            >
              github.com/sam-zeroth
            </a>
          </dd>
          <dt style={{ color: "oklch(0.45 0 0)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 11 }}>
            Built with
          </dt>
          <dd>Claude Code, and a lot of coffee</dd>
        </dl>
      </section>

      <footer
        style={{
          marginTop: 32,
          paddingTop: 18,
          borderTop: "1px dashed oklch(0.6 0 0)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          color: "oklch(0.5 0 0)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>— EOF —</span>
        <span>Thanks for visiting.</span>
      </footer>
    </article>
  );
}
