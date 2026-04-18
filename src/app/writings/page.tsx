import Link from "next/link";
import { getAllWritings, type WritingMeta } from "@/lib/writings";

export const metadata = {
  title: "Writings",
  description: "Essays, technical posts, and things I'm thinking about.",
};

function groupByYear(writings: WritingMeta[]) {
  const groups: Record<string, WritingMeta[]> = {};
  for (const w of writings) {
    const year = new Date(w.date).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(w);
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function WritingsIndex() {
  const writings = await getAllWritings();
  const grouped = groupByYear(writings);

  return (
    <>
      <nav className="writings-topbar">
        <Link href="/" className="writings-back-link">
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M10 3L5 8L10 13" />
          </svg>
          sam.OS
        </Link>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          Essays &amp; Notes
        </div>
      </nav>

      <div className="writings-index-content">
        <h1 className="writings-index-title">Writings.</h1>
        <p className="writings-index-description">
          Essays, technical posts, and things I&apos;m thinking about — mostly
          at the intersection of minds, machines, and language.
        </p>

        {grouped.map(([year, posts]) => (
          <div key={year} className="writings-year-group">
            <div className="writings-year-label">{year}</div>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writings/${post.slug}`}
                className="writings-post-row"
              >
                <span className="writings-post-row-title">{post.title}</span>
                <div className="writings-post-row-meta">
                  <span className="writings-post-row-tag">{post.tag}</span>
                  <span className="writings-post-row-date">
                    {formatDate(post.date)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
