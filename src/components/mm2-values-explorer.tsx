'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FaArrowDown, FaArrowLeft, FaArrowUp, FaExternalLinkAlt, FaLayerGroup, FaMinus, FaPlus, FaSearch, FaSyncAlt, FaTimes } from 'react-icons/fa';

type TieredValue = { quantity?: number; tier?: number; rarity?: string } | null;
interface ValueRange { min?: number; max?: number; display?: string };
interface MM2ValueItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  value: number | null;
  valueType?: string;
  valueDisplay: string;
  tieredValue?: TieredValue;
  range?: ValueRange | null;
  difference?: number | null;
  percentageChange?: number | null;
  demand?: number | null;
  rarity?: number | null;
  aliases?: string[];
  imageUrl?: string | null;
}
interface DatasetResponse {
  source: string;
  fetchedAt: string;
  localSyncedAt?: string;
  count: number;
  items: MM2ValueItem[];
}
type TradeSide = 'give' | 'receive';
type SortMode = 'value' | 'rising' | 'falling' | 'demand';

const categoryNames: Record<string, string> = {
  ancients: 'Anciens', chromas: 'Chromas', commons: 'Communs', godlies: 'Godly',
  legendaries: 'Légendaires', misc: 'Divers', pets: 'Animaux', rares: 'Rares',
  sets: 'Sets', uncommons: 'Peu communs', uniques: 'Uniques', vintages: 'Vintage',
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date inconnue' : new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}

function ageInMinutes(value: string) {
  const date = new Date(value).getTime();
  return Number.isNaN(date) ? Number.POSITIVE_INFINITY : Math.max(0, (Date.now() - date) / 60_000);
}

function Fluctuation({ item }: { item: MM2ValueItem }) {
  const change = item.difference;
  const percentage = item.percentageChange;
  const positive = typeof change === 'number' && change > 0;
  const negative = typeof change === 'number' && change < 0;
  const color = positive ? 'text-emerald-300' : negative ? 'text-rose-300' : 'text-white/45';
  const Icon = positive ? FaArrowUp : negative ? FaArrowDown : FaMinus;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${color}`}>
      <Icon size={9} aria-hidden="true" />
      {typeof change === 'number' ? `${change > 0 ? '+' : ''}${formatNumber(change)}` : '—'}
      {typeof percentage === 'number' && <span className="font-normal opacity-75">({percentage > 0 ? '+' : ''}{formatNumber(percentage)}%)</span>}
    </span>
  );
}

function ItemRow({ item, add }: { item: MM2ValueItem; add: (item: MM2ValueItem, side: TradeSide) => void }) {
  const range = item.range?.display;
  return (
    <article className="grid gap-3 border-b border-white/[0.07] px-4 py-4 transition hover:bg-white/[0.025] sm:grid-cols-[minmax(0,1.5fr)_minmax(80px,0.65fr)_minmax(130px,1fr)_auto] sm:items-center sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} width={48} height={48} unoptimized className="h-12 w-12 shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.035] object-contain p-1" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]"><FaLayerGroup className="text-white/25" size={14} aria-hidden="true" /></div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{item.name}</p>
          <p className="mt-1 truncate text-[10px] text-white/40">
            {categoryNames[item.category] ?? item.category} <span className="px-1 text-white/20">·</span> {item.id}
            {item.aliases?.length ? <span className="hidden pl-1 text-white/30 md:inline">· {item.aliases.slice(0, 3).join(', ')}</span> : null}
          </p>
        </div>
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-[0.13em] text-white/35 sm:hidden">Valeur{range ? ` · ${range}` : ''}</p>
        <p className="text-sm font-bold text-white">{item.valueDisplay}</p>
        {range && <p className="hidden text-[9px] text-white/35 sm:block">{range}</p>}
      </div>
      <div>
        <p className="mb-1 text-[9px] uppercase tracking-[0.13em] text-white/35 sm:hidden">Variation</p>
        <Fluctuation item={item} />
        {typeof item.demand === 'number' && <p className="mt-1 text-[9px] text-white/35">Demande {item.demand}/10</p>}
      </div>
      <div className="flex gap-2 sm:justify-end">
        <button type="button" onClick={() => add(item, 'give')} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-[9px] font-bold uppercase tracking-wide text-white/60 transition hover:border-rose-200/30 hover:text-rose-100" aria-label={`Ajouter ${item.name} aux objets donnés`}><FaPlus size={8} aria-hidden="true" /> Donner</button>
        <button type="button" onClick={() => add(item, 'receive')} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-[9px] font-bold uppercase tracking-wide text-white/60 transition hover:border-emerald-200/30 hover:text-emerald-100" aria-label={`Ajouter ${item.name} aux objets reçus`}><FaPlus size={8} aria-hidden="true" /> Recevoir</button>
      </div>
    </article>
  );
}

function TradeColumn({ title, side, items, remove, total }: {
  title: string;
  side: TradeSide;
  items: MM2ValueItem[];
  remove: (side: TradeSide, id: string) => void;
  total: { value: number; unknownCount: number };
}) {
  const isGive = side === 'give';
  return (
    <section className={`overflow-hidden rounded-2xl border ${isGive ? 'border-rose-200/15 bg-rose-400/[0.035]' : 'border-emerald-200/15 bg-emerald-400/[0.035]'}`}>
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.19em] text-white/75">{title}</h3>
        <span className="text-[10px] text-white/40">{items.length} objet{items.length === 1 ? '' : 's'}</span>
      </div>
      <div className="min-h-24 divide-y divide-white/[0.06]">
        {items.length === 0 ? <p className="px-4 py-7 text-center text-xs text-white/35">Ajoute des objets depuis les résultats.</p> : items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3">
            {item.imageUrl ? <Image src={item.imageUrl} alt="" width={36} height={36} unoptimized className="h-9 w-9 shrink-0 rounded-lg bg-white/[0.04] object-contain p-0.5" /> : <div className="h-9 w-9 shrink-0 rounded-lg bg-white/[0.04]" />}
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-white/80">{item.name}</p><p className="mt-0.5 text-[9px] text-white/40">{categoryNames[item.category] ?? item.category}</p></div>
            <span className="shrink-0 text-xs font-semibold text-white">{item.valueDisplay}</span>
            <button type="button" onClick={() => remove(side, item.id)} aria-label={`Retirer ${item.name}`} className="rounded-md p-1.5 text-white/30 transition hover:bg-white/10 hover:text-white"><FaTimes size={10} aria-hidden="true" /></button>
          </div>
        ))}
      </div>
      <div className="flex items-end justify-between border-t border-white/[0.08] px-4 py-3.5">
        <div><p className="text-[9px] uppercase tracking-wider text-white/40">Total Supreme</p>{total.unknownCount > 0 && <p className="mt-1 text-[9px] text-amber-100/60">{total.unknownCount} valeur{total.unknownCount === 1 ? '' : 's'} non numériques incluses</p>}</div>
        <p className="text-lg font-black text-white">{formatNumber(total.value)}</p>
      </div>
    </section>
  );
}

export function MM2ValuesExplorer() {
  const [dataset, setDataset] = useState<DatasetResponse | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortMode>('value');
  const [giveItems, setGiveItems] = useState<MM2ValueItem[]>([]);
  const [receiveItems, setReceiveItems] = useState<MM2ValueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDataset = useCallback(async (force = false) => {
    if (force) setRefreshing(true);
    try {
      const response = await fetch('/api/mm2-values', {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Les valeurs MM2 sont momentanément indisponibles.');
      const result = await response.json() as DatasetResponse;
      setDataset(result);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erreur de chargement des valeurs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDataset();
    const interval = window.setInterval(() => void loadDataset(), 5 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [loadDataset]);

  const categories = useMemo(() => {
    const values = Array.from(new Set(dataset?.items.map((item) => item.category) ?? []));
    return values.sort((a, b) => (a === 'godlies' ? -1 : b === 'godlies' ? 1 : a.localeCompare(b)));
  }, [dataset]);

  const visibleItems = useMemo(() => {
    if (!dataset) return [];
    const normalizedQuery = query.trim().toLocaleLowerCase('fr');
    const result = dataset.items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (!normalizedQuery) return true;
      const fields = [item.name, item.slug, item.id, ...(item.aliases ?? [])];
      return fields.some((field) => field.toLocaleLowerCase('fr').includes(normalizedQuery));
    });

    return result.sort((a, b) => {
      if (sort === 'rising') return (b.percentageChange ?? Number.NEGATIVE_INFINITY) - (a.percentageChange ?? Number.NEGATIVE_INFINITY);
      if (sort === 'falling') return (a.percentageChange ?? Number.POSITIVE_INFINITY) - (b.percentageChange ?? Number.POSITIVE_INFINITY);
      if (sort === 'demand') return (b.demand ?? Number.NEGATIVE_INFINITY) - (a.demand ?? Number.NEGATIVE_INFINITY);
      return (b.value ?? Number.NEGATIVE_INFINITY) - (a.value ?? Number.NEGATIVE_INFINITY) || a.name.localeCompare(b.name);
    });
  }, [category, dataset, query, sort]);

  const addToTrade = (item: MM2ValueItem, side: TradeSide) => {
    const setter = side === 'give' ? setGiveItems : setReceiveItems;
    setter((items) => items.some((entry) => entry.id === item.id) || items.length >= 12 ? items : [...items, item]);
  };

  const removeFromTrade = (side: TradeSide, id: string) => {
    const setter = side === 'give' ? setGiveItems : setReceiveItems;
    setter((items) => items.filter((item) => item.id !== id));
  };

  const sumTrade = (items: MM2ValueItem[]) => ({
    value: items.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0),
    unknownCount: items.filter((item) => typeof item.value !== 'number').length,
  });

  const giveTotal = sumTrade(giveItems);
  const receiveTotal = sumTrade(receiveItems);
  const delta = receiveTotal.value - giveTotal.value;
  const tradeHasUnknowns = giveTotal.unknownCount + receiveTotal.unknownCount > 0;
  const updateAge = dataset ? ageInMinutes(dataset.fetchedAt) : Number.POSITIVE_INFINITY;
  const sourceIsStale = !Number.isFinite(updateAge) || updateAge > 24 * 60;

  return (
    <main className="site-shell min-h-screen overflow-hidden px-4 py-10 text-white selection:bg-white selection:text-black sm:px-6 lg:py-14">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 mx-auto h-80 max-w-5xl rounded-full bg-violet-600/[0.08] blur-3xl" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-7">
        <header className="relative overflow-hidden rounded-[1.75rem] border border-violet-200/15 bg-gradient-to-br from-violet-600/25 via-indigo-950/85 to-[#090912] p-6 shadow-[0_24px_70px_rgba(54,22,105,0.16)] sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <a href="/" className="relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100/55 transition hover:text-white"><FaArrowLeft size={10} aria-hidden="true" /> Retour au profil</a>
          <div className="relative mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-violet-200/70">Murder Mystery 2 · Supreme Values</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">Valeurs MM2</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Recherche les Godly et les autres objets, suis leurs variations et compare les deux côtés d’un échange avec les valeurs publiées par Supreme Values.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="https://supremevalues.com/mm2/godlies" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[10px] font-bold text-white/70 transition hover:border-violet-200/25 hover:text-white">Source des valeurs <FaExternalLinkAlt size={9} aria-hidden="true" /></a>
              <button type="button" onClick={() => void loadDataset(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-bold text-[#171321] transition hover:bg-violet-100 disabled:opacity-60"><FaSyncAlt className={refreshing ? 'animate-spin' : ''} size={10} aria-hidden="true" />Recharger la copie locale</button>
            </div>
          </div>
        </header>

        {sourceIsStale && dataset && (
          <div className="rounded-xl border border-amber-200/15 bg-amber-300/[0.05] px-4 py-3 text-xs leading-5 text-amber-100/75">
            La publication source date du {formatDate(dataset.fetchedAt)}. Les valeurs sont servies depuis ta copie locale ; la source n’a pas encore publié de snapshot plus récent.
          </div>
        )}
        {dataset && <p className="px-1 text-[10px] leading-5 text-white/40">Pour remplacer le fichier local par la dernière publication disponible : exécute <span className="font-mono text-white/60">pnpm mm2:sync</span>, puis redéploie le site. Les visites du site ne contactent pas GitHub.</p>}
        {error && <div role="alert" className="rounded-xl border border-rose-200/15 bg-rose-300/[0.05] px-4 py-3 text-xs text-rose-100/80">{error}</div>}

        <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b0b12]/90">
          <div className="grid gap-3 border-b border-white/[0.08] p-4 sm:grid-cols-[minmax(0,1fr)_210px] sm:p-5">
            <label className="relative block">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={12} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chercher un objet, un nom ou un alias" className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-white/30 focus:border-violet-200/30 focus:bg-white/[0.05]" />
            </label>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="h-11 rounded-xl border border-white/10 bg-[#11111a] px-3 text-xs text-white/75 outline-none focus:border-violet-200/30" aria-label="Trier les objets">
              <option value="value">Valeur décroissante</option>
              <option value="rising">Plus fortes hausses</option>
              <option value="falling">Plus fortes baisses</option>
              <option value="demand">Demande</option>
            </select>
          </div>
          <div className="border-b border-white/[0.08] px-4 py-3 sm:px-5">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible sm:pb-0" role="group" aria-label="Filtrer par catégorie">
              {[{ id: 'all', label: 'Toutes les catégories' }, ...categories.map((id) => ({ id, label: categoryNames[id] ?? id }))].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={category === option.id}
                  onClick={() => setCategory(option.id)}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[10px] font-semibold transition ${category === option.id ? 'border-violet-200/30 bg-violet-300/10 text-violet-100' : 'border-white/[0.07] bg-white/[0.02] text-white/45 hover:border-white/15 hover:text-white/80'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[10px] text-white/40 sm:px-5">
            <span>{loading ? 'Chargement des valeurs…' : `${formatNumber(visibleItems.length)} résultat${visibleItems.length === 1 ? '' : 's'} · ${category === 'all' ? 'Toutes catégories' : categoryNames[category] ?? category}`}</span>
            {dataset && <span>Source : {formatDate(dataset.fetchedAt)}{dataset.localSyncedAt ? ` · copie locale : ${formatDate(dataset.localSyncedAt)}` : ''}</span>}
          </div>
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(80px,0.65fr)_minmax(130px,1fr)_auto] border-y border-white/[0.07] bg-white/[0.025] px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/35 sm:grid">
            <span>Objet</span><span>Valeur</span><span>Variation / demande</span><span className="text-right">Trade</span>
          </div>
          {loading && !dataset ? (
            <div className="space-y-3 p-5">{[1, 2, 3, 4].map((row) => <div key={row} className="h-14 animate-pulse rounded-lg bg-white/[0.035]" />)}</div>
          ) : visibleItems.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-white/45">Aucun objet ne correspond à la recherche.</p>
          ) : (
            <div className="max-h-[720px] overflow-y-auto">
              {visibleItems.map((item) => <ItemRow key={item.id} item={item} add={addToTrade} />)}
            </div>
          )}
        </section>

        <section className="space-y-4" aria-labelledby="trade-comparison-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-200/60">Calculateur</p><h2 id="trade-comparison-heading" className="mt-1 text-xl font-black text-white">Comparer un trade</h2></div>
            {(giveItems.length > 0 || receiveItems.length > 0) && <button type="button" onClick={() => { setGiveItems([]); setReceiveItems([]); }} className="text-[10px] font-semibold text-white/45 transition hover:text-white">Effacer la comparaison</button>}
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <TradeColumn title="Tu donnes" side="give" items={giveItems} remove={removeFromTrade} total={giveTotal} />
            <TradeColumn title="Tu reçois" side="receive" items={receiveItems} remove={removeFromTrade} total={receiveTotal} />
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-white/[0.09] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Écart de valeur</p><p className="mt-1 text-sm font-bold text-white">{tradeHasUnknowns ? 'Valeurs non numériques : comparaison partielle' : delta === 0 ? 'Valeurs équivalentes' : delta > 0 ? 'Tu reçois davantage en valeur' : 'Tu donnes davantage en valeur'}</p></div>
            <p className={`text-xl font-black ${tradeHasUnknowns ? 'text-amber-100/75' : delta > 0 ? 'text-emerald-200' : delta < 0 ? 'text-rose-200' : 'text-white'}`}>{delta > 0 ? '+' : ''}{formatNumber(delta)}</p>
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-4 text-[9px] text-white/35">
          <span>Source : {dataset?.source ?? 'Supreme Values MM2'} · copie locale, synchronisée manuellement.</span>
          <a href="/" className="inline-flex items-center gap-1.5 hover:text-white/70">Retour au site <FaExternalLinkAlt size={8} aria-hidden="true" /></a>
        </footer>
      </div>
    </main>
  );
}
