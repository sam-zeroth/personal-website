"use client";

import { useEffect, useRef, useState } from "react";
import { VariantA, VariantB, VariantC, VariantD, VariantArticle, VariantWritings } from "@/components/og/variants";

const VARIANTS = [
  { id: "B", label: "Home · Document card (chosen)", render: <VariantB /> },
  { id: "Article", label: "Article · /writings/[slug]", render: <VariantArticle /> },
  { id: "Writings", label: "Writings index · /writings", render: <VariantWritings /> },
  { id: "A", label: "Home · Desktop snapshot", render: <VariantA /> },
  { id: "C", label: "Home · Finder icon", render: <VariantC /> },
  { id: "D", label: "Home · About This Site", render: <VariantD /> },
];

const IMESSAGE_PREVIEWS = [
  { id: "B", label: "Home", title: "Sam Merkovitz — Things I've Made and Thought About", host: "sammerk.io", render: <VariantB /> },
  { id: "Article", label: "Article", title: "What Is It Like to Be Claude?", host: "sammerk.io", render: <VariantArticle /> },
  { id: "Writings", label: "Writings", title: "Writings — Sam Merkovitz", host: "sammerk.io", render: <VariantWritings /> },
];

function IMessageBubble({
  title,
  host,
  children,
}: {
  title: string;
  host: string;
  children: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const BUBBLE_IMG_W = 260;

  useEffect(() => {
    const compute = () => {
      const w = wrap.current?.clientWidth ?? BUBBLE_IMG_W;
      setScale(w / 1200);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      style={{
        width: BUBBLE_IMG_W,
        background: "oklch(0.95 0.003 240)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 4px 12px oklch(0 0 0 / 0.4)",
        color: "oklch(0.1 0 0)",
        fontFamily: "-apple-system, 'Helvetica Neue', system-ui, sans-serif",
      }}
    >
      <div
        ref={wrap}
        style={{
          width: BUBBLE_IMG_W,
          aspectRatio: "1200 / 630",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 1200,
            height: 630,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
      <div style={{ padding: "8px 12px 12px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: "oklch(0.5 0 0)", marginTop: 2 }}>{host}</div>
      </div>
    </div>
  );
}

function Thumb({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const w = wrap.current?.clientWidth ?? 1200;
      setScale(w / 1200);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      style={{
        width: "100%",
        aspectRatio: "1200 / 630",
        overflow: "hidden",
        position: "relative",
        border: "1px solid oklch(0.35 0 0)",
        borderRadius: 6,
        boxShadow: "0 12px 30px oklch(0 0 0 / 0.5)",
      }}
    >
      <div
        style={{
          width: 1200,
          height: 630,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function OGMockups() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "oklch(0.16 0.01 240)",
        color: "oklch(0.96 0 0)",
        fontFamily: "var(--font-pixelify), system-ui",
        padding: "36px 24px 80px",
        overflow: "auto",
        position: "fixed",
        inset: 0,
      }}
    >
      <header style={{ maxWidth: 1240, margin: "0 auto 28px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 6 }}>
          OG image mockups
        </h1>
        <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 13, color: "oklch(0.7 0 0)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          1200 × 630 · pick one
        </p>
      </header>

      {/* iMessage preview row */}
      <section style={{ maxWidth: 1240, margin: "0 auto 48px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "oklch(0.6 0 0)",
              border: "1px solid oklch(0.5 0 0)",
              padding: "3px 8px",
              borderRadius: 3,
            }}
          >
            iMessage
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>How each looks in a bubble (260px wide)</h2>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, oklch(0.18 0.01 240) 0%, oklch(0.12 0.01 250) 100%)",
            borderRadius: 14,
            padding: "28px 24px",
            display: "flex",
            gap: 28,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {IMESSAGE_PREVIEWS.map((p) => (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <IMessageBubble title={p.title} host={p.host}>
                {p.render}
              </IMessageBubble>
              <span style={{ fontSize: 11, color: "oklch(0.6 0 0)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-mono), monospace" }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 12, color: "oklch(0.6 0 0)", lineHeight: 1.5, maxWidth: 720 }}>
          iMessage preserves the 1200×630 aspect ratio but scales the image down to ~260px wide in a message bubble.
          Platforms like Slack, Discord, Twitter/X show the full size — so these are the tightest case.
        </p>
      </section>

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 40,
        }}
      >
        {VARIANTS.map((v) => (
          <section key={v.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "oklch(0.6 0 0)",
                  border: "1px solid oklch(0.5 0 0)",
                  padding: "3px 8px",
                  borderRadius: 3,
                }}
              >
                Variant {v.id}
              </span>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>{v.label}</h2>
            </div>
            <Thumb>{v.render}</Thumb>
          </section>
        ))}
      </div>
    </div>
  );
}
