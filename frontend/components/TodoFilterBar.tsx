"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function TodoFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("filter") || "all";
  const currentSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);

  // URL의 search 파라미터가 외부적으로 바뀌었을 때 인풋 동기화
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // 디바운스 적용 (300ms)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput.trim()) {
        params.set("search", searchInput.trim());
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchInput]);

  const handleFilterChange = (filterType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filterType);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
  };

  const filters = [
    { type: "all", label: "전체" },
    { type: "active", label: "할 일" },
    { type: "completed", label: "완료" },
  ];

  return (
    <div className="space-y-4">
      {/* 필터 탭 */}
      <div className="flex space-x-1 border-b border-border pb-1">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.type;
          return (
            <button
              key={filter.type}
              onClick={() => handleFilterChange(filter.type)}
              id={`filter-tab-${filter.type}`}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-muted hover:text-foreground hover:bg-muted-light"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* 검색 바 */}
      <div className="relative">
        <input
          type="text"
          id="input-todo-search"
          placeholder="할 일 검색..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
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
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
        </div>
        {searchInput && (
          <button
            onClick={handleClearSearch}
            id="btn-search-clear"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground hover:bg-muted-light rounded-full transition-colors cursor-pointer"
            aria-label="검색어 초기화"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
