import { NextRequest } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { createGiveaway, drawWinner, insertGiveaway, readGiveaways, updateGiveaway } from '@/lib/giveaways';

export const dynamic = 'force-dynamic';

async function announceExpiredWinners(giveaways: Awaited<ReturnType<typeof readGiveaways>>) {
  const now = Date.now();
  let changed = false;

  for (const giveaway of giveaways) {
    if (new Date(giveaway.endsAt).getTime() <= now && !giveaway.winner) {
      changed = drawWinner(giveaway) || changed;
    }
  }

  if (changed) {
    await Promise.all(giveaways.filter((giveaway) => giveaway.winnerAnnouncedAt).map(updateGiveaway));
  }
}

export async function GET() {
  try {
    const giveaways = await readGiveaways();
    await announceExpiredWinners(giveaways);
    return Response.json(
      giveaways
        .filter((giveaway) => {
          const isActive = new Date(giveaway.endsAt).getTime() > Date.now();
          const isRecentAnnouncement = giveaway.winnerAnnouncedAt && Date.now() - new Date(giveaway.winnerAnnouncedAt).getTime() < 86400000;
          return isActive || isRecentAnnouncement;
        })
        .map(({ participants, ...giveaway }) => ({ ...giveaway, participantCount: participants.length })),
    );
  } catch (error) {
    console.error('Giveaway storage is unavailable:', error);
    return Response.json({ error: 'La base de données des giveaways n’est pas configurée.' }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Accès non autorisé.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const prize = typeof body?.prize === 'string' ? body.prize.trim() : '';
  const imageUrl = typeof body?.imageUrl === 'string' ? body.imageUrl.trim() : '';
  const endsAt = typeof body?.endsAt === 'string' ? body.endsAt : '';

  if (
    !title || title.length > 120 ||
    !description || description.length > 2000 ||
    !prize || prize.length > 200 ||
    !imageUrl || imageUrl.length > 2048 ||
    !endsAt || new Date(endsAt).getTime() <= Date.now()
  ) {
    return Response.json({ error: 'Champs invalides ou trop longs. Vérifie aussi la date future.' }, { status: 400 });
  }

  try {
    const parsedImageUrl = new URL(imageUrl);
    if (parsedImageUrl.protocol !== 'https:') throw new Error('Invalid image protocol');
  } catch {
    return Response.json({ error: 'L’image doit utiliser une URL HTTPS.' }, { status: 400 });
  }

  const giveaway = createGiveaway({ title, description, prize, imageUrl, endsAt: new Date(endsAt).toISOString() });
  try {
    await insertGiveaway(giveaway);
    return Response.json(giveaway, { status: 201 });
  } catch (error) {
    console.error('Giveaway storage is unavailable:', error);
    return Response.json({ error: 'La base de données des giveaways n’est pas configurée.' }, { status: 503 });
  }
}
