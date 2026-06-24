"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TodoFormProps {
  initialText?: string;
  initialDate?: string;
  initialCompleted?: boolean;
  onSubmit: (text: string, date: string, completed?: boolean) => Promise<void>;
  submitLabel: string;
  title: string;
}

export default function TodoForm({
  initialText = "",
  initialDate = "",
  initialCompleted = false,
  onSubmit,
  submitLabel,
  title,
}: TodoFormProps) {
  const router = useRouter();
  const [text, setText] = useState(initialText);
  const [date, setDate] = useState(initialDate);
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("할 일 내용을 입력해 주세요.");
      return;
    }
    if (!date) {
      setError("날짜를 선택해 주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit(text.trim(), date, completed);
    } catch (err: any) {
      setError(err.message || "작업 도중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 할 일 입력 */}
        <div className="space-y-1.5">
          <label
            htmlFor="input-todo-text"
            className="text-xs font-semibold text-muted"
          >
            할 일 내용
          </label>
          <input
            type="text"
            id="input-todo-text"
            placeholder="예: 운동하기, 책 읽기..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim()) setError("");
            }}
            disabled={loading}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
          />
        </div>

        {/* 날짜 입력 */}
        <div className="space-y-1.5">
          <label
            htmlFor="input-todo-date"
            className="text-xs font-semibold text-muted"
          >
            목표 날짜
          </label>
          <input
            type="date"
            id="input-todo-date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (e.target.value) setError("");
            }}
            disabled={loading}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground cursor-pointer"
          />
        </div>

        {/* 완료 여부 (수정 모드 등에서 노출할 수도 있음) */}
        {initialText && (
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="checkbox-todo-form-completed"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={loading}
              className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary/20 transition-all cursor-pointer accent-[#672be0]"
            />
            <label
              htmlFor="checkbox-todo-form-completed"
              className="text-sm font-medium text-foreground cursor-pointer select-none"
            >
              완료 상태로 표시
            </label>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <p className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg">
            {error}
          </p>
        )}

        {/* 버튼 액션 */}
        <div className="flex space-x-2 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            id="btn-form-cancel"
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold text-muted bg-muted-light hover:bg-border/50 rounded-xl transition-colors cursor-pointer text-center"
          >
            취소
          </button>
          <button
            type="submit"
            id="btn-form-submit"
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover disabled:bg-primary/50 rounded-xl transition-colors cursor-pointer text-center shadow-md shadow-primary/10"
          >
            {loading ? "저장 중..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
