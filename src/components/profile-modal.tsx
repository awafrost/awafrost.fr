'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendar, FaCrown, FaUserFriends, FaFingerprint } from 'react-icons/fa';

interface ProfileDetailsData {
  profile: {
    id: number;
    name: string;
    displayName: string;
    description: string;
    created: string;
  };
  premium: {
    isPremium: boolean;
  };
  followers: {
    count: number;
  };
}

interface ProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ userId, isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<ProfileDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/roblox/profile?userId=${userId}`);
        if (!res.ok) throw new Error('Erreur');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, userId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop avec flou léger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Modal - Style "Archive Card" */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none"
          >
            <div 
              className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md pointer-events-auto relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Effet de grain de fond ou reflet discret */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <FaFingerprint className="text-white/20" size={14} />
                  <h2 className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500">Détails de l&rsquo;entité</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full border border-white/5 hover:bg-white hover:text-black transition-all duration-300"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {loading ? (
                <div className="space-y-6">
                  <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                  <div className="h-32 bg-white/5 rounded-xl animate-pulse" />
                </div>
              ) : profile ? (
                <div className="space-y-8">
                  {/* Identité */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                      {profile.profile.displayName}
                    </h3>
                    <p className="text-xs font-mono text-gray-500 uppercase">@{profile.profile.name}</p>
                  </div>

                  {/* Bio avec bordure latérale */}
                  {profile.profile.description && (
                    <div className="relative pl-6 py-1">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>
                      <p className="text-sm text-gray-400 leading-relaxed font-light italic">
                        &ldquo;{profile.profile.description}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Grid d'informations techniques */}
                  <div className="grid grid-cols-1 gap-3">
                    
                    {/* Date de création */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <FaCalendar className="text-white/40" size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Sur Roblox depuis</span>
                      </div>
                      <p className="text-xs font-mono text-white">
                        {new Date(profile.profile.created).getFullYear()}
                      </p>
                    </div>

                    {/* Stats et Premium */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <FaUserFriends className="text-white/40" size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Abonnés</span>
                      </div>
                      <p className="text-xs font-mono text-white">{profile.followers.count.toLocaleString()}</p>
                    </div>

                    {profile.premium.isPremium && (
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-white text-black">
                        <div className="flex items-center gap-3">
                          <FaCrown size={14} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Statut Premium</span>
                        </div>
                        <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Footer Modal / ID */}
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-gray-700 uppercase">Data ID: {profile.profile.id}</span>
                    <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">Encrypted.v1</span>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}