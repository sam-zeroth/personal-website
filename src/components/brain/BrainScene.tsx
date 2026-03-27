"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import BrainNetwork from "./BrainNetwork";
import CameraController from "./CameraController";
import ScrollAnimationController from "@/components/scroll/ScrollAnimationController";

// Suppress THREE.Clock deprecation warning (triggered by R3F v9 internals)
const _origWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
  _origWarn.apply(console, args);
};

export default function BrainScene() {
  const brainGroupRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ background: "#ffffff", touchAction: "none" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        <CameraController />
        <ScrollAnimationController brainGroupRef={brainGroupRef} />
        <BrainNetwork ref={brainGroupRef} />
      </Suspense>
    </Canvas>
  );
}
