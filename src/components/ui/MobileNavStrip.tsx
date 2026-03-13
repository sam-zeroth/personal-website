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
          className="fixed z-10 sm:hidden left-0 right-0 flex justify-center"
          style={{
            bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          }}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
        >
          {/* Liquid glass capsule */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              borderRadius: 50,
              padding: "10px 8px",
              overflow: "hidden",
            }}
          >
            {/* Glass layer — iridescent */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 50,
                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(123,47,247,0.06) 33%, rgba(255,0,110,0.06) 66%, rgba(0,230,118,0.08) 100%)",
                backdropFilter: "blur(24px) saturate(180%) brightness(1.02)",
                WebkitBackdropFilter:
                  "blur(24px) saturate(180%) brightness(1.02)",
              }}
            />

            {/* Border + outer shadow — lens edge */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 50,
                border: "1px solid rgba(255, 255, 255, 0.45)",
                boxShadow:
                  "0 6px 24px rgba(0, 0, 0, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(0, 0, 0, 0.04)",
                pointerEvents: "none",
              }}
            />

            {/* Specular highlight — top shine */}
            <div
              style={{
                position: "absolute",
                top: 1,
                left: "10%",
                right: "10%",
                height: "45%",
                borderRadius: "50px 50px 60% 60%",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.0) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Nav items */}
            {brainRegions.map((region, i) => (
              <motion.button
                key={region.id}
                onClick={() => navigateTo(region.id)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i, type: "spring", damping: 20 }}
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Neural node */}
                <div style={{ position: "relative", width: 14, height: 14 }}>
                  {/* Outer glow ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -4,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${region.color}30 0%, transparent 70%)`,
                    }}
                  />
                  {/* Core dot */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 2,
                      borderRadius: "50%",
                      background: region.color,
                      boxShadow: `0 0 10px ${region.color}50, 0 0 3px ${region.color}80`,
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    color: "rgba(40, 40, 50, 0.6)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {region.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
