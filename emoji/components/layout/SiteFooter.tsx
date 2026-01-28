export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">Emoji Lab</p>
          <p className="mt-2 text-xs text-slate-400">让每个人都能轻松造梗。</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          <span>隐私政策</span>
          <span>使用条款</span>
          <span>联系支持</span>
        </div>
      </div>
    </footer>
  );
}
