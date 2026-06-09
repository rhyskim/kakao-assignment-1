# React Todo 앱 마이그레이션 플랜 (Source of Truth)

## 📌 1차 과제(Vanilla JS) 분석 요약
- **Core State:** `app.js` 내의 전역 배열 변수 `todoItems`에서 상태를 직접 관리합니다.
- **Data Model:** Object Literal 방식을 사용하며 `{ id, text, completed, date }` 구조를 가집니다. (이후 React 마이그레이션 시 `Todo` 클래스로 정의하여 객체 생성 책임을 분리할 예정)
- **UI Logic:** `app.js` 내에서 직접 DOM 요소들을 선택하고 이벤트를 바인딩하며, `renderTodos()`, `renderWeekView()` 함수를 통해 HTML을 동적으로 삽입하고 DOM을 직접 조작합니다.
- **Storage:** CRUD 발생 시마다 `app.js` 내부의 `saveToLocalStorage()` 함수를 명시적으로 호출하여 로컬스토리지와 데이터를 동기화합니다.

---

## 🛠 단계별 구현 계획 (Issue 단위 분할)

### [Phase 1] 환경 세팅 및 아키텍처 수립
- [x] **Step 1.1: Vite + Tailwind CSS v4 초기화**
  - Vite React 템플릿 설치 및 `vite.config.js`, `src/index.css`에 Tailwind v4 설정 적용.
- [x] **Step 1.2: 데이터 모델(Class) 정의**
  - 멘토 피드백 반영: Todo 객체의 구조를 보장할 `Todo` 클래스 선언 (`id`, `content`, `date`, `status` 등).

### [Phase 2] 필수 미션: Todo CRUD 마이그레이션
- [x] **Step 2.1: Todo 추가 및 예외 처리 (Create)**
  - 빈 값 입력 시 모달 알림 UI 구현.
- [x] **Step 2.2: Todo 목록 렌더링 및 완료/삭제 (Read, Update, Delete)**
  - `map()` 함수 사용 시 고유 `key`값으로 `todo.id` 부여.
- [ ] **Step 2.3: 인라인 수정 기능 (isEditing)**
  - 1차 과제의 `prompt()` 방식을 제거하고, `isEditing` 상태에 따른 인라인 input 전환 UI 구현.
  - 1차 과제 버그인 "수정 미작동 오류"가 발생하지 않도록 상태 업데이트 흐름 보장.

### [Phase 3] 필수 미션: 필터링 및 일간 뷰, 스토리지 연동
- [ ] **Step 3.1: 상태별 필터링 (전체 / 진행 중 / 완료)**
  - DOM 조작이 아닌 `filter` 상태(`useState`)에 따른 조건부 렌더링 구현.
- [ ] **Step 3.2: 일간 뷰 및 날짜 이동**
  - 현재 선택된 날짜 상태 관리, 이전/다음 버튼 클릭 시 상태 변경 및 해당 날짜 Todo 필터링.
- [ ] **Step 3.3: useEffect 기반 로컬스토리지 연동**
  - 각 함수에서 개별 저장하던 방식을 `useEffect` 의존성 배열(`[todos]`)을 활용한 자동 저장 방식으로 마이그레이션.
  - `useState` 초기화 시 함수형 초기화 적용.

### [Phase 4] 도전 미션: 주간 뷰 확장 (선택 진행)
- [ ] **Step 4.1: 이번 주 날짜 목록 및 이동 버튼 구현**
- [ ] **Step 4.2: 주간 뷰 - 일간 뷰 날짜 상태 동기화 및 날짜별 Todo 개수 표시**
