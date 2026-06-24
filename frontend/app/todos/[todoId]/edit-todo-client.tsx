"use client";

import { useRouter } from "next/navigation";
import TodoForm from "@/components/TodoForm";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

interface EditTodoClientProps {
  todo: Todo;
  returnDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/todos";

export default function EditTodoClient({ todo, returnDate }: EditTodoClientProps) {
  const router = useRouter();

  const handleUpdateTodo = async (text: string, date: string, completed?: boolean) => {
    const res = await fetch(`${API_URL}?id=${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        date,
        completed: completed ?? todo.completed,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "할 일을 수정하는 데 실패했습니다.");
    }

    // 수정 완료 후 이전 또는 특정 날짜의 뷰로 복귀 및 서버 리프레시
    router.push(`/todos?date=${date}`);
    router.refresh();
  };

  return (
    <div className="w-full">
      <TodoForm
        title="할 일 수정하기"
        submitLabel="수정완료"
        initialText={todo.text}
        initialDate={todo.date}
        initialCompleted={todo.completed}
        onSubmit={handleUpdateTodo}
      />
    </div>
  );
}
