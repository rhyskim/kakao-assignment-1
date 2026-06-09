import React from 'react';

/**
 * 할 일 필터 상태를 토글하는 탭 컴포넌트 (전체 / 진행 중 / 완료)
 * @param {Object} props
 * @param {string} props.currentFilter - 현재 선택된 필터 ('all' | 'active' | 'completed')
 * @param {Function} props.onChangeFilter - 필터 변경 콜백 함수
 */
export default function FilterTabs({ currentFilter, onChangeFilter }) {
  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'active', label: '진행 중' },
    { id: 'completed', label: '완료' },
  ];

  return (
    <div className="flex justify-center bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-2xl mb-6">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeFilter(tab.id)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-zinc-900 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
