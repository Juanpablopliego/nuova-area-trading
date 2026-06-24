import { NextResponse } from 'next/server';
import { getContent, setContentAtPath } from '@/lib/db';

export async function GET() {
  const data = await getContent();
  return NextResponse.json(data);
}

export async function PUT(request) {
  const { path, value } = await request.json();
  if (!Array.isArray(path) || path.length === 0) {
    return NextResponse.json({ error: 'path must be a non-empty array' }, { status: 400 });
  }
  const data = await setContentAtPath(path, value);
  return NextResponse.json(data);
}
