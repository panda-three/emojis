'use client';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-slate-300">{subtitle}</p> : null}
    </div>
  );
}
