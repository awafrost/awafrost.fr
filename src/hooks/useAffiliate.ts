import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Game {
  gameId: number;
  gameName: string;
  position: number;
}

interface AffiliateData {
  _id: string;
  affiliateCode: string;
  youtube?: { url: string; displayName: string };
  twitter?: { url: string; displayName: string };
  roblox?: { username: string; userId: number };
  favoriteGames?: Game[];
  discordUsername: string;
  discordInvite: string;
  partnerName: string;
  profileDescription?: string;
}

export function useAffiliate() {
  const { data: session, status } = useSession();
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAffiliate = useCallback(async () => {
    if (status !== 'authenticated') return;

    try {
      setLoading(true);
      const res = await fetch('/api/affiliate');

      if (res.status === 404) {
        setAffiliate(null);
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch affiliate');
      const data = await res.json();
      setAffiliate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [status]);

  const createAffiliate = async (): Promise<AffiliateData | null> => {
    try {
      setLoading(true);
      const res = await fetch('/api/affiliate', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to create affiliate');
      const data = await res.json();
      setAffiliate(data);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateAffiliate = async (
    updates: Partial<AffiliateData>
  ): Promise<AffiliateData | null> => {
    try {
      setLoading(true);
      const res = await fetch('/api/affiliate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to update affiliate');
      const data = await res.json();
      setAffiliate(data);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generatePublicUrl = (): string => {
    if (!affiliate) return '';
    return `${process.env.NEXT_PUBLIC_SITE_URL}/partenaire/${affiliate.affiliateCode}`;
  };

  useEffect(() => {
    fetchAffiliate();
  }, [fetchAffiliate]);

  return {
    affiliate,
    loading,
    error,
    isAuthenticated: status === 'authenticated',
    fetchAffiliate,
    createAffiliate,
    updateAffiliate,
    generatePublicUrl,
  };
}
