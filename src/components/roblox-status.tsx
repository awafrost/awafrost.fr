'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RobloxStatusData {
  isPremium: boolean;
  isOnline: boolean;
  presenceType: number;
  statusLabel: string;
  statusColor: string;
  rolimonsValue: string;
  inventoryStatus: string;
  lastLocation: string;
}

interface RobloxStatusProps {
  userId: string;
}

export function RobloxStatus({ userId }: RobloxStatusProps) {
  const [statusData, setStatusData] = useState<RobloxStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/roblox/rolimons?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch status');
        const data = await res.json();
        setStatusData(data);
      } catch (err) {
        console.error('Error fetching Roblox status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Rafraîchir le statut toutes les 30 secondes
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [userId, isMounted]);

  if (!isMounted || loading) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 space-y-6 animate-pulse">
        <div className="h-6 bg-white/5 rounded w-48" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-white/5 rounded-2xl" />
          <div className="h-20 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!statusData) return null;

  const statusEmojis: Record<number, string> = {
    0: '🔴',
    1: '🟢',
    2: '🔵',
  };

  return (
    <motion.div
      className="rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 space-y-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* En-tête avec Statut */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase italic">
            Statut En Direct
          </h2>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">
            Synchronisé via Rolimons
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-3xl">{statusEmojis[statusData.presenceType]}</span>
          <div className="px-3 py-1 rounded-full border border-white/20 bg-white/10 flex items-center gap-2">
            <div 
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: statusData.statusColor }}
            />
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">
              {statusData.statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Serveur Privé */}
      <div className="relative group">
        <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/30 to-white/5 group-hover:from-white/50" />
        <div className="space-y-2 pl-2">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Serveur Privé</p>
          <a
            href="https://www.roblox.com/share?code=530926b7bb91d44581c31a7f390b2f69&type=Server"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors font-light italic break-all"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.343 15.657a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM2 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.343 5.343a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707z" />
            </svg>
            530926b7bb91d44581c31a7f390b2f69
          </a>
        </div>
      </div>

      {/* Grille de Statistiques */}
      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/5">
        {/* Valeur Rolimons */}
        <div className="space-y-1">
          <p className="text-3xl font-black tracking-tight text-white italic">
            {statusData.rolimonsValue}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[1px] bg-gray-700"></div>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">
              Valeur Inventaire
            </p>
          </div>
        </div>

        {/* Statut Inventaire */}
        <div className="space-y-1">
          <p className="text-3xl font-black tracking-tight text-white italic">
            {statusData.inventoryStatus}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[1px] bg-gray-700"></div>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">
              Accès Rolimons
            </p>
          </div>
        </div>
      </div>

      {/* Infos Additionnelles */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Premium Roblox</p>
          <div className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
            statusData.isPremium 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>
            {statusData.isPremium ? '✓ Actif' : 'Inactif'}
          </div>
        </div>
        
        {statusData.lastLocation && statusData.lastLocation !== 'Unknown' && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">Dernière Localisation</p>
            <p className="text-[10px] text-gray-400 uppercase font-mono">{statusData.lastLocation}</p>
          </div>
        )}
      </div>

      {/* Lien Rolimons */}
      <div className="pt-4 border-t border-white/5">
        <a
          href={`https://www.rolimons.com/player/${userId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[10px] text-gray-400 hover:text-white transition-colors font-mono uppercase tracking-[0.2em]"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.343a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM15.657 14.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM11 17a1 1 0 102 0v-1a1 1 0 10-2 0v1zM5.343 15.657a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zM2 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.343 5.343a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707z" />
          </svg>
          Voir sur Rolimons →
        </a>
      </div>

      {/* Timestamp de rafraîchissement */}
      <span className="absolute bottom-4 right-6 text-[8px] font-mono text-white/5 uppercase tracking-widest select-none">
        ACTUALISATION: 30s
      </span>
    </motion.div>
  );
}
