"use client";

import { useActionState } from "react";
import { setupFirstTeacher } from "@/app/actions/auth";

export default function SetupPage() {
  const [state, action, pending] = useActionState(setupFirstTeacher, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">초기 설정</h1>
          <p className="text-slate-400 text-sm mt-1">첫 번째 강사(관리자) 계정을 생성합니다</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="홍길동"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="teacher@academy.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {pending ? "생성 중..." : "강사 계정 생성"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">
            <a href="/login" className="text-blue-600 hover:underline">
              로그인으로 돌아가기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
