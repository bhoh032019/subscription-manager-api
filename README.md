# Subscription Manager API

구독제 서비스들을 관리하고 다음 결제 예정일과 총 구독료를 계산해주는 백엔드 API

## ✨ 주요 기능

- 📝 구독 CRUD (생성, 조회, 수정, 삭제)
- 🔍 필터링 (카테고리, 결제 수단, 날짜 범위, 일시정지 상태)
- 📊 페이지네이션 & 정렬
- 💰 다중 통화 지원 (KRW, USD, EUR, JPY, GBP)
- 🔒 타입 안전 (TypeScript + Zod + Prisma)
- ⚡ 빠른 개발 환경 (Hot Reload)
- ☁️ Supabase PostgreSQL (클라우드 데이터베이스)

## 🚀 빠른 시작 (5분)

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- Supabase 계정 (무료)

### 1단계: 프로젝트 설치

```bash
# 저장소 클론
git clone https://github.com/bhoh032019/subscription-manager-api.git
cd subscription-manager-api

# 의존성 설치
npm install
```

### 2단계: Supabase 설정

1. [https://supabase.com](https://supabase.com)에서 계정 생성
2. 새 프로젝트 생성
3. **Settings** → **Database** → **Connection String** (Transaction mode) 복사

상세 가이드: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### 3단계: 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```env
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT]:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
PORT=4000
NODE_ENV=development
CORS_ORIGIN=*
DEMO_USER_ID=demo-user-123
```

### 4단계: 데이터베이스 초기화

```bash
# Prisma 클라이언트 생성 & 테이블 생성
npm run setup
```

### 5단계: 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:4000`에서 실행됩니다! 🎉

### 6단계: 테스트

브라우저에서:

```
http://localhost:4000/health
```

또는 `test.http` 파일을 VS Code에서 열어서 테스트하세요!

## 📡 API 엔드포인트

### 구독 관리

| Method | Endpoint             | Description    |
| ------ | -------------------- | -------------- |
| GET    | `/subscriptions`     | 구독 목록 조회 |
| GET    | `/subscriptions/:id` | 특정 구독 조회 |
| POST   | `/subscriptions`     | 새 구독 생성   |
| PATCH  | `/subscriptions/:id` | 구독 수정      |
| DELETE | `/subscriptions/:id` | 구독 삭제      |

### 쿼리 파라미터 (GET /subscriptions)

```
?from=2025-12-01          # 시작일 필터
?to=2025-12-31            # 종료일 필터
?category=Entertainment   # 카테고리 필터
?method=credit_card       # 결제 수단 필터
?isPaused=false           # 일시정지 상태 필터
?order=asc                # 정렬 (asc/desc)
?limit=20                 # 페이지당 항목 수
?offset=0                 # 페이지 오프셋
```

## 🧪 테스트 방법

### 방법 1: VS Code REST Client (추천)

