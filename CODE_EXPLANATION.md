# 💻 코드 구조 및 설명

## 📁 프로젝트 구조

```
subscription-manager-api/
├── src/
│   ├── app.ts                    # 애플리케이션 진입점
│   ├── lib/
│   │   └── prisma.ts             # Prisma 클라이언트 (싱글톤)
│   ├── routes/
│   │   └── subscription.ts       # 구독 API 라우트
│   ├── schemas/
│   │   └── subscription.ts       # Zod 검증 스키마
│   └── middlewares/
│       └── errors.ts             # 전역 에러 핸들러
├── prisma/
│   └── schema.prisma             # 데이터베이스 스키마
├── scripts/
│   └── seed.ts                   # 테스트 데이터 생성
└── test.http                     # API 테스트 파일
```

## 🔍 주요 파일 설명

### 1. `src/app.ts` - 애플리케이션 진입점

Express 서버 설정 및 미들웨어 구성

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttpImport from 'pino-http';

import subscriptions from './routes/subscription.js';
import { errorHandler } from './middlewares/errors.js';

const app = express();

// 보안 헤더 설정 (XSS, CSRF 등 방어)
app.use(helmet());

// CORS 설정 (프론트엔드에서 API 호출 허용)
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));

// JSON 요청 본문 파싱
app.use(express.json());

// HTTP 요청 로깅 (개발/프로덕션 모니터링)
app.use(pinoHttpImport());

// 라우트 등록
app.use('/subscriptions', subscriptions);

// 전역 에러 핸들러 (모든 에러를 여기서 처리)
app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`api listening on :${port}`));
```

**핵심 포인트:**

- 미들웨어 순서가 중요 (helmet → cors → json → logging → routes → error)
- `errorHandler`는 마지막에 위치 (모든 에러를 catch)

---

### 2. `src/lib/prisma.ts` - Prisma 클라이언트 (싱글톤)

데이터베이스 연결 관리

```typescript
import { PrismaClient } from '@prisma/client';

// 전역 싱글톤 패턴 (HMR 환경에서 중복 인스턴스 방지)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn'] // 개발: 모든 쿼리 로그
        : ['error'], // 프로덕션: 에러만
  });

// 개발 환경에서는 전역 객체에 저장 (HMR 시 재사용)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown: 앱 종료 시 DB 연결 정리
const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown); // Ctrl+C
process.on('SIGTERM', gracefulShutdown); // 프로세스 종료
process.on('beforeExit', () => {
  prisma.$disconnect();
});
```

**핵심 포인트:**

- **싱글톤 패턴**: 애플리케이션 전체에서 하나의 인스턴스만 사용
- **HMR 대응**: Hot Module Replacement 시 중복 연결 방지
- **Graceful Shutdown**: 서버 종료 시 DB 연결 정리로 리소스 누수 방지

---

### 3. `src/schemas/subscription.ts` - Zod 검증 스키마

런타임 데이터 검증 및 타입 정의

```typescript
import { z } from 'zod';

// Enum 정의
export const BillingCycle = z.enum(['monthly', 'weekly', 'yearly', 'custom']);
export const Currency = z.enum(['KRW', 'USD', 'EUR', 'JPY', 'GBP']);
export const PaymentMethod = z.enum([
  'credit_card',
  'debit_card',
  'bank_transfer',
  'paypal',
  'mobile_payment',
  'other',
]);

// 생성 스키마
export const SubCreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  price: z
    .number()
    .positive()
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: 'Price must have at most 2 decimal places',
    }),
  currency: Currency.default('KRW'),
  billingCycle: BillingCycle,
  intervalCount: z.number().int().min(1).max(12).default(1),
  nextBillingAt: z.coerce.date(), // 문자열을 Date로 자동 변환
  paymentMethod: PaymentMethod.optional(),
  category: z.string().max(50).trim().optional(),
  memo: z.string().max(500).trim().optional(),
  isPaused: z.boolean().default(false),
});

// 수정 스키마 (모든 필드가 optional)
export const SubUpdateSchema = SubCreateSchema.partial();

// 쿼리 파라미터 스키마
export const SubListQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  category: z.string().optional(),
  method: PaymentMethod.optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  order: z.enum(['asc', 'desc']).default('asc'),
  isPaused: z.coerce.boolean().optional(),
});

