"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { brainRegions } from "@/data/brainData";

export default function CameraController() {
  const { camera } = useThree();
  const { activeRegion, isZoomed } = useStore();
  const targetPos = useRef(new THREE.Vector3(0, 0, 4.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (isZoomed && activeRegion) {
      const region = brainRegions.find((r) => r.id === activeRegion);
      if (region) {
        const [x, y, z] = region.hitCenter;
        targetPos.current.set(x * 0.4, y * 0.4, 2.8);
        targetLookAt.current.set(x * 0.5, y * 0.5, z * 0.3);
      }
    } else {
      targetPos.current.set(0, 0, 4.5);
      targetLookAt.current.set(0, 0, 0);
    }

    camera.position.lerp(targetPos.current, 0.035);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
