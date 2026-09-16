import { createHmac } from 'crypto';
import { cookies } from 'next/headers';

export const adminCookieName = 'frost_admin_session';
const adminUsername = process.env.ADMIN_USERNAME || 'awa';
const adminPassword = process.env.ADMIN_PASSWORD || '101010';
const sessionSecret = process.env.ADMIN_SESSION_SECRET || 'frost-local-admin-secret';

export function isAdminCredentials(username: string, password: string) {
  return username === adminUsername && password === adminPassword;
}

export function createAdminToken() {
  return createHmac('sha256', sessionSecret).update(`${adminUsername}:admin`).digest('hex');
}

export function isAdminAuthenticated() {
  const token = cookies().get(adminCookieName)?.value;
  if (!token) return false;

  const expected = createAdminToken();
  if (token.length !== expected.length) return false;

  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= token.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return difference === 0;
}
