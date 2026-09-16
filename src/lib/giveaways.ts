import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

export type GiveawayParticipant = {
  username: string;
  joinedAt: string;
};

export type Giveaway = {
  id: string;
  title: string;
  description: string;
  prize: string;
  imageUrl: string;
  endsAt: string;
  createdAt: string;
  participants: GiveawayParticipant[];
  winner: string | null;
  winnerAnnouncedAt: string | null;
};

const dataPath = path.join(process.cwd(), 'data', 'giveaways.json');
const hasPostgres = Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);

async function ensureLocalFile() {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, '[]', 'utf8');
  }
}

function ensureVercelStorage() {
  if (process.env.VERCEL && !hasPostgres) {
    throw new Error('Giveaway storage is not configured. Add a Vercel Postgres integration.');
  }
}

async function ensureTable() {
  ensureVercelStorage();
  if (!hasPostgres) return;
  await sql`
    CREATE TABLE IF NOT EXISTS giveaways (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      prize TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      ends_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      participants JSONB NOT NULL DEFAULT '[]'::jsonb,
      winner TEXT,
      winner_announced_at TIMESTAMPTZ
    )
  `;
  await sql`ALTER TABLE giveaways ADD COLUMN IF NOT EXISTS winner TEXT`;
  await sql`ALTER TABLE giveaways ADD COLUMN IF NOT EXISTS winner_announced_at TIMESTAMPTZ`;
}

export async function readGiveaways(): Promise<Giveaway[]> {
  if (!hasPostgres) {
    await ensureLocalFile();
    return JSON.parse(await fs.readFile(dataPath, 'utf8')) as Giveaway[];
  }
  await ensureTable();
  const { rows } = await sql`SELECT id, title, description, prize, image_url, ends_at, created_at, participants, winner, winner_announced_at FROM giveaways ORDER BY created_at DESC`;
  return rows.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    prize: row.prize as string,
    imageUrl: row.image_url as string,
    endsAt: new Date(row.ends_at as string).toISOString(),
    createdAt: new Date(row.created_at as string).toISOString(),
    participants: row.participants as GiveawayParticipant[],
    winner: (row.winner as string | null) || null,
    winnerAnnouncedAt: row.winner_announced_at ? new Date(row.winner_announced_at as string).toISOString() : null,
  }));
}

export async function insertGiveaway(giveaway: Giveaway) {
  if (!hasPostgres) {
    const giveaways = await readGiveaways();
    giveaways.unshift(giveaway);
    await fs.writeFile(dataPath, JSON.stringify(giveaways, null, 2), 'utf8');
    return;
  }
  await ensureTable();
  await sql`
    INSERT INTO giveaways (id, title, description, prize, image_url, ends_at, created_at, participants, winner, winner_announced_at)
    VALUES (${giveaway.id}, ${giveaway.title}, ${giveaway.description}, ${giveaway.prize}, ${giveaway.imageUrl}, ${giveaway.endsAt}, ${giveaway.createdAt}, ${JSON.stringify(giveaway.participants)}, ${giveaway.winner}, ${giveaway.winnerAnnouncedAt})
  `;
}

export async function updateGiveaways(giveaways: Giveaway[]) {
  if (!hasPostgres) {
    await ensureLocalFile();
    await fs.writeFile(dataPath, JSON.stringify(giveaways, null, 2), 'utf8');
    return;
  }
  await ensureTable();
  for (const giveaway of giveaways) {
    await sql`
      UPDATE giveaways SET participants = ${JSON.stringify(giveaway.participants)}, winner = ${giveaway.winner}, winner_announced_at = ${giveaway.winnerAnnouncedAt} WHERE id = ${giveaway.id}
    `;
  }
}

export async function updateGiveaway(giveaway: Giveaway) {
  if (!hasPostgres) {
    const giveaways = await readGiveaways();
    const index = giveaways.findIndex((item) => item.id === giveaway.id);
    if (index >= 0) giveaways[index] = giveaway;
    await fs.writeFile(dataPath, JSON.stringify(giveaways, null, 2), 'utf8');
    return;
  }

  await ensureTable();
  await sql`
    UPDATE giveaways
    SET title = ${giveaway.title}, description = ${giveaway.description}, prize = ${giveaway.prize}, image_url = ${giveaway.imageUrl}, ends_at = ${giveaway.endsAt}, participants = ${JSON.stringify(giveaway.participants)}, winner = ${giveaway.winner}, winner_announced_at = ${giveaway.winnerAnnouncedAt}
    WHERE id = ${giveaway.id}
  `;
}

export function drawWinner(giveaway: Giveaway, reroll = false) {
  if (!reroll && giveaway.winnerAnnouncedAt) return false;

  giveaway.winner = giveaway.participants.length > 0
    ? giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)].username
    : null;
  giveaway.winnerAnnouncedAt = new Date().toISOString();
  return true;
}

export function createGiveaway(input: Pick<Giveaway, 'title' | 'description' | 'prize' | 'imageUrl' | 'endsAt'>): Giveaway {
  return {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    participants: [],
    winner: null,
    winnerAnnouncedAt: null,
  };
}
