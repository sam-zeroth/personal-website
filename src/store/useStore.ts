import { create } from "zustand";

export type BrainRegion = "work" | "personal" | "writings" | "contact" | null;

interface NavigationState {
  activeRegion: BrainRegion;
  hoveredRegion: BrainRegion;
  isZoomed: boolean;
  showContent: boolean;
  setActiveRegion: (region: BrainRegion) => void;
  setHoveredRegion: (region: BrainRegion) => void;
  navigateTo: (region: BrainRegion) => void;
  goHome: () => void;
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
}));
