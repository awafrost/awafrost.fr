import { useEffect } from 'react';

interface StatsData {
  pageVisits: number;
  discordButtonClicks: number;
  uniqueVisitors: number;
  uniqueDiscordClickVisitors: number;
}

export function useTrackStats(
  affiliateCode: string | null,
  eventType: 'page_visit' | 'discord_click'
) {
  useEffect(() => {
    if (!affiliateCode) return;

    const trackEvent = async () => {
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            affiliateCode,
            eventType,
          }),
        });
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    };

    trackEvent();
  }, [affiliateCode, eventType]);
}

export async function fetchAffiliateStats(
  affiliateCode: string
): Promise<StatsData | null> {
  try {
    const res = await fetch(`/api/stats?code=${affiliateCode}`);

    if (!res.ok) {
      console.error('Failed to fetch stats:', res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}
