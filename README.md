# 📝 React Todo 마이그레이션 프로젝트

기존의 Vanilla JS 단일 파일 구조의 Todo 애플리케이션을 **React + Tailwind CSS v4** 최신 아키텍처로 안전하게 마이그레이션하고 고도화한 프로젝트입니다. 

---

## 🚀 주요 기능 및 핵심 특징

1. **데이터 모델링 (Class 구조화)**
   - 단순 Object Literal 형식이 아닌 `Todo` 클래스를 정의하여 객체 생성 책임을 분리하고, 상태 전이 시에도 클래스 프로토타입 체인이 훼손되지 않도록 설계했습니다. (`Todo.from` 팩토리 메서드 도입)
2. **Todo CRUD & 예외 처리**
   - **생성(Create):** 공백 입력 차단 및 `AlertModal` 공용 컴포넌트 팝업 적용.
   - **조회 및 완료/삭제(Read, Update, Delete):** 데이터 불변성을 지키며 렌더링하고, 완료된 항목은 취소선(`line-through`) 및 투명도로 구분 처리.
   - **인라인 수정(isEditing):** 1차 과제의 버그("수정 후 완료 처리 시 데이터 누락")를 완전히 제거하고, `isEditing` 상태에 따른 다이내믹 인라인 입력 전환을 지원합니다.
3. **주간 뷰 및 일간 뷰 연동 (도전 미션)**
   - [WeeklyView](src/components/WeeklyView.jsx)를 추가하여 이번 주(월~일) 날짜 목록을 렌더링하고, 클릭 시 일간 selectedDate와 즉시 동기화됩니다.
   - 날짜별 투두 카운팅 룩업 연산을 **O(N) 해시 맵핑** 방식으로 최적화하여 7일 렌더링 오버헤드를 획기적으로 낮췄습니다.
4. **로컬스토리지 자동화 및 복원 (Rehydration)**
   - `useEffect` 의존성 배열(`[todos]`)을 활용하여 상태가 변경될 때만 로컬스토리지에 싱글 톤 저장합니다.
   - `useState` 함수형 초기화를 통해 마운트 시 최초 1회 로컬스토리지 복원을 수행하며, 복원 시 `Todo` 클래스의 인스턴스 배열로 안전하게 복구합니다.
5. **SEO 및 현지화 최적화**
   - `index.html` 내 다국어 처리(`lang="ko"`) 및 맞춤형 브라우저 타이틀을 설정했습니다.

---

## 🛠 기술 스택

- **Framework / Bundler:** React 18, Vite
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- **State Management:** React useState, useMemo (연산 성능 최적화)

---

## 💻 실행 방법

### 1. 의존성 패키지 설치
```bash
npm install
```

### 2. 로컬 개발 서버 구동
```bash
npm run dev
```

### 3. 프로덕션 빌드 및 검증
```bash
npm run build
```

---

## 📂 프로젝트 폴더 구조

```text
todo-vanilla/
├── Antigravity.md              # AI 에이전트 개발 규칙 정의서
├── docs/
│   └── plan.md                 # 마이그레이션 단계별 로드맵 (Source of Truth)
├── src/
│   ├── components/             # SRP(단일 책임 원칙) 분리 컴포넌트
│   │   ├── AlertModal.jsx      # 공용 경고 팝업 모달
│   │   ├── DateNavigator.jsx   # 일간 KST 날짜 네비게이터
│   │   ├── FilterTabs.jsx      # 전체/진행중/완료 상태 필터 탭
│   │   ├── TodoInput.jsx       # 할 일 추가 및 검증 폼
│   │   ├── TodoItem.jsx        # 개별 할 일 렌더링 및 인라인 수정 제어
│   │   └── TodoList.jsx        # 할 일 리스트 맵핑 컨테이너
│   ├── models/
│   │   └── Todo.js             # Todo 데이터 모델 클래스 정의
│   ├── utils/
│   │   └── date.js             # KST 날짜 포맷 및 주간 계산 유틸
│   ├── App.jsx                 # 메인 통합 상태 조율(Source of Truth) 컴포넌트
│   ├── index.css               # Tailwind CSS v4 전역 임포트
│   └── main.jsx
├── legacy-vanilla/             # [백업] 마이그레이션 전 Vanilla JS 버전 코드
└── index.html                  # 리액트 진입 HTML 파일
```