// TypeScript 타입 추출
export type SubCreateDTO = z.infer<typeof SubCreateSchema>;
export type SubUpdateDTO = z.infer<typeof SubUpdateSchema>;
export type SubListQuery = z.infer<typeof SubListQuerySchema>;
```

**핵심 포인트:**

- **z.coerce**: 문자열을 자동으로 숫자/날짜로 변환 (쿼리 파라미터 처리에 유용)
- **z.refine**: 커스텀 검증 로직 (소수점 2자리 제한)
- **z.infer**: Zod 스키마에서 TypeScript 타입 자동 추출
- **partial()**: 모든 필드를 optional로 만들어 PATCH 요청에 활용

---

### 4. `src/routes/subscription.ts` - 구독 API 라우트

모든 CRUD 엔드포인트 구현

#### 4.1 GET /subscriptions - 목록 조회

```typescript
r.get('/', async (req, res, next) => {
  try {
    // 쿼리 파라미터 검증 (Zod가 자동으로 타입 변환)
    const q = SubListQuerySchema.parse(req.query);

    // WHERE 조건 구성 (Prisma 타입 안전)
    const where: Prisma.SubscriptionWhereInput = { userId: DEMO_USER_ID };

    if (q.from || q.to) {
      where.nextBillingAt = {};
      if (q.from) where.nextBillingAt.gte = q.from;
      if (q.to) where.nextBillingAt.lte = q.to;
    }
    if (q.category) where.category = q.category;
    if (q.method) where.paymentMethod = q.method;
    if (q.isPaused !== undefined) where.isPaused = q.isPaused;

    // 정렬 기준
    const orderBy = { nextBillingAt: q.order };

    // 병렬 쿼리 (성능 최적화)
    const [items, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy,
        take: q.limit, // LIMIT
        skip: q.offset, // OFFSET
      }),
      prisma.subscription.count({ where }),
    ]);

    res.json({
      items,
      total,
      pagination: {
        limit: q.limit,
        offset: q.offset,
        hasMore: q.offset + items.length < total, // 다음 페이지 존재 여부
      },
    });
  } catch (e) {
    next(e); // 에러를 전역 핸들러로 전달
  }
});
```

**핵심 포인트:**

- **동적 WHERE 조건**: 제공된 필터만 적용
- **Promise.all**: 목록과 총 개수를 병렬로 조회 (성능 향상)
- **hasMore**: 프론트엔드에서 "더 보기" 버튼 표시 여부 판단

#### 4.2 POST /subscriptions - 구독 생성

```typescript
r.post('/', async (req, res, next) => {
  try {
    // 요청 본문 검증
    const body = SubCreateSchema.parse(req.body);

    // undefined 값 제거 (Prisma 호환성)
    const dataWithUser = { userId: DEMO_USER_ID, ...body };
    const data = Object.fromEntries(
      Object.entries(dataWithUser).filter(([, value]) => value !== undefined),
    );

    const created = await prisma.subscription.create({
      data: data as Prisma.SubscriptionUncheckedCreateInput,
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});
```

**핵심 포인트:**

- **undefined 필터링**: TypeScript의 `exactOptionalPropertyTypes`로 인한 타입 문제 해결
- **201 Created**: RESTful 규칙에 따른 적절한 상태 코드

#### 4.3 PATCH /subscriptions/:id - 구독 수정

```typescript
r.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = SubUpdateSchema.parse(req.body);

    // undefined 필드 제거 (제공된 필드만 업데이트)
    const data = Object.fromEntries(
      Object.entries(body).filter(([, value]) => value !== undefined),
    );

    const updated = await prisma.subscription.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (e) {
    // Prisma P2025 에러: Record not found
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    next(e);
  }
});
```

**핵심 포인트:**

- **부분 업데이트**: 제공된 필드만 수정 (undefined 필드는 무시)
- **Prisma 에러 처리**: 특정 에러 코드(P2025)를 404로 변환

---

### 5. `src/middlewares/errors.ts` - 전역 에러 핸들러

모든 에러를 일관된 형식으로 처리

```typescript
import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError, type ZodIssue } from 'zod';

