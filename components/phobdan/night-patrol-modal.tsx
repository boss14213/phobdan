'use client';

import React from 'react';
import InfiniteGallery from '@/components/ui/3d-gallery-photography';
import { X, Sparkles, Navigation, Shield, Compass } from 'lucide-react';

interface NightPatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NIGHT_GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
    alt: 'Night Highway Red and Blue Reflections',
  },
  {
    src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
    alt: 'Metropolitan Light Trails',
  },
  {
    src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
    alt: 'Police Siren Reflection in Rain',
  },
  {
    src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop',
    alt: 'Cyber Neon Road Patrol',
  },
  {
    src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop',
    alt: 'Night Motorcycle Safety Rider',
  },
  {
    src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
    alt: 'Expressway Flyover Lights',
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    alt: 'Digital Cyber Radar Cockpit',
  },
  {
    src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    alt: 'Rainy Night Street Red Beacon',
  },
];

export function NightPatrolModal({ isOpen, onClose }: NightPatrolModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090e] animate-in fade-in duration-300">
      {/* 3D Three.js Infinite Canvas */}
      <div className="absolute inset-0 h-full w-full">
        <InfiniteGallery
          images={NIGHT_GALLERY_IMAGES}
          speed={1.2}
          zSpacing={3.5}
          visibleCount={9}
          falloff={{ near: 0.8, far: 14 }}
          className="h-full w-full"
        />
      </div>

      {/* Glossy Obsidian Top Control Bar */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-2xl shadow-2xl">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
          </span>
          <span className="text-xs font-black tracking-widest text-white uppercase">
            3D NIGHT PATROL
          </span>
          <span className="rounded-md bg-blue-950/80 border border-blue-500/40 px-2 py-0.5 text-[10px] font-bold text-blue-300">
            INTERACTIVE
          </span>
        </div>

        <button
          onClick={onClose}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-bold text-white backdrop-blur-2xl shadow-2xl transition-all hover:bg-red-600 hover:border-red-500 active:scale-95"
        >
          <X className="h-4 w-4" />
          <span>กลับหน้าแผนที่</span>
        </button>
      </div>

      {/* Center Ambient Title */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_0_35px_rgba(56,189,248,0.25)]">
          สัญญาณไฟค่ำคืน 🚨
        </h2>
        <p className="mt-2 text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-400">
          มิติมุมมอง 3D ลาดตระเวนเส้นทาง • เลื่อนเมาส์หรือปัดหน้าจอเพื่อท่องพิกัด
        </p>
      </div>

      {/* Bottom Floating Glass Card */}
      <div className="pointer-events-none absolute bottom-6 left-4 right-4 z-10 flex justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-white/15 bg-black/70 px-5 py-3 text-center backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>ใช้ล้อเมาส์ (Scroll Wheel), ปุ่มลูกศร, หรือทัชสกรีน</span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <p className="text-[11px] text-slate-400">
            Auto-play จะเริ่มทำงานเองหลังหยุด 3 วินาที
          </p>
        </div>
      </div>
    </div>
  );
}
