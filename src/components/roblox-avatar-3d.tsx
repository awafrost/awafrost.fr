'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface RobloxAvatar3DProps {
  userId: string;
  className?: string;
  width?: number;
  height?: number;
  onAvatarClick?: () => void;
}

export function RobloxAvatar3D({ userId, className = '', width = 400, height = 400, onAvatarClick }: RobloxAvatar3DProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`/api/roblox/avatar?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.data?.[0]?.imageUrl) {
            setAvatarUrl(data.data[0].imageUrl);
          }
        }
      } catch (error) {
        console.error('Erreur avatar:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvatar();
  }, [userId]);

  return (
    <motion.button
      onClick={onAvatarClick}
      type="button"
      className={`relative w-56 h-56 lg:w-72 lg:h-72 flex items-center justify-center group outline-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
          className="relative z-10 h-full w-full flex items-center justify-center"
          animate={{
            y: [2, -6, 2],
            rotate: [-1, 1, -1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {loading ? (
            <div className="h-3 w-3 rounded-full bg-white/20 animate-pulse" />
          ) : avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={width}
              height={height}
              className="w-[110%] h-[110%] object-contain"
              unoptimized
            />
          ) : null}
      </motion.div>

    </motion.button>
  );
}