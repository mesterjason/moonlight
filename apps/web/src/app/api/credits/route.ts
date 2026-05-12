import { NextRequest, NextResponse } from 'next/server';
import { PLANS } from '@/lib/plans';

const creditsStore = new Map<string, { remaining: number; plan: string }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'default';

  const userCredits = creditsStore.get(userId) || { remaining: 10, plan: 'free' };

  return NextResponse.json({
    userId,
    remaining: userCredits.remaining,
    plan: userCredits.plan,
    planLimit: PLANS.find((p) => p.id === userCredits.plan)?.creditsPerMonth || 10,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'default', amount = 1, plan = 'free' } = body;

    const userCredits = creditsStore.get(userId) || { remaining: 10, plan };
    const planConfig = PLANS.find((p) => p.id === plan);

    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (userCredits.remaining < amount) {
      return NextResponse.json({
        error: 'Insufficient credits',
        remaining: userCredits.remaining,
        planLimit: planConfig.creditsPerMonth,
      }, { status: 402 });
    }

    userCredits.remaining -= amount;
    creditsStore.set(userId, userCredits);

    return NextResponse.json({
      success: true,
      remaining: userCredits.remaining,
      deducted: amount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Credits error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
