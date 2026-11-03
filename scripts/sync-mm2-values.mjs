import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceFile = path.join(rootDir, 'MM2 Values', 'docs', 'values.json');
const outputFile = path.join(rootDir, 'data', 'mm2-values.json');
const temporaryFile = `${outputFile}.tmp`;
const excludedItems = new Set([
  'godlies:batwing',
  'godlies:black-luger',
  'godlies:mortal-blade',
]);

try {
  const source = JSON.parse(await readFile(sourceFile, 'utf8'));
  if (!Array.isArray(source.items) || source.items.length < 500 || !source.fetchedAt) {
    throw new Error('Le snapshot de MM2 Values/docs est incomplet ou invalide.');
  }

  const items = source.items
    .filter((item) => !excludedItems.has(item.id))
    .map((item) => ({
      ...item,
      imageUrl: item.imageKey ? `https://supremevalues.com/media/${item.imageKey}.webp` : null,
    }));

  let previous = null;
  try {
    previous = JSON.parse(await readFile(outputFile, 'utf8'));
  } catch {
    // Le premier snapshot local n’existe pas encore.
  }

  if (previous?.fetchedAt && Date.parse(previous.fetchedAt) > Date.parse(source.fetchedAt)) {
    console.warn('Le snapshot local est plus récent que MM2 Values/docs; aucune donnée locale n’est remplacée.');
    process.exit(0);
  }

  const sameItems = previous
    && JSON.stringify(previous.items) === JSON.stringify(items)
    && previous.fetchedAt === source.fetchedAt;
  if (sameItems) {
    console.log(`La copie locale est déjà à jour (${items.length} objets, source ${source.fetchedAt}).`);
    process.exit(0);
  }

  const dataset = {
    ...source,
    count: items.length,
    items,
    localSyncedAt: new Date().toISOString(),
  };
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(temporaryFile, `${JSON.stringify(dataset, null, 2)}\n`, 'utf8');
  await rename(temporaryFile, outputFile);

  console.log(`Copie locale mise à jour : ${items.length} objets / ${dataset.categoryCount} catégories.`);
  console.log(`Source : ${dataset.fetchedAt}; synchronisé localement : ${dataset.localSyncedAt}.`);
  console.log(`Entrées Godly invalides écartées : ${source.items.length - items.length}.`);
} catch (error) {
  console.error('Échec de synchronisation du snapshot MM2 local :', error);
  process.exitCode = 1;
}
