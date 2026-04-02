'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Group {
  id: number;
  name: string;
  memberCount: number;
  description?: string;
}

export function UserGroups({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        console.log('🔵 Fetching all user groups for:', userId);
        
        const res = await fetch(`/api/user-groups?userId=${userId}`);
        console.log('Response status:', res.status);
        
        if (!res.ok) throw new Error('Failed to fetch groups');
        
        const data = await res.json();
        console.log('Groups fetched:', data.groups?.length);
        
        setGroups(data.groups || []);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchGroups();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#121314] rounded-lg border border-white/5 p-3 animate-pulse">
            <div className="h-4 bg-[#232527] rounded w-24 mb-2" />
            <div className="h-3 bg-[#232527] rounded w-16" />
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
          className="block p-3 bg-[#121314] rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
        >
          <p className="font-bold text-sm truncate text-white">{group.name}</p>
          <p className="text-[11px] text-green-400 font-bold uppercase mt-1 tracking-wide">
            {group.memberCount?.toLocaleString() || 0} mbres
          </p>
        </motion.a>
      ))}
    </div>
  );
}
