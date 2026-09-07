export type CheckpointCategory =
  | 'traffic_discipline' // กวดขันวินัยจราจร (หมวก, ใบขับขี่, ท่อดัง)
  | 'alcohol'            // ตรวจวัดแอลกอฮอล์
  | 'smoke'              // ตรวจควันดำ
  | 'security'           // ด่านตรวจความมั่นคง / ทั่วไป
  | 'speed';             // ตรวจจับความเร็ว

export type CheckpointDirection = 'inbound' | 'outbound' | 'both' | 'roadside';

export type CheckpointStatus = 'active' | 'unverified' | 'cleared';

export interface Checkpoint {
  id: string;
  title: string;
  locationName: string;
  lat: number;
  lng: number;
  category: CheckpointCategory;
  direction: CheckpointDirection;
  directionText: string;
  note?: string;
  reportedTimestamp: number; // Date.now() timestamp
  reportedBy: string;
  upvotes: number;   // โหวตว่า "ยังอยู่"
  downvotes: number; // โหวตว่า "ยกแล้ว/ไม่อยู่"
  userVoted?: 'up' | 'down' | null;
  status: CheckpointStatus;
  distanceKm?: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  isCustom?: boolean;
}

export interface CategoryMeta {
  label: string;
  shortLabel: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  safetyAdvice: string;
}
