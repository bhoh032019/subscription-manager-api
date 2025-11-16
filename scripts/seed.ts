// scripts/seed.ts - 테스트 데이터 생성 스크립트
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-123';

async function main() {
  console.log('🌱 Seeding database...');

  // 1. 데모 사용자 생성
  const user = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: 'demo@example.com',
    },
  });
  console.log('✅ Demo user created:', user.email);

  // 2. 샘플 구독 데이터
  const subscriptions = [
    {
      userId: user.id,
      name: 'Netflix',
      price: 13500,
      currency: 'KRW',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-16'),
      paymentMethod: 'credit_card',
      category: 'Entertainment',
      memo: 'Standard plan',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'Spotify Premium',
      price: 10900,
      currency: 'KRW',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-01'),
      paymentMethod: 'credit_card',
      category: 'Entertainment',
      memo: 'Individual plan',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'GitHub Pro',
      price: 4,
      currency: 'USD',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-20'),
      paymentMethod: 'credit_card',
      category: 'Development',
      memo: 'Pro plan for private repos',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'ChatGPT Plus',
      price: 20,
      currency: 'USD',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-05'),
      paymentMethod: 'credit_card',
      category: 'AI',
      memo: 'GPT-4 access',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'Adobe Creative Cloud',
      price: 65000,
      currency: 'KRW',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-10'),
      paymentMethod: 'credit_card',
      category: 'Design',
      memo: 'Photography plan',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'New York Times Digital',
      price: 4,
      currency: 'USD',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-25'),
      paymentMethod: 'credit_card',
      category: 'News',
      memo: 'Digital subscription',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'iCloud Storage',
      price: 1300,
      currency: 'KRW',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-15'),
      paymentMethod: 'credit_card',
      category: 'Storage',
      memo: '50GB plan',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'Notion Personal Pro (Paused)',
      price: 10,
      currency: 'USD',
      billingCycle: 'yearly',
      intervalCount: 1,
      nextBillingAt: new Date('2026-01-15'),
      paymentMethod: 'credit_card',
      category: 'Productivity',
      memo: 'Currently paused',
      isPaused: true,
    },
    {
      userId: user.id,
      name: 'Gym Membership',
      price: 89000,
      currency: 'KRW',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-01'),
      paymentMethod: 'bank_transfer',
      category: 'Health',
      memo: '24/7 access',
      isPaused: false,
    },
    {
      userId: user.id,
      name: 'AWS',
      price: 50,
      currency: 'USD',
      billingCycle: 'monthly',
      intervalCount: 1,
      nextBillingAt: new Date('2025-12-28'),
      paymentMethod: 'credit_card',
      category: 'Infrastructure',
      memo: 'Estimated monthly cost',
      isPaused: false,
    },
  ];

  // 3. 구독 데이터 생성
  console.log('📦 Creating subscriptions...');
  for (const sub of subscriptions) {
    const created = await prisma.subscription.create({
      data: sub,
    });
    console.log(`  ✓ ${created.name} - ${created.currency} ${created.price}`);
  }

  console.log('');
  console.log('✨ Seeding completed!');
  console.log(`📊 Created ${subscriptions.length} subscriptions`);
  console.log('');
  console.log('🎯 Next steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Visit: http://localhost:4000/subscriptions');
  console.log('  3. Or open: test.http in VS Code');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
