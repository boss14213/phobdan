'use client';

import React from 'react';
import { MapPin, Navigation, ShieldCheck, Lock, AlertCircle, Compass } from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onAllowLocation: () => void;
  onUseDefaultLocation: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function LocationPermissionModal({
  isOpen,
  onAllowLocation,
  onUseDefaultLocation,
  isLoading,
  error,
}: LocationPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-t-[28px] sm:rounded-3xl border border-slate-800 bg-[#0d111a] p-6 shadow-2xl text-center max-h-[88dvh] sm:max-h-[92vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        {/* Mobile Swipe / Sheet Grab Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-36 w-36 rounded-full bg-blue-600/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-red-600/20 blur-2xl" />

        {/* Top Icon Badge with pulsing rings */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border border-blue-500/30 animate-ping" />
          <div className="absolute h-14 w-14 rounded-full border border-red-500/30 animate-pulse" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-red-600 text-white shadow-xl shadow-blue-500/30">
            <Navigation className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4">
          <span className="inline-block rounded-full bg-blue-950/80 border border-blue-500/40 px-3 py-1 text-[11px] font-extrabold text-blue-400 uppercase tracking-wide">
            LOCATION REQUIRED
          </span>
          <h3 className="mt-2 text-xl font-black text-white">
            เปิดใช้งานตำแหน่ง GPS ของคุณ 📍
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            แอป <strong className="text-white">"พบด่าน"</strong> จำเป็นต้องเข้าถึงตำแหน่งปัจจุบันของคุณ เพื่อให้เรดาร์สามารถ{' '}
            <span className="text-blue-400 font-bold">สแกนตรวจสอบจุดตรวจในรัศมีรอบตัว</span> และคำนวณระยะทางที่แม่นยำที่สุด
          </p>
        </div>

        {/* Privacy & Safety Bullet Points */}
        <div className="mt-5 space-y-2 rounded-2xl border border-slate-800 bg-[#090b10] p-3 text-left text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>สแกนด่านในรัศมี 1 - 7 กม. รอบตัวคุณทันที</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="h-4 w-4 text-blue-400 shrink-0" />
            <span>ปลอดภัย 100%: ไม่มีการบันทึกหรือส่งต่อประวัติการเดินทาง</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="h-4 w-4 text-amber-400 shrink-0" />
            <span>แจ้งเตือนและชะลอความเร็วก่อนถึงจุดตรวจ</span>
          </div>
        </div>

        {/* Error message if denied */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-2.5 text-left text-xs text-red-300">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={onAllowLocation}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-red-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
          >
            <Navigation className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'กำลังค้นหาพิกัดดาวเทียม...' : '📍 อนุญาตและเปิดเรดาร์รอบตัว'}</span>
          </button>

          <button
            type="button"
            onClick={onUseDefaultLocation}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            ใช้พิกัดจำลอง (อนุสาวรีย์ชัยสมรภูมิ, กทม.)
          </button>
        </div>
      </div>
    </div>
  );
}
