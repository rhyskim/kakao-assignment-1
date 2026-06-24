import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTodoByIdAction } from "@/app/actions";
import EditTodoClient from "./edit-todo-client";

type Params = Promise<{ todoId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface EditTodoPageProps {
  params: Params;
  searchParams: SearchParams;
}

export default async function EditTodoPage({ params, searchParams }: EditTodoPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const todoId = resolvedParams.todoId;
  const returnDate = (resolvedSearchParams.date as string) || new Date().toISOString().split("T")[0];

  // 상세 데이터 조회 (Server Component Direct Fetching)
  const todo = await getTodoByIdAction(todoId);

  // Todo 아이템이 없는 경우 404 리다이렉트
  if (!todo) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="animate-pulse h-64 bg-card rounded-2xl border border-border"></div>}>
      <EditTodoClient todo={todo} returnDate={returnDate} />
    </Suspense>
  );
}
