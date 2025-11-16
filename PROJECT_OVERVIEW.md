# 📋 프로젝트 개요

## 🎯 프로젝트 목표

구독 경제 시대에 개인이 이용 중인 여러 구독 서비스(Netflix, Spotify, 앱 구독 등)를 체계적으로 관리하고, 다음 결제 예정일과 월간/연간 총 구독료를 계산하여 구독 지출을 효율적으로 관리할 수 있는 시스템 개발

## 💡 주요 기능

### 현재 구현된 기능 (v1.0)

#### 1. 구독 관리 (CRUD)

- ✅ 구독 생성: 서비스명, 가격, 통화, 결제 주기, 다음 결제일 등록
- ✅ 구독 조회: 전체 목록 및 개별 구독 상세 정보
- ✅ 구독 수정: 가격 변경, 메모 추가, 일시정지 등
- ✅ 구독 삭제: 해지한 서비스 제거

#### 2. 데이터 필터링 & 정렬

- ✅ 카테고리별 필터링 (Entertainment, Development, Health 등)
- ✅ 결제 수단별 필터링 (신용카드, 계좌이체 등)
- ✅ 날짜 범위 필터링 (특정 기간 내 결제 예정 구독)
- ✅ 일시정지 상태 필터링
- ✅ 다음 결제일 기준 정렬 (오름차순/내림차순)

#### 3. 페이지네이션

- ✅ Limit & Offset 기반 페이지네이션
- ✅ 총 개수 및 다음 페이지 존재 여부 제공

#### 4. 데이터 검증

- ✅ Zod 스키마 기반 런타임 검증
- ✅ TypeScript 타입 안정성
- ✅ 상세한 에러 메시지

### 향후 구현 예정 (v2.0)

- [ ] 사용자 인증 (JWT)
- [ ] 통계 대시보드 (월별/연별 총액 계산)
- [ ] 결제 알림 기능 (7일 전 알림)
- [ ] 결제 히스토리 추적
- [ ] CSV/PDF 내보내기
- [ ] 다중 통화 자동 환율 변환

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│            (React/Next.js - 예정)               │
└────────────────┬────────────────────────────────┘
                 │ REST API (JSON)
                 ↓
┌─────────────────────────────────────────────────┐
│              Backend API Server                  │
│         (Express.js + TypeScript)                │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   Routes     │  │ Middlewares  │            │
│  │ subscription │  │    errors    │            │
│  └──────┬───────┘  └──────────────┘            │
│         │                                       │
│  ┌──────▼───────┐  ┌──────────────┐            │
│  │   Schemas    │  │   Prisma     │            │
│  │   (Zod)      │  │   Client     │            │
│  └──────────────┘  └──────┬───────┘            │
└─────────────────────────────┼───────────────────┘
                              │ SQL Queries
                              ↓
