"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

// 날짜를 YYYY-MM-DD 포맷 스트링으로 반환하는 헬퍼 함수
const formatDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 특정 날짜가 속한 주의 월요일을 구하는 함수
const getMonday = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 일요일(0) 처리
  return new Date(date.setDate(diff));
};

export default function WeeklyCalendar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL에서 date 파라미터를 읽고 없으면 오늘로 설정
  const selectedDateStr = searchParams.get("date") || formatDateString(new Date());
  const selectedDate = new Date(selectedDateStr);

  // 현재 달력에 렌더링되고 있는 주의 기준 날짜 (기본적으로 선택된 날짜)
  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(() => getMonday(selectedDate));

  // selectedDate가 바뀌면 해당 날짜가 포함된 주(Monday)로 이동
  useEffect(() => {
    setCurrentWeekMonday(getMonday(selectedDate));
  }, [selectedDateStr]);

  // 이번 주의 7일 날짜 배열 생성
  const weekDays = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(currentWeekMonday);
    day.setDate(currentWeekMonday.getDate() + idx);
    return day;
  });

  const handleDateSelect = (date: Date) => {
    const dateStr = formatDateString(date);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", dateStr);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePrevWeek = () => {
    const prevMon = new Date(currentWeekMonday);
    prevMon.setDate(currentWeekMonday.getDate() - 7);
    setCurrentWeekMonday(prevMon);
  };

  const handleNextWeek = () => {
    const nextMon = new Date(currentWeekMonday);
    nextMon.setDate(currentWeekMonday.getDate() + 7);
    setCurrentWeekMonday(nextMon);
  };

  const handleGoToday = () => {
    const today = new Date();
    const todayStr = formatDateString(today);
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", todayStr);
    router.push(`${pathname}?${params.toString()}`);
  };

  const weekdaysKo = ["월", "화", "수", "목", "금", "토", "일"];

  // 현재 보고 있는 년/월 표시 용도
  const currentMonthYear = currentWeekMonday.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-base font-bold text-foreground">
            {currentMonthYear}
          </span>
          <button
            onClick={handleGoToday}
            id="btn-calendar-today"
            className="text-xs px-2.5 py-1 bg-primary-light text-primary hover:bg-primary/20 rounded-md font-semibold transition-colors cursor-pointer"
          >
            오늘
          </button>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={handlePrevWeek}
            id="btn-calendar-prev"
            className="p-1.5 hover:bg-muted-light rounded-lg text-muted transition-colors cursor-pointer"
            aria-label="이전 주"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={handleNextWeek}
            id="btn-calendar-next"
            className="p-1.5 hover:bg-muted-light rounded-lg text-muted transition-colors cursor-pointer"
            aria-label="다음 주"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, idx) => {
          const dayStr = formatDateString(day);
          const isSelected = dayStr === selectedDateStr;
          const isToday = dayStr === formatDateString(new Date());

          return (
            <button
              key={idx}
              onClick={() => handleDateSelect(day)}
              id={`calendar-day-${dayStr}`}
              className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "hover:bg-muted-light text-foreground"
              }`}
            >
              <span
                className={`text-[11px] font-medium mb-1 ${
                  isSelected ? "text-white/80" : "text-muted"
                }`}
              >
                {weekdaysKo[idx]}
              </span>
              <span
                className={`flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full ${
                  isToday && !isSelected
                    ? "border-2 border-primary text-primary"
                    : ""
                }`}
              >
                {day.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
