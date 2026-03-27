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
