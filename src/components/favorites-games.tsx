'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaEye } from 'react-icons/fa';

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
        if (!res.ok) throw new Error('Failed to fetch games');
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
    }
  }, [gameIds, isMounted]);

  if (!isMounted || loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Mes Jeux Favoris</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (games.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mes Jeux Favoris</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game, index) => (
          <motion.a
            key={game.placeId}
            href={`https://www.roblox.com/games/${game.placeId}`}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border bg-card overflow-hidden transition-all hover:border-primary hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Image du jeu */}
            <div className="relative w-full h-40 bg-muted/50 overflow-hidden">
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : game.imageToken ? (
                <img
                  src={`https://www.roblox.com/game-media?assetId=${game.imageToken}&width=480&height=270&format=png`}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            {/* Contenu */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {game.name}
              </h3>

              {/* Stats */}
              {game.stats && (
                <div className="space-y-2 text-sm">
                  {game.stats.playing !== undefined && (
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <FaUsers className="w-4 h-4" />
                        En jeu
                      </span>
                      <span className="font-semibold text-foreground">{game.stats.playing.toLocaleString()}</span>
                    </div>
                  )}
                  {game.stats.visits !== undefined && (
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <FaEye className="w-4 h-4" />
                        Visites
                      </span>
                      <span className="font-semibold text-foreground">{game.stats.visits.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
