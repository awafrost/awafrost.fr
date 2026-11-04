import { getLastGoodRblxValueDataset, getRblxValueDataset } from '@/lib/rblxvalue';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.RBLXVALUE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Le service de valeurs est momentanément indisponible.' }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  try {
    const dataset = await getRblxValueDataset(apiKey);
    return Response.json(dataset, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue pendant le chargement des valeurs.';
    console.error('Unable to fetch MM2 value dataset:', message);
    const lastGoodDataset = getLastGoodRblxValueDataset();
    if (lastGoodDataset) {
      return Response.json(lastGoodDataset, { headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json({ error: message }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
