import { ImageResponse } from "next/og";
import { getWriting } from "@/lib/writings";
import {
  OG_SIZE,
  OG_COLORS,
  OG_AQUA_BG,
  OG_TITLEBAR_BG,
  SamLogoMark,
  TrafficLights,
  loadOGFonts,
} from "@/lib/og";

export const alt = "Sam Merkovitz Writing";
export const size = OG_SIZE;
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

function estimateReadingTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 250));
}

function slugifyTitle(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
  let readingTime = "— min read";

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
    readingTime = `${estimateReadingTime(raw)} min read`;
  } catch {
    // fallback
  }

  const fonts = await loadOGFonts();
  const docName = `${slugifyTitle(title)}.doc`;
  const shownExcerpt = excerpt.length > 190 ? excerpt.slice(0, 187) + "…" : excerpt;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: OG_AQUA_BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          fontFamily: "Pixelify Sans",
        }}
      >
        <div
          style={{
            width: 1060,
            height: 520,
            background: OG_COLORS.windowBg,
            borderRadius: 14,
            display: "flex",
            flexDirection: "column",
            boxShadow: `0 30px 60px rgba(0,0,0,0.5)`,
            border: `1px solid ${OG_COLORS.hairline}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 46,
              background: OG_TITLEBAR_BG,
              borderBottom: `1px solid ${OG_COLORS.hairline}`,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              position: "relative",
            }}
          >
            <TrafficLights />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                color: OG_COLORS.ink,
                fontFamily: "Pixelify Sans",
              }}
            >
              {docName}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "54px 72px 36px",
              background: OG_COLORS.windowBody,
            }}
          >
            {/* meta row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 22,
                fontFamily: "JetBrains Mono",
                fontSize: 15,
                letterSpacing: 2,
                color: OG_COLORS.inkMuted,
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "4px 10px",
                  border: `1px solid ${OG_COLORS.ink}`,
                  color: OG_COLORS.ink,
                  fontFamily: "JetBrains Mono",
                  fontSize: 15,
                  letterSpacing: 2,
                }}
              >
                {tag.toUpperCase()}
              </div>
              <div style={{ display: "flex" }}>·</div>
              <div style={{ display: "flex" }}>{date.toUpperCase()}</div>
              <div style={{ display: "flex" }}>·</div>
              <div style={{ display: "flex" }}>{readingTime.toUpperCase()}</div>
            </div>

            <div
              style={{
                fontFamily: "Pixelify Sans",
                fontSize: 66,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1.02,
                color: OG_COLORS.ink,
                marginBottom: 18,
                display: "flex",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontFamily: "Young Serif",
                fontSize: 24,
                color: OG_COLORS.inkSoft,
                lineHeight: 1.4,
                display: "flex",
              }}
            >
              {shownExcerpt}
            </div>

            {/* byline */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingTop: 24,
                borderTop: `1px solid ${OG_COLORS.paperRule}`,
              }}
            >
              <SamLogoMark size={28} color={OG_COLORS.ink} />
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 700,
                  color: OG_COLORS.ink,
                }}
              >
                Sam Merkovitz
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontSize: 14,
                  letterSpacing: 2,
                  color: OG_COLORS.inkMuted,
                }}
              >
                SAMMERK.IO/WRITINGS
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
