import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

interface SupremeValuesDataset {
  source: string;
  fetchedAt: string;
  categoryCount: number;
  count: number;
  items: Array<Record<string, unknown>>;
  localSyncedAt?: string;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const localValuesFile = path.join(process.cwd(), 'data', 'mm2-values.json');

export async function GET() {
  try {
    const [fileContents, fileInfo] = await Promise.all([
      readFile(localValuesFile, 'utf8'),
      stat(localValuesFile),
    ]);
    const dataset = JSON.parse(fileContents) as SupremeValuesDataset;
  if (!Array.isArray(dataset.items) || dataset.items.length === 0 || !dataset.fetchedAt) {
      throw new Error('Le fichier local des valeurs est vide ou invalide.');
  }
    return Response.json({
      ...dataset,
      localSyncedAt: dataset.localSyncedAt ?? fileInfo.mtime.toISOString(),
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Unable to read local Supreme Values MM2 dataset:', error);
    return Response.json({
      error: 'La copie locale des valeurs MM2 est absente. Lance la synchronisation des valeurs puis redémarre le site.',
    }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
