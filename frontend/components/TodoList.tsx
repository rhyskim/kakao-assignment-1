"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, currentCompleted: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "all";
  const date = searchParams.get("date") || "";

  // 빈 상태(Empty State) 안내 문구 분기 처리
  const isEmptyState = todos.length === 0;
  const isFilteredEmpty = filter !== "all" || search.trim() !== "";

  if (isEmptyState) {
    return (
      <div className="dashed-guide rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[180px] transition-all">
        <div className="p-3 bg-primary-light text-primary rounded-full mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24c-.402.053-.8.109-1.198.166m-2.821 1.724c-.58.94-1.109 2.002-1.503 3.14a1.27 1.27 0 0 0 .69 1.566l.003.001c.71.276 1.484.348 2.228.214m0 0a3 3 0 0 0 1.243-2.39L9 7.5m0 0a3 3 0 0 0-2.25-2.25M9 10.5H5.625c-.621 0-1.125-.504-1.125-1.125V6.75a9 9 0 0 1 1.5-5.25"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          {isFilteredEmpty ? "조건에 맞는 할 일이 없습니다" : "할 일이 없습니다"}
        </p>
        <p className="text-xs text-muted max-w-xs">
          {isFilteredEmpty
            ? "필터나 검색어를 변경해 보세요."
            : "선택한 날짜에 등록된 할 일이 없습니다. 아래 추가 버튼을 눌러 일정을 등록해 보세요."}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" id="todo-list-container">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm hover:shadow transition-all group ${
            todo.completed ? "opacity-75" : ""
          }`}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0 mr-4">
            <input
              type="checkbox"
              id={`checkbox-todo-${todo.id}`}
              checked={todo.completed}
              onChange={() => onToggle(todo.id, todo.completed)}
              className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20 transition-all cursor-pointer accent-[#672be0]"
            />
            <span
              className={`text-sm font-medium truncate flex-1 ${
                todo.completed
                  ? "line-through text-muted"
                  : "text-foreground"
              }`}
            >
              {todo.text}
            </span>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            {/* 수정 버튼 */}
            <Link
              href={`/todos/${todo.id}?date=${date}`}
              id={`btn-todo-edit-${todo.id}`}
              className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors cursor-pointer"
              aria-label="할 일 수정"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4.5 h-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </Link>
            {/* 삭제 버튼 */}
            <button
              onClick={() => onDelete(todo.id)}
              id={`btn-todo-delete-${todo.id}`}
              className="p-1.5 text-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
              aria-label="할 일 삭제"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4.5 h-4.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
