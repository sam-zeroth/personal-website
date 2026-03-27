# Scroll-Driven Brain Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the homepage from a single full-viewport interactive experience into a scroll-driven narrative where each brain region is revealed through scroll-scrubbed animations with floating content modals.

**Architecture:** The Three.js canvas stays `position: fixed` filling the viewport. Invisible scroll-spacer divs (totaling ~800vh) drive GSAP ScrollTrigger timelines that control camera position, brain rotation, shader uniforms, and DOM overlay visibility. Zustand bridges scroll state between GSAP (DOM) and React Three Fiber (WebGL). Existing content components are reused inside a new floating modal.

**Tech Stack:** GSAP 3.14.2 + ScrollTrigger (already installed), React Three Fiber, Framer Motion, Zustand, Next.js 16

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/scroll/scrollConfig.ts` | Create | Per-section camera positions, rotations, modal config |
| `src/components/scroll/FloatingModal.tsx` | Create | Frosted-glass card rendering existing content components |
| `src/components/scroll/ScrollSections.tsx` | Create | Scroll spacer divs + GSAP ScrollTrigger setup |
| `src/components/scroll/ScrollAnimationController.tsx` | Create | R3F component driving camera + shaders from scroll state |
| `src/store/useStore.ts` | Modify | Add scroll state (scrollMode, scrollPhase, scrollProgress) |
| `src/components/brain/BrainScene.tsx` | Modify | Mount ScrollAnimationController |
| `src/components/brain/BrainNetwork.tsx` | Modify | Disable drag/auto-rotation during scroll mode |
| `src/components/brain/CameraController.tsx` | Modify | Yield to scroll controller during scroll mode |
| `src/components/brain/BrainRegionHitZones.tsx` | Modify | Disable interactions during scroll mode |
| `src/app/page.tsx` | Modify | New scrollable layout, integrate scroll components |
| `src/app/globals.css` | Modify | Mobile scroll-snap styles, modal animations |

---

### Task 1: Extend Zustand Store with Scroll State

**Files:**
- Modify: `src/store/useStore.ts`

- [ ] **Step 1: Add scroll state types and fields to the store**

Open `src/store/useStore.ts` and replace its entire contents with:

```typescript
import { create } from "zustand";

export type BrainRegion = "work" | "personal" | "writings" | "contact" | null;
export type ScrollPhase = "intro" | "personal" | "work" | "writings" | "contact" | "playground";

interface NavigationState {
  // Existing
  activeRegion: BrainRegion;
  hoveredRegion: BrainRegion;
  isZoomed: boolean;
  showContent: boolean;
  setActiveRegion: (region: BrainRegion) => void;
  setHoveredRegion: (region: BrainRegion) => void;
  navigateTo: (region: BrainRegion) => void;
  goHome: () => void;

  // Scroll state
  scrollMode: boolean;
  scrollPhase: ScrollPhase;
  scrollProgress: number;
  setScrollState: (phase: ScrollPhase, progress: number) => void;
  setScrollMode: (mode: boolean) => void;
}

export const useStore = create<NavigationState>((set) => ({
  activeRegion: null,
  hoveredRegion: null,
  isZoomed: false,
  showContent: false,

  setActiveRegion: (region) => set({ activeRegion: region }),
  setHoveredRegion: (region) => set({ hoveredRegion: region }),

  navigateTo: (region) =>
    set({
      activeRegion: region,
      isZoomed: true,
      showContent: true,
      hoveredRegion: null,
    }),

  goHome: () =>
    set({
      activeRegion: null,
      isZoomed: false,
      showContent: false,
      hoveredRegion: null,
    }),

  // Scroll state
  scrollMode: true,
  scrollPhase: "intro",
  scrollProgress: 0,

  setScrollState: (phase, progress) => {
    const regionMap: Record<string, BrainRegion> = {
      personal: "personal",
      work: "work",
      writings: "writings",
      contact: "contact",
    };
    const region = regionMap[phase] ?? null;
    set({
      scrollPhase: phase,
      scrollProgress: progress,
      activeRegion: region,
    });
  },

  setScrollMode: (mode) =>
    set({
      scrollMode: mode,
      // When entering playground, reset to interactive defaults
      ...(!mode
        ? {
            activeRegion: null,
            isZoomed: false,
            showContent: false,
            hoveredRegion: null,
          }
        : {}),
    }),
}));
```

- [ ] **Step 2: Verify the app still compiles**

Run: `npx next build 2>&1 | tail -20` or `npx next dev` and check the terminal for errors.
Expected: No type errors. Existing components still reference the same fields.

- [ ] **Step 3: Commit**

```bash
git add src/store/useStore.ts
git commit -m "feat: extend Zustand store with scroll state"
```

---

### Task 2: Create Scroll Config

**Files:**
- Create: `src/components/scroll/scrollConfig.ts`

- [ ] **Step 1: Create the scroll section configuration file**

Create directory and file `src/components/scroll/scrollConfig.ts`:

```typescript
import type { ScrollPhase } from "@/store/useStore";

