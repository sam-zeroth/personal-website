"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

  // Modal visibility state — updated from GSAP callbacks, not Zustand subscriptions
  const [modalState, setModalState] = useState<{
    region: string | null;
    modalSide: "left" | "right" | "bottom";
    visible: boolean;
  }>({ region: null, modalSide: "right", visible: false });

  const updateModal = useCallback((sectionIndex: number, progress: number) => {
    const section = scrollSections[sectionIndex];
    const visible = progress > 0.3 && progress < 0.95;
    setModalState((prev) => {
      if (
        prev.region === section.region &&
        prev.modalSide === section.modalSide &&
        prev.visible === visible
      ) {
        return prev; // No change, skip re-render
      }
      return { region: section.region, modalSide: section.modalSide, visible };
    });
  }, []);

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
          useStore.setState({
            scrollPhase: section.phase,
            scrollProgress: self.progress,
            activeRegion: section.region,
          });
          updateModal(i, self.progress);
        },
      });
      triggers.push(trigger);
    });

    if (playgroundRef.current) {
      const playgroundTrigger = ScrollTrigger.create({
        trigger: playgroundRef.current,
        start: "top center",
        onEnter: () => {
          useStore.getState().setScrollMode(false);
          setModalState({ region: null, modalSide: "right", visible: false });
        },
        onLeaveBack: () => {
          useStore.getState().setScrollMode(true);
          useStore.setState({
            scrollPhase: "contact",
            scrollProgress: 1,
            activeRegion: "contact",
          });
        },
      });
      triggers.push(playgroundTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [scrollEnabled, updateModal]);

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
        activeRegion={modalState.region}
        modalSide={modalState.modalSide}
        visible={modalState.visible}
      />
    </>
  );
}
