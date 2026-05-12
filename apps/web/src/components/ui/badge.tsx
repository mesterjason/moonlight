import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'new';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        variant === 'default' && 'bg-white/5 text-white/60 border border-white/10',
        variant === 'premium' && 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/20',
        variant === 'new' && 'bg-moonlight-500/20 text-moonlight-300 border border-moonlight-500/20',
        className,
      )}
    >
      {children}
    </span>
  );
}
