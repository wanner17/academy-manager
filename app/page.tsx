import { prisma } from "./prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // DB에서 Todo 항목들을 불러옵니다. (최신 수정 순으로 정렬)
  const todos = await prisma.todo.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // 상호작용(상태 관리)이 필요한 UI는 클라이언트 컴포넌트로 분리하여 데이터를 전달합니다.
  return <DashboardClient initialTodos={todos} />;
}