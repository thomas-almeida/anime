import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { mal_id: string } }
) {
  const { mal_id } = await params;

  try {
    const response = await fetch(
      `${BACK_END_URL}/api/anime/${mal_id}`
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch anime details' },
      { status: 500 }
    );
  }
}
