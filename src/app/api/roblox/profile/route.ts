import { NextRequest } from 'next/server';
import { dashboardCacheHeaders, fetchRobloxJson } from '@/lib/roblox-api';

export const dynamic = 'force-dynamic';

async function optionalJson<T>(url: string): Promise<T | null> {
  try {
    return await fetchRobloxJson<T>(url, 1800);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId || !/^\d{1,20}$/.test(userId)) {
      return Response.json({ error: 'A valid numeric userId is required' }, { status: 400 });
    }

    const [profileData, friendsData, followersData] = await Promise.all([
      optionalJson<{ id: number } & Record<string, unknown>>(`https://users.roblox.com/v1/users/${userId}`),
      optionalJson<{ count: number }>(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
      optionalJson<{ count: number }>(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
    ]);

    if (!profileData) return Response.json({ error: 'Roblox profile is unavailable' }, { status: 502 });
    const fallbackPremium = await optionalJson<{ premium?: boolean }>(`https://api.rolimons.com/players/v1/playerassets/${userId}`);

    return Response.json({
      profile: profileData,
      premium: { isPremium: fallbackPremium?.premium ?? false },
      friends: friendsData ?? { count: 0 },
      followers: followersData ?? { count: 0 },
    }, { headers: dashboardCacheHeaders });
  } catch (error) {
    console.error('Error fetching Roblox profile:', error);
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
