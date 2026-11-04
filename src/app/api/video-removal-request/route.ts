import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const recentRequests = new Map<string, number[]>();
const allowedTikTokHosts = new Set(['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'm.tiktok.com']);

function isTikTokVideoUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && !url.username
      && !url.password
      && allowedTikTokHosts.has(url.hostname.toLowerCase())
      && url.pathname.length > 1;
  } catch {
    return false;
  }
}

function takeRateLimitToken(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const clientKey = forwardedFor?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const timestamps = (recentRequests.get(clientKey) ?? []).filter((time) => now - time < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    recentRequests.set(clientKey, timestamps);
    return false;
  }
  timestamps.push(now);
  recentRequests.set(clientKey, timestamps);
  return true;
}

export async function POST(request: NextRequest) {
  if (!takeRateLimitToken(request)) {
    return Response.json({ error: 'Trop de demandes. Réessaie dans quelques minutes.' }, { status: 429 });
  }

  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'La demande est invalide.' }, { status: 400 });
  }

  const { videoUrl, reason } = body as { videoUrl?: unknown; reason?: unknown };
  if (typeof videoUrl !== 'string' || videoUrl.length > 2048 || !isTikTokVideoUrl(videoUrl)) {
    return Response.json({ error: 'Entre un lien https valide vers une vidéo TikTok.' }, { status: 400 });
  }
  if (typeof reason !== 'string' || reason.trim().length < 10 || reason.trim().length > 1200) {
    return Response.json({ error: 'La raison doit contenir entre 10 et 1200 caractères.' }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_VIDEO_REMOVAL_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: 'Le formulaire est momentanément indisponible. Contacte-moi sur Discord.' }, { status: 503 });
  }

  let webhook: URL;
  try {
    webhook = new URL(webhookUrl);
  } catch {
    console.error('Video removal webhook URL is misconfigured.');
    return Response.json({ error: 'Le formulaire est momentanément indisponible.' }, { status: 503 });
  }
  if (webhook.protocol !== 'https:' || !['discord.com', 'discordapp.com'].includes(webhook.hostname) || !webhook.pathname.startsWith('/api/webhooks/')) {
    console.error('Video removal webhook URL is misconfigured.');
    return Response.json({ error: 'Le formulaire est momentanément indisponible.' }, { status: 503 });
  }

  try {
    const discordResponse = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Demandes de retrait',
        allowed_mentions: { parse: [] },
        embeds: [{
          title: 'Nouvelle demande de suppression de vidéo',
          color: 0x9b59b6,
          url: videoUrl,
          fields: [
            { name: 'Vidéo TikTok', value: `[Ouvrir la vidéo](${videoUrl})`, inline: false },
            { name: 'Motif de la demande', value: reason.trim(), inline: false },
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'Formulaire de awafrost.fr' },
        }],
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!discordResponse.ok) {
      console.error(`Video removal webhook returned HTTP ${discordResponse.status}.`);
      return Response.json({ error: 'La demande n’a pas pu être transmise. Réessaie plus tard.' }, { status: 502 });
    }
  } catch {
    console.error('Unable to deliver video removal request to Discord.');
    return Response.json({ error: 'La demande n’a pas pu être transmise. Réessaie plus tard.' }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}
