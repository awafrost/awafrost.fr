'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendar, FaCheckCircle, FaCrown, FaUserFriends } from 'react-icons/fa';

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl border bg-card p-6 shadow-2xl space-y-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header avec bouton fermer */}
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold">Détails du Profil</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                </div>
              ) : profile ? (
                <div className="space-y-4">
                  {/* Nom */}
                  <div>
                    <h3 className="text-lg font-semibold">{profile.profile.displayName}</h3>
                    <p className="text-sm text-muted-foreground">@{profile.profile.name}</p>
                  </div>

                  {/* Description */}
                  {profile.profile.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Bio</p>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {profile.profile.description}
                      </p>
                    </div>
                  )}

                  {/* Date de création */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <FaCalendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date de création</p>
                      <p className="text-sm font-semibold">
                        {new Date(profile.profile.created).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status Premium */}
                  {profile.premium.isPremium && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 text-yellow-700 dark:text-yellow-200">
                      <FaCrown className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold">Premium Actif</p>
                      </div>
                    </div>
                  )}

                  {/* Followers */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <FaUserFriends className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Abonnés</p>
                      <p className="text-sm font-semibold">{profile.followers.count.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* ID */}
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">ID Utilisateur</p>
                    <p className="text-sm font-mono">{profile.profile.id}</p>
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
