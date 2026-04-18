import { ImageResponse } from "next/og";
import { getAllWritings } from "@/lib/writings";
import {
  OG_SIZE,
  OG_COLORS,
  OG_AQUA_BG,
  OG_TITLEBAR_BG,
  SamLogoMark,
  TrafficLights,
  loadOGFonts,
} from "@/lib/og";

export const alt = "Writings — Sam Merkovitz";
export const size = OG_SIZE;
export const contentType = "image/png";

function shortDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function OGImage() {
  const all = await getAllWritings();
  const posts = all.slice(0, 4);
  const count = all.length;
  const fonts = await loadOGFonts();

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
          {/* Titlebar */}
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
              Writings
            </div>
          </div>

          {/* Finder toolbar */}
          <div
            style={{
              height: 44,
              background: `linear-gradient(180deg, #e4e4e4 0%, #c9c9c9 100%)`,
              borderBottom: `1px solid ${OG_COLORS.hairline}`,
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              color: OG_COLORS.ink,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <div style={{ display: "flex" }}>Writings</div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: 14,
                color: OG_COLORS.inkMuted,
              }}
            >
              {count} {count === 1 ? "item" : "items"}
            </div>
          </div>

          {/* List header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              background: `linear-gradient(180deg, #d6d6d6 0%, #c3c3c3 100%)`,
              borderBottom: `1px solid ${OG_COLORS.hairline}`,
              color: OG_COLORS.ink,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "JetBrains Mono",
              letterSpacing: 1,
            }}
          >
            <div style={{ width: 44, display: "flex" }} />
            <div style={{ flex: 1, display: "flex" }}>NAME</div>
            <div style={{ width: 140, display: "flex", justifyContent: "flex-end" }}>TAG</div>
            <div style={{ width: 200, display: "flex", justifyContent: "flex-end" }}>DATE</div>
          </div>

          {/* Rows */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {posts.map((p, i) => (
              <div
                key={p.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: `1px solid ${OG_COLORS.rowRule}`,
                  background: i === 0 ? OG_COLORS.rowSelected : OG_COLORS.rowAlt,
                  color: i === 0 ? OG_COLORS.rowSelectedInk : OG_COLORS.ink,
                  fontSize: 20,
                }}
              >
                <div style={{ width: 44, display: "flex", alignItems: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="3" width="17" height="26" fill="#ffffff" stroke="#1e1e1e" strokeWidth="1.4" />
                    <polygon points="23,3 23,8 28,8" fill="#d6d6d6" stroke="#1e1e1e" strokeWidth="1.4" />
                    <line x1="9" y1="11" x2="20" y2="11" stroke="#4c4c4c" strokeWidth="0.9" />
                    <line x1="9" y1="14" x2="20" y2="14" stroke="#4c4c4c" strokeWidth="0.9" />
                    <line x1="9" y1="17" x2="20" y2="17" stroke="#4c4c4c" strokeWidth="0.9" />
                    <line x1="9" y1="20" x2="17" y2="20" stroke="#4c4c4c" strokeWidth="0.9" />
                  </svg>
                </div>
                <div style={{ flex: 1, display: "flex", fontWeight: i === 0 ? 700 : 500 }}>
                  {p.title}
                </div>
                <div
                  style={{
                    width: 140,
                    display: "flex",
                    justifyContent: "flex-end",
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                  }}
                >
                  {p.tag}
                </div>
                <div
                  style={{
                    width: 200,
                    display: "flex",
                    justifyContent: "flex-end",
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                  }}
                >
                  {shortDate(p.date)}
                </div>
              </div>
            ))}

            {/* Byline footer */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "18px 24px",
                borderTop: `1px solid ${OG_COLORS.paperRule}`,
                background: OG_COLORS.windowBody,
              }}
            >
              <SamLogoMark size={26} color={OG_COLORS.ink} />
              <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: OG_COLORS.ink }}>
                Sam Merkovitz
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontSize: 13,
                  letterSpacing: 2,
                  color: OG_COLORS.inkMuted,
                }}
              >
                SAMMERK.IO / WRITINGS
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
