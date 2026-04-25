"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/prisma";
import { getSession } from "@/app/lib/session";

type ActionState = { error?: string; success?: string } | undefined;

export async function addProgress(state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "인증이 필요합니다." };

  const studentId = parseInt(formData.get("studentId") as string);
  const subject = (formData.get("subject") as string)?.trim();
  const topic = (formData.get("topic") as string)?.trim();
  const status = (formData.get("status") as string) || "NOT_STARTED";
  const note = (formData.get("note") as string)?.trim() || null;

  if (!studentId || !subject || !topic) return { error: "과목과 단원을 입력해주세요." };

  await prisma.progress.create({ data: { studentId, subject, topic, status, note } });
  revalidatePath("/progress");
  return { success: "진도가 추가되었습니다." };
}

export async function updateProgressStatus(progressId: number, status: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.progress.update({ where: { id: progressId }, data: { status } });
  revalidatePath("/progress");
}

export async function deleteProgress(progressId: number) {
  const session = await getSession();
  if (!session) return;

  await prisma.progress.delete({ where: { id: progressId } });
  revalidatePath("/progress");
}
