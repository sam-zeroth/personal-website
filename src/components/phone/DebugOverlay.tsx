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
      setInfo({
        "safe-top": cs.getPropertyValue("--safe-top").trim() || "0px",
        "safe-bottom": cs.getPropertyValue("--safe-bottom").trim() || "0px",
        "env-top": getComputedStyle(document.body).getPropertyValue("padding-top") || "-",
        "innerH": String(window.innerHeight),
        "visualH": String(window.visualViewport?.height ?? "-"),
        "vv-offT": String(window.visualViewport?.offsetTop ?? "-"),
        "html-bg": cs.backgroundColor,
        "body-bg": bodyCs.backgroundColor,
        active: view ? "app-view" : writings ? "writings" : stage ? "stage" : "none",
        "rect.top": r ? String(Math.round(r.top)) : "-",
        "rect.bottom": r ? String(Math.round(r.bottom)) : "-",
        "rect.h": r ? String(Math.round(r.height)) : "-",
      });
    };
    tick();
    const id = setInterval(tick, 500);
    const onResize = () => tick();
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
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
  );
}
