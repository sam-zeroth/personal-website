"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BrainNetwork from "./BrainNetwork";
import CameraController from "./CameraController";

export default function BrainScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 60 }}
      style={{ background: "#ffffff" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        <CameraController />
        <BrainNetwork />
      </Suspense>
    </Canvas>
  );
}
