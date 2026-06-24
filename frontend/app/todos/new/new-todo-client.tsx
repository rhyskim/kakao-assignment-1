"use client";

import { useRouter } from "next/navigation";
import TodoForm from "@/components/TodoForm";

interface NewTodoClientProps {
  defaultDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/todos";

export default function NewTodoClient({ defaultDate }: NewTodoClientProps) {
  const router = useRouter();

  const handleCreateTodo = async (text: string, date: string) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        date,
        completed: false,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "할 일을 등록하는 데 실패했습니다.");
    }

    // 등록한 날짜 뷰로 이동 및 서버 데이터 리프레시
    router.push(`/todos?date=${date}`);
    router.refresh();
  };

  return (
    <div className="w-full">
      <TodoForm
        title="새로운 할 일 등록"
        submitLabel="등록하기"
        initialDate={defaultDate}
        onSubmit={handleCreateTodo}
      />
    </div>
  );
}
