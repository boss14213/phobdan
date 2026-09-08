import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07090e',
};

export const metadata: Metadata = {
  title: 'พบด่าน (PhobDan) — สังคมขับขี่ปลอดภัย ปักหมุดสดรอบเมือง',
  description: 'เว็บแอปชุมชนผู้ขับขี่ช่วยกันรายงานจุดตรวจ สวมหมวก เมาไม่ขับ มีวินัยจราจร',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'พบด่าน',
  },
  formatDetection: {
    telephone: true,
  },
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
