"use client";

import { useStore } from "@/store/useStore";
import { brainRegions } from "@/data/brainData";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileNavStrip() {
  const { isZoomed, showContent, navigateTo } = useStore();
  const visible = !isZoomed && !showContent;

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="fixed bottom-0 left-0 right-0 z-10 sm:hidden"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <div
            className="grid grid-cols-4"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {brainRegions.map((region) => (
              <button
                key={region.id}
                onClick={() => navigateTo(region.id)}
                className="flex flex-col items-center gap-1 py-3 cursor-pointer active:bg-gray-50 transition-colors"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: region.color }}
                />
                <span className="text-[10px] font-medium tracking-wide text-gray-600">
                  {region.label}
                </span>
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
