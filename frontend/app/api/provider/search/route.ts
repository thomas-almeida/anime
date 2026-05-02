import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, provider } = body;

    if (!title || !provider) {
      return NextResponse.json(
        { error: 'Title and provider are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/provider/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, provider }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search on provider' },
      { status: 500 }
    );
  }
}
