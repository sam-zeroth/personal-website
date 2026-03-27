"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store/useStore";
import { scrollSections } from "./scrollConfig";
import FloatingModal from "./FloatingModal";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionsProps {
  scrollEnabled: boolean;
}

export default function ScrollSections({ scrollEnabled }: ScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const setScrollState = useStore((s) => s.setScrollState);
  const setScrollMode = useStore((s) => s.setScrollMode);
  const scrollPhase = useStore((s) => s.scrollPhase);
  const scrollProgress = useStore((s) => s.scrollProgress);

  useEffect(() => {
    if (!scrollEnabled || !containerRef.current) return;

    ScrollTrigger.refresh();

    const triggers: ScrollTrigger[] = [];

    scrollSections.forEach((section, i) => {
      const el = sectionRefs.current[i];
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          setScrollState(section.phase, self.progress);
        },
      });
      triggers.push(trigger);
    });

    if (playgroundRef.current) {
      const playgroundTrigger = ScrollTrigger.create({
        trigger: playgroundRef.current,
        start: "top center",
        onEnter: () => setScrollMode(false),
        onLeaveBack: () => {
          setScrollMode(true);
          setScrollState("contact", 1);
        },
      });
      triggers.push(playgroundTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [scrollEnabled, setScrollState, setScrollMode]);

  const currentSection = scrollSections.find((s) => s.phase === scrollPhase);
  const modalVisible =
    currentSection != null &&
    scrollProgress > 0.3 &&
    scrollProgress < 0.95;

  return (
    <>
      <div ref={containerRef} className="relative z-10" style={{ pointerEvents: "none" }}>
        <div style={{ height: "100vh" }} />

        {scrollSections.map((section, i) => (
          <div
            key={section.phase}
            ref={(el) => { sectionRefs.current[i] = el; }}
            style={{ height: `${section.sectionHeight}vh` }}
          />
        ))}

        <div
          ref={playgroundRef}
          style={{ height: "100vh" }}
        />
      </div>

      <FloatingModal
        activeRegion={currentSection?.region ?? null}
        modalSide={currentSection?.modalSide ?? "right"}
        visible={modalVisible}
      />
    </>
  );
}
