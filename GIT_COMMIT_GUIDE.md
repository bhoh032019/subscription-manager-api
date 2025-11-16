# 📝 Git 커밋 가이드

## 🎯 추천 커밋 메시지

### Option 1: 간결한 버전

```bash
git add .
git commit -m "feat: 구독 관리 API 초기 구현

- Express + TypeScript 백엔드 구조 설정
- Supabase PostgreSQL 연동
- Prisma ORM 설정
- 구독 CRUD API 완성 (생성/조회/수정/삭제)
- Zod 데이터 검증
- 필터링, 정렬, 페이지네이션 구현
- 전역 에러 핸들링
- API 문서화 및 테스트 파일

Tech Stack: Node.js, TypeScript, Express, Prisma, Zod, Supabase"
```

### Option 2: 상세한 버전 (발표/설명용)

```bash
git add .
git commit -m "feat: Subscription Manager API v1.0 - MVP 완성

🎯 프로젝트 개요
구독 서비스들을 체계적으로 관리하고 다음 결제일과 총 구독료를 계산하는 시스템

✨ 구현된 기능
- 구독 CRUD (Create, Read, Update, Delete)
- 다양한 필터링 (카테고리, 결제수단, 날짜범위, 일시정지상태)
- 정렬 및 페이지네이션
- 실시간 데이터 검증 (Zod)
- 전역 에러 핸들링

🛠️ 기술 스택
Backend:
- Node.js 22 + TypeScript 5.9
- Express 5.1 (웹 프레임워크)
- Prisma 6.17 (ORM)
- Zod 4.1 (데이터 검증)

Database:
- Supabase PostgreSQL (클라우드 호스팅)

Security & Tools:
- Helmet (보안 헤더)
- pino-http (로깅)
- ESLint + Prettier (코드 품질)

📁 프로젝트 구조
src/
├── app.ts              # Express 앱 진입점
├── lib/prisma.ts       # Prisma 싱글톤
├── routes/             # API 라우트
├── schemas/            # Zod 검증 스키마
└── middlewares/        # 에러 핸들러

📚 문서
- PROJECT_OVERVIEW.md   # 프로젝트 개요 및 기술 스택 선정 이유
- CODE_EXPLANATION.md   # 코드 구조 상세 설명
- SUPABASE_SETUP.md     # Supabase 설정 가이드
- TESTING.md            # API 테스트 가이드
- README.md             # 빠른 시작 가이드

🎓 학습 포인트
- RESTful API 설계
- TypeScript 타입 시스템
- ORM 활용 (Prisma)
- 클라우드 데이터베이스 연동
- 에러 핸들링 전략"
```

### Option 3: Conventional Commits 형식

```bash
git add .
git commit -m "feat: implement subscription management API

BREAKING CHANGE: Initial implementation

Features:
- Add subscription CRUD endpoints
- Add filtering by category, payment method, date range
- Add sorting and pagination
- Add Zod schema validation
- Add global error handling

Tech Stack:
- Runtime: Node.js 22, TypeScript 5.9
- Framework: Express 5.1
- ORM: Prisma 6.17
- Validation: Zod 4.1
- Database: Supabase PostgreSQL
- Security: Helmet, CORS
- Logging: pino-http

Documentation:
- Add PROJECT_OVERVIEW.md
- Add CODE_EXPLANATION.md
- Add SUPABASE_SETUP.md
- Add TESTING.md
- Add comprehensive README.md"
```

## 📋 커밋 전 체크리스트

### 필수 확인 사항

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] `node_modules/` 가 `.gitignore`에 포함되어 있는지 확인
- [ ] 모든 임시 파일 제거 (`.sql`, 테스트 스크립트 등)
- [ ] 린팅 에러 없는지 확인: `npm run lint`
- [ ] 빌드 성공하는지 확인: `npm run build`
- [ ] 서버 정상 실행되는지 확인: `npm run dev`

### 문서 확인

- [ ] README.md 업데이트 완료
- [ ] API 테스트 파일 (test.http) 작동 확인
- [ ] 환경 변수 예시 제공 (`.env.example` 대신 문서에 명시)

### 보안 확인

- [ ] DATABASE_URL이 코드에 하드코딩되지 않았는지
- [ ] API 키나 비밀번호가 노출되지 않았는지
- [ ] `.gitignore`가 제대로 작동하는지

## 🚀 Git 명령어 순서

### 1. 상태 확인

```bash
git status
```

### 2. 불필요한 파일 제거

```bash
# 임시 파일 제거
rm -f *.sql
rm -f test-*.ts
rm -f test-*.ps1

# .gitignore 확인
cat .gitignore
```

### 3. 변경사항 추가

```bash
# 모든 파일 추가
git add .

# 또는 선택적으로 추가
git add src/
git add prisma/
git add *.md
git add package.json
git add tsconfig.json
git add test.http
```

### 4. 커밋

```bash
# 위의 추천 메시지 중 선택
git commit -m "feat: 구독 관리 API 초기 구현

- Express + TypeScript 백엔드 구조 설정
- Supabase PostgreSQL 연동
..."
```

### 5. 원격 저장소에 푸시

```bash
# 첫 푸시
git push -u origin main

# 이후 푸시
git push
```

## 📊 .gitignore 확인

현재 `.gitignore`:

```
node_modules
dist
.env
.env.*
```

필요시 추가:

```
# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Temp files
*.tmp
*.temp

# Test files (선택사항)
test-*.ts
test-*.ps1
*.sql
```

## 🎤 발표 준비 체크리스트

### 문서 준비

- [ ] PROJECT_OVERVIEW.md 읽어보기
- [ ] CODE_EXPLANATION.md 주요 부분 숙지
- [ ] 기술 스택 선정 이유 정리

### 데모 준비

- [ ] Supabase 대시보드 로그인 확인
- [ ] test.http 파일로 API 테스트 가능한지 확인
- [ ] Prisma Studio 실행 가능한지 확인 (`npm run db:studio`)
- [ ] 샘플 데이터 준비 (Supabase SQL Editor)

### 설명 포인트

1. **프로젝트 배경**: 왜 만들었나?
2. **기술 선택**: 왜 이 기술들을 선택했나?
3. **주요 기능**: 무엇을 구현했나?
4. **코드 설명**: 어떻게 구현했나?
5. **향후 계획**: 앞으로 무엇을 추가할 것인가?

## 💡 추가 Tips

### 커밋 메시지 컨벤션

**Prefix:**

- `feat:` - 새로운 기능
- `fix:` - 버그 수정
- `docs:` - 문서 변경
- `style:` - 코드 포맷팅
- `refactor:` - 코드 리팩토링
- `test:` - 테스트 추가
- `chore:` - 빌드/설정 변경

**예시:**

```bash
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
refactor: improve error handling
```

### 브랜치 전략 (향후)

```bash
main        # 프로덕션 코드
develop     # 개발 브랜치
feature/*   # 기능 개발
hotfix/*    # 긴급 수정
```

현재는 main 브랜치만 사용하되, 프로젝트가 커지면 브랜치 전략 도입

---

**준비 완료되면 자신있게 커밋하세요!** 🚀
