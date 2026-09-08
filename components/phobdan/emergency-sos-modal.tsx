'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Send,
  X,
  MapPin,
  Share2,
  CheckCircle2,
  Radio,
  Sparkles,
  Compass,
  Car,
  Wrench,
  BatteryCharging,
  Fuel,
  HeartPulse,
} from 'lucide-react';
import { SosEmergencyType, UserLocation } from '@/lib/types';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: UserLocation;
  onBroadcastSos: (sosData: {
    emergencyType: SosEmergencyType;
    emergencyLabel: string;
    note: string;
    contactPhone: string;
    lat: number;
    lng: number;
  }) => void;
}

const EMERGENCY_TYPES: {
  id: SosEmergencyType;
  label: string;
  sublabel: string;
  icon: string;
  borderColor: string;
  bgActive: string;
}[] = [
  {
    id: 'accident',
    label: 'อุบัติเหตุเฉี่ยวชน',
    sublabel: 'ต้องการกู้ภัย / ทีมประกัน',
    icon: '💥',
    borderColor: 'border-red-500',
    bgActive: 'bg-red-950/60 border-red-500 shadow-red-500/30',
  },
  {
    id: 'breakdown',
    label: 'ยางแตก / ยางแบน',
    sublabel: 'ต้องการแม่แรง / ปะยาง',
    icon: '🛞',
    borderColor: 'border-amber-500',
    bgActive: 'bg-amber-950/60 border-amber-500 shadow-amber-500/30',
  },
  {
    id: 'battery',
    label: 'แบตหมด / สตาร์ทไม่ติด',
    sublabel: 'ต้องการพ่วงแบตเตอรี่',
    icon: '🔋',
    borderColor: 'border-sky-500',
    bgActive: 'bg-sky-950/60 border-sky-500 shadow-sky-500/30',
  },
  {
    id: 'fuel',
    label: 'น้ำมันหมดฉุกเฉิน',
    sublabel: 'ต้องการซื้อน้ำมันมาเติม',
    icon: '⛽',
    borderColor: 'border-orange-500',
    bgActive: 'bg-orange-950/60 border-orange-500 shadow-orange-500/30',
  },
  {
    id: 'medical',
    label: 'เจ็บป่วย / บาดเจ็บฉุกเฉิน',
    sublabel: 'ต้องการแพทย์ / รถพยาบาล',
    icon: '🚑',
    borderColor: 'border-rose-500',
    bgActive: 'bg-rose-950/60 border-rose-500 shadow-rose-500/30',
  },
];

const EMERGENCY_HOTLINES = [
  { number: '1669', title: 'กู้ชีพ / การแพทย์', color: 'bg-rose-600 hover:bg-rose-500', icon: '🚑' },
  { number: '1193', title: 'ตำรวจทางหลวง', color: 'bg-blue-600 hover:bg-blue-500', icon: '🚔' },
  { number: '1543', title: 'กู้ภัยทางด่วน กทพ.', color: 'bg-amber-600 hover:bg-amber-500', icon: '🛣️' },
  { number: '191', title: 'เหตุด่วนเหตุร้าย', color: 'bg-red-600 hover:bg-red-500', icon: '🚨' },
];

