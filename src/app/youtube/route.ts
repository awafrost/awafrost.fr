import { redirect } from 'next/navigation';

import { socialLinks } from '@/config/links';

export function GET() {
  redirect(socialLinks.youtube);
}