"use client";

import { useActionState, useState, useTransition } from "react";
import { createTodo, toggleTodo, deleteTodo } from "@/app/actions/todo";

type SessionData = { userId: number; role: string; name: string };
type User = { id: number; name: string; role: string };
type Todo = {
  id: number;
  content: string;
  detail: string | null;
  isCompleted: boolean;
  category: string;
  updatedBy: string | null;
  updatedAt: Date;
  assignedTo: { id: number; name: string } | null;
};

const CATEGORY_LABEL: Record<string, string> = {
  COMMON: "전체",
  TEACHER: "강사",
  ASSISTANT: "조교",
};
const CATEGORY_COLOR: Record<string, string> = {
  COMMON: "bg-gray-100 text-gray-700 border-gray-200",
  TEACHER: "bg-purple-100 text-purple-700 border-purple-200",
  ASSISTANT: "bg-blue-100 text-blue-700 border-blue-200",
};

type Filter = "all" | "pending" | "completed";

export default function TodoClient({
  session,
  todos,
  users,
}: {
  session: SessionData;
  todos: Todo[];
  users: User[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [state, action, pending] = useActionState(createTodo, undefined);
  const [, startTransition] = useTransition();

  const filtered = todos.filter((t) => {
    if (filter === "pending") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  const pendingCount = todos.filter((t) => !t.isCompleted).length;
  const completedCount = todos.filter((t) => t.isCompleted).length;

  function handleToggle(id: number) {
    startTransition(async () => {
      await toggleTodo(id);
    });
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteTodo(id);
    });
  }

  return (
    <main className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">업무 체크리스트</h1>
          <p className="text-sm text-gray-500 mt-1">
            미완료 {pendingCount}건 · 완료 {completedCount}건
          </p>
        </div>
        {session.role === "TEACHER" && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            + 새 업무
          </button>
        )}
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {(["all", "pending", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f === "all" ? "전체" : f === "pending" ? "미완료" : "완료"}
          </button>
        ))}
      </div>

      {/* 투두 목록 */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            {filter === "all" ? "등록된 업무가 없습니다." : filter === "pending" ? "미완료 업무가 없습니다." : "완료된 업무가 없습니다."}
          </div>
        ) : (
          filtered.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start gap-3 p-4 bg-white rounded-xl border transition-colors ${
                todo.isCompleted ? "border-gray-100 opacity-60" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => handleToggle(todo.id)}
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  todo.isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {todo.isCompleted && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedTodo(todo)}>
                <p className={`text-sm text-gray-800 ${todo.isCompleted ? "line-through text-gray-400" : ""}`}>
                  {todo.content}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${CATEGORY_COLOR[todo.category]}`}>
                    {CATEGORY_LABEL[todo.category]}
                  </span>
                  {todo.assignedTo && (
                    <span className="text-xs text-gray-400">→ {todo.assignedTo.name}</span>
                  )}
                  {todo.updatedBy && (
                    <span className="text-xs text-gray-400">
                      {new Date(todo.updatedAt).toLocaleDateString("ko-KR")} · {todo.updatedBy}
                    </span>
                  )}
                </div>
              </div>
              {session.role === "TEACHER" && (
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors text-sm shrink-0"
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* 상세 보기 모달 */}
      {selectedTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedTodo(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">업무 상세</h3>
              <button onClick={() => setSelectedTodo(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1">제목</p>
                <p className={`text-base font-semibold text-gray-900 ${selectedTodo.isCompleted ? "line-through text-gray-400" : ""}`}>{selectedTodo.content}</p>
              </div>
              {selectedTodo.detail && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-1">상세 내용</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedTodo.detail}</p>
                </div>
              )}
              <div className="flex gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${CATEGORY_COLOR[selectedTodo.category]}`}>
                  {CATEGORY_LABEL[selectedTodo.category]}
                </span>
                {selectedTodo.assignedTo && (
                  <span className="text-xs text-gray-500">→ {selectedTodo.assignedTo.name}</span>
                )}
              </div>
              <div className="flex gap-4 text-sm text-gray-500 pt-2 border-t border-gray-100">
                <span>작성: {selectedTodo.updatedBy || "미지정"}</span>
                <span>{new Date(selectedTodo.updatedAt).toLocaleDateString("ko-KR")}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 업무 추가 모달 */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">새 업무 추가</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form action={action}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">제목</label>
                  <input
                    name="content"
                    type="text"
                    required
                    placeholder="업무 제목을 입력하세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">상세 내용 (선택)</label>
                  <textarea
                    name="detail"
                    rows={3}
                    placeholder="상세 내용을 입력하세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    담당자 지정 (선택)
                  </label>
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
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {pending ? "추가 중..." : "추가"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
