import { isAdminAuthenticated } from '@/lib/admin-auth';
import { readGiveaways } from '@/lib/giveaways';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminAuthenticated()) {
    return Response.json({ error: 'Accès non autorisé.' }, { status: 401 });
  }

  try {
    return Response.json(await readGiveaways());
  } catch (error) {
    console.error('Admin giveaway storage is unavailable:', error);
    return Response.json({ error: 'La base de données des giveaways est indisponible.' }, { status: 503 });
  }
}