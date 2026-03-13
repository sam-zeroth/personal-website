"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import NeuronCloud from "./NeuronCloud";
import BrainRegionHitZones from "./BrainRegionHitZones";
import { useStore } from "@/store/useStore";

export default function BrainNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const { isZoomed } = useStore();

  useFrame((state) => {
    if (groupRef.current) {
      const speed = isZoomed ? 0.05 : 0.12;
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * speed) * 0.25;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <NeuronCloud />
      <BrainRegionHitZones />
    </group>
  );
}