export interface ScrollSectionConfig {
  phase: ScrollPhase;
  region: "personal" | "work" | "writings" | "contact";
  /** Camera position [x, y, z] when this section is active */
  cameraPosition: [number, number, number];
  /** Camera lookAt target [x, y, z] */
  lookAt: [number, number, number];
  /** Target Y rotation of the brain group (radians) to face the relevant lobe toward camera */
  brainRotationY: number;
  /** Which side the floating modal appears on */
  modalSide: "left" | "right" | "bottom";
  /** Height of this scroll section in vh units */
  sectionHeight: number;
}

/**
 * Section order: Personal → Work → Writings → Contact
 *
 * Camera offsets:
 * - "left" brain: camera shifts +x so brain appears on left
 * - "right" brain: camera shifts -x so brain appears on right
 * - "top" brain (writings): camera pulls back on z, brain centered
 *
 * Brain rotation Y values orient the relevant lobe toward the camera:
 * - Personal (parietal, top-back): rotate ~0.3 to tilt top toward viewer
 * - Work (frontal, front): rotate ~0 (already facing front)
 * - Writings (temporal, sides): rotate ~-0.5 to show left temporal
 * - Contact (cerebellum, back-bottom): rotate ~Math.PI * 0.6 to show back
 */
export const scrollSections: ScrollSectionConfig[] = [
  {
    phase: "personal",
    region: "personal",
    cameraPosition: [1.2, 0.3, 3.5],
    lookAt: [0.4, 0.3, 0],
    brainRotationY: 0.3,
    modalSide: "right",
    sectionHeight: 150,
  },
  {
    phase: "work",
    region: "work",
    cameraPosition: [-1.2, 0.1, 3.5],
    lookAt: [-0.4, 0.1, 0],
    brainRotationY: 0,
    modalSide: "left",
    sectionHeight: 150,
  },
  {
    phase: "writings",
    region: "writings",
    cameraPosition: [0, 0.5, 7],
    lookAt: [0, 0, 0],
    brainRotationY: -0.5,
    modalSide: "bottom",
    sectionHeight: 150,
  },
  {
    phase: "contact",
    region: "contact",
    cameraPosition: [1.2, -0.1, 3.5],
    lookAt: [0.4, -0.1, 0],
    brainRotationY: Math.PI * 0.6,
    modalSide: "right",
    sectionHeight: 150,
  },
];

/** Default camera position (intro settled + playground) */
export const DEFAULT_CAMERA_POS: [number, number, number] = [0, 0, 4.5];
export const DEFAULT_LOOK_AT: [number, number, number] = [0, 0, 0];

/** Intro brain zoom-in start position (far away) */
export const INTRO_CAMERA_START_Z = 12;

/** Total intro duration breakdown (ms) */
export const INTRO_TRACE_DURATION = 2800;
export const INTRO_FLOAT_DURATION = 1000;
export const INTRO_ZOOM_DURATION = 1500;
export const INTRO_TOTAL_DURATION =
  INTRO_TRACE_DURATION + INTRO_FLOAT_DURATION + INTRO_ZOOM_DURATION;
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors related to this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/scroll/scrollConfig.ts
git commit -m "feat: add scroll section configuration"
```

---

### Task 3: Create Floating Modal Component

**Files:**
- Create: `src/components/scroll/FloatingModal.tsx`

- [ ] **Step 1: Create the FloatingModal component**

Create `src/components/scroll/FloatingModal.tsx`:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { brainRegions } from "@/data/brainData";
import { NeuralDecoration } from "@/components/ui/CortexElements";
import WorkContent from "@/components/content/WorkContent";
import PersonalContent from "@/components/content/PersonalContent";
import WritingsContent from "@/components/content/WritingsContent";
import ContactContent from "@/components/content/ContactContent";
import type { ScrollSectionConfig } from "./scrollConfig";

const contentMap: Record<string, React.ComponentType> = {
  work: WorkContent,
  personal: PersonalContent,
  writings: WritingsContent,
  contact: ContactContent,
};

interface FloatingModalProps {
  /** Which region's content to show, or null to hide */
  activeRegion: string | null;
  /** Which side to position the modal */
  modalSide: ScrollSectionConfig["modalSide"];
  /** 0-1 visibility progress (used for show/hide) */
  visible: boolean;
}

export default function FloatingModal({
  activeRegion,
  modalSide,
  visible,
}: FloatingModalProps) {
  const Content = activeRegion ? contentMap[activeRegion] : null;
  const region = activeRegion
    ? brainRegions.find((r) => r.id === activeRegion)
    : null;

  // Animation variants based on modal side
  const getMotionProps = () => {
    switch (modalSide) {
      case "right":
        return {
          initial: { opacity: 0, x: 60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 60 },
        };
      case "left":
        return {
          initial: { opacity: 0, x: -60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -60 },
        };
      case "bottom":
        return {
          initial: { opacity: 0, y: 60 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 60 },
        };
    }
  };

  // Position classes based on modal side
  const getPositionClasses = () => {
    switch (modalSide) {
      case "right":
        return "right-6 top-1/2 -translate-y-1/2 w-[380px] max-h-[80vh]";
      case "left":
        return "left-6 top-1/2 -translate-y-1/2 w-[380px] max-h-[80vh]";
      case "bottom":
        return "bottom-6 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] max-h-[45vh]";
    }
  };

  return (
    <AnimatePresence>
      {visible && Content && region && (
        <motion.div
          key={activeRegion}
          className={`fixed z-20 overflow-y-auto overflow-x-hidden rounded-2xl content-scrollbar ${getPositionClasses()}`}
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${region.color}40`,
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
            willChange: "transform, opacity",
          }}
          {...getMotionProps()}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <NeuralDecoration color={region.color} />
          <div className="relative" style={{ padding: "28px 26px 24px" }}>
            <Content />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: Clean — no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/scroll/FloatingModal.tsx
