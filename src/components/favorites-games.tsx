'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaEye } from 'react-icons/fa';
import Image from 'next/image';

interface Game {
  placeId: number;
  name: string;
  description: string;
  imageToken?: string;
  imageUrl?: string;
  universeId?: number;
  stats?: {
    playing?: number;
    visits?: number;
    favorites?: number;
  };
}

interface FavoritesGamesProps {
  gameIds: number[];
}

export function FavoritesGames({ gameIds }: FavoritesGamesProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchGames = async () => {
      try {
        const res = await fetch(`/api/roblox/games?gameIds=${gameIds.join(',')}`);
        if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
        const data = await res.json();
        setGames(data.games || []);
      } catch (err) {
        console.error('Error fetching games:', err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    if (gameIds.length > 0) {
      fetchGames();
    } else {
      setLoading(false);
    }
  }, [gameIds, isMounted]);

  // Squelette de chargement (Skeleton) minimaliste
  if (!isMounted || loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden animate-pulse">
            <div className="w-full h-44 bg-white/5" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-white/5 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!gameIds || gameIds.length === 0) return null;

  if (games.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-12 text-center">
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
          Aucune donnée disponible
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game, index) => (
        <motion.a
          key={game.placeId}
          href={`https://www.roblox.com/games/${game.placeId}`}
          target='_blank'
          rel='noreferrer'
          className="group relative rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden transition-all duration-500 hover:border-white/20"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {/* Image du jeu avec overlay progressif */}
          <div className="relative w-full h-44 overflow-hidden border-b border-white/5">
            {game.imageUrl || game.imageToken ? (
              <Image
                src={game.imageUrl || `https://www.roblox.com/game-media?assetId=${game.imageToken}&width=480&height=270&format=png`}
                alt={game.name}
                width={480}
                height={270}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#111] text-[10px] uppercase tracking-widest text-gray-600">
                No Preview
              </div>
            )}
            {/* Overlay noir subtil au survol */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20 px-4 py-2 bg-black/60 backdrop-blur-sm">
                 Lancer le jeu
               </span>
            </div>
          </div>

          {/* Contenu textuel */}
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-sm tracking-tight text-gray-200 line-clamp-1 group-hover:text-white transition-colors">
              {game.name}
            </h3>

            {/* Statistiques épurées */}
            {game.stats && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaUsers size={10} className="text-white/40" />
                    <span className="text-[9px] uppercase font-bold tracking-widest">En jeu</span>
                  </div>
                  <p className="text-xs font-mono text-white">
                    {game.stats.playing?.toLocaleString() ?? '0'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaEye size={10} className="text-white/40" />
                    <span className="text-[9px] uppercase font-bold tracking-widest">Visites</span>
                  </div>
                  <p className="text-xs font-mono text-white">
                    {game.stats.visits?.toLocaleString() ?? '0'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.a>
      ))}
    </div>
  );
}