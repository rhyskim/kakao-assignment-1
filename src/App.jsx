import React, { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import AlertModal from './components/AlertModal';
import { getFormattedDateKey } from './utils/date';
import { Todo } from './models/Todo';

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

  // Todo 완료 상태 토글 함수
  const handleToggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? Todo.from({ ...todo, completed: !todo.completed }) // 클래스 인스턴스 구조 보장
          : todo
      )
    );
  };

  // Todo 내용 수정 함수 (1차 과제 버그인 "수정 후 완료 처리 시 데이터 누락 버그" 방지)
  const handleUpdateTodo = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? Todo.from({ ...todo, text: newText }) // 클래스 인스턴스 구조 보장
          : todo
      )
    );
  };

  // Todo 삭제 처리 함수
  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
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

        {/* 할 일 목록 컴포넌트 */}
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
          onShowAlert={handleShowAlert}
        />

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