git commit -m "feat: add FloatingModal component for scroll sections"
```

---

### Task 4: Create ScrollAnimationController (R3F Component)

**Files:**
- Create: `src/components/scroll/ScrollAnimationController.tsx`

This component runs inside the R3F Canvas and drives camera position, lookAt, and brain rotation based on Zustand scroll state.

- [ ] **Step 1: Create the ScrollAnimationController**

Create `src/components/scroll/ScrollAnimationController.tsx`:

```tsx
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

/**
 * Drives camera position/lookAt and brain group rotation based on scroll state.
 * Sits inside the R3F Canvas as a sibling to CameraController.
 * Only active when scrollMode is true.
 */
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
      // During intro: interpolate from far to default based on progress
      // progress 0 = logo tracing (camera at start z), progress 1 = brain settled at default
      const z = THREE.MathUtils.lerp(INTRO_CAMERA_START_Z, DEFAULT_CAMERA_POS[2], scrollProgress);
      targetPos.current.set(DEFAULT_CAMERA_POS[0], DEFAULT_CAMERA_POS[1], z);
      targetLookAt.current.set(...DEFAULT_LOOK_AT);
      // Brain rotates 180° during intro zoom
      targetBrainRotY.current = THREE.MathUtils.lerp(Math.PI, 0, scrollProgress);
    } else if (scrollPhase === "playground") {
      // Return to default
      targetPos.current.set(...DEFAULT_CAMERA_POS);
      targetLookAt.current.set(...DEFAULT_LOOK_AT);
      targetBrainRotY.current = 0;
    } else {
      // Find current and adjacent sections for interpolation
      const currentSection = scrollSections.find((s) => s.phase === scrollPhase);
      if (!currentSection) return;

      const progress = scrollProgress;

      if (progress <= 0.3) {
        // Transitioning in: lerp from default/previous position to section position
        const t = progress / 0.3; // 0-1 within this sub-phase
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
        // Hold at section position
        targetPos.current.set(...currentSection.cameraPosition);
        targetLookAt.current.set(...currentSection.lookAt);
        targetBrainRotY.current = currentSection.brainRotationY;
      } else {
        // Transitioning out: lerp toward next section position
        const t = (progress - 0.8) / 0.2; // 0-1 within this sub-phase
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

    // Smooth lerp camera to targets
    camera.position.lerp(targetPos.current, 0.08);
    currentLookAt.current.lerp(targetLookAt.current, 0.08);
    camera.lookAt(currentLookAt.current);

    // Apply brain rotation
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

// Helper: get the camera target for the section before the current one
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

// Helper: get the camera target for the section after the current one
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
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: Clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/scroll/ScrollAnimationController.tsx
git commit -m "feat: add ScrollAnimationController for R3F camera/rotation control"
```

---

### Task 5: Gate Existing Brain Components on scrollMode

**Files:**
- Modify: `src/components/brain/BrainNetwork.tsx`
- Modify: `src/components/brain/CameraController.tsx`
- Modify: `src/components/brain/BrainRegionHitZones.tsx`
- Modify: `src/components/brain/BrainScene.tsx`

- [ ] **Step 5.1: Modify BrainNetwork to disable drag/auto-rotation during scroll mode**

In `src/components/brain/BrainNetwork.tsx`, the component needs to:
1. Read `scrollMode` from the store
2. Skip all drag handling and auto-rotation when `scrollMode` is true
3. Expose the group ref so ScrollAnimationController can drive rotation

Replace the entire file with:

```tsx
"use client";

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import NeuronCloud from "./NeuronCloud";
import BrainRegionHitZones from "./BrainRegionHitZones";
import { useStore } from "@/store/useStore";

const BrainNetwork = forwardRef<THREE.Group>(function BrainNetwork(_, ref) {
  const groupRef = useRef<THREE.Group>(null);
  const { isZoomed, scrollMode } = useStore();
  const { gl } = useThree();

  // Expose group ref to parent
  useImperativeHandle(ref, () => groupRef.current!, []);

  // Drag state
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0, y: 0 });
  const lastInteraction = useRef(0);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (scrollMode) return;
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      gl.domElement.style.cursor = "grabbing";
    },
    [gl, scrollMode]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging.current || scrollMode) return;
      const dx = e.clientX - previousMouse.current.x;
      const dy = e.clientY - previousMouse.current.y;

      const sensitivity = 0.005;
      velocity.current = { x: dy * sensitivity, y: dx * sensitivity };
      userRotation.current.x += dy * sensitivity;
      userRotation.current.y += dx * sensitivity;

      previousMouse.current = { x: e.clientX, y: e.clientY };
      lastInteraction.current = performance.now();
    },
    [scrollMode]
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (!scrollMode) {
      gl.domElement.style.cursor = "grab";
    }
    lastInteraction.current = performance.now();
  }, [gl, scrollMode]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    if (!scrollMode) {
      canvas.style.cursor = "grab";
    }
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.style.cursor = "";
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp, scrollMode]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // In scroll mode, rotation is driven by ScrollAnimationController
    if (scrollMode) return;

    const timeSinceInteraction =
      (performance.now() - lastInteraction.current) / 1000;

    // Apply momentum decay when not dragging
    if (!isDragging.current) {
      const friction = 0.95;
      velocity.current.x *= friction;
      velocity.current.y *= friction;
      userRotation.current.x += velocity.current.x;
      userRotation.current.y += velocity.current.y;
    }

    // Blend: 1 = full user control, 0 = full auto-rotation
    const fadeDelay = 3;
    const fadeDuration = 2;
    const hasInteracted = lastInteraction.current > 0;
    const userBlend = hasInteracted
      ? 1 -
        Math.min(
          1,
          Math.max(0, (timeSinceInteraction - fadeDelay) / fadeDuration)
        )
      : 0;

    // Ease user rotation back toward zero as auto-rotation takes over
    if (userBlend < 1 && hasInteracted) {
      const easeBack = 0.02 * (1 - userBlend);
      userRotation.current.x *= 1 - easeBack;
      userRotation.current.y *= 1 - easeBack;
    }

    // Auto-rotation
    const speed = isZoomed ? 0.05 : 0.12;
    const autoY = Math.sin(state.clock.elapsedTime * speed) * 0.25;
    const autoX = Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.08;

    groupRef.current.rotation.y =
      userRotation.current.y * userBlend + autoY * (1 - userBlend);
    groupRef.current.rotation.x =
      userRotation.current.x * userBlend + autoX * (1 - userBlend);
  });

  return (
    <group ref={groupRef}>
      <NeuronCloud />
      <BrainRegionHitZones />
    </group>
  );
});

