'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaExternalLinkAlt, FaLayerGroup, FaPlus, FaSearch, FaTimes, FaExchangeAlt, FaTrashAlt, FaStar } from 'react-icons/fa';

type TieredValue = { quantity?: number; tier?: number; rarity?: string } | null;
interface ValueRange { min?: number; max?: number; display?: string };
interface MM2ValueItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  itemType?: string | null;
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
  count: number;
  items: MM2ValueItem[];
  credit?: string | null;
}
type TradeSide = 'give' | 'receive';
type SortMode = 'value' | 'demand';
type ItemKind = 'weapons' | 'pets' | 'misc' | 'all';
interface SavedComparatorState {
  query: string;
  category: string;
  kind: ItemKind;
  showTrophies: boolean;
  sort: SortMode;
  giveIds: string[];
  receiveIds: string[];
}

const COMPARATOR_COOKIE = 'mm2-comparator';

function readComparatorCookie(): SavedComparatorState | null {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie.split('; ').find((entry) => entry.startsWith(`${COMPARATOR_COOKIE}=`));
  if (!cookie) return null;

  try {
    const saved = JSON.parse(decodeURIComponent(cookie.slice(COMPARATOR_COOKIE.length + 1))) as Partial<SavedComparatorState>;
    return {
      query: typeof saved.query === 'string' ? saved.query.slice(0, 100) : '',
      category: typeof saved.category === 'string' ? saved.category.slice(0, 80) : 'all',
      kind: ['weapons', 'pets', 'misc', 'all'].includes(saved.kind ?? '') ? saved.kind as ItemKind : 'weapons',
      showTrophies: saved.showTrophies === true,
      sort: saved.sort === 'demand' ? 'demand' : 'value',
      giveIds: Array.isArray(saved.giveIds) ? saved.giveIds.filter((id): id is string => typeof id === 'string').slice(0, 12) : [],
      receiveIds: Array.isArray(saved.receiveIds) ? saved.receiveIds.filter((id): id is string => typeof id === 'string').slice(0, 12) : [],
    };
  } catch {
    return null;
  }
}

