'use client';

import { useEffect, useState } from 'react';

const welcomeCookie = 'frost_welcome_seen';

export function WelcomeMessage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!document.cookie.split('; ').some((cookie) => cookie.startsWith(`${welcomeCookie}=`))) {
      setVisible(true);
      document.cookie = `${welcomeCookie}=1; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
  }, []);

  if (!visible) return null;

  return (
    <div className='fixed bottom-6 left-6 right-6 z-[60] mx-auto flex max-w-xl items-center justify-between gap-4 bg-[#050505]/95 py-4 backdrop-blur-md'>
      <div>
        <p className='text-xs font-bold uppercase tracking-[0.25em] text-white'>Bienvenue chez Frost</p>
        <p className='mt-2 text-sm text-gray-400'>Bienvenue sur ma page personnelle. Découvre mon univers, mes jeux favoris et mes réseaux.</p>
      </div>
      <button type='button' onClick={() => setVisible(false)} className='shrink-0 rounded-lg border border-white/15 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-300 transition hover:border-white/40 hover:text-white'>Fermer</button>
    </div>
  );
}
