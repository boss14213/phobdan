'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, X, ArrowRight, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { Checkpoint, CheckpointCategory, CheckpointDirection } from '@/lib/types';

interface AiParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCheckpoint: (cp: any) => void;
}

// Known Thailand nationwide landmark reference points for smart AI geocoding
const THAILAND_LANDMARKS: { [key: string]: { lat: number; lng: number } } = {
  // Bangkok & Vicinity
  'วิภาวดี': { lat: 13.7850, lng: 100.5580 },
  'พหลโยธิน': { lat: 13.8250, lng: 100.5700 },
  'รัชดา': { lat: 13.8150, lng: 100.5760 },
  'พระราม 9': { lat: 13.7500, lng: 100.5850 },
  'สุขุมวิท': { lat: 13.7380, lng: 100.5650 },
  'ทองหล่อ': { lat: 13.7247, lng: 100.5794 },
  'เอกมัย': { lat: 13.7314, lng: 100.5862 },
  'เกษตร-นวมินทร์': { lat: 13.8320, lng: 100.6120 },
  'เลียบด่วน': { lat: 13.8033, lng: 100.6189 },
  'รามอินทรา': { lat: 13.8450, lng: 100.6350 },
  'บรมราชชนนี': { lat: 13.7820, lng: 100.4720 },
  'สาทร': { lat: 13.7200, lng: 100.5230 },
  'ราชพฤกษ์': { lat: 13.8210, lng: 100.4500 },
  'พระราม 2': { lat: 13.6670, lng: 100.4370 },
  'ลาดพร้าว': { lat: 13.8050, lng: 100.5820 },
  'บางนา': { lat: 13.6680, lng: 100.6050 },
  'รังสิต': { lat: 13.9892, lng: 100.6178 },
  'นนทบุรี': { lat: 13.8589, lng: 100.5208 },
  'แคราย': { lat: 13.8589, lng: 100.5208 },

  // Eastern
  'พัทยา': { lat: 12.9268, lng: 100.8874 },
  'บางแสน': { lat: 13.2842, lng: 100.9238 },
  'ชลบุรี': { lat: 13.3245, lng: 100.9472 },
  'ระยอง': { lat: 12.6842, lng: 101.2458 },

  // Northern
  'เชียงใหม่': { lat: 18.7905, lng: 98.9865 },
  'นิมมาน': { lat: 18.8015, lng: 98.9668 },
  'คันคลอง': { lat: 18.7905, lng: 98.9562 },
  'ลำพูน': { lat: 18.4572, lng: 99.1382 },
  'ลำปาง': { lat: 18.2745, lng: 99.4782 },
  'เชียงราย': { lat: 19.8825, lng: 99.8322 },
  'พิษณุโลก': { lat: 16.8245, lng: 100.3015 },

  // Isan / Northeast
  'โคราช': { lat: 14.9782, lng: 102.0725 },
  'นครราชสีมา': { lat: 14.9782, lng: 102.0725 },
  'ขอนแก่น': { lat: 16.4325, lng: 102.8252 },
  'อุดร': { lat: 17.4085, lng: 102.7912 },
  'อุบล': { lat: 15.2285, lng: 104.8582 },
  'บุรีรัมย์': { lat: 14.9625, lng: 103.0945 },

  // Southern
  'ภูเก็ต': { lat: 7.8925, lng: 98.3685 },
  'ป่าตอง': { lat: 7.9015, lng: 98.3125 },
  'หาดใหญ่': { lat: 7.0085, lng: 100.4982 },
  'สงขลา': { lat: 7.1850, lng: 100.5950 },
  'สุราษฎร์': { lat: 9.1125, lng: 99.3082 },
  'สมุย': { lat: 9.5312, lng: 100.0615 },
  'ชุมพร': { lat: 10.6512, lng: 99.1582 },

  // Western & Central
  'หัวหิน': { lat: 12.5892, lng: 99.9542 },
  'ชะอำ': { lat: 12.6512, lng: 99.9125 },
  'อยุธยา': { lat: 14.3412, lng: 100.6125 },
  'นครปฐม': { lat: 13.8115, lng: 100.0882 },
};

