# 개선 필요 항목

## 🔴 Critical

### 1. 데이터 격리 없음 (가장 급함)
`shopping_items` 테이블에 `user_id` 컬럼 없음.
다른 계정이 생기면 서로 리스트가 섞임.
- DB migration: `ALTER TABLE shopping_items ADD COLUMN user_id UUID REFERENCES users(id)`
- `backend/internal/models/item.go` 쿼리에 `WHERE user_id = $1` 추가
- handler에서 context의 userID 꺼내서 전달

### 2. 아이템 추가/수정/삭제 중 로딩 표시 없음 ✅ 완료
`useShoppingList.ts`가 `isAdding` 반환, `AddItemDrawer` 버튼이 mutation 중 "추가 중..." 표시 + disabled.
mutation 성공 후 drawer 닫히도록 변경 (기존: 버튼 클릭 즉시 닫힘).

### 3. JWT_SECRET 미설정 시 서버가 조용히 잘못 작동
`os.Getenv("JWT_SECRET")`이 비어있으면 빈 문자열(`""`)로 JWT 서명.
토큰이 기술적으로는 유효하지만 보안 없음.
- `backend/cmd/server/main.go` 시작 시 검증 추가:
  `if os.Getenv("JWT_SECRET") == "" { log.Fatal("JWT_SECRET is required") }`

---

## 🟡 Medium

### 4. 토큰 만료 시 graceful 처리 없음
48시간 후 갑자기 `/login`으로 redirect. 작업 중이던 내용 손실.
- 만료 임박 시 자동 갱신 or 만료 시 toast 알림 후 redirect

### 5. retry 3회 실패해도 유저에게 피드백 없음
`src/lib/api.ts` — 재시도 후 최종 실패 시 toast 없음.
- 에러 throw 전에 toast 표시

### 6. Pull-to-refresh가 `window.location.reload()`
`src/pages/Index.tsx` — 전체 페이지 새로고침이라 검색/필터 state 초기화됨.
- `queryClient.invalidateQueries()` 로 대체

### 7. 폴링 5초 고정
`src/hooks/useShoppingList.ts` — 혼자 쓸 때도 5초마다 API 요청.
- visibilitychange 감지해서 탭이 숨겨지면 폴링 중단
- 또는 폴링 간격 늘리기 (30초)

### 8. AddItemDrawer / ItemDetailDrawer UI 중복
store 선택, quantity, urgency 선택 UI가 두 컴포넌트에 복붙됨.
- 공통 `ItemForm` 컴포넌트 추출

---

## 🟢 Minor

- API 응답 타입이 `unknown` → Zod로 runtime 검증
- 검색 대소문자 구분 + 디바운스 없음
- 테스트 코드 전무