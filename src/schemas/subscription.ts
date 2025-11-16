// src/schemas/subscription.ts
import { z } from 'zod';

export const BillingCycle = z.enum(['monthly', 'weekly', 'yearly', 'custom']);

// 주요 통화 enum (필요시 확장 가능)
export const Currency = z.enum(['KRW', 'USD', 'EUR', 'JPY', 'GBP']);

// 결제 수단 (필요시 확장 가능)
export const PaymentMethod = z.enum([
  'credit_card',
  'debit_card',
  'bank_transfer',
  'paypal',
  'mobile_payment',
  'other',
]);

export const SubCreateSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  // 소수점 2자리까지 제한 (금액)
  price: z
    .number()
    .positive()
    .refine((val) => Number(val.toFixed(2)) === val, {
      message: 'Price must have at most 2 decimal places',
    }),
  currency: Currency.default('KRW'),
  billingCycle: BillingCycle,
  intervalCount: z.number().int().min(1).max(12).default(1), // 최대 12개월/주기
  // ISO 8601 문자열을 받아서 Date 객체로 변환
  nextBillingAt: z.coerce.date(),
  paymentMethod: PaymentMethod.optional(),
  category: z.string().max(50).trim().optional(),
  memo: z.string().max(500).trim().optional(),
  isPaused: z.boolean().default(false),
});

export const SubUpdateSchema = SubCreateSchema.partial();

export const SubListQuerySchema = z.object({
  from: z.coerce.date().optional(), // 자동으로 Date로 변환
  to: z.coerce.date().optional(),
  category: z.string().optional(),
  method: PaymentMethod.optional(),
  // coerce를 사용해 문자열을 자동으로 숫자로 변환
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  order: z.enum(['asc', 'desc']).default('asc'),
  isPaused: z.coerce.boolean().optional(), // 일시정지된 구독 필터링
});

// 응답 스키마 (API 응답용)
export const SubResponseSchema = SubCreateSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

// 구독 통계 응답 스키마
export const SubStatsSchema = z.object({
  totalMonthly: z.number(),
  totalYearly: z.number(),
  currency: Currency,
  activeCount: z.number().int(),
  pausedCount: z.number().int(),
  byCategory: z.record(z.string(), z.number()),
  nextBillings: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      price: z.number(),
      nextBillingAt: z.date(),
    }),
  ),
});

// 타입 export
export type SubCreateDTO = z.infer<typeof SubCreateSchema>;
export type SubUpdateDTO = z.infer<typeof SubUpdateSchema>;
export type SubListQuery = z.infer<typeof SubListQuerySchema>;
export type SubResponse = z.infer<typeof SubResponseSchema>;
export type SubStats = z.infer<typeof SubStatsSchema>;
