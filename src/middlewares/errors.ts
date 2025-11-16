import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError, type ZodIssue } from 'zod';

interface CustomError extends Error {
  status?: number;
}

export function errorHandler(
  err: CustomError | ZodError | Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // Zod 검증 에러
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
    // 유니크 제약 조건 위반
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: {
          message: 'Unique constraint violation',
          field: (err.meta?.target as string[])?.join(', '),
        },
      });
    }
    // 외래키 제약 조건 위반
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
