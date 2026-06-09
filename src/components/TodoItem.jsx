import React from 'react';

/**
 * 개별 할 일(Todo) 항목을 렌더링하는 컴포넌트
 * @param {Object} props
 * @param {Object} props.todo - Todo 인스턴스
 * @param {Function} props.onToggle - 완료 상태 토글 함수
 * @param {Function} props.onDelete - 삭제 함수
 */
export default function TodoItem({ todo, onToggle, onDelete }) {
  const isCompleted = todo.completed;

  return (
    <li
      className={`flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-850 transition-all ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      {/* Todo 텍스트 영역 (완료 시 취소선 스타일 적용) */}
      <span
        className={`text-sm font-medium text-zinc-800 dark:text-zinc-200 break-all select-none transition-all ${
          isCompleted ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
        }`}
      >
        {todo.text}
      </span>

      {/* 작업 버튼 영역 (1차 과제 유산: 완료/취소 토글 및 삭제 버튼) */}
      <div className="flex items-center gap-1.5 ml-4 shrink-0">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            isCompleted
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700'
              : 'bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-250 dark:hover:bg-violet-950/60'
          }`}
        >
          {isCompleted ? '취소' : '완료'}
        </button>
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
