'use client';

import React from 'react';
import { MapPin, ListFilter, Navigation, Award, Radio, Sparkles, Bot, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
  activeCheckpointsCount: number;
  userScore: number;
  onRequestLocate: () => void;
  isLocating: boolean;
  hasGps: boolean;
  isLiveTracking: boolean;
  onToggleLiveTracking: () => void;
  onOpenLocationModal: () => void;
  onOpenSosModal: () => void;
  onOpenAiModal?: () => void;
}

export function Header({
  viewMode,
  onViewModeChange,
  activeCheckpointsCount,
  userScore,
  onRequestLocate,
  isLocating,
  hasGps,
  isLiveTracking,
  onToggleLiveTracking,
  onOpenLocationModal,
  onOpenSosModal,
  onOpenAiModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-2xl transition-all shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Glossy Top Specular Highlight Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-[#0a0d14] to-red-600 p-[1.5px] shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#07090e]">
              <span className="text-lg sm:text-xl select-none" role="img" aria-label="Siren">
                🚨
              </span>
            </div>
            {/* Pulsing Flashing Beacons */}
            <span className="absolute -top-1 -left-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            </span>
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 shadow-[0_0_8px_#ef4444]" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center drop-shadow-sm">
                <span>พบ</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-200 to-red-500">
                  ด่าน
                </span>
              </h1>
              <span className="rounded-md border border-red-500/30 bg-red-950/70 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-extrabold text-red-400 tracking-wider uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                NIGHT RADAR
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[125px] xs:max-w-[160px] sm:max-w-none">
              ขับขี่ปลอดภัย • สแกนจุดตรวจใกล้คุณ
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Emergency Assistance Button (Secondary Support) */}
          <button
            onClick={onOpenSosModal}
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-300 hover:border-red-500/40 hover:text-red-300 active:scale-95 transition-all min-h-[36px]"
            title="ขอความช่วยเหลือฉุกเฉินบนท้องถนน (สำรอง)"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-400/80" />
            <span className="hidden xs:inline">ช่วยเหลือ</span>
          </button>

          {/* AI Parser Button */}
          {onOpenAiModal && (
            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/40 px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-extrabold text-purple-200 shadow-md shadow-purple-950/50 backdrop-blur-xl transition-all hover:scale-105 hover:border-purple-400 active:scale-95 min-h-[36px]"
              title="AI ช่วยกวาดพิกัดด่านจากข้อความโซเชียล"
            >
              <Bot className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">AI กวาดพิกัด</span>
            </button>
          )}

          {/* GPS Status Button */}
          <button
            onClick={hasGps ? onToggleLiveTracking : onOpenLocationModal}
            className={`flex items-center gap-1 sm:gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-extrabold transition-all active:scale-95 min-h-[36px] ${
              isLiveTracking
                ? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : hasGps
                ? 'border-blue-500/40 bg-blue-950/50 text-blue-300 hover:border-blue-400'
                : 'border-amber-500/50 bg-amber-950/40 text-amber-300 animate-pulse'
            }`}
          >
            {isLiveTracking ? (
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            )}
            <span className="hidden md:inline">
              {isLiveTracking ? 'ติดตามสด (ON)' : hasGps ? 'GPS ทำงาน' : 'เปิด GPS'}
            </span>
          </button>

          {/* Toggle Map / List Mode (Desktop & Tablet only, Mobile uses Bottom Dock) */}
          <div className="hidden sm:flex items-center rounded-xl border border-white/10 bg-black/60 p-1 backdrop-blur-md">
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>แผนที่</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>รายการ ({activeCheckpointsCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