export default BrainNetwork;
```

- [ ] **Step 5.2: Modify CameraController to yield during scroll mode**

In `src/components/brain/CameraController.tsx`, add an early return when `scrollMode` is true. Replace entire file:

```tsx
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import { brainRegions } from "@/data/brainData";

export default function CameraController() {
  const { camera, size } = useThree();
  const { activeRegion, isZoomed, scrollMode } = useStore();
  const targetPos = useRef(new THREE.Vector3(0, 0, 4.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // In scroll mode, ScrollAnimationController drives the camera
    if (scrollMode) return;

    const aspect = size.width / size.height;
    const defaultZ = aspect < 1 ? 3.5 + (1 - aspect) * 4.0 : 4.5;
    const zoomedZ = aspect < 1 ? 2.5 + (1 - aspect) * 2.0 : 2.8;

    if (isZoomed && activeRegion) {
      const region = brainRegions.find((r) => r.id === activeRegion);
      if (region) {
        const [x, y, z] = region.hitCenter;
        targetPos.current.set(x * 0.4, y * 0.4, zoomedZ);
        targetLookAt.current.set(x * 0.5, y * 0.5, z * 0.3);
      }
    } else {
      targetPos.current.set(0, 0, defaultZ);
      targetLookAt.current.set(0, 0, 0);
    }

    camera.position.lerp(targetPos.current, 0.035);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
```

- [ ] **Step 5.3: Modify BrainRegionHitZones to disable during scroll mode**

In `src/components/brain/BrainRegionHitZones.tsx`, gate click/hover handlers on `scrollMode`. Change line 13 to also destructure `scrollMode`:

Find this line at the top of the component:
```tsx
  const { hoveredRegion, isZoomed, navigateTo, setHoveredRegion } = useStore();
```

Replace with:
```tsx
  const { hoveredRegion, isZoomed, scrollMode, navigateTo, setHoveredRegion } = useStore();
```

Then change the `onClick` handler (line 25-27):
```tsx
onClick={() => {
  if (!isZoomed) navigateTo(region.id);
}}
```
Replace with:
```tsx
onClick={() => {
  if (!isZoomed && !scrollMode) navigateTo(region.id);
}}
```

Change the `onPointerOver` handler (line 28-34):
```tsx
onPointerOver={() => {
  if (!isZoomed) {
```
Replace with:
```tsx
onPointerOver={() => {
  if (!isZoomed && !scrollMode) {
```

And the label visibility check (line 53):
```tsx
{isHovered && !isZoomed && (
```
Replace with:
```tsx
{isHovered && !isZoomed && !scrollMode && (
```

- [ ] **Step 5.4: Modify BrainScene to mount ScrollAnimationController and pass ref**

Replace `src/components/brain/BrainScene.tsx` entirely:

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import BrainNetwork from "./BrainNetwork";
import CameraController from "./CameraController";
import ScrollAnimationController from "@/components/scroll/ScrollAnimationController";

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
```

Note: Camera initial position is now `[0, 0, 12]` (far away) since the intro zoom-in starts there. ScrollAnimationController will bring it to 4.5 during the intro phase.

- [ ] **Step 5.5: Verify compilation**

Run: `npx tsc --noEmit 2>&1 | tail -20`
Expected: Clean.

- [ ] **Step 5.6: Commit**

```bash
git add src/components/brain/BrainNetwork.tsx src/components/brain/CameraController.tsx src/components/brain/BrainRegionHitZones.tsx src/components/brain/BrainScene.tsx
git commit -m "feat: gate brain interactions on scrollMode, mount ScrollAnimationController"
```

---

### Task 6: Create ScrollSections (GSAP ScrollTrigger Setup)

**Files:**
- Create: `src/components/scroll/ScrollSections.tsx`

This is the core orchestration component. It creates invisible scroll-spacer divs and wires up GSAP ScrollTrigger instances that update Zustand scroll state.

- [ ] **Step 1: Create ScrollSections component**

Create `src/components/scroll/ScrollSections.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store/useStore";
import { scrollSections } from "./scrollConfig";
import FloatingModal from "./FloatingModal";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionsProps {
  /** Whether the intro sequence is complete and scrolling is enabled */
  scrollEnabled: boolean;
}

export default function ScrollSections({ scrollEnabled }: ScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playgroundRef = useRef<HTMLDivElement>(null);
  const setScrollState = useStore((s) => s.setScrollState);
  const setScrollMode = useStore((s) => s.setScrollMode);
  const scrollPhase = useStore((s) => s.scrollPhase);
  const scrollProgress = useStore((s) => s.scrollProgress);

  useEffect(() => {
    if (!scrollEnabled || !containerRef.current) return;

    // Refresh ScrollTrigger after layout settles
    ScrollTrigger.refresh();

    const triggers: ScrollTrigger[] = [];

    // Create a ScrollTrigger for each scroll section
    scrollSections.forEach((section, i) => {
      const el = sectionRefs.current[i];
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          setScrollState(section.phase, self.progress);
        },
      });
      triggers.push(trigger);
    });

    // Playground section — when it enters, disable scroll mode
    if (playgroundRef.current) {
      const playgroundTrigger = ScrollTrigger.create({
        trigger: playgroundRef.current,
        start: "top center",
        onEnter: () => setScrollMode(false),
        onLeaveBack: () => {
          setScrollMode(true);
          // Re-entering contact section from playground
          setScrollState("contact", 1);
        },
      });
      triggers.push(playgroundTrigger);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [scrollEnabled, setScrollState, setScrollMode]);

  // Determine which modal to show based on scroll state
  const currentSection = scrollSections.find((s) => s.phase === scrollPhase);
  const modalVisible =
    currentSection != null &&
    scrollProgress > 0.3 &&
    scrollProgress < 0.95;

  return (
    <>
      {/* Scroll spacer container — sits behind the fixed canvas */}
      <div ref={containerRef} className="relative z-10" style={{ pointerEvents: "none" }}>
        {/* Intro spacer — 100vh, the intro animation plays over this */}
        <div style={{ height: "100vh" }} />

        {/* Section spacers */}
        {scrollSections.map((section, i) => (
          <div
            key={section.phase}
            ref={(el) => { sectionRefs.current[i] = el; }}
            style={{ height: `${section.sectionHeight}vh` }}
          />
        ))}

        {/* Playground spacer */}
        <div
          ref={playgroundRef}
          style={{ height: "100vh" }}
        />
      </div>

      {/* Floating modal — rendered in fixed position over the canvas */}
      <FloatingModal
        activeRegion={currentSection?.region ?? null}
        modalSide={currentSection?.modalSide ?? "right"}
        visible={modalVisible}
      />
    </>
  );
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit 2>&1 | tail -20`
Expected: Clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/scroll/ScrollSections.tsx
git commit -m "feat: add ScrollSections with GSAP ScrollTrigger orchestration"
```

---

### Task 7: Rewire the Homepage

**Files:**
- Modify: `src/app/page.tsx`

This is the biggest change — replacing the single-viewport layout with the scrollable architecture.

- [ ] **Step 1: Replace page.tsx with the new scroll-driven layout**

Replace the entire contents of `src/app/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/store/useStore";
import {
  INTRO_TRACE_DURATION,
  INTRO_FLOAT_DURATION,
  INTRO_ZOOM_DURATION,
} from "@/components/scroll/scrollConfig";

const TOTAL_INTRO = INTRO_TRACE_DURATION + INTRO_FLOAT_DURATION + INTRO_ZOOM_DURATION;

function SamLogo() {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <path
        className="logo-trace-path"
        d="m210.8 9h-62.8l35.2 52.31 21.3-34.18c0.72-0.3 2.99-0.13 6.56-0.13 3.56 0 7.44 1.71 9.96 3.79l-37.82 60.12-44.42-68.83c-6.64-9.89-16.03-12.99-25.59-13.08h-66.94c-20.15 0-37.24 16.71-37.24 39.7v63.6l73.95 58.18v20.79h-18.66v-17.33l-17.97-14.23v49.75h55v-46.98l-73.95-58.57v-57.89c0-9.96 7.71-18.95 17.89-18.95h68.05c2.91 0 5.67 1.05 5.67 1.84v83.21l18.05 14.76v-73.36l46.07 70.76 45.98-70.67v156c0 10.49-9.27 18.75-18.73 18.35v-116.9l-0.63 0.09-18.05 27.41v89.36h-18.32v-89.54l-18.41-27.41-0.63 0.36v116.3h-5.48c-2.61 7.82-5.89 14.35-10.91 18.91h72.87c21.12 0 36.21-18.91 36.21-37.55v-163c0-19.91-16.06-37.02-36.21-37.02z"
        fill="var(--foreground)"
        style={{
          "--duration": "1.6s",
          "--delay": "0s",
        } as React.CSSProperties}
      />
      <path
        className="logo-trace-path"
        d="m9.06 130.1v78.43c0 20.38 15.62 38.09 37.18 38.09h60.53c19.26 0 29.92-16.98 29.92-32.96v-68.38l-72.31-58.4v-23.05h18.57v19.09l18.37 14.75v-51.92h-55v49.52l72.49 57.83v59.36c0 9.5-5.1 15.42-12.39 15.42h-60.18c-10.18 0-18.96-8.9-18.96-18.16v-64.53l-18.22-15.09z"
        fill="var(--foreground)"
        style={{
          "--duration": "1.2s",
          "--delay": "0.4s",
        } as React.CSSProperties}
      />
    </svg>
  );
}

// Dynamic import for Three.js (no SSR)
const BrainScene = dynamic(() => import("@/components/brain/BrainScene"), {
  ssr: false,
});

// Dynamic import for ScrollSections (uses GSAP, no SSR)
const ScrollSections = dynamic(
  () => import("@/components/scroll/ScrollSections"),
  { ssr: false }
);

export default function Home() {
  const goHome = useStore((s) => s.goHome);
  const scrollMode = useStore((s) => s.scrollMode);
  const setScrollState = useStore((s) => s.setScrollState);

  // Intro phase: "tracing" → "floating" → "zooming" → "settled"
  const [phase, setPhase] = useState<
    "tracing" | "floating" | "zooming" | "settled"
  >("tracing");
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const startFloat = useCallback(() => setPhase("floating"), []);

  // Intro sequence timers
  useEffect(() => {
    const traceTimer = setTimeout(startFloat, INTRO_TRACE_DURATION);
    return () => clearTimeout(traceTimer);
  }, [startFloat]);

  useEffect(() => {
    if (phase !== "floating") return;
    const zoomTimer = setTimeout(() => setPhase("zooming"), INTRO_FLOAT_DURATION);
    return () => clearTimeout(zoomTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "zooming") return;

    // Animate intro zoom progress from 0 to 1
    const start = performance.now();
    let rafId: number;

    const animate = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(1, elapsed / INTRO_ZOOM_DURATION);
      setScrollState("intro", progress);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setPhase("settled");
      }
    };
    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [phase, setScrollState]);

  // Unlock scroll after settled
  useEffect(() => {
    if (phase !== "settled") return;
    // Small delay to let the final frame render
    const timer = setTimeout(() => setScrollEnabled(true), 100);
    return () => clearTimeout(timer);
  }, [phase]);

  const isTracing = phase === "tracing";
  const pageReady = phase !== "tracing";

  return (
    <main
      className="relative bg-white"
      style={{
        // Lock scroll during intro, enable after
        overflowX: "hidden",
        overflowY: scrollEnabled ? "auto" : "hidden",
        height: scrollEnabled ? "auto" : "100dvh",
      }}
    >
      {/* White backdrop that fades when floating starts */}
      {phase !== "settled" && phase !== "zooming" && (
        <div
          className="fixed inset-0 z-40 bg-white"
          style={{
            opacity: isTracing ? 1 : 0,
            transition: `opacity ${INTRO_FLOAT_DURATION}ms ease-out`,
            pointerEvents: isTracing ? "auto" : "none",
          }}
        />
      )}

      {/* Logo — traces in center, floats to top-left, stays as home button */}
      <button
        onClick={() => {
          if (!scrollMode) goHome();
          // In scroll mode, scroll to top
          if (scrollMode) window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="fixed z-50 cursor-pointer logo-trace-container"
        style={{
          top: isTracing ? "50%" : "var(--logo-top, 24px)",
          left: isTracing ? "50%" : "var(--logo-left, 24px)",
          width: isTracing ? 140 : "var(--logo-size, 38px)",
          height: isTracing ? 140 : "var(--logo-size-h, 38px)",
          transform: isTracing ? "translate(-50%, -50%)" : "translate(0, 0)",
          marginTop: isTracing ? 0 : "var(--safe-top, 0px)",
          transition: isTracing
            ? "none"
            : `top ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               left ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               width ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               height ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
               transform ${INTRO_FLOAT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        <SamLogo />
      </button>

      {/* 3D Brain Canvas — fixed, fills viewport */}
      <div
        className="fixed inset-0"
        style={{
          opacity: pageReady ? 1 : 0,
          transition: `opacity ${INTRO_FLOAT_DURATION}ms ease-in`,
        }}
      >
        <BrainScene />
      </div>

      {/* Scroll sections + floating modals */}
      {pageReady && <ScrollSections scrollEnabled={scrollEnabled} />}

      {/* Scroll indicator — shown briefly after intro */}
      {phase === "settled" && scrollEnabled && scrollMode && (
        <ScrollIndicator />
      )}
    </main>
  );
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide on first scroll
    const onScroll = () => setVisible(false);
    window.addEventListener("scroll", onScroll, { once: true });

    // Auto-fade after 3s
    const timer = setTimeout(() => setVisible(false), 3000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-pulse-glow"
      style={{
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <p className="text-[11px] text-gray-400 tracking-widest uppercase">
        Scroll to explore
      </p>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gray-400"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit 2>&1 | tail -20`
Expected: Clean.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewire homepage with scroll-driven layout"
```

---

### Task 8: Add Mobile Scroll-Snap Styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add mobile scroll-snap and floating modal styles**

Append the following to the end of `src/app/globals.css`:

```css
/* --- Scroll-driven brain animation --- */

/* Mobile: snap-scroll sections */
@media (max-width: 639px) {
  .scroll-snap-container {
    scroll-snap-type: y mandatory;
  }

  .scroll-snap-section {
    scroll-snap-align: start;
  }

  /* FloatingModal mobile overrides */
  .floating-modal-mobile {
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    max-height: 85vh !important;
    border-radius: 20px 20px 0 0 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add mobile scroll-snap styles"
```

---

### Task 9: Wire Up Mobile FloatingModal Variant

**Files:**
- Modify: `src/components/scroll/FloatingModal.tsx`

- [ ] **Step 1: Add mobile-responsive positioning to FloatingModal**

In `src/components/scroll/FloatingModal.tsx`, import useIsMobile and adjust positioning for mobile.

Add import at top:
```tsx
import { useIsMobile } from "@/hooks/useIsMobile";
```

Then inside the component function, add before the `getMotionProps` function:
```tsx
  const isMobile = useIsMobile(640);
```

Update the `getPositionClasses` function to handle mobile:
```tsx
  const getPositionClasses = () => {
    if (isMobile) {
      return "floating-modal-mobile";
    }
    switch (modalSide) {
      case "right":
        return "right-6 top-1/2 -translate-y-1/2 w-[380px] max-h-[80vh]";
      case "left":
        return "left-6 top-1/2 -translate-y-1/2 w-[380px] max-h-[80vh]";
      case "bottom":
        return "bottom-6 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] max-h-[45vh]";
    }
  };
```

And update `getMotionProps` for mobile:
```tsx
  const getMotionProps = () => {
    if (isMobile) {
      return {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 100 },
      };
    }
    switch (modalSide) {
      case "right":
        return {
          initial: { opacity: 0, x: 60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 60 },
        };
      case "left":
        return {
          initial: { opacity: 0, x: -60 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -60 },
        };
      case "bottom":
        return {
          initial: { opacity: 0, y: 60 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 60 },
        };
    }
  };
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: Clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/scroll/FloatingModal.tsx
git commit -m "feat: add mobile-responsive FloatingModal positioning"
```

---

### Task 10: Remove Old Components & Clean Up

**Files:**
- Modify: `src/app/page.tsx` (remove old imports if any remain)
- Note: Keep `ContentPanel.tsx` and `NavigationOverlay.tsx` in the codebase — they may be needed for `/writings` subpages or future playground interactions. Just ensure they're no longer imported in `page.tsx`.

- [ ] **Step 1: Verify old components are not imported in page.tsx**

Check that `page.tsx` does NOT import `NavigationOverlay`, `ContentPanel`, or `MobileNavStrip`. The Task 7 rewrite already removed these, but verify:

Run: `grep -n "NavigationOverlay\|ContentPanel\|MobileNavStrip" src/app/page.tsx`
Expected: No matches.

- [ ] **Step 2: Run the dev server and verify the page loads**

Run: `npx next dev`

Open `http://localhost:3000` in browser. Verify:
1. Logo traces in center with purple glow
2. Logo floats to top-left corner
3. Brain zooms in from far away while rotating
4. Page becomes scrollable after brain settles
5. Scrolling moves through sections — brain repositions, lobes highlight, modals float in/out
6. Bottom playground section enables free rotation

- [ ] **Step 3: Commit cleanup if any changes needed**

```bash
git add -A
git commit -m "chore: clean up old component imports"
```

---

### Task 11: Visual Tuning Pass

**Files:**
- Possibly modify: `src/components/scroll/scrollConfig.ts` (camera positions, rotations)
- Possibly modify: `src/components/scroll/ScrollAnimationController.tsx` (lerp speeds)
- Possibly modify: `src/components/scroll/FloatingModal.tsx` (sizing, opacity)
- Possibly modify: `src/components/scroll/ScrollSections.tsx` (section heights, scrub timing)

This is a manual tuning task. Run the dev server and adjust values while viewing in browser.

- [ ] **Step 1: Tune camera positions for each section**

Open `src/components/scroll/scrollConfig.ts` and adjust `cameraPosition` and `lookAt` values for each section until the brain occupies ~2/3 of the viewport with the highlighted lobe prominent. These values will need iteration:

Things to check per section:
- Brain fills ~2/3 of screen width
- Highlighted lobe is clearly visible and facing the camera
- Modal doesn't obscure the highlighted lobe
- Transition between sections feels smooth

Key tuning parameters:
- `cameraPosition[0]` (x): controls left/right offset. Positive = brain appears left.
- `cameraPosition[2]` (z): controls zoom level. Lower = more zoomed in.
- `brainRotationY`: controls which lobe faces camera. Tune in ~0.1 radian increments.
- `lookAt`: should generally track the offset direction to keep brain centered in its 2/3.

- [ ] **Step 2: Tune lerp speeds**

In `ScrollAnimationController.tsx`:
- Camera lerp: `0.08` — increase for snappier, decrease for smoother. Try 0.05–0.12.
- Brain rotation lerp: `0.06` — similar range.
- LookAt lerp: `0.08` — keep close to camera lerp for consistency.

- [ ] **Step 3: Tune section heights and progress ranges**

In `scrollConfig.ts`, adjust `sectionHeight` (vh units) per section. Longer = more scroll distance per section = slower-feeling animation. 150vh is the starting point.

In `ScrollSections.tsx`, the progress thresholds (0.3, 0.8, 0.95) control when the modal appears/disappears. Adjust if the modal shows too early or lingers too long.

- [ ] **Step 4: Test mobile experience**

Resize browser to mobile width (< 640px) and verify:
- Modal slides up from bottom
- Brain animations still work
- No horizontal overflow
- Scroll feels natural

- [ ] **Step 5: Commit tuned values**

```bash
git add src/components/scroll/
git commit -m "feat: tune scroll animation positions and timing"
```

---

### Task 12: Final Verification

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Run build**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 3: Test full flow in production build**

Run: `npx next start`

Walk through complete flow:
1. Page load → intro animation
2. Scroll through all 4 sections
3. Verify playground at bottom
4. Scroll back up — animations reverse correctly
5. Test on mobile viewport
6. Click logo to scroll to top

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: final scroll animation adjustments"
```