┌─────────────────────────────────────────────────┐
│         Supabase PostgreSQL Database             │
│                                                  │
│  ┌──────────────┐  ┌──────────────────────┐    │
│  │  User        │  │    Subscription      │    │
│  │  - id        │  │    - id              │    │
│  │  - email     │  │    - userId (FK)     │    │
│  │  - createdAt │  │    - name            │    │
│  └──────────────┘  │    - price           │    │
│                    │    - currency        │    │
│                    │    - billingCycle    │    │
│                    │    - nextBillingAt   │    │
│                    │    - category        │    │
│                    │    - isPaused        │    │
│                    └──────────────────────┘    │
└─────────────────────────────────────────────────┘
```

## 🛠️ 기술 스택 선정 이유

### Backend

#### 1. **Node.js + TypeScript**

**선정 이유:**

- JavaScript/TypeScript 생태계의 풍부한 라이브러리
- 비동기 I/O로 동시 다발적 요청 처리에 효율적
- 타입 안정성으로 런타임 에러 사전 방지
- 프론트엔드와 언어 통일 가능 (풀스택 개발 용이)

#### 2. **Express.js**

**선정 이유:**

- 가장 성숙한 Node.js 웹 프레임워크
- 미들웨어 생태계 풍부 (CORS, Helmet, 로깅 등)
- 간단하고 직관적인 라우팅
- 대규모 커뮤니티와 문서

#### 3. **Prisma ORM**

**선정 이유:**

- TypeScript 친화적 (자동 타입 생성)
- 직관적인 쿼리 API (SQL 대비 생산성 향상)
- 자동 마이그레이션 관리
- Supabase와 완벽한 호환성
- Prisma Studio GUI 제공

**대안 대비 장점:**

- vs Sequelize: 더 나은 TypeScript 지원
- vs TypeORM: 더 간단한 API, 더 빠른 성능
- vs Raw SQL: 타입 안정성, 생산성, 유지보수성

#### 4. **Zod (데이터 검증)**

**선정 이유:**

- TypeScript 타입을 런타임 검증으로 변환
- API 요청 데이터 검증에 최적화
- 명확한 에러 메시지
- Prisma와 완벽한 타입 호환

**대안 대비 장점:**

- vs Joi: TypeScript 타입 추론 우수
- vs class-validator: 더 간결한 문법
- vs Yup: 더 나은 성능

### Database

#### 5. **Supabase (PostgreSQL)**

**선정 이유:**

- 무료 호스팅 (개발/테스트에 충분)
- 자동 백업 및 관리
- GUI 대시보드 제공 (SQL Editor, Table Editor)
- 실시간 기능 내장 (향후 확장 가능)
- RESTful API 자동 생성 (선택사항)
- PostgreSQL의 강력한 기능 (JSON, Full-text search 등)

**대안 대비 장점:**

- vs 로컬 Docker PostgreSQL: 어디서나 접근 가능, 관리 불필요
- vs MySQL: 더 풍부한 데이터 타입, JSON 지원 우수
- vs MongoDB: 관계형 데이터에 적합, 트랜잭션 지원

### DevOps & Tools

#### 6. **pino-http (로깅)**

**선정 이유:**

- 매우 빠른 성능 (JSON 로깅)
- 프로덕션 환경에 최적화
- 구조화된 로그 (분석 용이)

#### 7. **Helmet (보안)**

**선정 이유:**

- HTTP 헤더 보안 자동 설정
- Express 표준 보안 미들웨어
- XSS, CSRF 등 기본 보안 제공

## 📊 데이터 모델 설계

### User (사용자)

```typescript
{
  id: UUID (Primary Key)
  email: string (Unique, Optional)
  createdAt: DateTime
}
```

### Subscription (구독)

```typescript
{
  id: UUID (Primary Key)
  userId: UUID (Foreign Key → User)
  name: string              // 구독 서비스 이름
  price: Decimal(10,2)      // 가격
  currency: string          // 통화 (KRW, USD, EUR, JPY, GBP)
  billingCycle: enum        // monthly, weekly, yearly, custom
  intervalCount: int        // 주기 간격 (기본 1)
  nextBillingAt: DateTime   // 다음 결제일
  paymentMethod: string     // 결제 수단
  category: string          // 카테고리
  memo: string              // 메모
  isPaused: boolean         // 일시정지 여부
  createdAt: DateTime
}
```

### 인덱스 전략

```sql
-- 자주 사용되는 쿼리 최적화
INDEX (userId, nextBillingAt)  -- 사용자별 결제일 정렬
INDEX (userId, category)       -- 사용자별 카테고리 필터링
```

## 🔄 개발 프로세스

### 1. 요구사항 분석

- 구독 서비스 증가로 인한 관리 필요성 인식
- 주요 기능 정의 (CRUD, 필터링, 통계)

### 2. 기술 스택 선정

- TypeScript 기반 풀스택 개발 결정
- Prisma + Supabase 조합 선택

### 3. 데이터베이스 설계

- ERD 작성
- Prisma Schema 정의
- 마이그레이션 전략 수립

### 4. API 개발

- RESTful API 설계
- Zod 스키마 정의
- Express 라우터 구현

### 5. 테스트 & 문서화

- test.http로 API 테스트
- README 및 가이드 문서 작성

### 6. 배포 준비

- 환경 변수 관리
- 에러 핸들링 강화
- 보안 미들웨어 적용

## 🎓 학습 포인트

이 프로젝트를 통해 습득한 기술:

### Backend 개발

- ✅ RESTful API 설계 원칙
- ✅ MVC 패턴 (Controller-Service-Model)
- ✅ 미들웨어 패턴
- ✅ 에러 핸들링 전략

### 데이터베이스

- ✅ ORM 사용법 (Prisma)
- ✅ 데이터 모델링
- ✅ 인덱스 최적화
- ✅ 마이그레이션 관리

### TypeScript

- ✅ 타입 시스템 활용
- ✅ 제네릭 사용
- ✅ 런타임 타입 검증 (Zod)

### DevOps

- ✅ 클라우드 데이터베이스 사용 (Supabase)
- ✅ 환경 변수 관리
- ✅ 로깅 및 모니터링

## 📈 성능 고려사항

### 현재 구현

- Connection Pooling (Supabase Pooler)
- 인덱스 최적화
- Pagination으로 대량 데이터 처리

### 향후 개선 계획

- Redis 캐싱
- GraphQL API (선택적 쿼리)
- 배치 처리 (월별 통계)

## 🔐 보안 고려사항

### 현재 적용

- ✅ Helmet (HTTP 헤더 보안)
- ✅ CORS 설정
- ✅ 입력 데이터 검증 (Zod)
- ✅ SQL Injection 방지 (Prisma)

### 향후 적용 예정

- [ ] JWT 인증
- [ ] Rate Limiting
- [ ] HTTPS 강제
- [ ] 환경 변수 암호화

## 🚀 배포 계획

### 단계 1: Backend 배포

- Vercel / Railway / Render
- 환경 변수 설정
- CI/CD 파이프라인

### 단계 2: Frontend 개발 & 배포

- React/Next.js
- Vercel 배포

### 단계 3: 도메인 연결

- 커스텀 도메인
- HTTPS 설정

## 📝 프로젝트 타임라인

- **Week 1**: 기술 스택 선정 및 환경 설정
- **Week 2**: 데이터베이스 설계 및 API 개발 ✅
- **Week 3**: 프론트엔드 개발 (예정)
- **Week 4**: 테스트 및 배포 (예정)

## 🎯 향후 확장 가능성

1. **모바일 앱** (React Native)
2. **Chrome 확장 프로그램** (구독 자동 감지)
3. **결제 연동** (실제 결제 추적)
4. **AI 분석** (구독 패턴 분석 및 추천)
5. **공유 기능** (가족/팀 구독 관리)

---

**현재 상태:** MVP (Minimum Viable Product) 완성 ✅  
**다음 단계:** 사용자 인증 및 프론트엔드 개발
