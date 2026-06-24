"use client";

import { useEffect } from "react";

export default function TodosError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 런타임 에러 로그 출력 (개발용)
    console.error("Antigravity Todo Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <div className="dashed-guide p-8 rounded-2xl w-full max-w-md border-rose-300 bg-rose-50/10 dark:border-rose-900/30">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-950/30 rounded-full text-rose-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 8.25h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">
          오류가 발생했습니다
        </h2>
        <p className="text-sm text-muted mb-6 break-all">
          {error.message || "데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."}
        </p>
        <button
          onClick={() => reset()}
          id="btn-error-reset"
          className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors cursor-pointer"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
