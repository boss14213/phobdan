'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, ChevronDown, ChevronUp } from 'lucide-react';

export function SafetyChecklist() {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    helmet: true,
    license: false,
    prb: false,
    sober: true,
  });

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0c1017] p-4 shadow-xl transition-all">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">
              เช็คลิสต์ 4 ข้อก่อนบิด ขับขี่ปลอดภัย 🛵
            </h3>
            <p className="text-[11px] text-slate-400">
              พร้อมแล้ว {completedCount}/4 ข้อ • เจอด่านไหนก็มั่นใจ ไม่เสียค่าปรับ
            </p>
          </div>
        </div>

        <button className="rounded-full p-1 text-slate-400 hover:bg-slate-800">
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3.5 space-y-2 border-t border-slate-800 pt-3 animate-in fade-in duration-150">
          {[
            {
              id: 'helmet',
              label: 'สวมหมวกนิรภัยทั้งคนขับและคนซ้อน / คาดเข็มขัด',
              sub: 'ลดโอกาสบาดเจ็บรุนแรงได้กว่า 70%',
            },
            {
              id: 'license',
              label: 'พกพาใบอนุญาตขับขี่ (หรือแอป DLT QR Licence)',
              sub: 'เปิดแสดงผ่านมือถือได้ตามกฎหมาย',
            },
            {
              id: 'prb',
              label: 'แผ่นป้ายทะเบียนและป้ายภาษี/พ.ร.บ. ไม่ขาดอายุ',
              sub: 'คุ้มครองค่ารักษาพยาบาลยามเกิดเหตุฉุกเฉิน',
            },
            {
              id: 'sober',
              label: 'มีสติสมบูรณ์ ไม่ดื่มเครื่องดื่มแอลกอฮอล์เด็ดขาด',
              sub: 'เพื่อความปลอดภัยของคุณและครอบครัว',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="flex items-start gap-2.5 rounded-xl p-2 transition-colors hover:bg-slate-900 cursor-pointer"
            >
              <div
                className={`mt-0.5 flex h-4 w-4 items-center justify-center rounded-md border transition-all ${
                  checkedItems[item.id]
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-slate-700 bg-slate-950'
                }`}
              >
                {checkedItems[item.id] && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
              <div className="text-xs">
                <span
                  className={`font-semibold ${
                    checkedItems[item.id]
                      ? 'line-through text-slate-500'
                      : 'text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
                <p className="text-[10px] text-slate-400">{item.sub}</p>
              </div>
            </div>
          ))}

          <div className="mt-2 rounded-xl border border-blue-900/40 bg-blue-950/20 p-2.5 text-[11px] text-blue-300">
            🛡️ <strong>จำไว้เสมอ:</strong> จุดตรวจตั้งขึ้นเพื่อความปลอดภัยของทุกคน การมีวินัยจราจรช่วยเซฟชีวิตและเซฟเงินในกระเป๋า
          </div>
        </div>
      )}
    </div>
  );
}
