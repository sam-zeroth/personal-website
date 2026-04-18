"use client";

import Link from "next/link";

const posts = [
  {
    title: "What Is It Like to Be Claude?",
    excerpt:
      "An exploratory analysis of machine experience, after Thomas Nagel. I asked Claude to turn the hard problem of consciousness inward.",
    date: "Mar 2026",
    tag: "Essay",
    slug: "what-is-it-like-to-be-claude",
    readingTime: "12 min read",
  },
];

export default function WritingsContent() {
  return (
    <article>
      <header style={{ marginBottom: 18 }}>
        <span className="small-caps" style={{ opacity: 0.65 }}>Essays.doc</span>
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
          Writings.
        </h1>
      </header>

      <p style={{ fontSize: 16, lineHeight: 1.65, marginBottom: 20 }}>
        Half-essays, half-notes. Mostly about minds, machines, and the unexpected places
        philosophy intersects software.
      </p>

      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/writings/${post.slug}`}
          style={{
            display: "block",
            padding: "16px 18px",
            border: "1.5px solid var(--win-ink)",
            background: "var(--win-bg)",
            marginBottom: 12,
            textDecoration: "none",
            color: "var(--win-ink)",
            boxShadow: "3px 3px 0 var(--win-ink)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span className="tag-chip">{post.tag}</span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                color: "oklch(0.4 0.02 80)",
              }}
            >
              {post.date}
            </span>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontSize: 19,
              fontWeight: 400,
              marginBottom: 6,
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: "oklch(0.3 0.02 80)", marginBottom: 6 }}>
            {post.excerpt}
          </p>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              color: "oklch(0.5 0.02 80)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {post.readingTime} →
          </span>
        </Link>
      ))}

      <hr className="rule-dotted" />

      <Link
        href="/writings"
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
        View all writings →
      </Link>
    </article>
  );
}
