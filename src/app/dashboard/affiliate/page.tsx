'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Affiliate {
  _id: string;
  affiliateCode: string;
  youtube?: { url: string; displayName: string };
  twitter?: { url: string; displayName: string };
  roblox?: { username: string; userId: number };
  favoriteGames?: Array<{ gameId: number; gameName: string }>;
  discordUsername: string;
  discordInvite: string;
  partnerName: string;
}

export default function AffiliateDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAffiliate();
    }
  }, [status]);

  const fetchAffiliate = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/affiliate');

      if (res.status === 404) {
        setAffiliate(null);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch affiliate');
      const data = await res.json();
      setAffiliate(data);

      // Fetch stats
      const statsRes = await fetch(
        `/api/stats?code=${data.affiliateCode}`
      );
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createAffiliate = async () => {
    try {
      setIsCreating(true);
      const res = await fetch('/api/affiliate', {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to create affiliate');
      const data = await res.json();
      setAffiliate(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  const affiliateLink = affiliate
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/partenaire/${affiliate.affiliateCode}`
    : null;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de bord Affiliation
            </h1>
            <p className="mt-2 text-muted-foreground">
              Bienvenue, {session?.user?.name}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            Déconnexion
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {!affiliate ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Créer votre lien d&apos;affiliation
            </h2>
            <p className="mb-6 text-muted-foreground">
              Vous n&apos;avez pas encore créé votre lien d&apos;affiliation. Cliquez sur
              le bouton ci-dessous pour commencer.
            </p>
            <button
              onClick={createAffiliate}
              disabled={isCreating}
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isCreating ? 'Création...' : 'Créer mon affiliation'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Affiliate Link Card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                Votre lien d&apos;affiliation
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={affiliateLink || ''}
                  readOnly
                  className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 text-foreground"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(affiliateLink || '');
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Copier
                </button>
              </div>
            </div>

            {/* Statistics Card */}
            {stats && (
              <div className="space-y-4 rounded-lg border border-border bg-card p-6">
                <h2 className="text-xl font-semibold text-foreground">Statistiques</h2>
                
                {/* Visites totales */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-muted-foreground">Visites totales</label>
                    <span className="text-lg font-bold text-foreground">{stats.pageVisits}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                      style={{width: `${Math.min((stats.pageVisits / 100) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Visiteurs uniques: {stats.uniqueVisitors}</p>
                </div>

                {/* Clics Discord */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-muted-foreground">Clics sur Discord</label>
                    <span className="text-lg font-bold text-foreground">{stats.discordButtonClicks}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                      style={{width: `${Math.min((stats.discordButtonClicks / 100) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">Visiteurs uniques: {stats.uniqueDiscordClickVisitors}</p>
                </div>

                {/* Ratio de conversion */}
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-muted-foreground">Taux de conversion</label>
                    <span className="text-lg font-bold text-foreground">
                      {stats.pageVisits > 0 ? ((stats.discordButtonClicks / stats.pageVisits) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                      style={{width: `${stats.pageVisits > 0 ? ((stats.discordButtonClicks / stats.pageVisits) * 100) : 0}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Button */}
            <Link
              href={`/dashboard/affiliate/edit`}
              className="inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              Éditer mon profil d&apos;affiliation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
