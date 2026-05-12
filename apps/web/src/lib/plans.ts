export interface Plan {
  id: string;
  name: string;
  price: number;
  creditsPerMonth: number;
  maxVideoLengthMinutes: number;
  watermark: boolean;
  maxResolution: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    creditsPerMonth: 10,
    maxVideoLengthMinutes: 30,
    watermark: true,
    maxResolution: '720x1280',
    features: [
      '10 clips per month',
      'Up to 30min videos',
      'Basic captions',
      '720p export',
      'Watermarked',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    creditsPerMonth: 100,
    maxVideoLengthMinutes: 120,
    watermark: false,
    maxResolution: '1080x1920',
    features: [
      '100 clips per month',
      'Up to 2hr videos',
      'AI captions + emoji',
      '1080p export',
      'No watermark',
      'Face tracking',
      'Priority queue',
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 29,
    creditsPerMonth: 500,
    maxVideoLengthMinutes: 360,
    watermark: false,
    maxResolution: '3840x2160',
    features: [
      '500 clips per month',
      'Up to 6hr videos',
      'All AI features',
      '4K export',
      'Custom branding',
      'API access',
      'Team collaboration',
    ],
  },
];

export function getPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId);
}

export function getCreditsForPlan(planId: string): number {
  const plan = getPlan(planId);
  return plan?.creditsPerMonth ?? 0;
}

export function shouldWatermark(planId: string): boolean {
  const plan = getPlan(planId);
  return plan?.watermark ?? true;
}

export function getMaxResolution(planId: string): string {
  const plan = getPlan(planId);
  return plan?.maxResolution ?? '720x1280';
}
