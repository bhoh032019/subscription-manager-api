// src/routes/subscriptions.ts
import { Router } from 'express';
import { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';
import {
  SubCreateSchema,
  SubUpdateSchema,
  SubListQuerySchema,
} from '../schemas/subscription.js';

const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-default-id';
const r = Router();

// GET /subscriptions - 구독 목록 조회 (필터링, 정렬, 페이지네이션)
r.get('/', async (req, res, next) => {
  try {
    const q = SubListQuerySchema.parse(req.query);

    const where: Prisma.SubscriptionWhereInput = { userId: DEMO_USER_ID };

    // 날짜 범위 필터
    if (q.from || q.to) {
      where.nextBillingAt = {};
      if (q.from) where.nextBillingAt.gte = q.from;
      if (q.to) where.nextBillingAt.lte = q.to;
    }

    // 카테고리 필터
    if (q.category) where.category = q.category;

    // 결제 수단 필터
    if (q.method) where.paymentMethod = q.method;

    // 일시정지 상태 필터
    if (q.isPaused !== undefined) where.isPaused = q.isPaused;

    const orderBy = { nextBillingAt: q.order };

    const [items, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy,
        take: q.limit,
        skip: q.offset,
      }),
      prisma.subscription.count({ where }),
    ]);

    res.json({
      items,
      total,
      pagination: {
        limit: q.limit,
        offset: q.offset,
        hasMore: q.offset + items.length < total,
      },
    });
  } catch (e) {
    next(e);
  }
});

// POST /subscriptions - 새 구독 생성
r.post('/', async (req, res, next) => {
  try {
    const body = SubCreateSchema.parse(req.body);
    // undefined 값을 제거하여 Prisma와 호환되도록 함
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

// GET /subscriptions/:id - 특정 구독 조회
r.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // 다른 유저의 구독은 접근 불가
    if (subscription.userId !== DEMO_USER_ID) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(subscription);
  } catch (e) {
    next(e);
  }
});

// PATCH /subscriptions/:id - 구독 수정
r.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = SubUpdateSchema.parse(req.body);

    // undefined 필드를 제거 (Prisma는 undefined를 null로 처리하지 않음)
    const data = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(body).filter(([_, value]) => value !== undefined),
    );

    const updated = await prisma.subscription.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    next(e);
  }
});

// DELETE /subscriptions/:id - 구독 삭제
r.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.subscription.delete({ where: { id } });
    res.status(204).end();
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    next(e);
  }
});

export default r;
