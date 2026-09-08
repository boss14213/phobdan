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
}

export function MapView(props: MapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 h-full w-full rounded-none border-none p-0 bg-[#07090e]'
          : 'relative h-[360px] sm:h-[480px] lg:h-[560px] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm'
      }`}
    >
      <LeafletMap {...props} isFullscreen={isFullscreen} />

      {/* Floating Mobile-Friendly Fullscreen Toggle Button */}
      <button
        type="button"
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/80 px-3 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-xl transition-all hover:bg-black active:scale-95 min-h-[38px]"
        title={isFullscreen ? 'ย่อขนาดแผนที่' : 'ขยายแผนที่เต็มจอ'}
      >
        {isFullscreen ? (
          <>
            <Minimize2 className="h-4 w-4 text-amber-400" />
            <span>ย่อแผนที่</span>
          </>
        ) : (
          <>
            <Maximize2 className="h-4 w-4 text-blue-400" />
            <span>ขยายเต็มจอ</span>
          </>
        )}
      </button>
    </div>
  );
}
