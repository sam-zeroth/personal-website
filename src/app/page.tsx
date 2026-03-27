"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/store/useStore";
import FloatingModal from "@/components/scroll/FloatingModal";
import {
  scrollSections,
  INTRO_TRACE_DURATION,
  INTRO_FLOAT_DURATION,
  INTRO_ZOOM_DURATION,
} from "@/components/scroll/scrollConfig";


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

const BrainScene = dynamic(() => import("@/components/brain/BrainScene"), {
  ssr: false,
});

const ScrollSections = dynamic(
  () => import("@/components/scroll/ScrollSections"),
  { ssr: false }
);

export default function Home() {
  const goHome = useStore((s) => s.goHome);
  const scrollMode = useStore((s) => s.scrollMode);
  const activeRegion = useStore((s) => s.activeRegion);
  const showContent = useStore((s) => s.showContent);
  const mainRef = useRef<HTMLElement>(null);

  const [phase, setPhase] = useState<
    "tracing" | "floating" | "zooming" | "settled"
  >("tracing");
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const startFloat = useCallback(() => setPhase("floating"), []);

  useEffect(() => {
    const traceTimer = setTimeout(startFloat, INTRO_TRACE_DURATION);
    return () => clearTimeout(traceTimer);
  }, [startFloat]);

  useEffect(() => {
    if (phase !== "floating") return;
    const zoomTimer = setTimeout(() => setPhase("zooming"), INTRO_FLOAT_DURATION);
    return () => clearTimeout(zoomTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "zooming") return;

    const start = performance.now();
    let rafId: number;

    // Ease-out cubic for smooth deceleration
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      const elapsed = performance.now() - start;
      const linear = Math.min(1, elapsed / INTRO_ZOOM_DURATION);
      const progress = easeOut(linear);
      useStore.setState({ scrollPhase: "intro", scrollProgress: progress });

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setPhase("settled");
      }
    };
    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  // Lock body scroll during intro, unlock after settled
  useEffect(() => {
    if (phase !== "settled") {
      document.body.style.overflow = "hidden";
      return;
    }
    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      setScrollEnabled(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [phase]);

  const isTracing = phase === "tracing";
  const pageReady = phase !== "tracing";

  return (
    <main
      ref={mainRef}
      className="relative bg-white overflow-x-hidden"
    >
      {phase !== "settled" && phase !== "zooming" && (
        <div
          className="fixed inset-0 z-40 bg-white"
          style={{
            opacity: isTracing ? 1 : 0,
            transition: `opacity ${INTRO_FLOAT_DURATION}ms ease-out`,
            pointerEvents: isTracing ? "auto" : "none",
          }}
        />
      )}

      <button
        onClick={() => {
          if (!scrollMode) goHome();
          if (scrollMode) window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="fixed z-50 cursor-pointer logo-trace-container"
        style={{
          top: isTracing ? "50%" : "var(--logo-top, 24px)",
          left: isTracing ? "50%" : "var(--logo-left, 24px)",
          width: isTracing ? 140 : "var(--logo-size, 38px)",
          height: isTracing ? 140 : "var(--logo-size-h, 38px)",
          transform: isTracing ? "translate(-50%, -50%)" : "translate(0, 0)",
          marginTop: isTracing ? 0 : "var(--safe-top, 0px)",
          transition: isTracing
            ? "none"
            : `top ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               left ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               width ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               height ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               transform ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        <SamLogo />
      </button>

      <div
        className="fixed inset-0"
        style={{
          opacity: pageReady ? 1 : 0,
          transition: `opacity ${INTRO_FLOAT_DURATION}ms ease-in`,
          pointerEvents: scrollMode ? "none" : "auto",
        }}
      >
        <BrainScene />
      </div>

      {pageReady && <ScrollSections scrollEnabled={scrollEnabled} />}

      {/* FloatingModal for playground mode (clicking lobes at the bottom) */}
      {!scrollMode && (
        <FloatingModal
          activeRegion={activeRegion}
          modalSide={scrollSections.find((s) => s.region === activeRegion)?.modalSide ?? "right"}
          visible={showContent && !!activeRegion}
          onClose={goHome}
        />
      )}

      {phase === "settled" && scrollEnabled && scrollMode && (
        <ScrollIndicator />
      )}
    </main>
  );
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(false);
    window.addEventListener("scroll", onScroll, { once: true });

    const timer = setTimeout(() => setVisible(false), 3000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-pulse-glow"
      style={{
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <p className="text-[11px] text-gray-400 tracking-widest uppercase">
        Scroll to explore
      </p>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-400"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}
