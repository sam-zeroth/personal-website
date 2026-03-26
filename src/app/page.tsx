"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import NavigationOverlay from "@/components/ui/NavigationOverlay";
import ContentPanel from "@/components/ui/ContentPanel";
import MobileNavStrip from "@/components/ui/MobileNavStrip";
import { useStore } from "@/store/useStore";

const INTRO_DURATION = 2800; // ms — full trace animation + brief hold
const FLOAT_DURATION = 1000; // ms — logo floats to corner

function SamLogo() {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        className="logo-trace-path"
        d="m210.8 9h-62.8l35.2 52.31 21.3-34.18c0.72-0.3 2.99-0.13 6.56-0.13 3.56 0 7.44 1.71 9.96 3.79l-37.82 60.12-44.42-68.83c-6.64-9.89-16.03-12.99-25.59-13.08h-66.94c-20.15 0-37.24 16.71-37.24 39.7v63.6l73.95 58.18v20.79h-18.66v-17.33l-17.97-14.23v49.75h55v-46.98l-73.95-58.57v-57.89c0-9.96 7.71-18.95 17.89-18.95h68.05c2.91 0 5.67 1.05 5.67 1.84v83.21l18.05 14.76v-73.36l46.07 70.76 45.98-70.67v156c0 10.49-9.27 18.75-18.73 18.35v-116.9l-0.63 0.09-18.05 27.41v89.36h-18.32v-89.54l-18.41-27.41-0.63 0.36v116.3h-5.48c-2.61 7.82-5.89 14.35-10.91 18.91h72.87c21.12 0 36.21-18.91 36.21-37.55v-163c0-19.91-16.06-37.02-36.21-37.02z"
        fill="var(--foreground)"
        style={{
          "--duration": "1.6s",
          "--delay": "0s",
        } as React.CSSProperties}
      />
      <path
        className="logo-trace-path"
        d="m9.06 130.1v78.43c0 20.38 15.62 38.09 37.18 38.09h60.53c19.26 0 29.92-16.98 29.92-32.96v-68.38l-72.31-58.4v-23.05h18.57v19.09l18.37 14.75v-51.92h-55v49.52l72.49 57.83v59.36c0 9.5-5.1 15.42-12.39 15.42h-60.18c-10.18 0-18.96-8.9-18.96-18.16v-64.53l-18.22-15.09z"
        fill="var(--foreground)"
        style={{
          "--duration": "1.2s",
          "--delay": "0.4s",
        } as React.CSSProperties}
      />
    </svg>
  );
}

// Dynamic import for Three.js (no SSR)
const BrainScene = dynamic(() => import("@/components/brain/BrainScene"), {
  ssr: false,
});

export default function Home() {
  const goHome = useStore((s) => s.goHome);
  const showContent = useStore((s) => s.showContent);
  // "tracing" = logo drawing in center, "floating" = moving to corner, "settled" = in final position
  const [phase, setPhase] = useState<"tracing" | "floating" | "settled">("tracing");

  const startFloat = useCallback(() => {
    setPhase("floating");
  }, []);

  useEffect(() => {
    const traceTimer = setTimeout(startFloat, INTRO_DURATION);
    return () => clearTimeout(traceTimer);
  }, [startFloat]);

  useEffect(() => {
    if (phase !== "floating") return;
    const settleTimer = setTimeout(() => setPhase("settled"), FLOAT_DURATION);
    return () => clearTimeout(settleTimer);
  }, [phase]);

  const isTracing = phase === "tracing";
  const pageReady = phase === "floating" || phase === "settled";

  return (
    <main className="w-screen h-dvh relative overflow-hidden bg-white">
      {/* White backdrop that fades when floating starts */}
      {phase !== "settled" && (
        <div
          className="fixed inset-0 z-40 bg-white"
          style={{
            opacity: isTracing ? 1 : 0,
            transition: `opacity ${FLOAT_DURATION}ms ease-out`,
            pointerEvents: isTracing ? "auto" : "none",
          }}
        />
      )}

      {/* Logo — traces in center, floats to top-left, stays as home button */}
      <button
        onClick={goHome}
        className={`fixed z-50 cursor-pointer logo-trace-container ${showContent ? 'max-sm:hidden' : ''}`}
        style={{
          top: isTracing ? "50%" : "var(--logo-top, 24px)",
          left: isTracing ? "50%" : "var(--logo-left, 24px)",
          width: isTracing ? 140 : "var(--logo-size, 38px)",
          height: isTracing ? 140 : "var(--logo-size-h, 38px)",
          transform: isTracing ? "translate(-50%, -50%)" : "translate(0, 0)",
          marginTop: isTracing ? 0 : "var(--safe-top, 0px)",
          transition: isTracing
            ? "none"
            : `top ${FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               left ${FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               width ${FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               height ${FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               transform ${FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        <SamLogo />
      </button>

      {/* 3D Brain Canvas — mounts immediately so it loads behind the white backdrop */}
      <div
        className="absolute inset-0"
        style={{
          opacity: pageReady ? 1 : 0,
          transition: `opacity ${FLOAT_DURATION}ms ease-in`,
        }}
      >
        <BrainScene />
      </div>

      {/* UI Overlays — mount once floating starts */}
      {pageReady && (
        <>
          <NavigationOverlay />
          <ContentPanel />
          <MobileNavStrip />
        </>
      )}
    </main>
  );
}
