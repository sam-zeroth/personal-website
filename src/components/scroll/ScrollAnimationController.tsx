"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import {
  scrollSections,
  DEFAULT_CAMERA_POS,
  DEFAULT_LOOK_AT,
  INTRO_CAMERA_START_Z,
} from "./scrollConfig";

export default function ScrollAnimationController({
  brainGroupRef,
}: {
  brainGroupRef: React.RefObject<THREE.Group | null>;
}) {
  const { camera } = useThree();
  const { scrollMode, scrollPhase, scrollProgress } = useStore();

  const targetPos = useRef(new THREE.Vector3(...DEFAULT_CAMERA_POS));
  const targetLookAt = useRef(new THREE.Vector3(...DEFAULT_LOOK_AT));
  const currentLookAt = useRef(new THREE.Vector3(...DEFAULT_LOOK_AT));
  const targetBrainRotY = useRef(0);

  useFrame(() => {
    if (!scrollMode) return;

    if (scrollPhase === "intro") {
      const z = THREE.MathUtils.lerp(INTRO_CAMERA_START_Z, DEFAULT_CAMERA_POS[2], scrollProgress);
      targetPos.current.set(DEFAULT_CAMERA_POS[0], DEFAULT_CAMERA_POS[1], z);
      targetLookAt.current.set(...DEFAULT_LOOK_AT);
      targetBrainRotY.current = THREE.MathUtils.lerp(Math.PI, 0, scrollProgress);
    } else if (scrollPhase === "playground") {
      targetPos.current.set(...DEFAULT_CAMERA_POS);
      targetLookAt.current.set(...DEFAULT_LOOK_AT);
      targetBrainRotY.current = 0;
    } else {
      const currentSection = scrollSections.find((s) => s.phase === scrollPhase);
      if (!currentSection) return;

      const progress = scrollProgress;

      if (progress <= 0.3) {
        const t = progress / 0.3;
        const prev = getPreviousTarget(scrollPhase);
        targetPos.current.set(
          THREE.MathUtils.lerp(prev.pos[0], currentSection.cameraPosition[0], t),
          THREE.MathUtils.lerp(prev.pos[1], currentSection.cameraPosition[1], t),
          THREE.MathUtils.lerp(prev.pos[2], currentSection.cameraPosition[2], t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(prev.look[0], currentSection.lookAt[0], t),
          THREE.MathUtils.lerp(prev.look[1], currentSection.lookAt[1], t),
          THREE.MathUtils.lerp(prev.look[2], currentSection.lookAt[2], t)
        );
        targetBrainRotY.current = THREE.MathUtils.lerp(
          prev.rotY,
          currentSection.brainRotationY,
          t
        );
      } else if (progress <= 0.8) {
        targetPos.current.set(...currentSection.cameraPosition);
        targetLookAt.current.set(...currentSection.lookAt);
        targetBrainRotY.current = currentSection.brainRotationY;
      } else {
        const t = (progress - 0.8) / 0.2;
        const next = getNextTarget(scrollPhase);
        targetPos.current.set(
          THREE.MathUtils.lerp(currentSection.cameraPosition[0], next.pos[0], t),
          THREE.MathUtils.lerp(currentSection.cameraPosition[1], next.pos[1], t),
          THREE.MathUtils.lerp(currentSection.cameraPosition[2], next.pos[2], t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(currentSection.lookAt[0], next.look[0], t),
          THREE.MathUtils.lerp(currentSection.lookAt[1], next.look[1], t),
          THREE.MathUtils.lerp(currentSection.lookAt[2], next.look[2], t)
        );
        targetBrainRotY.current = THREE.MathUtils.lerp(
          currentSection.brainRotationY,
          next.rotY,
          t
        );
      }
    }

    camera.position.lerp(targetPos.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);

    if (brainGroupRef.current) {
      brainGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        brainGroupRef.current.rotation.y,
        targetBrainRotY.current,
        0.06
      );
    }
  });

  return null;
}

function getPreviousTarget(phase: string) {
  const idx = scrollSections.findIndex((s) => s.phase === phase);
  if (idx <= 0) {
    return { pos: DEFAULT_CAMERA_POS, look: DEFAULT_LOOK_AT, rotY: 0 };
  }
  const prev = scrollSections[idx - 1];
  return {
    pos: prev.cameraPosition,
    look: prev.lookAt,
    rotY: prev.brainRotationY,
  };
}

function getNextTarget(phase: string) {
  const idx = scrollSections.findIndex((s) => s.phase === phase);
  if (idx >= scrollSections.length - 1) {
    return { pos: DEFAULT_CAMERA_POS, look: DEFAULT_LOOK_AT, rotY: 0 };
  }
  const next = scrollSections[idx + 1];
  return {
    pos: next.cameraPosition,
    look: next.lookAt,
    rotY: next.brainRotationY,
  };
}
