'use client';

import type { HTMLAttributes } from 'react';
import { cn } from './cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'glass' | 'solid';
};

export function Card({ variant = 'glass', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 p-6',
        variant === 'glass' ? 'bg-white/5 backdrop-blur' : 'bg-slate-950/70',
        className
      )}
      {...props}
    />
  );
}
