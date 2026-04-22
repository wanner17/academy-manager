import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { logout } from "@/app/actions/auth";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6 text-xl font-bold border-b border-slate-800 tracking-tight">
          학원 관리 시스템
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm font-medium">
          <Link href="/" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            대시보드
          </Link>
          <Link href="/students" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            학생 관리
          </Link>
          <Link href="/schedule" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            주간 일정표
          </Link>
          <Link href="/todo" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
            업무 체크리스트
          </Link>
          {session.role === "TEACHER" && (
            <Link href="/accounts" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
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
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">{children}</div>
    </div>
  );
}
