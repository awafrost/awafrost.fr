import { NextRequest } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { drawWinner, readGiveaways, updateGiveaway } from '@/lib/giveaways';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Accès non autorisé.' }, { status: 401 });
  }
  if (!uuidPattern.test(params.id)) {
    return Response.json({ error: 'Giveaway introuvable.' }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const action = body?.action;
  if (action !== 'finish' && action !== 'draw' && action !== 'reroll') {
    return Response.json({ error: 'Action invalide.' }, { status: 400 });
  }

  try {
    const giveaways = await readGiveaways();
    const giveaway = giveaways.find((item) => item.id === params.id);
    if (!giveaway) return Response.json({ error: 'Giveaway introuvable.' }, { status: 404 });

    if (action === 'finish') {
      giveaway.endsAt = new Date().toISOString();
      drawWinner(giveaway);
    } else {
      const changed = drawWinner(giveaway, action === 'reroll');
      if (!changed) return Response.json({ error: 'Le gagnant est déjà tiré. Utilise le reroll.' }, { status: 409 });
    }

    await updateGiveaway(giveaway);
    return Response.json(giveaway);
  } catch (error) {
    console.error('Admin giveaway action failed:', error);
    return Response.json({ error: 'Impossible de modifier ce giveaway.' }, { status: 503 });
  }
}