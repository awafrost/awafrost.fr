'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FriendWithData {
  id: number;
  displayName: string;
  img?: string;
}

export function RobloxFriends({ userId }: { userId: string }) {
  const [friends, setFriends] = useState<FriendWithData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFriends() {
      try {
        console.log('🔵 Fetching friends for:', userId);
        
        // Récupérer la liste des amis
        const res = await fetch(`/api/roblox/v1/users/${userId}/friends?limit=9`);
        console.log('🔵 Friends response status:', res.status);
        
        if (!res.ok) throw new Error('Failed to fetch friends');
        
        const data = await res.json();
        console.log('🔵 Friends data length:', data.data?.length);
        
        const friendIds = data.data?.slice(0, 9).map((f: any) => f.id) || [];
        
        if (friendIds.length === 0) {
          setFriends([]);
          setLoading(false);
          return;
        }

        console.log('🔵 Fetching names for friends:', friendIds);
        
        // Récupérer les noms via des appels séparés (l'API friends ne retourne pas les noms)
        const friendsWithNames = await Promise.all(
          friendIds.map(async (friendId: number) => {
            try {
              const userRes = await fetch(`/api/roblox/v1/users/${friendId}`);
              if (!userRes.ok) return { id: friendId, displayName: `User ${friendId}` };
              
              const userData = await userRes.json();
              return {
                id: friendId,
                displayName: userData.displayName || userData.name || `User ${friendId}`
              };
            } catch (e) {
              console.warn(`Failed to fetch name for friend ${friendId}:`, e);
              return { id: friendId, displayName: `User ${friendId}` };
            }
          })
        );

        console.log('🔵 Friends with names:', friendsWithNames);

        // Récupérer les avatars
        const idString = friendIds.join(',');
        const thumbRes = await fetch(
          `/api/roblox/v1/users/avatar-headshot?userIds=${idString}&size=150x150&format=png&isCircular=true`
        );
        
        console.log('🔵 Avatar response status:', thumbRes.status);
        
        let avatarMap: Record<number, string> = {};
        if (thumbRes.ok) {
          try {
            const thumbData = await thumbRes.json();
            console.log('🔵 Avatars received:', thumbData.data?.length);
            
            avatarMap = (thumbData.data || []).reduce((acc: any, thumb: any) => {
              acc[thumb.targetId] = thumb.imageUrl;
              return acc;
            }, {});
          } catch (e) {
            console.warn('Failed to parse avatar data:', e);
          }
        }

        // Fusionner les données
        const final = friendsWithNames.map(f => ({
          ...f,
          img: avatarMap[f.id]
        }));

        setFriends(final);
        console.log('🔵 Final friends:', final);
      } catch (e) {
        console.error('❌ Erreur amis:', e);
      } finally {
        setLoading(false);
      }
    }
    
    getFriends();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <div key={i} className="min-w-[90px] text-center">
            <div className="relative w-20 h-20 mx-auto rounded-full bg-[#232527] border-2 border-transparent animate-pulse" />
            <p className="text-[11px] mt-2 font-bold truncate text-center h-4 bg-[#232527] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Aucun ami en ligne
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {friends.map((f, i) => (
        <motion.a
          href={`https://www.roblox.com/users/${f.id}/profile`}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          key={f.id} 
          className="min-w-[90px] group cursor-pointer"
        >
          <div className="relative w-20 h-20 mx-auto rounded-full bg-[#232527] border-2 border-transparent group-hover:border-white/20 overflow-hidden transition-all">
            {f.img && (
              <Image src={f.img} alt={f.displayName} fill unoptimized className="object-cover" />
            )}
          </div>
          <p className="text-[11px] mt-2 font-bold truncate text-center hover:underline">{f.displayName}</p>
        </motion.a>
      ))}
    </div>
  );
}