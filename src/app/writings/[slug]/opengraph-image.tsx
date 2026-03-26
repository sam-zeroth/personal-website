import { ImageResponse } from "next/og";
import { getWriting } from "@/lib/writings";

export const alt = "Sam Merkovitz Writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return data;
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title = "Writing";
  let excerpt = "";
  let tag = "";
  let date = "";

  try {
    const raw = await getWriting(slug);
    const fm = parseFrontmatter(raw);
    title = fm.title || title;
    excerpt = fm.excerpt || excerpt;
    tag = fm.tag || tag;
    if (fm.date) {
      date = new Date(fm.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        {/* Top: tag + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 20,
            color: "#888",
          }}
        >
          {tag && <span>{tag}</span>}
          {tag && date && <span>·</span>}
          {date && <span>{date}</span>}
        </div>

        {/* Middle: title + excerpt */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                fontSize: 24,
                color: "#999",
                lineHeight: 1.4,
                maxWidth: 900,
              }}
            >
              {excerpt.length > 160
                ? excerpt.slice(0, 157) + "..."
                : excerpt}
            </div>
          )}
        </div>

        {/* Bottom: logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="36" height="36" viewBox="0 0 256 256">
            <path
              d="m210.8 9h-62.8l35.2 52.31 21.3-34.18c0.72-0.3 2.99-0.13 6.56-0.13 3.56 0 7.44 1.71 9.96 3.79l-37.82 60.12-44.42-68.83c-6.64-9.89-16.03-12.99-25.59-13.08h-66.94c-20.15 0-37.24 16.71-37.24 39.7v63.6l73.95 58.18v20.79h-18.66v-17.33l-17.97-14.23v49.75h55v-46.98l-73.95-58.57v-57.89c0-9.96 7.71-18.95 17.89-18.95h68.05c2.91 0 5.67 1.05 5.67 1.84v83.21l18.05 14.76v-73.36l46.07 70.76 45.98-70.67v156c0 10.49-9.27 18.75-18.73 18.35v-116.9l-0.63 0.09-18.05 27.41v89.36h-18.32v-89.54l-18.41-27.41-0.63 0.36v116.3h-5.48c-2.61 7.82-5.89 14.35-10.91 18.91h72.87c21.12 0 36.21-18.91 36.21-37.55v-163c0-19.91-16.06-37.02-36.21-37.02z"
              fill="white"
            />
            <path
              d="m9.06 130.1v78.43c0 20.38 15.62 38.09 37.18 38.09h60.53c19.26 0 29.92-16.98 29.92-32.96v-68.38l-72.31-58.4v-23.05h18.57v19.09l18.37 14.75v-51.92h-55v49.52l72.49 57.83v59.36c0 9.5-5.1 15.42-12.39 15.42h-60.18c-10.18 0-18.96-8.9-18.96-18.16v-64.53l-18.22-15.09z"
              fill="white"
            />
          </svg>
          <span style={{ fontSize: 22, color: "#aaa" }}>Sam Merkovitz</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
