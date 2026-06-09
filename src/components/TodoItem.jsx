import React, { useState } from 'react';

/**
 * 개별 할 일(Todo) 항목을 렌더링하고 인라인 수정을 지원하는 컴포넌트
 * @param {Object} props
 * @param {Object} props.todo - Todo 인스턴스
 * @param {Function} props.onToggle - 완료 상태 토글 함수
 * @param {Function} props.onUpdate - 내용 수정 처리 함수
 * @param {Function} props.onDelete - 삭제 함수
 * @param {Function} props.onShowAlert - 공용 알림 모달 호출 함수
 */
export default function TodoItem({ todo, onToggle, onUpdate, onDelete, onShowAlert }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const isCompleted = todo.completed;

  // 수정 시작 핸들러
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  // 수정 취소 핸들러
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  // 수정 내용 저장 핸들러 (1차 과제 수정 누락 버그 해결 반영)
  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText === '') {
      onShowAlert('수정 내용을 올바르게 입력해주세요.');
      return;
    }
    onUpdate(todo.id, trimmedText);
    setIsEditing(false);
  };

  // 키보드 엔터 및 ESC 제어 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li
      className={`flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-850 transition-all ${
        isCompleted && !isEditing ? 'opacity-60' : ''
      }`}
    >
      {isEditing ? (
        /* 인라인 수정 모드 UI */
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500 transition-all"
            autoFocus
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white transition-colors cursor-pointer"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        /* 일반 읽기 모드 UI (완료/수정/삭제 조작 가능) */
        <>
          <span
            className={`text-sm font-medium text-zinc-800 dark:text-zinc-200 break-all select-none transition-all ${
              isCompleted ? 'line-through text-zinc-400 dark:text-zinc-500' : ''
            }`}
          >
            {todo.text}
          </span>

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
              onClick={handleStartEdit}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}
