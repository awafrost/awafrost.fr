'use client';

import { FadeUpDiv, FadeUpStagger } from '@/components/animation';
import { ThemeToggle } from '@/components/theme-toggle';
import { RobloxAvatar3D } from '@/components/roblox-avatar-3d';
import { FavoritesGames } from '@/components/favorites-games';
import { GroupCard } from '@/components/group-card';
import { RobloxProfile } from '@/components/roblox-profile';
import { RobloxStatus } from '@/components/roblox-status';
import { ProfileModal } from '@/components/profile-modal';
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
    <main className='min-h-screen bg-[#000000] text-white selection:bg-white selection:text-black font-sans'>
      
      <FadeUpStagger>
        {/* Navigation Haute */}
        <nav className='fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
            <span className='text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400'>@awafrost</span>
          </div>
          <ThemeToggle />
        </nav>

        {/* Floating Card - Murder Mystery 2 */}
        <div className='fixed bottom-8 right-8 z-40 hidden lg:block'>
          <a
            href='https://www.roblox.com/share?code=530926b7bb91d44581c31a7f390b2f69&type=Server'
            target='_blank'
            rel='noreferrer'
            className='block group'
          >
            <div className='relative'>
              {/* Glow effect */}
              <div className='absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300'></div>
              {/* Card */}
              <div className='relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0a2e] to-[#0a0a0a] p-6 backdrop-blur-sm w-72 transform transition-all duration-300 group-hover:scale-105'>
                <div className='absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full blur-3xl -z-10'></div>
                
                <div className='space-y-3'>
                  {/* Header */}
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='text-lg font-bold text-white'>Murder Mystery 2</h3>
                      <p className='text-[10px] text-purple-400 font-mono tracking-wider uppercase'>Serveur privé</p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center'>
                      <span className='text-lg'>🔒</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className='text-xs text-gray-400 leading-relaxed'>
                    Rejoins mon serveur privé exclusif et profite d&apos;une expérience unique avec la communauté.
                  </p>

                  {/* Button */}
                  <div className='pt-2'>
                    <div className='px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold text-center group-hover:bg-purple-500 transition-colors'>
                      Réclamer l&apos;accès
                    </div>
                  </div>
                </div>

                {/* Decorative border animation */}
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
              </div>
            </div>
          </a>
        </div>

        <div className='container mx-auto px-6 py-28 lg:py-40 max-w-6xl'>
          
          {/* Header - Typographie Blanc vers Gris */}
          <header className='mb-32'>
            <FadeUpDiv className='space-y-4'>
              <h1 className='text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent'>
                FROST
              </h1>
              <p className='text-xs md:text-sm text-gray-500 uppercase tracking-[0.5em] font-light'>
              </p>
            </FadeUpDiv>
          </header>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
            
            {/* Sidebar Profil */}
            <aside className='lg:col-span-4'>
              <FadeUpDiv>
                <div className='relative group'>
                  {/* Animation de l'anneau tournant autour de l'avatar */}
                  <div className='absolute -inset-2 rounded-full border border-dashed border-white/20 animate-[spin_10s_linear_infinite] group-hover:border-white/40 transition-colors'></div>
                  
                  <div className='relative rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 space-y-8'>
                    {/* Avatar (Couleurs préservées) */}
                    <div className='flex justify-center'>
                      <div className='cursor-pointer transform hover:scale-105 transition-transform duration-500'>
                        <RobloxAvatar3D 
                          userId={ROBLOX_USER_ID} 
                          width={180} 
                          height={180} 
                          onAvatarClick={() => setIsProfileModalOpen(true)}
                        />
                      </div>
                    </div>

                    <div className='text-center space-y-2'>
                      <h2 className='text-2xl font-bold tracking-tight text-white'>awafrost</h2>
                      <div className='inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5'>
                        <p className='text-[10px] text-gray-400 font-mono uppercase tracking-widest'>Roblox content creator</p>
                      </div>
                    </div>

                    {/* Réseaux Sociaux - Style Bouton Industriel */}
                    <div className='grid grid-cols-2 gap-3'>
                      {[
                        { icon: <FaYoutube size={16} />, link: 'https://www.youtube.com/@awafrost', label: 'Youtube' },
                        { icon: <FaTwitter size={16} />, link: 'https://twitter.com/awafrost', label: 'Twitter' },
                        { icon: <FaDiscord size={16} />, link: 'https://discord.gg/WgBTgHyjag', label: 'Discord' },
                        { icon: <Image width={16} height={16} src='/icons/roblox-logo.svg' alt='R' className='invert' />, link: 'https://www.roblox.com/users/1743461749/profile', label: 'Roblox' }
                      ].map((social, index) => (
                        <a
                          key={index}
                          href={social.link}
                          target='_blank'
                          rel='noreferrer'
                          className='flex items-center gap-3 p-3 rounded-xl bg-[#111111] border border-white/5 hover:border-white/20 hover:bg-[#1a1a1a] transition-all duration-300'
                        >
                          <span className='text-gray-400 group-hover:text-white'>{social.icon}</span>
                          <span className='text-[10px] uppercase font-bold tracking-wider text-gray-500'>{social.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeUpDiv>
            </aside>

            {/* Zone de Contenu - Triée par Catégories */}
            <section className='lg:col-span-8 space-y-20'>
              
              {/* Section 01 : Data & Stats */}
              <div className='space-y-8'>
                <div className='flex items-center gap-4'>
                  <span className='font-mono text-xs text-gray-600'>01</span>
                  <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-white'>Statistiques Profil</h3>
                  <div className='h-px flex-grow bg-white/5'></div>
                </div>
                <FadeUpDiv className='rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl'>
                  <RobloxProfile userId={ROBLOX_USER_ID} />
                </FadeUpDiv>
              </div>

              {/* Section 02 : Statut En Direct */}
              <div className='space-y-8'>
                <div className='flex items-center gap-4'>
                  <span className='font-mono text-xs text-gray-600'>02</span>
                  <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-white'>Présence En Direct</h3>
                  <div className='h-px flex-grow bg-white/5'></div>
                </div>
                <FadeUpDiv className='rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl'>
                  <RobloxStatus userId={ROBLOX_USER_ID} />
                </FadeUpDiv>
              </div>

              {/* Section 03 : Organisations */}
              <div className='space-y-8'>
                <div className='flex items-center gap-4'>
                  <span className='font-mono text-xs text-gray-600'>03</span>
                  <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-white'>Groupes & Studios</h3>
                  <div className='h-px flex-grow bg-white/5'></div>
                </div>
                <FadeUpDiv className='rounded-3xl border border-white/10 bg-[#0a0a0a] p-8'>
                  <GroupCard groupId={GROUP_ID} />
                </FadeUpDiv>
              </div>

              {/* Section 04 : Expériences */}
              <div className='space-y-8'>
                <div className='flex items-center gap-4'>
                  <span className='font-mono text-xs text-gray-600'>04</span>
                  <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-white'>Jeux Favoris</h3>
                  <div className='h-px flex-grow bg-white/5'></div>
                </div>
                <FadeUpDiv className='rounded-3xl border border-white/10 bg-[#0a0a0a] p-8'>
                  <FavoritesGames gameIds={FAVORITE_GAMES} />
                </FadeUpDiv>
              </div>

            </section>
          </div>
        </div>
      </FadeUpStagger>

      <ProfileModal 
        userId={ROBLOX_USER_ID}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Footer */}
      <footer className='py-20 border-t border-white/5'>
        <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-[10px] text-gray-600 font-mono tracking-widest uppercase'>© 2026 Awaji Frost</p>
          <div className='flex gap-8 text-[10px] text-gray-500 font-mono uppercase tracking-widest'>
            <a href='/confidentialite' className='hover:text-white transition-colors'>Protection des données</a>
            <a href='/conditions' className='hover:text-white transition-colors'>ToS</a>
          </div>
        </div>
      </footer>
    </main>
  );
}