export function AiParserModal({ isOpen, onClose, onAddCheckpoint }: AiParserModalProps) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleProcessText = () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      const text = inputText.toLowerCase();

      // 1. Detect Category
      let category: CheckpointCategory = 'traffic_discipline';
      if (text.includes('แอลกอฮอล์') || text.includes('เป่า') || text.includes('เมา') || text.includes('เหล้า')) {
        category = 'alcohol';
      } else if (text.includes('ความเร็ว') || text.includes('กล้อง') || text.includes('ยิง')) {
        category = 'speed';
      } else if (text.includes('ควันดำ') || text.includes('มลพิษ') || text.includes('ตรวจควัน')) {
        category = 'smoke';
      } else if (text.includes('ตรวจฉี่') || text.includes('อาชญากรรม') || text.includes('ความมั่นคง')) {
        category = 'security';
      }

      // 2. Detect Direction
      let direction: CheckpointDirection = 'inbound';
      let directionText = 'ขาเข้าเมือง';
      if (text.includes('ขาออก')) {
        direction = 'outbound';
        directionText = 'ขาออกเมือง';
      } else if (text.includes('สองฝั่ง') || text.includes('ทั้งสอง')) {
        direction = 'both';
        directionText = 'ทั้งสองทิศทาง';
      }

      // 3. Approximate Geocoding from text landmarks
      let lat = 13.7563;
      let lng = 100.5018;

      for (const [landmark, coords] of Object.entries(THAILAND_LANDMARKS)) {
        if (text.includes(landmark.toLowerCase())) {
          lat = coords.lat + (Math.random() - 0.5) * 0.006;
          lng = coords.lng + (Math.random() - 0.5) * 0.006;
          break;
        }
      }

      // 4. Extract Location Summary
      const locationName = inputText.length > 50 ? inputText.slice(0, 48) + '...' : inputText;

      setParsedResult({
        category,
        direction,
        directionText,
        locationName,
        note: `สกัดข้อมูลจากโซเชียล: "${inputText}"`,
        lat,
        lng,
      });

      setIsProcessing(false);
    }, 600);
  };

  const samplePresets = [
    '🎵 TikTok เชียงใหม่: "นิมมานหน้าเมญ่ามีด่านเป่าแอลกอฮอล์ รถติดยาวมาก ใครผ่านระวังด้วย"',
    '🎵 TikTok พัทยา: "สุขุมวิทพัทยาใต้ขาออกไปจอมเทียน ตั้งด่านกวดขันวินัยจราจรและหมวกกันน็อก"',
    '🎵 TikTok เลียบด่วน: "เลียบด่วนรามอินทราหน้า Central Eastville ตั้งด่านตรวจแอลกอฮอล์เลนด่วน"',
    '🎵 TikTok ภูเก็ต: "สี่แยกบายพาสหน้าเซ็นทรัลภูเก็ต มีด่านเป่าตรวจเข้มมากทั้งสองฝั่ง"',
  ];

  const handleConfirmAdd = () => {
    if (!parsedResult) return;
    onAddCheckpoint(parsedResult);
    setParsedResult(null);
    setInputText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 p-0 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-[28px] sm:rounded-3xl border border-white/15 bg-[#0d111a] p-5 sm:p-6 shadow-2xl max-h-[88dvh] sm:max-h-[92vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        {/* Mobile Swipe / Sheet Grab Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Specular Header */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-md shadow-purple-500/30">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 truncate">
                <span>AI ช่วยกวาดพิกัดด่าน</span>
                <span className="rounded-md bg-purple-950/80 border border-purple-500/40 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold text-purple-300 shrink-0">
                  AI ASSISTANT
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                ก๊อปปี้ข้อความจาก LINE / Facebook มาแปะ ให้ AI ถอดรหัสพิกัดทันที
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                วางข้อความรายงานด่านจากโซเชียล:
              </label>
              <span className="text-[10px] text-pink-400 font-bold flex items-center gap-1">
                <span>🎵</span>
                <span>รองรับ TikTok / LINE</span>
              </span>
            </div>

            {/* Quick Presets */}
            <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              <span className="text-slate-500 shrink-0 text-[10px]">ตัวอย่างฮิต:</span>
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(preset)}
                  className="shrink-0 rounded-lg border border-pink-500/30 bg-pink-950/30 px-2 py-1 text-pink-300 hover:bg-pink-900/40 transition-colors"
                >
                  {preset.split(':')[0]}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="ตัวอย่าง: 'ด่วนมาก วิภาวดีขาออกก่อนถึงแยกสุทธิสารมีตั้งกรวยตรวจหมวกกันน็อคเลนซ้าย รถมอเตอร์ไซค์โดนเยอะมาก'"
              className="w-full rounded-2xl border border-white/10 bg-black/60 p-3 text-sm sm:text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleProcessText}
            disabled={isProcessing || !inputText.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-purple-600/30 transition-all hover:opacity-95 active:scale-98 disabled:opacity-50 min-h-[44px]"
          >
            <Sparkles className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'AI กำลังวิเคราะห์ภาษาธรรมชาติ...' : '⚡ ให้ AI แปลงเป็นพิกัดด่านทันที'}</span>
          </button>

          {/* AI Result Card */}
          {parsedResult && (
            <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>AI ถอดรหัสข้อมูลสำเร็จ:</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5">
                <p>
                  📍 <strong>สถานที่:</strong> {parsedResult.locationName}
                </p>
                <p>
                  🪖 <strong>ประเภท:</strong> {parsedResult.category}
                </p>
                <p>
                  🛣️ <strong>ทิศทาง:</strong> {parsedResult.directionText}
                </p>
                <p>
                  🌐 <strong>พิกัดโดยประมาณ:</strong> {parsedResult.lat.toFixed(4)}, {parsedResult.lng.toFixed(4)}
                </p>
              </div>

              <button
                onClick={handleConfirmAdd}
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 active:scale-98"
              >
                <span>✅ ยืนยันและปักหมุดนี้ลงแผนที่ทันที</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
