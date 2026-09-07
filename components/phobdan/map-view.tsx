'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Checkpoint, UserLocation } from '@/lib/types';
import { Loader2 } from 'lucide-react';

// Dynamically import Leaflet with SSR disabled
const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] sm:h-[550px] w-full flex-col items-center justify-center rounded-2xl border border-border bg-muted/30">
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
  return (
    <div className="relative h-[480px] sm:h-[560px] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <LeafletMap {...props} />
    </div>
  );
}
