import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import dbConnect from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (!user.email) return false;

      try {
        await dbConnect();

        // Check if user exists or create new one
        const existingUser = await User.findOne({
          discordId: profile?.id,
        });

        if (!existingUser) {
          await User.create({
            discordId: profile?.id,
            discordUsername: profile?.username,
            discordEmail: user.email,
            discordAvatar: profile?.image_url,
            discordDiscriminator: profile?.discriminator,
          });
        } else {
          // Update user info if changed
          await User.updateOne(
            { discordId: profile?.id },
            {
              discordUsername: profile?.username,
              discordAvatar: profile?.image_url,
              discordDiscriminator: profile?.discriminator,
            }
          );
        }

        return true;
      } catch (error) {
        console.error('SignIn callback error:', error);
        return false;
      }
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.discordId = profile?.id;
        token.discordUsername = profile?.username;
        token.discordAvatar = profile?.image_url;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.discordId = token.discordId;
      session.user.discordUsername = token.discordUsername;
      session.user.discordAvatar = token.discordAvatar;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
