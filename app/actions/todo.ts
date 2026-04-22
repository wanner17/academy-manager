"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/prisma";
import { getSession } from "@/app/lib/session";

type ActionState = { error?: string; success?: string } | undefined;

export async function createTodo(state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "권한이 없습니다." };

  const content = formData.get("content") as string;
  const detail = formData.get("detail") as string | null;
  const category = formData.get("category") as string;
  const assignedToIdStr = formData.get("assignedToId") as string;
  const assignedToId = assignedToIdStr ? parseInt(assignedToIdStr) : null;

  if (!content || !category) return { error: "제목과 분류를 입력해주세요." };
  if (!["COMMON", "TEACHER", "ASSISTANT"].includes(category)) return { error: "올바른 분류를 선택해주세요." };

  await prisma.todo.create({
    data: { content, detail: detail || null, category, assignedToId: assignedToId || null, updatedBy: session.name },
  });

  revalidatePath("/todo");
  revalidatePath("/");
  return { success: "업무가 추가되었습니다." };
}

export async function toggleTodo(id: number) {
  const session = await getSession();
  if (!session) return;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return;

  await prisma.todo.update({
    where: { id },
    data: { isCompleted: !todo.isCompleted, updatedBy: session.name },
  });

  revalidatePath("/todo");
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return;

  await prisma.todo.delete({ where: { id } });
  revalidatePath("/todo");
  revalidatePath("/");
}
