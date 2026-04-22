import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todoWhere =
    session.role === "TEACHER"
      ? {}
      : {
          OR: [
            { category: "COMMON" },
            { category: "ASSISTANT" },
            { assignedToId: session.userId },
          ],
        };

  const [todos, students, users] = await Promise.all([
    prisma.todo.findMany({
      where: todoWhere,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.student.findMany({
      include: {
        attendance: {
          where: { date: { gte: today, lt: tomorrow } },
        },
      },
      orderBy: { name: "asc" },
    }),
    session.role === "TEACHER"
      ? prisma.user.findMany({ select: { id: true, name: true, role: true }, orderBy: { name: "asc" } })
      : Promise.resolve([]),
  ]);

  return <DashboardClient session={session} todos={todos} students={students} users={users} />;
}
