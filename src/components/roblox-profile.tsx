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

  if (!isMounted || loading) {
    return (
      <div className="rounded-xl border bg-card p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="h-4 bg-muted rounded w-32" />
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  if (!profileData) return null;

  const { profile, premium, friends, followers } = profileData;

  return (
    <motion.div
      className="rounded-xl border bg-card p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* En-tête avec nom et badge premium */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{profile.displayName}</h2>
          <p className="text-sm text-muted-foreground">@{profile.name}</p>
        </div>
        {premium.isPremium && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 text-xs font-semibold text-yellow-700 dark:text-yellow-200 flex-shrink-0">
            ⭐ Premium
          </span>
        )}
      </div>

      {/* Bio */}
      {profile.description && (
        <p className="text-sm text-foreground leading-relaxed">
          {profile.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex gap-6 pt-2">
        <div className="flex flex-col">
          <p className="text-lg font-bold text-primary">{friends.count.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Amis</p>
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-bold text-primary">{followers.count.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
      </div>
    </motion.div>
  );
}
