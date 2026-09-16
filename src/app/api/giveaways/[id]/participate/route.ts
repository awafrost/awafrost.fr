import { NextRequest } from 'next/server';
import { readGiveaways, updateGiveaways } from '@/lib/giveaways';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return Response.json({ error: 'Entre un pseudo Roblox valide.' }, { status: 400 });
  }

  let giveaways;
  try {
    giveaways = await readGiveaways();
  } catch (error) {
    console.error('Giveaway storage is unavailable:', error);
    return Response.json({ error: 'La base de données des giveaways n’est pas configurée.' }, { status: 503 });
  }
  const giveaway = giveaways.find((item) => item.id === params.id);
  if (!giveaway) return Response.json({ error: 'Giveaway introuvable.' }, { status: 404 });
  if (new Date(giveaway.endsAt).getTime() <= Date.now()) {
    return Response.json({ error: 'Ce giveaway est terminé.' }, { status: 400 });
  }
  if (giveaway.participants.some((participant) => participant.username.toLowerCase() === username.toLowerCase())) {
    return Response.json({ error: 'Ce pseudo participe déjà.' }, { status: 409 });
  }

  giveaway.participants.push({ username, joinedAt: new Date().toISOString() });
  try {
    await updateGiveaways(giveaways);
  } catch (error) {
    console.error('Giveaway storage is unavailable:', error);
    return Response.json({ error: 'La base de données des giveaways n’est pas configurée.' }, { status: 503 });
  }
  return Response.json({ ok: true, participantCount: giveaway.participants.length });
}
