'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-moonlight-400/50';

    const variants = {
      primary:
        'bg-gradient-to-r from-moonlight-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-moonlight-500/25',
      ghost: 'text-white/70 hover:text-white hover:bg-white/5',
      outline:
        'border border-white/10 text-white hover:bg-white/5 hover:border-white/20',
      glow: 'bg-gradient-to-r from-moonlight-500 to-purple-600 text-white shadow-[0_0_30px_rgba(108,99,255,0.5)] hover:shadow-[0_0_50px_rgba(108,99,255,0.7)]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm gap-2',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-3',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(base, variants[variant], sizes[size], className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
export { Button };
