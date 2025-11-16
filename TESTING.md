# 테스트 가이드

## 🚀 빠른 시작

### 전제 조건

1. ✅ Supabase 프로젝트 생성 완료
2. ✅ `.env` 파일에 DATABASE_URL 설정 완료
3. ✅ `npm run setup` 실행 완료
4. ✅ 서버 실행 중 (`npm run dev`)

Supabase 설정이 안 되었다면 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참고

## 🧪 테스트 방법

### 방법 1: VS Code REST Client (추천!)

**장점:**

- VS Code에서 바로 실행
- 응답을 보기 좋게 표시
- 요청 히스토리 저장
- 변수 사용 가능

**설치:**

1. VS Code 확장 메뉴 (`Ctrl+Shift+X`)
2. "REST Client" 검색
3. **humao.rest-client** 설치

**사용법:**

1. `test.http` 파일 열기
2. 각 요청 위의 **"Send Request"** 클릭
3. 응답 확인

### 방법 2: curl (터미널)

**장점:**

- 추가 설치 불필요
- 스크립트화 가능
- 자동화 테스트에 유용

**사용법:**

```bash
# Health Check
curl http://localhost:4000/health

# 구독 목록 조회
curl http://localhost:4000/subscriptions

# 새 구독 생성
curl -X POST http://localhost:4000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Netflix",
    "price": 13500,
    "currency": "KRW",
    "billingCycle": "monthly",
    "nextBillingAt": "2025-12-16T00:00:00Z",
    "paymentMethod": "credit_card",
    "category": "Entertainment"
  }'

# 특정 구독 조회 (ID는 생성 응답에서 확인)
curl http://localhost:4000/subscriptions/{id}

# 구독 수정
curl -X PATCH http://localhost:4000/subscriptions/{id} \
  -H "Content-Type: application/json" \
  -d '{"price": 14900}'

# 구독 삭제
curl -X DELETE http://localhost:4000/subscriptions/{id}
```

### 방법 3: Postman / Insomnia

**장점:**

- 강력한 GUI
- 팀 협업 기능
- 환경 변수 관리

**설정:**

1. Postman 또는 Insomnia 설치
2. 새 Collection 생성
3. Base URL: `http://localhost:4000`
4. `test.http`의 요청들을 Import

### 방법 4: HTTPie (사용자 친화적 CLI)

```bash
# 설치 (선택사항)
pip install httpie

# 사용
http GET http://localhost:4000/subscriptions

http POST http://localhost:4000/subscriptions \
  name="Netflix" \
  price:=13500 \
  currency="KRW" \
  billingCycle="monthly" \
  nextBillingAt="2025-12-16T00:00:00Z" \
  paymentMethod="credit_card" \
  category="Entertainment"
```

## 📋 테스트 시나리오

### 1. 기본 CRUD

#### 1.1 Health Check

```http
GET http://localhost:4000/health
```

**예상 응답:**

```json
{
  "ok": true,
  "ts": "2025-11-16T08:00:00.000Z"
}
```

#### 1.2 구독 생성 (POST)

```http
POST http://localhost:4000/subscriptions
Content-Type: application/json

{
  "name": "Netflix",
  "price": 13500,
  "currency": "KRW",
  "billingCycle": "monthly",
  "nextBillingAt": "2025-12-16T00:00:00Z",
  "paymentMethod": "credit_card",
  "category": "Entertainment"
}
```

**예상 응답: 201 Created**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "demo-user-123",
  "name": "Netflix",
  "price": "13500.00",
  "currency": "KRW",
  "billingCycle": "monthly",
  "intervalCount": 1,
  "nextBillingAt": "2025-12-16T00:00:00.000Z",
  "paymentMethod": "credit_card",
  "category": "Entertainment",
  "memo": null,
  "isPaused": false,
  "createdAt": "2025-11-16T08:00:00.000Z"
}
```

#### 1.3 전체 목록 조회 (GET)

```http
GET http://localhost:4000/subscriptions
```

#### 1.4 특정 구독 조회 (GET)

```http
GET http://localhost:4000/subscriptions/{id}
```

#### 1.5 구독 수정 (PATCH)

```http
PATCH http://localhost:4000/subscriptions/{id}
Content-Type: application/json

{
  "price": 14900,
  "memo": "가격 인상"
}
```

#### 1.6 구독 삭제 (DELETE)

```http
DELETE http://localhost:4000/subscriptions/{id}
```

**예상 응답: 204 No Content**

### 2. 필터링 테스트

#### 2.1 카테고리별 필터

```http
GET http://localhost:4000/subscriptions?category=Entertainment
```

#### 2.2 결제 수단별 필터

```http
GET http://localhost:4000/subscriptions?method=credit_card
```

#### 2.3 날짜 범위 필터

```http
GET http://localhost:4000/subscriptions?from=2025-12-01&to=2025-12-31
```

#### 2.4 일시정지 상태 필터

```http
# 일시정지된 구독만
GET http://localhost:4000/subscriptions?isPaused=true

