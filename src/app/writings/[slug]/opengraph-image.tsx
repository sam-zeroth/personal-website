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
          <svg width="36" height="35" viewBox="0 0 345 333" fill="none">
            <path
              d="M143.823 20.0787C161.04 8.02346 183.96 8.02347 201.177 20.0787L314.766 99.6085C332.739 112.192 340.408 135.023 333.678 155.905L290.349 290.338C283.691 310.997 264.465 325 242.76 325H102.24C80.535 325 61.309 310.997 54.6507 290.338L11.3221 155.905C4.59157 135.023 12.2611 112.192 30.2339 99.6085L143.823 20.0787Z"
              stroke="white"
              strokeWidth="16"
              strokeLinejoin="round"
            />
            <path
              d="M41 247.5C41 247.5 127.5 328 165.5 247.5C180 177 56.5 207 59 138C67 95.5 128 94 151 118C182.146 150.5 214.5 211.5 214.5 211.5"
              stroke="white"
              strokeWidth="16"
            />
            <path
              d="M297 269C297 269 297 176 294.5 142C292 112 274 117.179 265.5 127.5C242.895 164 216.5 209.5 216.5 209.5"
              stroke="white"
              strokeWidth="16"
            />
            <circle
              cx="215"
              cy="224"
              r="8"
              fill="#555"
              stroke="white"
              strokeWidth="14"
            />
          </svg>
          <span style={{ fontSize: 22, color: "#aaa" }}>Sam Merkovitz</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
