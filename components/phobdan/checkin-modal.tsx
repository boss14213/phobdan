'use client';

import React, { useState } from 'react';
import { X, MapPin, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { CheckpointCategory, CheckpointDirection, UserLocation } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/mock-checkpoints';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: UserLocation;
  onSubmitCheckin: (data: {
    category: CheckpointCategory;
    direction: CheckpointDirection;
    directionText: string;
    locationName: string;
    note: string;
    lat: number;
    lng: number;
  }) => void;
}

const PRESET_NOTES = [
  'เลนซ้ายสุด',
  'ใต้สะพานข้ามแยก',
  'หน้าปั๊มน้ำมัน',
  'กวดขันหมวกกันน็อค',
  'ตรวจวัดแอลกอฮอล์ทุกคัน',
  'ตั้งกรวยบีบเหลือ 1 เลน',
];

export function CheckinModal({
  isOpen,
  onClose,
  userLocation,
  onSubmitCheckin,
}: CheckinModalProps) {
  const [category, setCategory] = useState<CheckpointCategory>('traffic_discipline');
  const [direction, setDirection] = useState<CheckpointDirection>('inbound');
  const [locationName, setLocationName] = useState('พิกัดตำแหน่งปัจจุบันของคุณ');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const directionMap: Record<CheckpointDirection, string> = {
      inbound: 'ขาเข้าเมือง',
      outbound: 'ขาออกเมือง',
      both: 'ทั้งสองฝั่งถนน',
      roadside: 'ทางคู่ขนาน/ทางเบี่ยง',
    };

    setTimeout(() => {
      onSubmitCheckin({
        category,
        direction,
        directionText: directionMap[direction],
        locationName: locationName || 'ถนนสายหลัก (พิกัดดาวเทียม)',
        note: note || 'โปรดระมัดระวังและสวมหมวกกันน็อค',
        lat: userLocation.lat + (Math.random() - 0.5) * 0.003,
        lng: userLocation.lng + (Math.random() - 0.5) * 0.003,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-800 bg-[#0d111a] p-5 shadow-2xl transition-all sm:p-6 max-h-[92vh] overflow-y-auto">
        {/* Glowing Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-t-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-950/80 border border-red-500/40 text-xl text-red-400">
              🚨
            </span>
            <div>
              <h3 className="text-lg font-black text-white">
                พบด่านตรงนี้ (ปักหมุดด่วน)
              </h3>
              <p className="text-xs text-slate-400">
                ใช้เวลาไม่เกิน 10 วินาที • ไม่ต้องล็อกอิน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Step 1: Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. ประเภทจุดตรวจที่พบ *
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(
                Object.keys(CATEGORY_CONFIG) as CheckpointCategory[]
              ).map((catKey) => {
                const config = CATEGORY_CONFIG[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all active:scale-95 ${
                      isSelected
                        ? 'border-red-500 bg-red-950/50 text-white shadow-lg shadow-red-950/50 font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">
                      {catKey === 'traffic_discipline' && '🪖'}
                      {catKey === 'alcohol' && '🍺'}
                      {catKey === 'speed' && '⚡'}
                      {catKey === 'smoke' && '💨'}
                      {catKey === 'security' && '🛡️'}
                    </span>
                    <span className="text-xs">{config.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Direction */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. ทิศทางมุ่งหน้า *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'inbound', label: 'ขาเข้าเมือง 🏙️' },
                { id: 'outbound', label: 'ขาออกเมือง 🛣️' },
                { id: 'both', label: 'ทั้งสองฝั่ง ↔️' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDirection(item.id as CheckpointDirection)}
                  className={`rounded-xl border py-2.5 px-1 text-xs font-bold transition-all ${
                    direction === item.id
                      ? 'border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              3. สถานที่ / จุดสังเกต
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-red-400" />
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="เช่น ปากซอยสุขุมวิท 71, หน้าปั๊ม ปตท., ใต้สะพานลอย..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Preset Chips for Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              4. รายละเอียดเพิ่มเติม (แตะเลือกได้ทันที)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_NOTES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    if (note.includes(chip)) return;
                    setNote(note ? `${note}, ${chip}` : chip);
                  }}
                  className="rounded-full border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-400 transition-colors hover:border-blue-500/60 hover:text-blue-300"
                >
                  + {chip}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ระบุเพิ่มเติม เช่น ตรวจหมวกกันน็อค หรือช่องทาง..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Reassurance */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-[11px] text-slate-400 leading-relaxed">
            🛡️ <strong>ขับขี่ปลอดภัย:</strong> ข้อมูลนี้ช่วยเตือนให้ผู้ร่วมทางลดความเร็วและมีวินัยจราจร
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-red-600/30 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>กำลังบันทึกพิกัด...</span>
            ) : (
              <>
                <span>🚨 ปักหมุดและแจ้งเตือนเพื่อนทันที</span>
                <span className="rounded-md bg-black/30 px-2 py-0.5 text-xs">
                  +15 pts
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