export function errorHandler(
  err: CustomError | ZodError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Zod 검증 에러 (400 Bad Request)
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: err.issues.map((e: ZodIssue) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  // Prisma 에러
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // 유니크 제약 조건 위반 (409 Conflict)
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: {
          message: 'Unique constraint violation',
          field: (err.meta?.target as string[])?.join(', '),
        },
      });
    }
    // 외래키 제약 조건 위반 (400 Bad Request)
    if (err.code === 'P2003') {
      return res.status(400).json({
        error: { message: 'Foreign key constraint failed' },
      });
    }
  }

  // 커스텀 에러 (status 포함)
  if ('status' in err && typeof err.status === 'number') {
    return res.status(err.status).json({
      error: { message: err.message ?? 'Error' },
    });
  }

  // 기본 500 에러
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: { message: 'Internal Server Error' },
  });
}
```

**핵심 포인트:**

- **계층적 에러 처리**: 구체적인 에러부터 일반적인 에러 순으로 처리
- **사용자 친화적 메시지**: Zod 에러를 필드별로 상세하게 전달
- **Prisma 에러 변환**: 데이터베이스 에러를 HTTP 상태 코드로 매핑

---

### 6. `prisma/schema.prisma` - 데이터베이스 스키마

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String?  @unique
  createdAt DateTime @default(now())
  subs      Subscription[]  // 관계 정의
}

model Subscription {
  id            String   @id @default(uuid())
  userId        String
  name          String
  price         Decimal  @db.Decimal(10,2)  // 정확한 금액 표현
  currency      String   @default("KRW")
  billingCycle  String
  intervalCount Int      @default(1)
  nextBillingAt DateTime
  paymentMethod String?
  category      String?
  memo          String?
  isPaused      Boolean  @default(false)
  createdAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id])  // 외래키

  // 복합 인덱스 (쿼리 성능 최적화)
  @@index([userId, nextBillingAt])
  @@index([userId, category])
}
```

**핵심 포인트:**

- **Decimal 타입**: Float의 부정확성 문제 해결 (금액에 적합)
- **복합 인덱스**: 자주 사용하는 필터 조건에 대한 성능 최적화
- **@default**: 데이터베이스 레벨의 기본값

---

## 🔄 데이터 흐름

### 요청 처리 흐름

```
1. Client → HTTP Request
   ↓
2. Express Middleware Stack
   - helmet (보안 헤더)
   - cors (CORS 처리)
   - express.json() (JSON 파싱)
   - pino-http (로깅)
   ↓
3. Router (subscription.ts)
   - URL 패턴 매칭
   - 파라미터 추출
   ↓
4. Zod Schema Validation
   - 데이터 검증
   - 타입 변환
   ↓
5. Prisma Client
   - SQL 쿼리 생성
   - 데이터베이스 실행
   ↓
6. Response
   - JSON 직렬화
   - HTTP 응답
```

### 에러 처리 흐름

```
Error 발생
   ↓
next(error) 호출
   ↓
errorHandler Middleware
   ↓
instanceof 체크
   ↓
적절한 HTTP 상태 코드 & 메시지
   ↓
Client에게 응답
```

---

## 🎯 코드 품질 관리

### TypeScript 설정 (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true, // 엄격한 타입 체킹
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist"
  }
}
```

### ESLint + Prettier

- **ESLint**: 코드 품질 규칙 (unused vars, 타입 체크 등)
- **Prettier**: 코드 포맷팅 자동화

---

## 💡 모범 사례 (Best Practices)

### 1. 환경 변수 관리

```typescript
const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-default-id';
```

- Fallback 값 제공으로 안전성 확보

### 2. 타입 안정성

```typescript
const where: Prisma.SubscriptionWhereInput = { ... };
```

- Prisma 타입 활용으로 컴파일 타임 에러 감지

### 3. 에러 처리

```typescript
try {
  // 비즈니스 로직
} catch (e) {
  next(e); // 전역 핸들러로 전달
}
```

- 일관된 에러 처리 패턴

### 4. 코드 재사용

```typescript
const data = Object.fromEntries(
  Object.entries(body).filter(([, value]) => value !== undefined),
);
```

- POST와 PATCH에서 동일한 undefined 필터링 로직 사용

---

## 🚀 성능 최적화

### 1. Connection Pooling

- Supabase Pooler 사용 (Transaction Mode)
- 효율적인 데이터베이스 연결 관리

### 2. 병렬 쿼리

```typescript
const [items, total] = await Promise.all([...]);
```

- 독립적인 쿼리를 동시에 실행

### 3. 인덱스 활용

```prisma
@@index([userId, nextBillingAt])
```

- 자주 사용하는 필터/정렬 조건에 인덱스

### 4. Pagination

```typescript
take: q.limit,
skip: q.offset,
```

- 대량 데이터를 나눠서 조회

---

**이 코드베이스는 확장 가능하고 유지보수하기 쉬운 구조로 설계되었습니다!** 🎉
