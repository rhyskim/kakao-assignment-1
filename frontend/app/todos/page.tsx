import { Suspense } from "react";
import { getTodosAction } from "@/app/actions";
import TodosClient from "./todos-client";

// 날짜 포맷 (YYYY-MM-DD)
const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface TodosPageProps {
  searchParams: SearchParams;
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  const resolvedParams = await searchParams;
  
  // URL 쿼리 파라미터 파싱
  const date = (resolvedParams.date as string) || getTodayString();
  const filter = (resolvedParams.filter as string) || "all";
  const search = (resolvedParams.search as string) || "";

  // FastAPI 백엔드에서 데이터 조회 (Server Component Direct Fetching)
  const todos = await getTodosAction(date, filter, search);

  return (
    // useSearchParams()를 사용하는 하위 Client Component의 hydration 에러 방지용 Suspense
    // (로딩 스켈레톤은 loading.tsx가 Next.js 라우트 레벨에서 자동으로 처리)
    <Suspense fallback={null}>
      <TodosClient todos={todos} />
    </Suspense>
  );
}