export function EmergencySosModal({
  isOpen,
  onClose,
  userLocation,
  onBroadcastSos,
}: EmergencySosModalProps) {
  const [selectedType, setSelectedType] = useState<SosEmergencyType>('accident');
  const [note, setNote] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  if (!isOpen) return null;

  const currentTypeConfig = EMERGENCY_TYPES.find((t) => t.id === selectedType)!;
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${userLocation.lat},${userLocation.lng}`;

  const handleBroadcast = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onBroadcastSos({
        emergencyType: selectedType,
        emergencyLabel: currentTypeConfig.label,
        note: note.trim() || currentTypeConfig.sublabel,
        contactPhone: contactPhone.trim(),
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      setIsSubmitting(false);
      setHasSent(true);
    }, 400);
  };

  const handleShareLine = () => {
    const text = `🚨 [ขอความช่วยเหลือฉุกเฉินบนท้องถนน!]\n📍 เหตุ: ${currentTypeConfig.icon} ${currentTypeConfig.label}\n📌 รายละเอียด: ${note || currentTypeConfig.sublabel}\n📞 เบอร์ติดต่อ: ${contactPhone || 'ติดต่อผ่านพิกัด'}\n🧭 กดนำทางมาช่วยได้ทันทีที่:\n${navUrl}\n(ส่งผ่าน PhobDan SOS Night Radar)`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-red-500/40 bg-gradient-to-b from-[#140b10] via-[#090b10] to-[#07090e] p-5 sm:p-6 shadow-[0_0_60px_rgba(239,68,68,0.3)] text-white max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              <span className="text-xl">🚨</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  ขอความช่วยเหลือฉุกเฉิน
                </h3>
                <span className="rounded-md bg-red-950 border border-red-500/40 px-1.5 py-0.5 text-[9px] font-black text-red-400 animate-pulse">
                  SOS ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                แจ้งเพื่อนร่วมทางรอบข้าง และแชร์เส้นทางนำทางมาช่วยเหลือ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Fixed GPS Pin Location */}
        <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/50 px-3.5 py-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-400 shrink-0 animate-bounce" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                พิกัด GPS ปัจจุบันของคุณ:
              </span>
              <span className="font-mono font-bold text-white text-xs">
                {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
              </span>
            </div>
          </div>
          <span className="rounded-lg bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
            พิกัดพร้อมนำทาง
          </span>
        </div>

        {hasSent ? (
          /* Sent Success State */
          <div className="mt-5 space-y-4 text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20 border-2 border-red-500 text-3xl shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              🚨
            </div>
            <div>
              <h4 className="text-xl font-black text-white">
                ส่งสัญญาณขอความช่วยเหลือแล้ว!
              </h4>
              <p className="mt-1 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                สัญญาณ SOS พร้อมพิกัดถูกบรอดแคสต์ไปยังผู้ใช้ PhobDan ในรัศมีรอบตัวเรียบร้อยแล้ว
              </p>
            </div>

            {/* Navigation & Share Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleShareLine}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Share2 className="h-4 w-4" />
                <span>แชร์พิกัดและเส้นทางนำทางเข้า LINE ทันที</span>
              </button>

              <a
                href={navUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 py-3 text-xs sm:text-sm font-bold text-slate-200 transition-all"
              >
                <Compass className="h-4 w-4 text-blue-400" />
                <span>ทดสอบเปิดลิงก์นำทาง (Google Maps)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setHasSent(false);
                  onClose();
                }}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-medium"
              >
                ปิดหน้าต่างนี้และกลับสู่แผนที่
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <div className="mt-4 space-y-4">
            {/* 1. Select Emergency Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. เลือกประเภทเหตุฉุกเฉิน:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EMERGENCY_TYPES.map((t) => {
                  const isSelected = selectedType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className={`flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? t.bgActive + ' shadow-lg scale-[1.02]'
                          : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{t.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-white truncate">
                          {t.label}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {t.sublabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Phone & Short Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  เบอร์โทรติดต่อกลับ (ไม่บังคับ):
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  รุ่นรถ / จุดสังเกต (ไม่บังคับ):
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น รถเก๋งสีดำ จอดเปิดไฟฉุกเฉิน"
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Primary Broadcast Action Button */}
            <button
              type="button"
              onClick={handleBroadcast}
              disabled={isSubmitting}
              className="group w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 py-3.5 text-xs sm:text-sm font-black text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(239,68,68,0.7)] active:scale-95 disabled:opacity-50"
            >
              <Radio className="h-4 w-4 animate-ping" />
              <span>
                {isSubmitting
                  ? 'กำลังกระจายสัญญาณฉุกเฉิน...'
                  : '🚨 กดส่งสัญญาณขอความช่วยเหลือ (BROADCAST SOS)'}
              </span>
            </button>

            {/* 4. Official Emergency Hotlines (1-Click Dial) */}
            <div className="border-t border-white/10 pt-3">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                หรือโทรติดต่อสายด่วนกู้ภัยทางการทันที (กดโทรออกฟรี):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EMERGENCY_HOTLINES.map((h) => (
                  <a
                    key={h.number}
                    href={`tel:${h.number}`}
                    className={`flex flex-col items-center justify-center rounded-2xl p-2.5 text-center shadow-md transition-all hover:scale-105 active:scale-95 ${h.color}`}
                  >
                    <span className="text-base">{h.icon}</span>
                    <span className="text-base font-black tracking-wider text-white">
                      {h.number}
                    </span>
                    <span className="text-[9px] font-bold text-white/90 leading-tight">
                      {h.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
