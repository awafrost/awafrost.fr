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

  if (!isMounted || loading) {
    return (
      <div className="rounded-lg border bg-card p-4 animate-pulse space-y-3">
        <div className="h-6 bg-muted rounded w-32" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-24" />
      </div>
    );
  }

  if (!group) return null;

  return (
    <motion.a
      href={`https://www.roblox.com/communities/${groupId}/about`}
      target="_blank"
      rel="noreferrer"
      className="rounded-lg border bg-card p-4 transition-colors hover:border-primary block"
      whileHover={{ scale: 1.02 }}
    >
      <div className="space-y-2">
        <h3 className="font-semibold">{group.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
        <div className="pt-2 text-xs text-muted-foreground">
          <p className="flex items-center gap-2"><FaUsers className="w-4 h-4" /> {group.memberCount?.toLocaleString() || '0'} membres</p>
        </div>
      </div>
    </motion.a>
  );
}
