# 🤖 คู่มือการเปิดโปรเจกต์ใน Android Studio และเตรียมนำขึ้น Google Play Store
## แอปพลิเคชัน: พบด่าน (PhobDan) — Night Patrol Radar

โปรเจกต์ Android Native ถูกสร้างและกำหนดค่าเรียบร้อยแล้วอยู่ที่โฟลเดอร์:
📂 **`d:\WebDev\android`**

---

## 📱 สเปกและการตั้งค่าของโปรเจกต์ (Technical Specifications)

- **Application ID (Package Name):** `com.phobdan.app`
- **Application Name:** `พบด่าน`
- **Compile SDK / Target SDK:** `Android 14 (API 34+) / Android 15 (API 36)` *(ผ่านเกณฑ์ข้อบังคับล่าสุดของ Google Play Console 100%)*
- **Minimum SDK:** `Android 7.0 (API 24)` *(ครอบคลุมอุปกรณ์ Android มากกว่า 95% ทั่วโลก)*
- **Live Server Integration:** เชื่อมต่อกับ `https://phobdan.vercel.app`
  > **จุดเด่น:** เมื่อคุณแก้ไขฟีเจอร์ ปรับ UX/UI หรือเพิ่มฟังก์ชันใหม่ในโปรเจกต์เว็บและ Push ขึ้น Vercel แอปพลิเคชันในมือถือ Android ของผู้ใช้ทุกคนจะ**อัปเดตเวอร์ชันล่าสุดทันทีโดยไม่ต้อง Build APK ใหม่ หรือรอ Google Play Store ตรวจสอบทุกครั้ง (Over-The-Air Instant Updates)**

- **สิทธิ์การเข้าถึง (Permissions) ใน `AndroidManifest.xml`:**
  - `INTERNET`: รับส่งข้อมูลจุดตรวจแบบเรียลไทม์ผ่าน Supabase
  - `ACCESS_FINE_LOCATION`: ดึงพิกัด GPS แม่นยำสูงสำหรับเรดาร์และแผนที่
  - `ACCESS_COARSE_LOCATION`: พิกัดดาวเทียมระดับเสาสัญญาณ
  - `ACCESS_NETWORK_STATE`: ตรวจสอบสถานะการเชื่อมต่ออินเทอร์เน็ต

---

## 🛠️ ขั้นตอนที่ 1: การเปิดโปรเจกต์ใน Android Studio

