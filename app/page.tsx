'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/phobdan/header';
import { HeroBanner } from '@/components/phobdan/hero-banner';
import { RadarScanner } from '@/components/phobdan/radar-scanner';
import { MapView } from '@/components/phobdan/map-view';
import { NearbyFeed } from '@/components/phobdan/nearby-feed';
import { CheckinModal } from '@/components/phobdan/checkin-modal';
import { SafetyChecklist } from '@/components/phobdan/safety-checklist';
import { LocationPermissionModal } from '@/components/phobdan/location-permission-modal';
import { EmergencySosModal } from '@/components/phobdan/emergency-sos-modal';
import { EmergencyAlertBanner } from '@/components/phobdan/emergency-alert-banner';
import { AiParserModal } from '@/components/phobdan/ai-parser-modal';
import {
  INITIAL_CHECKPOINTS,
  DEFAULT_USER_LOCATION,
  calculateDistanceKm,
} from '@/lib/mock-checkpoints';
import {
  fetchLiveCheckpoints,
  insertLiveCheckpoint,
  voteLiveCheckpoint,
  supabase,
  isSupabaseConfigured,
} from '@/lib/supabase';
import { Checkpoint, CheckpointCategory, UserLocation, SosAlert, SosEmergencyType } from '@/lib/types';
import { Sparkles, MapPin, ListFilter, PlusCircle, RefreshCw, Radar, Bot, AlertTriangle } from 'lucide-react';

