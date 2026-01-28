import Link from 'next/link';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import StudioClient from './StudioClient';

export default function StudioPage() {
  return (
    <PageShell>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500">
            <span className="text-lg">🧪</span>
          </div>
          <div>
            <p className="text-lg font-semibold">Emoji Lab Studio</p>
            <p className="text-xs text-slate-400">生成工作台</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/50"
          >
            返回首页
          </Link>
          <Button size="sm" type="submit" form="generation-form">
            一键生成
          </Button>
        </div>
      </header>
      <StudioClient />
    </PageShell>
  );
}
