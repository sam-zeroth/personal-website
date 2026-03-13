"use client";

import dynamic from "next/dynamic";
import NavigationOverlay from "@/components/ui/NavigationOverlay";
import ContentPanel from "@/components/ui/ContentPanel";

// Dynamic import for Three.js (no SSR)
const BrainScene = dynamic(() => import("@/components/brain/BrainScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-400 tracking-widest uppercase">
          Loading neural network...
        </p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="w-screen h-screen relative overflow-hidden bg-white">
      {/* 3D Brain Canvas */}
      <div className="absolute inset-0">
        <BrainScene />
      </div>

      {/* UI Overlays */}
      <NavigationOverlay />
      <ContentPanel />
    </main>
  );
}
