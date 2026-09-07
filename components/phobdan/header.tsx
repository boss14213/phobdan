'use client';

import React from 'react';
import { MapPin, ListFilter, Navigation, Award, Radio } from 'lucide-react';

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
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#090b10]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-slate-900 to-red-600 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c1017]">
              <span className="text-xl select-none" role="img" aria-label="Siren">
                🚨
              </span>
            </div>
            {/* Flashing Beacons */}
            <span className="absolute -top-0.5 -left-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600" />
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center">
                <span>พบ</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-red-500">
                  ด่าน
                </span>
              </h1>
              <span className="rounded-md border border-red-500/30 bg-red-950/60 px-1.5 py-0.5 text-[10px] font-extrabold text-red-400 tracking-wide">
                RADAR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              ขับขี่ปลอดภัย • สแกนจุดตรวจใกล้คุณ
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* GPS Status / Locate Button */}
          <button
            onClick={hasGps ? onToggleLiveTracking : onOpenLocationModal}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
              isLiveTracking
                ? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-300 shadow-xs shadow-emerald-500/30'
                : hasGps
                ? 'border-blue-900/60 bg-blue-950/40 text-blue-300 hover:border-blue-500'
                : 'border-amber-500/40 bg-amber-950/40 text-amber-300 animate-pulse'
            }`}
            title={hasGps ? (isLiveTracking ? 'กำลังติดตามพิกัดสดขณะเดินทาง' : 'เปิดโหมดติดตามสด') : 'กดเพื่อขออนุญาตใช้พิกัด GPS'}
          >
            {isLiveTracking ? (
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <Navigation className={`h-3.5 w-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            )}
            <span className="hidden sm:inline">
              {isLiveTracking ? 'ติดตามสด (ON)' : hasGps ? 'GPS ทำงาน' : 'ขอสิทธิ์ GPS'}
            </span>
          </button>

          {/* User Score */}
          <div
            title="แต้มพลเมืองดีของคุณ"
            className="hidden md:flex items-center gap-1.5 rounded-full border border-blue-900/60 bg-blue-950/40 px-3 py-1 text-xs font-bold text-blue-300"
          >
            <Award className="h-3.5 w-3.5 text-blue-400" />
            <span>{userScore} pts</span>
          </div>

          {/* Toggle Map / List Mode */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/50'
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
                  ? 'bg-red-600 text-white shadow-xs shadow-red-500/50'
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
