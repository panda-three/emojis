'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Progress } from '../../components/ui/Progress';
import { SectionHeading } from '../../components/ui/SectionHeading';

const styleOptions = ['夸张五官', '漫画线条', '复古像素', '鬼畜滤镜', '蒸汽波'];
const toneOptions = ['沙雕', '毒舌', '中二', '萌系'];
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function StudioClient() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [style, setStyle] = useState(styleOptions[0]);
  const [tone, setTone] = useState(toneOptions[0]);
  const [intensity, setIntensity] = useState(85);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => !!file && !isSubmitting, [file, isSubmitting]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError('仅支持 JPG/PNG/WEBP 图片。');
      return;
    }

    if (selected.size > MAX_SIZE) {
      setError('图片大小不能超过 10MB。');
      return;
    }

    setError(null);
    setFile(selected);
    const objectUrl = URL.createObjectURL(selected);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('style', style);
      formData.append('tone', tone);
      formData.append('intensity', String(intensity));

      const response = await fetch('/api/generations', {
        method: 'POST',
        body: formData
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || '生成失败');
      }

      router.push(`/result/${payload.generation.id}`);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : '生成失败';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 lg:grid-cols-2">
      <section className="space-y-6">
        <Card>
          <SectionHeading title="上传照片" subtitle="支持 JPG / PNG，建议正脸，分辨率 ≥ 800px。" />
          <form id="generation-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-950/60 text-center transition hover:border-fuchsia-400">
              <span className="text-2xl">☁️</span>
              <p className="mt-3 text-sm font-semibold">拖拽图片到这里，或点击上传</p>
              <p className="mt-1 text-xs text-slate-400">最大 10MB</p>
              <input className="hidden" type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            {error ? <p className="text-xs text-rose-300">{error}</p> : null}
            <Button type="submit" size="sm" className="w-full" disabled={!canSubmit}>
              {isSubmitting ? '生成中...' : '一键生成'}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="预览" />
            <Badge tone="emerald">{file ? '检测到人脸' : '等待上传'}</Badge>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="上传预览" className="h-64 w-full object-cover" />
            ) : (
              <Image
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                alt="上传预览"
                width={1200}
                height={720}
                className="h-64 w-full object-cover"
              />
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
              <p className="text-slate-400">识别结果</p>
              <p className="mt-2 font-semibold">{file ? '正脸 / 光线良好' : '等待分析'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
              <p className="text-slate-400">推荐风格</p>
              <p className="mt-2 font-semibold">{style}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <Card>
          <SectionHeading title="选择搞怪风格" />
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {styleOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStyle(option)}
                className={`rounded-full px-4 py-2 ${
                  option === style
                    ? 'border border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200'
                    : 'border border-white/10 bg-white/5 text-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>风格强度</span>
                <span className="text-slate-300">{intensity}%</span>
              </div>
              <input
                className="mt-2 w-full accent-fuchsia-500"
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold">文案语气</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {toneOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTone(option)}
                    className={`rounded-full px-3 py-1 ${
                      option === tone
                        ? 'bg-fuchsia-500/20 text-fuchsia-200'
                        : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <SectionHeading title="生成状态" />
            <span className="text-xs text-slate-400">预计 7 秒</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>等待提交</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="mt-2" />
          </div>
          <div className="mt-5 grid gap-3 text-xs text-slate-300 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
              <p className="text-slate-400">队列位置</p>
              <p className="mt-2 font-semibold">准备中</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
              <p className="text-slate-400">缓存命中</p>
              <p className="mt-2 font-semibold">待生成</p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionHeading title="创作小贴士" />
          <ul className="mt-3 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">💡 尽量使用正脸照片，表情越明显越好笑。</li>
            <li className="flex items-start gap-3">💡 风格强度高于 70%，效果更夸张。</li>
            <li className="flex items-start gap-3">💡 文案语气选“毒舌”适合群聊互怼。</li>
          </ul>
        </Card>
      </section>
    </main>
  );
}
