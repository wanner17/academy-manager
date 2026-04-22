"use client";

import { useActionState, useState, useTransition } from "react";
import { createTodo, toggleTodo } from "@/app/actions/todo";
import type { SessionData } from "@/app/lib/session";

type Todo = {
  id: number;
  content: string;
  isCompleted: boolean;
  category: string;
  updatedBy: string | null;
  updatedAt: Date;
};

type StudentWithAttendance = {
  id: number;
  name: string;
  school: string;
  grade: number;
  phone: string;
  attendance: { id: number; status: string; date: Date }[];
};

const ATTENDANCE_LABEL: Record<string, { label: string; color: string }> = {
  PRESENT: { label: "출석", color: "bg-green-100 text-green-700 border-green-200" },
  ABSENT:  { label: "결석", color: "bg-red-100 text-red-700 border-red-200" },
  LATE:    { label: "지각", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
};

type User = { id: number; name: string; role: string };

export default function DashboardClient({
  session,
  todos,
  students,
  users,
}: {
  session: SessionData;
  todos: Todo[];
  students: StudentWithAttendance[];
  users: User[];
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [todoState, todoAction, todoPending] = useActionState(createTodo, undefined);
  const [, startTransition] = useTransition();
  const isTeacher = session.role === "TEACHER";

  function handleToggle(id: number) {
    startTransition(async () => { await toggleTodo(id); });
  }

  const pendingTodos = todos.filter((t) => !t.isCompleted);
  const completedTodos = todos.filter((t) => t.isCompleted);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">대시보드</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 할일 섹션 */}
        {isTeacher ? (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[440px]">
            <div className="bg-slate-900 p-5 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-white">업무 지시 현황</h2>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              >
                + 새 업무 지시
              </button>
            </div>
            <div className="p-5 space-y-6 overflow-y-auto flex-1 bg-slate-50">
              <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center justify-between border-b pb-2">
                  진행중
                  <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {pendingTodos.length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {pendingTodos.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">진행중인 업무가 없습니다.</p>
                  ) : (
                    pendingTodos.map((todo) => (
                      <div key={todo.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <input type="checkbox" className="mt-1 w-4 h-4 cursor-pointer" defaultChecked={false} onChange={() => handleToggle(todo.id)} />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{todo.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            담당: {todo.updatedBy || "미지정"} · {new Date(todo.updatedAt).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center justify-between border-b pb-2">
                  완료
                  <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                    {completedTodos.length}
                  </span>
                </h3>
                <div className="space-y-3 opacity-60">
                  {completedTodos.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">완료된 업무가 없습니다.</p>
                  ) : (
                    completedTodos.map((todo) => (
                      <div key={todo.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <input type="checkbox" className="mt-1 w-4 h-4 cursor-pointer" defaultChecked onChange={() => handleToggle(todo.id)} />
                        <p className="font-semibold text-gray-500 text-sm line-through">{todo.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[440px]">
            <div className="bg-blue-600 p-5 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                나의 오늘 할 일
                <span className="bg-blue-800 text-white text-xs px-2 py-0.5 rounded-full">
                  미완료 {pendingTodos.length}
                </span>
              </h2>
            </div>
            <div className="p-5 space-y-3 overflow-y-auto flex-1 bg-slate-50">
              {pendingTodos.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">오늘 할 일이 없습니다!</p>
              ) : (
                pendingTodos.map((todo) => (
                  <div key={todo.id} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 cursor-pointer" defaultChecked={false} onChange={() => handleToggle(todo.id)} />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{todo.content}</p>
                      <p className="text-xs text-gray-500 mt-1">담당: {todo.updatedBy || "미지정"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* 오늘 학생 리스트 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[440px]">
          <div className="p-5 flex justify-between items-center border-b border-gray-200 shrink-0">
            <h2 className="text-lg font-bold text-gray-800">오늘 학생 리스트</h2>
            <span className="text-sm text-gray-500">총 {students.length}명</span>
          </div>
          {students.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              등록된 학생이 없습니다.
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">이름</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">학교/학년</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">출결</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const att = student.attendance[0];
                    const statusInfo = att ? ATTENDANCE_LABEL[att.status] : null;
                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">{student.name}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {student.school} {student.grade}학년
                        </td>
                        <td className="px-4 py-3">
                          {statusInfo ? (
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-gray-100 text-gray-500 border-gray-200">
                              미기록
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* 새 업무 지시 모달 */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">새 업무 지시</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                &times;
              </button>
            </div>
            <form action={todoAction}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">업무 내용</label>
                  <textarea
                    name="content"
                    rows={3}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="지시할 업무 내용을 입력하세요..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">분류</label>
                  <select
                    name="category"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="COMMON">전체 (강사+조교)</option>
                    <option value="TEACHER">강사 전용</option>
                    <option value="ASSISTANT">조교 전용</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">담당자 지정 (선택)</label>
                  <select
                    name="assignedToId"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">지정 안 함</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role === "TEACHER" ? "강사" : "조교"})
                      </option>
                    ))}
                  </select>
                </div>
                {todoState?.error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{todoState.error}</p>
                )}
                {todoState?.success && (
                  <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{todoState.success}</p>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={todoPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {todoPending ? "저장 중..." : "지시하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
