'use client';

import { cn } from './cn';

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-800', className)}>
      <div
        className="h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