1. VS Code에서 [REST Client 확장](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 설치
2. `test.http` 파일 열기
3. 각 요청 위의 "Send Request" 클릭

### 방법 2: curl

```bash
# 구독 생성
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

# 구독 목록 조회
curl http://localhost:4000/subscriptions
```

자세한 테스트 방법은 [TESTING.md](./TESTING.md) 참고

## 🛠️ 개발 명령어

```bash
# 개발 서버 (Hot Reload)
npm run dev

# 프로덕션 빌드
npm run build
npm start

# 데이터베이스 관리
npm run db:generate         # Prisma 클라이언트 생성
npm run db:push             # 스키마 동기화 (개발용)
npm run db:migrate          # 마이그레이션 생성 (프로덕션용)
npm run db:studio           # Prisma Studio 실행 (GUI)
npm run db:seed             # 테스트 데이터 생성
npm run db:reset            # 데이터베이스 초기화

# 코드 품질
npm run lint                # ESLint 실행
npm run format              # Prettier 실행
```

## 📦 기술 스택

### 백엔드

- **Runtime**: Node.js 18+
- **Framework**: Express 5
- **Language**: TypeScript
- **ORM**: Prisma
- **Validation**: Zod
- **Database**: PostgreSQL (Supabase)

### 도구

- **Dev Server**: tsx (Hot Reload)
- **Linting**: ESLint + Prettier
- **Security**: Helmet
- **CORS**: cors
- **Logging**: pino-http

## 📁 프로젝트 구조

```
subscription-manager-api/
├── src/
│   ├── app.ts                    # Express 앱 진입점
│   ├── lib/
│   │   └── prisma.ts             # Prisma 클라이언트 (싱글톤)
│   ├── routes/
│   │   └── subscription.ts       # 구독 API 라우트
│   ├── schemas/
│   │   └── subscription.ts       # Zod 검증 스키마
│   └── middlewares/
│       └── errors.ts             # 에러 핸들러
├── prisma/
│   └── schema.prisma             # 데이터베이스 스키마
├── scripts/
│   └── seed.ts                   # 테스트 데이터 생성
├── test.http                     # REST Client 테스트 파일
├── SUPABASE_SETUP.md             # Supabase 설정 가이드
├── TESTING.md                    # 테스트 가이드
└── package.json
```

## 🔍 데이터 모델

### User (사용자)

```typescript
{
  id: string(UUID);
  email: string(optional, unique);
  createdAt: DateTime;
}
```

### Subscription (구독)

```typescript
{
  id: string(UUID);
  userId: string;
  name: string; // 구독 서비스 이름
  price: Decimal; // 가격
  currency: string; // 통화 (KRW, USD, EUR, JPY, GBP)
  billingCycle: string; // monthly, weekly, yearly, custom
  intervalCount: number; // 주기 (기본 1)
  nextBillingAt: DateTime; // 다음 결제일
  paymentMethod: string; // 결제 수단
  category: string; // 카테고리
  memo: string; // 메모
  isPaused: boolean; // 일시정지 여부
  createdAt: DateTime;
}
```

## 📊 Supabase 활용

### Dashboard 기능

- **Table Editor**: 데이터를 GUI로 확인/편집
- **SQL Editor**: 복잡한 쿼리 실행
- **Database**: 백업 및 복구
- **Logs**: 실시간 로그 모니터링

### Prisma Studio (로컬)

```bash
npm run db:studio
```

브라우저에서 `http://localhost:5555`로 Supabase 데이터베이스를 로컬에서 확인/편집 가능

## 🐛 문제 해결

### 데이터베이스 연결 실패

**에러:** `Authentication failed`

**해결:**

1. `.env` 파일의 `DATABASE_URL` 확인
2. Supabase Dashboard에서 비밀번호 리셋
3. 서버 재시작

### Prisma 클라이언트 오류

```bash
# Prisma 재생성
npm run db:generate

# 캐시 삭제 후 재시도
rm -rf node_modules/.prisma
npm run db:generate
```

### 테이블이 생성되지 않음

```bash
# 강제로 스키마 푸시
npm run db:push

# 또는 Supabase SQL Editor에서 수동 생성
# SUPABASE_SETUP.md의 SQL 참고
```

## 🔒 보안

### 환경 변수 관리

- ✅ `.env` 파일은 절대 Git에 커밋하지 않기 (.gitignore에 포함됨)
- ✅ 프로덕션 환경에서는 환경 변수 서비스 사용 (Vercel, Railway 등)
- ✅ DATABASE_URL은 안전하게 보관

### Supabase Row Level Security (추후)

사용자 인증 구현 시 RLS 정책 추가 예정

## 🎯 로드맵

- [x] 기본 CRUD API
- [x] Zod 검증
- [x] Supabase 연동
- [ ] JWT 기반 사용자 인증
- [ ] 통계 API (월별/연별 총액 계산)
- [ ] 다가오는 결제 알림 기능
- [ ] 웹훅 (결제 전 알림)
- [ ] Unit & Integration 테스트
- [ ] OpenAPI (Swagger) 문서
- [ ] GitHub Actions CI/CD

## 📚 참고 문서

- [Supabase 설정](./SUPABASE_SETUP.md)
- [테스트 가이드](./TESTING.md)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Supabase 공식 문서](https://supabase.com/docs)

## 👤 Author

[@bhoh032019](https://github.com/bhoh032019)


