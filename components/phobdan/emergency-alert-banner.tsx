'use client';

import React from 'react';
import {
  AlertCircle,
  Compass,
  Phone,
  Share2,
  X,
  Radio,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import { SosAlert } from '@/lib/types';

interface EmergencyAlertBannerProps {
  alert: SosAlert;
  onDismiss: () => void;
}

export function EmergencyAlertBanner({ alert, onDismiss }: EmergencyAlertBannerProps) {
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${alert.lat},${alert.lng}`;

  const handleShareLine = () => {
    const text = `🚨 [แจ้งเตือนเหตุฉุกเฉินใกล้คุณ!]\n📍 เหตุ: ${alert.emergencyLabel}\n💡 รายละเอียด: ${alert.note || 'ต้องการความช่วยเหลือด่วน'}\n📞 ติดต่อ: ${alert.contactPhone || 'ติดต่อผ่านพิกัด'}\n🧭 เส้นทางนำทางไปช่วยเหลือ:\n${navUrl}\n(แจ้งเตือนผ่าน PhobDan Community SOS)`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-red-500/80 bg-gradient-to-r from-red-950/90 via-[#18090d]/95 to-red-950/90 p-4 sm:p-5 shadow-[0_0_35px_rgba(239,68,68,0.5)] backdrop-blur-2xl animate-in slide-in-from-top-4 duration-300">
      {/* Specular pulse edge */}
      <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-start gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]">
            <span className="text-xl">🚨</span>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow-sm">
                สัญญาณ SOS ด่วน
              </span>
              <h4 className="text-sm sm:text-base font-black text-white">
                {alert.emergencyLabel}
              </h4>
              {alert.distanceKm !== undefined && (
                <span className="flex items-center gap-1 rounded-full bg-black/60 border border-red-500/40 px-2.5 py-0.5 text-xs font-bold text-red-300">
                  <Navigation className="h-3 w-3 text-red-400" />
                  ห่างจากคุณ {alert.distanceKm} กม.
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-slate-200">
              {alert.note || 'มีผู้ขับขี่ต้องการความช่วยเหลือในบริเวณใกล้เคียง'}
            </p>

            {alert.contactPhone && (
              <p className="mt-0.5 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <span>📞 เบอร์ติดต่อ:</span>
                <a
                  href={`tel:${alert.contactPhone}`}
                  className="text-red-300 font-bold hover:underline"
                >
                  {alert.contactPhone}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap w-full md:w-auto">
          {/* Turn-by-Turn Navigation */}
          <a
            href={navUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2.5 text-xs font-black text-white shadow-lg shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
          >
            <Compass className="h-4 w-4" />
            <span>🧭 นำทางไปช่วย (Google Maps)</span>
          </a>

          {/* Share to LINE */}
          <button
            type="button"
            onClick={handleShareLine}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/60 px-3.5 py-2.5 text-xs font-bold text-emerald-300 transition-all active:scale-95 min-h-[44px]"
            title="แชร์พิกัดเข้า LINE"
          >
            <Share2 className="h-4 w-4 text-emerald-400" />
            <span className="inline">แชร์ LINE</span>
          </button>

          {/* Dismiss */}
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-xl border border-white/10 bg-black/40 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="ปิดการแจ้งเตือน"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
