'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileData {
  profile: {
    name: string;
    displayName: string;
    description: string;
    id: number;
  };
  premium: {
    isPremium: boolean;
  };
  friends: {
    count: number;
  };
  followers: {
    count: number;
  };
}

interface RobloxProfileProps {
  userId: string;
}

export function RobloxProfile({ userId }: RobloxProfileProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/roblox/profile?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isMounted]);

  // Chargement Skeleton - Noir Profond
  if (!isMounted || loading) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 space-y-6 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-6 bg-white/5 rounded w-48" />
            <div className="h-3 bg-white/5 rounded w-24" />
          </div>
          <div className="h-6 bg-white/5 rounded-full w-20" />
        </div>
        <div className="h-20 bg-white/5 rounded-2xl w-full" />
      </div>
    );
  }

  if (!profileData) return null;

  const { profile, premium, friends, followers } = profileData;

  return (
    <motion.div
      className="rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 space-y-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* En-tête : Nom et Badge Silver */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent uppercase italic">
            {profile.displayName}
          </h2>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">
            Identité numérique : @{profile.name}
          </p>
        </div>
        
        {premium.isPremium && (
          <div className="px-3 py-1 rounded-full border border-white/20 bg-white/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">
              Premium
            </span>
          </div>
        )}
      </div>

      {/* Bio - Style Typographique */}
      {profile.description && (
        <div className="relative group">
          <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-white/10 group-hover:bg-white/30 transition-colors"></div>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light italic pl-2">
            &ldquo;{profile.description}&rdquo;
          </p>
        </div>
      )}

      {/* Statistiques - Style Tableau de Bord */}
      <div className="grid grid-cols-2 gap-12 pt-4 border-t border-white/5">
        <div className="space-y-1">
          <p className="text-3xl font-black tracking-tight text-white italic">
            {friends.count.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[1px] bg-gray-700"></div>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">Amis</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-3xl font-black tracking-tight text-white italic">
            {followers.count.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[1px] bg-gray-700"></div>
            <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">Abonnés</p>
          </div>
        </div>
      </div>

      {/* ID de référence discret en fond */}
      <span className="absolute bottom-4 right-6 text-[8px] font-mono text-white/5 uppercase tracking-widest select-none">
        REF-UID: {profile.id}
      </span>
    </motion.div>
  );
}