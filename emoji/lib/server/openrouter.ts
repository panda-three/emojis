type ImageGenerationInput = {
  prompt: string;
  inputImageUrl?: string | null;
};

type ImageGenerationResult = {
  imageUrl: string;
  text?: string;
};

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.5-flash-image';

function getApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('缺少 OPENROUTER_API_KEY，请先在 .env.local 配置。');
  }
  return apiKey;
}

function buildHeaders() {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json'
  };

  const referer = process.env.OPENROUTER_SITE_URL;
  const title = process.env.OPENROUTER_APP_TITLE;
  if (referer) headers['HTTP-Referer'] = referer;
  if (title) headers['X-Title'] = title;

  return headers;
}

export async function generateEmojiImage(input: ImageGenerationInput): Promise<ImageGenerationResult> {
  const content = input.inputImageUrl
    ? [
        { type: 'text', text: input.prompt },
        { type: 'image_url', image_url: { url: input.inputImageUrl } }
      ]
    : [{ type: 'text', text: input.prompt }];

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content }],
      modalities: ['image', 'text'],
      image_config: {
        aspect_ratio: '1:1',
        image_size: '1K'
      }
    }),
    cache: 'no-store'
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || '图片生成失败';
    throw new Error(message);
  }

  const message = payload?.choices?.[0]?.message;
  const imageUrl =
    message?.images?.[0]?.image_url?.url ??
    message?.images?.[0]?.imageUrl?.url;

  if (!imageUrl) {
    throw new Error('生成结果缺少图片数据。');
  }

  return {
    imageUrl,
    text: typeof message?.content === 'string' ? message.content : undefined
  };
}

export async function generateCaptions(params: {
  style: string;
  tone: string;
  intensity: number;
}): Promise<string[]> {
  const prompt = `请根据以下条件生成 3 条中文表情包文案，语气 ${params.tone}，风格 ${params.style}，夸张程度 ${params.intensity}%。要求每条不超过 20 字，适合群聊分享。只返回 JSON，例如：{"captions":["...","...","..."]}`;

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    }),
    cache: 'no-store'
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || '文案生成失败';
    throw new Error(message);
  }

  const raw = payload?.choices?.[0]?.message?.content;
  return parseCaptions(raw) ?? fallbackCaptions(params.tone);
}

function parseCaptions(content?: string | null) {
  if (!content || typeof content !== 'string') return null;

  const candidates: string[] = [];
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    candidates.push(fencedMatch[1].trim());
  }
  candidates.push(trimmed);

  const jsonObjectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch?.[0]) {
    candidates.push(jsonObjectMatch[0]);
  }

  const jsonArrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (jsonArrayMatch?.[0]) {
    candidates.push(jsonArrayMatch[0]);
  }

  for (const candidate of candidates) {
    const parsed = tryParseCaptions(candidate);
    if (parsed) return parsed;
  }

  const lines = trimmed
    .split('\n')
    .map((line) => line.replace(/^\s*[\-\d\.\u2022]+\s*/, '').trim())
    .filter((line) => line && !line.startsWith('```'));

  for (const line of lines) {
    const parsed = tryParseCaptions(line);
    if (parsed) return parsed;
  }

  if (lines.length >= 3) {
    return lines.slice(0, 3);
  }

  return null;
}

function tryParseCaptions(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const captions = parsed.filter(Boolean).slice(0, 3);
      return captions.length >= 3 ? captions : null;
    }
    if (Array.isArray(parsed?.captions)) {
      const captions = parsed.captions.filter(Boolean).slice(0, 3);
      return captions.length >= 3 ? captions : null;
    }
  } catch {
    return null;
  }
  return null;
}

function fallbackCaptions(tone: string) {
  const templates: Record<string, string[]> = {
    沙雕: [
      '“本来只是困了，结果成了梗界天花板。”',
      '“我不是摆烂，我只是搞笑状态在线。”',
      '“表情管理失踪中，笑点自己乱入。”'
    ],
    毒舌: [
      '“老板：你醒着吗？我：灵魂出窍中。”',
      '“我不是生气，只是懒得给你表情管理。”',
      '“听你说话，我的表情先自闭了。”'
    ],
    中二: [
      '“看到我没？我在崩溃和爆笑之间。”',
      '“灵魂觉醒中，请勿打扰。”',
      '“你以为我在笑？其实是力量溢出。”'
    ],
    萌系: [
      '“哎呀，表情不受控制了啦～”',
      '“可爱是天赋，搞怪是本能。”',
      '“你一笑，我的表情就跑偏。”'
    ]
  };

  return templates[tone] ?? templates['沙雕'];
}
