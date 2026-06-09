import React, { useState } from 'react';
import { Todo } from '../models/Todo';

/**
 * 할 일 입력 창 및 추가 버튼을 렌더링하는 컴포넌트
 * @param {Object} props
 * @param {string} props.selectedDateKey - 현재 선택된 날짜 문자열 (YYYY-MM-DD)
 * @param {Function} props.onAddTodo - 새 Todo 인스턴스를 상태에 추가하는 콜백 함수
 * @param {Function} props.onShowAlert - 경고창을 표시하기 위한 콜백 함수
 */
export default function TodoInput({ selectedDateKey, onAddTodo, onShowAlert }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();

    // 예외 처리: 빈 값이거나 공백만 입력된 경우
    if (trimmedValue === '') {
      onShowAlert('할 일 내용을 입력해주세요!');
      return;
    }

    // Todo 모델 클래스를 인스턴스화하여 객체 생성 책임 분리 (Antigravity 규칙 준수)
    const newTodo = new Todo(trimmedValue, selectedDateKey);
    
    onAddTodo(newTodo);
    setInputValue(''); // 입력 필드 초기화
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="할 일을 입력하세요..."
        className="flex-1 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold transition-colors shadow-xs hover:shadow-md cursor-pointer"
      >
        추가
      </button>
    </form>
  );
}
