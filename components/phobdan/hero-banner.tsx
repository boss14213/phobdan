'use client';

import React from 'react';
import { PlusCircle, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { CheckpointCategory } from '@/lib/types';

interface HeroBannerProps {
  onOpenCheckin: () => void;
  activeCount: number;
  totalConfirmedCount: number;
  selectedCategory: CheckpointCategory | 'all';
  onSelectCategory: (cat: CheckpointCategory | 'all') => void;
}

export function HeroBanner({
  onOpenCheckin,
  activeCount,
  totalConfirmedCount,
  selectedCategory,
  onSelectCategory,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1017] shadow-2xl">
      {/* Background Banner Image with Gradient Overlays */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden">
        <img
          src="/banner.jpg"
          alt="พบด่าน Traffic Checkpoint Alert Banner"
          className="h-full w-full object-cover object-center opacity-85 transition-transform duration-700 hover:scale-105"
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-[#0c1017]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1017] via-transparent to-[#0c1017]/50" />

        {/* Floating Quick Action over Banner */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-950/80 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
              <span>ระบบเตือนจุดตรวจเรียลไทม์ ชุมชนผู้ขับขี่</span>
            </div>
            <h2 className="mt-1.5 text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
              คนหนึ่งปัก อีกหลายคนปลอดภัย 🚨
            </h2>
          </div>

          <button
            onClick={onOpenCheckin}
            className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-xl shadow-red-600/30 transition-all hover:scale-105 hover:shadow-red-600/50 active:scale-95 shrink-0"
          >
            <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-90" />
            <span>ปักหมุดพบด่านตรงนี้</span>
            <span className="rounded-md bg-black/30 px-2 py-0.5 text-xs font-semibold">
              +15 pts
            </span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips & Live Counters */}
      <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#090b10]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 font-bold mr-1 shrink-0">
              ตัวกรอง:
            </span>
            <button
              onClick={() => onSelectCategory('all')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => onSelectCategory('traffic_discipline')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                selectedCategory === 'traffic_discipline'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-950/40 border border-blue-900/60 text-blue-300 hover:bg-blue-900/50'
              }`}
            >
              🪖 หมวก/ใบขับขี่
            </button>
            <button
              onClick={() => onSelectCategory('alcohol')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                selectedCategory === 'alcohol'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-950/40 border border-amber-900/60 text-amber-300 hover:bg-amber-900/50'
              }`}
            >
              🍺 ตรวจแอลกอฮอล์
            </button>
            <button
              onClick={() => onSelectCategory('speed')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                selectedCategory === 'speed'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-950/40 border border-red-900/60 text-red-300 hover:bg-red-900/50'
              }`}
            >
              ⚡ จับความเร็ว
            </button>
            <button
              onClick={() => onSelectCategory('smoke')}
              className={`rounded-xl px-3 py-1.5 font-bold transition-all shrink-0 ${
                selectedCategory === 'smoke'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              💨 ตรวจควันดำ
            </button>
          </div>

          {/* Mini Status Counters */}
          <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>ด่านในระบบ:</span>
              <span className="text-red-400 font-extrabold">{activeCount} จุด</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>ยืนยันสด:</span>
              <span className="text-blue-400 font-extrabold">{totalConfirmedCount} ครั้ง</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
