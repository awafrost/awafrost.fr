import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const gameIds = request.nextUrl.searchParams.get('gameIds');
    const groupId = request.nextUrl.searchParams.get('groupId');

    if (groupId) {
      // Récupérer les infos du groupe
      const groupRes = await fetch(
        `https://groups.roblox.com/v1/groups/${groupId}`,
        { next: { revalidate: 3600 } }
      );

      if (!groupRes.ok) {
        throw new Error(`Failed to fetch group: ${groupRes.status}`);
      }

      const groupData = await groupRes.json();
      return Response.json({ group: groupData });
    }

    if (gameIds) {
      // Récupérer les infos des jeux
      const gamesArray = gameIds.split(',');
      
      const gamesData = await Promise.all(
        gamesArray.map(async (gameId) => {
          try {
            const universeRes = await fetch(
              `https://games.roblox.com/v1/games?universeIds=${gameId}`,
              { next: { revalidate: 300 } }
            );
            const universeData = await universeRes.json();
            
            if (universeData.data && universeData.data.length > 0) {
              return universeData.data[0];
            }
            return null;
          } catch (err) {
            console.error(`Error fetching game ${gameId}:`, err);
            return null;
          }
        })
      );

      return Response.json({ games: gamesData.filter(Boolean) });
    }

    return Response.json({ error: 'gameIds or groupId is required' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
