import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const gameIds = request.nextUrl.searchParams.get('gameIds');

    if (!gameIds) {
      return Response.json({ error: 'gameIds is required' }, { status: 400 });
    }

    const gameIdArray = gameIds.split(',').map(id => parseInt(id));

    // Carte de placeIds vers universeIds pour les jeux connus
    // Peut être étendue dynamiquement si nécessaire
    const universeMap: Record<number, number> = {
      286090429: 111958650,   // Arsenal
      606849621: 245662005,   // Jailbreak
      142823291: 66654135,    // Murder Mystery 2
    };

    // Obtenir les universeIds nécessaires
    const universeIds = gameIdArray
      .map(id => universeMap[id])
      .filter(Boolean);

    if (universeIds.length === 0) {
      return Response.json({ games: [] });
    }

    // Obtenir les données complètes depuis l'API publique de Roblox
    const gamesRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`,
      { headers: { 'Accept': 'application/json' } }
    );

    if (!gamesRes.ok) {
      console.error('Erreur API Roblox:', gamesRes.status);
      return Response.json({ games: [] });
    }

    const gamesData = await gamesRes.json();

    // Si pas de données, retourner vide
    if (!gamesData.data || !Array.isArray(gamesData.data)) {
      return Response.json({ games: [] });
    }

    // Enrichir avec les informations d'images
    const gamesWithImages = await Promise.all(
      gamesData.data.map(async (game: any) => {
        // Obtenir l'ID de place original pour l'URL Roblox
        const placeId = gameIdArray.find(id => universeMap[id] === game.id) || game.rootPlaceId;
        
        // Récupérer l'image en scrapant la page du jeu
        let imageUrl: string | null = null;
        try {
          const pageRes = await fetch(`https://www.roblox.com/games/${placeId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          });
          
          if (pageRes.ok) {
            const html = await pageRes.text();
            // Extraire l'URL de og:image
            const ogImageMatch = html.match(/og:image"\s+content="([^"]+)"/);
            if (ogImageMatch && ogImageMatch[1]) {
              imageUrl = ogImageMatch[1];
            }
          }
        } catch (err) {
          console.log(`Impossible de récupérer l'image pour le jeu ${placeId}`);
        }

        return {
          placeId: placeId,
          name: game.name,
          description: game.description,
          universeId: game.id,
          imageUrl: imageUrl,
          stats: {
            playing: game.playing || 0,
            visits: game.visits || 0,
            favorites: game.favoritedCount || 0,
          },
        };
      })
    );

    return Response.json({
      games: gamesWithImages,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux Roblox:', error);
    return Response.json({ games: [] });
  }
}
