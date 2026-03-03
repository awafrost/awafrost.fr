'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FadeUpDiv, FadeUpStagger } from '@/components/animation';
import { RobloxAvatar3D } from '@/components/roblox-avatar-3d';
import { BouncingCat } from '@/components/bouncing-cat';
import { FavoritesGames } from '@/components/favorites-games';
import { RobloxProfile } from '@/components/roblox-profile';
import { ProfileModal } from '@/components/profile-modal';
import {
  FaDiscord,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import Image from 'next/image';

interface Affiliate {
  _id: string;
  affiliateCode: string;
  discordUsername: string;
  discordAvatar?: string;
  discordInvite: string;
  youtube?: { url: string; displayName: string };
  twitter?: { url: string; displayName: string };
  roblox?: { username: string; userId: number };
  favoriteGames?: Array<{ gameId: number; gameName: string }>;
  partnerName: string;
  partnered: boolean;
  profileDescription?: string;
}

export default function AffiliatePage() {
  const params = useParams();
  const affiliateCode = params.code as string;

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            affiliateCode,
            eventType: 'page_visit',
          }),
        });
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    const fetchAffiliate = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/affiliate/public?code=${affiliateCode}`);

        if (!res.ok) {
          setError('Lien d\'affiliation non trouvé');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAffiliate(data);
        trackVisit();
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (affiliateCode) {
      fetchAffiliate();
    }
  }, [affiliateCode]);

  const handleDiscordClick = async () => {
    try {
      // Track discord button click
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateCode,
          eventType: 'discord_click',
        }),
      });
    } catch (error) {
      console.error('Failed to track discord click:', error);
    }

    // Open discord invite
    if (affiliate) {
      window.open(affiliate.discordInvite, '_blank');
    }
  };

  if (loading) {
    return (
      <main className='container space-y-8 py-6 lg:my-10 relative'>
        <BouncingCat />
        <div className='flex min-h-screen items-center justify-center'>
          <p className='text-foreground'>Chargement du profil...</p>
        </div>
      </main>
    );
  }

  if (error || !affiliate) {
    return (
      <main className='container space-y-8 py-6 lg:my-10 relative'>
        <BouncingCat />
        <div className='flex min-h-screen items-center justify-center px-4'>
          <div className='max-w-md rounded-xl border bg-card p-8 text-center space-y-4'>
            <h1 className='text-2xl font-bold'>
              {error || 'Profil non trouvé'}
            </h1>
            <p className='text-muted-foreground'>
              Le lien d&apos;affiliation demandé n&apos;existe pas ou a été supprimé.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='container space-y-10 py-6 lg:my-10 relative'>
      <BouncingCat />
      <div className='space-y-8'>
        <FadeUpStagger>
        {/* Section Profil Principal */}
        <div className='grid grid-cols-12 gap-6'>
          {/* Carte Profil - Colonne de gauche */}
          <FadeUpDiv className='col-span-12 lg:col-span-4'>
            <div className='rounded-xl border bg-card p-6 space-y-6 h-full'>
              {/* Avatar Roblox si disponible */}
              {affiliate?.roblox?.userId && (
                <div className='flex justify-center cursor-pointer hover:opacity-80 transition-opacity'>
                  <RobloxAvatar3D 
                    userId={String(affiliate.roblox.userId)} 
                    width={180} 
                    height={180} 
                    className='w-44 h-44 lg:w-56 lg:h-56'
                    onAvatarClick={() => setIsProfileModalOpen(true)}
                  />
                </div>
              )}

              {/* Nom - Affiche le pseudo Roblox si disponible sinon Discord */}
              <div className='text-center space-y-2'>
                <h1 className='text-3xl lg:text-4xl font-black'>
                  {affiliate?.roblox?.username || affiliate?.discordUsername}
                </h1>
                {affiliate?.partnered && (
                  <div className='inline-block rounded-full border border-border bg-muted px-4 py-1 text-xs font-semibold text-foreground'>
                    ⭐ Partenaire {affiliate.partnerName || 'Sai Café'}
                  </div>
                )}
                <p className='text-sm text-muted-foreground'>
                  Code: {affiliate?.affiliateCode}
                </p>
              </div>

              {/* Description */}
              {affiliate?.profileDescription && (
                <p className='text-center text-sm text-foreground'>
                  {affiliate.profileDescription}
                </p>
              )}

              {/* Réseaux sociaux */}
              <div className='flex gap-3 justify-center'>
                {affiliate?.youtube?.url && (
                  <button
                    onClick={() => affiliate.youtube && window.open(affiliate.youtube.url, '_blank')}
                    className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer'
                    title='YouTube'
                  >
                    <FaYoutube className='text-white' size={20} />
                  </button>
                )}
                {affiliate?.twitter?.url && (
                  <button
                    onClick={() => affiliate.twitter && window.open(affiliate.twitter.url, '_blank')}
                    className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer'
                    title='Twitter'
                  >
                    <FaTwitter className='text-white' size={20} />
                  </button>
                )}
                {affiliate?.roblox?.userId && (
                  <button
                    onClick={() => affiliate.roblox && window.open(`https://www.roblox.com/users/${affiliate.roblox.userId}/profile`, '_blank')}
                    className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer'
                    title='Roblox'
                  >
                    <Image width={20} height={20} src='/icons/roblox-logo.svg' alt='Roblox' />
                  </button>
                )}
                <button
                  onClick={handleDiscordClick}
                  className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
                  title='Discord'
                >
                  <FaDiscord className='text-white' size={20} />
                </button>
              </div>
            </div>
          </FadeUpDiv>

          {/* Contenu principal - Colonne de droite */}
          <FadeUpDiv className='col-span-12 lg:col-span-8 space-y-6'>
            {/* Profil Roblox avec bio et stats */}
            {affiliate?.roblox?.userId && (
              <RobloxProfile userId={String(affiliate.roblox.userId)} />
            )}
          </FadeUpDiv>
        </div>

        {/* Jeux Favoris - Full width */}
        {affiliate?.favoriteGames && affiliate.favoriteGames.length > 0 && (
          <FadeUpDiv>
            <FavoritesGames 
              gameIds={affiliate.favoriteGames.map(g => g.gameId)} 
            />
          </FadeUpDiv>
        )}

        {/* Bouton Discord Principal */}
        <FadeUpDiv>
          <button
            onClick={handleDiscordClick}
            className='w-full py-4 rounded-xl border bg-card hover:bg-muted transition-colors font-semibold flex items-center justify-center gap-2'
          >
            <FaDiscord size={24} />
            Rejoindre le serveur Discord
          </button>
        </FadeUpDiv>
      </FadeUpStagger>
      </div>

      {/* Profil Modal */}
      {affiliate?.roblox?.userId && (
        <ProfileModal 
          userId={String(affiliate.roblox.userId)} 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </main>
  );
}