# 활성 구독만
GET http://localhost:4000/subscriptions?isPaused=false
```

### 3. 정렬 & 페이지네이션

#### 3.1 오름차순 정렬

```http
GET http://localhost:4000/subscriptions?order=asc
```

#### 3.2 내림차순 정렬

```http
GET http://localhost:4000/subscriptions?order=desc
```

#### 3.3 페이지네이션

```http
# 첫 페이지 (10개)
GET http://localhost:4000/subscriptions?limit=10&offset=0

# 두 번째 페이지 (10개)
GET http://localhost:4000/subscriptions?limit=10&offset=10
```

### 4. 에러 처리 테스트

#### 4.1 잘못된 데이터 (400 - Zod 검증 에러)

```http
POST http://localhost:4000/subscriptions
Content-Type: application/json

{
  "name": "",
  "price": -100,
  "billingCycle": "invalid_cycle"
}
```

**예상 응답: 400 Bad Request**

```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "path": "name",
        "message": "String must contain at least 1 character(s)"
      },
      {
        "path": "price",
        "message": "Number must be greater than 0"
      }
    ]
  }
}
```

#### 4.2 존재하지 않는 구독 (404)

```http
GET http://localhost:4000/subscriptions/non-existent-id
```

**예상 응답: 404 Not Found**

#### 4.3 존재하지 않는 구독 수정 (404)

```http
PATCH http://localhost:4000/subscriptions/non-existent-id
Content-Type: application/json

{"price": 10000}
```

## 📊 테스트 데이터 생성

### 자동 Seed

```bash
npm run db:seed
```

**생성되는 데이터:**

1. Netflix (₩13,500)
2. Spotify Premium (₩10,900)
3. GitHub Pro ($4)
4. ChatGPT Plus ($20)
5. Adobe Creative Cloud (₩65,000)
6. New York Times ($4)
7. iCloud Storage (₩1,300)
8. Notion Personal Pro ($10) - _일시정지_
9. Gym Membership (₩89,000)
10. AWS ($50)

## 🔍 데이터 확인

### 방법 1: Supabase Dashboard (추천)

1. [https://supabase.com](https://supabase.com) 로그인
2. 프로젝트 선택
3. **Table Editor** 클릭
4. `User` 또는 `Subscription` 테이블 선택
5. 데이터를 직접 보고 편집 가능

### 방법 2: Prisma Studio (로컬)

```bash
npm run db:studio
```

브라우저에서 `http://localhost:5555` 자동 열림

- Supabase 데이터베이스를 로컬 GUI로 확인
- 데이터 추가/수정/삭제 가능

### 방법 3: Supabase SQL Editor

1. Supabase Dashboard → **SQL Editor**
2. 새 쿼리 작성:

```sql
-- 모든 사용자 조회
SELECT * FROM "User";

-- 모든 구독 조회
SELECT * FROM "Subscription";

-- 카테고리별 통계
SELECT category, COUNT(*), SUM(price) as total
FROM "Subscription"
GROUP BY category;

-- 다가오는 결제 (30일 이내)
SELECT name, price, currency, "nextBillingAt"
FROM "Subscription"
WHERE "nextBillingAt" BETWEEN NOW() AND NOW() + INTERVAL '30 days'
ORDER BY "nextBillingAt" ASC;
```

## 🧹 데이터 초기화

### 전체 리셋

```bash
npm run db:reset
```

**주의:** 모든 데이터가 삭제됩니다!

### 수동 삭제

```sql
-- Supabase SQL Editor에서 실행
DELETE FROM "Subscription";
DELETE FROM "User";
```

## 🐛 문제 해결

### 1. 서버가 응답하지 않음

**확인:**

```bash
# 서버 실행 확인
# 터미널에 "api listening on :4000" 표시되어야 함

# 포트 확인
netstat -ano | findstr :4000  # Windows
lsof -i :4000                  # Mac/Linux
```

### 2. 데이터베이스 연결 실패

**증상:** `Authentication failed`

**해결:**

1. `.env` 파일의 `DATABASE_URL` 확인
2. Supabase Dashboard → Settings → Database에서 비밀번호 확인
3. 서버 재시작

### 3. 테이블이 없음

**증상:** `relation "User" does not exist`

**해결:**

```bash
npm run db:push
```

또는 Supabase SQL Editor에서 수동 생성 (SUPABASE_SETUP.md 참고)

### 4. Prisma 클라이언트 오류

```bash
# Prisma 재생성
npm run db:generate

# 서버 재시작
npm run dev
```

## 📈 성능 테스트 (선택사항)

### autocannon (Node.js)

```bash
# 설치
npm install -g autocannon

# 테스트
autocannon -c 10 -d 5 http://localhost:4000/subscriptions
```

### Apache Bench

```bash
ab -n 1000 -c 10 http://localhost:4000/subscriptions
```

## 🔄 CI/CD 테스트 (향후)

### GitHub Actions 예시

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - name: Test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm test
```

## 🎯 다음 단계

- [ ] JWT 인증 테스트 추가
- [ ] 통계 API 테스트 추가
- [ ] Unit 테스트 작성 (Jest)
- [ ] Integration 테스트 작성
- [ ] E2E 테스트 작성

---

**더 많은 정보:**

- [README.md](./README.md) - 프로젝트 개요
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase 설정
