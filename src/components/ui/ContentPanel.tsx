"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { brainRegions } from "@/data/brainData";
import { NeuralDecoration } from "./CortexElements";
import WorkContent from "../content/WorkContent";
import PersonalContent from "../content/PersonalContent";
import WritingsContent from "../content/WritingsContent";
import ContactContent from "../content/ContactContent";

const contentMap: Record<string, React.ComponentType> = {
  work: WorkContent,
  personal: PersonalContent,
  writings: WritingsContent,
  contact: ContactContent,
};

export default function ContentPanel() {
  const { activeRegion, showContent, goHome } = useStore();

  const Content = activeRegion ? contentMap[activeRegion] : null;
  const region = activeRegion
    ? brainRegions.find((r) => r.id === activeRegion)
    : null;

  return (
    <AnimatePresence>
      {showContent && activeRegion && Content && region && (
        <motion.div
          className="fixed right-0 top-0 h-full w-full sm:w-[480px] z-20 content-scrollbar overflow-y-auto overflow-x-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
          }}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Neural decoration */}
          <NeuralDecoration color={region.color} />

          {/* Close button */}
          <button
            onClick={goHome}
            className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
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

          <div className="relative px-10 py-10 pt-10">
            <Content />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
