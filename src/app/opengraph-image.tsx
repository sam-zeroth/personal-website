import { ImageResponse } from "next/og";
import {
  OG_SIZE,
  OG_COLORS,
  OG_AQUA_BG,
  OG_TITLEBAR_BG,
  SamLogoMark,
  TrafficLights,
  loadOGFonts,
} from "@/lib/og";

export const alt = "Sam Merkovitz — Things I've Made and Thought About";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OGImage() {
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
          fontFamily: "Pixelify Sans",
        }}
      >
        <div
          style={{
            width: 880,
            height: 500,
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
              sammerk.io — README.txt
            </div>
          </div>

          {/* Body */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              padding: "60px 72px",
              gap: 52,
              background: OG_COLORS.windowBody,
            }}
          >
            <SamLogoMark size={200} color={OG_COLORS.ink} />
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  fontFamily: "JetBrains Mono",
                  fontSize: 16,
                  letterSpacing: 3,
                  color: OG_COLORS.inkMuted,
                  marginBottom: 14,
                }}
              >
                ~/PORTFOLIO/README.TXT
              </div>
              <div
                style={{
                  fontFamily: "Pixelify Sans",
                  fontSize: 76,
                  fontWeight: 700,
                  letterSpacing: -2,
                  lineHeight: 1,
                  color: OG_COLORS.ink,
                  marginBottom: 18,
                }}
              >
                Sam Merkovitz.
              </div>
              <div
                style={{
                  fontFamily: "Young Serif",
                  fontSize: 24,
                  color: OG_COLORS.inkSoft,
                  lineHeight: 1.35,
                }}
              >
                Things I&apos;ve made and thought about — essays on AI, agency, and minds. Hosted on a tiny Mac OS desktop.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
