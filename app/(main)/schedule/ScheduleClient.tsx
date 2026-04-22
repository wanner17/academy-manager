"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { createSchedule, deleteSchedule } from "@/app/actions/schedule";

type SessionData = { userId: number; role: string; name: string };
type Teacher = { id: number; name: string };
type Schedule = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  room: string | null;
  teacher: Teacher;
};

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}

export default function ScheduleClient({
  session,
  schedules,
  teachers,
  monday,
}: {
  session: SessionData;
  schedules: Schedule[];
  teachers: Teacher[];
  monday: string;
}) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [state, action, pending] = useActionState(createSchedule, undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const mondayDate = new Date(monday);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  function navigate(offset: number) {
    const d = new Date(mondayDate);
    d.setDate(d.getDate() + offset * 7);
    router.push(`/schedule?week=${d.toISOString().split("T")[0]}`);
  }

  function goToday() {
    router.push("/schedule");
  }

  function getSchedulesForDay(dayDate: Date) {
    return schedules.filter((s) => {
      const sd = new Date(s.start);
      return (
        sd.getFullYear() === dayDate.getFullYear() &&
        sd.getMonth() === dayDate.getMonth() &&
        sd.getDate() === dayDate.getDate()
      );
    });
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    await deleteSchedule(id);
    setDeletingId(null);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">주간 일정표</h1>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            오늘
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ‹ 이전
          </button>
          <button
            onClick={() => navigate(1)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            다음 ›
          </button>
          {session.role === "TEACHER" && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              + 일정 추가
            </button>
          )}
        </div>
      </div>

      {/* 주간 그리드 */}
      <div className="grid grid-cols-7 gap-3">
        {weekDates.map((date, i) => {
          const isToday = date.getTime() === today.getTime();
          const daySchedules = getSchedulesForDay(date);
          return (
            <div key={i} className="flex flex-col">
              <div
                className={`text-center py-2 mb-2 rounded-lg text-sm font-semibold ${
                  isToday
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <div>{DAYS[i]}</div>
                <div className={`text-xs font-normal mt-0.5 ${isToday ? "text-blue-100" : "text-gray-400"}`}>
                  {formatDate(date)}
                </div>
              </div>
              <div className="space-y-2 min-h-32">
                {daySchedules.map((s) => (
                  <div
                    key={s.id}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs group relative"
                  >
                    <p className="font-semibold text-blue-800 truncate">{s.title}</p>
                    <p className="text-blue-600 mt-0.5">
                      {formatTime(s.start)} – {formatTime(s.end)}
                    </p>
                    {s.room && <p className="text-blue-500 truncate">{s.room}</p>}
                    <p className="text-blue-400 truncate">{s.teacher.name}</p>
                    {session.role === "TEACHER" && (
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-blue-300 hover:text-red-500 transition-all text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 일정 추가 모달 */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">일정 추가</h3>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">수업명</label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="수학 기초반"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">시작</label>
                    <input
                      name="start"
                      type="datetime-local"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">종료</label>
                    <input
                      name="end"
                      type="datetime-local"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">강의실 (선택)</label>
                  <input
                    name="room"
                    type="text"
                    placeholder="1강의실"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">담당 강사</label>
                  <select
                    name="teacherId"
                    defaultValue={session.userId}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
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