function writeComparatorCookie(state: SavedComparatorState) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COMPARATOR_COOKIE}=${encodeURIComponent(JSON.stringify(state))}; Path=/mm2-values; Max-Age=15552000; SameSite=Lax${secure}`;
}

const categoryNames: Record<string, string> = {
  ancients: 'Anciens', chromas: 'Chromas', commons: 'Communs', godlies: 'Godly',
  legendaries: 'Légendaires', misc: 'Divers', pets: 'Animaux', rares: 'Rares',
  sets: 'Sets', uncommons: 'Peu communs', uniques: 'Uniques', vintages: 'Vintage',
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(value);
}

function itemKind(item: MM2ValueItem): Exclude<ItemKind, 'all'> {
  const type = item.itemType?.toLocaleLowerCase('fr') ?? '';
  if (type.includes('pet') || item.category === 'pets') return 'pets';
  if (type.includes('misc') || item.category === 'misc') return 'misc';
  return 'weapons';
}

function isTrophy(item: MM2ValueItem) {
  const category = item.category.toLocaleLowerCase('fr');
  const details = [item.name, item.itemType ?? '', ...(item.aliases ?? [])].join(' ').toLocaleLowerCase('fr');
  return category === 'evo'
    || /troph|leaderboard/.test(`${category} ${details}`)
    || /slouse[’']s clown|nik[’']s scythe/.test(details)
    || /^(?:bronze|blue|red|silver|gold|bornze)(?:\s|$)/i.test(item.name);
}

function ItemImage({ item, size, className }: { item: MM2ValueItem; size: number; className: string }) {
  const [failed, setFailed] = useState(false);
  if (!item.imageUrl || failed) {
    return <div className={`flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 ${className}`}>
      <FaLayerGroup className="text-white/30" size={size > 40 ? 16 : 12} aria-hidden="true" />
    </div>;
  }
  return <Image src={item.imageUrl} alt={item.name} width={size} height={size} unoptimized onError={() => setFailed(true)} className={className} />;
}

function ItemRow({ item, add }: { item: MM2ValueItem; add: (item: MM2ValueItem, side: TradeSide) => void }) {
  const range = item.range?.display;
  return (
    <article className="grid gap-3 border-b border-white/10 px-4 py-3.5 transition hover:bg-white/5 sm:grid-cols-[minmax(0,1.5fr)_minmax(80px,0.65fr)_minmax(80px,0.5fr)_auto] sm:items-center sm:px-5">
      <div className="flex min-w-0 items-center gap-3.5">
        <ItemImage item={item} size={52} className="h-13 w-13 border border-white/10 rounded-2xl bg-black/30 object-contain p-1.5 shadow-md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{item.name}</p>
          <p className="mt-0.5 truncate text-[11px] font-medium text-purple-300">
            {categoryNames[item.category] ?? item.category}
            {item.aliases?.length ? <span className="hidden pl-1 text-white/40 md:inline">· {item.aliases.slice(0, 3).join(', ')}</span> : null}
          </p>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 sm:hidden">Valeur{range ? ` · ${range}` : ''}</p>
        <p className="text-base font-black text-amber-400 drop-shadow">{item.valueDisplay}</p>
        {range && <p className="hidden text-[10px] text-white/40 sm:block">{range}</p>}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 sm:hidden">Demande</p>
        <p className="text-sm font-bold text-sky-300">{typeof item.demand === 'number' ? `${item.demand} / 10 ⭐️` : '—'}</p>
      </div>
      <div className="flex gap-2 sm:justify-end">
        <button 
          type="button" 
          onClick={() => add(item, 'give')} 
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-200 transition hover:bg-rose-500 hover:text-white shadow-sm active:scale-95" 
          aria-label={`Donner ${item.name}`}
        >
          <FaPlus size={10} aria-hidden="true" /> Donner
        </button>
        <button 
          type="button" 
          onClick={() => add(item, 'receive')} 
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-2 text-xs font-black uppercase tracking-wider text-emerald-200 transition hover:bg-emerald-500 hover:text-white shadow-sm active:scale-95" 
          aria-label={`Recevoir ${item.name}`}
        >
          <FaPlus size={10} aria-hidden="true" /> Recevoir
        </button>
      </div>
    </article>
  );
}

function TradeColumn({ title, side, items, remove, total, colorTheme }: {
  title: string;
  side: TradeSide;
  items: MM2ValueItem[];
  remove: (side: TradeSide, index: number) => void;
  total: { value: number; unknownCount: number };
  colorTheme: 'rose' | 'emerald';
}) {
  const isGive = side === 'give';
  const borderColor = isGive ? 'border-rose-500/30' : 'border-emerald-500/30';
  const bgColor = isGive ? 'bg-rose-950/20' : 'bg-emerald-950/20';
  const badgeColor = isGive ? 'bg-rose-500/30 text-rose-200' : 'bg-emerald-500/30 text-emerald-200';

  return (
    <section className={`overflow-hidden rounded-3xl border ${borderColor} ${bgColor} backdrop-blur-md shadow-xl flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isGive ? 'bg-rose-500' : 'bg-emerald-500'} inline-block animate-pulse`} />
            {title}
          </h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {items.length} objet{items.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="min-h-[140px] max-h-[280px] overflow-y-auto divide-y divide-white/5 p-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-xs text-white/40">
              <FaPlus className="mb-2 text-white/20 text-xl" />
              <span>Clique sur <strong>{isGive ? 'Donner' : 'Recevoir'}</strong> dans la liste en bas pour ajouter des objets !</span>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:bg-white/5">
                <ItemImage item={item} size={42} className="h-10 w-10 rounded-xl bg-black/40 object-contain p-1 border border-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-white">{item.name}</p>
                  <p className="mt-0.5 text-[10px] text-purple-300">{categoryNames[item.category] ?? item.category}</p>
                </div>
                <span className="shrink-0 text-xs font-black text-amber-400">{item.valueDisplay}</span>
                <button 
                  type="button" 
                  onClick={() => remove(side, index)} 
                  aria-label={`Retirer un exemplaire de ${item.name}`} 
                  className="rounded-lg p-2 text-white/40 transition hover:bg-rose-500/20 hover:text-rose-200"
                >
                  <FaTimes size={12} aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 bg-black/20">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Total de ce côté</p>
          {total.unknownCount > 0 && <p className="mt-0.5 text-[9px] text-amber-300">({total.unknownCount} non chiffré)</p>}
        </div>
        <p className="text-xl font-black text-amber-400">{formatNumber(total.value)} 💎</p>
      </div>
    </section>
  );
}

export function MM2ValuesExplorer() {
  const [dataset, setDataset] = useState<DatasetResponse | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [kind, setKind] = useState<ItemKind>('weapons');
  const [showTrophies, setShowTrophies] = useState(false);
  const [sort, setSort] = useState<SortMode>('value');
  const [giveItems, setGiveItems] = useState<MM2ValueItem[]>([]);
  const [receiveItems, setReceiveItems] = useState<MM2ValueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRestored, setIsRestored] = useState(false);
  const [tradesHydrated, setTradesHydrated] = useState(false);
  const [savedTradeIds, setSavedTradeIds] = useState<{ give: string[]; receive: string[] }>({ give: [], receive: [] });

  const loadDataset = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    const saved = readComparatorCookie();
    if (saved) {
      setQuery(saved.query);
      setCategory(saved.category);
      setKind(saved.kind);
      setShowTrophies(saved.showTrophies);
      setSort(saved.sort);
      setSavedTradeIds({ give: saved.giveIds, receive: saved.receiveIds });
    }
    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (!isRestored || !dataset || tradesHydrated) return;
    const itemsById = new Map(dataset.items.map((item) => [item.id, item]));
    setGiveItems(savedTradeIds.give.flatMap((id) => itemsById.has(id) ? [itemsById.get(id)!] : []));
    setReceiveItems(savedTradeIds.receive.flatMap((id) => itemsById.has(id) ? [itemsById.get(id)!] : []));
    setTradesHydrated(true);
  }, [dataset, isRestored, savedTradeIds, tradesHydrated]);

  useEffect(() => {
    if (!isRestored || !tradesHydrated) return;
    writeComparatorCookie({
      query,
      category,
      kind,
      showTrophies,
      sort,
      giveIds: giveItems.map((item) => item.id),
      receiveIds: receiveItems.map((item) => item.id),
    });
  }, [category, giveItems, isRestored, kind, query, receiveItems, showTrophies, sort, tradesHydrated]);

  useEffect(() => {
    void loadDataset();
    const interval = window.setInterval(() => void loadDataset(), 30 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [loadDataset]);

  const categories = useMemo(() => {
    const values = Array.from(new Set(dataset?.items
      .filter((item) => (showTrophies || !isTrophy(item)) && (kind === 'all' || itemKind(item) === kind))
      .map((item) => item.category) ?? []));
    return values.sort((a, b) => (a === 'godlies' ? -1 : b === 'godlies' ? 1 : a.localeCompare(b)));
  }, [dataset, kind, showTrophies]);

  const visibleItems = useMemo(() => {
    if (!dataset) return [];
    const normalizedQuery = query.trim().toLocaleLowerCase('fr');
    const result = dataset.items.filter((item) => {
      if (!showTrophies && isTrophy(item)) return false;
      if (kind !== 'all' && itemKind(item) !== kind) return false;
      if (category !== 'all' && item.category !== category) return false;
      if (!normalizedQuery) return true;
      const fields = [item.name, item.slug, item.id, ...(item.aliases ?? [])];
      return fields.some((field) => field.toLocaleLowerCase('fr').includes(normalizedQuery));
    });

    return result.sort((a, b) => {
      if (sort === 'demand') return (b.demand ?? Number.NEGATIVE_INFINITY) - (a.demand ?? Number.NEGATIVE_INFINITY);
      return (b.value ?? Number.NEGATIVE_INFINITY) - (a.value ?? Number.NEGATIVE_INFINITY) || a.name.localeCompare(b.name);
    });
  }, [category, dataset, kind, query, showTrophies, sort]);

  const addToTrade = (item: MM2ValueItem, side: TradeSide) => {
    const setter = side === 'give' ? setGiveItems : setReceiveItems;
    setter((items) => items.length >= 12 ? items : [...items, item]);
  };

  const removeFromTrade = (side: TradeSide, index: number) => {
    const setter = side === 'give' ? setGiveItems : setReceiveItems;
    setter((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  const sumTrade = (items: MM2ValueItem[]) => ({
    value: items.reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0),
    unknownCount: items.filter((item) => typeof item.value !== 'number').length,
  });

  const giveTotal = sumTrade(giveItems);
  const receiveTotal = sumTrade(receiveItems);
  const delta = receiveTotal.value - giveTotal.value;
  const tradeHasUnknowns = giveTotal.unknownCount + receiveTotal.unknownCount > 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0c1b] via-[#15102b] to-[#090710] px-4 py-8 text-white selection:bg-purple-500 selection:text-white sm:px-6 lg:py-12">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 mx-auto h-96 max-w-4xl rounded-full bg-purple-600/15 blur-[120px]" />
      
      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        
        {/* EN-TÊTE JEU / ENFANT */}
        <header className="relative overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-pink-500/10 blur-2xl pointer-events-none" />
          <a href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 hover:text-white transition bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
            <FaArrowLeft size={10} aria-hidden="true" /> Retour au profil
          </a>
          <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-widest mb-2">
                <FaStar size={12} /> Mode Trade Sécurisé MM2
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Comparateur & Valeurs MM2 🗡️</h1>
              <p className="mt-2 text-sm text-purple-200/70 font-medium">Vérifie tes échanges en haut, puis cherche tes armes et objets préférés en bas !</p>
            </div>
          </div>
        </header>

        {error && <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200 font-bold">{error}</div>}

        {/* 1. COMPARATEUR EN HAUT (DEMANDÉ) */}
        <section className="space-y-4 rounded-3xl border border-purple-500/20 bg-purple-950/20 p-5 sm:p-6 shadow-xl backdrop-blur-md" aria-labelledby="trade-comparison-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <FaExchangeAlt size={16} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">Simulateur d&apos;échange</span>
                <h2 id="trade-comparison-heading" className="text-lg font-black text-white">Comparateur de Trade</h2>
              </div>
            </div>
            {(giveItems.length > 0 || receiveItems.length > 0) && (
              <button 
                type="button" 
                onClick={() => { setGiveItems([]); setReceiveItems([]); }} 
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-200 transition hover:bg-rose-500 hover:text-white"
              >
                <FaTrashAlt size={10} /> Tout effacer
              </button>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TradeColumn title="Tu donnes" side="give" items={giveItems} remove={removeFromTrade} total={giveTotal} colorTheme="rose" />
            <TradeColumn title="Tu reçois" side="receive" items={receiveItems} remove={removeFromTrade} total={receiveTotal} colorTheme="emerald" />
          </div>

          {/* Verdict du Trade */}
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 shadow-inner">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-purple-300">Analyse du Trade 🎯</p>
              <p className="mt-0.5 text-sm font-bold text-white">
                {tradeHasUnknowns 
                  ? '⚠️ Certains objets n’ont pas de valeur chiffrée exacte.' 
                  : delta === 0 
                  ? '⚖️ Échange parfaitement équilibré !' 
                  : delta > 0 
                  ? '🎉 Super trade ! Tu gagnes en valeur.' 
                  : '🚨 Attention ! Tu perds de la valeur sur cet échange.'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-white/50 block">Différence</span>
              <p className={`text-xl font-black ${tradeHasUnknowns ? 'text-amber-300' : delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-white'}`}>
                {delta > 0 ? `+${formatNumber(delta)}` : formatNumber(delta)} 💎
              </p>
            </div>
          </div>
        </section>

        {/* 2. RECHERCHE ET LISTE DES VALEURS EN BAS (DEMANDÉ) */}
        <section className="overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-900/80 shadow-2xl backdrop-blur-md">
          <div className="p-5 sm:p-6 border-b border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                <FaSearch className="text-purple-400" /> Catalogue des Valeurs MM2
              </h3>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
              <label className="relative block">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300" size={14} aria-hidden="true" />
                <input 
                  value={query} 
                  onChange={(event) => setQuery(event.target.value)} 
                  placeholder="Chercher une arme, un couteau, un pistolet..." 
                  className="h-12 w-full rounded-2xl border border-purple-500/30 bg-purple-950/30 pl-11 pr-4 text-xs font-semibold text-white outline-none transition placeholder:text-white/40 focus:border-purple-400 focus:bg-purple-950/50 shadow-inner" 
                />
              </label>
              <select 
                value={sort} 
                onChange={(event) => setSort(event.target.value as SortMode)} 
                className="h-12 rounded-2xl border border-purple-500/30 bg-purple-950/40 px-4 text-xs font-bold text-white outline-none focus:border-purple-400 shadow-inner cursor-pointer" 
                aria-label="Trier les objets"
              >
                <option value="value" className="bg-slate-900">🔥 Trier par Valeur</option>
                <option value="demand" className="bg-slate-900">⭐ Trier par Demande</option>
              </select>
            </div>

            {/* Filtres par type d'objet */}
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible sm:pb-0" role="group" aria-label="Filtrer par type d’objet">
              {([{ id: 'weapons', label: '⚔️ Armes' }, { id: 'pets', label: '🐾 Animaux' }, { id: 'misc', label: '🎁 Divers' }, { id: 'all', label: '🌟 Tout afficher' }] as const).map((option) => (
                <button 
                  key={option.id} 
                  type="button" 
                  aria-pressed={kind === option.id} 
                  onClick={() => { setKind(option.id); setCategory('all'); }} 
                  className={`shrink-0 rounded-xl border px-4 py-2.5 text-xs font-bold transition shadow-sm ${kind === option.id ? 'border-purple-400 bg-purple-600 text-white shadow-purple-500/25 shadow-md' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-purple-200">
                <input
                  type="checkbox"
                  checked={showTrophies}
                  onChange={(event) => {
                    setShowTrophies(event.target.checked);
                    setCategory('all');
                  }}
                  className="h-4 w-4 accent-purple-500 rounded cursor-pointer"
                />
                Inclure les trophées rares 🏆
              </label>
            </div>

            {/* Filtres par catégorie */}
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible sm:pb-0 pt-2 border-t border-white/5" role="group" aria-label="Filtrer par catégorie">
              {[{ id: 'all', label: 'Toutes les catégories' }, ...categories.map((id) => ({ id, label: categoryNames[id] ?? id }))].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={category === option.id}
                  onClick={() => setCategory(option.id)}
                  className={`shrink-0 rounded-xl border px-3.5 py-2 text-[11px] font-bold transition ${category === option.id ? 'border-pink-400 bg-pink-600 text-white shadow-pink-500/25 shadow-md' : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-3 text-xs font-bold text-purple-300/80 bg-black/20 border-b border-white/10">
            <span>{loading ? 'Chargement des objets...' : `✨ ${formatNumber(visibleItems.length)} objet${visibleItems.length === 1 ? '' : 's'} trouvé${visibleItems.length === 1 ? '' : 's'}`}</span>
          </div>

          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(80px,0.65fr)_minmax(80px,0.5fr)_auto] border-b border-white/10 bg-white/5 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-purple-300 sm:grid">
            <span>Objet</span>
            <span>Valeur</span>
            <span>Demande</span>
            <span className="text-right">Action Échange</span>
          </div>

          {loading && !dataset ? (
            <div className="space-y-3 p-5">{[1, 2, 3, 4].map((row) => <div key={row} className="h-16 animate-pulse rounded-2xl bg-white/5" />)}</div>
          ) : visibleItems.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-base font-bold text-white">Oups ! Aucun objet trouvé 🔍</p>
              <p className="mt-1 text-xs text-white/50">Vérifie l&apos;orthographe ou change de catégorie.</p>
            </div>
          ) : (
            <div className="max-h-[650px] overflow-y-auto">
              {visibleItems.map((item) => <ItemRow key={item.id} item={item} add={addToTrade} />)}
            </div>
          )}
        </section>

        {/* PIED DE PAGE */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/40">
          {dataset?.credit && <span>{dataset.credit}</span>}
          <a href="/" className="inline-flex items-center gap-1.5 hover:text-white transition font-bold">Retour au site <FaExternalLinkAlt size={10} aria-hidden="true" /></a>
        </footer>

      </div>
    </main>
  );
}