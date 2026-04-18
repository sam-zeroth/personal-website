"use client";

import { useEffect, useState } from "react";
import PixelMark from "@/components/mac/PixelMark";

const BOOT_HOLD_MS = 3800;
const BOOT_FADE_MS = 620;
const SESSION_KEY = "boot-v4";

type Phase = "booting" | "fading" | "done";

interface Props {
  isMobile: boolean;
}

export default function BootSequence({ isMobile }: Props) {
  const [phase, setPhase] = useState<Phase>("booting");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyBooted =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "1";

    if (alreadyBooted) {
      setPhase("done");
      return;
    }

    if (reduced) {
      const t = window.setTimeout(() => setPhase("done"), 180);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      return () => window.clearTimeout(t);
    }

    const fadeT = window.setTimeout(() => setPhase("fading"), BOOT_HOLD_MS);
    const doneT = window.setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    }, BOOT_HOLD_MS + BOOT_FADE_MS);

    return () => {
      window.clearTimeout(fadeT);
      window.clearTimeout(doneT);
    };
  }, []);

  if (phase === "done") return null;

  const variant = isMobile ? "boot-ios" : "boot-mac";

  return (
    <div
      className={`boot-stage ${variant}${phase === "fading" ? " boot-fading" : ""}${
        mounted ? " boot-hydrated" : ""
      }`}
      aria-hidden="true"
      role="presentation"
    >
      {!isMobile && <div className="boot-noise" />}
      <div className="boot-inner">
        <PixelMark
          size={isMobile ? 140 : 128}
          className="boot-logo"
        />
        {isMobile ? (
          <div className="boot-progress" aria-label="Starting up">
            <div className="boot-progress-fill" />
          </div>
        ) : (
          <div className="boot-spinner" aria-label="Starting up">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} style={{ ["--i" as string]: i } as React.CSSProperties} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
