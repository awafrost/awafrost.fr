import { z } from 'zod';

const API_BASE_URL = 'https://api.rblxvalue.com/v2';
const PAGE_SIZE = 100;
const CACHE_TTL_MS = 30 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15_000;

const numericInputSchema = z.union([z.number(), z.string()]).nullable().optional();
const itemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string().min(1),
  slug: z.string().min(1),
  acronym: z.string().nullable().optional(),
  value: numericInputSchema,
  category: z.string().min(1),
  type: z.string().nullable().optional(),
  demand: numericInputSchema,
  rarity: numericInputSchema,
  range: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  last_updated: z.string().nullable().optional(),
});

const pageSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  items: z.array(itemSchema),
  credit: z.string().nullable().optional(),
});

const categoryNames: Record<string, string> = {
  godly: 'godlies',
  ancient: 'ancients',
  legendary: 'legendaries',
  vintage: 'vintages',
  rare: 'rares',
  uncommon: 'uncommons',
  common: 'commons',
  chroma: 'chromas',
  unique: 'uniques',
  pet: 'pets',
  pets: 'pets',
  misc: 'misc',
  miscellaneous: 'misc',
};

export interface RblxValueItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  itemType: string | null;
  value: number | null;
  valueType: 'numeric' | 'unknown';
  valueDisplay: string;
  tieredValue: null;
  range: { display: string } | null;
  difference: null;
  percentageChange: null;
  demand: number | null;
  rarity: number | null;
  aliases: string[];
  imageUrl: string | null;
}

export interface RblxValueDataset {
  source: 'RBLXValue';
  sourceBaseUrl: string;
  fetchedAt: string;
  count: number;
  items: RblxValueItem[];
  credit: string | null;
}

let cachedDataset: RblxValueDataset | null = null;
let cachedAt = 0;
let pendingRequest: Promise<RblxValueDataset> | null = null;

function parseNumber(value: number | string | null | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = Number(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCategory(category: string) {
  const normalized = category.toLowerCase();
  return categoryNames[normalized] ?? normalized;
}

function toDatasetItem(item: z.infer<typeof itemSchema>): RblxValueItem {
  const category = normalizeCategory(item.category);
  const value = parseNumber(item.value);
  const range = item.range && !/^n\/?a$/i.test(item.range.trim())
    ? { display: item.range }
    : null;

  return {
    id: `${category}:${item.slug.toLowerCase()}`,
    slug: item.slug.toLowerCase(),
    name: item.name,
    category,
    itemType: item.type ?? null,
    value,
    valueType: value === null ? 'unknown' : 'numeric',
    valueDisplay: value === null ? 'N/A' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value),
    tieredValue: null,
    range,
    difference: null,
    percentageChange: null,
    demand: parseNumber(item.demand),
    rarity: parseNumber(item.rarity),
    aliases: item.acronym ? [item.acronym] : [],
    imageUrl: item.image_url ?? null,
  };
}

async function getPage(apiKey: string, offset: number) {
  const url = new URL(`${API_BASE_URL}/items`);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('offset', String(offset));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { 'X-Api-Key': apiKey },
      signal: controller.signal,
      next: { revalidate: CACHE_TTL_MS / 1000 },
    });
    if (!response.ok) {
      const message = response.status === 401
        ? 'RBLXValue ne reçoit pas de clé API. Vérifie la configuration du service.'
        : response.status === 403
          ? 'La clé API RBLXValue est invalide, désactivée ou expirée. Crée une nouvelle clé puis redémarre le site.'
          : response.status === 429
            ? 'La limite de requêtes RBLXValue est atteinte. Réessaie dans une minute.'
            : `RBLXValue a répondu avec le statut HTTP ${response.status}.`;
      throw new Error(`${message} (HTTP ${response.status})`);
    }

    const parsed = pageSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new Error('La réponse RBLXValue ne respecte pas le format attendu.');
    }
    if (parsed.data.offset !== offset) {
      throw new Error('RBLXValue a retourné une page incohérente.');
    }
    return parsed.data;
  } finally {
    clearTimeout(timeout);
  }
}

async function loadDataset(apiKey: string): Promise<RblxValueDataset> {
  const receivedItems: RblxValueItem[] = [];
  let offset = 0;
  let total = 0;
  let credit: string | null = null;

  do {
    const page = await getPage(apiKey, offset);
    total = page.total;
    credit ??= page.credit ?? null;
    if (page.items.length === 0 && offset < total) {
      throw new Error('La pagination RBLXValue s’est arrêtée avant la fin des données.');
    }
    receivedItems.push(...page.items.map(toDatasetItem));
    offset += page.items.length;
  } while (offset < total);

  if (receivedItems.length !== total || receivedItems.length === 0) {
    throw new Error('Le jeu de données RBLXValue est incomplet ou vide.');
  }

  const uniqueItems = new Map<string, RblxValueItem>();
  for (const item of receivedItems) uniqueItems.set(item.id, item);
  const items = Array.from(uniqueItems.values());

  return {
    source: 'RBLXValue',
    sourceBaseUrl: API_BASE_URL,
    fetchedAt: new Date().toISOString(),
    count: items.length,
    items: items.sort((left, right) => left.name.localeCompare(right.name)),
    credit,
  };
}

export async function getRblxValueDataset(apiKey: string) {
  if (cachedDataset && Date.now() - cachedAt < CACHE_TTL_MS) return cachedDataset;
  if (pendingRequest) return pendingRequest;

  pendingRequest = loadDataset(apiKey)
    .then((dataset) => {
      cachedDataset = dataset;
      cachedAt = Date.now();
      return dataset;
    })
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}

export function getLastGoodRblxValueDataset() {
  return cachedDataset;
}
