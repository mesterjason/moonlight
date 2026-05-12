'use client';

import { Sparkles, Crown } from 'lucide-react';
import { useDashboardStore } from '@/stores/dashboard';
import { Button } from '@/components/ui/button';
export function CreditsDisplay() {
  const credits = useDashboardStore((s) => s.credits);
  const isPremium = useDashboardStore((s) => s.isPremium);
  const setPlan = useDashboardStore((s) => s.setPlan);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-xs font-medium text-white/60">
          {isPremium ? 'Pro Plan' : 'Free Plan'}
        </span>
        {!isPremium && (
          <span className="text-[10px] text-amber-400/60">(watermarked)</span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{credits}</div>
      <div className="text-[10px] text-white/30 mb-3">clips remaining this month</div>

      {isPremium ? (
        <div className="flex items-center gap-1.5 text-xs text-amber-400/80 mb-3">
          <Crown className="h-3 w-3" />
          <span>Premium Active</span>
        </div>
      ) : (
        <Button
          variant="primary"
          size="sm"
          className="w-full text-xs mb-2"
          onClick={() => setPlan('pro')}
        >
          <Crown className="h-3 w-3" />
          Upgrade to Pro
        </Button>
      )}

      {isPremium && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => setPlan('free')}
        >
          Downgrade
        </Button>
      )}
    </div>
  );
}
