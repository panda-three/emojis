import { NextResponse } from 'next/server';
import { getGeneration } from '../../../../lib/server/generations';

export const runtime = 'nodejs';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const generation = await getGeneration(params.id);
  if (!generation) {
    return NextResponse.json({ error: '未找到该生成记录' }, { status: 404 });
  }
  return NextResponse.json({ generation });
}
