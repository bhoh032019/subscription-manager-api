import type { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

export function errorHandler(
  err: CustomError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  res
    .status(err.status ?? 500)
    .json({ error: { message: err.message ?? 'Internal Server Error' } });
}
