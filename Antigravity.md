# Antigravity AI Agent Rules

## 1. Code Style & Architecture
- **No Object Literals for Models:** Todo 객체를 생성할 때는 단순 object literal을 사용하지 않고, Class 구조 또는 명확한 생성자/팩토리 함수를 사용하여 객체 생성 책임을 분리합니다. (예: `Todo` 클래스 정의)
- **Component Separation:** UI는 `src/components/` 기준으로 기능별/단위별로 철저히 분리하며, 단일 책임 원칙(SRP)을 준수합니다.
- **State Management:** `useState` 함수형 초기화(`useState(() => ... )`)를 사용하여 불필요한 초기 렌더링 비용을 최소화합니다.

## 2. Development Flow & Commits
- **Divide and Conquer:** 모든 기능은 `docs/plan.md`에 명시된 단계별로만 진행하며, 절대로 한 번에 전체 코드를 생성하지 않습니다.
- **Micro Commits:** 에이전트는 하나의 단계를 마칠 때마다 명확한 작업 단위로 커밋 메시지를 가이드해야 합니다. (예: `feat:`, `refactor:`, `fix:`)

## 3. Code Review Guardrail
- 코드 구현 세션에서는 디버깅과 기능 구현만 담당합니다.
- 최종 코드 품질 검증 및 리팩토링 검토는 구현이 완전히 끝난 후 별도의 세션(서브 에이전트)에서 독립적으로 수행합니다.
