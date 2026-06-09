import React from 'react';

/**
 * 사용자 경고 및 알림 메시지를 표시하는 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 오픈 여부
 * @param {string} props.message - 표시할 알림 메시지
 * @param {Function} props.onClose - 모달 닫기 콜백 함수
 */
export default function AlertModal({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div className="w-11/12 max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-bold leading-6 text-zinc-900 dark:text-zinc-100">
          알림
        </h3>
        <div className="mt-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {message}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 active:bg-violet-700 focus:outline-hidden transition-colors cursor-pointer"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
