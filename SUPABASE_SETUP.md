# 🚀 Supabase 설정 가이드

## Supabase란?

Supabase는 Firebase의 오픈소스 대안으로, PostgreSQL 데이터베이스를 클라우드에서 제공하는 서비스입니다.

**장점:**

- ✅ 무료 플랜 제공
- ✅ 자동 백업 & 관리
- ✅ GUI 대시보드
- ✅ Realtime, Auth, Storage 기능 내장
- ✅ 어디서나 접근 가능

## 📝 1단계: Supabase 프로젝트 생성

### 1. Supabase 계정 생성

1. [https://supabase.com](https://supabase.com) 접속
2. **Start your project** 클릭
3. GitHub 계정으로 로그인

### 2. 새 프로젝트 생성

1. **New Project** 클릭
2. 프로젝트 정보 입력:
   - **Name**: `subscription-manager` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 (꼭 저장하세요! 📝)
   - **Region**: `Northeast Asia (Seoul)` 추천
   - **Pricing Plan**: `Free` 선택
3. **Create new project** 클릭
4. 프로젝트 생성 대기 (1-2분 소요)

## 🔑 2단계: DATABASE_URL 가져오기

### 방법 1: Transaction Mode (추천 - API 서버용)

1. Supabase Dashboard에서 **Settings** (왼쪽 하단 톱니바퀴 아이콘)
2. **Database** 클릭
3. **Connection String** 섹션에서 **Transaction mode** 탭 선택
4. **Connection string** 복사

형식:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
```

### 방법 2: Direct Connection

**Session mode** 탭에서 복사 (Transaction mode가 더 안정적이므로 위 방법 추천)

## ⚙️ 3단계: 환경 변수 설정

### 프로젝트 루트에 `.env` 파일 생성

```env
# Database (Supabase)
DATABASE_URL="여기에_복사한_CONNECTION_STRING_붙여넣기"

# Server
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# Demo User
DEMO_USER_ID=demo-user-123
```

**⚠️ 주의사항:**

- `[PASSWORD]` 부분을 실제 비밀번호로 교체하세요
- 따옴표(`"`)로 감싸야 합니다
- `.env` 파일은 절대 Git에 커밋하지 마세요 (.gitignore에 이미 추가됨)

## 🗄️ 4단계: 데이터베이스 테이블 생성

### Prisma로 자동 생성

```bash
# 1. Prisma 클라이언트 생성
npm run db:generate

# 2. 데이터베이스에 스키마 적용
npm run db:push
```

### Supabase SQL Editor로 수동 생성 (선택사항)

1. Supabase Dashboard → **SQL Editor**
2. **New query** 클릭
3. 아래 SQL 실행:

```sql
-- User 테이블
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Subscription 테이블
CREATE TABLE IF NOT EXISTS "Subscription" (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'KRW',
    "billingCycle" TEXT NOT NULL,
    "intervalCount" INTEGER NOT NULL DEFAULT 1,
    "nextBillingAt" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT,
    category TEXT,
    memo TEXT,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS "Subscription_userId_nextBillingAt_idx"
    ON "Subscription"("userId", "nextBillingAt");
CREATE INDEX IF NOT EXISTS "Subscription_userId_category_idx"
    ON "Subscription"("userId", category);

-- 데모 사용자 생성
INSERT INTO "User" (id, email, "createdAt")
VALUES ('demo-user-123', 'demo@example.com', NOW())
ON CONFLICT (id) DO NOTHING;
```

4. **RUN** 클릭

## 👤 5단계: 데모 사용자 생성

```bash
# Option 1: Seed 스크립트 실행 (추천)
npm run db:seed

# Option 2: Supabase SQL Editor
# 위 4단계의 SQL에 이미 포함되어 있음
```

## 🚀 6단계: 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:4000`에서 실행됩니다!

## ✅ 7단계: 테스트

### Health Check

브라우저에서:

```
http://localhost:4000/health
```

### VS Code REST Client

`test.http` 파일 열기 → "Send Request" 클릭

### curl

```bash
# Health check
curl http://localhost:4000/health

# 구독 목록
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
```

## 🎨 8단계: Supabase Dashboard 활용

### Table Editor

1. Dashboard → **Table Editor**
2. 데이터를 직접 보고 편집 가능
3. 행 추가/수정/삭제 GUI로 가능

### SQL Editor

1. Dashboard → **SQL Editor**
2. 복잡한 쿼리 실행
3. 쿼리 저장 가능

### Database

1. Dashboard → **Database** → **Backups**
2. 자동 백업 확인
3. Point-in-time Recovery 가능

## 🔍 문제 해결

### 1. 연결 실패: "Authentication failed"

**원인:** DATABASE_URL의 비밀번호가 잘못됨

**해결:**

1. Supabase Dashboard → Settings → Database
2. **Reset database password**
3. 새 비밀번호로 `.env` 파일 업데이트
4. 서버 재시작

### 2. 테이블이 생성되지 않음

**해결:**

```bash
# 강제로 재생성
npm run db:push
```

또는 Supabase SQL Editor에서 수동 실행

### 3. "relation does not exist" 에러

**원인:** 테이블이 생성되지 않았거나 스키마가 다름

**해결:**

```bash
# 데이터베이스 리셋
npm run db:reset

# 또는 Supabase SQL Editor에서 테이블 삭제 후 재생성
DROP TABLE IF EXISTS "Subscription" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
```

그 후 다시 `npm run db:push`

### 4. Prisma Studio로 데이터 확인

```bash
npm run db:studio
```

브라우저에서 `http://localhost:5555` 열림

- Supabase 데이터베이스를 로컬에서 GUI로 확인/편집 가능

## 📊 Supabase 무료 플랜 제한

- **Database**: 500 MB
- **File Storage**: 1 GB
- **Bandwidth**: 2 GB/월
- **API Requests**: 제한 없음 (Rate limit 적용)

**팁:** 개발용으로는 충분합니다! 나중에 프로덕션 배포 시 Pro 플랜 고려

## 🔒 보안 팁

### DATABASE_URL 보호

1. ✅ `.env` 파일은 절대 Git에 푸시하지 않기
2. ✅ GitHub에 올릴 때 `.env.example` 사용
3. ✅ 팀원과 공유 시 안전한 방법 사용 (1Password, 비밀 메시지 등)

### Supabase Row Level Security (RLS)

나중에 사용자 인증 추가 시:

1. Supabase Dashboard → **Authentication**
2. Table Editor → 각 테이블 → **RLS enabled**
3. 정책 추가로 사용자별 데이터 접근 제어

## 🎯 다음 단계

1. ✅ `npm run db:seed`로 테스트 데이터 추가
2. ✅ `test.http`로 API 테스트
3. ✅ Supabase Dashboard에서 데이터 확인
4. 📱 프론트엔드 개발 시작!

## 📚 유용한 링크

- [Supabase 공식 문서](https://supabase.com/docs)
- [Prisma + Supabase 가이드](https://supabase.com/docs/guides/integrations/prisma)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

**문제가 생기면:**

1. Supabase Dashboard의 Logs 확인
2. 서버 터미널의 에러 메시지 확인
3. `npm run db:studio`로 데이터 확인
