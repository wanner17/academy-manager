"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm px-4 sm:px-0">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">학원 관리 시스템</h1>
          <p className="text-slate-400 text-sm mt-1">로그인하여 계속하세요</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="example@academy.com"
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
              {pending ? "로그인 중..." : "로그인"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-6">
            계정이 없으신가요?{" "}
            <a href="/setup" className="text-blue-600 hover:underline">
              초기 설정
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
