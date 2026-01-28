import { NextResponse } from 'next/server';
import { createGeneration, listGenerations } from '../../../lib/server/generations';

export const runtime = 'nodejs';

export async function GET() {
  const generations = await listGenerations();
  return NextResponse.json({ generations });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const generation = await createGeneration(formData);
    return NextResponse.json({ generation }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成失败';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
