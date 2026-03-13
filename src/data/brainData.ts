import type { BrainRegion } from "@/store/useStore";

export interface EllipsoidDef {
  center: [number, number, number];
  scale: [number, number, number];
  pointCount: number;
}

export interface BrainRegionDef {
  id: BrainRegion;
  label: string;
  lobe: string; // anatomical brain lobe name
  lobeFunction: string; // what this lobe actually does
  description: string; // portfolio section description
  color: string;
  colorVec: [number, number, number]; // normalized RGB for shader
  shapes: EllipsoidDef[];
  hitCenter: [number, number, number];
  hitRadius: number;
  labelOffset: [number, number, number];
  children: { id: string; label: string; offset: [number, number, number] }[];
}

// Central fissure half-width — neurons within |x| < this are rejected
export const FISSURE_GAP = 0.08;

export const brainRegions: BrainRegionDef[] = [
  {
    id: "work",
    label: "Work",
    lobe: "Frontal Lobe",
    lobeFunction: "Planning, decision-making & execution",
    description: "Projects, skills & experience",
    color: "#00d4ff",
    colorVec: [0.0, 0.83, 1.0],
    shapes: [
      { center: [-0.65, 0.2, 0.5], scale: [0.6, 0.75, 0.65], pointCount: 140 },
      { center: [0.65, 0.2, 0.5], scale: [0.6, 0.75, 0.65], pointCount: 140 },
    ],
    hitCenter: [0, 0.2, 0.7],
    hitRadius: 0.9,
    labelOffset: [0, 0.4, 0.3],
    children: [
      { id: "projects", label: "Projects", offset: [-0.8, 0.5, 0.3] },
      { id: "skills", label: "Skills", offset: [0, 0.9, 0] },
      { id: "experience", label: "Experience", offset: [0.8, 0.5, 0.3] },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    lobe: "Parietal Lobe",
    lobeFunction: "Self-awareness, spatial reasoning & integration",
    description: "About me & background",
    color: "#7b2ff7",
    colorVec: [0.48, 0.18, 0.97],
    shapes: [
      { center: [-0.5, 0.75, -0.1], scale: [0.55, 0.4, 0.65], pointCount: 110 },
      { center: [0.5, 0.75, -0.1], scale: [0.55, 0.4, 0.65], pointCount: 110 },
    ],
    hitCenter: [0, 0.85, -0.1],
    hitRadius: 0.7,
    labelOffset: [0, 0.5, 0],
    children: [
      { id: "about", label: "About", offset: [-0.7, 0.4, 0] },
      { id: "interests", label: "Interests", offset: [0, 0.6, -0.3] },
      { id: "background", label: "Background", offset: [0.7, 0.4, 0] },
    ],
  },
  {
    id: "writings",
    label: "Writings",
    lobe: "Temporal Lobe",
    lobeFunction: "Language processing, memory & expression",
    description: "Blog posts & thoughts",
    color: "#ff006e",
    colorVec: [1.0, 0.0, 0.43],
    shapes: [
      { center: [-0.72, -0.3, 0.2], scale: [0.4, 0.42, 0.65], pointCount: 95 },
      { center: [0.72, -0.3, 0.2], scale: [0.4, 0.42, 0.65], pointCount: 95 },
    ],
    hitCenter: [0, -0.3, 0.5],
    hitRadius: 0.85,
    labelOffset: [0, -0.1, 0.3],
    children: [
      { id: "blog", label: "Blog", offset: [-0.6, -0.3, 0.3] },
      { id: "essays", label: "Essays", offset: [0, -0.5, 0.2] },
      { id: "notes", label: "Notes", offset: [0.6, -0.3, 0.3] },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    lobe: "Cerebellum",
    lobeFunction: "Coordination, connection & output",
    description: "Ways to connect",
    color: "#00e676",
    colorVec: [0.0, 0.9, 0.46],
    shapes: [
      { center: [-0.42, 0.05, -0.6], scale: [0.48, 0.52, 0.38], pointCount: 80 },
      { center: [0.42, 0.05, -0.6], scale: [0.48, 0.52, 0.38], pointCount: 80 },
      { center: [0, -0.6, -0.42], scale: [0.65, 0.28, 0.32], pointCount: 70 },
    ],
    hitCenter: [0, -0.25, -0.6],
    hitRadius: 0.8,
    labelOffset: [0, 0.1, -0.3],
    children: [
      { id: "email", label: "Email", offset: [-0.5, -0.3, -0.3] },
      { id: "social", label: "Social", offset: [0, -0.5, -0.2] },
      { id: "resume", label: "Resume", offset: [0.5, -0.3, -0.3] },
    ],
  },
];

// Region index lookup (used by shaders)
export const REGION_INDEX: Record<string, number> = {
  work: 0,
  personal: 1,
  writings: 2,
  contact: 3,
};
