"use client";

import { useActionState, useState } from "react";
import { createAccount } from "@/app/actions/auth";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  createdBy: { name: string } | null;
};

export default function AccountsClient({ users }: { users: User[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, action, pending] = useActionState(createAccount, undefined);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">계정 관리</h1>
          <p className="text-sm text-gray-500 mt-1">강사 및 조교 계정을 관리합니다.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          + 새 계정 생성
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">이름</th>
              <th className="px-6 py-4 font-semibold text-gray-600">이메일</th>
              <th className="px-6 py-4 font-semibold text-gray-600">역할</th>
              <th className="px-6 py-4 font-semibold text-gray-600">생성자</th>
              <th className="px-6 py-4 font-semibold text-gray-600">생성일</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  등록된 계정이 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        user.role === "TEACHER"
                          ? "bg-purple-100 text-purple-700 border-purple-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      }`}
                    >
                      {user.role === "TEACHER" ? "강사" : "조교"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.createdBy?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 계정 생성 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">새 계정 생성</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form action={action}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">이름</label>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="홍길동"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="user@academy.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">임시 비밀번호</label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">역할</label>
                  <select
                    name="role"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="ASSISTANT">조교</option>
                    <option value="TEACHER">강사</option>
                  </select>
                </div>
                {state?.error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.error}</p>
                )}
                {state?.success && (
                  <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{state.success}</p>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {pending ? "생성 중..." : "계정 생성"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
