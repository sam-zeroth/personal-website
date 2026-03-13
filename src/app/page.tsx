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
  const pentagon = 1180;
  const letterS = 680;
  const letterM = 420;
  const dot = 160;

  return (
    <svg
      viewBox="0 0 345 333"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        className="logo-trace-path"
        d="M143.823 20.0787C161.04 8.02346 183.96 8.02347 201.177 20.0787L314.766 99.6085C332.739 112.192 340.408 135.023 333.678 155.905L290.349 290.338C283.691 310.997 264.465 325 242.76 325H102.24C80.535 325 61.309 310.997 54.6507 290.338L11.3221 155.905C4.59157 135.023 12.2611 112.192 30.2339 99.6085L143.823 20.0787Z"
        stroke="var(--foreground)"
        strokeWidth="16"
        strokeLinejoin="round"
        style={{
          "--path-length": pentagon,
          "--duration": "1.6s",
          "--delay": "0s",
        } as React.CSSProperties}
      />
      <path
        className="logo-trace-path"
        d="M41 247.5C41 247.5 127.5 328 165.5 247.5C180 177 56.5 207 59 138C67 95.5 128 94 151 118C182.146 150.5 214.5 211.5 214.5 211.5"
        stroke="var(--foreground)"
        strokeWidth="16"
        style={{
          "--path-length": letterS,
          "--duration": "1.4s",
          "--delay": "0.4s",
        } as React.CSSProperties}
      />
      <path
        className="logo-trace-path"
        d="M297 269C297 269 297 176 294.5 142C292 112 274 117.179 265.5 127.5C242.895 164 216.5 209.5 216.5 209.5"
        stroke="var(--foreground)"
        strokeWidth="16"
        style={{
          "--path-length": letterM,
          "--duration": "1.2s",
          "--delay": "0.8s",
        } as React.CSSProperties}
      />
      <circle
        className="logo-trace-path"
        cx="215"
        cy="224"
        r="8"
        stroke="var(--foreground)"
        strokeWidth="14"
        fill="transparent"
        style={{
          "--path-length": dot,
          "--duration": "0.6s",
          "--delay": "1.4s",
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
          height: isTracing ? 135 : "var(--logo-size-h, 37px)",
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
