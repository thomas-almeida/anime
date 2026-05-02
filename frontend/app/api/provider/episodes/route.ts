import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, provider } = body;

    if (!url || !provider) {
      return NextResponse.json(
        { error: 'URL and provider are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/provider/episodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, provider }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch episodes from provider' },
      { status: 500 }
    );
  }
}
