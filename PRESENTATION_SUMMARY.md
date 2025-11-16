# 🎤 발표용 프로젝트 요약

## 📌 1분 엘리베이터 피치

> "구독 경제 시대에 Netflix, Spotify 등 여러 구독 서비스를 사용하면서 매달 얼마를 쓰는지 파악하기 어려웠습니다. 그래서 모든 구독을 한 곳에서 관리하고, 다음 결제일을 추적하며, 월간/연간 지출을 계산하는 시스템을 만들었습니다."

## 🎯 프로젝트 핵심 (3줄 요약)

1. **문제**: 여러 구독 서비스 관리가 어렵고 총 지출 파악 곤란
2. **해결**: 모든 구독을 한 곳에서 관리하는 API 시스템 개발
3. **결과**: RESTful API 완성, 필터링/정렬/페이지네이션 구현

## 💻 데모 시나리오

### 시나리오 1: 구독 등록

```
"Netflix를 월 13,500원에 구독하고 있고, 다음 결제일은 12월 16일입니다."
→ POST /subscriptions로 등록
```

### 시나리오 2: 카테고리별 조회

```
"엔터테인먼트 카테고리에 얼마나 쓰고 있지?"
→ GET /subscriptions?category=Entertainment
```

### 시나리오 3: 다가오는 결제 확인

```
"12월에 결제 예정인 구독들은?"
→ GET /subscriptions?from=2025-12-01&to=2025-12-31&order=asc
```

## 🛠️ 기술 스택 선정 이유 (1분 설명)

### Backend: TypeScript + Express

**왜?**

- JavaScript 생태계의 풍부한 라이브러리
- TypeScript로 타입 안정성 확보 → 버그 사전 방지
- Express는 가장 검증된 Node.js 프레임워크

### ORM: Prisma

**왜?**

- TypeScript 타입 자동 생성 (개발 생산성 ↑)
- SQL보다 직관적인 쿼리
- Prisma Studio GUI로 데이터 관리 편리

### 검증: Zod

**왜?**

- TypeScript 타입과 런타임 검증을 하나로!
- API 요청 데이터 검증에 최적화
- 명확한 에러 메시지

### Database: Supabase

**왜?**

- 무료 PostgreSQL 호스팅
- 어디서나 접근 가능 (클라우드)
- GUI 대시보드 제공
- 자동 백업 & 관리

## 📊 구현된 기능 (기술적 하이라이트)

### 1. 동적 필터링

```typescript
// 제공된 조건만 WHERE 절에 추가
if (q.category) where.category = q.category;
if (q.method) where.paymentMethod = q.method;
if (q.from || q.to) where.nextBillingAt = { gte: q.from, lte: q.to };
```

### 2. 타입 안전한 검증

```typescript
// Zod 스키마로 런타임 검증 + TypeScript 타입 추출
const SubCreateSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  // ...
});
type SubCreateDTO = z.infer<typeof SubCreateSchema>; // 자동 타입 생성!
```

### 3. 전역 에러 핸들링

```typescript
// 모든 에러를 일관된 형식으로 처리
if (err instanceof ZodError) {
  return res.status(400).json({ error: { message: 'Validation failed', details: [...] }});
}
if (err instanceof Prisma.PrismaClientKnownRequestError) {
  // Prisma 에러를 HTTP 상태 코드로 변환
}
```

### 4. 성능 최적화

```typescript
// 병렬 쿼리로 응답 시간 단축
const [items, total] = await Promise.all([
  prisma.subscription.findMany({ where, orderBy, take, skip }),
  prisma.subscription.count({ where }),
]);
```

## 🏗️ 아키텍처 설명 (30초)

```
Client → Express Middleware → Zod 검증 → Prisma ORM → Supabase PostgreSQL
         (CORS, Helmet)      (타입 체크)  (SQL 생성)  (클라우드 DB)
```

**계층 분리:**

- `routes/`: API 엔드포인트
- `schemas/`: 데이터 검증 로직
- `middlewares/`: 공통 처리 (에러, 로깅)
- `lib/`: 외부 서비스 연결 (Prisma)

## 📈 프로젝트 진행 과정

### Phase 1: 기획 (Week 1)