export default function PhobDanPage() {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>(INITIAL_CHECKPOINTS);
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [hasRealGps, setHasRealGps] = useState(false);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CheckpointCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [activeSosAlerts, setActiveSosAlerts] = useState<SosAlert[]>([]);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLiveDbConnected, setIsLiveDbConnected] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userScore, setUserScore] = useState(65);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scanRadiusKm, setScanRadiusKm] = useState<number>(3.5);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const realtimeChannelRef = useRef<any>(null);
  const userLocationRef = useRef<UserLocation>(userLocation);

  useEffect(() => {
    userLocationRef.current = userLocation;
  }, [userLocation]);

  // Check initial permission on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'granted') {
            fetchCurrentGps(false);
          } else if (result.state === 'prompt') {
            setShowLocationModal(true);
          }
        })
        .catch(() => {
          setShowLocationModal(true);
        });
    } else {
      setShowLocationModal(true);
    }
  }, []);

  // Connect to Supabase Live Database & Subscribe to Realtime Updates
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // 1. Initial fetch of live checkpoints from cloud
    fetchLiveCheckpoints().then((liveData) => {
      if (liveData && liveData.length > 0) {
        setCheckpoints(liveData);
        setIsLiveDbConnected(true);
      }
    });

    // 2. Realtime listener for new check-ins and vote changes
    if (supabase) {
      const channel = supabase
        .channel('phobdan_realtime_checkpoints')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'checkpoints' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const item: any = payload.new;
              const newCp: Checkpoint = {
                id: item.id,
                title: item.title,
                locationName: item.location_name,
                lat: Number(item.lat),
                lng: Number(item.lng),
                category: item.category,
                direction: item.direction,
                directionText: item.direction_text,
                note: item.note,
                reportedTimestamp: Number(item.reported_timestamp),
                reportedBy: item.reported_by || 'สมาชิกชุมชน',
                upvotes: Number(item.upvotes || 0),
                downvotes: Number(item.downvotes || 0),
                status: item.status || 'active',
              };
              setCheckpoints((prev) => {
                if (prev.some((c) => c.id === newCp.id)) return prev;
                return [newCp, ...prev];
              });
              showToast(`🚨 มีการปักหมุดด่านใหม่: ${newCp.title}`);
            } else if (payload.eventType === 'UPDATE') {
              const item: any = payload.new;
              setCheckpoints((prev) =>
                prev.map((c) =>
                  c.id === item.id
                    ? {
                        ...c,
                        upvotes: Number(item.upvotes || 0),
                        downvotes: Number(item.downvotes || 0),
                        status: item.status || c.status,
                        reportedTimestamp: Number(
                          item.reported_timestamp || c.reportedTimestamp
                        ),
                      }
                    : c
                )
              );
            }
          }
        )
        .on(
          'broadcast',
          { event: 'sos_alert' },
          (payload: any) => {
            if (payload && payload.payload) {
              const sos: SosAlert = payload.payload;
              const dist = calculateDistanceKm(
                userLocationRef.current.lat,
                userLocationRef.current.lng,
                sos.lat,
                sos.lng
              );
              const enrichedSos: SosAlert = { ...sos, distanceKm: dist };
              setActiveSosAlerts((prev) => [
                enrichedSos,
                ...prev.filter((a) => a.id !== sos.id),
              ]);
              showToast(
                `🚨 [SOS ขอความช่วยเหลือ!] ${sos.emergencyLabel} ห่างจากคุณ ${dist.toFixed(1)} กม.`
              );
            }
          }
        )
        .subscribe();

      realtimeChannelRef.current = channel;

      return () => {
        supabase?.removeChannel(channel);
        realtimeChannelRef.current = null;
      };
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch single GPS location
  const fetchCurrentGps = (interactive = true) => {
    if (!navigator.geolocation) {
      if (interactive) setLocationError('เบราว์เซอร์ไม่รองรับ GPS');
      return;
    }

    setIsRequestingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLoc: UserLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          isCustom: false,
        };
        setUserLocation(newLoc);
        setHasRealGps(true);
        setIsRequestingLocation(false);
        setShowLocationModal(false);
        showToast('📍 เชื่อมต่อ GPS สำเร็จ! เรดาร์กำลังสแกนด่านรอบตัวคุณ');
      },
      (err) => {
        setIsRequestingLocation(false);
        let msg = 'ไม่สามารถระบุตำแหน่งได้';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'คุณปฏิเสธการเข้าถึงพิกัด กรุณากดอนุญาตที่ไอคอนแม่กุญแจในช่องพิมพ์ URL';
        } else if (err.code === err.TIMEOUT) {
          msg = 'หมดเวลาการค้นหาดาวเทียม GPS โปรดลองใหม่อีกครั้ง';
        }
        if (interactive) {
          setLocationError(msg);
        }
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
    );
  };

  // Toggle Continuous Live Tracking
  const toggleLiveTracking = () => {
    if (isLiveTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
      showToast('⏸️ ปิดโหมดติดตามพิกัดสดแล้ว');
    } else {
      if (!navigator.geolocation) {
        showToast('เบราว์เซอร์ไม่รองรับ GPS');
        return;
      }

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            isCustom: false,
          });
          setHasRealGps(true);
        },
        () => {
          showToast('สัญญาณ GPS ขาดหาย');
        },
        { enableHighAccuracy: true, maximumAge: 2000 }
      );

      watchIdRef.current = id;
      setIsLiveTracking(true);
      showToast('🛰️ เปิดโหมดติดตามพิกัดสดขณะขับขี่ (Live Tracking ON)');
    }
  };

  // Fallback to default Bangkok location
  const handleUseDefault = () => {
    setShowLocationModal(false);
    setUserLocation(DEFAULT_USER_LOCATION);
    showToast('📍 ใช้งานพิกัดจำลอง (อนุสาวรีย์ชัยฯ, กรุงเทพฯ)');
  };

  // Calculate distances whenever user location or checkpoints change
  const checkpointsWithDistance = useMemo(() => {
    return checkpoints.map((cp) => ({
      ...cp,
      distanceKm: calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        cp.lat,
        cp.lng
      ),
    }));
  }, [checkpoints, userLocation]);

  // Filtered checkpoints based on category selection
  const filteredCheckpoints = useMemo(() => {
    const list =
      selectedCategory === 'all'
        ? checkpointsWithDistance
        : checkpointsWithDistance.filter((cp) => cp.category === selectedCategory);

    return [...list].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }, [checkpointsWithDistance, selectedCategory]);

  // Handle Google Maps style Verification Vote (Up / Down)
  const handleVote = (id: string, type: 'up' | 'down') => {
    let updatedUpvotes = 0;
    let updatedDownvotes = 0;
    let updatedStatus = 'active';

    setCheckpoints((prev) =>
      prev.map((cp) => {
        if (cp.id !== id) return cp;
        if (cp.userVoted === type) return cp;

        const isUp = type === 'up';
        const newUpvotes = isUp ? cp.upvotes + 1 : cp.upvotes;
        const newDownvotes = !isUp ? cp.downvotes + 1 : cp.downvotes;

        let newStatus = cp.status;
        if (isUp) {
          newStatus = 'active';
        } else if (newDownvotes >= newUpvotes + 1) {
          newStatus = 'cleared';
        }

        updatedUpvotes = newUpvotes;
        updatedDownvotes = newDownvotes;
        updatedStatus = newStatus;

        return {
          ...cp,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVoted: type,
          status: newStatus,
          reportedTimestamp: isUp ? Date.now() : cp.reportedTimestamp,
        };
      })
    );

    // Save to Supabase Cloud Database if configured
    if (isSupabaseConfigured) {
      voteLiveCheckpoint(
        id,
        updatedUpvotes,
        updatedDownvotes,
        updatedStatus,
        type === 'up' ? Date.now() : undefined
      );
    }

    if (type === 'up') {
      setUserScore((s) => s + 5);
      showToast('👍 ขอบคุณที่ยืนยันว่าด่านยังอยู่! ได้รับ +5 แต้ม');
    } else {
      setUserScore((s) => s + 5);
      showToast('❌ ขอบคุณที่ช่วยแจ้งว่ายกด่านแล้ว! ได้รับ +5 แต้ม');
    }
  };

  // Handle New Checkpoint Submission
  const handleNewCheckin = (data: {
    category: CheckpointCategory;
    direction: any;
    directionText: string;
    locationName: string;
    note: string;
    lat: number;
    lng: number;
  }) => {
    const newCp: Checkpoint = {
      id: `cp-${Date.now()}`,
      title: data.locationName,
      locationName: data.locationName,
      lat: data.lat,
      lng: data.lng,
      category: data.category,
      direction: data.direction,
      directionText: data.directionText,
      note: data.note,
      reportedTimestamp: Date.now(),
      reportedBy: 'คุณ (ผู้ใช้ปัจจุบัน)',
      upvotes: 1,
      downvotes: 0,
      userVoted: 'up',
      status: 'active',
    };

    setCheckpoints((prev) => [newCp, ...prev]);
    setSelectedCheckpointId(newCp.id);
    setUserScore((s) => s + 15);
    setViewMode('map');
    showToast('🚨 ปักหมุดสำเร็จ! ข้อมูลของคุณกำลังช่วยเพื่อนร่วมทาง (+15 แต้ม)');

    // Save to Supabase Cloud Database if configured
    if (isSupabaseConfigured) {
      insertLiveCheckpoint(newCp);
    }
  };

  // Handle AI Parsed Checkpoint Submission
  const handleAiAddCheckpoint = (data: {
    category: CheckpointCategory;
    direction: any;
    directionText: string;
    locationName: string;
    note: string;
    lat: number;
    lng: number;
  }) => {
    handleNewCheckin(data);
    showToast('🤖 AI ถอดรหัสพิกัดและบันทึกด่านสำเร็จ! ขอบคุณที่ร่วมเตือนภัย');
  };

  // Handle Community Emergency SOS Broadcast
  const handleBroadcastSos = (sosData: {
    emergencyType: SosEmergencyType;
    emergencyLabel: string;
    note: string;
    contactPhone: string;
    lat: number;
    lng: number;
  }) => {
    const newSos: SosAlert = {
      id: `sos-${Date.now()}`,
      emergencyType: sosData.emergencyType,
      emergencyLabel: sosData.emergencyLabel,
      note: sosData.note,
      contactPhone: sosData.contactPhone,
      lat: sosData.lat,
      lng: sosData.lng,
      reportedTimestamp: Date.now(),
      reportedBy: 'คุณ (ผู้ขอความช่วยเหลือ)',
      status: 'active',
      distanceKm: 0,
    };

    // Show active SOS banner at top
    setActiveSosAlerts((prev) => [newSos, ...prev]);

    // Broadcast across Supabase Realtime WebSocket to all online drivers
    if (realtimeChannelRef.current) {
      realtimeChannelRef.current.send({
        type: 'broadcast',
        event: 'sos_alert',
        payload: newSos,
      });
    }

    // Also pin as a prominent emergency checkpoint on the map and radar
    const sosCheckpoint: Checkpoint = {
      id: newSos.id,
      title: `🚨 ขอความช่วยเหลือ: ${sosData.emergencyLabel}`,
      locationName: `พิกัดฉุกเฉิน (${sosData.lat.toFixed(4)}, ${sosData.lng.toFixed(4)})`,
      lat: sosData.lat,
      lng: sosData.lng,
      category: 'security',
      direction: 'roadside',
      directionText: 'ริมทาง / ฉุกเฉิน',
      note: `${sosData.note || 'ต้องการความช่วยเหลือด่วน'} ${sosData.contactPhone ? `| โทรติดต่อ: ${sosData.contactPhone}` : ''}`,
      reportedTimestamp: Date.now(),
      reportedBy: 'ผู้ใช้ขอความช่วยเหลือฉุกเฉิน',
      upvotes: 5,
      downvotes: 0,
      userVoted: 'up',
      status: 'active',
    };

    setCheckpoints((prev) => [sosCheckpoint, ...prev]);
    setSelectedCheckpointId(sosCheckpoint.id);
    setViewMode('map');
    showToast('🚨 ส่งสัญญาณ SOS ฉุกเฉินและแชร์พิกัดเส้นทางแล้ว!');

    // Persist to Supabase if configured
    if (isSupabaseConfigured) {
      insertLiveCheckpoint(sosCheckpoint);
    }
  };

  const activeCount = checkpoints.filter((c) => c.status !== 'cleared').length;
  const totalConfirmed = checkpoints.reduce((acc, c) => acc + c.upvotes, 0);

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-red-600 selection:text-white overflow-x-hidden">
      {/* Ambient Police Siren Light Orbs Sweeping in Night Background */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-red-600/15 blur-[120px] animate-siren-red z-0" />
      <div className="pointer-events-none fixed -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px] animate-siren-blue z-0" />
      <div className="pointer-events-none fixed top-1/2 left-1/3 h-80 w-80 rounded-full bg-sky-600/10 blur-[140px] z-0" />

      {/* Navigation Bar */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeCheckpointsCount={activeCount}
        userScore={userScore}
        onRequestLocate={() => fetchCurrentGps(true)}
        isLocating={isRequestingLocation}
        hasGps={hasRealGps}
        isLiveTracking={isLiveTracking}
        onToggleLiveTracking={toggleLiveTracking}
        onOpenLocationModal={() => setShowLocationModal(true)}
        onOpenSosModal={() => setIsSosModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 z-50 -translate-x-1/2 transform rounded-full border border-white/20 bg-black/80 px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-in slide-in-from-top duration-200 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-5 pb-36 sm:pb-12">
        {/* Active Emergency SOS Banners (Real-time Broadcast from vicinity) */}
        {activeSosAlerts.map((alert) => (
          <EmergencyAlertBanner
            key={alert.id}
            alert={alert}
            onDismiss={() =>
              setActiveSosAlerts((prev) => prev.filter((a) => a.id !== alert.id))
            }
          />
        ))}

        {/* Hero Banner with Artwork & SOS trigger */}
        <HeroBanner
          onOpenCheckin={() => setIsCheckinOpen(true)}
          onOpenSosModal={() => setIsSosModalOpen(true)}
          onOpenAiModal={() => setIsAiModalOpen(true)}
          activeCount={activeCount}
          totalConfirmedCount={totalConfirmed}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Real-Time Radar Scanner (Auto-Scan on entry) */}
        <RadarScanner
          checkpoints={checkpointsWithDistance}
          userLocation={userLocation}
          scanRadiusKm={scanRadiusKm}
          onScanRadiusChange={setScanRadiusKm}
          onSelectCheckpoint={(id) => {
            setSelectedCheckpointId(id);
            setViewMode('map');
          }}
          onRescan={() => fetchCurrentGps(true)}
        />

        {/* Safety Tips Collapsible */}
        <SafetyChecklist />

        {/* Main Map & Nearby Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>เรดาร์และพิกัดด่านรอบตัว</span>
              <span className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-xs font-black text-blue-300 shadow-sm">
                {filteredCheckpoints.length} จุด
              </span>
            </h3>

            {/* Quick toggle on mobile */}
            <div className="sm:hidden flex items-center text-xs text-blue-400 font-bold">
              <button
                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                className="underline underline-offset-4"
              >
                {viewMode === 'map' ? 'สลับดูแบบรายการ' : 'สลับดูบนแผนที่'}
              </button>
            </div>
          </div>

          {/* Responsive Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Map Column */}
            <div
              className={`${
                viewMode === 'map' ? 'block' : 'hidden lg:block'
              } lg:col-span-7`}
            >
              <MapView
                checkpoints={filteredCheckpoints}
                userLocation={userLocation}
                selectedCheckpointId={selectedCheckpointId}
                onSelectCheckpoint={setSelectedCheckpointId}
                onVoteCheckpoint={handleVote}
                isFullscreen={isMapFullscreen}
                onToggleFullscreen={() => setIsMapFullscreen((prev) => !prev)}
              />
            </div>

            {/* List Column */}
            <div
              className={`${
                viewMode === 'list' ? 'block' : 'hidden lg:block'
              } lg:col-span-5 h-[480px] sm:h-[560px] overflow-y-auto pr-1`}
            >
              <NearbyFeed
                checkpoints={filteredCheckpoints}
                selectedCheckpointId={selectedCheckpointId}
                onSelectCheckpoint={setSelectedCheckpointId}
                onVoteCheckpoint={handleVote}
                onOpenCheckin={() => setIsCheckinOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Community Loop Section */}
        <section className="rounded-3xl border border-white/[0.12] bg-[#0c101a]/70 p-5 sm:p-6 text-center space-y-4 backdrop-blur-xl shadow-2xl">
          <div className="inline-block rounded-full bg-blue-950/80 border border-blue-500/40 px-3.5 py-1 text-[11px] font-black text-blue-400 uppercase tracking-wide">
            COMMUNITY LOOP • วงจรขับขี่ปลอดภัย
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            สแกนรอบตัว ➔ พบด่าน ➔ ปักหมุดใน 10 วิ ➔ ทุกคนถึงบ้านปลอดภัย
          </h3>
          <p className="mx-auto max-w-lg text-xs sm:text-sm text-slate-400">
            ร่วมกันสร้างสังคมผู้ขับขี่ที่มีวินัยจราจร สวมหมวก เมาไม่ขับ และตรวจเช็คความพร้อมทุกเส้นทาง
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left">
            <div className="rounded-2xl border border-white/[0.08] bg-[#080b12]/80 p-3.5 shadow-md">
              <span className="text-lg font-black text-blue-400">01. สแกน</span>
              <h4 className="font-bold text-xs mt-1 text-white">ตรวจพิกัด GPS</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                เปิดแอปปุ๊บ เรดาร์ตรวจสอบรัศมี 1 - 7 กม. อัตโนมัติ
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#080b12]/80 p-3.5 shadow-md">
              <span className="text-lg font-black text-red-400">02. ปักหมุด</span>
              <h4 className="font-bold text-xs mt-1 text-white">แจ้งเตือนใน 10 วิ</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                แตะเลือกประเภทด่าน ไม่ต้องพิมพ์ยาว ไม่ต้องล็อกอิน
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#080b12]/80 p-3.5 shadow-md">
              <span className="text-lg font-black text-blue-400">03. ยืนยันสด</span>
              <h4 className="font-bold text-xs mt-1 text-white">ยังอยู่ หรือ ยกแล้ว</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ตัดด่านเก่าออกอัตโนมัติ ไร้ด่านผีค้างบนแผนที่
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#080b12]/80 p-3.5 shadow-md">
              <span className="text-lg font-black text-emerald-400">04. ปลอดภัย</span>
              <h4 className="font-bold text-xs mt-1 text-white">ชะลอความเร็ว สวมหมวก</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ช่วยเตือนให้ผู้ขับขี่มีวินัยจราจร ปลอดภัยทุกการเดินทาง
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Bottom Mobile Navigation Dock (Mobile-First Thumb Experience) */}
      {!isMapFullscreen && (
        <aside aria-label="Mobile Navigation Dock" className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] left-3 right-3 z-40 sm:hidden">
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-[#090d16]/95 p-1.5 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.95)]">
            {/* 1. Map / List View Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-black transition-all min-h-[48px] active:scale-95 ${
                viewMode === 'map' ? 'text-blue-400 bg-blue-500/10' : 'text-emerald-400 bg-emerald-500/10'
              }`}
            >
              {viewMode === 'map' ? (
                <>
                  <ListFilter className="h-4.5 w-4.5 text-blue-400" />
                  <span className="text-[10px] font-bold">ดูรายการ</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4.5 w-4.5 text-emerald-400" />
                  <span className="text-[10px] font-bold">ดูแผนที่</span>
                </>
              )}
            </button>

            {/* 2. Real-Time Radar Scan */}
            <button
              onClick={() => fetchCurrentGps(true)}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-black text-white hover:bg-white/5 active:scale-95 transition-all min-h-[48px]"
            >
              <Radar className="h-4.5 w-4.5 text-blue-400" />
              <span className="text-[10px] font-bold text-slate-300">สแกน</span>
            </button>

            {/* 3. Core Check-in Action (Well-balanced highlight) */}
            <button
              onClick={() => setIsCheckinOpen(true)}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 active:scale-95 transition-all min-h-[48px]"
            >
              <PlusCircle className="h-4.5 w-4.5 text-amber-400" />
              <span className="text-[10px] font-black text-amber-300">ปักหมุด</span>
            </button>

            {/* 4. Roadside Emergency Assistance (Secondary Helper Tab, subtle & dignified) */}
            <button
              onClick={() => setIsSosModalOpen(true)}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs font-black text-slate-400 hover:text-red-300 hover:bg-red-500/10 active:scale-95 transition-all min-h-[48px]"
              title="ขอความช่วยเหลือฉุกเฉินบนท้องถนน (สำรอง)"
            >
              <AlertTriangle className="h-4.5 w-4.5 text-red-400/80" />
              <span className="text-[10px] font-bold text-slate-400">ช่วยเหลือ</span>
            </button>
          </div>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#05070a] py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-white">
            <span>🚨 พบด่าน (PhobDan)</span>
            <span>•</span>
            <span className="text-xs text-slate-400 font-normal">
              เพื่อสังคมขับขี่ปลอดภัย มีวินัยจราจร
            </span>
          </div>
          <p className="text-[11px]">
            ขับขี่ปลอดภัย สวมหมวกนิรภัยทุกครั้ง เมาไม่ขับ
          </p>
        </div>
      </footer>

      {/* Location Permission Modal */}
      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllowLocation={() => fetchCurrentGps(true)}
        onUseDefaultLocation={handleUseDefault}
        isLoading={isRequestingLocation}
        error={locationError}
      />

      {/* Fast Check-in Modal */}
      <CheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        userLocation={userLocation}
        onSubmitCheckin={handleNewCheckin}
      />

      {/* Emergency Roadside Assistance / Community SOS Modal */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        userLocation={userLocation}
        onBroadcastSos={handleBroadcastSos}
      />

      {/* AI Checkpoint Text Parser & Ingestion Modal */}
      <AiParserModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddCheckpoint={handleAiAddCheckpoint}
      />
    </div>
  );
}
