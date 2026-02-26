import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const groupId = request.nextUrl.searchParams.get('groupId');

    if (!groupId) {
      return Response.json({ error: 'groupId is required' }, { status: 400 });
    }

    // Récupérer les infos du groupe
    const groupRes = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
    const groupData = await groupRes.json();

    return Response.json({
      group: groupData,
    });
  } catch (error) {
    console.error('Error fetching Roblox group:', error);
    return Response.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}
