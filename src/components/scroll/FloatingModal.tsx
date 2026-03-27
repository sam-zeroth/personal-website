"use client";

import { motion, AnimatePresence } from "framer-motion";
import { brainRegions } from "@/data/brainData";
import { NeuralDecoration } from "@/components/ui/CortexElements";
import WorkContent from "@/components/content/WorkContent";
import PersonalContent from "@/components/content/PersonalContent";
import WritingsContent from "@/components/content/WritingsContent";
import ContactContent from "@/components/content/ContactContent";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { ScrollSectionConfig } from "./scrollConfig";

const contentMap: Record<string, React.ComponentType> = {
  work: WorkContent,
  personal: PersonalContent,
  writings: WritingsContent,
  contact: ContactContent,
};

interface FloatingModalProps {
  activeRegion: string | null;
  modalSide: ScrollSectionConfig["modalSide"];
  visible: boolean;
  onClose?: () => void;
}

export default function FloatingModal({
  activeRegion,
  modalSide,
  visible,
  onClose,
}: FloatingModalProps) {
  const isMobile = useIsMobile(640);
  const Content = activeRegion ? contentMap[activeRegion] : null;
  const region = activeRegion
    ? brainRegions.find((r) => r.id === activeRegion)
    : null;

  const getMotionProps = () => {
    if (isMobile) {
      return {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 100 },
      };
    }
    switch (modalSide) {
      case "right":
        return {
          initial: { opacity: 0, x: 60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 60 },
        };
      case "left":
        return {
          initial: { opacity: 0, x: -60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -60 },
        };
      case "bottom":
        return {
          initial: { opacity: 0, y: 60 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 60 },
        };
    }
  };

  const getPositionClasses = () => {
    if (isMobile) {
      return "floating-modal-mobile";
    }
    switch (modalSide) {
      case "right":
        return "right-6 top-1/2 -translate-y-1/2 w-[380px] max-h-[80vh]";
      case "left":
        return "left-6 top-1/2 -translate-y-1/2 w-[380px] max-h-[80vh]";
      case "bottom":
        return "bottom-6 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] max-h-[45vh]";
    }
  };

  return (
    <AnimatePresence>
      {visible && Content && region && (
        <motion.div
          key={activeRegion}
          className={`fixed z-20 overflow-y-auto overflow-x-hidden rounded-2xl content-scrollbar ${getPositionClasses()}`}
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${region.color}40`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
            willChange: "transform, opacity",
          }}
          {...getMotionProps()}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <NeuralDecoration color={region.color} />

          {/* Close button — only in playground mode (when onClose is provided) */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute z-10 w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              style={{ top: 14, right: 14 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>
          )}

          <div className="relative" style={{ padding: "28px 26px 24px" }}>
            <Content />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
