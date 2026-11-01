'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCalendarAlt, FaCrown, FaExternalLinkAlt, FaFingerprint, FaTimes, FaUsers } from 'react-icons/fa';

interface ProfileDetailsData {
  profile: {
    id: number;
    name: string;
    displayName: string;
    description: string;
    created: string;
  };
  premium: { isPremium: boolean };
  followers: { count: number };
}

interface RobloxAvatarResponse {
  data?: Array<{ imageUrl?: string }>;
}

interface RobloxHeadshotResponse {
  data?: Array<{ imageUrl?: string }>;
}

interface ProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ userId, isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<ProfileDetailsData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [headshotUrl, setHeadshotUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    const loadProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const [profileResponse, avatarResponse, headshotResponse] = await Promise.all([
          fetch(`/api/roblox/profile?userId=${encodeURIComponent(userId)}`, { signal: controller.signal }),
          fetch(`/api/roblox/avatar?userId=${encodeURIComponent(userId)}`, { signal: controller.signal }),
          fetch(`/api/roblox/avatar?userId=${encodeURIComponent(userId)}&type=headshot`, { signal: controller.signal }),
        ]);
        if (!profileResponse.ok) throw new Error('Impossible de charger le profil Roblox.');

        const profileData = await profileResponse.json() as ProfileDetailsData;
        const avatarData = avatarResponse.ok ? await avatarResponse.json() as RobloxAvatarResponse : null;
        const headshotData = headshotResponse.ok ? await headshotResponse.json() as RobloxHeadshotResponse : null;
        setProfile(profileData);
        setAvatarUrl(avatarData?.data?.[0]?.imageUrl ?? '');
        setHeadshotUrl(headshotData?.data?.[0]?.imageUrl ?? '');
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : 'Erreur lors du chargement du profil.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProfile();
    return () => controller.abort();
  }, [isOpen, userId]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  const memberSince = profile?.profile.created
    ? new Date(profile.profile.created).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : '—';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-md"
          />
          <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto p-4">
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="roblox-profile-modal-title"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              className="pointer-events-auto relative my-auto w-full max-w-xl overflow-hidden rounded-[1.7rem] border border-violet-200/15 bg-[#090811] shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
            >
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-violet-600/35 via-indigo-900/20 to-transparent" />
              <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative p-5 sm:p-7">
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-violet-100/55">
                    <FaFingerprint size={13} aria-hidden="true" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em]">Profil Roblox</p>
                  </div>
                  <button type="button" onClick={onClose} aria-label="Fermer la fiche" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-violet-200/30 hover:bg-violet-400/10 hover:text-white">
                    <FaTimes size={13} aria-hidden="true" />
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-5" aria-label="Chargement du profil">
                    <div className="flex items-center gap-4"><div className="h-20 w-20 animate-pulse rounded-2xl bg-white/10" /><div className="flex-1 space-y-3"><div className="h-6 w-40 animate-pulse rounded bg-white/10" /><div className="h-3 w-28 animate-pulse rounded bg-white/5" /></div></div>
                    <div className="grid grid-cols-2 gap-3"><div className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" /><div className="h-20 animate-pulse rounded-2xl bg-white/[0.04]" /></div>
                  </div>
                ) : error ? (
                  <p className="rounded-xl border border-rose-300/10 bg-rose-400/[0.04] p-4 text-sm text-rose-100/70">{error}</p>
                ) : profile ? (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-violet-200/20 bg-violet-400/[0.08] shadow-lg shadow-violet-950/20">
                        {headshotUrl ? <Image src={headshotUrl} alt={`Portrait de ${profile.profile.displayName}`} width={80} height={80} className="h-full w-full object-cover" unoptimized /> : <div className="flex h-full w-full items-center justify-center"><FaUsers className="text-violet-100/50" size={24} aria-hidden="true" /></div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.22em] text-violet-200/60">Compte joueur</p>
                        <h2 id="roblox-profile-modal-title" className="truncate text-3xl font-black tracking-tight text-white">{profile.profile.displayName}</h2>
                        <p className="mt-1 text-xs text-white/45">@{profile.profile.name}</p>
                      </div>
                      {profile.premium.isPremium && (
                        <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-200/15 bg-amber-200/[0.06] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-100/80 sm:self-center">
                          <FaCrown size={11} aria-hidden="true" /> Roblox Plus
                        </span>
                      )}
                    </div>

                    {avatarUrl && (
                      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.08] to-white/[0.015]">
                        <div className="border-b border-white/[0.07] px-4 py-3"><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-100/60">Avatar complet</p></div>
                        <div className="flex h-52 items-center justify-center p-3 sm:h-60">
                          <Image src={avatarUrl} alt={`Avatar complet de ${profile.profile.displayName}`} width={300} height={240} className="h-full w-full object-contain" unoptimized />
                        </div>
                      </div>
                    )}

                    {profile.profile.description && (
                      <p className="rounded-xl border-l-2 border-violet-300/45 bg-white/[0.025] px-4 py-3 text-sm leading-6 text-white/60">{profile.profile.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                        <div className="flex items-center gap-2 text-white/40"><FaCalendarAlt size={12} aria-hidden="true" /><span className="text-[9px] font-bold uppercase tracking-[0.15em]">Membre depuis</span></div>
                        <p className="mt-3 text-sm font-semibold text-white">{memberSince}</p>
                      </div>
                      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                        <div className="flex items-center gap-2 text-white/40"><FaUsers size={12} aria-hidden="true" /><span className="text-[9px] font-bold uppercase tracking-[0.15em]">Abonnés</span></div>
                        <p className="mt-3 text-sm font-semibold text-white">{new Intl.NumberFormat('fr-FR').format(profile.followers.count)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
                      <span className="font-mono text-[9px] text-white/30">ID · {profile.profile.id}</span>
                      <a href={`https://www.roblox.com/users/${profile.profile.id}/profile`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-bold text-[#171321] transition hover:bg-violet-100">
                        Voir sur Roblox <FaExternalLinkAlt size={10} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.section>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
