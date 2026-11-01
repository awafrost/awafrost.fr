'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface RobloxAvatarProps {
  userId: string;
  className?: string;
  width?: number;
  height?: number;
  onAvatarClick?: () => void;
}

export function RobloxAvatar({ userId, className = '', width = 240, height = 270, onAvatarClick }: RobloxAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function fetchAvatar() {
      try {
        const response = await fetch(`/api/roblox/avatar?userId=${encodeURIComponent(userId)}&type=headshot`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) return;

        const data = await response.json();
        if (active) setAvatarUrl(data.data?.[0]?.imageUrl ?? '');
      } catch (error) {
        if (active && !controller.signal.aborted) console.error('Erreur avatar:', error);
      } finally {
        if (active && !controller.signal.aborted) setLoading(false);
      }
    }

    fetchAvatar();
    const refresh = window.setInterval(fetchAvatar, 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refresh);
      controller.abort();
    };
  }, [userId]);

  return (
    <button
      type="button"
      onClick={onAvatarClick}
      aria-label="Ouvrir le profil Roblox"
      className={`group relative mx-auto flex items-center justify-center outline-none ${className}`}
      style={{ width: `min(100%, ${width}px)`, height: Math.min(width, height) }}
    >
      {loading ? (
        <div className="h-3 w-3 animate-pulse rounded-full bg-white/20" />
      ) : avatarUrl ? (
        <div className="avatar-float flex h-full w-full items-center justify-center">
          <Image
            src={avatarUrl}
            alt="Portrait de l’avatar Roblox"
            width={width}
            height={height}
            className="h-full w-full rounded-full border border-white/10 bg-white/[0.03] object-cover object-[center_30%] p-1 transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        </div>
      ) : (
        <span className="text-xs text-white/45">Avatar indisponible</span>
      )}
    </button>
  );
}
