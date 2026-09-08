'use client';

import React from 'react';
import { PlusCircle, Sparkles, Navigation, Layers, Bot } from 'lucide-react';
import { CheckpointCategory } from '@/lib/types';

interface HeroBannerProps {
  onOpenCheckin: () => void;
  onOpenSosModal: () => void;
  onOpenAiModal?: () => void;
  activeCount: number;
  totalConfirmedCount: number;
  selectedCategory: CheckpointCategory | 'all';
  onSelectCategory: (cat: CheckpointCategory | 'all') => void;
}

export function HeroBanner({
  onOpenCheckin,
  onOpenSosModal,
  onOpenAiModal,
  activeCount,
  totalConfirmedCount,
  selectedCategory,
  onSelectCategory,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-gradient-to-b from-[#0f1422] to-[#07090e] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Specular Highlight Line at top edge */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />

      {/* Police Emergency Beacon Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-red-600/20 blur-[90px] animate-siren-red" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-blue-600/25 blur-[100px] animate-siren-blue" />

      {/* Banner Artwork Container with Glossy Glass Overlays */}
      <div className="relative w-full min-h-[270px] sm:min-h-[240px] md:h-72 overflow-hidden">
        <img
          src="/banner.jpg"
          alt="พบด่าน Night Patrol Radar Banner"
          className="h-full w-full object-cover object-center opacity-80 transition-transform duration-1000 hover:scale-105"
        />
        {/* Dynamic Dark Gradients & Wet Asphalt Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e]/90 via-transparent to-[#07090e]/80" />

        {/* Floating Content over Artwork */}
        <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between z-10">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] sm:text-[11px] font-extrabold text-blue-300 backdrop-blur-xl shadow-lg">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>ระบบเตือนจุดตรวจเรียลไทม์ • NIGHT PATROL RADAR</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              คนหนึ่งปัก อีกหลายคนปลอดภัย 🚨
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed drop-shadow-sm line-clamp-2 sm:line-clamp-none">
              ช่วยเพื่อนชะลอความเร็ว สวมหมวกกันน็อค และขับขี่ปลอดภัยในยามค่ำคืน
            </p>
          </div>

          {/* Action Buttons: Responsive Grid on Mobile, Flex on Desktop */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 pt-2">
            {onOpenAiModal && (
              <button
                onClick={onOpenAiModal}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-purple-500/40 bg-purple-950/60 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-purple-200 backdrop-blur-2xl shadow-xl transition-all hover:bg-purple-900/50 hover:border-purple-400 active:scale-95 min-h-[44px]"
                title="นำเข้าข้อความรายงานด่านจากโซเชียลด้วย AI"
              >
                <Bot className="h-4 w-4 text-purple-400 animate-pulse" />
                <span>AI กวาดด่าน</span>
              </button>
            )}

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenSosModal}
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-red-500/50 bg-gradient-to-r from-red-950/80 to-rose-950/80 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold text-red-200 backdrop-blur-2xl shadow-xl transition-all hover:bg-red-900/60 hover:border-red-400 hover:text-white active:scale-95 animate-pulse min-h-[44px]"
              title="ขอความช่วยเหลือฉุกเฉินบนท้องถนน"
            >
              <span className="text-base">🚨</span>
              <span>ขอช่วยเหลือ SOS</span>
            </button>

            <button
              onClick={onOpenCheckin}
              className="col-span-2 sm:col-span-1 group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-600 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(37,99,235,0.7)] active:scale-95 min-h-[44px]"
            >
              <PlusCircle className="h-4.5 w-4.5 transition-transform group-hover:rotate-90" />
              <span>ปักหมุดพบด่าน</span>
              <span className="rounded-md bg-black/30 px-2 py-0.5 text-[11px] font-semibold">
                +15 pts
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips & Status Bar */}
      <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#07090e]/95 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 font-bold mr-1 shrink-0">
              ตัวกรอง:
            </span>
            <button
              onClick={() => onSelectCategory('all')}
              className={`rounded-xl px-3.5 py-1.5 font-extrabold transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                  : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => onSelectCategory('traffic_discipline')}
              className={`rounded-xl px-3.5 py-1.5 font-extrabold transition-all shrink-0 ${
                selectedCategory === 'traffic_discipline'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                  : 'bg-blue-950/40 border border-blue-900/60 text-blue-300 hover:bg-blue-900/50'
              }`}
            >
              🪖 หมวก/ใบขับขี่
            </button>
            <button
              onClick={() => onSelectCategory('alcohol')}
              className={`rounded-xl px-3.5 py-1.5 font-extrabold transition-all shrink-0 ${
                selectedCategory === 'alcohol'
                  ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]'
                  : 'bg-amber-950/40 border border-amber-900/60 text-amber-300 hover:bg-amber-900/50'
              }`}
            >
              🍺 ตรวจแอลกอฮอล์
            </button>
            <button
              onClick={() => onSelectCategory('speed')}
              className={`rounded-xl px-3.5 py-1.5 font-extrabold transition-all shrink-0 ${
                selectedCategory === 'speed'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  : 'bg-red-950/40 border border-red-900/60 text-red-300 hover:bg-red-900/50'
              }`}
            >
              ⚡ จับความเร็ว
            </button>
            <button
              onClick={() => onSelectCategory('smoke')}
              className={`rounded-xl px-3.5 py-1.5 font-extrabold transition-all shrink-0 ${
                selectedCategory === 'smoke'
                  ? 'bg-slate-700 text-white'
                  : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:bg-white/[0.08]'
              }`}
            >
              💨 ตรวจควันดำ
            </button>
          </div>

          {/* Counters */}
          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <span>ด่านในแผนที่:</span>
              <span className="text-red-400 font-black">{activeCount} จุด</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span>ยืนยันสด:</span>
              <span className="text-blue-400 font-black">{totalConfirmedCount} ครั้ง</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