- 요구사항 분석
- 기술 스택 조사 및 선정
- 데이터베이스 ERD 설계

### Phase 2: 개발 (Week 2) ✅ **현재 완료!**

- Supabase 프로젝트 설정
- Prisma 스키마 정의
- 구독 CRUD API 구현
- 필터링/정렬/페이지네이션
- 에러 핸들링
- 문서화

### Phase 3: 향후 계획 (Week 3-4)

- 사용자 인증 (JWT)
- 통계 API (월별 총액 계산)
- 프론트엔드 개발 (React/Next.js)
- 배포 (Vercel/Railway)

## 💡 배운 점

### 기술적 학습

1. **TypeScript**: 타입 시스템의 강력함 체감
2. **Prisma ORM**: SQL 없이도 효율적인 데이터베이스 작업
3. **Zod**: 런타임 타입 검증의 중요성
4. **RESTful API**: 적절한 HTTP 메서드와 상태 코드 사용

### 설계 학습

1. **계층 분리**: 관심사의 분리로 유지보수성 향상
2. **에러 처리**: 일관된 에러 응답 형식의 중요성
3. **문서화**: 코드만큼 중요한 문서의 가치

## 🚀 향후 개선 방향

### 단기 (1-2주)

- [ ] JWT 인증으로 다중 사용자 지원
- [ ] 통계 API (월별/연별 총액)
- [ ] 다가오는 결제 알림

### 중기 (1-2개월)

- [ ] 프론트엔드 개발 (대시보드)
- [ ] 결제 히스토리 추적
- [ ] CSV/PDF 내보내기

### 장기 (3-6개월)

- [ ] 모바일 앱 (React Native)
- [ ] Chrome 확장 프로그램
- [ ] AI 기반 구독 패턴 분석

## 📚 참고 문서

프로젝트에 포함된 상세 문서:

1. **PROJECT_OVERVIEW.md** - 프로젝트 개요, 기술 스택 상세 설명
2. **CODE_EXPLANATION.md** - 코드 구조 및 상세 설명
3. **README.md** - 빠른 시작 가이드
4. **SUPABASE_SETUP.md** - Supabase 연동 가이드
5. **TESTING.md** - API 테스트 방법
6. **GIT_COMMIT_GUIDE.md** - 커밋 가이드

## 🎤 발표 팁

### 시작 (1분)

- 자기소개
- 프로젝트 배경 (구독 관리의 어려움)
- 데모 화면 준비

### 본론 (3-4분)

- 주요 기능 시연 (test.http 사용)
- 기술 스택 설명 (왜 이 기술들을 선택했는지)
- 아키텍처 다이어그램 보여주기
- 코드 일부 설명 (핵심만!)

### 마무리 (1분)

- 배운 점
- 향후 계획
- Q&A

### 예상 질문 & 답변

**Q: 왜 NoSQL이 아닌 PostgreSQL을 선택했나요?**
A: 구독 데이터는 관계형 구조(User-Subscription)가 명확하고, 트랜잭션과 복잡한 쿼리(필터링, 정렬)가 필요해서 PostgreSQL이 더 적합했습니다.

**Q: Prisma 대신 다른 ORM은 고려하지 않았나요?**
A: TypeORM, Sequelize도 고려했지만, Prisma가 TypeScript 타입 추론이 가장 우수하고 개발자 경험이 좋아서 선택했습니다.

**Q: 보안은 어떻게 처리했나요?**
A: 현재는 Helmet으로 기본 보안 헤더를 설정했고, Zod로 입력 검증을 했습니다. 향후 JWT 인증과 Rate Limiting을 추가할 예정입니다.

**Q: 성능 테스트는 했나요?**
A: 아직 대규모 성능 테스트는 하지 않았지만, 인덱스 최적화와 병렬 쿼리로 기본적인 성능은 확보했습니다. 향후 부하 테스트 예정입니다.

**Q: 프론트엔드 계획은?**
A: Next.js로 개발 예정이며, 대시보드에서 차트로 통계를 시각화하고, 캘린더 뷰로 결제 일정을 한눈에 볼 수 있게 할 계획입니다.

---

**자신감 있게 발표하세요!** 잘 만든 프로젝트입니다! 🎉
