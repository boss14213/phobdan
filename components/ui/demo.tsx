'use client';

import React from 'react';
import InfiniteGallery from '@/components/ui/3d-gallery-photography';
import { ShieldAlert, Compass, Sparkles, Navigation } from 'lucide-react';

export default function DemoOne() {
  const nightPatrolImages = [
    {
      src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop',
      alt: 'Night Highway Reflections',
    },
    {
      src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
      alt: 'Cyber City Traffic Lights',
    },
    {
      src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
      alt: 'Night Road Patrol',
    },
    {
      src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop',
      alt: 'Neon Rain Road Lights',
    },
    {
      src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop',
      alt: 'Motorcycle Rider in Night',
    },
    {
      src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
      alt: 'Urban Express Expressway',
    },
    {
      src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
      alt: 'Digital HUD Matrix',
    },
    {
      src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
      alt: 'Rainy City Red Reflections',
    },
  ];

  return (
    <main className="relative min-h-screen h-full w-full bg-[#07090e] overflow-hidden text-white">
      {/* 3D Infinite Cloth Wave Gallery */}
      <InfiniteGallery
        images={nightPatrolImages}
        speed={1.2}
        zSpacing={3}
        visibleCount={10}
        falloff={{ near: 0.8, far: 14 }}
        className="h-screen w-full"
      />

      {/* Glossy Obsidian Overlay HUD */}
      <div className="pointer-events-none fixed inset-0 flex flex-col justify-between p-6 sm:p-10">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-xl shadow-2xl">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            <span className="text-xs font-black tracking-widest text-slate-200 uppercase">
              PHOBDAN 3D PATROL VIEW
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="text-xs font-mono text-blue-400">100.5383° E</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-xl text-xs font-semibold text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Interactive WebGL Experience</span>
          </div>
        </div>

        {/* Center Title with Mix-Blend Glow */}
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 drop-shadow-[0_0_40px_rgba(56,189,248,0.2)]">
            พบด่าน <span className="text-red-500 italic">3D</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-medium tracking-widest uppercase text-slate-400">
            นวัตกรรมความปลอดภัยบนท้องถนนยามค่ำคืน • NIGHT PATROL
          </p>
        </div>

        {/* Bottom Floating Instructions with Glossy Glass */}
        <div className="mx-auto flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/50 px-6 py-3 text-center backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] max-w-md">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-200">
            เลื่อนเมาส์ (Wheel) • ปุ่มลูกศร • หรือสัมผัสหน้าจอเพื่อเคลื่อนที่
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Auto-play จะเริ่มทำงานอัตโนมัติเมื่อหยุดเคลื่อนไหว 3 วินาที
          </p>
        </div>
      </div>
    </main>
  );
}
