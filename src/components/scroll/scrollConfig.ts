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

export const DEFAULT_CAMERA_POS: [number, number, number] = [0, 0, 4.5];
export const DEFAULT_LOOK_AT: [number, number, number] = [0, 0, 0];
export const INTRO_CAMERA_START_Z = 12;
export const INTRO_TRACE_DURATION = 2800;
export const INTRO_FLOAT_DURATION = 1000;
export const INTRO_ZOOM_DURATION = 1500;
export const INTRO_TOTAL_DURATION =
  INTRO_TRACE_DURATION + INTRO_FLOAT_DURATION + INTRO_ZOOM_DURATION;
