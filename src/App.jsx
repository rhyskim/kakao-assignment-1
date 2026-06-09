import React, { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import DateNavigator from './components/DateNavigator';
import AlertModal from './components/AlertModal';
import { getFormattedDateKey } from './utils/date';
import { Todo } from './models/Todo';

/**
 * React 마이그레이션 메인 App 컴포넌트
 */
export default function App() {
  // 규칙 준수: useState 함수형 초기화 내부에서 로컬스토리지를 조회하고 클래스 인스턴스로 복원(rehydration)
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const parsed = JSON.parse(savedTodos);
        if (Array.isArray(parsed)) {
          // 단순 객체 배열을 Todo 클래스의 인스턴스 배열로 안전하게 맵핑 복원
          return parsed.map((item) => Todo.from(item));
        }
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
    }
    return [];
  });

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [filter, setFilter] = useState(() => 'all');
  
  // 알림 모달 상태 (함수형 초기화)
  const [modalState, setModalState] = useState(() => ({
    isOpen: false,
    message: '',
  }));

  // [자동 저장] todos 상태가 변경될 때마다 의존성 배열에 맞춰 로컬스토리지에 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }, [todos]);

  const selectedDateKey = getFormattedDateKey(selectedDate);

  // Todo 추가 처리 함수 (로컬스토리지 중복 호출 없음)
  const handleAddTodo = (newTodo) => {
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // Todo 완료 상태 토글 함수 (로컬스토리지 중복 호출 없음)
  const handleToggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? Todo.from({ ...todo, completed: !todo.completed }) // 클래스 인스턴스 구조 보장
          : todo
      )
    );
  };

  // Todo 내용 수정 함수 (로컬스토리지 중복 호출 없음)
  const handleUpdateTodo = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? Todo.from({ ...todo, text: newText }) // 클래스 인스턴스 구조 보장
          : todo
      )
    );
  };

  // Todo 삭제 처리 함수 (로컬스토리지 중복 호출 없음)
  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // 날짜 변경 이동 함수
  const handleNavigateDate = (newDate) => {
    setSelectedDate(newDate);
  };

  // 필터 토글 제어 함수
  const handleChangeFilter = (newFilter) => {
    setFilter(newFilter);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // 모달 호출 핸들러
  const handleShowAlert = (message) => {
    setModalState({ isOpen: true, message });
  };

  // [데이터 연동 및 필터링 핵심 로직] 선택 날짜에 해당하면서 상태별 필터 탭에 일치하는 항목 도출
  const filteredTodos = todos.filter((todo) => {
    const isSameDate = todo.date === selectedDateKey;
    if (!isSameDate) return false;

    if (filter === 'active') {
      return !todo.completed;
    }
    if (filter === 'completed') {
      return todo.completed;
    }
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-150 dark:border-zinc-800 p-6 md:p-8">
        
        {/* 헤더 영역 */}
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Todo 마이그레이션
          </h1>
        </header>

        {/* KST 기준 날짜 제어 및 오늘 이동 내비게이터 */}
        <DateNavigator
          selectedDate={selectedDate}
          onNavigate={handleNavigateDate}
        />

        {/* 전체 / 진행 중 / 완료 필터 탭 */}
        <FilterTabs
          currentFilter={filter}
          onChangeFilter={handleChangeFilter}
        />

        {/* 할 일 입력 컴포넌트 */}
        <TodoInput
          selectedDateKey={selectedDateKey}
          onAddTodo={handleAddTodo}
          onShowAlert={handleShowAlert}
        />

        {/* 할 일 목록 컴포넌트 */}
        <TodoList
          todos={filteredTodos}
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
