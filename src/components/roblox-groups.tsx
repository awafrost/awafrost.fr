'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function RobloxGroups({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/roblox/v1/users/${userId}/groups/roles`)
      .then(res => res.json())
      .then(data => {
        // Rang 255 = Owner
        const owned = data.data?.filter((g: any) => g.role.rank === 255) || [];
        setGroups(owned);
      });
  }, [userId]);

  if (groups.length === 0) return <p className="text-xs opacity-50 italic">Aucun groupe possédé.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {groups.map((g) => (
        <div key={g.group.id} className="flex items-center gap-3 p-3 bg-[#232527] rounded-lg border border-white/5 hover:border-white/20 transition-all">
          <div className="relative w-12 h-12 rounded overflow-hidden">
            <Image 
              src={`https://www.roblox.com/group-thumbnails?groupId=${g.group.id}&width=150&height=150&format=png`} 
              alt="Group" fill unoptimized 
            />
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{g.group.name}</p>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Propriétaire</p>
          </div>
        </div>
      ))}
    </div>
  );
}