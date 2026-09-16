import { NextRequest } from 'next/server';
import { adminCookieName, createAdminToken, isAdminCredentials } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username.trim().slice(0, 64) : '';
  const password = typeof body?.password === 'string' ? body.password.slice(0, 128) : '';

  if (!isAdminCredentials(username, password)) {
    return Response.json({ error: 'Identifiants invalides.' }, { status: 401 });
  }

  const response = Response.json({ ok: true });
  response.headers.append(
    'Set-Cookie',
    `${adminCookieName}=${createAdminToken()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
  );
  return response;
}
