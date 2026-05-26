import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const axiosHeadersConfig = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
};

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 });
    }

    // Requêtes parallèles vers les APIs Rolimons
    const [assetsRes, playerInfoRes] = await Promise.allSettled([
      // Récupérer le statut en ligne et premium
      fetch(
        `https://api.rolimons.com/players/v1/playerassets/${userId}`,
        axiosHeadersConfig
      ).then(r => r.json()).catch(() => null),
      
      // Récupérer la valeur totale de l'inventaire
      fetch(
        `https://api.rolimons.com/players/v1/playerinfo/${userId}`,
        axiosHeadersConfig
      ).then(r => r.json()).catch(() => null)
    ]);

    let isPremium = false;
    let isOnline = false;
    let lastLocation = 'Unknown';

    if (assetsRes.status === 'fulfilled' && assetsRes.value) {
      const rData = assetsRes.value;
      isPremium = rData.premium === true;
      isOnline = rData.isOnline || false;
      lastLocation = rData.lastLocation || 'Unknown';
    }

    let rolimonsValue = 'Indisponible';
    let inventoryStatus = 'Privé';

    if (playerInfoRes.status === 'fulfilled' && playerInfoRes.value) {
      const rInfo = playerInfoRes.value;
      if (rInfo.success && rInfo.value !== undefined) {
        const value = rInfo.value;
        rolimonsValue = value >= 1000 ? `${(value / 1000).toFixed(1)}k R$` : `${value} R$`;
        inventoryStatus = 'Public';
      }
    }

    // Déterminer le statut de présence
    let presenceType = 0; // Hors ligne par défaut
    if (isOnline) {
      presenceType = 1; // En jeu
    } else if (lastLocation === 'Website' || lastLocation === 'Studio') {
      presenceType = 2; // Sur le site / Studio
    }

    const statusLabels: Record<number, string> = {
      0: 'Hors ligne',
      1: 'En jeu',
      2: 'Sur le site',
    };

    const statusColors: Record<number, string> = {
      0: '#747f8d', // Gris
      1: '#23a55a', // Vert
      2: '#007acc', // Bleu
    };

    return Response.json({
      isPremium,
      isOnline,
      presenceType,
      statusLabel: statusLabels[presenceType],
      statusColor: statusColors[presenceType],
      rolimonsValue,
      inventoryStatus,
      lastLocation,
    });
  } catch (error) {
    console.error('Error fetching Rolimons data:', error);
    return Response.json({ error: 'Failed to fetch Rolimons data' }, { status: 500 });
  }
}
