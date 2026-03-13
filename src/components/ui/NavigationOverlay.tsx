"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export default function NavigationOverlay() {
  const { isZoomed, activeRegion, goHome } = useStore();

  return (
    <>
      {/* Top-left: Name / Brand */}
      <motion.div
        className="fixed top-8 left-8 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={goHome}
          className="text-left group cursor-pointer"
        >
          <h1 className="text-lg font-semibold tracking-tight text-gray-800 group-hover:text-gray-600 transition-colors">
            Sam Merkovitz
          </h1>
          <p className="text-[11px] text-gray-400 tracking-widest uppercase">
            Neural Portfolio
          </p>
        </button>
      </motion.div>

      {/* Back button when zoomed */}
      <AnimatePresence>
        {isZoomed && (
          <motion.button
            className="fixed top-8 right-8 z-10 px-4 py-2 rounded-full text-xs font-medium tracking-wide cursor-pointer transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1 }}
          >
            <p className="text-[11px] text-gray-400 tracking-widest uppercase animate-pulse-glow">
              Click a node to explore
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
