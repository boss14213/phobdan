import { Checkpoint, CheckpointCategory, CategoryMeta, UserLocation } from './types';

export const CATEGORY_CONFIG: Record<CheckpointCategory, CategoryMeta> = {
  traffic_discipline: {
    label: 'กวดขันวินัยจราจร (หมวก/ใบขับขี่)',
    shortLabel: 'หมวก/ใบขับขี่',
    iconName: 'ShieldAlert',
    color: '#2563eb', // blue-600
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
    badgeText: 'text-blue-700 dark:text-blue-300',
    description: 'ตรวจหมวกกันน็อค ใบอนุญาตขับขี่ คาดเข็มขัดนิรภัย อุปกรณ์ส่วนควบ',
    safetyAdvice: 'สวมหมวกกันน็อคทั้งคนขับคนซ้อน คาดเข็มขัดนิรภัย และพกพาใบอนุญาตขับขี่',
  },
  alcohol: {
    label: 'ตรวจวัดแอลกอฮอล์ (เป่า)',
    shortLabel: 'วัดแอลกอฮอล์',
    iconName: 'Wine',
    color: '#d97706', // amber-600
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
    badgeText: 'text-amber-700 dark:text-amber-300',
    description: 'ตรวจวัดระดับแอลกอฮอล์ในลมหายใจ ชะลอความเร็วและเปิดไฟส่องสว่างในรถ',
    safetyAdvice: 'เมาไม่ขับ ปลอดภัยต่อตนเองและเพื่อนร่วมทาง หากดื่มแอลกอฮอล์ควรใช้รถสาธารณะ',
  },
  speed: {
    label: 'ตรวจจับความเร็ว / กล้องตรวจ',
    shortLabel: 'จับความเร็ว',
    iconName: 'Gauge',
    color: '#dc2626', // red-600
    badgeBg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800',
    badgeText: 'text-red-700 dark:text-red-300',
    description: 'ตั้งกล้องตรวจจับความเร็วและกวดขันการเปลี่ยนเลนกะทันหัน',
    safetyAdvice: 'ควบคุมความเร็วให้อยู่ในเกณฑ์ที่กฎหมายกำหนด เว้นระยะห่างจากคันหน้าอย่างปลอดภัย',
  },
  smoke: {
    label: 'ตรวจวัดควันดำและมลพิษ',
    shortLabel: 'ตรวจควันดำ',
    iconName: 'Wind',
    color: '#4b5563', // gray-600
    badgeBg: 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-900/60 dark:text-stone-300 dark:border-stone-700',
    badgeText: 'text-stone-700 dark:text-stone-300',
    description: 'ตรวจวัดไอเสียและควันดำเกินมาตรฐานของยานพาหนะ',
    safetyAdvice: 'หมั่นเปลี่ยนถ่ายน้ำมันเครื่องและตรวจสภาพระบบเผาไหม้เพื่อสุขอนามัยชุมชน',
  },
  security: {
    label: 'จุดตรวจความมั่นคง / ความปลอดภัย',
    shortLabel: 'ตรวจความมั่นคง',
    iconName: 'ShieldCheck',
    color: '#7c3aed', // purple-600
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
    badgeText: 'text-purple-700 dark:text-purple-300',
    description: 'ตรวจค้นสิ่งผิดกฎหมาย ป้องปรามเหตุอาชญากรรม',
    safetyAdvice: 'ให้ความร่วมมือในการตรวจ ชะลอรถและเปิดกระจกลงเพื่อความสะดวกของเจ้าหน้าที่',
  },
};

// ตำแหน่งเริ่มต้น: ใจกลางกรุงเทพฯ (อนุสาวรีย์ชัยสมรภูมิ)
export const DEFAULT_USER_LOCATION: UserLocation = {
  lat: 13.7650,
  lng: 100.5383,
  accuracy: 15,
};

