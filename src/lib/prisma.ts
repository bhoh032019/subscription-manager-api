import { PrismaClient } from '@prisma/client';

// PrismaClient를 전역 싱글톤으로 관리 (HMR 환경에서 중복 인스턴스 방지)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    // 연결 풀 설정 (선택사항)
    // datasources: {
    //   db: {
    //     url: process.env.DATABASE_URL,
    //   },
    // },
  });

// 개발 환경에서는 전역 객체에 저장하여 HMR 시 재사용
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown: 앱 종료 시 DB 연결 정리
const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', () => {
  prisma.$disconnect();
});
