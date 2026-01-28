import type { Generation } from '../types';
import { createMockGeneration, getMockGeneration, listMockGenerations } from './mock-store';
import { generateCaptions, generateEmojiImage } from './openrouter';
import { getSupabaseAdmin } from './supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
type SupabaseAdmin = NonNullable<ReturnType<typeof getSupabaseAdmin>>;

function shouldUseMock() {
  return process.env.EMOJI_USE_MOCK === 'true';
}

function safeNumber(value: FormDataEntryValue | null, fallback: number) {
  if (typeof value !== 'string') return fallback;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function getSupabaseOrThrow(): SupabaseAdmin {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('缺少 Supabase 配置，请先填写环境变量。');
  }
  return supabase;
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!match) return null;
  const contentType = match[1] || 'image/png';
  const buffer = Buffer.from(match[2], 'base64');
  const extension = contentType.split('/')[1] || 'png';
  return { buffer, contentType, extension };
}

async function uploadGeneratedImage(
  supabase: SupabaseAdmin,
  id: string,
  dataUrl: string
) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    return dataUrl;
  }

  const path = `results/${id}.${parsed.extension}`;
  const { error } = await supabase.storage
    .from('results')
    .upload(path, parsed.buffer, { contentType: parsed.contentType, upsert: true });

  if (error) {
    throw new Error(`生成图上传失败：${error.message}`);
  }

  const { data } = supabase.storage.from('results').getPublicUrl(path);
  return data.publicUrl;
}

async function updateGeneration(
  supabase: SupabaseAdmin,
  id: string,
  payload: Record<string, unknown>
) {
  const { error } = await supabase.from('generations').update(payload).eq('id', id);
  if (error && /captions/i.test(error.message)) {
    const { captions: _captions, ...fallback } = payload;
    const { error: fallbackError } = await supabase.from('generations').update(fallback).eq('id', id);
    if (fallbackError) {
      throw new Error(`更新生成记录失败：${fallbackError.message}`);
    }
    return;
  }
  if (error) {
    throw new Error(`更新生成记录失败：${error.message}`);
  }
}

function buildImagePrompt(style: string, tone: string, intensity: number) {
  return `把这张照片转成高质量表情包头像。风格：${style}；夸张程度：${intensity}%；语气：${tone}。要求：1:1 方形构图、脸部居中、背景简洁、色彩鲜明、卡通/emoji 风。`;
}

function normalizeCaptions(value: unknown) {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
      .filter(Boolean);
    const parsed = extractCaptionsFromText(cleaned.join('\n'));
    return parsed ?? cleaned;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean) as string[];
    } catch {
      const parsed = extractCaptionsFromText(value);
      return parsed ?? [];
    }
  }
  return [];
}

function extractCaptionsFromText(text: string) {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidates = [fencedMatch?.[1], text].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const objectMatch = candidate.match(/\{[\s\S]*\}/);
    if (objectMatch?.[0]) {
      const parsed = parseCaptionJson(objectMatch[0]);
      if (parsed) return parsed;
    }
    const arrayMatch = candidate.match(/\[[\s\S]*\]/);
    if (arrayMatch?.[0]) {
      const parsed = parseCaptionJson(arrayMatch[0]);
      if (parsed) return parsed;
    }
    const parsed = parseCaptionJson(candidate);
    if (parsed) return parsed;
  }

  return null;
}

function parseCaptionJson(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const captions = parsed.filter(Boolean).slice(0, 3);
      return captions.length ? captions : null;
    }
    if (Array.isArray(parsed?.captions)) {
      const captions = parsed.captions.filter(Boolean).slice(0, 3);
      return captions.length ? captions : null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function createGeneration(formData: FormData): Promise<Generation> {
  const file = formData.get('file');
  const style = String(formData.get('style') ?? '夸张五官');
  const tone = String(formData.get('tone') ?? '沙雕');
  const intensity = Math.min(100, Math.max(0, safeNumber(formData.get('intensity'), 80)));

  if (!(file instanceof File)) {
    throw new Error('请上传图片文件。');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('仅支持 JPG/PNG/WEBP 图片。');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('图片大小不能超过 10MB。');
  }

  if (shouldUseMock()) {
    return createMockGeneration({ style, intensity, tone, inputUrl: null });
  }
  const supabase = getSupabaseOrThrow();

  const id = crypto.randomUUID();
  const extension = file.name.split('.').pop() || 'png';
  const path = `uploads/${id}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError) {
    throw new Error(`图片上传失败：${uploadError.message}`);
  }

  const { data: publicData } = supabase.storage.from('uploads').getPublicUrl(path);

  const generation: Generation = {
    id,
    status: 'processing',
    style,
    intensity,
    tone,
    inputUrl: publicData.publicUrl,
    outputUrl: null,
    captions: [],
    createdAt: new Date().toISOString(),
    progress: 10
  };

  const { error: insertError } = await supabase.from('generations').insert({
    id: generation.id,
    status: generation.status,
    style: generation.style,
    intensity: generation.intensity,
    tone: generation.tone,
    input_url: generation.inputUrl,
    output_url: generation.outputUrl,
    created_at: generation.createdAt
  });

  if (insertError) {
    throw new Error(`写入数据库失败：${insertError.message}`);
  }

  try {
    const inputDataUrl = await fileToDataUrl(file);
    const prompt = buildImagePrompt(style, tone, intensity);
    const imageResult = await generateEmojiImage({
      prompt,
      inputImageUrl: inputDataUrl
    });

    const outputUrl = await uploadGeneratedImage(supabase, id, imageResult.imageUrl);
    const captions = await generateCaptions({ style, tone, intensity });

    await updateGeneration(supabase, id, {
      status: 'complete',
      output_url: outputUrl,
      captions
    });

    return {
      ...generation,
      status: 'complete',
      outputUrl,
      captions,
      progress: 100
    };
  } catch (error) {
    await updateGeneration(supabase, id, { status: 'failed' });
    throw error;
  }
}

export async function getGeneration(id: string): Promise<Generation | null> {
  if (shouldUseMock()) {
    return getMockGeneration(id);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return getMockGeneration(id);

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const captions = normalizeCaptions(data.captions);

  return {
    id: data.id,
    status: data.status,
    style: data.style,
    intensity: data.intensity,
    tone: data.tone,
    inputUrl: data.input_url,
    outputUrl: data.output_url,
    captions,
    createdAt: data.created_at,
    progress: data.progress ?? (data.status === 'complete' ? 100 : 30)
  };
}

export async function listGenerations(): Promise<Generation[]> {
  if (shouldUseMock()) {
    return listMockGenerations();
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return listMockGenerations();

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) {
    return [];
  }

  return data.map((item) => {
    const captions = normalizeCaptions(item.captions);

    return {
      id: item.id,
      status: item.status,
      style: item.style,
      intensity: item.intensity,
      tone: item.tone,
      inputUrl: item.input_url,
      outputUrl: item.output_url,
      captions,
      createdAt: item.created_at,
      progress: item.progress ?? (item.status === 'complete' ? 100 : 30)
    };
  });
}
