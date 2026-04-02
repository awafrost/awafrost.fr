'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Game {
  id: string;
  name: string;
  imageUrl?: string;
}

interface GamesListProps {
  gameIds: number[]; // These are actually universe IDs
}

export function GamesList({ gameIds }: GamesListProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        console.log('🔵 Fetching games with IDs:', gameIds);
        // Récupérer via l'API existante /api/roblox/games
        const res = await fetch(`/api/roblox/games?gameIds=${gameIds.join(',')}`);
        console.log('🔵 Games response status:', res.status);
        
        if (!res.ok) throw new Error('Failed to fetch games');
        
        const data = await res.json();
        console.log('🔵 Games data:', data);
        setGames(data.games || []);
      } catch (err) {
        console.error('Erreur jeux:', err);
        setGames([]);
      } finally {
        setLoading(false);
      }
    }

    if (gameIds.length > 0) {
      fetchGames();
    }
  }, [gameIds]);

  if (loading) {
    return (
      <section>
        <h2 className="text-xl font-bold mb-4">Continuer à jouer</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-[#121314] rounded-xl animate-pulse border border-white/5 overflow-hidden">
              <div className="aspect-[16/9] bg-[#232527]" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[#232527] rounded w-20" />
                <div className="h-3 bg-[#232527] rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (games.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-bold mb-4">Continuer à jouer</h2>
        <div className="text-muted-foreground">Jeux non trouvés</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Continuer à jouer</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {games.map((game, i) => (
          <motion.a
            key={game.id}
            href={`https://www.roblox.com/games/${game.id}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#121314] rounded-xl border border-white/5 overflow-hidden shadow-xl cursor-pointer hover:border-white/10 transition group"
          >
            <div className="aspect-[16/9] relative bg-[#232527] overflow-hidden">
              {game.imageUrl ? (
                <Image 
                  src={game.imageUrl}
                  alt={game.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#232527] to-[#181A1D] flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Aucune image</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-bold text-sm truncate text-white">{game.name}</p>
              <p className="text-xs text-muted-foreground">Cliquez pour jouer</p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
