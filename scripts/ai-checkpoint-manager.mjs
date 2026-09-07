/**
 * AI Checkpoint Manager (สคริปต์ AI ดูแลและกวาดข้อมูลด่าน "พบด่าน")
 * 
 * ใช้งาน:
 *   node scripts/ai-checkpoint-manager.mjs seed   (อัปเดต 25+ จุดตรวจยอดฮิตขึ้น Supabase)
 *   node scripts/ai-checkpoint-manager.mjs clean  (ล้างด่านเก่าที่ยกแล้วหรือหมดอายุเกิน 4 ชม.)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Read .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        if (k && v.length > 0) {
          process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ไม่พบการตั้งค่า NEXT_PUBLIC_SUPABASE_URL หรือ NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.error('กรุณาสร้างไฟล์ .env.local แล้วระบุค่า API Key จาก Supabase Project Settings -> API\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 25 Verified Checkpoints & Speed Cameras
const VERIFIED_CHECKPOINTS = [
  {
    id: 'cp-1',
    title: 'ถ.วิภาวดีรังสิต ขาเข้า (หน้า รร.สุรศักดิ์มนตรี)',
    location_name: 'ถนนวิภาวดีรังสิต ขาเข้า คู่ขนาน',
    lat: 13.7745,
    lng: 100.5567,
    category: 'traffic_discipline',
    direction: 'inbound',
    direction_text: 'ขาเข้ามุ่งหน้าดินแดง',
    note: 'เลนคู่ขนานซ้ายสุด กวดขันสวมหมวกกันน็อคและป้ายทะเบียน',
    reported_timestamp: Date.now() - 1000 * 60 * 12,
    reported_by: 'สายตรวจกทม.',
    upvotes: 19,
    downvotes: 1,
    status: 'active',
  },
  {
    id: 'cp-2',
    title: 'ถ.พหลโยธิน ขาออก (หน้าเมเจอร์ รัชโยธิน)',
    location_name: 'แยกเสนานิคม - รัชโยธิน',
    lat: 13.8298,
    lng: 100.5702,
    category: 'traffic_discipline',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้าเกษตร',
    note: 'ด่านตรวจวินัยจราจรและช่องทางจักรยานยนต์',
    reported_timestamp: Date.now() - 1000 * 60 * 25,
    reported_by: 'ไรเดอร์รัชโยธิน',
    upvotes: 24,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-3',
    title: 'ถ.พระราม 9 มุ่งหน้าศรีนครินทร์ (ใต้สะพานข้ามแยกราม)',
    location_name: 'พระราม 9 มุ่งหน้าศรีนครินทร์',
    lat: 13.7486,
    lng: 100.5891,
    category: 'alcohol',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้ามอเตอร์เวย์',
    note: 'ตั้งกรวยบีบเหลือ 2 เลนขวา มีการตรวจวัดแอลกอฮอล์ช่วงดึก',
    reported_timestamp: Date.now() - 1000 * 60 * 38,
    reported_by: 'เพื่อนร่วมทางBKK',
    upvotes: 35,
    downvotes: 2,
    status: 'active',
  },
  {
    id: 'cp-4',
    title: 'ถ.รัชดาภิเษก (หน้าศาลอาญา รัชดา 36)',
    location_name: 'รัชดาภิเษก มุ่งหน้าพระราม 9',
    lat: 13.8185,
    lng: 100.5772,
    category: 'alcohol',
    direction: 'inbound',
    direction_text: 'ขาเข้ามุ่งหน้าแยกรัชโยธิน-สุทธิสาร',
    note: 'จุดตั้งด่านตรวจวัดแอลกอฮอล์และกวดขันวินัยจราจรยอดฮิต',
    reported_timestamp: Date.now() - 1000 * 60 * 18,
    reported_by: 'พี่ตั้มสายตรวจ',
    upvotes: 28,
    downvotes: 1,
    status: 'active',
  },
  {
    id: 'cp-5',
    title: 'ดอนเมืองโทลล์เวย์ (กล้องตรวจจับความเร็วถาวร กม. 14)',
    location_name: 'ทางยกระดับอุตราภิมุข ขาออก ช่วงดอนเมือง',
    lat: 13.8982,
    lng: 100.5968,
    category: 'speed',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้ารังสิต',
    note: 'กล้องตรวจจับความเร็วถาวร จำกัดความเร็วไม่เกิน 80-90 กม./ชม.',
    reported_timestamp: Date.now() - 1000 * 60 * 60 * 2,
    reported_by: 'ระบบกล้องทางหลวง',
    upvotes: 45,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-6',
    title: 'ถ.เกษตร-นวมินทร์ (ประเสริฐมนูกิจ ช่วงตอม่อ 125)',
    location_name: 'ถนนประเสริฐมนูกิจ มุ่งหน้าเกษตร',
    lat: 13.8322,
    lng: 100.6125,
    category: 'alcohol',
    direction: 'inbound',
    direction_text: 'ขาเข้ามุ่งหน้าแยกเกษตร',
    note: 'จุดตรวจความพร้อมผู้ขับขี่และวัดระดับแอลกอฮอล์',
    reported_timestamp: Date.now() - 1000 * 60 * 45,
    reported_by: 'ไรเดอร์นวมินทร์',
    upvotes: 16,
    downvotes: 3,
    status: 'active',
  },
  {
    id: 'cp-7',
    title: 'ถ.บรมราชชนนี ขาเข้า (ช่วงสายใต้เก่า ตลิ่งชัน)',
    location_name: 'บรมราชชนนี ทางคู่ขนาน',
    lat: 13.7820,
    lng: 100.4721,
    category: 'smoke',
    direction: 'inbound',
    direction_text: 'ขาเข้ามุ่งหน้าสะพานสมเด็จพระปิ่นเกล้า',
    note: 'จุดตรวจมลพิษควันดำและตรวจสภาพรถบรรทุก/กระบะ',
    reported_timestamp: Date.now() - 1000 * 60 * 95,
    reported_by: 'ลุงขับสองแถว',
    upvotes: 18,
    downvotes: 4,
    status: 'active',
  },
  {
    id: 'cp-8',
    title: 'ถ.ราชพฤกษ์ (ช่วงวงเวียนพระราม 5 มุ่งหน้าสาทร)',
    location_name: 'ราชพฤกษ์ มุ่งหน้ากรุงเทพฯ',
    lat: 13.8214,
    lng: 100.4502,
    category: 'traffic_discipline',
    direction: 'inbound',
    direction_text: 'ขาเข้ามุ่งหน้าเพชรเกษม-สาทร',
    note: 'ตรวจจับช่องทางห้าม จยย. และกวดขันป้ายทะเบียน',
    reported_timestamp: Date.now() - 1000 * 60 * 50,
    reported_by: 'คนฝั่งธน',
    upvotes: 22,
    downvotes: 2,
    status: 'active',
  },
  {
    id: 'cp-9',
    title: 'มอเตอร์เวย์ สาย 7 (กล้องตรวจจับความเร็ว กม. 12)',
    location_name: 'มอเตอร์เวย์ กรุงเทพ - ชลบุรี สายใหม่',
    lat: 13.7291,
    lng: 100.7382,
    category: 'speed',
    direction: 'both',
    direction_text: 'ทั้งสองทิศทาง ขาเข้าและขาออก',
    note: 'กล้องตรวจจับความเร็วอัตโนมัติ 24 ชม. ควบคุมความเร็ว 120 กม./ชม.',
    reported_timestamp: Date.now() - 1000 * 60 * 60 * 4,
    reported_by: 'ระบบกล้องทางหลวง',
    upvotes: 52,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-10',
    title: 'ถ.สาทรใต้ (หน้า BTS สุรศักดิ์)',
    location_name: 'สาทรใต้ เลนซ้าย',
    lat: 13.7192,
    lng: 100.5215,
    category: 'security',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้าฝั่งธนบุรี',
    note: 'ตรวจตราความปลอดภัยและกวดขันรถจักรยานยนต์',
    reported_timestamp: Date.now() - 1000 * 60 * 110,
    reported_by: 'SathornRider',
    upvotes: 11,
    downvotes: 5,
    status: 'active',
  },
  {
    id: 'cp-11',
    title: 'ถ.สุขุมวิท 21 (อโศกมนตรี หน้าตึกเสริมมิตร)',
    location_name: 'อโศกมนตรี มุ่งหน้าเพชรบุรี',
    lat: 13.7423,
    lng: 100.5607,
    category: 'speed',
    direction: 'both',
    direction_text: 'ทั้งสองทิศทาง',
    note: 'กวดขันการกลับรถในที่ห้าม และกวดขันวินัยจราจรช่วงเย็น',
    reported_timestamp: Date.now() - 1000 * 60 * 65,
    reported_by: 'หนุ่มออฟฟิศอโศก',
    upvotes: 7,
    downvotes: 1,
    status: 'active',
  },
  {
    id: 'cp-12',
    title: 'ถ.พระราม 2 ขาออก (หน้าเซ็นทรัล พระราม 2)',
    location_name: 'พระราม 2 ทางด่วนช่องหลัก',
    lat: 13.6672,
    lng: 100.4375,
    category: 'speed',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้าสมุทรสาคร',
    note: 'จุดตรวจจับความเร็วยานพาหนะและกวดขันรถบรรทุกวิ่งขวา',
    reported_timestamp: Date.now() - 1000 * 60 * 75,
    reported_by: 'เพื่อนร่วมทางมหาชัย',
    upvotes: 19,
    downvotes: 3,
    status: 'active',
  },
  {
    id: 'cp-13',
    title: 'ถ.สุขุมวิท 55 (ปากซอยทองหล่อ หน้าสถานี BTS)',
    location_name: 'ทองหล่อ สุขุมวิท 55',
    lat: 13.7258,
    lng: 100.5794,
    category: 'alcohol',
    direction: 'inbound',
    direction_text: 'มุ่งหน้าถนนสุขุมวิทสายหลัก',
    note: 'จุดตรวจวัดระดับแอลกอฮอล์ช่วงดึก ชะลอความเร็วและเปิดกระจก',
    reported_timestamp: Date.now() - 1000 * 60 * 15,
    reported_by: 'สายปาร์ตี้กลับบ้านปลอดภัย',
    upvotes: 31,
    downvotes: 1,
    status: 'active',
  },
  {
    id: 'cp-14',
    title: 'ถ.สุขุมวิท 63 (เอกมัย มุ่งหน้าเพชรบุรีตัดใหม่)',
    location_name: 'ถนนเอกมัย ช่วงบิ๊กซีเอกมัย',
    lat: 13.7312,
    lng: 100.5865,
    category: 'traffic_discipline',
    direction: 'outbound',
    direction_text: 'มุ่งหน้าแยกคลองตัน',
    note: 'กวดขันวินัยจราจร ตรวจสวมหมวกกันน็อคและใบขับขี่',
    reported_timestamp: Date.now() - 1000 * 60 * 30,
    reported_by: 'ไรเดอร์เอกมัย',
    upvotes: 15,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-15',
    title: 'ถ.เพชรบุรีตัดใหม่ (ใต้ทางด่วนเพชรบุรี มุ่งหน้าคลองตัน)',
    location_name: 'เพชรบุรีตัดใหม่ ใต้สะพานทางด่วน',
    lat: 13.7485,
    lng: 100.5695,
    category: 'traffic_discipline',
    direction: 'outbound',
    direction_text: 'มุ่งหน้าอาร์ซีเอ-คลองตัน',
    note: 'กวดขันวินัยจราจร ช่องทางห้าม จยย. และป้ายทะเบียน',
    reported_timestamp: Date.now() - 1000 * 60 * 40,
    reported_by: 'คนทำงานอโศก',
    upvotes: 21,
    downvotes: 2,
    status: 'active',
  },
  {
    id: 'cp-16',
    title: 'สะพานภูมิพล 1-2 (กล้องตรวจจับความเร็วถาวร)',
    location_name: 'สะพานภูมิพล ข้ามแม่น้ำเจ้าพระยา',
    lat: 13.6654,
    lng: 100.5401,
    category: 'speed',
    direction: 'both',
    direction_text: 'ทั้งสองทิศทาง ข้ามแม่น้ำเจ้าพระยา',
    note: 'กล้องตรวจจับความเร็ว 24 ชม. จำกัดความเร็ว 60-80 กม./ชม. ห้าม จยย. ขึ้นสะพาน',
    reported_timestamp: Date.now() - 1000 * 60 * 60 * 5,
    reported_by: 'ระบบกล้องจราจร',
    upvotes: 68,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-17',
    title: 'สะพานพระราม 8 (ทางลงฝั่งพระนคร แยกวิสุทธิกษัตริย์)',
    location_name: 'เชิงสะพานพระราม 8 มุ่งหน้าราชดำเนิน',
    lat: 13.7689,
    lng: 100.4988,
    category: 'traffic_discipline',
    direction: 'inbound',
    direction_text: 'มุ่งหน้าแยกวิสุทธิกษัตริย์',
    note: 'กวดขันหมวกกันน็อคและอุปกรณ์ส่วนควบเลนซ้าย',
    reported_timestamp: Date.now() - 1000 * 60 * 55,
    reported_by: 'เด็กฝั่งธนข้ามสะพาน',
    upvotes: 27,
    downvotes: 1,
    status: 'active',
  },
  {
    id: 'cp-18',
    title: 'ถ.บางนา-ตราด กม. 4.5 (หน้าเซ็นทรัลบางนา คู่ขนาน)',
    location_name: 'ถนนบางนา-ตราด ขาออก กม.4',
    lat: 13.6678,
    lng: 100.6345,
    category: 'smoke',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้าบางพลี ชลบุรี',
    note: 'จุดตรวจวัดมลพิษควันดำและตรวจสภาพรถกระบะ/บรรทุก',
    reported_timestamp: Date.now() - 1000 * 60 * 80,
    reported_by: 'สายส่งของบางนา',
    upvotes: 14,
    downvotes: 2,
    status: 'active',
  },
  {
    id: 'cp-19',
    title: 'ทางหลวงพิเศษหมายเลข 9 M9 (วงแหวนกาญจนาภิเษก ทับช้าง)',
    location_name: 'ถนนกาญจนาภิเษก วงแหวนรอบนอกตะวันออก',
    lat: 13.7431,
    lng: 100.7023,
    category: 'speed',
    direction: 'both',
    direction_text: 'ทั้งสองทิศทาง ช่วงก่อนถึงด่านเก็บเงิน',
    note: 'กล้องตรวจจับความเร็วอัตโนมัติ ควบคุมความเร็วไม่เกิน 120 กม./ชม.',
    reported_timestamp: Date.now() - 1000 * 60 * 60 * 3,
    reported_by: 'ระบบกล้องทางหลวง',
    upvotes: 43,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-20',
    title: 'ทางพิเศษศรีรัช (ช่วงต่างระดับพญาไท มุ่งหน้าแจ้งวัฒนะ)',
    location_name: 'ทางพิเศษศรีรัช ขาออก',
    lat: 13.7663,
    lng: 100.5287,
    category: 'speed',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้างามวงศ์วาน แจ้งวัฒนะ',
    note: 'กล้องตรวจจับความเร็วบนทางด่วน จำกัดความเร็ว 90-110 กม./ชม.',
    reported_timestamp: Date.now() - 1000 * 60 * 60 * 6,
    reported_by: 'ระบบตรวจจับความเร็ว กทพ.',
    upvotes: 39,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-21',
    title: 'ถ.รามอินทรา กม. 8 (ใต้ทางด่วนฉลองรัช ขาออก)',
    location_name: 'ถนนรามอินทรา ช่วง กม.8 มุ่งหน้ามีนบุรี',
    lat: 13.8291,
    lng: 100.6482,
    category: 'alcohol',
    direction: 'outbound',
    direction_text: 'ขาออกมุ่งหน้ามีนบุรี',
    note: 'จุดตรวจความพร้อมผู้ขับขี่และวัดแอลกอฮอล์ช่วงหลังเที่ยงคืน',
    reported_timestamp: Date.now() - 1000 * 60 * 20,
    reported_by: 'ไรเดอร์รามอินทรา',
    upvotes: 22,
    downvotes: 1,
    status: 'active',
  },
  {
    id: 'cp-22',
    title: 'ถ.พระราม 3 (ใต้สะพานภูมิพล มุ่งหน้าคลองเตย)',
    location_name: 'ถนนพระราม 3 เลนคู่ขนาน',
    lat: 13.6821,
    lng: 100.5342,
    category: 'traffic_discipline',
    direction: 'inbound',
    direction_text: 'มุ่งหน้าแยกคลองเตย',
    note: 'กวดขันวินัยจราจร การขับขี่เร็ว และตรวจอุปกรณ์ส่วนควบรถ',
    reported_timestamp: Date.now() - 1000 * 60 * 65,
    reported_by: 'คนพื้นที่พระราม3',
    upvotes: 17,
    downvotes: 3,
    status: 'active',
  },
  {
    id: 'cp-23',
    title: 'ถ.งามวงศ์วาน (หน้าเดอะมอลล์งามวงศ์วาน ขาออก)',
    location_name: 'ถนนงามวงศ์วาน มุ่งหน้าแคราย',
    lat: 13.8592,
    lng: 100.5421,
    category: 'traffic_discipline',
    direction: 'outbound',
    direction_text: 'มุ่งหน้าแยกแคราย นนทบุรี',
    note: 'กวดขันหมวกกันน็อคและห้ามปาดเข้าเส้นทึบหน้าห้าง',
    reported_timestamp: Date.now() - 1000 * 60 * 35,
    reported_by: 'เด็กมอเกษตร',
    upvotes: 25,
    downvotes: 2,
    status: 'active',
  },
  {
    id: 'cp-24',
    title: 'ทางพิเศษบูรพาวิถี (บางนา-ชลบุรี ช่วง กม. 19)',
    location_name: 'ทางยกระดับบูรพาวิถี ขาออก',
    lat: 13.6125,
    lng: 100.7712,
    category: 'speed',
    direction: 'outbound',
    direction_text: 'มุ่งหน้าสนามบินสุวรรณภูมิและชลบุรี',
    note: 'กล้องตรวจจับความเร็วถาวร จำกัดความเร็วไม่เกิน 110 กม./ชม.',
    reported_timestamp: Date.now() - 1000 * 60 * 60 * 8,
    reported_by: 'ระบบกล้องทางด่วนบูรพาวิถี',
    upvotes: 56,
    downvotes: 0,
    status: 'active',
  },
  {
    id: 'cp-25',
    title: 'ถ.ลาดพร้าว (หน้าอิมพีเรียล ลาดพร้าว 81)',
    location_name: 'ถนนลาดพร้าว มุ่งหน้าบางกะปิ',
    lat: 13.7912,
    lng: 100.5978,
    category: 'security',
    direction: 'outbound',
    direction_text: 'มุ่งหน้าแยกบางกะปิ',
    note: 'จุดตรวจความปลอดภัยและป้องปรามเหตุ ตรวจค้นสิ่งผิดกฎหมาย',
    reported_timestamp: Date.now() - 1000 * 60 * 48,
    reported_by: 'วินลาดพร้าว',
    upvotes: 18,
    downvotes: 1,
    status: 'active',
  },
];

async function seedCheckpoints() {
  console.log(`\n🚀 กำลังซิงค์ข้อมูลจุดตรวจ 25 จุดขึ้น Supabase: ${supabaseUrl}...`);
  const { error } = await supabase
    .from('checkpoints')
    .upsert(VERIFIED_CHECKPOINTS, { onConflict: 'id' });

  if (error) {
    console.error('❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error.message);
  } else {
    console.log('✅ บันทึกข้อมูลจุดตรวจ 25 จุดขึ้น Supabase เรียบร้อยแล้ว!');
  }
}

async function cleanOldCheckpoints() {
  const cutoffTime = Date.now() - 1000 * 60 * 60 * 6;
  console.log('\n🧹 กำลังทำความสะอาดด่านที่ยกแล้วหรือหมดอายุเกิน 6 ชม...');
  
  const { error } = await supabase
    .from('checkpoints')
    .delete()
    .eq('status', 'cleared')
    .lt('reported_timestamp', cutoffTime);

  if (error) {
    console.error('❌ ล้างข้อมูลไม่สำเร็จ:', error.message);
  } else {
    console.log('✅ ทำความสะอาดฐานข้อมูลเรียบร้อย ไร้ด่านผีค้าง!');
  }
}

const command = process.argv[2] || 'seed';

if (command === 'seed') {
  seedCheckpoints();
} else if (command === 'clean') {
  cleanOldCheckpoints();
} else {
  console.log('คำสั่งที่รองรับ: node scripts/ai-checkpoint-manager.mjs [seed|clean]');
}
