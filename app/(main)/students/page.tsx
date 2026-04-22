import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/prisma";
import StudentsClient from "./StudentsClient";

export default async function StudentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const students = await prisma.student.findMany({
    include: {
      logs: { orderBy: { createdAt: "desc" } },
      attendance: { orderBy: { date: "desc" }, take: 30 },
    },
    orderBy: { name: "asc" },
  });

  return <StudentsClient session={session} students={students} />;
}
