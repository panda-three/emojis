'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Progress } from '../../../components/ui/Progress';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import type { Generation } from '../../../lib/types';

const fallbackVariants = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
];

export default function ResultClient({ id }: { id: string }) {
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    let active = true;
    let interval: ReturnType<typeof setInterval>;

    const load = async () => {
      try {
        const response = await fetch(`/api/generations/${id}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || '加载失败');
        }
        if (!active) return;
        setGeneration(payload.generation);
        setLoading(false);
        if (payload.generation.status === 'complete') {
          clearInterval(interval);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : '加载失败');
        setLoading(false);
      }
    };

    load();
    interval = setInterval(load, 1500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  const captions = generation?.captions?.length
    ? generation.captions
    : ['“本来只是困了，结果成了梗界天花板。”', '“老板：你醒着吗？我：灵魂出窍中。”', '“看到我没？我在崩溃和爆笑之间。”'];

  const progress = generation?.progress ?? (generation?.status === 'complete' ? 100 : 30);
  const outputUrl = generation?.outputUrl ??
    'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80';

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/result/${id}`;
  }, [id]);

  const handleDownload = async () => {
    if (!outputUrl) return;
    const response = await fetch(outputUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `emoji-${id}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = async (text: string, index?: number) => {
    if (!navigator.clipboard || !text) return;
    await navigator.clipboard.writeText(text);
    if (typeof index === 'number') {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 pb-16">
        <Card>
          <SectionHeading title="生成中" subtitle="正在为你生成表情包，请稍候..." />
          <Progress value={progress} className="mt-4" />
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 pb-16">
        <Card>
          <SectionHeading title="加载失败" subtitle={error} />
          <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
            重试
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 lg:grid-cols-2">
      <section className="space-y-6">
        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="生成图" />
            <Badge tone={generation?.status === 'complete' ? 'emerald' : 'slate'}>
              {generation?.status === 'complete' ? '完成' : '生成中'}
            </Badge>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={outputUrl} alt="生成结果" className="h-72 w-full object-cover" />
          </div>
          {generation?.status !== 'complete' ? (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>正在生成表情包</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="mt-2" />
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Button size="sm" className="bg-white text-slate-900 hover:text-slate-900" onClick={handleDownload}>
                下载 PNG
              </Button>
              <Button variant="outline" size="sm">
                保存到相册
              </Button>
              <Button variant="outline" size="sm">
                生成动图
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <SectionHeading title="原图对比" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs text-slate-400">原图</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generation?.inputUrl ?? outputUrl}
                alt="原图"
                className="mt-3 h-40 w-full rounded-xl object-cover"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs text-slate-400">生成图</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outputUrl} alt="生成图" className="mt-3 h-40 w-full rounded-xl object-cover" />
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <Card>
          <SectionHeading title="自动生成文案" />
          <div className="mt-4 space-y-3">
            {captions.map((caption, index) => (
              <div
                key={caption}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <p className="text-sm font-semibold">{caption}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(caption, index)}
                >
                  {copiedIndex === index ? '已复制' : '复制'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading title="一键分享" subtitle="移动端直接分享至微信、QQ、Telegram。" />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              微信
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              QQ
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              Telegram
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"
              onClick={() => handleCopy(shareUrl)}
            >
              {linkCopied ? '已复制' : '复制链接'}
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-300">
            分享链接默认 24 小时有效，可在设置中修改。
          </div>
        </Card>

        <Card>
          <SectionHeading title="更多变体" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {fallbackVariants.map((variant) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={variant} src={variant} alt="变体" className="h-32 w-full rounded-2xl object-cover" />
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
