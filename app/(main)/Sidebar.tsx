"use client";

import Link from "next/link";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import type { SessionData } from "@/app/lib/session";

export default function Sidebar({ session }: { session: SessionData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-3 z-30 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        aria-label="메뉴 열기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-slate-900 text-white flex flex-col shadow-xl shrink-0
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 text-xl font-bold border-b border-slate-800 tracking-tight flex justify-between items-center">
          학원 관리 시스템
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            대시보드
          </Link>
          <Link href="/students" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            학생 관리
          </Link>
          <Link href="/progress" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            진도 관리
          </Link>
          <Link href="/schedule" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            주간 일정표
          </Link>
          <Link href="/todo" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            업무 체크리스트
          </Link>
          {session.role === "TEACHER" && (
            <Link href="/accounts" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              계정 관리
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">
            <p className="font-semibold text-slate-300">{session.name}</p>
            <p>{session.role === "TEACHER" ? "강사" : "조교"}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
