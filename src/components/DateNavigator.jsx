import React from 'react';

/**
 * 일간 날짜를 표시하고 이전/다음 날짜로 이동하는 네비게이터 컴포넌트
 * @param {Object} props
 * @param {Date} props.selectedDate - 현재 선택된 날짜 객체
 * @param {Function} props.onNavigate - 날짜 변경 콜백 함수 (새 Date 객체를 인자로 받음)
 */
export default function DateNavigator({ selectedDate, onNavigate }) {
  // 한국 표준시(KST) 포맷에 맞춘 날짜 텍스트 구성
  const formattedDateString = selectedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(selectedDate.getDate() - 1);
    onNavigate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    onNavigate(nextDay);
  };

  const handleGoToday = () => {
    onNavigate(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-6 bg-zinc-50 dark:bg-zinc-800/20 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-850">
      <button
        type="button"
        onClick={handlePrevDay}
        className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 transition-colors cursor-pointer"
        aria-label="이전 날짜로 이동"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="flex flex-col items-center">
        <span className="text-base font-bold text-zinc-800 dark:text-zinc-200">
          {formattedDateString}
        </span>
        <button
          type="button"
          onClick={handleGoToday}
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-1 hover:underline cursor-pointer"
        >
          오늘로 이동
        </button>
      </div>

      <button
        type="button"
        onClick={handleNextDay}
        className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:bg-zinc-200 transition-colors cursor-pointer"
        aria-label="다음 날짜로 이동"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
