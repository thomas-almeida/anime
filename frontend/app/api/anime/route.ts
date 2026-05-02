import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint') || 'search';

  let backendUrl = '';
  const params = new URLSearchParams();

  switch (endpoint) {
    case 'search':
      const q = searchParams.get('q');
      if (!q) {
        return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
      }
      params.append('q', q);
      if (searchParams.get('limit')) params.append('limit', searchParams.get('limit')!);
      backendUrl = `${BACKEND_URL}/api/anime/search?${params.toString()}`;
      break;

    case 'top':
      if (searchParams.get('filter')) params.append('filter', searchParams.get('filter')!);
      if (searchParams.get('limit')) params.append('limit', searchParams.get('limit')!);
      backendUrl = `${BACKEND_URL}/api/anime/top?${params.toString()}`;
      break;

    case 'season/now':
      if (searchParams.get('limit')) params.append('limit', searchParams.get('limit')!);
      backendUrl = `${BACKEND_URL}/api/anime/season/now?${params.toString()}`;
      break;

    case 'schedule':
      if (searchParams.get('day')) params.append('day', searchParams.get('day')!);
      backendUrl = `${BACKEND_URL}/api/anime/schedule?${params.toString()}`;
      break;

    default:
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  try {
    const response = await fetch(backendUrl);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: 500 });
  }
}
