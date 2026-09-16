import { NextRequest } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { createGiveaway, insertGiveaway, readGiveaways } from '@/lib/giveaways';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const giveaways = await readGiveaways();
    return Response.json(
      giveaways
        .filter((giveaway) => new Date(giveaway.endsAt).getTime() > Date.now())
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

  if (!title || !description || !prize || !imageUrl || !endsAt || new Date(endsAt).getTime() <= Date.now()) {
    return Response.json({ error: 'Complète tous les champs avec une date future.' }, { status: 400 });
  }

  if (!imageUrl.startsWith('https://')) {
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
