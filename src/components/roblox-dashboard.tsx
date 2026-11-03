'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';

interface DashboardData {
  profile: {
    id: number;
    username: string;
    displayName: string;
    description: string;
    created: string | null;
    url: string;
  } | null;
  subscription: { isActive: boolean; label: string };
  counts: { friends: number | null; followers: number | null };
  presence: { type: number | null; status: string; lastLocation: string | null };
  avatarValue: {
    totalPrice: number;
    pricedItems: number;
    unpricedItems: number;
    bodyBundle: string | null;
    items: Array<{ id: number; name: string; assetType: string; price: number | null; forSale: boolean; url: string }>;
  };
  favoriteGames: Array<{ id: number; name: string; rootPlaceId: number | null; visits: number | null; imageUrl: string | null; url: string }>;
  ownerGroups: Array<{
    id: number;
    name: string;
    memberCount: number;
    hasVerifiedBadge: boolean;
    iconUrl: string | null;
    url: string;
    items: Array<{ id: number; name: string; price: number | null; itemType: string; imageUrl: string | null; url: string }>;
  }>;
  privateServer: { code: string; url: string };
}

interface RobloxDashboardProps {
  userId: string;
}

function formatNumber(value: number | null | undefined) {
  return typeof value === 'number' ? new Intl.NumberFormat('fr-FR').format(value) : '—';
}

function formatRobux(value: number | null) {
  return typeof value === 'number' ? `${formatNumber(value)} R$` : 'Prix indisponible';
}

function statusColor(type: number | null) {
  if (type === 2) return 'bg-emerald-400';
  if (type === 1 || type === 3) return 'bg-sky-400';
  return 'bg-white/25';
}

function SectionHeading({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-white">{title}</h3>
      {detail && <span className="text-[10px] font-mono text-white/40">{detail}</span>}
    </div>
  );
}

function PresenceBadge({ type, label }: { type: number | null; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[10px] font-medium text-white/65">
      <span className={`h-1.5 w-1.5 rounded-full ${statusColor(type)}`} />
      {label}
    </span>
  );
}

