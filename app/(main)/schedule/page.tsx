import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/prisma";
import ScheduleClient from "./ScheduleClient";

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { week } = await searchParams;
  const monday = week ? new Date(week) : getMonday(new Date());
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 7);

  const [schedules, teachers] = await Promise.all([
    prisma.schedule.findMany({
      where: { start: { gte: monday, lt: sunday } },
      include: { teacher: { select: { id: true, name: true } } },
      orderBy: { start: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "TEACHER" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <ScheduleClient
      session={session}
      schedules={schedules}
      teachers={teachers}
      monday={monday.toISOString()}
    />
  );
}
