import React from 'react';
import { getMondayOfThisWeek, getFormattedDateKey, isActualToday } from '../utils/date';

/**
 * 주간 날짜 목록을 가로로 정렬해 렌더링하고, 이전/다음 주차 이동 및 일간 뷰와 상태를 동기화하는 컴포넌트
 * @param {Object} props
 * @param {Date} props.selectedDate - 현재 선택된 날짜 객체
 * @param {Function} props.onNavigate - 날짜 변경 콜백 함수
 * @param {Array} props.todos - 전체 할 일 목록 배열 (개수 배지 연산용)
 */
export default function WeeklyView({ selectedDate, onNavigate, todos }) {
  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
  const monday = getMondayOfThisWeek(selectedDate);

  // 주간 헤더 연월 표시 (월요일 기준)
  const headerYear = monday.getFullYear();
  const headerMonth = String(monday.getMonth() + 1).padStart(2, '0');

  // 이전 주차 이동 핸들러 (-7일)
  const handlePrevWeek = () => {
    const prevWeek = new Date(selectedDate);
    prevWeek.setDate(selectedDate.getDate() - 7);
    onNavigate(prevWeek);
  };

  // 다음 주차 이동 핸들러 (+7일)
  const handleNextWeek = () => {
    const nextWeek = new Date(selectedDate);
    nextWeek.setDate(selectedDate.getDate() + 7);
    onNavigate(nextWeek);
  };

  // 주간 날짜 데이터 목록 생성 (7일 루프)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const targetDay = new Date(monday);
    targetDay.setDate(monday.getDate() + i);
    const dateKey = getFormattedDateKey(targetDay);
    const isToday = isActualToday(targetDay);
    const isActive = dateKey === getFormattedDateKey(selectedDate);
    const todoCount = todos.filter((todo) => todo.date === dateKey).length;

    return {
      dateObj: targetDay,
      dayName: dayNames[i],
      dateNumber: targetDay.getDate(),
      dateKey,
      isToday,
      isActive,
      todoCount,
    };
  });

  return (
    <div className="mb-6 bg-zinc-50 dark:bg-zinc-850/20 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-850/50">
      {/* 주간 네비게이터 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevWeek}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 transition-colors cursor-pointer"
          aria-label="이전 주차로 이동"
        >
          {/* 이전 주 더블 쉐브론 아이콘 */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
          {headerYear}년 {headerMonth}월
        </span>

        <button
          type="button"
          onClick={handleNextWeek}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 transition-colors cursor-pointer"
          aria-label="다음 주차로 이동"
        >
          {/* 다음 주 더블 쉐브론 아이콘 */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 가로 캘린더 그리드 (월~일) */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((day) => {
          return (
            <button
              key={day.dateKey}
              type="button"
              onClick={() => onNavigate(day.dateObj)}
              className={`flex flex-col items-center py-2.5 rounded-xl transition-all relative border cursor-pointer ${
                day.isActive
                  ? 'bg-violet-600 border-violet-600 text-white shadow-xs font-bold scale-102 z-10'
                  : day.isToday
                  ? 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/70 text-violet-600 dark:text-violet-400 font-bold'
                  : 'bg-white dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {/* 요일 */}
              <span className={`text-[10px] uppercase font-bold tracking-wider ${day.isActive ? 'text-violet-200' : 'text-zinc-400'}`}>
                {day.dayName}
              </span>
              
              {/* 날짜 숫자 */}
              <span className="text-sm font-semibold mt-1">
                {day.dateNumber}
              </span>
              
              {/* 해당 날짜 Todo 개수 배지 (개수가 있을 때만 렌더링) */}
              {day.todoCount > 0 ? (
                <span
                  className={`mt-1.5 px-1.5 py-0.5 text-[9px] rounded-full font-bold scale-90 transition-all ${
                    day.isActive
                      ? 'bg-white text-violet-600'
                      : 'bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400'
                  }`}
                >
                  {day.todoCount}
                </span>
              ) : (
                <span className="mt-1.5 h-4 w-4"></span> // 레이아웃 정렬용 플레이스홀더
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
