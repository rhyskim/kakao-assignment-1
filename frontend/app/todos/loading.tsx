export default function TodosLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* 주간 달력 스켈레톤 */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-32 bg-muted-light rounded"></div>
          <div className="h-5 w-24 bg-muted-light rounded"></div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center p-2 space-y-2">
              <div className="h-4 w-6 bg-muted-light rounded"></div>
              <div className="h-8 w-8 bg-muted-light rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 필터 및 검색 바 스켈레톤 */}
      <div className="space-y-4">
        <div className="flex space-x-2 border-b border-border pb-2">
          <div className="h-8 w-16 bg-muted-light rounded"></div>
          <div className="h-8 w-16 bg-muted-light rounded"></div>
          <div className="h-8 w-16 bg-muted-light rounded"></div>
        </div>
        <div className="h-10 w-full bg-muted-light rounded-xl"></div>
      </div>

      {/* 목록 리스트 스켈레톤 */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-card border border-border rounded-xl"
          >
            <div className="flex items-center space-x-3 w-2/3">
              <div className="h-5 w-5 bg-muted-light rounded"></div>
              <div className="h-4 w-full bg-muted-light rounded"></div>
            </div>
            <div className="h-8 w-8 bg-muted-light rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
