import { NextRequest } from 'next/server';
import { fetchRobloxJson, dashboardCacheHeaders } from '@/lib/roblox-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId || !/^\d{1,20}$/.test(userId)) {
      return Response.json({ error: 'A valid numeric userId is required' }, { status: 400 });
    }

    const type = request.nextUrl.searchParams.get('type') === 'headshot' ? 'headshot' : 'avatar';
    const thumbnailUrl = type === 'headshot'
      ? `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(userId)}&size=420x420&format=Png&isCircular=false`
      : `https://thumbnails.roblox.com/v1/users/avatar?userIds=${encodeURIComponent(userId)}&size=720x720&format=Png&isCircular=false`;
    const data = await fetchRobloxJson(thumbnailUrl, 60);
    return Response.json(data, {
      headers: {
        ...dashboardCacheHeaders,
        'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return Response.json({ data: [] });
  }
}
