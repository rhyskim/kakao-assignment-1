import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import AlertModal from './components/AlertModal';
import { getFormattedDateKey } from './utils/date';

/**
 * React 마이그레이션 메인 App 컴포넌트
 */
export default function App() {
  // 규칙 준수: useState 함수형 초기화를 통해 불필요한 초기 렌더링 최소화
  const [todos, setTodos] = useState(() => []);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  
  // 알림 모달 상태 (함수형 초기화)
  const [modalState, setModalState] = useState(() => ({
    isOpen: false,
    message: '',
  }));

  const selectedDateKey = getFormattedDateKey(selectedDate);

  // Todo 추가 처리 함수
  const handleAddTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // 모달 호출 핸들러
  const handleShowAlert = (message) => {
    setModalState({ isOpen: true, message });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-150 dark:border-zinc-800 p-6 md:p-8">
        
        {/* 헤더 영역 */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Todo 마이그레이션
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            선택된 날짜: <span className="font-semibold text-violet-600 dark:text-violet-400">{selectedDateKey}</span>
          </p>
        </header>

        {/* 할 일 입력 컴포넌트 */}
        <TodoInput
          selectedDateKey={selectedDateKey}
          onAddTodo={handleAddTodo}
          onShowAlert={handleShowAlert}
        />

        {/* 할 일 목록 임시 확인 영역 (Step 2.1 추가 검증용) */}
        <main className="mt-6">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 border-b border-zinc-100 dark:border-zinc-850 pb-2">
            등록된 할 일 (개수: {todos.length})
          </h2>
          {todos.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-4">
              아직 등록된 할 일이 없습니다.
            </p>
          ) : (
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-850"
                >
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 break-all">
                    {todo.text}
                  </span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 ml-2 whitespace-nowrap bg-zinc-200/40 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg">
                    {todo.date}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </main>

      </div>

      {/* 에러 및 빈 값 알림 모달 */}
      <AlertModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        onClose={handleCloseModal}
      />
    </div>
  );
}
