import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllWritings,
  getWriting,
  getAdjacentWritings,
  type WritingFrontmatter,
} from "@/lib/writings";
import SamLogo from "@/components/ui/SamLogo";
import ReadingProgress from "./ReadingProgress";

export async function generateStaticParams() {
  const writings = await getAllWritings();
  return writings.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const raw = await getWriting(slug);
    const { frontmatter } = await compileMDX<WritingFrontmatter>({
      source: raw,
      options: { parseFrontmatter: true },
    });
    return {
      title: `${frontmatter.title} — Sam Merkovitz`,
      description: frontmatter.excerpt,
    };
  } catch {
    return { title: "Writing — Sam Merkovitz" };
  }
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function estimateReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 250));
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let raw: string;
  try {
    raw = await getWriting(slug);
  } catch {
    notFound();
  }

  const { content, frontmatter } = await compileMDX<WritingFrontmatter>({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  const { prev, next } = await getAdjacentWritings(slug);
  const readingTime = estimateReadingTime(raw);

  return (
    <div className="min-h-dvh bg-white">
      <ReadingProgress />

      {/* Top bar */}
      <nav className="writings-topbar">
        <SamLogo size={32} />
        <Link href="/writings" className="writings-back-link">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 3L5 8L10 13" />
          </svg>
          All writings
        </Link>
      </nav>

      <article className="writings-article">
        {/* Meta */}
        <div className="writings-article-meta">
          <span className="writings-article-tag">{frontmatter.tag}</span>
          <span className="writings-meta-dot" />
          <span className="writings-article-date">
            {formatFullDate(frontmatter.date)}
          </span>
          <span className="writings-meta-dot" />
          <span className="writings-article-reading-time">
            {readingTime} min read
          </span>
        </div>

        <h1 className="writings-article-title">{frontmatter.title}</h1>
        <p className="writings-article-subtitle">{frontmatter.excerpt}</p>

        {/* Rule with dot */}
        <div className="writings-article-rule" />

        {/* Body */}
        <div className="writings-article-body">{content}</div>

        {/* Footer nav */}
        {(prev || next) && (
          <div className="writings-article-footer">
            <div className="writings-article-footer-nav">
              {prev ? (
                <Link
                  href={`/writings/${prev.slug}`}
                  className="writings-nav-link"
                >
                  <span className="writings-nav-label">Previous</span>
                  <span className="writings-nav-title">{prev.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/writings/${next.slug}`}
                  className="writings-nav-link writings-nav-link-next"
                >
                  <span className="writings-nav-label">Next</span>
                  <span className="writings-nav-title">{next.title}</span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
