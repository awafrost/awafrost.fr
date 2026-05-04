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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* ANNEAUX DÉCORATIFS EXTERNES */}
      <motion.div 
        className="absolute inset-0 rounded-full border border-dashed border-white/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* LE HUBLOT (Container principal) */}
      <div className="absolute inset-4 rounded-full bg-black border-[6px] border-[#1a1a1a] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] z-10">
        
        {/* FOND INTERNE (Derrière l'avatar) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_#222_0%,_#000_100%)] z-0" />

        {/* L'AVATAR (À l'intérieur du hublot) */}
        <motion.div 
          className="relative z-10 w-full h-full flex items-center justify-center"
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
            <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
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

        {/* VITRE ET REFLETS (Par-dessus l'avatar, à l'intérieur du cercle) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Reflet diagonal type "verre" */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.1]" />
          
          {/* Ombre interne pour donner de la profondeur au cadre */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]" />
          
          {/* Brillance circulaire supérieure */}
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-white/[0.03] rounded-full blur-3xl" />
        </div>
      </div>

      {/* CADRE MÉTALLIQUE EXTÉRIEUR (Optionnel, pour le relief) */}
      <div className="absolute inset-4 rounded-full border border-white/10 z-30 pointer-events-none" />

      {/* OMBRE AU SOL */}
      <div className="absolute -bottom-6 w-1/3 h-2 bg-black/60 blur-lg rounded-full" />
    </motion.button>
  );
}