1. ดาวน์โหลดและติดตั้ง [Android Studio](https://developer.android.com/studio) (หากยังไม่มี)
2. เปิดโปรแกรม **Android Studio**
3. ที่หน้าต้อนรับ เลือกคลิก **"Open"** (หรือเมนู `File > Open...`)
4. เบราว์สไปที่โฟลเดอร์:
   ```
   d:\WebDev\android
   ```
5. คลิก **OK** ➔ Android Studio จะทำการโหลดและเริ่มดาวน์โหลด Gradle Dependencies อัตโนมัติ (รอแถบด้านล่างทำงานจนเสร็จ)

---

## 📲 ขั้นตอนที่ 2: วิธีรันแอปบนมือถือ Android จริง (USB Debugging)

1. บนมือถือ Android เข้าไปที่ **การตั้งค่า (Settings)** ➔ **เกี่ยวกับโทรศัพท์ (About phone)** ➔ แตะที่ **หมายเลขบิลด์ (Build number)** ติดกัน 7 ครั้ง เพื่อเปิดโหมดนักพัฒนา
2. เข้าไปที่ **ตัวเลือกสำหรับนักพัฒนา (Developer options)** ➔ เปิดสวิตช์ **การแก้ไขข้อบกพร่อง USB (USB debugging)**
3. นำสาย USB เชื่อมต่อมือถือเข้ากับคอมพิวเตอร์ (กดอนุญาต Allow บนจอมือถือ)
4. ใน Android Studio ที่แถบเครื่องมือด้านบน จะมองเห็นชื่อรุ่นมือถือของคุณปรากฏขึ้น
5. กดปุ่ม **Run 'app' (ปุ่มสามเหลี่ยมสีเขียว ▶)**
6. แอป "พบด่าน" จะถูกคอมไพล์และติดตั้งลงบนมือถือของคุณทันที!

---

## 📦 ขั้นตอนที่ 3: สร้างไฟล์ `.apk` สำหรับแจกให้คนทดสอบติดตั้งเองทันที

หากต้องการส่งไฟล์ให้เพื่อนทดลองติดตั้งลงเครื่องโดยตรง:
1. ใน Android Studio ไปที่เมนูด้านบน:
   ```
   Build ➔ Build App Bundle(s) / APK(s) ➔ Build APK(s)
   ```
2. เมื่อเสร็จจะมีข้อความแจ้งเตือนที่มุมขวาล่าง ให้คลิกคำว่า **"locate"**
3. คุณจะได้ไฟล์ `app-debug.apk` สามารถส่งผ่าน LINE, Google Drive หรือบลูทูธ เพื่อติดตั้งลงเครื่อง Android ได้ทันที

---

## 🚀 ขั้นตอนที่ 4: สร้างไฟล์ `.aab` (App Bundle) สำหรับส่งขึ้น Google Play Store

Google Play Store กำหนดให้ใช้ไฟล์ฟอร์แมต **`.aab` (Android App Bundle)** พร้อมการลงนามด้วยคีย์ความปลอดภัย (Signed Key):

### 4.1 สร้าง Keystore (กุญแจดิจิทัล)
เปิด Terminal หรือ Command Prompt แล้วรันคำสั่ง:
```bash
keytool -genkey -v -keystore phobdan-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias phobdan
```
*(ระบบจะให้ตั้งรหัสผ่านและกรอกชื่อผู้พัฒนา — แนะนำให้จดบันทึกรหัสผ่านและเก็บไฟล์ `.jks` ไว้ในที่ปลอดภัย)*

### 4.2 ทำการ Generate Signed Bundle ใน Android Studio
1. ไปที่เมนู:
   ```
   Build ➔ Generate Signed Bundle / APK...
   ```
2. เลือกตัวเลือก **Android App Bundle** ➔ คลิก **Next**
3. ที่ช่อง **Key store path** ให้เลือกไฟล์ `phobdan-release-key.jks` ที่สร้างไว้
4. กรอกรหัสผ่าน Key store และ Key alias
5. เลือก Destination Folder และเลือก Build Variants เป็น **`release`**
6. คลิก **Finish**
7. คุณจะได้ไฟล์ **`app-release.aab`** สำหรับนำไปอัปโหลดขึ้น Google Play Console ทันที!

---

## 📋 ขั้นตอนที่ 5: เช็คลิสต์การส่งแอปขึ้น Google Play Console

1. **สมัครบัญชี Google Play Console:** มีค่าธรรมเนียมครั้งเดียว $25 USD (ตลอดชีพ) ที่ [play.google.com/console](https://play.google.com/console)
2. **สร้างแอปใหม่ (Create App):**
   - App name: `พบด่าน - Night Patrol Radar`
   - Default language: `Thai (th)`
   - Free or Paid: `Free`
3. **กรอกข้อมูลความปลอดภัยของข้อมูล (Data Safety):**
   - Data collection: มีการเข้าถึง Location (พิกัดตำแหน่ง) เพื่อนำมาประมวลผลเรดาร์ระยะห่างของจุดตรวจรอบตัวแบบเรียลไทม์
   - Data sharing: ไม่มีการส่งต่อข้อมูลส่วนบุคคลหรือขายข้อมูลให้บุคคลที่สาม
4. **นโยบายความเป็นส่วนตัว (Privacy Policy):**
   - ใส่ URL หน้าเว็บ เช่น `https://phobdan.vercel.app`
5. **แคปเจอร์ภาพหน้าจอ (Screenshots):**
   - ใช้ภาพจากมือถืออย่างน้อย 4-5 รูป (ภาพหน้าเรดาร์, ภาพแผนที่จุดตรวจ, ภาพการปักหมุด, และภาพโหมดกลางคืน)
6. **อัปโหลดไฟล์ `app-release.aab`:**
   - อัปโหลดในส่วน **Production release** หรือ **Internal testing** แล้วกดส่งตรวจ (Review)

---

## 🔄 คำสั่งสำหรับอัปเดตและซิงก์โปรเจกต์ในอนาคต

เมื่อมีการเปลี่ยนแปลงแพ็กเกจหรือต้องการซิงก์การตั้งค่าใหม่อีกครั้ง สามารถรันคำสั่งนี้ได้ตลอดเวลาจากโฟลเดอร์หลัก `d:\WebDev`:
```bash
npx cap sync android
```
