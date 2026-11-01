import { NextRequest } from 'next/server';
import { dashboardCacheHeaders, fetchRobloxJson } from '@/lib/roblox-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const groupId = request.nextUrl.searchParams.get('groupId');

    if (!groupId || !/^\d{1,20}$/.test(groupId)) {
      return Response.json({ error: 'A valid numeric groupId is required' }, { status: 400 });
    }

    const groupData = await fetchRobloxJson(`https://groups.roblox.com/v1/groups/${groupId}`, 3600);

    return Response.json({
      group: groupData,
    }, { headers: dashboardCacheHeaders });
  } catch (error) {
    console.error('Error fetching Roblox group:', error);
    return Response.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}
