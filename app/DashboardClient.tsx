"use client";

import { useState } from "react";

type Todo = {
  id: number;
  content: string;
  isCompleted: boolean;
  category: string;
  updatedBy: string | null;
  updatedAt: Date;
};

export default function DashboardClient({ initialTodos }: { initialTodos: Todo[] }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<"TEACHER" | "ASSISTANT">("TEACHER");

  // 상태 필터링
  const pendingTodos = initialTodos.filter((t) => !t.isCompleted);
  const completedTodos = initialTodos.filter((t) => t.isCompleted);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">대시보드</h1>
        
        {/* 권한 스위치 (UI 테스트용) */}
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setUserRole("TEACHER")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${userRole === "TEACHER" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            강사 뷰
          </button>
          <button
            onClick={() => setUserRole("ASSISTANT")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${userRole === "ASSISTANT" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
          >
            조교 뷰
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {userRole === "TEACHER" ? (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
            {/* 1. 강사 뷰: 전체 조교 업무 현황 (DB 연동) */}
            <div className="bg-slate-900 p-5 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                업무 지시 현황
              </h2>
              <button 
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                + 새 업무 지시
              </button>
            </div>
            <div className="p-5 space-y-6 overflow-y-auto flex-1 bg-slate-50">
              {/* 진행중인 업무 */}
              <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center justify-between border-b pb-2">
                  진행중인 업무 <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{pendingTodos.length}</span>
                </h3>
                <div className="space-y-3">
                  {pendingTodos.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">진행중인 업무가 없습니다.</p>
                  ) : (
                    pendingTodos.map(todo => (
                      <div key={todo.id} className="flex items-start gap-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600" defaultChecked={false} disabled />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">{todo.content}</p>
                          <p className="text-xs text-red-600 mt-1 font-medium">담당: {todo.updatedBy || "미지정"} | 최근 업데이트: {new Date(todo.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* 완료된 업무 */}
              <div>
                <h3 className="font-bold text-gray-700 mb-3 flex items-center justify-between border-b pb-2">
                  완료된 업무 <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{completedTodos.length}</span>
                </h3>
                <div className="space-y-3 opacity-60">
                  {completedTodos.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">완료된 업무가 없습니다.</p>
                  ) : (
                    completedTodos.map(todo => (
                      <div key={todo.id} className="flex items-start gap-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600" defaultChecked={true} disabled />
                        <div className="flex-1">
                          <p className="font-bold text-gray-500 text-sm line-through">{todo.content}</p>
                          <p className="text-xs text-gray-400 mt-1 font-medium">담당: {todo.updatedBy || "미지정"} | 완료: {new Date(todo.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
            {/* 1. 조교 뷰: 나의 오늘 할 일 (DB 연동) */}
            <div className="bg-blue-600 p-5 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                나의 오늘 할 일
                <span className="bg-blue-800 text-white text-xs px-2 py-0.5 rounded-full">미완료 {pendingTodos.length}</span>
              </h2>
            </div>
            <div className="p-5 space-y-3 overflow-y-auto flex-1 bg-slate-50">
              {pendingTodos.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">오늘 할 일이 없습니다! 🎉</p>
              ) : (
                pendingTodos.map(todo => (
                  <div key={todo.id} className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-base">{todo.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded"><span className="text-xs">상태:</span> 진행중</span>
                        <span className="text-xs">담당자: {todo.updatedBy || "미지정"}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* 2. 학생 관리: 요주의/상담 필요 학생 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
          <div className="bg-white p-5 flex justify-between items-center border-b border-gray-200 shrink-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">요주의 학생 알림</h2>
            <a href="/students" className="text-sm text-blue-600 font-medium hover:underline flex items-center">전체 학생 보기 &rarr;</a>
          </div>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 w-1/4">박지민 <span className="text-xs font-normal text-gray-500 ml-1 block mt-0.5">A중 2</span></td>
                  <td className="p-4 w-1/4"><span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md font-semibold text-xs border border-red-200">연속 2회 결석</span></td>
                  <td className="p-4 text-gray-500 w-1/4">최근 상담<br/><span className="font-medium text-gray-700">1달 전</span></td>
                  <td className="p-4 text-right w-1/4"><button className="text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors text-xs">상담 추가</button></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 w-1/4">최우진 <span className="text-xs font-normal text-gray-500 ml-1 block mt-0.5">B고 1</span></td>
                  <td className="p-4 w-1/4"><span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-md font-semibold text-xs border border-yellow-200">성적 하락</span></td>
                  <td className="p-4 text-gray-500 w-1/4">최근 상담<br/><span className="font-medium text-gray-700">2주 전</span></td>
                  <td className="p-4 text-right w-1/4"><button className="text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors text-xs">상담 추가</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 새 업무 지시 모달 */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">새 업무 지시</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">업무 내용</label>
                <textarea 
                  rows={3} 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                  placeholder="지시할 업무 내용을 상세히 입력하세요..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">담당 조교 지정</label>
                <select className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="">담당자를 선택해주세요</option>
                  <option value="assistant_a">조교 A (월,수,금)</option>
                  <option value="assistant_b">조교 B (화,목)</option>
                  <option value="assistant_c">조교 C (주말)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">기한 (마감 일시)</label>
                <input 
                  type="datetime-local" 
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setIsTaskModalOpen(false)} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={() => setIsTaskModalOpen(false)} 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                지시하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}