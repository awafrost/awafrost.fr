'use client';

import { FadeUpDiv, FadeUpStagger, ScrollReveal } from '@/components/animation';
import { RobloxAvatar3D } from '@/components/roblox-avatar-3d';
import { RobloxProfile } from '@/components/roblox-profile';
import { RobloxStatus } from '@/components/roblox-status';
import { ProfileModal } from '@/components/profile-modal';
import { WelcomeMessage } from '@/components/welcome-message';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  FaDiscord,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

function getDaysUntilBirthday() {
  const today = new Date();
  const birthday = new Date(today.getFullYear(), 7, 15);

  if (birthday.getTime() < today.getTime()) {
    birthday.setFullYear(today.getFullYear() + 1);
  }

  return Math.ceil((birthday.getTime() - today.getTime()) / 86400000);
}

export default function Home() {
  const ROBLOX_USER_ID = '1743461749';
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [daysUntilBirthday, setDaysUntilBirthday] = useState<number | null>(null);

  useEffect(() => {
    const updateCountdown = () => setDaysUntilBirthday(getDaysUntilBirthday());
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 60000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main
      className='site-shell min-h-screen overflow-hidden text-white selection:bg-white selection:text-black font-sans'
      onPointerMove={(event) => {
        event.currentTarget.style.setProperty('--pointer-x', `${event.clientX}px`);
        event.currentTarget.style.setProperty('--pointer-y', `${event.clientY}px`);
        event.currentTarget.style.setProperty('--spotlight-opacity', '1');
      }}
      onPointerLeave={(event) => event.currentTarget.style.setProperty('--spotlight-opacity', '0')}
    >
      
      <FadeUpStagger>
        <div className='container mx-auto max-w-6xl px-6 py-16 lg:py-24'>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
            
            {/* Sidebar Profil */}
            <aside className='lg:col-span-4'>
              <FadeUpDiv>
                <div className='relative group'>
                  <div className='holo-panel relative space-y-8 p-5 sm:p-8'>
                    {/* Avatar (Couleurs préservées) */}
                    <div className='flex justify-center'>
                      <div className='cursor-pointer transform transition-transform duration-500'>
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
                        <div className='inline-block px-3 py-1'>
                          <p className='text-[10px] text-gray-400 font-mono uppercase tracking-widest'>Présentation personnelle</p>
                      </div>
                    </div>

                    {/* Réseaux Sociaux - Style Bouton Industriel */}
                    <div className='grid grid-cols-2 gap-3'>
                      {[
                        { icon: <FaYoutube size={16} />, link: '/youtube', label: 'Youtube' },
                        { icon: <FaTwitter size={16} />, link: 'https://twitter.com/awafrost', label: 'Twitter' },
                        { icon: <FaDiscord size={16} />, link: '/discord', label: 'Discord' },
                        { icon: <Image width={16} height={16} src='/icons/roblox-logo.svg' alt='R' className='invert' />, link: '/roblox', label: 'Roblox' }
                      ].map((social, index) => (
                        <a
                          key={index}
                          href={social.link}
                          target='_blank'
                          rel='noreferrer'
                          className='holo-link flex items-center gap-3 p-3 transition-all duration-300'
                        >
                          <span className='text-gray-400 group-hover:text-white'>{social.icon}</span>
                          <span className='text-[10px] uppercase font-bold tracking-wider text-gray-500'>{social.label}</span>
                        </a>
                      ))}
                    </div>

                    <div className='py-4 text-center'>
                      <p className='text-[10px] font-mono uppercase tracking-widest text-gray-500'>Anniversaire</p>
                      <p className='mt-2 text-sm font-bold text-white'>15 août</p>
                      <p className='mt-1 text-xs text-gray-400'>
                        {daysUntilBirthday === null
                          ? 'Calcul en cours...'
                          : daysUntilBirthday === 0
                            ? "C'est aujourd'hui !"
                            : `${daysUntilBirthday} jour${daysUntilBirthday === 1 ? '' : 's'} restant${daysUntilBirthday === 1 ? '' : 's'}`}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUpDiv>
            </aside>

            {/* Zone de Contenu - Triée par Catégories */}
            <section className='lg:col-span-8 space-y-20'>
              
              {/* Section 01 : Data & Stats */}
              <div className='space-y-8'>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-white'>À propos de moi</h3>
                </div>
                <ScrollReveal>
                  <FadeUpDiv className='holo-panel p-5 sm:p-8'>
                    <RobloxProfile userId={ROBLOX_USER_ID} />
                  </FadeUpDiv>
                </ScrollReveal>
              </div>

              {/* Section 02 : Statut En Direct */}
              <div className='space-y-8'>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-[0.3em] text-white'>Mon activité</h3>
                </div>
                <ScrollReveal>
                  <FadeUpDiv className='holo-panel p-5 sm:p-8'>
                    <RobloxStatus userId={ROBLOX_USER_ID} />
                  </FadeUpDiv>
                </ScrollReveal>
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

      <WelcomeMessage />

      {/* Footer */}
      <footer className='site-footer py-12 sm:py-20'>
        <div className='container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-[10px] text-gray-600 font-mono tracking-widest uppercase'>© 2026 Awaji Frost</p>
          <div className='flex flex-wrap justify-center gap-3 text-[10px] text-gray-500 font-mono uppercase tracking-widest'>
            <a href='/conditions' target='_blank' rel='noreferrer' className='legal-link px-3 py-2 transition-colors hover:text-white'>Conditions d&apos;utilisation</a>
            <a href='/confidentialite' target='_blank' rel='noreferrer' className='legal-link px-3 py-2 transition-colors hover:text-white'>Confidentialité</a>
          </div>
        </div>
      </footer>
    </main>
  );
}