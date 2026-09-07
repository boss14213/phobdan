'use client';

import React from 'react';
import {
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Navigation,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import { Checkpoint } from '@/lib/types';
import { formatTimeAgo, CATEGORY_CONFIG } from '@/lib/mock-checkpoints';

interface NearbyFeedProps {
  checkpoints: Checkpoint[];
  selectedCheckpointId?: string | null;
  onSelectCheckpoint: (id: string) => void;
  onVoteCheckpoint: (id: string, type: 'up' | 'down') => void;
  onOpenCheckin: () => void;
}

export function NearbyFeed({
  checkpoints,
  selectedCheckpointId,
  onSelectCheckpoint,
  onVoteCheckpoint,
  onOpenCheckin,
}: NearbyFeedProps) {
  if (checkpoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-[#0d111a]/60 p-10 text-center">
        <span className="text-4xl mb-3">🛡️</span>
        <h3 className="text-base font-bold text-slate-200">
          ไม่พบรายงานด่านในหมวดนี้
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-400">
          หากคุณกำลังขับขี่แล้วพบจุดตรวจ ช่วยเพื่อนร่วมทางโดยการกดปักหมุดคนแรกได้เลย!
        </p>
        <button
          onClick={onOpenCheckin}
          className="mt-4 rounded-xl bg-gradient-to-r from-red-600 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/30 hover:opacity-95 active:scale-95"
        >
          🚨 ปักหมุดรายงานจุดตรวจ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {checkpoints.map((cp) => {
        const catConfig = CATEGORY_CONFIG[cp.category];
        const timeAgo = formatTimeAgo(cp.reportedTimestamp);
        const isSelected = selectedCheckpointId === cp.id;
        const isCleared = cp.status === 'cleared';
        const isUnverified = cp.status === 'unverified';

        return (
          <div
            key={cp.id}
            onClick={() => onSelectCheckpoint(cp.id)}
            className={`group relative rounded-2xl border p-4 transition-all cursor-pointer ${
              isSelected
                ? 'border-blue-500 bg-[#131b2c] shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                : 'border-slate-800/90 bg-[#0c1017] hover:border-slate-700 hover:bg-[#10141f]'
            } ${isCleared ? 'opacity-60 bg-[#090b10]' : ''}`}
          >
            {/* Top row: Category Badge, Distance, Time ago */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-950/40 px-2.5 py-0.5 text-xs font-bold text-red-300">
                  <span>
                    {cp.category === 'traffic_discipline' && '🪖'}
                    {cp.category === 'alcohol' && '🍺'}
                    {cp.category === 'speed' && '⚡'}
                    {cp.category === 'smoke' && '💨'}
                    {cp.category === 'security' && '🛡️'}
                  </span>
                  <span>{catConfig.shortLabel}</span>
                </span>

                {isCleared ? (
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                    ยกด่านแล้ว
                  </span>
                ) : isUnverified ? (
                  <span className="rounded-full bg-amber-950/50 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    รอการยืนยัน
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-950/60 border border-blue-500/40 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    ด่านสดใหม่
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                {cp.distanceKm !== undefined && (
                  <span className="flex items-center gap-1 font-bold text-blue-400">
                    <Navigation className="h-3 w-3" />
                    {cp.distanceKm} กม.
                  </span>
                )}
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="h-3 w-3" />
                  {timeAgo}
                </span>
              </div>
            </div>

            {/* Checkpoint Title & Direction */}
            <div className="mt-2.5">
              <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
                {cp.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span>{cp.directionText}</span>
              </p>
            </div>

            {/* Note & Advice */}
            {cp.note && (
              <div className="mt-2.5 flex items-start gap-1.5 rounded-xl border border-slate-800 bg-[#090b10] p-2 text-xs text-slate-300">
                <MessageSquare className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{cp.note}</span>
              </div>
            )}

            {/* Google Maps Style Verification Block & 1-Click LINE Share */}
            <div
              className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-t border-slate-800/80 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                  <span className="font-semibold text-slate-300">
                    ตรงนี้ยังมีด่านอยู่ไหม?
                  </span>
                </div>

                {/* Mobile-only LINE share icon */}
                <button
                  type="button"
                  onClick={() => {
                    const shareText = `🚨 เตือนภัยจุดตรวจ: ${cp.title}\n📍 ${cp.directionText}\n💡 ${cp.note || catConfig.label}\nขับขี่ปลอดภัย สวมหมวก เมาไม่ขับ\n🔗 เช็คเรดาร์สดที่: ${typeof window !== 'undefined' ? window.location.href : 'https://phobdan.vercel.app'}`;
                    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`, '_blank');
                  }}
                  className="sm:hidden flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-2 py-1 text-[10px] font-bold text-emerald-300 active:scale-95"
                  title="แชร์เข้า LINE"
                >
                  <Share2 className="h-3 w-3 text-emerald-400" />
                  <span>แชร์ LINE</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Desktop LINE share button */}
                <button
                  type="button"
                  onClick={() => {
                    const shareText = `🚨 เตือนภัยจุดตรวจ: ${cp.title}\n📍 ${cp.directionText}\n💡 ${cp.note || catConfig.label}\nขับขี่ปลอดภัย สวมหมวก เมาไม่ขับ\n🔗 เช็คเรดาร์สดที่: ${typeof window !== 'undefined' ? window.location.href : 'https://phobdan.vercel.app'}`;
                    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`, '_blank');
                  }}
                  className="hidden sm:flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 active:scale-95 transition-all"
                  title="แชร์เข้า LINE"
                >
                  <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>แชร์ LINE</span>
                </button>

                <button
                  type="button"
                  onClick={() => onVoteCheckpoint(cp.id, 'up')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                    cp.userVoted === 'up'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-white/50'
                      : 'border border-blue-900/60 bg-blue-950/40 text-blue-300 hover:bg-blue-900/50'
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>ยังอยู่ ({cp.upvotes})</span>
                </button>

                <button
                  type="button"
                  onClick={() => onVoteCheckpoint(cp.id, 'down')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                    cp.userVoted === 'down'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/40 ring-1 ring-white/50'
                      : 'border border-red-900/60 bg-red-950/40 text-red-300 hover:bg-red-900/50'
                  }`}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  <span>ยกแล้ว ({cp.downvotes})</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
