'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface RobloxAvatar3DProps {
  userId: string;
  className?: string;
  width?: number;
  height?: number;
  size?: 'sm' | 'md' | 'lg';
  onAvatarClick?: () => void;
}

export function RobloxAvatar3D({ userId, className = '', width = 150, height = 150, onAvatarClick }: RobloxAvatar3DProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(
          `/api/roblox/avatar?userId=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data) && data.data[0]?.imageUrl) {
            setAvatarUrl(data.data[0].imageUrl);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'avatar:', error);
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
      className={`relative w-44 h-44 lg:w-56 lg:h-56 overflow-visible rounded-full cursor-pointer focus:outline-none ${className}`}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Contour blanc en pointillé qui tourne */}
      <motion.div 
        className='absolute -inset-3 rounded-full border-4 border-dashed border-white shadow-lg shadow-white/30 z-50'
        animate={{
          rotate: 360,
          boxShadow: [
            '0 0 10px rgba(255, 255, 255, 0.3)',
            '0 0 20px rgba(255, 255, 255, 0.8)',
            '0 0 10px rgba(255, 255, 255, 0.3)',
          ],
        }}
        transition={{
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: 'linear',
          },
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      />

      {/* Container principal avec rounded et shadow */}
      <div className='absolute inset-0 rounded-full overflow-hidden shadow-2xl'>
        {/* Fond avec gradient noir et blanc - positionné derrière */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-black opacity-50 blur-2xl' />
          <div className='absolute inset-0 bg-gradient-to-tr from-slate-600/20 via-transparent to-slate-300/20' />
        </div>
        
        {/* Avatar - positionné au-dessus */}
        <div className='relative z-10 w-full h-full'>
          {loading ? (
            <div className='w-full h-full bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center'>
              <span className='text-xs text-muted-foreground'>Chargement...</span>
            </div>
          ) : avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar Roblox"
              width={width}
              height={height}
              className='w-full h-full pointer-events-none object-cover'
              unoptimized
            />
          ) : (
            <div className='w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground'>
              Pas d&apos;avatar
            </div>
          )}
        </div>
        
        {/* Overlay de brillance supérieure */}
        <div className='absolute inset-0 z-20 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/20 pointer-events-none' />
      </div>
    </motion.button>
  );
}
