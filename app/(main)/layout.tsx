import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import Sidebar from "./Sidebar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar session={session} />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}
