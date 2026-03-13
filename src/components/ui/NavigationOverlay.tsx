"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useIsTouchDevice } from "@/hooks/useIsMobile";

export default function NavigationOverlay() {
  const { isZoomed, goHome } = useStore();
  const isTouch = useIsTouchDevice();

  return (
    <>
      {/* Back button when zoomed */}
      <AnimatePresence>
        {isZoomed && (
          <motion.button
            className="fixed top-4 right-4 sm:top-8 sm:right-8 z-10 px-4 py-2 rounded-full text-xs font-medium tracking-wide cursor-pointer transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              marginTop: "var(--safe-top, 0px)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={goHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">&larr;</span> Back to Brain
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <AnimatePresence>
        {!isZoomed && (
          <motion.div
            className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1 }}
          >
            <p className="text-[11px] text-gray-400 tracking-widest uppercase animate-pulse-glow">
              {isTouch ? "Tap a node to explore" : "Click a node to explore"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
