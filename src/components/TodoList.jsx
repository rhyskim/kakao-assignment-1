import React from 'react';
import TodoItem from './TodoItem';

/**
 * Todo 목록을 렌더링하고 빈 상태를 관리하는 리스트 컴포넌트
 * @param {Object} props
 * @param {Array} props.todos - Todo 인스턴스 배열
 * @param {Function} props.onToggle - 완료 상태 토글 함수
 * @param {Function} props.onDelete - 삭제 함수
 */
export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <main className="mt-6">
      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 border-b border-zinc-100 dark:border-zinc-850 pb-2">
        등록된 할 일 (개수: {todos.length})
      </h2>
      
      {todos.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">
          할 일이 없습니다. 새로운 일정을 등록해보세요!
        </p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id} // 규칙 준수: map() 사용 시 고유 key로 id 부여
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
