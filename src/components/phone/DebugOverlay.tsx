"use client";

import { useEffect, useState } from "react";

export default function DebugOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).has("debug"));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => {
      const cs = getComputedStyle(document.documentElement);
      const bodyCs = getComputedStyle(document.body);
      const view = document.querySelector(".ios-app-view") as HTMLElement | null;
      const stage = document.querySelector(".ios-stage") as HTMLElement | null;
      const writings = document.querySelector(".writings-page-root") as HTMLElement | null;
      const target = view ?? writings ?? stage;
      const r = target?.getBoundingClientRect();
      const article = document.querySelector("article") as HTMLElement | null;
      const ar = article?.getBoundingClientRect();
      const vvH = window.visualViewport?.height ?? 0;
      const docH = document.documentElement.scrollHeight;
      setInfo({
        "safe-top": cs.getPropertyValue("--safe-top").trim() || "0px",
        "safe-bottom": cs.getPropertyValue("--safe-bottom").trim() || "0px",
        "innerH": String(window.innerHeight),
        "visualH": String(vvH),
        "vv-offT": String(window.visualViewport?.offsetTop ?? "-"),
        "docH": String(docH),
        "scrollY": String(window.scrollY),
        "html-bg": cs.backgroundColor,
        "body-bg": bodyCs.backgroundColor,
        "color-scheme": cs.colorScheme,
        "theme-color": document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content ?? "-",
        active: view ? "app-view" : writings ? "writings" : stage ? "stage" : "none",
        "root.rect": r ? `${Math.round(r.top)}→${Math.round(r.bottom)} h=${Math.round(r.height)}` : "-",
        "article.rect": ar ? `${Math.round(ar.top)}→${Math.round(ar.bottom)} h=${Math.round(ar.height)}` : "-",
      });
    };
    tick();
    const id = setInterval(tick, 500);
    const onResize = () => tick();
    const onScroll = () => tick();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999999,
          padding: "6px 10px",
          fontFamily: "ui-monospace, monospace",
          fontSize: 10,
          lineHeight: 1.35,
          color: "oklch(0.99 0 0)",
          background: "oklch(0 0 0 / 0.82)",
          backdropFilter: "blur(8px)",
          pointerEvents: "none",
          whiteSpace: "pre-wrap",
        }}
      >
        {Object.entries(info)
          .map(([k, v]) => `${k}: ${v}`)
          .join("  ·  ")}
      </div>
      {/* Fixed sentinel: tells us whether fixed elements extend past the visible
          viewport bottom (i.e., whether Safari chrome overlays our page or
          clips it). If "FIXED BOTTOM" shows flush with the screen bottom,
          Safari is overlaying. If there's a gap below it, Safari is clipping. */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: 24,
          zIndex: 999998,
          background: "oklch(0.65 0.25 20)",
          color: "oklch(0.99 0 0)",
          fontFamily: "ui-monospace, monospace",
          fontSize: 10,
          textAlign: "center",
          lineHeight: "24px",
          pointerEvents: "none",
        }}
      >
        FIXED bottom:0
      </div>
    </>
  );
}
