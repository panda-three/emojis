export type GenerationStatus = 'processing' | 'complete' | 'failed';

export type Generation = {
  id: string;
  status: GenerationStatus;
  style: string;
  intensity: number;
  tone: string;
  inputUrl?: string | null;
  outputUrl?: string | null;
  captions: string[];
  createdAt: string;
  progress?: number;
};
