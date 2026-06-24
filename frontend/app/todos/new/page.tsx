import { Suspense } from "react";
import NewTodoClient from "./new-todo-client";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface NewTodoPageProps {
  searchParams: SearchParams;
}

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const resolvedParams = await searchParams;
  
  // 전달된 기본 날짜 파라미터 파싱 (없으면 오늘 날짜)
  const defaultDate = (resolvedParams.date as string) || new Date().toISOString().split("T")[0];

  return (
    <Suspense fallback={<div className="animate-pulse h-64 bg-card rounded-2xl border border-border"></div>}>
      <NewTodoClient defaultDate={defaultDate} />
    </Suspense>
  );
}
