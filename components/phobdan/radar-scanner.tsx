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

  // Auto-scan on component mount or trigger
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
      // Optional slight haptic feedback on mobile
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([60, 40, 60]);
        } catch (_) {}
      }
    }, 1400);
  };

  // Find checkpoints within selected radius
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
    <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#0d111a] via-[#090b10] to-[#120e14] p-5 shadow-2xl">
      {/* Background Siren Glows */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-red-600/15 blur-3xl" />

      {/* Header HUD Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-red-600 text-white shadow-md shadow-blue-500/20">
            <Radar className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold tracking-wide uppercase text-slate-100">
                ระบบสแกนด่านเรดาร์ใกล้ตัว
              </h3>
              <span className="flex items-center gap-1 rounded-full bg-red-950/80 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                LIVE RADAR
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              ตรวจสอบจุดตรวจรอบพิกัดปัจจุบันอัตโนมัติ
            </p>
          </div>
        </div>

        {/* Radius Selector & Refresh */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            รัศมี:
          </span>
          {[1.5, 3.5, 7].map((rad) => (
            <button
              key={rad}
              onClick={() => onScanRadiusChange(rad)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                scanRadiusKm === rad
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
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
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isScanning ? 'animate-spin text-blue-400' : ''}`} />
            <span className="hidden md:inline">สแกนใหม่</span>
          </button>
        </div>
      </div>

      {/* Main Radar Screen Display */}
      <div className="relative z-10 mt-4">
        {isScanning ? (
          /* Scanning in progress */
          <div className="flex flex-col items-center justify-center py-6 text-center">
            {/* Animated Radar Pulse Rings */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute h-full w-full rounded-full border border-blue-500/40 animate-ping" />
              <div className="absolute h-16 w-16 rounded-full border border-red-500/40 animate-pulse" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-blue-400 text-blue-400 shadow-lg">
                <Radar className="h-5 w-5 animate-spin" />
              </div>
            </div>
            <p className="mt-3 text-xs font-bold tracking-wider uppercase text-blue-400 animate-pulse">
              {scanStep === 1 && '📡 กำลังค้นหาดาวเทียม GPS และระบุตำแหน่งของคุณ...'}
              {scanStep === 2 && `🛰️ กำลังกวาดตรวจจุดตรวจในรัศมี ${scanRadiusKm} กม....`}
              {scanStep === 3 && '⚡ กำลังประมวลผลข้อมูลชุมชน...'}
            </p>
          </div>
        ) : nearbyCheckpoints.length > 0 ? (
          /* Alert: Checkpoints Found */
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-slate-900/80 to-blue-950/30 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 shadow-md">
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-red-400">
                      ตรวจพบ {nearbyCheckpoints.length} จุดตรวจ
                    </span>
                    <span className="text-xs text-slate-400">
                      ในรัศมี {scanRadiusKm} กม. รอบตัวคุณ
                    </span>
                  </div>
                  {nearest && (
                    <p className="text-xs text-slate-300 mt-1">
                      ⚠️ <strong>ใกล้ที่สุด:</strong> {nearest.title} (
                      <span className="text-red-400 font-bold">
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
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <span>🎯 ดูจุดตรวจใกล้สุด</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Safe: No Checkpoints Found in Radius */
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-900/90 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-md">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-blue-300">
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
