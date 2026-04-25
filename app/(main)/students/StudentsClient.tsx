"use client";

import { useActionState, useState } from "react";
import { createStudent, addConsultLog } from "@/app/actions/students";

type SessionData = { userId: number; role: string; name: string };

type ConsultLog = { id: number; content: string; createdAt: Date };
type Attendance = { id: number; date: Date; status: string };
type Student = {
  id: number;
  name: string;
  school: string;
  grade: number;
  phone: string;
  logs: ConsultLog[];
  attendance: Attendance[];
};

const STATUS_LABEL: Record<string, string> = {
  PRESENT: "출석",
  ABSENT: "결석",
  LATE: "지각",
};
const STATUS_COLOR: Record<string, string> = {
  PRESENT: "bg-green-100 text-green-700 border-green-200",
  ABSENT: "bg-red-100 text-red-700 border-red-200",
  LATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function StudentsClient({
  session,
  students,
}: {
  session: SessionData;
  students: Student[];
}) {
  const [query, setQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const [addState, addAction, addPending] = useActionState(createStudent, undefined);
  const [logState, logAction, logPending] = useActionState(addConsultLog, undefined);
  const filtered = students.filter(
    (s) =>
      s.name.includes(query) ||
      s.school.includes(query) ||
      s.phone.includes(query)
  );

  return (
    <main className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">학생 관리</h1>
          <p className="text-sm text-gray-500 mt-1">등록된 학생 정보를 관리합니다.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          + 학생 등록
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="이름, 학교, 연락처 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 데스크톱 테이블 */}
      <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">이름</th>
              <th className="px-6 py-4 font-semibold text-gray-600">학교</th>
              <th className="px-6 py-4 font-semibold text-gray-600">학년</th>
              <th className="px-6 py-4 font-semibold text-gray-600">연락처</th>
              <th className="px-6 py-4 font-semibold text-gray-600">최근 상담</th>
              <th className="px-6 py-4 font-semibold text-gray-600">출결</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  등록된 학생이 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((student) => {
                const lastLog = student.logs[0];
                const lastAttendance = student.attendance[0];
                return (
                  <tr
                    key={student.id}
                    onClick={() => setSelected(student)}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-gray-600">{student.school}</td>
                    <td className="px-6 py-4 text-gray-600">{student.grade}학년</td>
                    <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {lastLog
                        ? new Date(lastLog.createdAt).toLocaleDateString("ko-KR")
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      {lastAttendance ? (
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_COLOR[lastAttendance.status]}`}>
                          {STATUS_LABEL[lastAttendance.status]}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 목록 */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
            등록된 학생이 없습니다.
          </div>
        ) : (
          filtered.map((student) => {
            const lastLog = student.logs[0];
            const lastAttendance = student.attendance[0];
            return (
              <div
                key={student.id}
                onClick={() => setSelected(student)}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{student.school} {student.grade}학년 · {student.phone}</p>
                  {lastLog && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      상담: {new Date(lastLog.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  )}
                </div>
                <div className="ml-3 shrink-0">
                  {lastAttendance ? (
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_COLOR[lastAttendance.status]}`}>
                      {STATUS_LABEL[lastAttendance.status]}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">미기록</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 학생 등록 모달 */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">학생 등록</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form action={addAction}>
              <div className="p-6 space-y-4">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">학교</label>
                  <input
                    name="school"
                    type="text"
                    required
                    placeholder="○○고등학교"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">학년</label>
                  <input
                    name="grade"
                    type="number"
                    required
                    min={1}
                    max={6}
                    placeholder="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">연락처</label>
                  <input
                    name="phone"
                    type="text"
                    required
                    placeholder="010-0000-0000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {addState?.error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{addState.error}</p>
                )}
                {addState?.success && (
                  <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{addState.success}</p>
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
                  disabled={addPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {addPending ? "등록 중..." : "등록"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 학생 상세 모달 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                <p className="text-sm text-gray-500">
                  {selected.school} · {selected.grade}학년 · {selected.phone}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 출결 기록 */}
              <section>
                <h4 className="text-sm font-bold text-gray-700 mb-3">출결 기록 (최근 30건)</h4>
                {selected.attendance.length === 0 ? (
                  <p className="text-sm text-gray-400">출결 기록이 없습니다.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selected.attendance.map((a) => (
                      <div key={a.id} className="flex items-center gap-1.5 text-xs">
                        <span className="text-gray-500">
                          {new Date(a.date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-semibold border ${STATUS_COLOR[a.status]}`}>
                          {STATUS_LABEL[a.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* 상담 기록 추가 */}
              <section>
                <h4 className="text-sm font-bold text-gray-700 mb-3">상담 기록 추가</h4>
                <form action={logAction} className="flex gap-2">
                  <input type="hidden" name="studentId" value={selected.id} />
                  <input
                    name="content"
                    type="text"
                    required
                    placeholder="상담 내용을 입력하세요..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={logPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors shrink-0"
                  >
                    {logPending ? "저장..." : "추가"}
                  </button>
                </form>
                {logState?.error && (
                  <p className="text-sm text-red-600 mt-1">{logState.error}</p>
                )}
                {logState?.success && (
                  <p className="text-sm text-green-600 mt-1">{logState.success}</p>
                )}
              </section>

              {/* 상담 기록 목록 */}
              <section>
                <h4 className="text-sm font-bold text-gray-700 mb-3">
                  상담 기록 ({selected.logs.length}건)
                </h4>
                {selected.logs.length === 0 ? (
                  <p className="text-sm text-gray-400">상담 기록이 없습니다.</p>
                ) : (
                  <div className="space-y-2">
                    {selected.logs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-400 shrink-0 pt-0.5">
                          {new Date(log.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                        <p className="text-sm text-gray-700">{log.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