// ด่านจำลองตั้งต้น
export const INITIAL_CHECKPOINTS: Checkpoint[] = [
  {
    id: 'cp-1',
    title: 'ถ.วิภาวดีรังสิต ขาเข้า (หน้า รร.สุรศักดิ์มนตรี)',
    locationName: 'ถนนวิภาวดีรังสิต ขาเข้า คู่ขนาน',
    lat: 13.7745,
    lng: 100.5567,
    category: 'traffic_discipline',
    direction: 'inbound',
    directionText: 'ขาเข้ามุ่งหน้าดินแดง',
    note: 'เลนคู่ขนานซ้ายสุด กวดขันสวมหมวกกันน็อคและป้ายทะเบียน',
    reportedTimestamp: Date.now() - 1000 * 60 * 12, // 12 mins ago
    reportedBy: 'ไรเดอร์ใจดี',
    upvotes: 9,
    downvotes: 1,
    status: 'active',
  },
  {
    id: 'cp-2',
    title: 'ถ.พหลโยธิน ขาออก (หน้าเมเจอร์ รัชโยธิน)',
    locationName: 'แยกเสนานิคม - รัชโยธิน',
    lat: 13.8298,
    lng: 100.5702,
    category: 'traffic_discipline',
    direction: 'outbound',
    directionText: 'ขาออกมุ่งหน้าเกษตร',
    note: 'ด่านตรวจวินัยจราจรและช่องทางจักรยานยนต์',
    reportedTimestamp: Date.now() - 1000 * 60 * 25, // 25 mins ago
    reportedBy: 'คนขี่เวฟ110',
    upvotes: 14,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-3',
    title: 'ถ.พระราม 9 มุ่งหน้าศรีนครินทร์ (ใต้สะพานข้ามแยก)',
    locationName: 'พระราม 9 มุ่งหน้าศรีนครินทร์',
    lat: 13.7486,
    lng: 100.5891,
    category: 'alcohol',
    direction: 'outbound',
    directionText: 'ขาออกมุ่งหน้ามอเตอร์เวย์',
    note: 'ตั้งกรวยบีบเหลือ 2 เลนขวา มีการตรวจวัดแอลกอฮอล์ทุกคัน',
    reportedTimestamp: Date.now() - 1000 * 60 * 38, // 38 mins ago
    reportedBy: 'เพื่อนร่วมทางBKK',
    upvotes: 21,
    downvotes: 2,
    status: 'active',
  },
  {
    id: 'cp-4',
    title: 'ถ.สุขุมวิท 21 (อโศกมนตรี หน้าตึกเสริมมิตร)',
    locationName: 'อโศกมนตรี มุ่งหน้าเพชรบุรี',
    lat: 13.7423,
    lng: 100.5607,
    category: 'speed',
    direction: 'both',
    directionText: 'ทั้งสองทิศทาง',
    note: 'กวดขันการกลับรถในที่ห้าม และกวดขันวินัยจราจรช่วงเย็น',
    reportedTimestamp: Date.now() - 1000 * 60 * 65, // 65 mins ago
    reportedBy: 'หนุ่มออฟฟิศอโศก',
    upvotes: 5,
    downvotes: 1,
    status: 'unverified',
  },
  {
    id: 'cp-5',
    title: 'ถ.บรมราชชนนี ขาเข้า (เลยสายใต้เก่า)',
    locationName: 'บรมราชชนนี ทางคู่ขนาน',
    lat: 13.7820,
    lng: 100.4721,
    category: 'smoke',
    direction: 'inbound',
    directionText: 'ขาเข้ามุ่งหน้าสะพานสมเด็จพระปิ่นเกล้า',
    note: 'จุดตรวจมลพิษควันดำและตรวจสภาพรถบรรทุก/กระบะ',
    reportedTimestamp: Date.now() - 1000 * 60 * 95, // 95 mins ago
    reportedBy: 'ลุงขับสองแถว',
    upvotes: 12,
    downvotes: 4,
    status: 'unverified',
  },
  {
    id: 'cp-6',
    title: 'ถ.สาทรใต้ มุ่งหน้าสะพานตากสิน (หน้า BTS สุรศักดิ์)',
    locationName: 'สาทรใต้ เลนซ้าย',
    lat: 13.7192,
    lng: 100.5215,
    category: 'security',
    direction: 'outbound',
    directionText: 'ขาออกมุ่งหน้าฝั่งธนบุรี',
    note: 'ตรวจตราความปลอดภัยและกวดขันรถจักรยานยนต์',
    reportedTimestamp: Date.now() - 1000 * 60 * 130, // 130 mins ago
    reportedBy: 'SathornRider',
    upvotes: 7,
    downvotes: 6,
    status: 'cleared', // มีคนโหวตว่ายกแล้ว
  },
];

/**
 * คำนวณระยะทางระหว่างพิกัดสองจุด (กิโลเมตร) โดยใช้ Haversine Formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * แปลงเวลา Timestamp เป็นข้อความภาษาไทยเข้าใจง่าย
 */
export function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'เมื่อสักครู่';
  if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  return `${Math.floor(diffHours / 24)} วันที่แล้ว`;
}
