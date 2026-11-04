declare namespace NodeJS {
  interface ProcessEnv extends Env {
    readonly NEXT_PUBLIC_VERCEL_URL: string;
    readonly PORT: string;
    readonly DISCORD_VIDEO_REMOVAL_WEBHOOK_URL: string;
  }
}
