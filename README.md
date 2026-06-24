# 과제 3. Next.js로 Todo 앱 만들기

과제 2에서 React(Vite)로 만든 Todo 앱을 **Next.js App Router + FastAPI** 풀스택 구조로 재구현하는 과제예요.  
파일 기반 라우팅, Server/Client Component 구분, FastAPI 백엔드 연동 흐름을 직접 경험해봐요.

---

## 실행 방법

### 백엔드 (FastAPI)

```bash
# backend/ 디렉토리로 이동
cd backend

# 가상환경 생성 및 활성화
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Mac/Linux

# 패키지 설치
pip install -r requirements.txt

# 환경변수 파일 생성 (.env.local)
# DATABASE_URL=sqlite:///./todos.db
# FRONTEND_URL=http://localhost:3000

# 개발 서버 실행
uvicorn main:app --reload
```

백엔드 서버: [http://localhost:8000](http://localhost:8000)  
API 문서(Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 프론트엔드 (Next.js)

```bash
# frontend/ 디렉토리로 이동
cd frontend

# 패키지 설치
npm install

# 환경변수 파일 생성 (.env.local)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api/todos
# BACKEND_URL=http://127.0.0.1:8000

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속해요.

---

## 프로젝트 구조

```
kakao-assignment-3/
├── frontend/                          # Next.js 15+ 프론트엔드
│   ├── app/
│   │   ├── api/todos/
│   │   │   └── route.ts              # API Route (백엔드 프록시: POST / PUT / DELETE)
│   │   ├── todos/
│   │   │   ├── [todoId]/
│   │   │   │   ├── page.tsx          # Todo 수정 페이지 (Server Component)
│   │   │   │   └── edit-todo-client.tsx  # 수정 폼 (Client Component)
│   │   │   ├── new/
│   │   │   │   ├── page.tsx          # Todo 생성 페이지 (Server Component)
│   │   │   │   └── new-todo-client.tsx   # 생성 폼 (Client Component)
│   │   │   ├── error.tsx             # 에러 화면
│   │   │   ├── loading.tsx           # 로딩 스켈레톤 UI
│   │   │   ├── page.tsx              # Todo 목록 페이지 (Server Component)
│   │   │   └── todos-client.tsx      # 목록 인터랙션 (Client Component)
│   │   ├── actions.ts                # Server Actions (GET 조회 로직)
│   │   ├── globals.css               # 글로벌 스타일 + Tailwind CSS v4
│   │   ├── layout.tsx                # 루트 레이아웃 (헤더 / 푸터)
│   │   └── page.tsx                  # 루트 페이지 → /todos 리다이렉트
│   ├── components/
│   │   ├── TodoFilterBar.tsx         # 필터 탭 + 검색창 (Client Component)
│   │   ├── TodoForm.tsx              # 생성/수정 공용 폼 (Client Component)
│   │   ├── TodoList.tsx              # Todo 목록 렌더링 (Client Component)
│   │   └── WeeklyCalendar.tsx        # 주간 캘린더 네비게이터 (Client Component)
│   ├── .env.local                    # 환경변수 (git 제외)
│   └── package.json
│
└── backend/                          # FastAPI 백엔드
    ├── main.py                       # FastAPI 앱 (DB 모델, 스키마, 라우터 포함)
    ├── requirements.txt
    └── .env.local                    # 환경변수 (git 제외)
```

---

## 구현 기능

### 기본 미션
- **Todo CRUD** — 생성 / 조회 / 수정 / 삭제 전체 구현
- **FastAPI 백엔드 연동** — SQLite DB에 데이터 영구 저장, 새로고침 후에도 유지
- **파일 기반 라우팅** — `app/todos/`, `app/todos/new/`, `app/todos/[todoId]/`
- **Server / Client Component 구분** — 데이터 조회는 Server Component, 인터랙션은 Client Component
- **API Route 프록시** — `route.ts`가 클라이언트와 FastAPI 사이 중간 역할
- **Server Actions** — `actions.ts`에서 서버 측 직접 FastAPI 호출 (GET)
- **로딩 / 에러 화면** — `loading.tsx` 스켈레톤 UI, `error.tsx` 에러 복구 화면
- **환경변수 관리** — `.env.local`로 URL 등 민감 정보 분리

### 도전 미션
- **서버 기반 상태별 필터링** — 전체 / 진행 중 / 완료 필터를 URL 파라미터(`?filter=`)로 관리, FastAPI 서버에서 DB 레벨 필터링
- **서버 기반 키워드 검색** — `?search=키워드` URL 파라미터, 디바운스(300ms) 적용, FastAPI에서 `ilike` 검색
- **주간 캘린더** — 날짜별 Todo 관리, 이전/다음 주 이동, 오늘 버튼

---

## 활용 스택

| 프론트엔드 | 백엔드 |
|-----------|--------|
| Next.js 15+ (App Router) | FastAPI 0.111+ |
| React 19 | Uvicorn |
| TypeScript 5 | SQLAlchemy 2.0 |
| Tailwind CSS v4 | SQLite |
| — | Pydantic v2 |

---

## API 엔드포인트

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/todos` | 전체 Todo 목록 조회 (date / filter / search 쿼리 파라미터 지원) |
| GET | `/todos/{id}` | 특정 Todo 단건 조회 |
| POST | `/todos` | 새 Todo 생성 |
| PUT | `/todos/{id}` | Todo 수정 |
| DELETE | `/todos/{id}` | Todo 삭제 |

---

## 참고사항

- 본 과제는 AI 도구(Antigravity)를 활용해 구현했어요
- 과제 2(React + Vite)와 동일한 기능을 Next.js App Router + FastAPI 풀스택으로 재구현한 버전이에요
- 로컬스토리지 기반 상태 관리 → FastAPI + SQLite 서버 기반 데이터 관리로 전환했어요
