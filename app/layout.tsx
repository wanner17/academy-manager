import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "학원 관리 시스템",
  description: "강사와 조교를 위한 비동기식 학원 운영 관리 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex bg-gray-50 text-gray-900">
        {/* 공통 사이드바 네비게이션 */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
          <div className="p-6 text-xl font-bold border-b border-slate-800 tracking-tight">
            학원 관리 시스템
          </div>
          <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
            <Link href="/" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              대시보드
            </Link>
            <Link href="/students" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              학생 관리
            </Link>
            <Link href="/schedule" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              주간 일정표
            </Link>
            <Link href="/todo" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              업무 체크리스트
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 text-center">
            © 2024 Academy Manager
          </div>
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
          {children}
        </div>
      </body>
    </html>
  );
}
