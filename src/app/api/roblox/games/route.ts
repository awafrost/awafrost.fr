import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const gameIds = request.nextUrl.searchParams.get('gameIds');

    if (!gameIds) {
      return Response.json({ error: 'gameIds is required' }, { status: 400 });
    }

    const gameIdArray = gameIds.split(',').map(id => id.trim());

    console.log('🔵 Fetching games for universeIds:', gameIdArray);

    // Récupérer les infos des jeux via multiget
    const res = await fetch(
      `https://games.roblox.com/v1/games/multiget?universeIds=${gameIdArray.join(',')}`
    );

    console.log('🔵 Roblox API response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Roblox API error:', errorText);
      return Response.json({ games: [] });
    }

    const data = await res.json();
    console.log('🔵 Roblox API data received:', data.data?.length, 'games');

    const games = (data.data || []).map((game: any) => ({
      id: game.rootPlaceId,
      name: game.name,
      universeId: game.id,
      imageUrl: null, // Will be fetched separately if needed
    }));

    console.log('✅ Returning games:', games);
    return Response.json({ games });
  } catch (error) {
    console.error('❌ Error fetching games:', error);
    return Response.json({ games: [], error: 'Failed to fetch games' }, { status: 500 });
  }
}

