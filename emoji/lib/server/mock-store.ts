import { Generation } from '../types';

const OUTPUTS = [
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'
];

const CAPTION_TEMPLATES: Record<string, string[]> = {
  '沙雕': [
    '“本来只是困了，结果成了梗界天花板。”',
    '“我不是摆烂，我只是搞笑状态在线。”',
    '“表情管理失踪中，笑点自己乱入。”'
  ],
  '毒舌': [
    '“老板：你醒着吗？我：灵魂出窍中。”',
    '“我不是生气，只是懒得给你表情管理。”',
    '“听你说话，我的表情先自闭了。”'
  ],
  '中二': [
    '“看到我没？我在崩溃和爆笑之间。”',
    '“灵魂觉醒中，请勿打扰。”',
    '“你以为我在笑？其实是力量溢出。”'
  ],
  '萌系': [
    '“哎呀，表情不受控制了啦～”',
    '“可爱是天赋，搞怪是本能。”',
    '“你一笑，我的表情就跑偏。”'
  ]
};

type Store = {
  generations: Map<string, Generation>;
};

const globalForStore = globalThis as unknown as { __emojiStore?: Store };

const store: Store = globalForStore.__emojiStore ?? {
  generations: new Map()
};

globalForStore.__emojiStore = store;

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildCaptions(tone: string) {
  const pool = CAPTION_TEMPLATES[tone] ?? CAPTION_TEMPLATES['沙雕'];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function computeProgress(createdAt: string) {
  const elapsed = Date.now() - new Date(createdAt).getTime();
  const progress = Math.min(100, Math.floor((elapsed / 8000) * 100));
  return progress;
}

export function createMockGeneration(input: {
  style: string;
  intensity: number;
  tone: string;
  inputUrl?: string | null;
}): Generation {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const generation: Generation = {
    id,
    status: 'processing',
    style: input.style,
    intensity: input.intensity,
    tone: input.tone,
    inputUrl: input.inputUrl ?? null,
    outputUrl: null,
    captions: [],
    createdAt,
    progress: 5
  };

  store.generations.set(id, generation);
  return generation;
}

export function listMockGenerations() {
  const items = Array.from(store.generations.values()).map((gen) =>
    hydrateMockGeneration(gen)
  );
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getMockGeneration(id: string) {
  const generation = store.generations.get(id);
  if (!generation) return null;
  return hydrateMockGeneration(generation);
}

function hydrateMockGeneration(generation: Generation) {
  if (generation.status === 'processing') {
    const progress = computeProgress(generation.createdAt);
    if (progress >= 100) {
      generation.status = 'complete';
      generation.outputUrl = pickRandom(OUTPUTS);
      generation.captions = buildCaptions(generation.tone);
      generation.progress = 100;
    } else {
      generation.progress = Math.max(5, progress);
    }
  }
  return generation;
}
