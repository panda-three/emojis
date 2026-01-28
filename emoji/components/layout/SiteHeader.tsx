import Link from 'next/link';

const navItems = [
  { label: '功能', href: '/#features' },
  { label: '流程', href: '/#steps' },
  { label: '示例', href: '/#showcase' },
  { label: 'FAQ', href: '/#faq' }
];

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-indigo-500">
          <span className="text-lg">😆</span>
        </div>
        <div>
          <p className="text-lg font-semibold">Emoji Lab</p>
          <p className="text-xs text-slate-400">搞怪表情生成器</p>
        </div>
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
        {navItems.map((item) => (
          <Link key={item.href} className="transition hover:text-white" href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-white/20 px-4 py-2 text-xs text-slate-200 md:inline-flex">
          登录
        </span>
        <Link
          href="/studio"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.02]"
        >
          立即生成
        </Link>
      </div>
    </header>
  );
}
