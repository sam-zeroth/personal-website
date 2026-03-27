"use client";

import { useRef } from "react";
import { Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { brainRegions, type BrainRegionDef } from "@/data/brainData";

const DRAG_THRESHOLD = 5; // pixels — movement beyond this counts as a drag

// --- Change this to preview different styles ---
// Options: "minimal" | "clean" | "scientific" | "technical"
const LABEL_STYLE: "minimal" | "clean" | "scientific" | "technical" = "minimal";

export default function BrainRegionHitZones() {
  const { hoveredRegion, isZoomed, scrollMode, navigateTo, setHoveredRegion } = useStore();
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  return (
    <group>
      {brainRegions.map((region) => {
        const isHovered = hoveredRegion === region.id;

        return (
          <group key={region.id!}>
            <Sphere
              args={[region.hitRadius, 16, 16]}
              position={region.hitCenter}
              onPointerDown={(e) => {
                pointerDownPos.current = { x: e.clientX, y: e.clientY };
              }}
              onClick={(e) => {
                if (!isZoomed && !scrollMode && pointerDownPos.current) {
                  const dx = e.clientX - pointerDownPos.current.x;
                  const dy = e.clientY - pointerDownPos.current.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < DRAG_THRESHOLD) {
                    navigateTo(region.id);
                  }
                }
                pointerDownPos.current = null;
              }}
              onPointerOver={() => {
                if (!isZoomed && !scrollMode) {
                  setHoveredRegion(region.id);
                  if (window.matchMedia("(pointer: fine)").matches) {
                    document.body.style.cursor = "pointer";
                  }
                }
              }}
              onPointerOut={() => {
                if (hoveredRegion === region.id) {
                  setHoveredRegion(null);
                  if (window.matchMedia("(pointer: fine)").matches) {
                    document.body.style.cursor = "default";
                  }
                }
              }}
            >
              <meshBasicMaterial
                transparent
                opacity={0}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </Sphere>

            {isHovered && !isZoomed && !scrollMode && (
              <Html
                position={[
                  region.hitCenter[0] + region.labelOffset[0],
                  region.hitCenter[1] + region.labelOffset[1],
                  region.hitCenter[2] + region.labelOffset[2],
                ]}
                center
                style={{ pointerEvents: "none" }}
                zIndexRange={[100, 0]}
              >
                <div style={{ animation: "fadeIn 0.2s ease-out" }}>
                  {LABEL_STYLE === "minimal" && <LabelMinimal region={region} />}
                  {LABEL_STYLE === "clean" && <LabelClean region={region} />}
                  {LABEL_STYLE === "scientific" && <LabelScientific region={region} />}
                  {LABEL_STYLE === "technical" && <LabelTechnical region={region} />}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ─── STYLE A: Minimal ───────────────────────────────────────────
// Just the name + a thin line connecting to the lobe. Ultra clean.
function LabelMinimal({ region }: { region: BrainRegionDef }) {
  return (
    <div
      className="select-none flex flex-col items-center px-6 py-3 rounded-xl"
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 0 40px 20px rgba(255, 255, 255, 0.8)",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: region.color }}
        />
        <span
          className="text-base font-semibold tracking-tight"
          style={{ color: region.color }}
        >
          {region.label}
        </span>
      </div>
      <span className="text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">
        {region.lobe}
      </span>
    </div>
  );
}

// ─── STYLE B: Clean ─────────────────────────────────────────────
// Compact card. Lobe name as context, section name prominent. No border noise.
function LabelClean({ region }: { region: BrainRegionDef }) {
  return (
    <div
      className="select-none rounded-xl px-5 py-3.5 min-w-[180px]"
      style={{
        background: "rgba(255, 255, 255, 0.97)",
        boxShadow: `0 4px 24px ${region.color}18, 0 1px 4px rgba(0,0,0,0.04)`,
        backdropFilter: "blur(16px)",
        borderBottom: `2px solid ${region.color}`,
      }}
    >
      <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-gray-400">
        {region.lobe}
      </span>
      <h3
        className="text-lg font-bold tracking-tight leading-tight mt-0.5"
        style={{ color: region.color }}
      >
        {region.label}
      </h3>
      <p className="text-[11px] text-gray-500 mt-1 leading-snug">
        {region.description}
      </p>
    </div>
  );
}

// ─── STYLE C: Scientific ────────────────────────────────────────
// Paper/journal style. Monospace lobe label, annotation-like.
function LabelScientific({ region }: { region: BrainRegionDef }) {
  return (
    <div className="select-none min-w-[200px]">
      {/* Annotation line */}
      <div className="flex items-start gap-3">
        {/* Vertical color bar */}
        <div
          className="w-0.5 rounded-full self-stretch mt-0.5"
          style={{ background: region.color, minHeight: 48 }}
        />
        <div>
          {/* Lobe — monospace, clinical */}
          <span
            className="text-[10px] font-mono font-medium tracking-wider uppercase"
            style={{ color: region.color }}
          >
            {region.lobe}
          </span>

          {/* Section name */}
          <h3 className="text-base font-semibold text-gray-800 tracking-tight leading-tight mt-0.5">
            {region.label}
          </h3>

          {/* Function */}
          <p className="text-[10px] text-gray-400 mt-1 leading-snug font-mono">
            {region.lobeFunction}
          </p>

          {/* Explore hint */}
          <div className="flex items-center gap-1.5 mt-2">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{ color: region.color }}
            >
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1" />
              <path d="M5 3v4M3 5h4" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span className="text-[9px] text-gray-400 tracking-wide">
              Explore region
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STYLE D: Technical ─────────────────────────────────────────
// Dark mode card. Dense info. Like a diagnostic readout.
function LabelTechnical({ region }: { region: BrainRegionDef }) {
  return (
    <div
      className="select-none rounded-lg px-4 py-3 min-w-[210px]"
      style={{
        background: "rgba(20, 20, 28, 0.92)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${region.color}40`,
        boxShadow: `0 0 20px ${region.color}15`,
      }}
    >
      {/* Top row: lobe + region indicator */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-[9px] font-mono font-medium tracking-[0.12em] uppercase"
          style={{ color: region.color }}
        >
          {region.lobe}
        </span>
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: region.color }}
          />
          <span className="text-[8px] font-mono text-gray-500">ACTIVE</span>
        </div>
      </div>

      {/* Section name */}
      <h3
        className="text-base font-bold tracking-tight leading-tight"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        {region.label}
      </h3>

      {/* Divider */}
      <div
        className="h-px w-full my-2"
        style={{ background: `${region.color}25` }}
      />

      {/* Stats-like row */}
      <div className="flex gap-4">
        <div>
          <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider">
            Function
          </span>
          <p className="text-[10px] text-gray-300 leading-snug mt-0.5 max-w-[140px]">
            {region.lobeFunction}
          </p>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-[9px] font-mono text-gray-500">
          [{`>`}] {region.description}
        </span>
      </div>
    </div>
  );
}
