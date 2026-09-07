'use client';

import React, { useState, useEffect } from 'react';
import { Radar, ShieldAlert, ShieldCheck, Navigation, AlertTriangle, RefreshCw, ChevronRight } from 'lucide-react';
import { Checkpoint, UserLocation } from '@/lib/types';

interface RadarScannerProps {
  checkpoints: Checkpoint[];
  userLocation: UserLocation;
  scanRadiusKm: number;
  onScanRadiusChange: (radius: number) => void;
  onSelectCheckpoint: (id: string) => void;
  onRescan: () => void;
}

export function RadarScanner({
  checkpoints,
  userLocation,
  scanRadiusKm,
  onScanRadiusChange,
  onSelectCheckpoint,
  onRescan,
}: RadarScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStep, setScanStep] = useState(0);

  useEffect(() => {
    runScan();
  }, [userLocation]);

  const runScan = () => {
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
    }, 600);

    setTimeout(() => {
      setScanStep(3);
      setIsScanning(false);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([60, 40, 60]);
        } catch (_) {}
      }
    }, 1400);
  };

  const nearbyCheckpoints = checkpoints
    .filter(
      (cp) =>
        cp.status !== 'cleared' &&
        cp.distanceKm !== undefined &&
        cp.distanceKm <= scanRadiusKm
    )
    .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  const nearest = nearbyCheckpoints[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-gradient-to-br from-[#0c101a]/90 via-[#07090e]/95 to-[#120a10]/90 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Specular Highlight Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {/* Siren Ambient Glows */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-600/20 blur-[80px] animate-siren-blue" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-red-600/20 blur-[80px] animate-siren-red" />

      {/* Header HUD Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-red-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Radar className={`h-4.5 w-4.5 ${isScanning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black tracking-wide uppercase text-white">
                เรดาร์สแกนจุดตรวจรอบตัว
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-red-950/80 border border-red-500/40 px-2 py-0.5 text-[9px] font-black text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                LIVE RADAR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              ตรวจสอบจุดตรวจรอบพิกัดปัจจุบันอัตโนมัติ
            </p>
          </div>
        </div>

        {/* Radius Selector & Refresh */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
            ระยะ:
          </span>
          {[1.5, 3.5, 7].map((rad) => (
            <button
              key={rad}
              onClick={() => onScanRadiusChange(rad)}
              className={`rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                scanRadiusKm === rad
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]'
                  : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {rad} กม.
            </button>
          ))}

          <button
            onClick={() => {
              onRescan();
              runScan();
            }}
            disabled={isScanning}
            title="สแกนพื้นที่รอบตัวใหม่"
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-slate-200 transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? 'animate-spin text-blue-400' : ''}`} />
            <span className="hidden md:inline">สแกนใหม่</span>
          </button>
        </div>
      </div>

      {/* Main Radar Screen Display */}
      <div className="relative z-10 mt-4">
        {isScanning ? (
          <div className="flex flex-col items-center justify-center py-7 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute h-full w-full rounded-full border border-blue-500/40 animate-ping" />
              <div className="absolute h-16 w-16 rounded-full border border-red-500/40 animate-pulse" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-black/80 border border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                <Radar className="h-5 w-5 animate-spin" />
              </div>
            </div>
            <p className="mt-3.5 text-xs font-black tracking-wider uppercase text-blue-400 animate-pulse">
              {scanStep === 1 && '📡 กำลังค้นหาดาวเทียม GPS และระบุตำแหน่งของคุณ...'}
              {scanStep === 2 && `🛰️ กำลังกวาดตรวจจุดตรวจในรัศมี ${scanRadiusKm} กม....`}
              {scanStep === 3 && '⚡ กำลังประมวลผลข้อมูลชุมชน...'}
            </p>
          </div>
        ) : nearbyCheckpoints.length > 0 ? (
          <div className="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/60 via-[#0c101a] to-blue-950/40 p-4 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/30 border border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-red-400">
                      ตรวจพบ {nearbyCheckpoints.length} จุดตรวจ
                    </span>
                    <span className="text-xs text-slate-400">
                      ในรัศมี {scanRadiusKm} กม. รอบตัวคุณ
                    </span>
                  </div>
                  {nearest && (
                    <p className="text-xs text-slate-300 mt-1">
                      ⚠️ <strong>ใกล้ที่สุด:</strong> {nearest.title} (
                      <span className="text-red-400 font-black">
                        ห่างไป {nearest.distanceKm} กม.
                      </span>{' '}
                      • {nearest.directionText})
                    </p>
                  )}
                </div>
              </div>

              {nearest && (
                <button
                  onClick={() => onSelectCheckpoint(nearest.id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <span>🎯 ดูจุดตรวจใกล้สุด</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-950/50 via-[#0c101a] to-[#0c101a] p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 border border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-blue-300">
                  เส้นทางรอบตัว {scanRadiusKm} กม. ปลอดโปร่ง
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  ไม่พบรายงานจุดตรวจในรัศมีใกล้ตัว • สวมหมวกนิรภัยและขับขี่อย่างปลอดภัย
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
