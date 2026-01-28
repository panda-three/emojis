import Link from 'next/link';
import { PageShell } from '../../../components/layout/PageShell';
import ResultClient from './ResultClient';

export default function ResultPage({ params }: { params: { id: string } }) {
  return (
    <PageShell>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500">
            <span className="text-lg">🎉</span>
          </div>
          <div>
            <p className="text-lg font-semibold">Emoji Lab</p>
            <p className="text-xs text-slate-400">生成结果</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/50"
          >
            返回工作台
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02]"
          >
            再次生成
          </Link>
        </div>
      </header>
      <ResultClient id={params.id} />
    </PageShell>
  );
}