export function RobloxDashboard({ userId }: RobloxDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [avatarDetailsOpen, setAvatarDetailsOpen] = useState(false);

  useEffect(() => {
    let disposed = false;
    let activeController: AbortController | null = null;

    const loadDashboard = async () => {
      activeController?.abort();
      const controller = new AbortController();
      activeController = controller;

      try {
        const response = await fetch(`/api/roblox/dashboard?userId=${encodeURIComponent(userId)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Données Roblox temporairement indisponibles.');
        const result = await response.json() as DashboardData;
        if (!disposed) {
          setData(result);
          setError('');
        }
      } catch (fetchError) {
        if (!disposed && !controller.signal.aborted) {
          setError(fetchError instanceof Error ? fetchError.message : 'Erreur de chargement Roblox.');
        }
      } finally {
        if (!disposed && !controller.signal.aborted) setLoading(false);
      }
    };

    loadDashboard();
    const refresh = window.setInterval(loadDashboard, 60_000);
    return () => {
      disposed = true;
      window.clearInterval(refresh);
      activeController?.abort();
    };
  }, [userId]);

  const copyPrivateServer = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.privateServer.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6 py-4" aria-label="Chargement du profil Roblox">
        {[0, 1, 2].map((item) => <div key={item} className="h-24 animate-pulse border-t border-white/10 bg-white/[0.015]" />)}
      </div>
    );
  }
  if (!data) return <p className="py-6 text-sm text-white/50">{error || 'Profil Roblox indisponible.'}</p>;

  return (
    <div className="space-y-7 py-2">
      <header className="relative isolate overflow-hidden rounded-[1.65rem] border border-violet-300/15 bg-gradient-to-br from-violet-600/30 via-indigo-950/80 to-[#090912] p-5 shadow-[0_24px_70px_rgba(54,22,105,0.18)] sm:p-7">
        <div className="pointer-events-none absolute -right-14 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-violet-200/75">Roblox · profil joueur</p>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{data.profile?.displayName ?? 'Profil Roblox'}</h2>
              <PresenceBadge type={data.presence.type} label={data.presence.status} />
            </div>
            <p className="text-xs font-medium text-violet-100/55">@{data.profile?.username ?? userId}<span className="px-2 text-white/20">/</span>{data.subscription.label}</p>
            {data.profile?.description && <p className="max-w-2xl whitespace-pre-line pt-1 text-sm leading-6 text-white/60">{data.profile.description}</p>}
          </div>
          {data.profile && (
            <a href={data.profile.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-bold text-[#171321] shadow-lg shadow-black/15 transition hover:bg-violet-100">
              Ouvrir le profil <FaExternalLinkAlt size={9} aria-hidden="true" />
            </a>
          )}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Amis', value: formatNumber(data.counts.friends) },
          { label: 'Abonnés', value: formatNumber(data.counts.followers) },
          { label: 'Valeur de l’avatar', value: formatRobux(data.avatarValue.totalPrice) },
          { label: 'Roblox Plus', value: data.subscription.isActive ? 'Actif' : 'Non détecté' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5">
            <p className="truncate text-lg font-bold text-white sm:text-xl">{stat.value}</p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="space-y-4 border-b border-white/10 pb-7">
        <SectionHeading title="Présence en direct" detail={data.presence.lastLocation ? `En jeu · ${data.presence.lastLocation}` : undefined} />
        <PresenceBadge type={data.presence.type} label={data.presence.status} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-violet-200/10 bg-gradient-to-br from-violet-500/[0.08] to-white/[0.015]">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-violet-200/70">Accès privé</p>
            <h3 className="mt-1 text-lg font-bold text-white">Serveur privé</h3>
          </div>
          <a href={data.privateServer.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-bold text-[#171321] transition hover:bg-violet-100">Rejoindre <FaExternalLinkAlt size={9} aria-hidden="true" /></a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="min-w-0"><p className="text-[9px] uppercase tracking-[0.16em] text-white/40">Code du serveur</p><p className="mt-1 break-all font-mono text-xs text-white/75">{data.privateServer.code}</p></div>
          <button type="button" onClick={copyPrivateServer} className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white/55 transition hover:border-violet-200/30 hover:text-white">{copied ? 'Copié' : 'Copier le code'}</button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-violet-200/10 bg-gradient-to-br from-violet-500/[0.08] to-white/[0.015]">
        <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-violet-200/70">Prix catalogue actuel</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">{formatRobux(data.avatarValue.totalPrice)}</h3>
            <p className="mt-2 text-[10px] text-white/45">{data.avatarValue.pricedItems} éléments tarifés{data.avatarValue.bodyBundle ? ' · bundle de corps inclus' : ''}</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-200/15 bg-violet-400/10 text-xl font-black text-violet-100" aria-hidden="true">R$</div>
        </div>
        <div className="border-t border-white/[0.08] px-5 sm:px-6">
          <button
            type="button"
            aria-expanded={avatarDetailsOpen}
            onClick={() => setAvatarDetailsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-4 py-4 text-left text-xs font-semibold text-white/70 transition hover:text-white"
          >
            <span>{avatarDetailsOpen ? 'Masquer le détail' : 'Afficher le détail du calcul'} <span className="ml-1 text-[10px] font-normal text-white/35">({data.avatarValue.items.length} éléments)</span></span>
            <svg className={`h-4 w-4 shrink-0 text-violet-200 transition-transform ${avatarDetailsOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {avatarDetailsOpen && (
            <div className="divide-y divide-white/[0.07] border-t border-white/[0.08] pb-2">
              <p className="py-3 text-[10px] leading-5 text-white/40">Les bundles de corps détectés sont comptés une seule fois. Headless est fixé à 31 000 R$ et Korblox à 17 000 R$. Les autres objets hors vente ou sans prix public ({data.avatarValue.unpricedItems}) sont exclus ; ce n’est pas une estimation de revente.</p>
              {data.avatarValue.items.map((item) => (
                <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 py-2.5 text-xs transition hover:text-white">
                  <span className="min-w-0"><span className="block truncate text-white/75">{item.name}</span><span className="mt-0.5 block text-[9px] text-white/35">{item.assetType}</span></span>
                  <span className="shrink-0 font-mono text-white/60">{formatRobux(item.price)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-violet-200/10 bg-gradient-to-br from-violet-500/[0.08] to-white/[0.015]">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.24em] text-violet-200/70">À découvrir</p><h3 className="mt-1 text-lg font-bold text-white">Jeux favoris</h3></div>
                <a href={`https://www.roblox.com/users/${userId}/favorites#!/places`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-white/45 transition hover:text-white">Tous les favoris <FaExternalLinkAlt size={8} aria-hidden="true" /></a>
        </div>
        <div className="border-t border-white/[0.08] p-4 sm:p-5">
          {data.favoriteGames.length === 0 ? <p className="px-1 py-2 text-xs text-white/45">Aucun jeu favori public trouvé.</p> : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {data.favoriteGames.map((game) => (
                <a key={game.id} href={game.url} target="_blank" rel="noreferrer" className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-2.5 transition hover:border-violet-200/25 hover:bg-violet-400/[0.06]">
                  {game.imageUrl ? <Image src={game.imageUrl} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-lg object-cover" unoptimized /> : <div className="h-14 w-14 shrink-0 rounded-lg bg-white/[0.05]" />}
                  <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-white/80 group-hover:text-white">{game.name}</span>{typeof game.visits === 'number' && <span className="mt-1 block text-[9px] text-white/40">{formatNumber(game.visits)} visites</span>}</span>
                  <FaExternalLinkAlt className="mr-1 shrink-0 text-violet-200/50 transition group-hover:text-violet-100" size={9} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-violet-200/10 bg-gradient-to-br from-violet-500/[0.08] to-white/[0.015]">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.24em] text-violet-200/70">Communauté</p><h3 className="mt-1 text-lg font-bold text-white">Groupes & UGC</h3></div>
          <span className="text-[10px] font-mono text-white/40">{data.ownerGroups.length} propriétaire{data.ownerGroups.length === 1 ? '' : 's'}</span>
        </div>
        <div className="space-y-3 border-t border-white/[0.08] p-4 sm:p-5">
          {data.ownerGroups.length === 0 ? <p className="px-1 py-2 text-xs text-white/45">Aucun groupe propriétaire public trouvé.</p> : data.ownerGroups.map((group) => (
            <article key={group.id} className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  {group.iconUrl ? <Image src={group.iconUrl} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-xl object-cover" unoptimized /> : <span className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.05]" />}
                  <div className="min-w-0"><a href={group.url} target="_blank" rel="noreferrer" className="block truncate text-xs font-bold text-white/85 hover:text-white">{group.name}{group.hasVerifiedBadge && <FaCheckCircle className="ml-1 inline-block text-sky-300" size={11} aria-label="Groupe vérifié" />}</a><p className="mt-1 text-[9px] text-white/40">{formatNumber(group.memberCount)} membres · propriétaire</p></div>
                </div>
                <a href={group.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white/50 transition hover:border-violet-200/25 hover:text-white">Groupe <FaExternalLinkAlt size={8} aria-hidden="true" /></a>
              </div>
              <div className="border-t border-white/[0.07] p-3.5">
                <div className="mb-3 flex items-center justify-between gap-2"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-violet-100/65">UGC et créations</p><span className="text-[9px] text-white/35">{group.items.length} affichés</span></div>
                {group.items.length === 0 ? <p className="text-[10px] text-white/40">Aucune création publique trouvée.</p> : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="group/ugc flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2 transition hover:border-violet-200/25 hover:bg-violet-400/[0.05]">
                        {item.imageUrl ? <Image src={item.imageUrl} alt="" width={52} height={52} className="h-[52px] w-[52px] shrink-0 rounded-lg bg-white/[0.04] object-cover" unoptimized /> : <span className="h-[52px] w-[52px] shrink-0 rounded-lg bg-white/[0.04]" />}
                        <span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold text-white/75 group-hover/ugc:text-white">{item.name}</span><span className="mt-1 block text-[9px] text-white/35">{item.itemType}</span></span>
                        <span className="shrink-0 text-right text-[10px] font-mono text-white/55">{formatRobux(item.price)}</span>
                      </a>
                    ))}
                  </div>
                )}
                <a href={`https://www.roblox.com/catalog?CreatorType=Group&CreatorTargetId=${group.id}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-white/40 transition hover:text-white/70">Toutes les créations du groupe <FaExternalLinkAlt size={8} aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
