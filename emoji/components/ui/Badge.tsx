'use client';

import type { HTMLAttributes } from 'react';
import { cn } from './cn';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'fuchsia' | 'indigo' | 'emerald' | 'sky' | 'orange' | 'slate';
};

const tones = {
  fuchsia: 'bg-fuchsia-500/20 text-fuchsia-200',
  indigo: 'bg-indigo-500/20 text-indigo-200',
  emerald: 'bg-emerald-500/20 text-emerald-200',
  sky: 'bg-sky-500/20 text-sky-200',
  orange: 'bg-orange-500/20 text-orange-200',
  slate: 'bg-white/10 text-slate-200'
};

export function Badge({ tone = 'slate', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
