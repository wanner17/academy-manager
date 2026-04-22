"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/prisma";
import { getSession } from "@/app/lib/session";

type ActionState = { error?: string; success?: string } | undefined;

export async function createSchedule(state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "권한이 없습니다." };

  const title = formData.get("title") as string;
  const startStr = formData.get("start") as string;
  const endStr = formData.get("end") as string;
  const room = (formData.get("room") as string) || null;
  const teacherIdStr = formData.get("teacherId") as string;
  const teacherId = teacherIdStr ? parseInt(teacherIdStr) : session.userId;

  if (!title || !startStr || !endStr) return { error: "필수 항목을 입력해주세요." };

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (end <= start) return { error: "종료 시간이 시작 시간보다 늦어야 합니다." };

  await prisma.schedule.create({ data: { title, start, end, room, teacherId } });
  revalidatePath("/schedule");
  return { success: "일정이 추가되었습니다." };
}

export async function deleteSchedule(id: number) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return;

  await prisma.schedule.delete({ where: { id } });
  revalidatePath("/schedule");
}
