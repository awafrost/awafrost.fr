'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface GroupInfo {
  id: number;
  name: string;
  memberCount?: number;
}

interface GroupsListProps {
  groupIds: number[];
}

export function GroupsList({ groupIds }: GroupsListProps) {
  const [groups, setGroups] = useState<GroupInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const groupsData = await Promise.all(
          groupIds.map(async (groupId) => {
            try {
              // Utiliser le proxy dynamique pour récupérer les infos du groupe
              const res = await fetch(`/api/roblox/v1/groups/${groupId}`);
              if (!res.ok) throw new Error(`Failed to fetch group ${groupId}`);
              
              const data = await res.json();
              
              return {
                id: data.id,
                name: data.name,
                memberCount: data.memberCount,
              };
            } catch (err) {
              console.error(`Error fetching group ${groupId}:`, err);
              return null;
            }
          })
        );

        setGroups(groupsData.filter(Boolean) as GroupInfo[]);
      } catch (err) {
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    }

    if (groupIds.length > 0) {
      fetchGroups();
    } else {
      setLoading(false);
    }
  }, [groupIds]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#121314] rounded-lg border border-white/5 animate-pulse">
            <div className="w-12 h-12 rounded-md bg-[#232527] flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="h-3 bg-[#232527] rounded w-24" />
              <div className="h-2 bg-[#232527] rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return <div className="text-muted-foreground text-sm">Aucun groupe</div>;
  }

  return (
    <div className="space-y-3">
      {groups.map((group, i) => (
        <motion.a
          key={group.id}
          href={`https://www.roblox.com/groups/${group.id}`}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 p-3 bg-[#121314] rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
        >
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-black shadow-inner flex-shrink-0">
            <Image 
              src={`https://www.roblox.com/group-thumbnails?groupId=${group.id}&width=150&height=150&format=png`}
              alt={group.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs truncate text-white">{group.name}</p>
            {group.memberCount && (
              <p className="text-[9px] text-green-400 font-bold uppercase mt-0.5">
                {group.memberCount.toLocaleString()} mbres
              </p>
            )}
          </div>
        </motion.a>
      ))}
    </div>
  );
}
