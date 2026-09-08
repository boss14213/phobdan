'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Checkpoint, UserLocation } from '@/lib/types';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

// Dynamically import Leaflet with SSR disabled
const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] sm:h-[480px] lg:h-[560px] w-full flex-col items-center justify-center rounded-2xl border border-border bg-muted/30">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      <span className="mt-2 text-xs font-medium text-muted-foreground">
        กำลังโหลดแผนที่สดรอบตัว...
      </span>
    </div>
  ),
});

interface MapViewProps {
  checkpoints: Checkpoint[];
  userLocation: UserLocation;
  selectedCheckpointId?: string | null;
  onSelectCheckpoint: (id: string) => void;
  onVoteCheckpoint: (id: string, type: 'up' | 'down') => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function MapView(props: MapViewProps) {
  const [internalFullscreen, setInternalFullscreen] = useState(false);

  // Use external prop if provided, otherwise internal state
  const isFullscreen = props.isFullscreen !== undefined ? props.isFullscreen : internalFullscreen;
  const toggleFullscreen = () => {
    if (props.onToggleFullscreen) {
      props.onToggleFullscreen();
    } else {
      setInternalFullscreen(!internalFullscreen);
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 h-full w-full rounded-none border-none p-0 bg-[#07090e]'
          : 'relative h-[360px] sm:h-[480px] lg:h-[560px] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm'
      }`}
    >
      <LeafletMap {...props} isFullscreen={isFullscreen} />

      {/* Floating Toggle Controls */}
      {!isFullscreen ? (
        /* Normal Mode: Button at Top-Right of Map Card (Never blocked by bottom dock) */
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/80 px-3 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-xl transition-all hover:bg-black active:scale-95 min-h-[38px]"
          title="ขยายแผนที่เต็มจอ"
        >
          <Maximize2 className="h-4 w-4 text-blue-400" />
          <span>⛶ ขยายเต็มจอ</span>
        </button>
      ) : (
        /* Fullscreen Mode: Prominent Top Header Bar + Unmissable Exit Buttons */
        <>
          {/* Top Floating Control Bar */}
          <div className="fixed top-[max(0.75rem,env(safe-area-inset-top,0.75rem))] left-3 right-3 z-50 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-[#090d16]/90 px-3.5 py-2 text-xs font-black text-white shadow-2xl backdrop-blur-2xl pointer-events-auto">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              <span>🗺️ แผนที่สดเต็มจอ</span>
            </div>

            {/* Prominent Exit Button at Top-Right */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex items-center gap-2 rounded-2xl border border-amber-500/60 bg-amber-950/90 px-4 py-2 text-xs font-black text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.4)] backdrop-blur-2xl transition-all hover:bg-amber-900 active:scale-95 pointer-events-auto min-h-[42px]"
              title="ย่อแผนที่กลับสู่หน้าหลัก"
            >
              <Minimize2 className="h-4 w-4 text-amber-300" />
              <span>✕ ย่อแผนที่</span>
            </button>
          </div>

          {/* Bottom Floating Exit Pill */}
          <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] left-1/2 -translate-x-1/2 z-50">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex items-center gap-2 rounded-full border border-white/30 bg-[#090d16]/95 px-5 py-2.5 text-xs font-black text-white shadow-[0_10px_35px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all active:scale-95 hover:bg-white/10 min-h-[44px]"
            >
              <Minimize2 className="h-4 w-4 text-amber-400" />
              <span>ย่อกลับสู่หน้าหลัก</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
