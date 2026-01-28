'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { SectionHeading } from '../../components/ui/SectionHeading';
import type { Generation } from '../../lib/types';

export default function HistoryClient() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const response = await fetch('/api/generations');
      const payload = await response.json();
      if (!active) return;
      setGenerations(payload.generations || []);
      setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = generations.length;
    const completed = generations.filter((gen) => gen.status === 'complete').length;
    return [
      { label: '累计生成', value: `${total} 张`, note: `完成 ${completed} 张`, tone: 'emerald' },
      { label: '平均生成时间', value: '6.4 秒', note: '最近 7 天', tone: 'slate' },
      { label: '最热风格', value: generations[0]?.style ?? '鬼畜滤镜', note: '分享率 +23%', tone: 'fuchsia' }
    ];
  }, [generations]);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 pb-16">
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            <p className={`mt-2 text-xs ${stat.tone === 'emerald' ? 'text-emerald-300' : stat.tone === 'fuchsia' ? 'text-fuchsia-300' : 'text-slate-300'}`}>
              {stat.note}
            </p>
          </Card>
        ))}
      </section>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SectionHeading title="筛选与检索" subtitle="快速定位想要的表情作品。" />
          <div className="flex flex-wrap gap-3 text-sm">
            <input
              type="text"
              placeholder="搜索文案或风格"
              className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white placeholder:text-slate-500"
            />
            <select className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white">
              <option>全部风格</option>
              <option>夸张五官</option>
              <option>漫画线条</option>
              <option>鬼畜滤镜</option>
              <option>蒸汽波</option>
            </select>
            <select className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white">
              <option>最近 7 天</option>
              <option>最近 30 天</option>
              <option>全部时间</option>
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <SectionHeading title="加载中" subtitle="正在同步你的作品记录..." />
        </Card>
      ) : generations.length === 0 ? (
        <Card>
          <SectionHeading title="还没有作品" subtitle="先去工作台生成第一张吧。" />
        </Card>
      ) : (
        <section className="grid gap-6 lg:grid-cols-3">
          {generations.map((work) => (
            <article key={work.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={work.outputUrl ?? work.inputUrl ?? 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=600&q=80'}
                alt={work.style}
                className="h-44 w-full rounded-2xl object-cover"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Badge tone="indigo">{work.style}</Badge>
                  <span className="text-slate-400">{new Date(work.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-semibold">{work.captions?.[0] ?? '“你的最新表情已准备就绪。”'}</p>
                <div className="flex gap-2 text-xs">
                  <button className="rounded-full border border-white/10 px-3 py-1">分享</button>
                  <button className="rounded-full border border-white/10 px-3 py-1">下载</button>
                  <button className="rounded-full border border-white/10 px-3 py-1">删除</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
