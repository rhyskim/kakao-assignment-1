"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import TodoFilterBar from "@/components/TodoFilterBar";
import TodoList from "@/components/TodoList";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

interface TodosClientProps {
  todos: Todo[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/todos";

export default function TodosClient({ todos }: TodosClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 필터링 상태와 날짜 상태 가져오기 (기본값 설정)
  const currentDate = searchParams.get("date") || new Date().toISOString().split("T")[0];

  // 할 일 완료 상태 토글 (Proxy API 호출)
  const handleToggle = async (id: number, currentCompleted: boolean) => {
    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !currentCompleted,
        }),
      });

      if (!res.ok) {
        throw new Error("할 일 상태 변경에 실패했습니다.");
      }

      // 서버 데이터 갱신 유도
      router.refresh();
    } catch (error) {
      console.error("Toggle error:", error);
      alert("할 일 상태 변경에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 할 일 삭제 (Proxy API 호출)
  const handleDelete = async (id: number) => {
    if (!confirm("이 할 일을 정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("할 일 삭제에 실패했습니다.");
      }

      // 서버 데이터 갱신 유도
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("할 일 삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 주간 캘린더 */}
      <WeeklyCalendar />

      {/* 필터 및 검색 바 */}
      <TodoFilterBar />

      {/* Todo 목록 리스트 */}
      <div className="pt-2">
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* 할 일 추가 플로팅/고정 버튼 */}
      <div className="pt-4 flex justify-end">
        <Link
          href={`/todos/new?date=${currentDate}`}
          id="btn-add-todo"
          className="flex items-center space-x-2 py-3 px-5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>할 일 추가</span>
        </Link>
      </div>
    </div>
  );
}
