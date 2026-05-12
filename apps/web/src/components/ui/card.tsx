'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl',
        hover && 'transition-all duration-300 hover:border-moonlight-500/30 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-moonlight-500/5',
        className,
      )}
    >
      {children}
    </div>
  );
}
