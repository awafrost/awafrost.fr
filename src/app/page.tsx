'use client';

import { FadeUpDiv, FadeUpStagger } from '@/components/animation';
import { ThemeToggle } from '@/components/theme-toggle';
import { RobloxAvatar3D } from '@/components/roblox-avatar-3d';
import { FavoritesGames } from '@/components/favorites-games';
import { GroupCard } from '@/components/group-card';
import { RobloxProfile } from '@/components/roblox-profile';
import { ProfileModal } from '@/components/profile-modal';
import { StarsRain } from '@/components/stars-rain';
import { BouncingCat } from '@/components/bouncing-cat';
import Image from 'next/image';
import { useState } from 'react';
import {
  FaDiscord,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

export default function Home() {
  const ROBLOX_USER_ID = '1743461749';
  const FAVORITE_GAMES = [286090429, 606849621, 142823291];
  const GROUP_ID = 13212005;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <main className='container space-y-8 py-6 lg:my-10 relative'>
      <StarsRain />
      <BouncingCat />
      <FadeUpStagger>
        {/* En-tête avec toggle de thème */}
        <div className='flex h-16 items-center justify-end'>
          <ThemeToggle />
        </div>

        {/* Section Profil Principal */}
        <div className='grid grid-cols-12 gap-6'>
          {/* Carte Profil - Colonne de gauche */}
          <FadeUpDiv className='col-span-12 lg:col-span-4'>
            <div className='rounded-xl border bg-card p-6 space-y-6 h-full'>
              {/* Avatar avec fond */}
              <div className='flex justify-center'>
                <RobloxAvatar3D 
                  userId={ROBLOX_USER_ID} 
                  width={180} 
                  height={180} 
                  className='w-44 h-44 lg:w-56 lg:h-56'
                  onAvatarClick={() => setIsProfileModalOpen(true)}
                />
              </div>

              {/* Nom et username */}
              <div className='text-center space-y-1'>
                <h1 className='text-3xl lg:text-4xl font-black'>Frost</h1>
                <p className='text-sm text-muted-foreground'>@awafrost</p>
              </div>

              {/* Réseaux sociaux */}
              <div className='flex gap-3 justify-center'>
                <a
                  href='https://www.youtube.com/@awafrost'
                  target='_blank'
                  rel='noreferrer'
                  className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
                  title='YouTube'
                >
                  <FaYoutube className='text-white' size={20} />
                </a>
                <a
                  href='https://twitter.com/awafrost'
                  target='_blank'
                  rel='noreferrer'
                  className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
                  title='Twitter'
                >
                  <FaTwitter className='text-white' size={20} />
                </a>
                <a
                  href='https://www.roblox.com/users/1743461749/profile'
                  target='_blank'
                  rel='noreferrer'
                  className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
                  title='Roblox'
                >
                  <Image width={20} height={20} src='/icons/roblox-logo.svg' alt='Roblox' />
                </a>
                <a
                  href='https://discord.gg/wF96KxcNpT'
                  target='_blank'
                  rel='noreferrer'
                  className='p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors'
                  title='Discord'
                >
                  <FaDiscord className='text-white' size={20} />
                </a>
              </div>
            </div>
          </FadeUpDiv>

          {/* Contenu principal - Colonne de droite */}
          <FadeUpDiv className='col-span-12 lg:col-span-8 space-y-6'>
            {/* Profil Roblox avec bio et stats */}
            <RobloxProfile userId={ROBLOX_USER_ID} />

            {/* Groupe */}
            <div className='space-y-3'>
              <h2 className='text-lg font-semibold'>Mon Groupe</h2>
              <GroupCard groupId={GROUP_ID} />
            </div>
          </FadeUpDiv>
        </div>

        {/* Jeux Favoris - Full width */}
        <FadeUpDiv className='col-span-12'>
          <FavoritesGames gameIds={FAVORITE_GAMES} />
        </FadeUpDiv>
      </FadeUpStagger>

      {/* Modal Profil */}
      <ProfileModal 
        userId={ROBLOX_USER_ID}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </main>
  );
}