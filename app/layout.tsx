import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'พบด่าน (PhobDan) — สังคมขับขี่ปลอดภัย ปักหมุดสดรอบเมือง',
  description: 'เว็บแอปชุมชนผู้ขับขี่ช่วยกันรายงานจุดตรวจ สวมหมวก เมาไม่ขับ มีวินัยจราจร',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='th' className='dark'>
      <body className='bg-[#090b10] text-slate-100 antialiased selection:bg-red-600 selection:text-white'>
        {children}
      </body>
    </html>
  );
}
