"use client";

import { useActionState, useState, useTransition } from "react";
import { addProgress, updateProgressStatus, deleteProgress } from "@/app/actions/progress";

type SessionData = { userId: number; role: string; name: string };
type ProgressEntry = {
  id: number;
  subject: string;
  topic: string;
  status: string;
  note: string | null;
  updatedAt: Date;
};
type Student = {
  id: number;
  name: string;
  school: string;
  grade: number;
  phone: string;
  progress: ProgressEntry[];
};

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: "미시작",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
};
const STATUS_COLOR: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-600 border-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
};
const STATUS_CYCLE: Record<string, string> = {
  NOT_STARTED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: "NOT_STARTED",
};

function groupBySchool(students: Student[]) {
  const map: Record<string, Student[]> = {};
  for (const s of students) {
    if (!map[s.school]) map[s.school] = [];
    map[s.school].push(s);
  }
  return map;
}

function ProgressBadge({ entry }: { entry: ProgressEntry }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-start gap-2 p-2.5 bg-gray-50 rounded-lg group">
      <button
        onClick={() =>
          startTransition(() => updateProgressStatus(entry.id, STATUS_CYCLE[entry.status]))
        }
        disabled={isPending}
        className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-xs font-semibold border cursor-pointer transition-opacity disabled:opacity-50 ${STATUS_COLOR[entry.status]}`}
      >
        {STATUS_LABEL[entry.status]}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">
          <span className="text-gray-400 mr-1">[{entry.subject}]</span>
          {entry.topic}
        </p>
        {entry.note && <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>}
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(entry.updatedAt).toLocaleDateString("ko-KR")}
        </p>
      </div>
      <button
        onClick={() => startTransition(() => deleteProgress(entry.id))}
        disabled={isPending}
        className="shrink-0 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30 text-sm"
      >
        ✕
      </button>
    </div>
  );
}

function StudentProgressCard({ student }: { student: Student }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addState, addAction, addPending] = useActionState(addProgress, undefined);

  const completed = student.progress.filter((p) => p.status === "COMPLETED").length;
  const total = student.progress.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">{student.name}</span>
          <span className="text-xs text-gray-500">{student.grade}학년</span>
          {total > 0 && (
            <span className="text-xs text-gray-400">
              {completed}/{total} 완료
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 space-y-3">
          {student.progress.length === 0 ? (
            <p className="text-sm text-gray-400">등록된 진도가 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {student.progress.map((entry) => (
                <ProgressBadge key={entry.id} entry={entry} />
              ))}
            </div>
          )}

          {showAdd ? (
            <form action={addAction} className="space-y-2 pt-1">
              <input type="hidden" name="studentId" value={student.id} />
              <div className="flex gap-2">
                <input
                  name="subject"
                  type="text"
                  required
                  placeholder="과목 (수학, 영어...)"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="status"
                  className="border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NOT_STARTED">미시작</option>
                  <option value="IN_PROGRESS">진행중</option>
                  <option value="COMPLETED">완료</option>
                </select>
              </div>
              <input
                name="topic"
                type="text"
                required
                placeholder="단원/주제 (예: 2학기 1단원)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="note"
                type="text"
                placeholder="메모 (선택)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {addState?.error && (
                <p className="text-xs text-red-600">{addState.error}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addPending}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {addPending ? "저장..." : "추가"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              + 진도 추가
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProgressClient({
  students,
}: {
  session: SessionData;
  students: Student[];
}) {
  const [query, setQuery] = useState("");
  const [openSchools, setOpenSchools] = useState<Record<string, boolean>>({});

  const filtered = students.filter(
    (s) => s.name.includes(query) || s.school.includes(query)
  );
  const grouped = groupBySchool(filtered);
  const schools = Object.keys(grouped).sort();

  function toggleSchool(school: string) {
    setOpenSchools((prev) => ({ ...prev, [school]: !prev[school] }));
  }

  return (
    <main className="p-4 sm:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">진도 관리</h1>
        <p className="text-sm text-gray-500 mt-1">학교별로 학생 진도를 확인하고 관리합니다.</p>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="학생 이름 또는 학교 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {schools.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          {query ? "검색 결과가 없습니다." : "등록된 학생이 없습니다."}
        </div>
      ) : (
        <div className="space-y-4">
          {schools.map((school) => {
            const schoolStudents = grouped[school];
            const isOpen = openSchools[school] !== false;
            const totalProgress = schoolStudents.reduce((sum, s) => sum + s.progress.length, 0);
            const completedProgress = schoolStudents.reduce(
              (sum, s) => sum + s.progress.filter((p) => p.status === "COMPLETED").length,
              0
            );

            return (
              <div key={school} className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSchool(school)}
                  className="w-full px-5 py-4 bg-slate-800 text-white flex items-center justify-between hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base">{school}</span>
                    <span className="text-slate-400 text-sm">{schoolStudents.length}명</span>
                    {totalProgress > 0 && (
                      <span className="text-slate-300 text-xs">
                        진도 {completedProgress}/{totalProgress} 완료
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="p-4 bg-gray-50 space-y-3">
                    {schoolStudents.map((student) => (
                      <StudentProgressCard key={student.id} student={student} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
