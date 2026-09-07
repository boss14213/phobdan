'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Checkpoint, UserLocation, CheckpointCategory } from '@/lib/types';
import { formatTimeAgo, CATEGORY_CONFIG } from '@/lib/mock-checkpoints';

interface LeafletMapProps {
  checkpoints: Checkpoint[];
  userLocation: UserLocation;
  selectedCheckpointId?: string | null;
  onSelectCheckpoint: (id: string) => void;
  onVoteCheckpoint: (id: string, type: 'up' | 'down') => void;
}

export default function LeafletMap({
  checkpoints,
  userLocation,
  selectedCheckpointId,
  onSelectCheckpoint,
  onVoteCheckpoint,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false,
    });

    // Use 100% Free OpenStreetMap (No API key, No watermark, Full Thai street details)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: 'map-tiles-dark',
    }).addTo(map);

    // Zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update user location marker & radar circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute h-9 w-9 rounded-full bg-blue-500/40 animate-ping"></div>
          <div class="relative flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500/50 text-white text-[10px] font-black">
            ฉัน
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(
          '<div style="color: #0f172a; font-weight: bold; font-size: 12px;">📍 ตำแหน่งปัจจุบันของคุณ</div>'
        );
    }

    if (userCircleRef.current) {
      userCircleRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: 3500, // 3.5 km radar radius
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '5, 5',
      }).addTo(map);
    }
  }, [userLocation]);

  // Update Checkpoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    checkpoints.forEach((cp) => {
      const isCleared = cp.status === 'cleared';
      const isUnverified = cp.status === 'unverified';

      const emojiMap: Record<CheckpointCategory, string> = {
        traffic_discipline: '🪖',
        alcohol: '🍺',
        speed: '⚡',
        smoke: '💨',
        security: '🛡️',
      };

      const emoji = emojiMap[cp.category] || '🚨';

      const pinBg = isCleared
        ? 'bg-slate-700 border-slate-500 opacity-60'
        : isUnverified
        ? 'bg-amber-600 border-amber-300 shadow-amber-500/50'
        : 'bg-red-600 border-red-300 shadow-red-500/60 ring-2 ring-red-500/50';

      const markerHtml = `
        <div class="group cursor-pointer transition-transform duration-150 hover:scale-115 active:scale-95">
          <div class="relative flex items-center justify-center">
            ${
              cp.status === 'active'
                ? '<div class="absolute -inset-1 rounded-full bg-red-500/50 animate-ping"></div>'
                : ''
            }
            <div class="relative flex h-10 w-10 items-center justify-center rounded-2xl ${pinBg} border-2 shadow-xl text-lg text-white">
              ${emoji}
            </div>
            <div class="absolute -bottom-1.5 h-2 w-2 rotate-45 ${pinBg}"></div>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-cp-marker',
        html: markerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 36],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([cp.lat, cp.lng], { icon }).addTo(map);

      // Popup Content in Dark Sleek Style
      const timeAgo = formatTimeAgo(cp.reportedTimestamp);
      const catConfig = CATEGORY_CONFIG[cp.category];

      const popupHtml = `
        <div style="font-family: inherit; width: 240px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="background: #450a0a; color: #fca5a5; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; border: 1px solid #dc2626;">
              ${catConfig.shortLabel}
            </span>
            <span style="font-size: 11px; color: #94a3b8;">${timeAgo}</span>
          </div>
          
          <h4 style="margin: 4px 0 2px 0; font-size: 13px; font-weight: 800; color: #ffffff; line-height: 1.3;">
            ${cp.title}
          </h4>
          
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #94a3b8;">
            📍 ${cp.directionText}
          </p>

          ${
            cp.note
              ? `<div style="background: #1e293b; border-left: 3px solid #dc2626; padding: 4px 8px; border-radius: 6px; font-size: 11px; color: #e2e8f0; margin-bottom: 8px;">
                  💬 "${cp.note}"
                </div>`
              : ''
          }

          <div style="border-top: 1px solid #334155; padding-top: 6px; margin-top: 6px;">
            <div style="font-size: 11px; font-weight: 700; color: #f1f5f9; margin-bottom: 5px;">
              🤔 ตรงนี้ยังมีด่านอยู่ไหม?
            </div>
            <div style="display: flex; gap: 6px;">
              <button id="vote-up-${cp.id}" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; background: #0284c7; color: #ffffff; border: none; padding: 5px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                👍 ยังอยู่ (${cp.upvotes})
              </button>
              <button id="vote-down-${cp.id}" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; background: #dc2626; color: #ffffff; border: none; padding: 5px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                ❌ ยกแล้ว (${cp.downvotes})
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 270 });

      // Handle popup open
      marker.on('popupopen', () => {
        onSelectCheckpoint(cp.id);
        const upBtn = document.getElementById(`vote-up-${cp.id}`);
        const downBtn = document.getElementById(`vote-down-${cp.id}`);

        if (upBtn) {
          upBtn.onclick = (e) => {
            e.stopPropagation();
            onVoteCheckpoint(cp.id, 'up');
            marker.closePopup();
          };
        }
        if (downBtn) {
          downBtn.onclick = (e) => {
            e.stopPropagation();
            onVoteCheckpoint(cp.id, 'down');
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectCheckpoint(cp.id);
      });

      markersRef.current[cp.id] = marker;
    });
  }, [checkpoints]);

  // Center map on selected checkpoint
  useEffect(() => {
    if (!selectedCheckpointId || !markersRef.current[selectedCheckpointId]) return;
    const marker = markersRef.current[selectedCheckpointId];
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(marker.getLatLng(), 14, { duration: 0.6 });
      marker.openPopup();
    }
  }, [selectedCheckpointId]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-2xl z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 left-3 z-20 hidden sm:flex items-center gap-2 rounded-xl bg-[#0d111a]/90 p-2 text-[11px] font-bold text-slate-200 shadow-xl backdrop-blur-md border border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-red-400">ด่านสดใหม่</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-amber-400">รอการยืนยัน</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-500" />
          <span className="text-slate-400">ยกแล้ว</span>
        </span>
      </div>
    </div>
  );
}
