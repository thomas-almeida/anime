import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { mal_id: string } }
) {
  const { mal_id } = await params;

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/anime/${mal_id}/episodes`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}
