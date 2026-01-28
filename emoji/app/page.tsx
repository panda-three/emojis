import Image from 'next/image';
import Link from 'next/link';
import { PageShell } from '../components/layout/PageShell';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

const features = [
  {
    title: 'AI 惊艳风格',
    desc: '夸张五官、漫画线条、鬼畜质感，一眼就想转发。',
    tone: 'fuchsia'
  },
  {
    title: '自动梗文案',
    desc: '三条候选文案，支持不同语气：沙雕/毒舌/中二。',
    tone: 'indigo'
  },
  {
    title: '三步出图',
    desc: '上传 → 选风格 → 一键生成，无门槛造梗。',
    tone: 'emerald'
  },
  {
    title: '手机端分享',
    desc: '生成后可直接分享或保存到相册，减少操作步骤。',
    tone: 'sky'
  },
  {
    title: '节奏不掉线',
    desc: '聊天正在高潮，5-10 秒给你神回复。',
    tone: 'orange'
  },
  {
    title: '隐私可控',
    desc: '生成图可设置短期有效，分享更放心。',
    tone: 'fuchsia'
  }
] as const;

const steps = [
  { title: '上传照片', desc: '支持自拍、朋友照、宠物照。' },
  { title: '选择风格强度', desc: '从轻度搞怪到夸张鬼畜。' },
  { title: '一键生成', desc: '图 + 文案一套，直接发群。' }
];

const faq = [
  {
    q: '图片会被保存吗？',
    a: '默认 24 小时内自动清理，你可以选择即时删除。'
  },
  {
    q: '移动端是否支持直接分享？',
    a: '支持生成后一键分享或保存到相册。'
  },
  { q: '需要复杂操作吗？', a: '不需要，上传即可生成，文案自动补齐。' }
];

export default function HomePage() {
  return (
    <PageShell>
      <SiteHeader />

      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-16 pt-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Badge tone="slate" className="gap-2">
            ✨ 上传一张照，AI 自动出梗
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            把照片变成<br />
            <span className="bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              炸裂表情包
            </span>
          </h1>
          <p className="text-lg text-slate-300">
            想要效果惊艳？Emoji Lab 让你三步出图：夸张搞怪风格 + 自动梗文案，手机也能直接分享。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-white/30 transition"
            >
              立即生成
            </Link>
            <Link
              href="#showcase"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition"
            >
              先看效果
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-2">⚡ 惊艳级搞怪风格</span>
            <span className="flex items-center gap-2">💬 自动生成梗文案</span>
            <span className="flex items-center gap-2">📱 手机端直接分享</span>
          </div>
        </div>
        <div className="relative">
          <Card className="space-y-4 shadow-2xl shadow-indigo-500/20">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>AI 生成预览</span>
              <Badge tone="emerald">5 秒出图</Badge>
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                alt="生成效果预览"
                width={1200}
                height={720}
                className="h-72 w-full object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-slate-400">文案 1</p>
                <p className="mt-2 font-semibold">“我只是打了个哈欠，怎么成了梗王”</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                <p className="text-slate-400">文案 2</p>
                <p className="mt-2 font-semibold">“老板：你很困？我：灵魂出窍中”</p>
              </div>
            </div>
          </Card>
          <div className="absolute -right-6 -top-6 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs text-slate-200 backdrop-blur md:block">
            <p className="font-semibold">群聊热度 +128%</p>
            <p className="text-slate-400">最近 24 小时</p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-lg shadow-indigo-500/10">
              <Badge tone={feature.tone} className="mb-4">
                {feature.title}
              </Badge>
              <p className="text-sm text-slate-300">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="steps" className="mx-auto w-full max-w-6xl px-6 pb-16">
        <Card>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <SectionHeading title="三步搞定：新手也能上手" subtitle="打开就能笑，生成后直接发。" />
            <Button variant="soft" size="sm">
              立刻体验
            </Button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
              >
                <p className="text-xs text-slate-400">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="showcase" className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <SectionHeading title="看得见的惊艳效果" subtitle="真实用户案例：自动生成文案 + 搞怪风格，一眼就想转发。" />
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <p className="text-xs text-slate-400">原图</p>
                <Image
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80"
                  alt="原图"
                  width={600}
                  height={320}
                  className="mt-3 h-40 w-full rounded-xl object-cover"
                />
              </Card>
              <Card>
                <p className="text-xs text-slate-400">生成图</p>
                <Image
                  src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=600&q=80"
                  alt="生成图"
                  width={600}
                  height={320}
                  className="mt-3 h-40 w-full rounded-xl object-cover"
                />
              </Card>
            </div>
          </div>
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500" />
                <div>
                  <p className="text-sm font-semibold">@群聊王者</p>
                  <p className="text-xs text-slate-400">最近 5 分钟</p>
                </div>
              </div>
              <p className="text-sm text-slate-200">
                “朋友生日忘了？直接把他的照片做成表情包补救，结果全群笑到停不下来。”
              </p>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-400">自动文案</p>
                <p className="mt-2 text-sm font-semibold">“我不是迟到，我是表情包灵感延迟了。”</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-6xl px-6 pb-16">
        <Card>
          <SectionHeading title="常见问题" />
          <div className="mt-6 space-y-4">
            {faq.map((item) => (
              <details
                key={item.q}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <summary className="cursor-pointer text-sm font-semibold">{item.q}</summary>
                <p className="mt-3 text-sm text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </Card>
      </section>

      <SiteFooter />
    </PageShell>
  );
}
