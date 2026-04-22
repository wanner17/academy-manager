"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/prisma";
import { hashPassword, verifyPassword } from "@/app/lib/password";
import { createSession, deleteSession, getSession } from "@/app/lib/session";

type ActionState = { error?: string; success?: string } | undefined;

export async function login(state: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "이메일과 비밀번호를 입력해주세요." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.password)) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  await createSession({ userId: user.id, role: user.role, name: user.name });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function createAccount(state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") return { error: "권한이 없습니다." };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role) return { error: "모든 항목을 입력해주세요." };
  if (!["TEACHER", "ASSISTANT"].includes(role)) return { error: "올바른 역할을 선택해주세요." };

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "이미 사용 중인 이메일입니다." };

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword(password),
      role,
      createdById: session.userId,
    },
  });

  revalidatePath("/accounts");
  return { success: `${name} 계정이 생성되었습니다.` };
}

export async function setupFirstTeacher(state: ActionState, formData: FormData): Promise<ActionState> {
  const count = await prisma.user.count();
  if (count > 0) return { error: "이미 계정이 존재합니다." };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "모든 항목을 입력해주세요." };

  await prisma.user.create({
    data: { name, email, password: hashPassword(password), role: "TEACHER" },
  });

  redirect("/login");
}
