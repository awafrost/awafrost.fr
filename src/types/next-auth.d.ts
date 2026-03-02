import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      discordId?: string;
      discordUsername?: string;
      discordAvatar?: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface JWT {
    discordId?: string;
    discordUsername?: string;
    discordAvatar?: string;
    accessToken?: string;
  }
}
