import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/prisma";
import TodoClient from "./TodoClient";

export default async function TodoPage() {
  const session = await getSession();
  if (!session) redirect("/login");

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

  const [todos, users] = await Promise.all([
    prisma.todo.findMany({
      where: todoWhere,
      include: { assignedTo: { select: { id: true, name: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    session.role === "TEACHER"
      ? prisma.user.findMany({
          select: { id: true, name: true, role: true },
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]),
  ]);

  return <TodoClient session={session} todos={todos} users={users} />;
}
