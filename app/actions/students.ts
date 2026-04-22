"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/prisma";
import { getSession } from "@/app/lib/session";

type ActionState = { error?: string; success?: string } | undefined;

export async function createStudent(state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "인증이 필요합니다." };

  const name = formData.get("name") as string;
  const school = formData.get("school") as string;
  const gradeStr = formData.get("grade") as string;
  const phone = formData.get("phone") as string;

  if (!name || !school || !gradeStr || !phone) return { error: "모든 항목을 입력해주세요." };

  const grade = parseInt(gradeStr);
  if (isNaN(grade) || grade < 1) return { error: "학년을 올바르게 입력해주세요." };

  await prisma.student.create({ data: { name, school, grade, phone } });
  revalidatePath("/students");
  return { success: `${name} 학생이 등록되었습니다.` };
}

export async function addConsultLog(state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: "인증이 필요합니다." };

  const studentId = parseInt(formData.get("studentId") as string);
  const content = formData.get("content") as string;

  if (!studentId || !content) return { error: "내용을 입력해주세요." };

  await prisma.consultLog.create({ data: { studentId, content } });
  revalidatePath("/students");
  return { success: "상담 기록이 추가되었습니다." };
}
