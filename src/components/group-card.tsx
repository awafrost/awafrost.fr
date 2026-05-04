'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';

interface Group {
  id: number;
  name: string;
  description: string;
  owner: {
    username: string;
  };
  memberCount: number;
}

interface GroupCardProps {
  groupId: number;
}

export function GroupCard({ groupId }: GroupCardProps) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchGroup = async () => {
      try {
        const res = await fetch(`/api/roblox/group?groupId=${groupId}`);
        if (!res.ok) throw new Error('Failed to fetch group');
        const data = await res.json();
        setGroup(data.group);
      } catch (err) {
        console.error('Error fetching group:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId, isMounted]);

  // Squelette de chargement minimaliste (Noir & Gris)
  if (!isMounted || loading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-8 animate-pulse space-y-4">
        <div className="h-4 bg-white/5 rounded w-1/3" />
        <div className="h-3 bg-white/5 rounded w-full" />
        <div className="h-px bg-white/5 w-full" />
        <div className="h-3 bg-white/5 rounded w-1/4" />
      </div>
    );
  }

  if (!group) return null;

  return (
    <motion.a
      href={`https://www.roblox.com/communities/${groupId}/about`}
      target='_blank'
      rel='noreferrer'
      className="relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-8 transition-all duration-500 hover:border-white/20 group block overflow-hidden"
    >
      {/* Effet de scanline discret au survol */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <div className="relative space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform duration-300">
              {group.name}
            </h3>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Communauté Officielle
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 text-gray-400 group-hover:text-white transition-colors">
            <FaUsers size={20} />
          </div>
        </div>
        
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 italic">
          &ldquo;{group.description}&rdquo;
        </p>
        
        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-gray-800 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-600 to-gray-900"></div>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-bold text-white tracking-wide">
              {group.memberCount?.toLocaleString() || '0'} <span className="text-gray-500 font-normal">membres</span>
            </p>
          </div>

          <span className="text-[10px] font-mono text-gray-600 group-hover:text-white transition-colors">
            ID: {groupId}
          </span>
        </div>
      </div>
    </motion.a>
  );
}