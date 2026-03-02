'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AffiliateStats {
  _id: string;
  userId: string;
  discordUsername: string;
  affiliateCode: string;
  youtube?: { url: string; displayName: string };
  twitter?: { url: string; displayName: string };
  roblox?: { username: string; userId: number };
  favoriteGames?: Array<{ gameId: number; gameName: string }>;
  pageVisits: number;
  discordButtonClicks: number;
  uniqueVisitors: number;
  uniqueDiscordClickVisitors: number;
  isActive: boolean;
  createdAt: string;
}

interface AdminData {
  affiliates: AffiliateStats[];
  totals: {
    totalAffiliates: number;
    totalVisits: number;
    totalDiscordClicks: number;
    totalUniqueVisitors: number;
  };
}

const ADMIN_ID = '1223271105184268412';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      const userDiscordId = (session?.user as any)?.discordId;

      if (userDiscordId !== ADMIN_ID) {
        setError('Accès refusé - Admin uniquement');
        setLoading(false);
        return;
      }

      fetchAdminStats();
    }
  }, [status, session]);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des stats');
      }

      const data = await res.json();
      setAdminData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-lg border border-destructive/30 bg-destructive/10 p-6">
          <h1 className="mb-4 text-2xl font-bold text-destructive">{error}</h1>
          <Link
            href="/"
            className="inline-block text-destructive hover:underline"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Panel Admin</h1>
            <p className="mt-2 text-muted-foreground">Gestion des affiliations</p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-2 text-foreground transition-colors hover:bg-muted"
          >
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Stats Globales */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Total Affiliés</h3>
            <p className="text-3xl font-bold text-foreground">
              {adminData.totals.totalAffiliates}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Visites totales</h3>
            <p className="text-3xl font-bold text-foreground">
              {adminData.totals.totalVisits}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Clics Discord</h3>
            <p className="text-3xl font-bold text-foreground">
              {adminData.totals.totalDiscordClicks}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Visiteurs uniques</h3>
            <p className="text-3xl font-bold text-foreground">
              {adminData.totals.totalUniqueVisitors}
            </p>
          </div>
        </div>

        {/* Tableau des affiliés */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">
              Téléaffiliés ({adminData.affiliates.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Code
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Visites
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Visiteurs Uniques
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Clics Discord
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Réseaux
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-muted-foreground">
                    Créé
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminData.affiliates.map((affiliate) => (
                  <tr
                    key={affiliate._id}
                    className="border-b border-border transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {affiliate.discordUsername}
                        </p>
                        <p className="text-xs text-muted-foreground">{affiliate.userId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-muted px-2 py-1 text-sm text-foreground font-mono">
                        {affiliate.affiliateCode}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-center text-foreground">
                      {affiliate.pageVisits}
                    </td>
                    <td className="px-6 py-4 text-center text-foreground">
                      {affiliate.uniqueVisitors}
                    </td>
                    <td className="px-6 py-4 text-center text-foreground">
                      {affiliate.discordButtonClicks}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({affiliate.uniqueDiscordClickVisitors})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        {affiliate.youtube && (
                          <span className="inline-block h-6 w-6 rounded bg-muted text-center text-xs leading-6 text-foreground font-semibold">
                            Y
                          </span>
                        )}
                        {affiliate.twitter && (
                          <span className="inline-block h-6 w-6 rounded bg-muted text-center text-xs leading-6 text-foreground font-semibold">
                            T
                          </span>
                        )}
                        {affiliate.roblox && (
                          <span className="inline-block h-6 w-6 rounded bg-muted text-center text-xs leading-6 text-foreground font-semibold">
                            R
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                      {new Date(affiliate.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Légende */}
        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <h3 className="mb-3 font-semibold text-foreground">Légende</h3>
          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <div>
              <span className="inline-block h-5 w-5 rounded bg-muted text-center text-xs leading-5 text-foreground font-semibold">
                Y
              </span>{' '}
              = YouTube connecté
            </div>
            <div>
              <span className="inline-block h-5 w-5 rounded bg-muted text-center text-xs leading-5 text-foreground font-semibold">
                T
              </span>{' '}
              = Twitter connecté
            </div>
            <div>
              <span className="inline-block h-5 w-5 rounded bg-muted text-center text-xs leading-5 text-foreground font-semibold">
                R
              </span>{' '}
              = Roblox connecté
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
