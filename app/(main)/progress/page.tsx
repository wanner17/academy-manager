import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/prisma";
import ProgressClient from "./ProgressClient";

export default async function ProgressPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const students = await prisma.student.findMany({
    include: {
      progress: { orderBy: [{ subject: "asc" }, { updatedAt: "desc" }] },
    },
    orderBy: [{ school: "asc" }, { grade: "asc" }, { name: "asc" }],
  });

  return <ProgressClient session={session} students={students} />;
}
