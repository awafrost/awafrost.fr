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
    const universeMap: Record<number, number> = {
      286090429: 111958650,   // Arsenal
      606849621: 245662005,   // Jailbreak
      142823291: 66654135,    // Murder Mystery 2
    };

    // Construire la liste des universeIds avec fallback pour les jeux inconnus
    const universeIds: number[] = [];
    const placeIdToGameId: Record<number, number> = {};

    for (const gameId of gameIdArray) {
      if (universeMap[gameId]) {
        // Jeu connu dans la carte
        universeIds.push(universeMap[gameId]);
        placeIdToGameId[universeMap[gameId]] = gameId;
      } else {
        // Jeu inconnu - essayer de récupérer l'universeId via l'API
        try {
          const detailRes = await fetch(`https://apis.roblox.com/universes/v1/places/${gameId}/universe`, {
            headers: { 'Accept': 'application/json' }
          });
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            if (detailData.universeId) {
              universeIds.push(detailData.universeId);
              placeIdToGameId[detailData.universeId] = gameId;
            }
          }
        } catch (err) {
          console.error(`Could not fetch universeId for placeId ${gameId}:`, err);
        }
      }
    }

    if (universeIds.length === 0) {
      return Response.json({ games: [] });
    }

    // Obtenir les données complètes depuis l'API publique de Roblox
    const gamesRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`,
      { headers: { 'Accept': 'application/json' } }
    );

    if (!gamesRes.ok) {
      console.error('Erreur API Roblox games:', gamesRes.status);
      return Response.json({ games: [] });
    }

    const gamesData = await gamesRes.json();

    if (!gamesData.data || !Array.isArray(gamesData.data)) {
      return Response.json({ games: [] });
    }

    // Enrichir avec les informations d'images via l'API thumbnails
    const gamesWithImages = await Promise.all(
      gamesData.data.map(async (game: any) => {
        const placeId = game.rootPlaceId;
        let imageUrl: string | null = null;

        try {
          // Essayer d'obtenir l'image via l'API thumbnails de Roblox
          const thumbnailRes = await fetch(
            `https://thumbnails.roblox.com/v1/games/universes/${game.id}/thumbnail?size=768x432&format=Png&isCircular=false`,
            { headers: { 'Accept': 'application/json' } }
          );

          if (thumbnailRes.ok) {
            const thumbData = await thumbnailRes.json();
            if (thumbData.data && thumbData.data[0] && thumbData.data[0].imageUrl) {
              imageUrl = thumbData.data[0].imageUrl;
            }
          }

          // Si pas d'image via l'API thumbnails, essayer via og:image du site
          if (!imageUrl) {
            try {
              const pageRes = await fetch(`https://www.roblox.com/games/${placeId}`, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
                signal: AbortSignal.timeout(5000),
              });

              if (pageRes.ok) {
                const html = await pageRes.text();
                const ogImageMatch = html.match(/og:image"\s+content="([^"]+)"/);
                if (ogImageMatch && ogImageMatch[1]) {
                  imageUrl = ogImageMatch[1];
                }
              }
            } catch (err) {
              console.log(`Scraping failed for game ${placeId}`);
            }
          }
        } catch (err) {
          console.log(`Failed to fetch thumbnail for universe ${game.id}`);
        }

        return {
          placeId: placeId,
          name: game.name,
          description: game.description || '',
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
    return Response.json({ games: [], error: 'Failed to fetch games' }, { status: 500 });
  }
}
